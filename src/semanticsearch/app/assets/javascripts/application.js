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
  $('#overlay-image').click(function(ev){
    if(ev.target.nodeName == 'DIV')
      $('#overlay-image').fadeOut(FADE_DELAY);
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

    self.themes = ko.observableArray([
      { text: 'Animals', value: '<http://dbpedia.org/resource/Category:Animals>' },
      { text: 'People', value: '<http://dbpedia.org/resource/Category:People>' },
      { text: 'Architecture', value: '<http://dbpedia.org/resource/Category:Architecture>' },
      { text: 'Nature', value: '<http://dbpedia.org/resource/Category:Nature>' },
      { text: 'Politics', value: '<http://dbpedia.org/resource/Category:Politics>' },
      { text: 'Humor', value: '<http://dbpedia.org/resource/Category:Humor>' },
      { text: 'Culture', value: '<http://dbpedia.org/resource/Category:Culture>' },
      { text: 'News', value: '<http://dbpedia.org/resource/Category:News>' }]);

    self.title = ko.observable(title);
    self.value = ko.observable();
  };

  var Result = function(result) {
    var self = this;

    // Variables (do not have to be observable)
    self.result = result;

    // Functions
    self.fetch = function(property, fallback) {
      return (self.result[property] ? self.result[property] : fallback);
    };
    self.view = function() {
      $('#overlay-image').find('a').attr('href', self.fetch('uri'));
      $('#overlay-image').find('img').attr('src', self.fetch('uri'));
      $('#overlay-image').fadeIn(FADE_DELAY);
    };
    self.clean = function(property, fallback) {
      var prop = self.fetch(property, fallback);
      var clean = decodeURIComponent(prop.substr(prop.lastIndexOf('/') + 1));
      return clean.substr(clean.lastIndexOf(':') + 1).replace(/_/g, ' ');
    }
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

    self.appliedFilters = ko.observableArray();

    // Observables
    self.operator = ko.observable('OR');
    self.searching = ko.observable(false);
    self.results = ko.observableArray();

    // Functions
    self.addFilter = function() {
      self.appliedFilters.push(
        new Filter('title')
      );
      if(self.appliedFilters().length > 1)
        $('#overlay-dialog').fadeIn(FADE_DELAY);
    };
    self.search = function() {
      self.searching(true);
      var params = [];
      params.push('operator=' + self.operator());
      $('.filter').each(function() {
        params.push(encodeURIComponent(
          $(this).find('[name="filter"] :selected').text().toLowerCase().replace(/theme/, 'type')
        ) + '=' + encodeURIComponent(
          $(this).find('[name="value"]').val()
        ));
      });

      console.log('GET /query?' + params.join('&'));

      $.getJSON('/query?' + params.join('&'), function(data, status) {
        self.results.removeAll();
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
  $('html, body').animate({ scrollTop: 0 }, 0);

  ko.applyBindings(document.viewModel);

});
