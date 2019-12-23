let $ = require('jquery');

require('./foundation/foundation.core.js');
require('./foundation/foundation.util.box.js');
require('./foundation/foundation.util.keyboard.js');
require('./foundation/foundation.util.mediaQuery.js');
require('./foundation/foundation.util.motion.js');
require('./foundation/foundation.util.nest.js');
require('./foundation/foundation.util.timerAndImageLoader.js');
require('./foundation/foundation.util.touch.js');
require('./foundation/foundation.util.triggers.js');
require('./foundation/foundation.abide.js');
require('./foundation/foundation.accordion.js');
require('./foundation/foundation.accordionMenu.js');
require('./foundation/foundation.drilldown.js');
require('./foundation/foundation.dropdown.js');
require('./foundation/foundation.dropdownMenu.js');
require('./foundation/foundation.equalizer.js');
require('./foundation/foundation.interchange.js');
require('./foundation/foundation.magellan.js');
require('./foundation/foundation.offcanvas.js');
require('./foundation/foundation.orbit.js');
require('./foundation/foundation.responsiveMenu.js');
require('./foundation/foundation.responsiveToggle.js');
require('./foundation/foundation.reveal.js');
require('./foundation/foundation.slider.js');
require('./foundation/foundation.sticky.js');
require('./foundation/foundation.tabs.js');
require('./foundation/foundation.toggler.js');
require('./foundation/foundation.tooltip.js');

$(function () {
  $(document).foundation();
});