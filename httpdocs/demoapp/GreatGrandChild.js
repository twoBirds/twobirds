tb.namespace( 'demoapp', true ).GreatGrandChild = (function(){

    // Constructor
    function GreatGrandChild( pConfig ){
        var that = this;

        that.handlers = {
            init
        };

    }

    // Prototype
    GreatGrandChild.prototype = {
        namespace: 'demoapp.GreatGrandChild'
    };

    return GreatGrandChild;

    // Methods
    function init( e ){
        var that = this;

        //that.trigger( 'test', that, 'u' );
    }

})();
