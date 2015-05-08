//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require skeleton-extras/skeleton-extras
//= require knockout/knockout
//= require_tree .

$(document).ready(function() {

  var FADE_DELAY = 200;

  /**
   * Page elements
   *
   * */
  $('.search-icon > a').click(function(ev) {
      ev.preventDefault();
      $('html, body').animate({ scrollTop: $(document).height() }, 600);
  });

  /* Overlay handling */
  $('#overlay-and-button').click(function(ev) {
    ev.preventDefault();
    document.viewModel.operator('AND');
    $('.overlay').fadeOut(200);
  });
  $('#overlay-or-button').click(function(ev) {
    ev.preventDefault();
    document.viewModel.operator('OR');
    $('.overlay').fadeOut(FADE_DELAY);
  });

  /**
   * Initialization
   *
   * */
  $('.overlay').hide();

  /**
   * Model
   *
   * */
  var Filter = function(title) {
    var self = this;

    self.themeTypes = ko.observableArray([
      'People',
      'Animals',
      'Architecture',
      'Nature',
      'Politics',
      'Humor',
      'Culture',
      'News']);

    self.title = ko.observable(title);
    self.value = ko.observable();
  };

  /**
   * ViewModel
   *
   * */
  var ViewModel = function() {
    var self = this;

    self.filterTypes = ko.observableArray([
    'Theme',
    'Description',
    'Title',
    'Subject',
    'Type',
    'Coverage',
    'Date',
    'Creator']);

    self.appliedFilters = ko.observableArray([
      new Filter('Theme')
    ]);

    self.operator = ko.observable('OR');
    self.addFilter = function() {
      $('.overlay').fadeIn(FADE_DELAY);
      self.appliedFilters.push(new Filter('title'));
    }
  };

  document.viewModel = new ViewModel();

  ko.applyBindings(document.viewModel);

});
