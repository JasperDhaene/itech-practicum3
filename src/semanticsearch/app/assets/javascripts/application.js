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
    $('#overlay-dialog').fadeOut(200);
  });
  $('#overlay-or-button').click(function(ev) {
    ev.preventDefault();
    document.viewModel.operator('OR');
    $('#overlay-dialog').fadeOut(FADE_DELAY);
  });

  /**
   * Initialization
   *
   * */
  $('.overlay').hide();
  $('#overlay-image').click(function(){
    if(e.target == this)
      $('#overlay-image').hide();
  });

  $(document).keyup(function(e) {
    if(e.keyCode == 27) $('.overlay').fadeOut(FADE_DELAY); // Esc
  });

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
      $('#overlay-dialog').fadeIn(FADE_DELAY);
      self.appliedFilters.push(new Filter('title'));
    };
    self.search = function() {
      var params = [];
      params.push('operator=' + self.operator());
      $('.filter').each(function() {
        params.push(encodeURIComponent(
          $(this).find('[name="filter"] :selected').text().toLowerCase()
        ) + '=' + encodeURIComponent(
          $(this).find('[name="value"]').val().toLowerCase()
        ));
      });
      console.log('?' + params.join('&'));
    }
  };

  document.viewModel = new ViewModel();

  ko.applyBindings(document.viewModel);

  // Sample result
  $('#image-link').click(function() {
    var uri = $(this).children('img').attr('src');
    $('#overlay-image').find('a').attr('href', uri).find('img').attr('src', uri);
    $('#overlay-image').fadeIn(200);
  });

});
