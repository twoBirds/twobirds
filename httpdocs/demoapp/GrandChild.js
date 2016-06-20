tb.namespace( 'demoapp', true ).GrandChild = (function(){

    // Constructor
    function GrandChild( pConfig ){
        var that = this;

        that.handlers = {
            init
        };

    }

    // Prototype
    GrandChild.prototype = {
        namespace: 'demoapp.GrandChild',

        'tb.require': [
            '/demoapp/GreatGrandChild.js'
        ]
    };

    return GrandChild;

    // Methods
    function init( e ){
        var that = this;

        for ( var i=0; i<2; i++ ){
            new tb(
                'demoapp.GreatGrandChild',
                {},
                that.target.appendChild( document.createElement("div") )
            );
        }
    }

})();
