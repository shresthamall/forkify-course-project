import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    // Return markup if render is set to false
    if (!render) return markup;
    this._clear();
    this._insertMarkupParentElement('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Loop over both arrays above simultaneously.
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Updates changed text
      if (this._isSameElementText(newEl, curEl))
        curEl.textContent = newEl.textContent;

      // Updates changed Attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attribute =>
          curEl.setAttribute(attribute.name, attribute.value)
        );
    });
  }
  // Checks if both elements are the same, i.e. elements do not have child elements, and have the same text content
  _isSameElementText(newEl, curEl) {
    return (
      !newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''
    );
  }

  // Clear innerHTML for the this._parentElement
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Render spinner for the this._parentElement
  renderSpinner() {
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._clear();
    this._insertMarkupParentElement('afterbegin', markup);
  }

  // Render error message on UI
  renderError(message = this._errorMessage) {
    this._clear();
    const markup = `
    <div class="message">
        <div>
          <svg> 
          <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;
    this._insertMarkupParentElement('afterbegin', markup);
  }

  // Render message on UI
  renderMessage(message = this._message) {
    this._clear();
    const markup = `
    <div class="error">
        <div>
          <svg>
             <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p_>${message}</p_
      </div>
      `;
    this._insertMarkupParentElement('afterbegin', markup);
  }
  // Inserts HTML markup string in the specified position using Element.insertAdjecentHTML() on this._parentElement
  _insertMarkupParentElement(position, markup) {
    this._parentElement.insertAdjacentHTML(position, markup);
  }
}
