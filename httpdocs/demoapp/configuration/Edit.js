/**
 @namespace demoapp.configuration
 */
tb.namespace( 'demoapp.configuration', true ).Edit = (function(){

    /**
     Edit constructor
     
     @class Edit
     @constructor
     
     @param pConfig
     */

    var Edit = function( pConfig ){
        var that = this; // for minification purposes

        // all parameters from URL -> router.getParams()
        that.config = pConfig;

        that.handlers = {
            init,
            render
        };

        // configuration crud model
        that.configurationModel = new tb.Model({
            'read': {
                url: '/demoapp/configuration/mock/demoapp-configuration-editData.json', // mock data
                method: 'GET',
                type: 'json',
                params: {
                    ConfigurationID: 1
                },
                success: function editDataReadSuccess( pResult ){
                    that.configurationModel.data( JSON.parse( pResult.text ) );
                }
            }
        });

    };

    Edit.prototype = {

        /**
         used to identify instance(s) via tb( /&lt;string&gt;/ )
         
         @property namespace
         @type string
         @static
         */
        namespace: 'demoapp.configuration.Edit',

        /**
         handles requirement loading, an array containing file name strings
         
         @property tb.require
         @type array
         @static
         */
        'tb.require': [
            '/demoapp/configuration/Edit.css',
            '/demoapp/configuration/mock/demoapp-configuration-editFormMessages.json',
            '/demoapp/configuration/mock/demoapp-configuration-editFormConfig.json'
        ],

        /**
         @method save
         */
        save: save,

        /**
         @method warn
         */
        warn: warn,

        /**
         @method error
         */
        error: error,

        /**
         @method render
         */
        render: render,

        /**
         @method setTitle
         */
        setTitle: setTitle

    };

    return Edit;

    
    
    // VARIABLES
    var formConfig, // form configuration object
        messages; // messages array

    // PRIVATE FUNCTIONS
    
    /**
     @for demoapp.configuration.Edit
     */

    /**
     init handler
     
     @event init
     */
    function init(){

        var that = this;

        // set messages as read in tb.require
        messages = tb.loader.get( '/demoapp/configuration/mock/demoapp-configuration-editFormMessages.json' );
        
        // read data ( triggers new form rendering )
        that.configurationModel.data.observe(function(){
            that.trigger( 'render' );
        });

        that.configurationModel.read({
            ConfigurationID: 1 // will not be processed in this example
        });

    }

    /**
     render function, both used in handlers and as a method
     
     @event render
     */
    function render() {

        var that = this,
            data = that.configurationModel.data(),
            title = !!data ? messages['edit configuration'] : messages['create configuration'],
            formData;

        // form configuration object
        formConfig = tb.loader.get('/demoapp/configuration/mock/demoapp-configuration-editFormConfig.json');
        formConfig.model = that.configurationModel;

        // add title div
        that.target.innerHTML = '<div class="demoapp-configuration-form-title"></div>';
        that.setTitle(title);

        // make a copy of the configuration object
        formData = tb.extend({}, formConfig);

        // replace message placeholders
        formData = tb.parse(formData, messages);

        // merge data into fields @todo:put in method
        for (var i in data.data) {

            if (!!formData.fields.hasOwnProperty(i)) {
                tb.namespace('tagAttributes', true, formData.fields[i]); // create if necessary
                formData.fields[i].tagAttributes.value = data.data[i]; // add value to field defnition
            } else {
                console.warn('error processing data for input field', i);
            }

        }

        // now create the form
        form = new tb(
            'tb.ui.Form',
            formData,
            that.target.appendChild( document.createElement('form') )
        );

    }

    // private functions
    
    /**
     save function
     */
    function save( pStatus ){

        var that = this,
            data = tb.dom('form[name="configurationForm"]').serializeForm(), // @todo: add this method
            parameters = {};

        data
            .forEach(
                function( pValue ){
                    parameters[ pValue.name ] = pValue.value;
                }
            );

        that.configurationModel.update( parameters );

    }

    /**
     warn function
     */
    function warn( pStatus ){
        var that = this;

        // @todo: not really functional yet since not required

    }

    /**
     error function
     */
    function error( pStatus ){

        var that = this,
            errors = pStatus.error;

        // set focus to first false input field
        errors[0].input.focus();

    }
    
    /**
     setTitle function, both used in handlers and as a method
     *
     @event render
     */
    function setTitle( pTitle ){
        tb.dom( '.demoapp-configuration-form-title' ).html( pTitle );
    }

})();
