const ingredients_products = require("./02-ingredients_products.json");
exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE ingredients_products RESTART IDENTITY CASCADE")
    .then(function() {
      return knex("ingredients_products").insert(ingredients_products);
    });
};