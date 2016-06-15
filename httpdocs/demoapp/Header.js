/**
 * @namespace demoapp
 */
tb.namespace( 'demoapp', true ).Header = (function(){

    /**
     * Header constructor
     *
     * @class Header
     * @constructor
     *
     * @param pConfig
     */

    var Header = function( pConfig ){

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
            init,
            render
        }


    };

    Header.prototype = {

        /**
         * used to identify instance(s) via tb( /&lt;string&gt;/ )
         *
         * @property namespace
         * @type string
         * @static
         */
        namespace: 'demoapp.Header',

        /**
         * handles requirement loading, an array containing file name strings
         *
         * @property tb.require
         * @type array
         * @static
         */
        'tb.require': [
            '/demoapp/Header.css'
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

    return Header;

    // VARIABLES

    // PRIVATE FUNCTIONS
    /**
     * @for demoapp.Header
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

        // create header content DIV
        that.content = that
            .target
            .appendChild( document.createElement("div") );

        that.content
            .innerHTML = 'test header';

        tb.dom( that.content )
            .addClass( 'demoapp-header-content' );
        
    }

    /**
     * setContent function, used as a method
     *
     * @param [$pContentHTML] {string} - the content inner HTML
     */
    function setContent( pContentHTML ){

        var that = this;

        // set footer content
        that.content.innerHTML = !!pContentHTML ? pContentHTML : '';

    }

})();

