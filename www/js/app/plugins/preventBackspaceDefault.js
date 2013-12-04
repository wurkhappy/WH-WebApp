/*
 * Prevent BackSpace Plugin
 *
 * Prevents default backspace behavior in browser(going to the previous page)
 *
 */

define(['jquery'],function ($) {

    'use strict';
    var preventBackspaceDefault = function() {

        // Prevent the backspace key from navigating back.
        // This should be another plugin and it should be in the whole website.
        $(document).unbind('keydown').bind('keydown', function (event) {
            var doPrevent = false;
            if (event.keyCode === 8) {
                var d = event.srcElement || event.target;
                if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD' || d.type.toUpperCase() === 'FILE')) 
                     || d.tagName.toUpperCase() === 'TEXTAREA') {
                    doPrevent = d.readOnly || d.disabled;
                }
                else {
                    doPrevent = true;
                }
            }

            if (doPrevent) {
                event.preventDefault();
            }
        });
    
    };
    
return preventBackspaceDefault;

});


