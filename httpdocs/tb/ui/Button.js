/**
 * @namespace tb.ui
 */
tb.namespace( 'tb.ui', true).Button = (function(){

    // VARIABLES
    var messages = {
    };

    // PRIVATE FUNCTIONS
    /**
     init handler

     @event init
     @param e
     */
    function init( e ){
        this.render();
    }

    /**
     render function, both used in handlers and as a method

     @event render
     */
    function render(){

        var that = this,
            config = that.config;

        $( that.target )
            .attr( that.config[ 'attr' ] || {} )
            .addClass( that.config[ 'class' ] || '' )
            .html( that.config[ 'html' ] || 'no content!' );
    }

    /**
     Button constructor

     @class Button
     @constructor

     @param pConfig
     */
    var Button = function( pConfig ){

        // var
        var that = this;

        that.config = pConfig;

        /**
         event handlers of this instance at creation time

         the object &lt;property name&gt; equals the event name you trigger, like

         @example

            handlers = { &lt;event name&gt;: &lt;function name&gt; }

         @example

            &lt;instance&gt;.trigger( &lt;event name&gt;, &lt;event data&gt;, &lt;bubble&gt; );

         @property handlers
         @type object
         */
        that.handlers = {
            init: init,
            render: render
        }

    };

    Button.prototype = {

        /**
         used to identify instance(s) via tb( /&lt;string&gt;/ )

         @property namespace
         @type string
         @static
         */
        namespace: 'tb.ui.Button',

        /**
         handles requirement loading, an array containing file name strings

         @property tb.require
         @type array
         @static
         */
        'tb.require': [
        ],

        /**
         @method render
         */
        render: render

    };

    return Button;

})();
