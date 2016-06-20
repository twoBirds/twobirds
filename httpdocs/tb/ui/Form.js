/**
 @namespace tb.ui.FieldValidator
 */
tb.namespace( 'tb.ui', true ).FieldValidator = (function(){

    var messages = {
        'This is not a valid eMail adress!': 'Im Eingabefeld muss eine gültige E-Mailadresse erfasst werden.',
        'This is not a valid input for this field!': 'Das ist kein gültiger Wert in diesem Feld.',
        'This value is too small!': 'Dieser Wert ist zu klein.',
        'This value is too big!': 'Dieser Wert ist zu gross.',
        'You have to fill this field!': 'Bitte erfassen Sie Daten im Eingabefeld.',
        'resetMessage': ''
    };

    var classes = {
        info: 'tb-ui-validator-info',
        warning: 'tb-ui-validator-warning',
        error: 'tb-ui-validator-error'
    };

    /**
     @namespace tb.ui.FieldValidator
     */

    /**
     FieldValidator constructor

     @class tb.ui.FieldValidator
     @constructor

     @param pConfig
     */
    function FieldValidator( pConfig ){

        var that = this,
            config = pConfig;

        that.config = config;

        that.handlers = {
            init,
            validate
        };

        // VALIDATOR function factory
        // must be in here (inner function) to bind <that> correctly via closure
        function makeValidatorFunction( pStatus, pFunction, pMessage ){

            var f;

            f = function( value ){

                var labelElement = that.target.labelElement,
                    inputElement = that.target.inputElement,
                    messageElement = that.target.messageElement,
                    valid = pFunction( inputElement.val()),
                    f = pFunction;

                // remove previous message
                messageElement.empty();

                // remove previous classes
                classes
                    .forEach(
                        function( statusName, statusClass ){
                            labelElement.removeClass( statusClass );
                            inputElement.removeClass( statusClass );
                            messageElement.removeClass( statusClass );
                        }
                    );

                // set message & visual class for this status code
                if ( !valid ){

                    // message is either defined as curry property on function, or standard given
                    messageElement
                        .html( f['message'] ? f['message'] : pMessage )
                        .show();

                    if ( !!classes[ pStatus ] ){
                        labelElement.addClass( classes[ pStatus ] );
                        inputElement.addClass( classes[ pStatus ] );
                        messageElement.addClass( classes[ pStatus ] );
                    }

                    // send status to form validator
                    that
                        .parents('form')[0]
                        ['tb.ui.FormValidator']
                        .trigger(
                            'setStatus',
                            {
                                valid: valid,
                                status: pStatus,
                                input: inputElement,
                                message: f['message'] ? f['message'] : pMessage,
                                label: labelElement.html()
                            }
                        );

                }

                return valid;

            };

            return f;

        }

        return; // @todo: implement tb.dom event handling
        /*
        // create validation functions and append them to input field
        $.each(
            config.validators, // <eventNames> property, format like jQ event names
            function( pEventName, pStatusCollection ){
                $.map(
                    [ 'error', 'warning', 'info' ], // types of errors
                    function( pStatusName ){


                        var // first validator function is the most urgent, others follow in sequence
                            functionCollection = config.validators[ pEventName ][ pStatusName ] || {};

                        // execute all validation handlers on this field
                        if ( !!functionCollection ) {
                            $.each(
                                functionCollection, // validation definition / functions
                                function( pFactoryName, pFactoryValue  ){ // built-in factory parameter or function !

                                    // that = validator instance, not field instance!
                                    var isFunction = typeof pFactoryValue === 'function' ? true : false,
                                        $labelElement = !!config.$labelElement ? config.$labelElement : $(), // label DOM node
                                        $inputElement = !!config.$inputElement ? config.$inputElement : $(), // input DOM node
                                        $messageElement =!!config.$messageElement ? config.$messageElement : $(), // message DOM node
                                        f;

                                    // attach standard or custom function to input element
                                    if ( isFunction ){
                                        // attach function directly
                                        $inputElement.on(
                                            pEventName,
                                            makeValidatorFunction(
                                                pStatusName,
                                                pFactoryValue,
                                                Validator.fn.invalid.message
                                            )
                                        );
                                    } else {
                                        // attach repository validator function
                                        $inputElement.on(
                                            pEventName,
                                            makeValidatorFunction(
                                                pStatusName,
                                                that.fn[ pFactoryName ].validator( pFactoryValue ),
                                                that.fn[ pFactoryName ].message
                                            )
                                        );
                                    }
                                }
                            );
                        }
                    }
                );
            }
        );
        */
    };

    FieldValidator.prototype = {

        namespace: 'tb.ui.Validator',

        validate: validate,

        /**
         validator standard functions array

         @property fn {object}
         */
        fn: {

            /**
             @property fn.message {object}
             */
            message: {
                /**
                 @property fn.message.validator {function} - the factory
                 */
                validator: message, // always false : display message
                /**
                 @property fn.message.message {object} - the standard error message
                 */
                message: ''
            },

            /**
             @property fn.reset {object}
             */
            reset: {
                /**
                 @property fn.reset.validator {function} - the factory
                 */
                validator: reset, // remove message from field
                /**
                 @property fn.reset.message {object} - the standard error message
                 */
                message: ''
            },

            /**
             @property fn.invalid {object}
             */
            invalid: {
                /**
                 @property fn.invalid.validator {function} - the factory
                 */
                validator: function(){ return false; }, // standard error message
                /**
                 @property fn.invalid.message {object} - the standard error message
                 */
                message: messages['This entry is invalid!']
            },

            /**
             @property fn.required {object}
             */
            required: {
                /**
                 @property fn.required.validator {function} - the factory
                 */
                validator: required,
                /**
                 @property fn.required.message {object} - the standard error message
                 */
                message: messages['You have to fill this field!']
            },
            /**
             @property fn.email {object}
             */
            email: {
                /**
                 @property fn.email.validator {function} - the factory
                 */
                validator: email,
                /**
                 @property fn.email.message {object} - the standard error message
                 */
                message: messages['This is not a valid eMail adress!']
            },
            /**
             @property fn.regex {object}
             */
            regex: {
                /**
                 @property fn.regex.validator {function} - the factory
                 */
                validator: regex,
                /**
                 @property fn.regex.message {object} - the standard error message
                 */
                message: messages['This is not a valid input for this field!']
            },
            /**
             @property fn.min {object}
             */
            min: {
                /**
                 @property fn.min.validator {function} - the factory
                 */
                validator: min,
                /**
                 @property fn.min.message {object} - the standard error message
                 */
                message: messages['This value is too small!']
            },
            /**
             @property fn.max {object}
             */
            max: {
                /**
                 @property fn.max.validator {function} - the factory
                 */
                validator: max,
                /**
                 @property fn.max.message {object} - the standard error message
                 */
                message: messages['This value is too big!']
            }
        }
    };

    return FieldValidator;

    // private functions

    function init(){
        var that = this;

        // put a link to the validator in the data-tb attribute to aid in debugging
        var dataTb = tb.dom( that.target.target ).attr('data-tb').split(' ');

        dataTb.push( that.namespace );

        tb.dom( that.target.target ).attr('data-tb',
            dataTb.join(' ')
        );

        // set target to parent element target, that is the DOM node
        that.target = that.target.target;
    }

    /**
     message factory, sets message

     @function message
     @returns function
     */
    function message( pMessage ){
        var f;

        f = function( value ) {
            return false; // always display message
        };

        if ( !!pMessage && typeof pMessage === 'string' ){
            f.message = pMessage;
        }

        return f;

    }

    /**
     reset factory, deletes messages

     @function reset
     @returns function
     */
    function reset(){
        var f;

        f = function( value ) {
            return true;
        };

        return f;

    }

    /**
     required factory, checks input for existence

     @function required
     @param pMessage {string} - the message to display on error
     @returns function
     */
    function required( pMessage ){
        var f;

        f = function( value ) {
            return !!value;
        };

        if ( !!pMessage && typeof pMessage === 'string' ){
            f.message = pMessage;
        }

        return f;

    }

    /**
     regex factory, checks input for regex match

     @function regex
     @param pMessage {string} - the message to display on error
     @returns function
     */
    function regex( pRegEx ){
        var f;

        f = function( value ){
            return !!value.match( pRegEx );
        };

        return f;

    }

    /**
     email factory, checks input for valid email adress

     @function regex
     @param pMessage {string} - the message to display on error
     @returns function
     */
    function email( pDelimiter ){
        var delimiter = typeof pDelimiter === 'string' && pDelimiter.length === 1
                ? pDelimiter
                : false,
            eMailRegEx = regex( /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i ), // regex function
            f;

        f = function( value ){

            var adresses = delimiter ? value.split( delimiter ) : [ value ],
                valid = true;

            adresses.forEach(
                function( email ){
                    if ( !eMailRegEx( email ) ){
                        valid = false;
                    }
                }
            );

            return valid;
        };

        return f;

    }

    /**
     min factory, checks parseInt( input ) < manimal value given

     @function min
     @param pMinValue {string} - the minimium value
     @returns function
     */
    function min( pMinValue ){
        var f;

        f = function( value ){
            return !!parseFloat(pMinValue) <= parseFloat(value);
        };

        return f;

    }

    /**
     max factory, checks parseInt( input ) > maximal value given

     @function max
     @param pMaxValue {string} - the maximium value
     @returns function
     */
    function max( pMaxValue ){
        var f;

        f = function( value ){
            return !!parseFloat(pMaxValue) >= parseFloat(value);
        };

        return f;

    }

    /**
     validate handler

     @event validate
     @param e
     */
    function validate( pConfig ){

        var that = this;

        // console.log( 'fieldValidator::validate' );

        that
            .parents('form')[0]
            ['tb.ui.FormValidator']
            .trigger( 'onStartFieldValidation' );

        // execute beforeSubmit() validation
        that
            .target
            .inputElement
            .one(
                'beforeSubmit',
                function(){
                    setTimeout(
                        function(){
                            that
                               .parents('form')[0]
                                ['tb.ui.FormValidator']
                               .trigger( 'onEndFieldValidation' );

                        },
                        100
                    );
                }
            )
            .trigger( 'beforeSubmit' );

    }

})();

