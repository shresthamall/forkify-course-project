import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1 and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return this._generateMarkupBtn('next', this._data.page);
    }

    // Last page
    if (this._data.page === numPages && numPages > 1) {
      return this._generateMarkupBtn('prev', this._data.page);
    }

    // Other pages
    if (this._data.page > 1 && this._data.page < numPages) {
      return `
          ${this._generateMarkupBtn('prev', this._data.page)}
          ${this._generateMarkupBtn('next', this._data.page)}
        `;
    }

    // Page 1 and there are no other pages
    return '';
  }

  // Create markup for previous or next button, receives current page
  _generateMarkupBtn(position, currPage) {
    return `
        <button data-goto = "${
          position === 'prev' ? currPage - 1 : currPage + 1
        }" class="btn--inline pagination__btn--${position}">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${
      position === 'prev' ? 'left' : 'right'
    }"></use>
            </svg>
            <span>Page ${
              position === 'prev' ? currPage - 1 : currPage + 1
            }</span>
    `;
  }
  // Publisher Subscriber Pattern
  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (evt) {
      //   evt.preventDefault();
      // Get the target button
      const btn = evt.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset?.goto;
      if (!goToPage) return;
      handler(goToPage);
    });
  }
  removeBtns() {
    this._parentElement.innerHTML = '';
  }
}

export default new PaginationView();
