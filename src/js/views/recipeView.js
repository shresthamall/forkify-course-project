import View from './View.js';
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _ingredientsListElement;
  _recipeServingsElement;
  _servingsDecBtn;
  _servingsIncBtn;
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  //   // Update function: Overwrites View.update()
  //   update(data) {
  //     this._data = data;
  //     // Initialise element variables
  //     this._initElements();
  //     console.log(
  //       this._data,
  //       this._recipeServingsElement,
  //       this._ingredientsListElement
  //     );
  //     // Update DOM view
  //     this._updateView();
  //   }

  // Publisher Subscriber pattern - Add event listeners to Recipe Container
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(evt =>
      window.addEventListener(evt, handler)
    );
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (evt) {
      const btn = evt.target.closest('.btn--update-servings');
      if (!btn) return;
      const { updateTo } = btn.dataset;
      if (updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (evt) {
      const btn = evt.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  // Generate markup html for the recipe view in UI
  _generateMarkup() {
    const markup = `
        <figure class="recipe__fig">
                <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
                <h1 class="recipe__title">
                  <span>${this._data.title}</span>
                </h1>
              </figure>
      
              <div class="recipe__details">
                <div class="recipe__info">
                  <svg class="recipe__info-icon">
                    <use href="${icons}#icon-clock"></use>
                  </svg>
                  <span class="recipe__info-data recipe__info-data--minutes">${
                    this._data.cookingTime
                  }</span>
                  <span class="recipe__info-text">minutes</span>
                </div>
                <div class="recipe__info">
                  <svg class="recipe__info-icon">
                    <use href="${icons}#icon-users"></use>
                  </svg>
                  <span class="recipe__info-data recipe__info-data--people">${
                    this._data.servings
                  }</span>
                  <span class="recipe__info-text">servings</span>
      
                  <div class="recipe__info-buttons">
                    <button class="btn--tiny btn--update-servings btn--update-servings-dec" data-update-to="${
                      this._data.servings - 1
                    }">
                      <svg>
                        <use href="${icons}#icon-minus-circle"></use>
                      </svg>
                    </button>
                    <button class="btn--tiny btn--update-servings btn--update-servings-inc" data-update-to="${
                      this._data.servings + 1
                    }">
                      <svg>
                        <use href="${icons}#icon-plus-circle"></use>
                      </svg>
                    </button>
                  </div>
                </div>
      
                <div class="recipe__user-generated ${
                  this._data.key ? '' : 'hidden'
                }">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
                <button class="btn--round btn--bookmark">
                  <svg class="">
                    <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
                  </svg>
                </button>
              </div>
      
              <div class="recipe__ingredients">
                <h2 class="heading--2">Recipe ingredients</h2>
                <ul class="recipe__ingredient-list">
                  ${this._generateMarkupIngredient()}
                </ul>
              </div>
      
              <div class="recipe__directions">
                <h2 class="heading--2">How to cook it</h2>
                <p class="recipe__directions-text">
                  This recipe was carefully designed and tested by
                  <span class="recipe__publisher">${
                    this._data.publisher
                  }</span>. Please check out
                  directions at their website.
                </p>
                <a
                  class="btn--small recipe__btn"
                  href="${this._data.sourceUrl}"
                  target="_blank"
                >
                  <span>Directions</span>
                  <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                  </svg>
                </a>
              </div>
      `;

    return markup;
  }

  // Computes markup html from an array of ingredients provided
  _generateMarkupIngredient() {
    return this._data.ingredients
      .map(
        ingredient =>
          `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ingredient.quantity
            ? new Fraction(ingredient?.quantity).toString()
            : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ingredient.unit}</span>
          ${ingredient.description}
        </div>
      </li>
      `
      )
      .join('');
  }
  _initElements() {
    this._ingredientsListElement = document.querySelector(
      '.recipe__ingredient-list'
    );
    this._recipeServingsElement = document.querySelector(
      '.recipe__info-data--people'
    );
    this._servingsDecBtn = document.querySelector('.btn--update-servings-dec');
    this._servingsIncBtn = document.querySelector('.btn--update-servings-inc');
  }
  _updateView() {
    const markup = this._generateMarkupIngredient();
    this._ingredientsListElement.innerHTML = '';
    this._ingredientsListElement.insertAdjacentHTML('afterbegin', markup);
    this._recipeServingsElement.textContent = `${this._data.servings}`;
    this._servingsDecBtn.dataset.updateTo = this._data.servings - 1;
    this._servingsIncBtn.dataset.updateTo = this._data.servings + 1;
  }
}

export default new RecipeView();
