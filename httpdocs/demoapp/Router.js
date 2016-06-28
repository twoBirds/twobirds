/**
 @namespace demoapp
 */
tb.namespace( 'demoapp', true ).Router = (function(){

    /**
     @for demoapp.Router
     */

    /**
     Router constructor

     @class Router
     @constructor

     @param pConfig
     */
    var Router = function( pFunction ){
        // var
        var that = this,
            route = window.location.pathname;

        /**
         event handlers of this instance at creation time

         the object &lt;property name&gt; equals the event name you trigger, like

         @property handlers
         @type object

         @example

         handlers = { &lt;event name&gt;: &lt;function name&gt; }

         @example

         &lt;instance&gt;.trigger( &lt;event name&gt;, &lt;event data&gt;, &lt;bubble&gt; );

         */
        that.handlers = {
            init: init
        };

        that.setRoute = pFunction || setRoute; // overloads setRoute function if given
    };

    Router.prototype = {

        /**
         used to identify instance(s) via tb( /&lt;string&gt;/ )

         @property namespace
         @type string
         @static
         */
        namespace: 'demoapp.Router',

        /**
         @method setRoute
         */
        setRoute: setRoute,

        /**
         @method getParams
         */
        getParams: getParams

    };

    return Router;

    // VARIABLES

    // PRIVATE FUNCTIONS

    /**
     init handler

     @event init
     @param e
     */
    function init( e ){
    }

    /**
     setroute method

     @param pRoute {string} the route to set -> url
     */
    function setRoute( pRoute ){
        console.log( 'no rooting function given' );
    }

    /**
     getParams method, extracts path elements and get parameters from url
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

        params.anchor = anchor;

        return params;
    }

})();

