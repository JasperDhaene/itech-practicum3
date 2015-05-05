//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require skeleton-extras/skeleton-extras
//= require_tree .

$(document).ready(function() {

  // Display value is key, Dublin Core property is value
  var filters = {
    'Theme': 'theme',
    'Title': 'title',
    'Author': 'author',
    'Subject': 'subject'
  };

  var operator = 'WTF';

  $('.search-icon > a').click(function(ev) {
      ev.preventDefault();
      $('html, body').animate({ scrollTop: $(document).height() }, 600);
  });

  /* Overlay handling */
  $('#overlay-and-button').click(function(ev) {
    ev.preventDefault();
    operator = 'AND';
    $('.overlay').fadeOut(200);
    addFilter();
    initDropdown();
  });
  $('#overlay-or-button').click(function(ev) {
    ev.preventDefault();
    operator = 'OR';
    $('.overlay').fadeOut(200);
    addFilter();
    initDropdown();
  });

  var addFilterHandler = function(ev) {
    ev.preventDefault();
    $('.overlay').fadeIn(200);
  }

  var initDropdown = function() {
    Object.keys(filters).forEach(function(key) {
      $('.search-dropdown').append('<option value=' + filters[key] + '>' + key + '</option>');
    });
  };
  var template = $('#filter-template').html();
  var addButtonTemplate = $('#add-button-template').html();
  var addFilter = function() {
    $('#search-filter-container').append(template);
    // Show 'AND' or 'OR'
    $('.add-button-container').html(operator);
    // Add 'add' button to the last filter
    $('.add-button-container').last().html(addButtonTemplate).children('a').click(addFilterHandler);
  }

  /**
   * Initialization
   *
   * */
  addFilter();
  initDropdown();
  $('.overlay').hide();

});