/**
 * @namespace tb.ui.FormValidator
 */
tb.namespace( 'tb.ui', true ).FormValidator = (function() {

    /**
     FormValidator constructor

     @class tb.ui.FormValidator
     @constructor

     @param pConfig
     */
    function FormValidator( pConfig ){

        var that = this,
            config = pConfig;

        that.config = config;

        // this indicates the number of field validations currently in progress,
        // when it reaches 0 callbacks are executed depending on status
        that.fieldValidationCount = 0;

        // this will contain all errors and warnings after validation
        that.status = {
            warning: [],
            error: []
        };

        // handlers for instance
        that.handlers = {
            setStatus,
            validate,
            onStartFieldValidation,
            onEndFieldValidation
        }

    };

    FormValidator.prototype = {

        /**
         used to identify instance(s) via tb( /&lt;string&gt;/ )

         @property namespace
         @type string
         @static
         */
        namespace: 'tb.ui.FormValidator',

        /**
         validate form

         @method validate
         */
        validate: validate
    };

    return FormValidator;

    // VARIABLES

    // PRIVATE FUNCTIONS
    /**
     form validate, handler & method

     @event validate
     @param ev {object} - the different callbacks to execute after validation
     */
    function validate( e ){

        var that = this,
            data = e.data;

        that.validateCallbacks = data;

        // reset form status
        that.status = {
            warning: [],
            error: []
        };

        // this indicates the number of field validations currently in progress
        that.fieldValidationCount = 0;

        // trigger validation
        tb.dom( that.target ) // = tb form instance
            .descendants( tb.ui.Field )
            .trigger( 'validate' );

    }

    /**
     onStartFieldValidation handler

     @event onStartFieldValidation
     */
    function onStartFieldValidation(){

        var that = this;

        that.fieldValidationCount++;

    }

    /**
     onEndFieldValidation handler

     @event onEndFieldValidation
     */
    function onEndFieldValidation(){

        var that = this;

        that.fieldValidationCount--;

        // console.log(that.fieldValidationCount);

        // if form validation succeeds, execute callback
        if ( that.fieldValidationCount === 0 ){

            //console.log( 'status', that.status );

            if( !!that.status.error.length > 0 ){
                // console.log( 'formValidation error', that.status );
                that.validateCallbacks.errorCallback( that.status );
            } else if( !!that.status.warning.length > 0 ){
                // console.log( 'formValidation warning', that.status );
                that.validateCallbacks.warnCallback( that.status );
            } else {
                // console.log( 'formValidation OK', that.status );
                that.validateCallbacks.successCallback( that.status );
            }
        }
    }

    /**
     setStatus handler

     @event setStatus
     */
    function setStatus( e ){

        var that = this,
            data = e.data;

        if ( data.status === 'error' ){
            that.status.error.push( data );
        } else if ( data.status === 'warning' ){
            that.status.warning.push( data );
        }

    }

})();

