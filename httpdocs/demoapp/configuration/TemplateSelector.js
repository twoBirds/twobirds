/**
 * @namespace demoapp.configuration
 */

// CLASS TemplateSelectorItem
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
                TemplateSelector: <templateSelector instance>
            },
            target.appendChild( document.createElement( 'span' ) )                    // DOM node to insert the object item
         );

     */
    function TemplateSelectorItem( pConfig ){

        var that = this;

        /**
         configuration as given in constructor parameter pConfig

         @property config
         @type object
         */
         that.config = pConfig;

        /**
         template string, later parsed with data and added to DOM

         @property template
         @type string
         */
        that.template =
            '<div>{TemplateName}</div>'
            + '<div>{TemplateUpdateDate}</div>'
            + '<image src="{TemplatePreviewImagePath}" />';

        /**
         event handlers object: key = event name, value = event handler function

         @property handlers
         @type object
         */
        that.handlers = { // doesnt need init()
            /**
             onSelect handler

             @event onSelect
             */
            onSelect: onSelect,
            /**
             onActivate handler

             @event onActivate
             */
            onActivate: onActivate
        }

    }

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
        select: select,

        /**
         activate method - selects a single template to be the active one

         @method activate
         */
        activate: activate
    };

    return TemplateSelectorItem;

    
    function render(){

        var that = this,
            html = tb.parse( that.template, that.config );

        tb.dom( that.target )
            .append( tb.dom( html ) );

        tb.dom( that.target )
            .on(
                'click',
                function( ev ){
                    tb.dom( that.config.templateSelector.inputElement[0] )
                        .trigger( 'focus' );

                    that
                        .activate()
                        .select();

                    ev.stopPropagation();
                }
            );

        if ( that.config.TemplateID === that.config.templateSelector.inputElement.val() ){
            that.select();
        }

    }

    function activate(){

        var that = this,
            ts = that.config.templateSelector;

        //console.log('activate()', that.namespace, that);

        // set active item in TemplateSelector
        ts.activeItem = that;

        that.config.templateSelector
            .trigger(
                'onActivate',
                that.config.TemplateID,
                'd'
            );

        return that;
    }

    function onActivate( e ){

        var that = this,
            id = e.data,
            target = tb.dom( that.target ),
            templateSelector =  that.config.templateSelector,
            outerContainer = templateSelector.outerContainer,
            position;

        target.removeClass( 'active' );

        if ( id === that.config.TemplateID ){
            target.addClass( 'active' );

            // scroll to active element
            position = target[0].offsetTop
                - outerContainer.offsetTop;

            outerContainer.scrollTop =  position;
        }

    }

    function select(){

        var that = this,
            ts = that.config.templateSelector;

        //console.log('select()', that.namespace, that);

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

        return that;
    }

    function onSelect( e ){

        var that = this,
            id = e.data,
            target = tb.dom( that.target );

        target.removeClass( 'selected' );

        if ( id === that.config.TemplateID ){
            target.addClass( 'selected' );
        }

    }

})();





// CLASS TemplateSelector
tb.namespace( 'demoapp.configuration', true ).TemplateSelector = (function(){

    /**
     @for demoapp.configuration.TemplateSelector
     */

    /**
     TemplateSelector constructor

     @class TemplateSelector
     @constructor

     @param pConfig

     @example

         new tb(
             nl.configuration.TemplateSelector,
             {}, // no config needed
             <input type="text"> DOM node
         );

     */
    var TemplateSelector = function(){

        var that = this;

        /**
        event handlers of this instance at creation time

        @property handlers
        @type object

        @example

            // in constructor
            <instance>.handlers = {
                <event name>: <function name>
            }



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
            /**
             init handler

             @event init
             @param e
             */
            init,
            /**
             render handler

             @event render
             */
            render,
            /**
             focus handler

             @event focus
             */
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

    function init(){

        var that = this,
            inputElement = that.target.inputElement;

        that.inputElement = inputElement;

        // append DIV tag after input tag
        tb.dom( '<div><div /></div>' )
            .insertAfter( inputElement[0] );

        // hide original input field (HINT: dont really hide it --> focus() wont work )
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

    function render(){

        var that = this,
            data = that.templatesModel.data(),
            selectedId = that.inputElement.val();

        // render template items
        data.forEach(
            function( pConfig ) {
                var templateSelectorItem = new tb(
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

                if ( !!selectedId && selectedId === pConfig.TemplateId ){
                    console.log( 'set selected item', selectedId );
                    templateSelectorItem.select();
                    that.activeItem = selectedId;
                }
            }
        );

        // if no template selected yet, select first template
        if ( !selectedId ){
            that
                .children()[0]
                .activate()
                .select();
        }


        // append keypress handlers ( ArrowDown, ArrowUp, Return)
        //console.log( that.inputElement );
        that.inputElement
            .on(
                'keypress',
                function( ev ) {

                    //console.log( 'key', ev, that );

                    switch ( ev.keyCode ){
                        case 13:

                            that.activeItem
                                .select();

                            ev.preventDefault();
                            break;
                        case 37:
                            var prevItem = that.activeItem.prev();

                            if ( !!prevItem[0] ){
                                prevItem[0].activate();
                            }

                            ev.preventDefault();
                            break;

                        case 39:
                            var nextItem = that.activeItem.next();

                            if ( !!nextItem[0] ){
                                nextItem[0].activate();
                            }

                            ev.preventDefault();
                            break;
                    }
                }
            )
            .on(
                'focus',
                function(){
                    //console.log( 'inputfield focus' );
                    that.trigger( 'focus' );
                }
            )
            .on(
                'blur',
                function(){
                    //console.log( 'inputfield blur' );
                    tb.dom( 'span.active', that.target )
                        .removeClass( 'active' );
                }
            );

    }

    function focus(){
        var that = this;

        if ( !that['activeItem'] ){
            that
                .children()[0]
                .activate();
        } else {
            that.activeItem
                .activate()
        }

        console.log(that.parents( tb.ui.field )[0]);
        that
            .parents( tb.ui.field )[0]
            .inputElement[0].focus();
    }

})();
