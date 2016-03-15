/**
 @namespace tb.ui.FieldValidator
 */
tb.namespace( 'tb.ui', true ).FieldValidator = (function(){

    /**
     @namespace tb.ui.FieldValidator
     */

    // VARIABLES
    var FieldValidator; // to be returned later

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

    // VALIDATOR FUNCTION FACTORIES

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

            $.map(
                adresses,
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

    // OTHER FUNCTIONS

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
            .formValidator
            .trigger( 'onStartFieldValidation' );

        // execute beforeSubmit() validation
        that
            .config
            .$inputElement
            .one(
                'beforeSubmit',
                function(){
                    setTimeout(
                        function(){
                            that
                               .parents('form')[0]
                               .formValidator
                               .trigger( 'onEndFieldValidation' );

                        },
                        100
                    );
                }
            )
            .trigger( 'beforeSubmit' );

    }

    /**
     FieldValidator constructor

     @class tb.ui.FieldValidator
     @constructor

     @param pConfig
     */
    FieldValidator = function( pConfig ){

        var that = this,
            config = pConfig;

        that.config = config;

        that.handlers = {
            validate: validate
        };

        // VALIDATOR function factory
        // must be in here (inner function) to bind <that> correctly via closure
        function makeValidatorFunction( pStatus, pFunction, pMessage ){

            var f;

            f = function( value ){

                var $labelElement = that.config.$labelElement,
                    $inputElement = that.config.$inputElement,
                    $messageElement = that.config.$messageElement,
                    valid = pFunction( $inputElement.val()),
                    f = pFunction;

                // remove previous message
                $messageElement
                    .html( '' );

                // remove previous classes
                $.each(
                    classes,
                    function( statusName, statusClass ){
                        $labelElement.removeClass( statusClass );
                        $inputElement.removeClass( statusClass );
                        $messageElement.removeClass( statusClass );
                    }
                );

                // set message & visual class for this status code
                if ( !valid ){

                    $messageElement
                        // message is either defined as curry property on function, or standard given
                        .html( f['message'] ? f['message'] : pMessage )
                        .show();

                    if ( !!classes[ pStatus ] ){
                        $labelElement.addClass( classes[ pStatus ] );
                        $inputElement.addClass( classes[ pStatus ] );
                        $messageElement.addClass( classes[ pStatus ] );
                    }

                    // send status to form validator
                    that
                        .parents('form')[0]
                        .formValidator
                        .trigger(
                            'setStatus',
                            {
                                valid: valid,
                                status: pStatus,
                                input: $inputElement,
                                message: f['message'] ? f['message'] : pMessage,
                                label: $labelElement.html()
                            }
                        );

                }

                return valid;

            };

            return f;

        }

        // create validation functions and append them to input field
        $.each(
            config.validators, // <eventNames> property, format like jQ event names
            function( pEventName, pStatusCollection ){
                $.map(
                    [ 'error', 'warning', 'info' ], // types of errors
                    function( pStatusName ){


                        var // first validator function is the most urgent, others follow in sequence
                            // @todo: validate this...
                            functionCollection = config.validators[ pEventName ][ pStatusName ] || {};

                        // execute all validation handlers on this field
                        if ( !!functionCollection ) {
                            $.each(
                                functionCollection, // validation definition / functions
                                function( pFactoryName, pFactoryValue /* built-in factory parameter or function ! */ ){

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

})();

/**
 * @namespace tb.ui.FormValidator
 */
tb.namespace( 'tb.ui', true ).FormValidator = (function() {

    var FormValidator;

    // VARIABLES
    var messages = {
    };

    // PRIVATE FUNCTIONS
    /**
     form validate, handler & method

     @event validate
     @param ev {object} - the different callbacks to execute after validation
     */
    function validate( ev ){

        var that = this,
            data = ev.data;

        // console.log( 'formValidator::validate' );

        that.validateCallbacks = data;

        // reset form status
        that.status = {
            warning: [],
            error: []
        };

        // this indicates the number of field validations currently in progress
        that.fieldValidationCount = 0;

        // console.log( 'form fields', that.target.descendants( tb.ui.Field ), that );

        // trigger validation
        that
            .target
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

        // console.log(that.fieldValidationCount);
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
    function setStatus( ev ){

        var that = this,
            data = ev.data;

        if ( data.status === 'error' ){
            that.status.error.push( data );
        } else if ( data.status === 'warning' ){
            that.status.warning.push( data );
        }

    }

    /**
     FormValidator constructor

     @class tb.ui.FormValidator
     @constructor

     @param pConfig
     */
    FormValidator = function( pConfig ){

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
            setStatus: setStatus,
            validate: validate,
            onStartFieldValidation: onStartFieldValidation,
            onEndFieldValidation: onEndFieldValidation
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

})();

/**
 * @namespace tb.ui.Field
 */
tb.namespace( 'tb.ui', true ).Field = (function() {

    // VARIABLES
    var messages = {};

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
            $inputTag,
            $target = $(that.target);

        // clear content (in case of re-render )
        $target
            .children()
            .remove();

        // create field elements

        // label element
        if (!!config.label) {
            that.$labelElement = $('<label class="tb-ui-field-label" />').html(config.label);
            $target.append(that.$labelElement);
        }

        // hint element
        if (!!config.hint) {
            that.$hintElement = $('<span class="tb-ui-field-hint" />').html(config.hint);
            $target.append(that.$hintElement);
        }

        // input element
        if (!!config.tag) {

            that.$inputElement = $('<' + config.tag + ' class="tb-ui-field-tag" />')
                .attr(!!config[config.tag] ? config[config.tag] : {})
                .val(!!config.value ? config.value : '')
                .attr('name', !!config[config.tag].name ? config[config.tag].name : config.name);

            that.$inputElement.on(
                'focusin focus',
                function( e ){
                    // scoll field element into sight

                    that.direction = ''; // reset direction

                    that.trigger( 'scrollTo' );

                }
            );

            $target.append( that.$inputElement );

        }

        // attach custom input element(s)
        $.each(
            that.config,
            function( key, value ){
                if ( key.indexOf( '.' ) > -1 ) { // it is a namespace
                    // console.log( 'create Field input subelement:', key, value, that.$inputElement )
                    new tb(
                        key, // namespace of class as a string
                        value,
                        that.$inputElement
                    );
                }
            }
        );

        // keyhandler for direction
        that
            .$inputElement
            .on(
                'keypress',
                function( ev ){
                    var $input = $( this );

                    if ( ev.key === 'Tab' ){
                        that.direction = ev.shiftKey ? 'prev' : 'next';
                    } /* else if ( ev.keyCode === 13 ){
                     that.direction = 'next';
                     } */ else {
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

        // message element
        that.$messageElement = $('<span class="tb-ui-field-message" />').html(!!config.message ? config.message : '');
        $target.append(that.$messageElement);
        if (!!config.message) {
            that.$messageElement.hide();
        }

        // if masked input field -> hide alltogether @todo: refactor
        if (tb.namespace('input.type', false, config) === 'hidden') {
            $target
                .attr({
                    overflow: 'hidden',
                    height: '0'
                });
        } else {
            // get last field created before this one
            if ( tb.ui.Field.prototype.prevField ){
                tb.ui.Field.prototype.prevField.nextField = that; // this one is the next field
                that.prevField = tb.ui.Field.prototype.prevField; // my prev field is the one linked in the prototype
            }
        }

        // if validator defined -> attach validator
        if (!!that.config.validate) {

            // this validator is completely invisible in DOM structure!
            that.validator = new tb(
                tb.ui.FieldValidator,
                $.extend(
                    true,
                    {},
                    {
                        $labelElement: that.$labelElement,
                        $inputElement: that.$inputElement,
                        $messageElement: that.$messageElement,
                        validators: that.config.validate
                    }
                ),
                that.target
            );

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

        // console.log( 'field focus', that.$inputElement.attr('name') );

        that.trigger( 'scrollTo' ); // also in focus() but necessary

        that.$inputElement.trigger( 'focus' ); // jQ event

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


    /**
     Field constructor

     @class Field
     @constructor

     @param pConfig
     */
    var Field = function( pConfig ){

        // var
        var that = this,
            config;

        config = that.config = pConfig;

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
            init: init,
            render: render,
            focus: focus,
            scrollTo: scrollTo,
            validate: validate
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
         handles requirement loading, an array containing file name strings

         @property tb.require
         @type array
         @static
         */
        'tb.require': [
            '/namespace/tb/css/Form.css' /** @todo: export to path */
        ],

        /**
         renders field html
         @method render
         */
        render: render

    };

    return Field;

})();

/**
 * @namespace tb.ui.FieldSet
 */
tb.namespace( 'tb.ui', true ).FieldSet = (function(){

    // VARIABLES
    var messages = {
    };

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

        var that = this;

        // clear content (in case of re-render )
        $( that.target )
            .children()
            .remove();

        $.each(
            that.config.fields,
            function( key, value ){

                var field;

                if ( !value['name'] ){
                    value.name = key;
                }

                field = new tb(
                    tb.ui.Field,
                    value,
                    $( '<div />' ).appendTo( that.target )
                );

            }

        );

    }

    /**
     * FieldSet constructor
     *
     * @class FieldSet
     * @constructor
     *
     * @param pConfig
     */

    var FieldSet = function( pConfig ){

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
         * handles requirement loading, an array containing file name strings
         *
         * @property tb.require
         * @type array
         * @static
         */
        'tb.require': [
            // '/namespace/tb/ui/Input.js' /** @todo: export to path */
        ],

        /**
         * @method render
         */
        render: render

    };

    return FieldSet;

})();

/**
 * @namespace tb.ui.Form
 */
tb.namespace( 'tb.ui', true ).Form = (function(){

    // VARIABLES

    var messages = {
    };

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
            config = that.config;

        // clear content (in case of re-render )
        $( that.target)
            .attr( !!config.form ? config.form : {} ) // set form attributes
            .children()
            .remove();

        // reset last field created before this one
        tb.ui.Field.prototype.prevField = false;

        // create fields
        if ( config.fieldSets ){

            // merge field definitions into fieldsets
            $.each(
                config.fieldSets,  // for each fieldset
                function( fieldSetIndex, fieldSet ){

                    // replace fields array in config with field definitions
                    $.map(
                        fieldSet.fields,
                        function( value, key ){
                            fieldSet.fields[key] = that.config.fields[value];
                        }
                    );

                    // make fieldset
                    new tb(
                        tb.ui.FieldSet,
                        fieldSet,
                        $('<fieldset />').appendTo( that.target )
                    );
                }
            );

        }

        // reset last field created before this one
        tb.ui.Field.prototype.prevField = false;

    }

    /**
     * Form constructor
     *
     * @class Form
     * @constructor
     *
     * @param pConfig
     */

    var Form = function( pConfig ){

        // var
        var that = this; // for minification purposes

        that.config = pConfig;

        if ( that.config.formValidator ){
            that.formValidator = new tb(
                tb.ui.FormValidator,
                that.config.formValidator,
                that
            );
        }

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
         * handles requirement loading, an array containing file name strings
         *
         * @property tb.require
         * @type array
         * @static
         */
        'tb.require': [
            // '/namespace/tb/ui/Input.js' /** @todo: export to path */
        ],

        /**
         * @method render
         */
        render: render

    };

    return Form;

})();