/**
 * @namespace tb.ui.Field
 */
tb.namespace( 'tb.ui', true ).Field = (function() {

    /**
     Field constructor

     @class Field
     @constructor

     @param pConfig
     */
    function Field( pConfig ){

        // var
        var that = this;

        that.config = pConfig;

        tb.extend(
            that,
            pConfig
        );

        /**
         event handlers of this instance at creation time

         @example

            //the object &lt;property name&gt; equals the event name you trigger, like
            handlers = { &lt;event name&gt;: &lt;function name&gt; }

         @example

            &lt;instance&gt;.trigger( &lt;event name&gt;, &lt;event data&gt;, &lt;bubble&gt; );

         @property handlers
         @type object
         */
        that.handlers = {
            init,
            render,
            focus,
            scrollTo,
            validate
        }

    };

    Field.prototype = {

        /**
         used to identify instance(s) via tb( /&lt;string&gt;/ )

         @property namespace
         @type string
         @static
         */
        namespace: 'tb.ui.Field',

        /**
         static helper variable for last field generated

         @property prevField
         @type {object} - tb.ui.Field
         @static
         */
        prevField: {},

        /**
         renders field html
         @method render
         */
        render: render

    };

    return Field;

    // VARIABLES

    // PRIVATE FUNCTIONS
    /**
     init handler

     @event init
     @param e
     */
    function init(e) {
        this.render();
    }

    /**
     render function, both used in handlers and as a method

     @event render
     */
    function render() {

        var that = this,
            config = that.config,
            inputTag;

        // clear content (in case of re-render )
        tb.dom( that.target ).html('');

        // create field elements

        // label element
        that.labelElement = tb.dom( document.createElement('label') )
            .addClass('tb-ui-field-label')
            .html(config['label'] || '');

        that.target.appendChild(that.labelElement[0]);

        // hint element
        that.hintElement = tb.dom( document.createElement('span') )
            .addClass('tb-ui-field-hint')
            .html(config['hint'] || '');

        that.target.appendChild(that.hintElement[0]);

        // input element
        if (!!config.tagName) {

            that.inputElement = tb.dom( document.createElement( config.tagName ) )
                .addClass('tb-ui-field-tag')
                .attr( !!config.tagAttributes ? config.tagAttributes : {} );

            that.inputElement
                .val(!!config.value ? config.value : '');

            /*
            tb.dom( that.inputElement ) @todo: implement dom event handling
                .on(
                    'focusin focus',
                    function( e ){
                        // scroll field element into sight

                        that.direction = ''; // reset direction

                        that.trigger( 'scrollTo' );

                    }
                );
             */

            that.target.appendChild( that.inputElement[0] );

        }

        // message element
        that.messageElement = tb.dom( document.createElement('span') )
            .addClass('tb-ui-field-message')
            .html(config['message'] || '');

        that.target.appendChild(that.messageElement[0]);
        
        // keyhandler for direction
        /* @todo: implement dom event handling
        that
            .inputElement
            .on(
                'keypress',
                function( ev ){
                    var $input = $( this );

                    if ( ev.key === 'Tab' ){
                        that.direction = ev.shiftKey ? 'prev' : 'next';
                    } else {
                        // any non-directional key
                        that.direction = '';
                    }

                    if ( !!that.direction ){
                        if ( that.direction === 'next' && that.nextField ){
                            that.nextField.trigger( 'focus' );
                        } else if ( that.direction === 'prev' && that.prevField ){
                            that.prevField.trigger( 'focus' );
                        }
                    }

                }
            );
        */

        // if masked input field -> hide alltogether
        if (tb.namespace('input.type', false, config) === 'hidden') {
            tb.dom( that.target )
                .attr({
                    overflow: 'hidden',
                    height: '0',
                    width: '0',
                    margin: '0',
                    padding: '0',
                    border: '0px none'
                });
        } else {
            // get last field created before this one
            if ( tb.ui.Field.prototype.prevField ){
                tb.ui.Field.prototype.prevField.nextField = that; // this one is the next field
                that.prevField = tb.ui.Field.prototype.prevField; // my prev field is the one linked in the prototype
            }
        }
        
        // set last field created before this one
        tb.ui.Field.prototype.prevField = that;

    }

    /**
     validate handler

     @event validate
     */
    function validate() {

        var that = this;

        if ( !!that.validator ){
            that.validator.trigger( 'validate' );
        }

    }

    /**
     focus function handler

     @event focus
     */
    function focus() {

        var that = this;

        that.trigger( 'scrollTo' ); // also in focus() but necessary

        that.inputElement.trigger( 'focus' ); // jQ event

    }

    /**
     scrollTo function handler

     @event scrollTo
     */
    function scrollTo(){
        var that = this;

        // console.log( 'scrollTo', that );
        $('html, body').animate(
            {
                scrollTop: (
                    $( that.target ).offset().top - 100 // top of input element
                    // + ( $( $fieldset.target ).outerHeight() / 2 ) // + half of its height
                    // - ( height / 2 ) // minus half of the inner browser window height
                )
            },
            50
        );
    }

})();

