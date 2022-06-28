import $ from 'jquery';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="map"></div>';

    $('#qunit-fixture').html(markup);
});

(function() {

    require('./mapParts/commonTests.js');
    require('./mapParts/googleStaticTests.js');
    require('./mapParts/googleTests.js');
    require('./mapParts/bingTests.js');
})();

