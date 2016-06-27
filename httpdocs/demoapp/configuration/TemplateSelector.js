/**
 * @namespace demoapp.configuration
 */

// CLASS TemplateSelectorItem CLASS
tb.namespace( 'demoapp.configuration', true ).TemplateSelectorItem = (function(){

    /**
    @for demoapp.configuration.TemplateSelectorItem
     */


    /**
    TemplateSelectorItem constructor

    @class TemplateSelectorItem
    @constructor

    @param pConfig

    @example

         new tb(
            demoapp.configuration.TemplateSelectorItem,                                  // class
            {                                                                       // configuration
                TemplateID: '1',
                TemplatePreviewImagePath: '/img/image.png',
                TemplateUpdateDate: '12.12.2015',
                $TemplateInput: <jquery: parent input tag, contains template id>
            },
            target.appendChild( document.createElement( 'span' ) )                    // DOM node to insert the object item
         );

     */
    function TemplateSelectorItem( pConfig ){

        var that = this;

        that.config = pConfig;

        that.template =
            '<div>{TemplateName}</div>'
            + '<div>{TemplateUpdateDate}</div>'
            + '<image src="{TemplatePreviewImagePath}" />';

        that.handlers = {
            // doesnt need init()
            render: render,
            select: select,
            onSelect: onSelect
        }

    };

    // prototype
    TemplateSelectorItem.prototype = {

        /**
         used to identify instance(s) via tb( /&lt;string&gt;/ )

         @property namespace
         @type string
         @static
         */
        namespace: 'demoapp.configuration.TemplateSelectorItem',

        /**
         render method - adds element to DOM

         @method render
         */
        render: render,

        /**
         select method - selects a single template to be the active one

         @method select
         */
        select: select
    };

    return TemplateSelectorItem;

    
    /**
     render handler

     @event render
     */
    function render(){

        var that = this,
            html = tb.parse( that.template, that.config );

        tb.dom( that.target )
            .append( tb.dom( html ) );

        tb.dom( that.target )
            .on(
                'click',
                function( ev ){
                    that.config.templateSelector.trigger( 'focus' );
                    that.trigger( 'select' );
                    ev.stopPropagation();
                }
            );

        if ( that.config.TemplateID === that.config.templateSelector.inputElement.val() ){
            that.trigger( 'select' );
        }

    }

    /**
     select handler, both event and method

     @event select
     */
    function select(){

        var that = this,
            ts = that.config.templateSelector;

        // set selected item in TemplateSelector
        ts.selectedItem = that;

        // put selected template id in input field
        ts.inputElement
            .val( that.config.TemplateID );

        that.config.templateSelector
            .trigger(
                'onSelect',
                that.config.TemplateID,
                'd'
            );

    }

    /**
     onSelect handler

     @event onSelect
     */
    function onSelect( ev ){

        var that = this,
            id = ev.data,
            target = tb.dom( that.target ),
            templateSelector =  that.config.templateSelector,
            outerContainer = templateSelector.outerContainer,
            position;

        target.removeClass( 'selectedTemplate active' );

        if ( id === that.config.TemplateID ){
            target.addClass( 'selectedTemplate active' );

            //console.log( 'onSelect', id, target[0].offsetTop, outerContainer.offsetTop, outerContainer.scrollTop );

            // scrollto active element
            position = target[0].offsetTop
                - outerContainer.offsetTop;

            //console.log( 'tS scrollTo', position );

            outerContainer.scrollTop =  position;
        }

    }

})();





