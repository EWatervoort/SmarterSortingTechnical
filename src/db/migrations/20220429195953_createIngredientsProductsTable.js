/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("ingredients_products", (table) => {
    table.integer("product_id").unsigned().notNullable();
    table
      .foreign("product_id")
      .references("product_id")
      .inTable("products")
      .onDelete("CASCADE");
    table.integer("ingredient_id").unsigned().notNullable();
    table
      .foreign("ingredient_id")
      .references("ingredient_id")
      .inTable("ingredients")
      .onDelete("CASCADE");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("ingredients_products")
};
