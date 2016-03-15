// @todo: add intranet header
// @todo: add docu
tb.namespace( 'kendoWrapper', true );

// kendo ui wrapper factory
(function(){

    // VARIABLES

    // FUNCTIONS

    function init ( e ){
        var that = this;
        // nothing yet...
    }


    function kendoForwardFunction( pEventName, pTbo ){
        return function( e ){

            $.extend( true, e.data, { eventName: pEventName } );

            //console.info( 'kendoUI EVENT', pEventName, pTbo, e );

            pTbo.trigger( 'kendo' + pEventName[0].toUpperCase() + pEventName.slice(1), e );
        }
    }

    $.each(
        kendo.ui,
        function( pKendoWidgetName, pKendoConstructorFunction ){

            var firstChar = pKendoWidgetName[0],
                isClass = ( typeof kendo.ui[ pKendoWidgetName ] === 'function' && firstChar === firstChar.toUpperCase() ),
                longName = 'kendo' + pKendoWidgetName,
                myClass;

            if ( !isClass ) {
                return;
            }

            // wrapper class constructor
            myClass = (function( pKendoWidgetName, pKendoConstructorFunction ){

                return function( pConfig, pTarget ){

                    var that = this,
                        $target = $( pTarget),
                        kObject;

                    that.config = pConfig || that.config;


                    if (!that[ longName ]){
                        // create kendo Widget instance
                        $target[ longName ]( pConfig );
                    }

                    that[ longName ] = $target.data( longName );
                    kObject = that[ longName ];

                        // bind all kendo events to surrounding tb object
                    $.each(
                        kObject.events,
                        function( key, value ){
                            // forward all kendo events
                            var eventName = 'kendo' + value[0].toUpperCase() + value.slice(1);

                            // add the handler to kendo object
                            kObject.bind( value, kendoForwardFunction( value, that ) );
                        }
                    );

                    that.handlers = {
                        init: init
                    };

                };

            })( pKendoWidgetName, pKendoConstructorFunction );


            // wrapper class prototype
            myClass.prototype = {

                namespace: 'kendoWrapper.'+ pKendoWidgetName

            };

            kendoWrapper[pKendoWidgetName] = myClass;

        }

    );

})();


kendoWrapper.MultiSelect.prototype.config = { // default config value
    autoClose: false,
    dataSource: {
        data: {
            items: [
                {
                    text: 'item 1',
                    value: 'value 1'
                },
                {
                    text: 'item 2',
                    value: 'value 2'
                },
                {
                    text: 'item 3',
                    value: 'value 3'
                }
            ]
        },
        schema: {
            data: "data"
        }
    },
    dataTextField: "text",
    dataValueField: "value"
};
