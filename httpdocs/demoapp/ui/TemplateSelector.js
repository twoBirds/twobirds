/**
 * @namespace nl.ui
 */

// CLASS TemplateSelectorItem CLASS
tb.namespace( 'demoapp.ui', true ).TemplateSelectorItem = (function(){

    /**
    @for nl.ui.TemplateSelectorItem
     */


    /**
    TemplateSelectorItem constructor

    @class TemplateSelectorItem
    @constructor

    @param pConfig

    @example

         new tb(
            nl.ui.TemplateSelectorItem,                                  // class
            {                                                                       // configuration
                TemplateID: '1',
                TemplatePreviewImagePath: '/img/image.png',
                TemplateUpdateDate: '12.12.2015',
                $TemplateInput: <jquery: parent input tag, contains template id>
            },
            $( '<span />' ).appendTo( <someContainerNodeInDOM> )                    // DOM node to insert the object item
         );

     */
    function TemplateSelectorItem( pConfig ){

        var that = this;

        that.config = pConfig;

        that.template =
            '<div>{TemplateName}</div>'
            + '<div>{ModifiedDate}</div>'
            + '<image src="/{TemplatePreviewImagePath}" />';

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
        namespace: 'nl.ui.TemplateSelectorItem',

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

        $( that.target )
            .append( html )
            .on(
                'click',
                function( ev ){
                    that.config.templateSelector.trigger( 'focus' );
                    that.trigger( 'select' );
                    ev.stopPropagation();
                }
            );

        if ( that.config.TemplateID === $( that.config.templateSelector.target ).val() ){
            that.trigger( 'select' );
        }

    }

    /**
     select handler, both event and method

     @event select
     */
    function select(){

        var that = this,
            $target = $( that.target );

        // set selected item in TemplateSelector
        that.config.templateSelector.selectedItem = that;

        // put selected template id in input field
        $( that.config.templateSelector.target )
            .val( that.config.TemplateID )
            .trigger( 'change' );

        // on all of these items, trigger 'onSelect'
        that
            .parent()
            .trigger(
                'onSelect',
                that.config.TemplateID,
                'd' // not local, bubble down to children
            );

    }

    /**
     onSelect handler

     @event onSelect
     */
    function onSelect( ev ){

        var that = this,
            id = ev.data,
            $target = $( that.target),
            templateSelector =  that.config.templateSelector,
            $outerContainer = templateSelector.$outerContainer,
            $container = templateSelector.$content,
            position;

        $target.removeClass( 'selectedTemplate active' );

        if ( id === that.config.TemplateID ){
            $target.addClass( 'selectedTemplate active' );

            // scrollto active element
            position = $( that.target ).offset().top
                - $outerContainer.offset().top
                - $outerContainer.scrollTop();

            // console.log( 'tS scrollTo', position );

            $outerContainer.animate(
                {
                    scrollTop: (
                        position
                    )
                },
                50
            );

        }

    }

})();





// CLASS TemplateSelector CLASS
tb.namespace( 'nl.ui', true ).TemplateSelector = (function(){

    // VARIABLES
    var messages = {
    };

    // PRIVATE FUNCTIONS
    /**
    @for nl.ui.TemplateSelector
     */


    /**
    init handler

    @event init
    @param e
     */
    function init(){

        var that = this;

        // append DIV tag after input tag
        that.$outerContainer = $( '<div><div /></div>');
        that.$outerContainer.insertAfter( that.target );
        that.$content = that.$outerContainer.children().first();

    }

    /**
    render function, both used in handlers and as a method

    @event render
     */
    function render(){

        var that = this,
            data = that.templatesModel.data(),
            $target = $( that.target ),
            id = $target.val();

        // render template items
        $.each(
            data,
            function( key, value ) {
                new tb(
                    nl.ui.TemplateSelectorItem,
                    $.extend(
                        true, // deep
                        {}, // make this a copy
                        value, // the config data
                        {   // extend: templateSelector
                            templateSelector: that
                        }
                    ),
                    $('<span />').appendTo(that.$content)
                ).render(); // we can render right away
            }
        );

        // append keypress handlers ( ArrowDown, ArrowUp, Return)
        $target
            .on(
                'keypress',
                function( ev ) {
                    // console.log( 'key', ev.keyCode );
                    switch ( ev.keyCode ){
                        case 13:

                            ev.keyCode = 7; // change to tab keyCode and hand over to leave field
                            ev.key = 'Tab';

                            break;
                        case 37:

                            var selectedItem = that.selectedItem;

                            selectedItem
                                .prev()
                                .is(  tb.ui.TemplateSelectorItem  )
                                .trigger( 'select' );

                            ev.preventDefault();
                            break;

                        case 39:

                            var selectedItem = that.selectedItem;

                            selectedItem
                                .next()
                                .is(  tb.ui.TemplateSelectorItem  )
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
            )
            .on(
                'blur',
                function(){
                    $target.removeClass( 'selectedTemplate active' );
                }

        );
    }

    /**
     focus handler

     @event focus
     @param e
     */
    function focus(){

        var that = this,
            $target = $( that.target );

        // if no template selected yet, select first template
        if ( !$target.val() ){
            that
                .parent() // Field
                .children( nl.ui.TemplateSelectorItem )[0]
                .trigger( 'select' );
        }

        // focus on input field
        $target.focus();
    }

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
             $TemplateInput: <jquery: parent input tag, contains template id>
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
            init: init,
            render: render,
            focus: focus
        }

        // templates crud model
        that.templatesModel = new tb.Model({
            'read': {
                // url: baseUrl + 'namespace/nl/mock/newsletter_configuration_ajax-fetch-templates.mock.json', // mock data
                url: baseUrl + school +'/newsletter/configuration/ajax-fetch-templates',
                method: 'GET',
                params: {
                },
                success: function( pResult ){
                    // put new data into observable
                    that.templatesModel.data( pResult.data );
                }
            }
        });

        // when template list data has been read, render
        that.templatesModel.data.observe(
            function(){
                that.trigger( 'render' );
            }
        );

        // read data
        that.templatesModel.read();

    };

    TemplateSelector.prototype = {

        /**
        used to identify instance(s) via tb( /&lt;string&gt;/ )

        @property namespace
        @type string
        @static
         */
        namespace: 'nl.ui.TemplateSelector',

        /**
        handles requirement loading, an array containing file name strings

        @property tb.require
        @type array
        @static
         */
        'tb.require': [
            '/namespace/nl/css/TemplateSelector.css'
        ]
    };

    return TemplateSelector;

})();
