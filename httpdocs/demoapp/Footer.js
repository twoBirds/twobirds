/**
 * @namespace demoapp
 */
tb.namespace( 'demoapp', true ).Footer = (function(){

    /**
     * Footer constructor
     *
     * @class Footer
     * @constructor
     *
     * @param pConfig
     */

    function Footer( pConfig ){

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

    }

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

    // VARIABLES

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
        that.content = that
            .target
            .appendChild( document.createElement("div") );

        that.setContent( 'test footer' );

        tb.dom( that.content )
            .addClass( 'demoapp-footer-content' );

    }

    /**
     * setContent function, used as a method
     *
     * @param [$pContentHTML] {string} - the content inner HTML
     */
    function setContent( pContentHTML ){

        var that = this;

        console.log( 'footer setContent() method' )
        // set footer content
        that.content.innerHTML = !!pContentHTML ? pContentHTML : '';

    }

})();

