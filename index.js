'use strict';

const STORE = {
  items: [
    { name: 'apples',  checked: false, editable: false },
    { name: 'oranges', checked: false, editable: false },
    { name: 'milk',    checked: true,  editable: false  },
    { name: 'bread',   checked: false, editable: false },
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
 * Set an item in the store to be editable
 */
const editItem = function (itemIndex) {

  STORE.items[itemIndex].editable = true;
};

/**
 * Update an item in the store
 */
const updateItem = function (itemIndex, name) {

  STORE.items[itemIndex].name     = name;
  STORE.items[itemIndex].editable = false;
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

  // On add item form submit
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

  // On edit button click
  $('.js-shopping-list').on('click', '.js-item-edit', e => {

    const itemIndex = getItemIndexFromElement(e.currentTarget);

    editItem(itemIndex);

    renderShoppingList();
  });

  // On editable focusout or enter key pressed
  $('.js-shopping-list').on('focusout keyup', '.js-item-input', e => {

    if (e.type === 'keyup' && e.which !== 13) {
      return;
    }

    const itemIndex = getItemIndexFromElement(e.currentTarget);

    updateItem(itemIndex, $(e.target).val());

    renderShoppingList();
  });

  // On save button clicked
  $('.js-shopping-list').on('click', '.js-item-save', e => {

    if (e.type === 'keyup' && e.which !== 13) {
      return;
    }

    const itemIndex = getItemIndexFromElement(e.currentTarget);

    updateItem(itemIndex, $(e.target).val());

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



  const nameWithHighlights = item.name.replace(
    new RegExp(STORE.filters.searchTerm, 'g'),
    `<span class="js-search-term-highlight">${STORE.filters.searchTerm}</span>`
  );

  // Start item
  let html = `<li class="js-item-index-element" data-item-index="${index}">`;

  // Item name
  if (item.editable) {
    html += `<input type="text" class="shopping-item-input js-item-input" value="${nameWithHighlights}">`;
  } else {
    html += `<span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${nameWithHighlights}</span>`;
  }

  // Save button
  if (item.editable) {
    html += `<button class="shopping-item-save js-item-save">
               <span class="button-label">save</span>
            </button>`;
  } else {
    html += '';
  }

  // Start item controls
  html += '<div class="shopping-item-controls">';

  // Check button
  html += `<button class="shopping-item-toggle js-item-toggle" ${item.editable ? 'disabled' : ''}>
            <span class="button-label">check</span>
          </button>`;

  // Edit button
  html += `<button class="shopping-item-edit js-item-edit" ${item.editable ? 'disabled' : ''}>
             <span class="button-label">edit</span>
          </button>`;

  // Delete button
  html += `<button class="shopping-item-delete js-item-delete" ${item.editable ? 'disabled' : ''}>
             <span class="button-label">delete</span>
          </button>`;

  // End item controls
  html += '</div>';

  // End item
  html += '</li>';

  return html;
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
