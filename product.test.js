const request = require("supertest")

const app = require("./app")
const knex = require("./src/db/connection")

describe("Product Routes", () => {
  beforeAll(() => {
    return knex.migrate
      .forceFreeMigrationsLock()
      .then(() => knex.migrate.rollback(null, true))
      .then(() => knex.migrate.latest());
  });

  beforeEach(() => {
    return knex.seed.run();
  });

  afterAll(async () => {
    return await knex.migrate.rollback(null, true).then(() => knex.destroy());
  });

  it("GET / should return a list of products and their ingredients.", async () => {
    const response = await request(app).get("/")

    expect(response.body.results).toHaveLength(4);
    expect(response.body.results[0]).toEqual(
      expect.objectContaining({
        "product_name": expect.any(String),
        "ingredients": expect.any(Array)
      })
    )
  })

  it("POST / Creates a product", async () => {
    const data = {
      "product_name": "Orange Juice",
      "ingredients": ["Water", "Oranges"],
    }
    const response = await request(app)
      .post("/")
      .send(data)
    expect(response.body.data).toHaveLength(2);
  })

  it("Returns 400 if product_name is missing", async () => {
    const data = {
      "ingredients" : ["Water", "Oranges"],
    }
    const response = await request(app)
      .post("/")
      .send(data)
    expect(response.status).toBe(400);
  })

  it("Returns 400 if ingredients is missing", async () => {
    const data = {
      "product_nane" : "Orange Juice",
    }
    const response = await request(app)
      .post("/")
      .send(data)

    expect(response.status).toBe(400);
  })

  it("Returns 400 if ingredients doesnt include at least one ingredient", async () => {
    const data = {
      "product_name": "Orange Juice",
      "ingredients": [],
    }
    const response = await request(app)
      .post("/")
      .send(data)

    expect(response.status).toBe(400);
  })

  it("GET /:ingredient_name returns all products containing the ingredient", async () => {
    const response = await request(app).get("/Water")
    expect(response.body).toHaveLength(2);
  })

})