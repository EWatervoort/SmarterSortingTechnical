const ingredients = require("./01-ingredients.json");
exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE ingredients RESTART IDENTITY CASCADE")
    .then(function() {
      return knex("ingredients").insert(ingredients);
    });
};