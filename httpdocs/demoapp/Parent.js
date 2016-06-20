tb.namespace( 'demoapp', true ).Parent = (function(){

    // Constructor
    function Parent( pConfig ){
        var that = this;

        that.handlers = {
            init
        };

    }

    // Prototype
    Parent.prototype = {
        namespace: 'demoapp.Parent'
    };

    return Parent;

    // Methods
    function init( e ){
        var that = this;

        for ( var i=0; i<10; i++ ){
            new tb(
                'demoapp.Child',
                {},
                that.target.appendChild( document.createElement("div") )
            );
        }
    }

})();
