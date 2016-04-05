// this is sample metacode, adapt for your needs

// sample template file content assumed to be:
/*

<div>
    <span>
        {a.a1}
    </span>
    <span>
        {a.a2}
    </span>
</div>
<div>
    {b.b1}
</div>

 */

tb.namespace( 'ns1.ns2', true ).someAppClass = (function(){

    var someAppClass,
        templateFilename = '/path/to/my/template.html',
        templateString;

    function init(){
        var that = this;

        templateString = tb.loader.get( templateFilename );   // initially get template string from loader

        that.render();
    }

    function render( pData ){
        var that = this,
            html,
            sampleData = pData || {
                a: {
                    a1: 'a1',
                    a2: 'a2'
                },
                b: {
                    b1: 'b1'
                }
            };

        html = tb.parse( templateString, sampleData );

        $( that ).append( html );
    }

    someAppClass = function( pConfig ){
        var that = this;

        that.handlers = {
            init: init
        };

    };

    someAppClass.prototype = {
        namespace: 'ns1.ns2.someAppClass',

        render: render,

        'tb.require': [
            templateFilename
        ]
    };

    return someAppClass;

})();