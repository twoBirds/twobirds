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
tb.namespace( 'demoapp', true ).Footer = (function(){

    // VARIABLES

    var messages = {
    };

    // PRIVATE FUNCTIONS
    /**
     * @for demoapp.Footer
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

        // create footer content DIV
        that.$content = $( '<div class="demoapp-footer-content">test footer</div>').appendTo(that.target);

    }

    /**
     * setContent function, used as a method
     *
     * @param [$pContentElements] {jQuery} jQuery content object(s)
     */
    function setContent( $pContentElements ){

        var that = this;

        // set footer content
        $( '.demoapp-footer-content' )
            .empty()
            .append( $pContentElements );

    }

    /**
     * Footer constructor
     *
     * @class Footer
     * @constructor
     *
     * @param pConfig
     */

    var Footer = function( pConfig ){

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

    Footer.prototype = {

        /**
         * used to identify instance(s) via tb( /&lt;string&gt;/ )
         *
         * @property namespace
         * @type string
         * @static
         */
        namespace: 'demoapp.Footer',

        /**
         * handles requirement loading, an array containing file name strings
         *
         * @property tb.require
         * @type array
         * @static
         */
        'tb.require': [
            '/demoapp/Footer.css'
        ],

        /**
         * @method render
         */
        render: render,

        /**
         * @method setContent
         */
        setContent: setContent

    };

    return Footer;

})();

