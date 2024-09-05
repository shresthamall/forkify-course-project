import 'core-js/stable'; // Polyfill most ES6< features
import 'regenerator-runtime/runtime'; // Polyfill await async
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// #5ed6604591c37cdc054bc886
// if (module.hot) {
//   module.hot.accept();
// }
// Controller function for fetching a recipe | Get recipe from API | Async
const controlRecipes = async function () {
  // 1) Get the recipe
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Render Spinner
    recipeView.renderSpinner();
    // 0) Update results and bookmarks
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 1) Load recipe from API
    await model.loadRecipe(id);

    // 2) Render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// Controller function for fetching recipes from a user search query | Get all relevant recipes from API | Async
const controlSearchResults = async function () {
  try {
    // Render spinner on the results container
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Get recipes based on user search query
    await model.loadSearchResults(query);
    // 3) Render the recipes
    resultsView.render(model.getSearchResultsPage());
    // 4) Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {}
};

// Controller function for setting pagination buttons
const controlPaginationView = function (goToPage) {
  // 1) Render NEW recipes
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

// Controller for updating servings based on user input
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe (in view)
  recipeView.update(model.state.recipe);
};

// Controller for bookmarking a recipe
const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipeView
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Controller for rendering bookmarks from storage at page load
const controlBookmarksView = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Controller for add recipe
const controlAddRecipe = async function (newRawRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();
    //Upload recipe
    await model.uploadRecipe(newRawRecipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // Success message
    addRecipeView.renderMessage();
    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close modal window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

// Publisher Subscriber Pattern
const init = function () {
  bookmarksView.addHandlerBookmarksView(controlBookmarksView);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPaginationView);
  addRecipeView.addHandlerAddRecipe(controlAddRecipe);
};

init();
