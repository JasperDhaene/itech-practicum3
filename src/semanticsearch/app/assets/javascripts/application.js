//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require skeleton-extras/skeleton-extras
//= require knockout/knockout
//= require_tree .

$(document).ready(function() {

  var FADE_DELAY = 200;
  var SCROLL_DELAY = 600;

  /**
   * Page elements
   *
   * */

  /* Overlay handling */
  $('#overlay-and-button').click(function(ev) {
    ev.preventDefault();
    document.viewModel.operator('AND');
    $('#overlay-dialog').fadeOut(FADE_DELAY);
  });
  $('#overlay-or-button').click(function(ev) {
    ev.preventDefault();
    document.viewModel.operator('OR');
    $('#overlay-dialog').fadeOut(FADE_DELAY);
  });
  $('#overlay-image').click(function(){
    if(e.target == this)
      $('#overlay-image').hide();
  });

  $(document).keyup(function(e) {
    if(e.keyCode == 27) $('.overlay').fadeOut(FADE_DELAY); // Esc
  });

  /**
   * Models
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

  var Result = function(result) {
    var self = this;

    self.uri = result.uri;
    self.title = result['dc:title'] || 'Untitled image';
    self.identifier = result['dc:identifier'];
  }

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

    // Observables
    self.operator = ko.observable('OR');
    self.searching = ko.observable(false);
    self.results = ko.observableArray();

    // Functions
    self.addFilter = function() {
      $('#overlay-dialog').fadeIn(FADE_DELAY);
      self.appliedFilters.push(new Filter('title'));
    };
    self.search = function() {
      self.searching(true);
      var params = [];
      params.push('operator=' + self.operator());
      $('.filter').each(function() {
        params.push(encodeURIComponent(
          $(this).find('[name="filter"] :selected').text().toLowerCase()
        ) + '=' + encodeURIComponent(
          $(this).find('[name="value"]').val().toLowerCase()
        ));
      });

      console.log('GET /query?' + params.join('&'));

      $.getJSON('/query?' + params.join('&'), function(data, status) {
        $.each(data.result, function(key, value) {
          self.results.push(new Result(value));
        });
        self.searching(false);
        $('html, body').animate({ scrollTop: $('.results').offset().top }, SCROLL_DELAY);
      });
    }
  };

  document.viewModel = new ViewModel();
  $('.overlay').hide();

  ko.applyBindings(document.viewModel);

  // Sample result
  $('#image-link').click(function() {
    var uri = $(this).children('img').attr('src');
    $('#overlay-image').find('a').attr('href', uri).find('img').attr('src', uri);
    $('#overlay-image').fadeIn(200);
  });

});
