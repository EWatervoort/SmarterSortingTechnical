const knex = require("../db/connection");

function createProduct(product) {
  return knex("products")
    .insert({ product_name: product })
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function createIngredient(ingredient) {
  return knex("ingredients")
    .insert(ingredient)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}
function createRelation(ids) {
  return knex("ingredients_products")
    .insert(ids)
    .returning("*")
}

function list() {
  return knex("products as p")
    .join("ingredients_products as ip", "p.product_id", "ip.product_id")
    .join("ingredients as i", "ip.ingredient_id", "i.ingredient_id")
    .select("p.*", "i.*");
}

function listByIngredient(ingredient) {
  return knex("products as p")
    .join("ingredients_products as ip", "p.product_id", "ip.product_id")
    .join("ingredients as i", "ip.ingredient_id", "i.ingredient_id")
    .select("p.product_name")
    .where({ "i.ingredient_name": ingredient });
}

function readIngredient(ingredient_name) {
  return knex("ingredients")
    .select("ingredient_id")
    .where({ ingredient_name: ingredient_name })
    .first();
}

function readProduct(product_name) {
  return knex("products")
    .select("product_id")
    .where({ product_name: product_name })
    .first();
}

module.exports = {
  createProduct,
  createIngredient,
  createRelation,
  list,
  listByIngredient,
  readIngredient,
  readProduct,
};
