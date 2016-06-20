// simple objects...
demoapp.EmbeddedObject1 = function EmbeddedObject1( pConfig ){
};

demoapp.EmbeddedObject1.prototype = {
    namespace: 'demoapp.EmbeddedObject1',
    'demoapp.EmbeddedObject2': {}
};

demoapp.EmbeddedObject2 = function EmbeddedObject2( pConfig ){
    var that = this;

    that.handlers = {
        'init': function( e ){
            that.trigger( 'test', that, 'u');
        }
    }
};

demoapp.EmbeddedObject2.prototype = {
    namespace: 'demoapp.EmbeddedObject2'
};


tb.namespace( 'demoapp', true ).Child = (function(){

    // Constructor
    function Child( pConfig ){
        var that = this;

        that.handlers = {
            init,
            test
        };

    }

    // Prototype
    Child.prototype = {
        namespace: 'demoapp.Child',
        'demoapp.EmbeddedObject1': {}
    };

    return Child;

    // Methods
    function init( e ){
        var that = this;

        for ( var i=0; i<3; i++ ){
            new tb(
                'demoapp.GrandChild',
                {},
                that.target.appendChild( document.createElement("div") )
            );
        }
    }

    function test( e ){
        var that = this;

        if ( e.data.namespace === 'demoapp.EmbeddedObject2' ){
            e.stopPropagation();
        }
        console.info( 'Handler "test" in:', that.target, 'sender: ', e );
    }

})();
