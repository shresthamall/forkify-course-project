import View from './View';

class SearchView extends View {
  _parentElement = document.querySelector('.search');

  // Get Query string entered by user
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  // Publisher Subscriber Pattern
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
