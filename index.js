'use strict';

const STORE = {
  items: [
    { name: 'apples',  checked: false },
    { name: 'oranges', checked: false },
    { name: 'milk',    checked: true  },
    { name: 'bread',   checked: false },
  ],
  filters: {
    searchTerm  : '',
    showChecked : true,
  },
};

/**
 * Create (append) a new item in the store
 */
const addItemToShoppingList = function (itemName) {

  STORE.items.push({ name: itemName, checked: false });
};

/**
 * Remove an item from the store
 */
const removeItemFromShoppingList = function (itemIndex) {

  STORE.items.splice(itemIndex, 1);
};

/**
 * Toggle an item's checked property in the store
 */
const toggleItemChecked = function (itemIndex) {

  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
};

/**
 * Get item index from DOM
 */
const getItemIndexFromElement = function (element) {

  const itemIndex = $(element)
    .closest('.js-item-index-element')
    .attr('data-item-index');

  return Number.parseInt(itemIndex, 10);
};

/**
 * Attach all event handlers
 */
const attachEventHandlers = function () {

  // On form submit
  $('#js-shopping-list-form').on('submit', (e) => {

    e.preventDefault();

    const input = $('.js-shopping-list-entry');

    addItemToShoppingList(input.val());

    input.val('');

    renderShoppingList();
  });

  // On search keyup
  $('#shopping-list-search-term').on('keyup', (e) => {

    STORE.filters.searchTerm = $(e.currentTarget).val();

    renderShoppingList();
  });

  // On show checked selected
  $('#shopping-list-show-checked').on('change', (e) => {

    STORE.filters.showChecked = $(e.currentTarget).is(':checked');

    renderShoppingList();
  });

  // On check button click
  $('.js-shopping-list').on('click', '.js-item-toggle', e => {

    const itemIndex = getItemIndexFromElement(e.currentTarget);

    toggleItemChecked(itemIndex);

    renderShoppingList();
  });

  // On delete button click
  $('.js-shopping-list').on('click', '.js-item-delete', e => {

    const itemIndex = getItemIndexFromElement(e.currentTarget);

    removeItemFromShoppingList(itemIndex);

    renderShoppingList();
  });
};

/**
 * Generate the HTML for a shopping list item
 */
const generateShoppingListItemElement = function (item, index) {

  return `
    <li class="js-item-index-element" data-item-index="${index}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
};

/**
 * Generate the HTML for the shopping list
 */
const generateShoppingListElement = function () {

  // apply filters

  const visible = STORE.items.filter((item) => {

    if (item.name.includes(STORE.filters.searchTerm) === false) {
      return false;
    }

    if (STORE.filters.showChecked === false && item.checked === true) {
      return false;
    }

    return true;
  });

  return visible.map(generateShoppingListItemElement).join('');
};

/**
 * Render the shopping list HTML
 */
const renderShoppingList = function () {

  const html = generateShoppingListElement();

  $('.js-shopping-list').html(html);
};

/**
 * Initialize App
 */
const main = function () {

  attachEventHandlers();
  renderShoppingList();
};

$(main);
