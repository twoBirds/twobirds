/**
 * @namespace tb.ui
 */
tb.namespace( 'tb.ui', true ).Select = (function(){

    // VARIABLES
    var messages = {
    };

    // PRIVATE FUNCTIONS
    /**
     * @for tb.ui.Select
     */

    /**
     * init handler
     *
     * @event init
     * @param e
     */
    function init( e ){
        var that = this;

        if ( that.config.model ){
            that.config.model.data.observe(
                function( pData ){
                    that.render( pData );
                }
            );
            that.config.model.read();
        } else {
            // @todo: error checking
            that.render( that.config['data'] || [] );
        }
    }

    /**
     * render function, both used in handlers and as a method
     *
     * @event render
     */
    function render( pData ){

        var that = this,
            config = that.config,
            data = pData || that.config.data;
            // either data is send as config parameter or it is hardcoded in the configuration

        //console.log( that.target );

        $.each(
            data,
            function( key, value ){

                var thisOption;

                //console.log( 'select option', key, value );
                thisOption = $( '<option>')
                    .attr( { value: value.value } )
                    .text( value.text );

                if ( value.value = that.target.value ) {
                    thisOption.attr( 'selected', 'selected' );
                }

                $( that.target ).append( thisOption );

            }

        );

    }

    /**
     * Select constructor
     *
     * @class Select
     * @constructor
     *
     * @param pConfig
     */

    var Select = function( pConfig ){

        // var
        var that = this,
            config;

        config = that.config = pConfig;

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

    Select.prototype = {

        /**
         * used to identify instance(s) via tb( /&lt;string&gt;/ )
         *
         * @property namespace
         * @type string
         * @static
         */
        namespace: 'tb.ui.Select',

        /**
         * handles requirement loading, an array containing file name strings
         *
         * @property tb.require
         * @type array
         * @static
         */
        'tb.require': [
        ],

        /**
         * @method render
         */
        render: render

    };

    return Select;

})();