// CLASS TemplateSelector CLASS
tb.namespace( 'demoapp.configuration', true ).TemplateSelector = (function(){

    /**
    TemplateSelector constructor

    @class TemplateSelector
    @constructor

    @param pConfig

     new tb(
         nl.configuration.TemplateSelector,
         {
             TemplateID: '1',
             TemplatePreviewImagePath: '/img/image.png',
             TemplateUpdateDate: '12.12.2015',
             TemplateInput: input tag
         },
         $( '<span />' ).appendTo( <someContainerNodeInDOM> )
     );

     */
    var TemplateSelector = function( pConfig ){

        var that = this;

        that.config = pConfig;

        /**
        event handlers of this instance at creation time

        @property handlers
        @type object

        @example

            // in constructor
            <instance>.handlers = { <event name>: <function name> }



            // in code

            // define handler function
            var fct = function( ev ){
            // ....your operations
            }

            <instance>.on( <event name>, fct ); // permanent handler
            // or/and
            <instance>.one( <event name>, fct ); // handler deleted after execution
            // or/and
            <instance>.off( <event name>, fct ); // manually delete handler

            // trigger event
            <instance>.trigger( <event name>, <event data>, <bubble> );

        */
        that.handlers = {
            init,
            render,
            focus
        };

        // templates crud model
        that.templatesModel = new tb.Model({
            'read': {
                url: '/demoapp/configuration/mock/demoapp-configuration-templates.json', // mock data
                method: 'GET',
                type: 'json',
                params: {
                },
                success: function( pResult ){
                    that.templatesModel.data( JSON.parse( pResult.text ).data );
                },
                error: function( pResult ){
                    console.log( 'an error occured', pResult );
                }
            }
        });

    };

    TemplateSelector.prototype = {

        /**
        used to identify instance(s) via tb( /&lt;string&gt;/ )

        @property namespace
        @type string
        @static
         */
        namespace: 'demoapp.configuration.TemplateSelector',

        /**
        handles requirement loading, an array containing file name strings

        @property tb.require
        @type array
        @static
         */
        'tb.require': [
            'demoapp/configuration/TemplateSelector.css'
        ]
    };

    return TemplateSelector;

    // PRIVATE FUNCTIONS
    /**
     @for demoapp.configuration.TemplateSelector
     */


    /**
     init handler

     @event init
     @param e
     */
    function init(){

        var that = this,
            inputElement = that.target.inputElement;

        that.inputElement = inputElement;

        // append DIV tag after input tag
        tb.dom( '<div><div /></div>' )
            .insertAfter( inputElement[0] );

        // hide original input field
        inputElement[0]
            .style = 'height:0; width:0; border:0px none;margin: 0;padding: 0';

        // set target
        that.target = inputElement[0].nextSibling;

        // add the selector instance to the dom node
        that.target['demoapp.configuration.TemplateSelector'] = that;

        // put a link to the validator in the data-tb attribute to aid in debugging
        tb.dom( that.target ).attr( 'data-tb', that.namespace );

        // append domNode class
        tb.dom( that.target ).addClass( 'demoapp-configuration-templateselector' );

        that.outerContainer = that.target;
        that.content = that.outerContainer.childNodes[0];

        // when template list data has been read, render
        that.templatesModel.data.observe( function templateModelDataChanged(){
            that.trigger( 'render' );
        });

        // read data
        that.templatesModel.read();

    }

    /**
     render function, both used in handlers and as a method

     @event render
     */
    function render(){

        var that = this,
            data = that.templatesModel.data();

        // render template items
        data.forEach(
            function( pConfig ) {
                new tb(
                    demoapp.configuration.TemplateSelectorItem,
                    tb.extend(
                        {}, // make this a copy
                        pConfig, // the config data
                        {   // extend: templateSelector
                            templateSelector: that
                        }
                    ),
                    that.content.appendChild( document.createElement('span') )
                ).render(); // we can render right away
            }
        );

        // append keypress handlers ( ArrowDown, ArrowUp, Return)
        //console.log( that.inputElement );
        that.inputElement
            .on(
                'keypress',
                function( ev ) {
                    var selectedItem = that.selectedItem;

                    //console.log( 'key', ev.keyCode, ev );

                    switch ( ev.keyCode ){
                        case 13:

                            ev.keyCode = 7; // change to tab keyCode and hand over to leave field
                            ev.key = 'Tab';

                            break;
                        case 37:

                            selectedItem
                                .prev()
                                .trigger( 'select' );

                            ev.preventDefault();
                            break;

                        case 39:

                            selectedItem
                                .next()
                                .trigger( 'select' );

                            ev.preventDefault();
                            break;
                    }
                }
            )
            .one( // we only need this once, since we cannot 'unselect' a template
                'focus',
                function(){
                    that.trigger( 'focus' );
                }
            );
    }

    /**
     focus handler

     @event focus
     @param e
     */
    function focus(){

        var that = this;

        // if no template selected yet, select first template
        if ( !that.inputElement.val() ){
            that
                .children()[0]
                .trigger( 'select' );
        }

        // focus on input field
        that.inputElement.trigger( 'focus' );
    }

})();
