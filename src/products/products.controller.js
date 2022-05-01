const service = require("./products.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// Chack that the data recieved has all of the needed properties
const hasRequiredProperties = hasProperties("product_name", "ingredients");

// Add the product name to the products table
async function createProduct(req, res, next) {
  const data = await service.createProduct(req.body.product_name);
  return next();
}

// Add the ingredients to the ingredients table
async function createIngredient(req, res, next) {
  const ingredientsToAdd = res.locals.ingredientsToAdd;
  if (ingredientsToAdd.length !== 0) {
    const data = await service.createIngredient(ingredientsToAdd);
    return next();
  } else {
    return next();
  }
}

// Add all the ingredient-product relations to the ingredient_product table
async function createRelation(req, res, next) {
  const ids = res.locals.ids;
  const data = await service.createRelation(ids);
  res.status(201).json({ data });
}

// Check that ingredients has at least one item in it, and create a new array with only new ingredients.
async function newIngredients(req, res, next) {
  const ingredients = req.body.ingredients;
  if (ingredients.length === 0) {
    return next({
      status: 400,
      message: "Must include at least one ingredient",
    });
  }
  const ingredientsToAdd = [];
  for (ingredient of ingredients) {
    const data = await service.readIngredient(ingredient);
    if (!data) {
      ingredientsToAdd.push({ ingredient_name: ingredient });
    }
  }
  res.locals.ingredientsToAdd = ingredientsToAdd;
  return next();
}

// Get the ids of the new product and the ingredients in it
async function getIds(req, res, next) {
  const ingredients = req.body.ingredients;
  const product_id = await service.readProduct(req.body.product_name);
  const ids = [];
  for (ingredient of ingredients) {
    const ingredient_id = await service.readIngredient(ingredient);
    ids.push({
      ingredient_id: ingredient_id.ingredient_id,
      product_id: product_id.product_id,
    });
  }
  res.locals.ids = ids;
  return next();
}

// List all of the products with their ingredients
async function list(req, res, next) {
  const data = await service.list();
  const results = [];
  data.forEach((item) => {
    const entry = results.find(
      (product) => product.product_name === item.product_name
    );
    if (!entry) {
      results.push({
        product_name: item.product_name,
        ingredients: [item.ingredient_name],
      });
    } else {
      entry.ingredients.push(item.ingredient_name);
    }
  });
  res.json({ results });
}

// Check if the ingredient exists
async function ingredientExists(req, res, next) {
  const ingredient = await service.readIngredient(req.params.ingredient_name);
  if (ingredient) {
    return next();
  }
  next({ status: 404, message: "Ingredient cannot be found." });
}

// List all products that contain a certain ingredient
async function listByIngredient(req, res, next) {
  const data = await service.listByIngredient(req.params.ingredient_name);
  const products = data.map((item) => item.product_name);
  res.json(products);
}

module.exports = {
  create: [
    hasRequiredProperties,
    asyncErrorBoundary(createProduct),
    asyncErrorBoundary(newIngredients),
    asyncErrorBoundary(createIngredient),
    asyncErrorBoundary(getIds),
    asyncErrorBoundary(createRelation),
  ],
  list: [asyncErrorBoundary(list)],
  read: [
    asyncErrorBoundary(ingredientExists),
    asyncErrorBoundary(listByIngredient),
  ],
};
