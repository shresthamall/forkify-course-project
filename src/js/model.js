import { API_URL } from './config';
import { RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    createRecipeObject(data);
    const { recipe } = data.data;
    // Bookmark check
    //   if(recipe.id === id&& recipe.bookmarked)
    // console.log(state);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&?key=${KEY}`);
    console.log(data);
    state.search.query ??= query;
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (newServings / state.recipe.servings) * ingredient.quantity;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  // Remove bookmark
  state.bookmarks.splice(index);

  // Mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

export const uploadRecipe = async function (newRawRecipe) {
  try {
    // Build ingredients object
    const ingredients = Object.entries(newRawRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(entry => {
        console.log(entry);
        if (entry[1].split(',').length !== 3)
          throw new Error('Please use the right format for ingredients');
        const [quantity, unit, description] = entry[1]
          .split(',')
          .map(el => el.trim());
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const newRecipe = {
      title: newRawRecipe.title,
      source_url: newRawRecipe.sourceUrl,
      image_url: newRawRecipe.image,
      publisher: newRawRecipe.publisher,
      cooking_time: +newRawRecipe.cookingTime,
      servings: +newRawRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, newRecipe);
    console.log(data);
    createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
  console.log(state.bookmarks);
};

init();

// newRawRecipe:
/* 
{title: 'TEST', 
sourceUrl: 'TEST', 
image: 'TEST', 
publisher: 'TEST', 
cookingTime: '23', …}
cookingTime: "23"
image: "TEST"
ingredient-1: "0.5,kg,Rice"
ingredient-2: "1,,Avocado"
ingredient-3: ",,salt"
ingredient-4: ""
ingredient-5: ""
ingredient-6: ""
publisher: "TEST"
servings: "23"
sourceUrl: "TEST"
title: "TEST"
[[Prototype]]: Object
*/
