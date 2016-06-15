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

    function Body( pConfig ){

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
        this.render();
    }

    /**
     * render function, both used in handlers and as a method
     *
     * @event render
     */
    function render(){

        var that = this,
            header;

        // header area
        new tb(
            'demoapp.Header',
            {},
            that.target.appendChild( document.createElement("div") )
        ).one( // execute only once
            'init', // when all requirements have loaded
            function setInitialHeader(){
                var that = this;

                that.setContent('Example Form');
            }
        );

        // inner content area
        that.content = that
            .target
            .appendChild( document.createElement("div") );

        that.content
            .innerHTML = 'test content';

        tb.dom( that.content )
            .addClass( 'demoapp-body-content' );

        // footer area
        new tb(
            'demoapp.Footer', // lazy loading!!!
            {},
            that.target.appendChild( document.createElement("div") )
        ).one( // deferred, execute only once
            'init', // when all requirements have loaded
            function setInitialFooter(){
                var that = this;

                that.setContent('- this will be overwritten, see in code below -');
            }
        ).on( // deferred, an example of how to map a prototype method to an event
            'setContent', // event name
            function setContentHandler( e ){ // associated function
                var that = this;

                that.setContent( e.data );
            }
        ).trigger( // deferred event triggering
            'setContent', // event name
            '- twoBirds -'
        );

    }

})();

