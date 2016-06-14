/**
 * @namespace demoapp
 */
tb.namespace( 'demoapp', true ).Body = (function(){

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
        namespace: 'demoapp.Body',

        /**
         * handles requirement loading, an array containing file name strings
         *
         * @property tb.require
         * @type array
         * @static
         */
        'tb.require': [
            '/demoapp/Body.css'
        ],

        /**
         * @method render
         */
        render: render

    };

    return Body;

    // VARIABLES
    var messages = {
    };

    // PRIVATE FUNCTIONS
    /**
     * @for demoapp.Body
     */

    /**
     * init handler
     *
     * @event init
     * @param e
     */
    function init( e ){
        console.log( 'body init()' );
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
            'demoapp.Header',
            {},
            $('<div />').appendTo(that.target)
        );

        // inner content area
        $( '<div class="demoapp-body-content"/>').appendTo(that.target);

        // lower footer area
        new tb(
            'demoapp.Footer',
            {},
            $('<div />').appendTo(that.target)
        );

    }

})();

