"use strict";

let _                = require('lodash');
let $                = require('jquery');
let Backbone         = require('backbone');
let Display          = require('../models/display');
let DisplayView      = require('./displayview');
let ListView         = require('./listview');
let PreviewView      = require('./previewview');
let SourceCollection = require('../collections/sourcecollection');
let rmAccents        = require('../rm_accents');

require('../lib/jquery.autocomplete');
require('../lib/mousetrap');

let MainView = Backbone.View.extend({

  el: '#app',

  events: {
    'click button.publish': 'publish'
  },

  template: _.template(`
    <div class="column is-one-quarter hero" id="sources-panel">
      <div id="sources-search">
        <div class="control has-icons-left">
          <input class="input" type="text" placeholder="Recherche (ALT+R) ...">
          <span class="icon is-left">
            <i class="fas fa-search"></i>
          </span>
        </div>
      </div>
      <div class="is-hidden-mobile" id="sources-list"></div>
    </div>
    <div class="column" id="test"></div>
    <div class="column" id="display"></div>
  `),

  initialize: function () {
    this.$el.html(this.template())

    this.display = new Display()
    this.display.fetch()

    this.sources = new SourceCollection()
    this.sources.fetch()

    this.testView = new PreviewView({
      el: '#test',
      display: this.display 
    })

    this.displayView = new DisplayView({
      el: '#display',
      display: this.display 
    })

    this.listView = new ListView({
      el: 'div#sources-list',
      collection: this.sources
    })

    this.$input = this.$('input[type=text]')
    this.$input.val('').autocomplete({
      lookup: _.bind(this._acLookup, this),
      formatResult: _.bind(this._acFormatResult, this),
      onSelect: _.bind(this._acOnSelect, this)
    })
    Mousetrap.bind('alt+r', _.bind(function () {
      this.$input.focus().select()
    }, this))

    this.listenTo(this.listView, 'activated', this._onSourceActivated);
    $(window).on('resize.' + this.cid, _.bind(this.updateSize, this))
  },

  remove: function () {
    Backbone.View.prototype.remove.apply(this, arguments)

    $(window).off('resize.' + this.cid)
    return this
  },

  render: function () {
    this.testView.render()
    this.displayView.render()
    this.listView.render()
    this.updateSize()
    return this
  },

  publish: function () {
    this.displayView.setSource(this.testView.source,
      {page: this.testView.currentPage});
  },

  updateSize: function () {
    var views    = $([this.testView.el, this.displayView.el]);
    var padding  = views.outerHeight() - views.height();
    var height   = $(window).height() - $('#sources-panel').height() - padding * 3;
    var isMobile = ($(window).width() <= 768);

    if (isMobile) views.height(height / 2);
    else views.height('auto');
  },

  _acLookup: function (query, done) {
    var suggestions = []

    query = rmAccents(query).toLowerCase()
    this.sources
      .filter(function (source) {
        return !source.get('isDir') && source.get('formats').length > 0;
      })
      .forEach(function (source) {
        var name = source.get('name')

        if (rmAccents(name).toLowerCase().includes(query))
          suggestions.push({value: name, data: source})
      })
    done({suggestions: suggestions})
  },

  _acFormatResult: function (suggestion, query) {
    if (!query) {
      return suggestion.value
    } else {
      var query = rmAccents(query).toLowerCase()
      var value = rmAccents(suggestion.value).toLowerCase()
      var part  = suggestion.value.substr(value.indexOf(query), query.length)
      return suggestion.value.replace(part, '<strong>' + part + '</strong>')
    }
  },

  _acOnSelect: function (suggestion) {
    this.testView.setSource(suggestion.data)
    this.$input.val('')
  },

  _onSourceActivated: function (source) {
    if (source == '..' || source.get('isDir')) {
      this.sources.moveTo(source);
      this.testView.setSource(null);
      this.displayView.setSource(null);
    } else if (source.get('formats').length > 0) {
      this.testView.setSource(source);
    }
  },

})

module.exports = MainView
