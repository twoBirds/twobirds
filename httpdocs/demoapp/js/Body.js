/**
 * Intranet 3
 * Copyright (c) 2012- gyselroth™  (http://www.gyselroth.net)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License,
 * or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * @category    intranet
 * @package     intranet
 * @author      Frank Thürigen <thuerigen@gyselroth.com>
 * @copyright   Copyright (c) 2012- gyselroth™  (http://www.gyselroth.net)
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPLv3
 * @version     $Id:$
 */

/**
 * @namespace in3
 */
tb.namespace( 'in3', true ).Body = (function(){

    // VARIABLES

    var messages = {
    };

    // PRIVATE FUNCTIONS
    /**
     * @for in3.Body
     */

    /**
     * init handler
     *
     * @event init
     * @param e
     */
    function init( e ){
        this.render();
    }

    /**
     * render function, both used in handlers and as a method
     *
     * @event render
     */
    function render(){

        var that = this;

        // top blue bar
        new tb(
            'in3.Header',
            that.config.class,
            $( '<div />').appendTo(that.target)
        );

        // inner content area
        $( '<div class="in2-body-content"/>').appendTo(that.target);

        // lower footer area
        new tb(
            'in3.Footer',
            that.config.scope,
            $( '<div />').appendTo(that.target)
        );

    }

    /**
     * body constructor
     *
     * @class Body
     * @constructor
     *
     * @param pConfig
     */

    var Body = function( pConfig ){

        // var
        var that = this; // for minification purposes

        /**
         * event handlers of this instance at creation time
         *
         * the object &lt;property name&gt; equals the event name you trigger, like
         *
         * @example handlers = { &lt;event name&gt;: &lt;function name&gt; }
         *
         * @example &lt;instance&gt;.trigger( &lt;event name&gt;, &lt;event data&gt;, &lt;bubble&gt; );

         * @property handlers
         * @type object
         */
        that.handlers = {
            init: init,
            render: render
        }


    };

    Body.prototype = {

        /**
         * used to identify instance(s) via tb( /&lt;string&gt;/ )
         *
         * @property namespace
         * @type string
         * @static
         */
        namespace: 'in3.Body',

        /**
         * handles requirement loading, an array containing file name strings
         *
         * @property tb.require
         * @type array
         * @static
         */
        'tb.require': [
            '/namespace/in3/css/Body.css'
        ],

        /**
         * @method render
         */
        render: render

    };

    return Body;

})();

