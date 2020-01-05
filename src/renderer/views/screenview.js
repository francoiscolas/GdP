"use strict";

let _                = require('lodash');
let Backbone         = require('backbone');
let Display          = require('../models/display');
let SourceCollection = require('../collections/sourcecollection');

var ScreenView = Backbone.View.extend({

  el: '#app',

  settings: null,

  sources: null,

  initialize: function (options) {
    this.settings = new Display();
    this.settings.fetch();

    this.sources = new SourceCollection();
    this.sources.fetch();
    setInterval(_.bind(this.sources.fetch, this.sources), 5000);

    this.source = null;
    this.pdfpromise = null;

    this.listenTo(this.settings, 'change', this.render);
    this.listenTo(this.sources, 'add', this.render);
  },

  render: function () {
    let bgImage = this.settings.get('bgImage') || '';

    this.$el.html('<canvas></canvas>');
    this.$el.css('background-color', this.settings.get('bgColor'));
    this.$el.css('background-image', `url("${bgImage}")`);

    if (this.settings.has('sourceId')) {
      this.source = this.sources.get(this.settings.get('sourceId'));

      if (this.source && !this.pdfpromise) {
        this.pdfpromise = this.source.getPdfPage(this.settings.get('sourcePage'));
        this.pdfpromise.then(function (pdfpage) {
          this.pdfpromise = null;

          let viewport = pdfpage.getViewport({scale: 1});
          let canvas = this.$('canvas').get(0);

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          pdfpage.render({
            canvasContext: canvas.getContext('2d'),
            background: this.settings.get('bgColor'),
            viewport: viewport,
          });
        }.bind(this));
      }
    }
  },

});

module.exports = ScreenView;
