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

// EVIL GLOBAL VARS but necessary in current environment
var baseUrl = !!baseUrl ? baseUrl : '/',
    school = !!school ? school : '';


/**
 * @namespace in3
 */
tb.namespace( 'in3', true ).Router = (function(){

    // VARIABLES

    var messages = {
    };

    // PRIVATE FUNCTIONS
    /**
     * @for in3.Router
     */

    /**
     * init handler
     *
     * @event init
     * @param e
     */
    function init( e ){
    }

    /**
     * setroute method
     *
     * @param pRoute {string} the route to set -> url
     */
    function setRoute( pRoute ){
        console.log( 'no rooting function given' );
    }

    /**
     * getParams method, extracts path elements and get parameters from url
     */
    function getParams( pRoute ){

        var route = pRoute || window.location.pathname,
            route = route.substr( 0, baseUrl.length ) === baseUrl     // cut out baseurl
                ? route.substr( baseUrl.length )
                : route.substr( 1 ),
            href = window.location.href,
            getString = href.split('?').length > 1 ? href.split('?')[1] : '',
            getStringElements = getString.split( '&' );
            pathWithoutAnchor = route.split('?')[0].split('#')[0],
            anchor = window.location.hash ? window.location.hash.substr(1).split('?')[0] : '',
            params = {};

        // get path elements
        params.path = pathWithoutAnchor.split('/');

        // get GET parameters
        params.get = {};

        $.map(
            getStringElements,

            function( value, key ){

                var kvPair = value.split('='),
                    varName = kvPair[0],
                    varValue = kvPair[1];

                params.get[varName] = varValue;

            }
        );

        // if in2 context, not prototype -> set global school variable if not present
        if ( !school && href.indexOf( '.html' ) === -1 ){
            school = params.path[0];
        }

        params.anchor = anchor;

        return params;
    }

    /**
     * Router constructor
     *
     * @class Router
     * @constructor
     *
     * @param pConfig
     */

    var Router = function( pFunction ){
        // var
        var that = this,
            route = window.location.pathname;

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
            init: init
        };

        that.setRoute = pFunction || setRoute; // overloads setRoute function if given
    };

    Router.prototype = {

        /**
         * used to identify instance(s) via tb( /&lt;string&gt;/ )
         *
         * @property namespace
         * @type string
         * @static
         */
        namespace: 'in3.Router',

        /**
         * @method setRoute
         */
        setRoute: setRoute,

        /**
         * @method getParams
         */
        getParams: getParams

    };

    return Router;

})();

