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
            .append( html )
            .on(
                'click',
                function( ev ){
                    that.config.templateSelector.trigger( 'focus' );
                    that.trigger( 'select' );
                    ev.stopPropagation();
                }
            );

        if ( that.config.TemplateID === tb.dom( that.config.templateSelector.target ).val() ){
            that.trigger( 'select' );
        }

    }

    /**
     select handler, both event and method

     @event select
     */
    function select(){

        var that = this,
            target = tb.dom( that.target );

        // set selected item in TemplateSelector
        that.config.templateSelector.selectedItem = that;

        // put selected template id in input field
        that.config.templateSelector.target
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
            target = tb.dom( that.target ),
            templateSelector =  that.config.templateSelector,
            outerContainer = templateSelector.outerContainer,
            position;

        target.removeClass( 'selectedTemplate active' );

        if ( id === that.config.TemplateID ){
            target.addClass( 'selectedTemplate active' );

            // scrollto active element
            position = target[0]
                    .offsetTop
                - outerContainer.offsetTop
                - outerContainer.scrollTop;

            // console.log( 'tS scrollTo', position );

            outerContainer.scrollTop =  position;
        }

    }

})();





// CLASS TemplateSelector CLASS
tb.namespace( 'demoapp.configuration', true ).TemplateSelector = (function(){

    // VARIABLES
    var messages = {
    };

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
            docFrag;

        // put a link to the validator in the data-tb attribute to aid in debugging
        var dataTb = tb.dom( that.target.target ).attr('data-tb').split(' ');

        dataTb.push( that.namespace );

        tb.dom( that.target.target ).attr('data-tb',
            dataTb.join(' ')
        );

        // set target to parent element target, that is the DOM node
        that.target = that.target.target;

        // append DIV tag after input tag
        that.outerContainer = document.createDocumentFragment();
        that.outerContainer.innerHTML = '<div><div /></div>';
        that.target.appendChild( that.outerContainer );
        that.content = that.outerContainer.childNodes[0];
        
    }

    /**
    render function, both used in handlers and as a method

    @event render
     */
    function render(){

        var that = this,
            data = that.templatesModel.data(),
            target = that.target;

        // render template items
        data.forEach(
            function( value ) {
                new tb(
                    demoapp.configuration.TemplateSelectorItem,
                    tb.extend(
                        {}, // make this a copy
                        value, // the config data
                        {   // extend: templateSelector
                            templateSelector: that
                        }
                    ),
                    that.content.append( document.createElement('span') )
                ).render(); // we can render right away
            }
        );

        // append keypress handlers ( ArrowDown, ArrowUp, Return)
        tb.dom( target )
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
            target = tb.dom( that.target );

        // if no template selected yet, select first template
        if ( !target.val() ){
            that
                .parent() // Field
                .children( demoapp.configuration.TemplateSelectorItem )[0]
                .trigger( 'select' );
        }

        // focus on input field
        target.focus();
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
            init: init,
            render: render,
            focus: focus
        }

        // templates crud model
        that.templatesModel = new tb.Model({
            'read': {
                url: '/demoapp/configuration/mock/demoapp-configuration-templates.mock.json', // mock data
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

})();