/**
 * @namespace tb.ui.FieldSet
 */
tb.namespace( 'tb.ui', true ).FieldSet = (function(){

    /**
     * FieldSet constructor
     *
     * @class FieldSet
     * @constructor
     *
     * @param pConfig
     */
    function FieldSet( pConfig ){

        // var
        var that = this;

        that.config = pConfig;

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

    FieldSet.prototype = {

        /**
         * used to identify instance(s) via tb( /&lt;string&gt;/ )
         *
         * @property namespace
         * @type string
         * @static
         */
        namespace: 'tb.ui.FieldSet',

        /**
         * @method render
         */
        render: render

    };

    return FieldSet;

    // VARIABLES

    // PRIVATE FUNCTIONS
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
            legend;

        // clear content (in case of re-render )
        tb.dom( that.target )
            .empty()
            .attr( that.config['tagAttributes'] || {} );

        if ( !!that.config['legend'] ){
            legend = that.target.appendChild( document.createElement( 'legend' ) );
            tb.dom( legend ).html( that.config.legend);
        }
        
        that.config.fields
            .forEach(
                function( pValue ){

                    /*
                    if ( !pValue['name'] ){
                        pValue.name = key;
                    }
                     */

                    new tb(
                        tb.ui.Field,
                        pValue,
                        that.target.appendChild( document.createElement( 'div' ) )
                    );

                }
            );

    }

})();

/**
 * @namespace tb.ui.Form
 */
tb.namespace( 'tb.ui', true ).Form = (function(){

    /**
     * Form constructor
     *
     * @class Form
     * @constructor
     *
     * @param pConfig
     */
    function Form( pConfig ){

        // var
        var that = this; // for minification purposes

        that.config = pConfig;

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

    Form.prototype = {

        /**
         * used to identify instance(s) via tb( /&lt;string&gt;/ )
         *
         * @property namespace
         * @type string
         * @static
         */
        namespace: 'tb.ui.Form',

        /**
         handles requirement loading, an array containing file name strings

         @property tb.require
         @type array
         @static
         */
        'tb.require': [
            '/tb/ui/Form.css'
        ],

        /**
         * @method render
         */
        render: render

    };

    return Form;

    // VARIABLES

    // PRIVATE FUNCTIONS
    /**
       * init handler
     *
     * @event init
     * @param e
     */
    function init( e ){
        var that = this;

        that.render();
    }

    /**
     * render function, both used in handlers and as a method
     *
     * @event render
     */
    function render(){

        var that = this,
            config = that.config;

        // clear content (in case of re-render )
        tb.dom( that.target )
            .empty();

        tb.dom( that.target )
            .attr( !!config.formAttributes ? config.formAttributes : {} ); // set form attributes

        // reset last field created before this one
        tb.ui.Field.prototype.prevField = false;

        // create fields
        if ( config.fieldSets ){

            // merge field definitions into fieldsets
            config
                .fieldSets
                .forEach(
                    function( fieldSet ){

                        // replace fields array in config with field definitions
                        fieldSet
                            .fields
                            .forEach(
                                function( value, key ){
                                    fieldSet.fields[key] = that.config.fields[value];
                                }
                            );

                        // make fieldset
                        new tb(
                            tb.ui.FieldSet,
                            fieldSet,
                            that.target.appendChild( document.createElement( 'fieldset') )
                        );
                    }
                );

        }

        // reset last field created before this one
        tb.ui.Field.prototype.prevField = false;

    }

})();
