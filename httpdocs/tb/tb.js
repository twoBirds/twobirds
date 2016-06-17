/**
 * twoBirds V7 core functionality
 *
 * @author          frank.thuerigen <frank_thuerigen@yahoo.de>
 * @copyright       copyright (c) 2006- Frank Thürigen
 * @license         http://www.gnu.org/copyleft/gpl.html GNU GPL v3
 *
 */

tb = (function(){

    //private

    /**
     * tb.dom() function
     *jquery like selector engine
     *
     * @function DOM
     * @namespace tb
     * @static
     *
     * @param {string|domNode|array} a selector string, a dom node or an array of dom nodes
     * @return {string} - result string
     */
    var dom;
    dom = (function () {
        return function (pSelector, pDomNode) {

            var dom;

            // dom constructor
            dom = function (pSelector, pDomNode) {

                var that = this,
                    domNode,
                    nodeList;

                if (!pSelector) { // no selector given, or not a string
                    return;
                } else if (!!pSelector['nodeType']) { // selector is a dom node
                    [].push.call(that, pSelector);
                    return;
                } else if (!!pSelector[0] && pSelector[0] instanceof TbSelector) { // a twobirds selector result set
                    [].forEach.call(
                        pSelector,
                        function (pElement) {   // copy only DOM nodes
                            if (!!pElement['target']
                                && !!pElement['target']['nodeType']
                            ) {
                                [].push.call(that, pElement);
                            }
                        }
                    );
                    return;
                } else if (pSelector instanceof Array) {
                    [].forEach.call(
                        pSelector,
                        function (pElement) {   // copy only DOM nodes
                            if (!!pElement && !!pElement['nodeType']) {
                                [].push.call(that, pElement);
                            }
                        }
                    );
                    return;
                } else if (typeof pSelector !== 'string') { // wrong selector type
                    return;
                }

                domNode = pDomNode && !!pDomNode['nodeType'] ? pDomNode : document;

                nodeList = domNode.querySelectorAll(pSelector);

                if (!!nodeList.length) {
                    [].forEach.call(
                        nodeList,
                        function (domElement) {
                            that[that.length] = domElement;
                            that.length++;
                        }
                    );
                }

            };

            // dom prototype, public functions
            dom.prototype = {

                length: 0,

                // from Array prototype
                concat: [].concat,
                every: [].every,
                forEach: [].forEach,
                indexOf: [].indexOf,
                keys: [].keys,
                lastIndexOf: [].lastIndexOf,
                map: [].map,
                pop: [].pop,
                reduce: [].reduce,
                reduceRight: [].reduceRight,
                reverse: [].reverse,
                shift: [].shift,
                slice: [].slice,
                some: [].some,
                splice: [].splice,
                unshift: [].unshift,

                //own functions
                add: add,
                addClass: addClass,
                attr: attr,
                hide: hide,
                html: html,
                removeClass: removeClass,
                filter: filter,
                not: not,
                parents: parents,
                push: push,
                show: show,
                toArray: toArray,
                unique: unique
            };

            return new dom(pSelector, pDomNode);

            // private functions
            function html( pHtml ) {
                var that = this;

                if ( !!pHtml ){
                    that.forEach(
                        function( pNode ){
                            pNode.innerHTML = pHtml;
                        }
                    )
                } else {
                    return !!that[0] ? that[0].innerHTML : '';
                }
                return that;
            }

            function hide() {
                var that = this;

                that.forEach(
                    function( pNode ){
                        pNode.style.prevDisplay = ([ '', 'none']).indexOf( pNode.style.display ) === -1
                            ? pNode.style.display
                            : '';
                        pNode.style.display = 'none';
                    }
                );

                return that;
            }

            function show() {
                var that = this;

                that.forEach(
                    function( pNode ){
                        pNode.style.display = pNode.style.prevDisplay;
                    }
                );

                return that;
            }

            function unique() {
                var that = this,
                    result = [];

                result = that.filter(
                    function (pElement) {
                        return result.indexOf(pElement) === -1;
                    }
                );

                return dom(result);
            }

            function not(pSelector) {
                var that = this,
                    result = new dom(),
                    compare = new dom(pSelector);

                that.forEach(function (pElement) {
                    if (-1 === compare.indexOf(pElement)) {
                        result.add(pElement);
                    }
                });

                return result;
            }

            function add(pElements) {
                var that = this,
                    result;

                if (pElements instanceof Array) { // if array given add each of its elements
                    pElements.forEach(
                        function (pElement) {
                            that.add(pElement);
                        }
                    );
                } else if (!!pElements['nodeType']) { // if DOM node given add it
                    that.push(pElements);
                } else if (typeof pElements === 'string') { // DOM selector given add its results
                    that.add(new dom(pElements).toArray());
                }

                result = that.unique();

                return result;
            }

            function parents(pSelector) {

                var that = this,
                    result = new dom(),
                    nextNode;

                that.forEach(
                    function (pDomNode) {
                        var domNode = pDomNode.parentNode;

                        while (!!domNode
                        && !!domNode['tagName']
                        && domNode['tagName'] !== 'html'
                            ) {
                            nextNode = domNode.parentNode;
                            if ([].indexOf.call(result, domNode) === -1) {
                                result.push(domNode);
                            }
                            domNode = nextNode;
                        }
                    }
                );

                if (!!pSelector) {
                    result = result.filter(pSelector);
                }

                return result;
            }

            function addClass(pClassName) {

                var that = this,
                    rootNodes = that.toArray();

                rootNodes.forEach(
                    function (pNode) {
                        var classes = pNode.getAttribute('class') || '',
                            classes = !!classes.length ? classes.split(' ') : [],
                            index = classes.indexOf(pClassName);

                        if (index === -1) {
                            pNode.setAttribute('class', !!classes.length ? classes + ' ' + pClassName : pClassName);
                        }
                    }
                );

                return that;
            }

            function removeClass(pClassName) {

                var that = this,
                    rootNodes = that.toArray();

                rootNodes.forEach(
                    function (pNode) {
                        var classes = pNode.getAttribute('class') || '',
                            classes = !!classes.length ? classes.split(' ') : [],
                            index = classes.indexOf(pClassName);

                        if (index !== -1) {
                            classes.splice(index, 1);

                            pNode.setAttribute('class', classes.join(' '));

                        }

                    }
                );

                return that;
            }

            function attr(pKey, pValue) {

                var that = this,
                    rootNodes;

                if (!pValue && that.length > 0) { // if no value is given and there are elements, return attribute value of first in list
                    return that[0].getAttribute(pKey);
                }

                // if a value to set is given, apply to all nodes in list
                rootNodes = that.toArray();
                rootNodes.forEach(
                    function (pNode) {
                        if ( pKey.constructor === Object ){
                            Object
                                .keys( pKey )
                                .forEach(
                                    function( pValue, pKey ){
                                        pNode.setAttribute(pKey, pValue);
                                    }
                                );
                            return;
                        } else {
                            pNode.setAttribute(pKey, pValue);
                        }
                    }
                );

                return that;
            }

            function toArray() {

                var that = this,
                    result = [];

                if (!!that.length) {
                    [].map.call(
                        that,
                        function (pElement) {
                            result.push(pElement);
                        }
                    );
                }

                return result;

            }

            function filter(pSelector) {

                var that = this,
                    compare = new dom(pSelector),// functions and undefined will be ignored, so empty result then
                    result;

                if (pSelector === 'undefined') return that;    // unchanged

                //console.log( 'filter', that, 'using pSelector', compare );
                if (typeof pSelector === 'string') { // DOM selector given
                    result = [].filter.call(
                        that,
                        function (pElement) {
                            return -1 < compare.indexOf(pElement);
                        }
                    );
                    //console.log( 'after [].filter.call() result => ', result );
                } else if (typeof pSelector === 'function') { // function given
                    //console.log( 'filter compare', that, 'with selector result ', pSelector );
                    result = [].filter.call(
                        that,
                        pSelector
                    );
                }

                //console.log( 'result, new dom', result, new tb.dom( result ) );

                return new dom(result);

            }

            function push(pSelector) {

                var that = this,
                    result = [];

                if (typeof pSelector === 'undefined') return that;    // unchanged

                if (pSelector instanceof Array) { // if array given add each of its elements
                    pSelector.forEach(
                        function (pElement) {
                            that.push(pElement);
                        }
                    );
                } else if (!!pSelector['nodeType']) { // if DOM node given add it
                    [].push.call(that, pSelector);
                } else if (typeof pSelector === 'string') { // DOM selector given add its results
                    that.push(new dom(pSelector).toArray());
                }

                result = that.unique();

                return result;
            }

        };
    })();


    /**
     * standard twobirds event, internal use only
     *
     * @class TbEvent
     * @constructor
     * @private
     * @ignore
     *
     * @param {string} pEventName - name of event
     * @param {*} [pEventData] - data to be appended to this event
     * @param {string} [pBubble=l] - bubbling indicator, 'l' = local, 'u' = up, 'd' = down or any combination
     *
     * @return {object} TbEvent instance
     */
    function TbEvent( pEventName, pEventData, pBubble ){
        var that = this;
        that.bubble = pBubble || 'l';
        that.data = pEventData || {};
        that.name = pEventName || '';
        that.__stopped__ = that.__immediateStopped__ = false;
    }

    TbEvent.prototype = {

        /**
         * stop propagation after all handlers on this object have run
         *
         * @method stopPropagation
         *
         * @return {object} TbEvent object
         */
        stopPropagation: function(){
            this.__stopped__ = true;
            return this;
        },

        /**
         * stop propagation immediately after this handler has run
         *
         * @method stopImmediatePropagation
         *
         * @return {object} TbEvent object
         */
        stopImmediatePropagation: function(){
            this.stopPropagation(); // also stop normal propagation
            this.__immediateStopped__ = true;
            return this;
        }

    };

    /**
     * TbSelector constructor, internal use only
     *
     * creates an array-like object containing the tb objects defined by pSelector parameter
     *
     * sample calls:
     * new TbSelector( '' )
     * - create an empty result set
     * new TbSelector( 'div.myClass' )
     * - returns all tb objects that were in the selected DOM elements.
     * - uses jQuery to find DOM elements, so parameter equals jQuery selector string.
     * new TbSelector( /ns1.ns2.myClassName/ )
     * - returns all tb elements (e.g. namespace ns1.ns2.myClassName) in current DOM,
     * - matches namespace property with regex.
     * new TbSelector( '*' )
     * new TbSelector( /./ )
     * - all tb elements in DOM
     * new TbSelector( document.body )
     * - selection by DOM node
     * new TbSelector( ns1.ns2.<className> )
     * - all tb elements in current DOM that are instances of the given class
     *
     * @class TbSelector
     * @constructor
     * @chainable
     * @private
     *
     * @param {string | regEx | constructor} pSelector - multiple selector types
     *
     * @return {object} TbSelector instance, array-like object
     */
    function TbSelector( pSelector ){

        var that = this,
            tbElements = [];

        that.length = 0;

        switch (typeof pSelector) {

            // selection by dom selector string
            case 'string':

                tb.dom( pSelector )
                    .filter('[data-tb]')
                    .filter(
                        function ( pDomNode ) {

                            var namespaces = pDomNode.getAttribute( 'data-tb' ).split( ' ' );

                            if ( !!namespaces['0'] ) {
                                namespaces.forEach(
                                    function (pNamespace) {
                                        if ( !!pDomNode[pNamespace]
                                            && pDomNode[pNamespace] instanceof tb
                                        ) {
                                            tbElements.push(pDomNode[pNamespace]);
                                        }
                                    }
                                );
                            }
                        }
                    );

                break;

            case 'object':  // either regEx or nodeType

                if ( pSelector instanceof RegExp ){ // it is a regular expression

                    tb.dom( '[data-tb]' )
                        .map(
                            function ( pDomNode ) {

                                var namespaces = pDomNode.getAttribute( 'data-tb' ).split( ' ' );

                                if ( !!namespaces['0'] ){
                                    namespaces.forEach(
                                        function( pNamespace ){
                                            if ( !!pNamespace.match(pSelector) && !!pDomNode[pNamespace] ){
                                                tbElements.push( pDomNode[ pNamespace ] );
                                            }
                                        }
                                    );
                                }

                            }
                        );

                } else if ( !!pSelector['nodeType'] ){ // it is a dom node

                    tb.dom( pSelector )
                        .map(
                            function ( pDomNode ) {

                                var namespaces = pDomNode.getAttribute( 'data-tb').split( ' ' );

                                if ( !!namespaces['0'] ) {
                                    namespaces.forEach(
                                        function (pNamespace) {
                                            if ( pNamespace.match(pSelector)
                                                && !!pDomNode[pNamespace]
                                                && !!pDomNode[pNamespace] instanceof tb
                                            ){
                                                tbElements.push(pDomNode[pNamespace]);
                                            }
                                        }
                                    );console.log( tbInstance );
                
                                }
                            }
                        );

                }

                break;

            // selection by constructor: get all tb instances from DOM,
            // check whether their prototype matches constructor prototype
            case 'function':

                tb.dom( '[data-tb]' )
                    .map(
                        function ( pDomNode ) {

                            var namespaces = pDomNode.getAttribute( 'data-tb').split( ' ' );

                            if ( !!namespaces['0'] ) {
                                namespaces.forEach(
                                    function( pNamespace ){
                                        if ( !!pDomNode[pNamespace]
                                            && pDomNode[pNamespace] instanceof tb
                                            && pDomNode[pNamespace] instanceof pSelector
                                        ){
                                            tbElements.push( pDomNode[pNamespace] );
                                        }
                                    }
                                );
                            }

                        }
                    );

                break;
        }

        // add all tb instances from dom into selector
        tbElements.map(
            function ( pTbObject ) {
                [].push.call( that, pTbObject );
            }
        );

        return that;

    }

    // empty class def for temporary handler storage, needed for on(), one(), off() and trigger()
    function Nop(){};
    Nop.prototype = {};

    // HINT: TbSelector (class) prototype definition after Tb prototype definition

    /**
     * tb() / new tb()
     * can be used as SELECTOR and CONSTRUCTOR
     *
     * sample call CONSTRUCTOR:
     * var a = new tb( 'tb_repo_object_namespace' )
     *
     * sample call SELECTOR:
     * var result = tb( 'div#app' )
     *
     * for selector functionality see TbSelector object
     *
     * @class tb
     * @constructor
     * @extends TbSelector
     *
     * @param {string}     arguments[0]   - namespace of class | TbSelector parameter
     * @param {*}  [ arguments[1] ] - config data ( if called as constructor )
     * @param {*}  [ arguments[2] ] - DOM target or parent tb instance
     *
     * @return {object} - twoBirds Object or TbSelector instance /w results
     *
     */
    function tb() {
        var that = this;

        /*
         arguments[0]: string, regEx or constructor function
         arguments[1]: optional object, parameter hash object if arguments[0] is constructor function
         arguments[2]: optional DOM node or parent tb object
         */

        function makePrototype( pPrototype ){

            // make custom class constructor
            var f = function ( pPrototype ){

                var that = this;

                for ( var i in pPrototype ) if ( pPrototype.hasOwnProperty(i) ){
                    that[i] = pPrototype[i];
                }

            };

            f.prototype = tb.prototype;

            return new f( pPrototype );
        }

        // merge handlers from temp instance into target object
        function mergeHandlers( pSourceTb , pTargetTb ){
            for ( var i in pSourceTb.handlers ) if ( pSourceTb.handlers.hasOwnProperty(i) ){
                if ( !pTargetTb.handlers[i] ){
                    pTargetTb.handlers[i] = [];
                }
                for ( var j = 0, l = pSourceTb.handlers[i].length; j < l; j++ ){
                    pTargetTb.handlers[i].push( pSourceTb.handlers[i][j] ); // copy handler
                }
            }
        }

        if ( that instanceof tb ) {    // called as constructor, create and return tb object instance
            var isNamespace = typeof arguments[0] === 'string',
                tbClass =  isNamespace ? tb.namespace( arguments[0] ) : arguments[0],
                tbInstance,
                fileName,
                tempInstance; // empty tb object, used as handler store

            if ( isNamespace && !tbClass ){
                fileName = arguments[0].replace( /\./g, '/' ) + '.js';
                tempInstance = new tb( Nop ); // construct temp tb instance from empty constructor -> temp handler store

                tb.loader.load(
                    fileName,
                    (function( args ){
                        return function(){
                            var thisTb = new tb(
                                args[0],
                                args[1] || {},
                                args[2] || false
                            );

                            if ( !!tempInstance ){

                                // copy properties from tempInstance, always shallow copy
                                for ( var i in tempInstance ) if (
                                    (['handlers', 'target']).indexOf(i) === -1
                                    && tempInstance.hasOwnProperty(i)
                                ){
                                    thisTb[i] = tempInstance[i];
                                }

                                mergeHandlers( tempInstance, thisTb );

                            }

                        };
                    })( [].slice.call( arguments ) )
                );

                return tempInstance; // return temp instance so handlers can be attached
            }

            // it is a constructor call, like "new tb(...)"
            if ( typeof tbClass === 'function' ){

                // prepare
                if ( !tbClass.prototype.__tb__ ){
                    tbClass.prototype.__tb__ = 'V7.0a';
                    tbClass.prototype = makePrototype( tbClass.prototype, tbClass );
                }

                // make a new instance of given constructor
                tbInstance = new tbClass( arguments[1] || {}, arguments[2] ); // hidden parameter target

                // prepare .namespace property of tb object
                if ( !tbInstance.namespace ){
                    tbInstance.namespace = typeof arguments[0] === 'string'
                        ? arguments[0]
                        : arguments[0].namespace || tb.getId(); // if nothing helps, a unique id
                }

                // prepare .target property of tb object
                tbInstance.target = arguments[2] || false; // preset
                if ( !!arguments[2] ){
                    if ( !arguments[2]['nodeType']
                        && !!arguments[2][0]
                        && !!arguments[2][0]['nodeType']
                    ){
                        arguments[2] = arguments[2][0]; // get first element of an array-like selector return object
                    }

                    tbInstance.target = arguments[2];
                } else {
                    tbInstance.target = null;
                }

                // if target is a DOM element
                // - add class to DOM data
                // - if not already there add namespace to target data-tb attribute
                if ( tbInstance.target && tbInstance.target.nodeType ){

                    // put tb instance in dom node
                    tbInstance.target[ tbInstance.namespace ] = tbInstance;

                    // if element does not reside in the DOM <head> add class
                    var dom = tb.dom( tbInstance.target );

                    // add class
                    if ( tbInstance.target.nodeName !== 'head'
                        && dom.parents().toArray().indexOf( document.head ) === -1 )
                    {
                        dom.addClass( tbInstance.namespace.replace( /\./g, '-').toLowerCase() );
                    }

                    // add namespace to DOM "data-tb" attribute
                    if ( !!tbInstance.target && !!tbInstance.target['nodeType'] ){
                        var dataTb = tbInstance.target.getAttribute( 'data-tb' );
                        if ( !!dataTb && !!dataTb.length && -1 === dataTb.split(' ').indexOf( tbInstance.namespace ) ){
                            tbInstance.target.setAttribute( 'data-tb', dataTb + ' ' + tbInstance.namespace );
                        } else {
                            tbInstance.target.setAttribute( 'data-tb', tbInstance.namespace )
                        }
                    }
                }

                // create handlers array if necessary
                if ( !tbInstance[ 'handlers' ] ){
                    tbInstance.handlers = {};
                } else {
                    // if there are single named event handler functions,
                    // convert them to array of functions
                    for ( var i in tbInstance.handlers ) if ( tbInstance.handlers.hasOwnProperty(i) ){
                        if ( typeof tbInstance.handlers[i] === 'function' ){
                            tbInstance.handlers[i] = [ tbInstance.handlers[i] ];
                        } else if ( !( tbInstance.handlers[i] instanceof Array ) ){
                            delete tbInstance.handlers[i];
                        }
                    }
                }

                // add property declared classes (prop contains ".") as tb objects
                for ( var key in tbInstance ) if ( !tbInstance.hasOwnProperty( key ) ) {
                    if ( typeof key === 'string'
                        && key.indexOf( '.' ) > -1
                    ){ // prop name contains ".", treat as tb class
                        tbInstance[key] = new tb( key, tbInstance[key], tbInstance );
                    }
                }

                // trigger init directly if no requirement array
                if ( !tbInstance['tb.require'] ) {
                    tbInstance.trigger( 'init' );
                } // otherwise tb.require will trigger it

                return tbInstance;

            }

        } else { // arguments[0] is string or regex, return selector result

            return new TbSelector( !!arguments[0] ? arguments[0] : '' );

        }

    }

    tb.dom = dom;

    /**
     * walk all pSelector tb objects, call pMethodName on them
     * return a UNIQUE TbSelector result set containing all single results
     *
     * @function walkSelector
     * @private
     *
     * @param {object} pSelectorObject - instanceOf TbSelector
     * @param {string} pMethodName - name of method to call
     * @param {*} [pArguments] - arguments
     *
     * @return {object} instance of TbSelector
     */
    function walkSelector( pSelectorObject, pMethodName, pArguments ){
        var that = this,
            result,
            ret = tb( '' ); // empty tb selector object

        if ( pSelectorObject instanceof TbSelector ) {
            [].forEach.call(
                [].map.call( pSelectorObject, function( pElement, pKey ){
                    if ( pSelectorObject.hasOwnProperty( pKey ) ){
                        return pSelectorObject[ pKey ];
                    }
                }),
                function walkSelectorEach( pTbObject, pKey ) {
                    result = pTbObject[pMethodName].apply( pTbObject, [].slice.call( pArguments ) );

                    [].forEach.call(
                        result,
                        function( pResultObject ){
                            if ( [].indexOf.call( ret, pResultObject ) === -1 ){
                                [].push.call( ret, pResultObject );
                            }
                        }
                    );
                }
            );
        }
        return ret;
    }

    tb.prototype = (function(){
        // private static

        function _toArray( pTbSelector ){
            if ( pTbSelector && pTbSelector instanceof tb ){
                return [].map.call(
                    pTbSelector,
                    function ( pElement ){
                        return pElement;
                    }
                );
            }
            return [];
        }

        return {
            // public methods and properties

            /**
             * set() method
             *
             * set an instance property
             *
             * @method set
             *
             * @param {string} [pKey] - name of the property
             * @param [pValue] - any kind of value associated with the key
             *
             * @return {object} - TbSelector instance
             */
            set: function( pKey, pValue ){

                var that = this;

                if ( that instanceof TbSelector ) {

                    [].forEach.call(
                        that,
                        function( pElement ){
                            pElement.set( pKey, pValue );
                        }
                    );

                    return that;

                } else if ( that instanceof tb ){

                    that[pKey] = pValue;

                }

                return that;
            },

            /**
             * get() method
             *
             * get an instance property
             *
             * @method get
             *
             * @param {string} [pKey] - name of the property
             *
             * @return {object} - TbSelector instance
             */
            get: function( pKey, undefined ){

                var that = this;

                if ( that instanceof TbSelector ) {

                    return that[0][ pKey ];

                } else if ( that instanceof tb ){

                    return that[ pKey ];

                }

                return undefined;
            },

            /**
             * trigger an event, optionally with data and bubble indicator
             *
             * @method trigger
             *
             * @param {string|object} pEvent - name of event or TbEvent instance or TbEvent instance
             * @param {*} [pEventData] - event data, usally an object
             * @param {string} [pBubble=l] - bubbling indicator : 'l' = local, 'u' = up, 'd' = down or any combination
             *
             * @return {object} - (this) -> TbSelector instance or tb object
             */
            trigger: function( pEvent, pEventData, pBubble ){
                var that = this,
                    tbEvent;

                if( tb.stop() ){ // @todo rethink this
                    // console.info( 'stopped TbEvent', arguments );
                    return;
                }

                // construct event if necessary
                tbEvent = pEvent instanceof TbEvent ? pEvent : new TbEvent( pEvent, pEventData, pBubble );

                // if event __stopped__ , handling is cancelled
                if ( tbEvent.__stopped__  ) {
                    return that;
                }

                // execute local handlers
                if ( that instanceof TbSelector && !!that['length'] ) {

                    [].forEach.call(
                        that,
                        function( tbInstance ){
                            if ( !!tbInstance
                                && tbInstance instanceof tb
                                && !tbEvent.__immediateStopped__
                            ){
                                tbInstance.trigger( tbEvent );
                            }
                        }
                    );

                } else if ( that instanceof tb ) { // it must be a native tb object

                    if ( that instanceof Nop
                        && tbEvent.name !== 'init'
                    ){
                        // its an object that was not loaded yet
                        that.one(
                            'init',
                            function lazyHandler(){
                                var that = this;

                                that.trigger( tbEvent );
                            }
                        );
                        return that;
                    }

                    // local handlers
                    if ( !!that.handlers[tbEvent.name] && tbEvent.bubble.indexOf( 'l' ) > -1 ) {

                        var temp = [];

                        that.handlers[tbEvent.name].map(
                            function (handler) {

                                if ( tbEvent.bubble.indexOf('l') > -1
                                    && !tbEvent.__immediateStopped__
                                    && !!handler
                                ){
                                    handler.apply(that, [tbEvent]);

                                    if ( !handler.once ) {
                                        temp.push( handler );
                                    }
                                }

                            }
                        );

                        that.handlers[tbEvent.name] = temp;

                    }

                    // if event __stopped__ , handling is cancelled
                    if ( !!tbEvent.__stopped__  ) {
                        return that;
                    }

                    setTimeout(
                        function(){

                            // bubble up
                            if ( tbEvent.bubble.indexOf('u') > -1 ){
                                tbEvent.bubble += tbEvent.bubble.indexOf('l') === -1 ? 'l' : '';
                                //console.log( 'bubble event', tbEvent, 'up to', that.parent() );
                                var done = false,
                                    tbObject = that;

                                while ( !done && !!tbObject ){
                                    var tbObject = tbObject.parent()[0] || false;

                                    if ( !!tbObject['handlers']
                                        &&tbObject.handlers[ tbEvent.name ]
                                    ){
                                        tbObject.trigger( tbEvent );
                                    }
                                }
                            }

                            // bubble down
                            if ( tbEvent.bubble.indexOf('d') > -1 ){
                                tbEvent.bubble += tbEvent.bubble.indexOf('l') === -1 ? 'l' : '';
                                //console.log( 'bubble event', tbEvent, 'down to', that.children() );
                                [].map.call(
                                    that.children().toArray(),
                                    function( tbObject ){
                                        if ( tbObject.handlers[ tbEvent.name ] ){
                                            tbObject.trigger(
                                                new TbEvent(
                                                    tbEvent.name,
                                                    tbEvent.data,
                                                    tbEvent.bubble
                                                )
                                            );
                                        }
                                    }
                                );
                            }

                        },
                        10
                    )

                }

                return that;

            },

            /**
             * parents() method
             * for each this[0...n] or this as tb() instance,
             * - get all parent tb objects
             * - check them against the filter param pSelector
             * - return them as a TbSelector result set (unique)
             *
             * @method parents
             *
             * @param {*} [pSelector] - any kind of TbSelector parameter
             *
             * @return {object} - TbSelector instance
             */
            parents: function( pSelector ){
                var that = this,
                    ret = tb();

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( that, 'parents', arguments );

                } else if ( that instanceof tb
                    && !!that.target
                ){ // it is a tb object

                    if ( !!that.target['nodeType'] ){
                        // it must be a native toplevel tb object residing in the DOM
                        tb.dom( that.target )
                            .parents( '[data-tb]' )
                            .not( 'html' )
                            .toArray()
                            .forEach(
                                function( pElement ){
                                    pElement
                                        .getAttribute('data-tb')
                                        .split( ' ' )
                                        .forEach(
                                            function( pNamespace ){
                                                var tbElement = pElement[ pNamespace ] || null;

                                                if ( tbElement ){
                                                    [].push.call( ret, tbElement ); // push dom object to tb selector content
                                                }
                                            }
                                        )
                                }
                            );

                    } else if ( that.target instanceof tb ){
                        // it a tb object embedded in another tb object

                        [].push.call( ret, that.target ); // push parent object to tb selector content

                        if ( !!that.target.parent()['0'] ){
                            [].push.call( ret, that.target.parent()['0'] )
                        }

                    }


                }

                return pSelector ? ret.filter( pSelector ) : ret;

            },

            /**
             * parent() method
             *
             * for each this[0...n] or this as tb() instance,
             * - get closest parent tb object
             *
             * - check all of them against the filter param pSelector
             * - return TbSelector result set (unique)
             *
             * @method parent
             *
             * @param {*} [pSelector] - any kind of TbSelector parameter
             *
             * @return {object} - TbSelector instance
             */
            parent: function( pSelector ){

                var that = this,
                    ret = tb(),
                    result = [];

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( that, 'parent', arguments );

                } else if ( that instanceof tb
                    && !!that.target
                ){

                    if ( !!that.target['nodeType'] ) { // tb object resides in DOM

                        var tbParent = that.parents()['0'] || false;

                        if ( !tbParent ){

                            return ret; // no parent -> empty result set
                        }

                        for (var i in tbParent.target ){
                            if ( tbParent.target[i] instanceof tb ){
                                [].push.call( ret, tbParent.target[ i ] ); // push dom object to tb selector content
                            }
                        }

                    } else if ( that.target instanceof tb ){ // it is an embedded object, local target is another (parent) tb object

                        [].push.call( ret, that.target ); // push parent object to tb selector content

                    }

                }

                return !!pSelector ? ret.filter( pSelector ) : ret;
            },

            /**
             * descendants() method
             *
             * for each this[0...n] or this as tb() instance,
             * - get all descendants of tb object
             * - check them against the filter param pSelector
             * - return TbSelector result set (unique)
             *
             * @method descendants
             *
             * @param {variant} [pSelector] - any kind of TbSelector parameter
             * @param {boolean} [pLocalOnly] - only local descendants of given tb instance
             *
             * @return {object} - TbSelector instance
             */
            descendants: function( pSelector, pLocalOnly ){

                var that = this,
                    ret = tb();

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( this, 'descendants', arguments );

                } else if ( that instanceof tb && !!that.target.nodeType && !pLocalOnly ) { // it must be a native tb object

                    tb.dom( '[data-tb]', that.target )
                        .forEach(
                            function( pDomElement ) {
                                for (var i in pDomElement ) {
                                    if ( pDomelement.hasOwnProperty[i] && pDomElement[i] instanceof tb) {
                                        [].push.call(ret, pDomElement[i]); // push tb object to tb selector content
                                    }
                                }
                            }
                        );

                } else if ( that instanceof tb && !!pLocalOnly ){ // walk descendants

                    for (var i in that ) if (that.hasOwnProperty(i)){

                        if ( i !== 'target' && that[i] instanceof tb ) {
                            [].push.call( ret, that[i]); // push tb object to tb selector content

                            var desc = tb.dom().toArray.call( that[i].descendants( '', true ) );

                            for ( var j=0, l=desc.length; j<l; j++ ){
                                [].push.call( ret, desc[j]); // push tb object to tb selector content
                            }

                        }

                    }


                }

                return !!pSelector ? ret.filter( pSelector ) : ret;

            },

            /**
             * children() method
             *
             * for each this[0...n] or this as tb() instance,
             * - get all direct children of tb object
             * - check them against the filter param pSelector
             * - return TbSelector result set (unique)

             * @method children
             *
             * @param           [pSelector] - any kind of TbSelector parameter
             * @param {boolean} [pLocalOnly] - only local children of given tb instance
             *
             * @return {object} - TbSelector instance
             */
            children: function( pSelector, pLocalOnly ){

                var that = this,
                    ret = tb( ''); // empty tb selector object

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( that, 'children', arguments );

                } else if ( that instanceof tb && !!that.target['nodeType'] && !pLocalOnly ) { // it must be a native tb object

                    tb.dom( '[data-tb]', that.target )
                        .map(
                            function( pDomNode ) {
                                if ( tb( pDomNode ).parent()[0].target === that.target ){
                                    for ( var i in pDomNode ){
                                        if ( pDomNode.hasOwnProperty(i) && pDomNode[i] instanceof tb ){
                                            [].push.call( ret, pDomNode[i] ); // push tb object to tb selector content
                                        }
                                    }
                                }
                            }
                        );

                } else if ( !!pLocalOnly ){

                    for ( var i in that ){
                        if ( that.hasOwnProperty(i) && that[i] instanceof tb ){
                            [].push.call( ret, that[i] ); // push tb object to tb selector content
                        }
                    }

                }

                return !!pSelector ? ret.filter( pSelector ) : ret;

            },

            /**
             * next() method
             *
             * for each this[0...n] or this as tb() instance,
             * - get the direct following sibling of tb object
             * - check it against the filter param pSelector
             * - return TbSelector result set (unique)
             *
             * @method next
             *
             * @param {variant} [pSelector] - any kind of TbSelector parameter
             *
             * @return {object} - TbSelector instance
             */
            next: function( pSelector ){

                var that = this,
                    ret = tb( '' ), // empty tb selector object
                    result,
                    index;

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( this, 'next', arguments );

                } else { // it must be a native tb object

                    result = that.parent().children();
                    index = [].indexOf.call( result, that );

                    if ( result.length > index + 1 ) {
                        [].push.call( ret, result[ index + 1 ] ); // push dom object to tb selector content
                    }

                }
                return !!pSelector ? ret.filter( pSelector ) : ret;

            },

            /**
             * prev() method
             *
             * for each this[0...n] or this as tb() instance,
             * - get the previous sibling of tb object
             * - check them against the filter param pSelector
             * - return TbSelector result set (unique)
             *
             * @method prev
             *
             * @param {variant} [pSelector] - any kind of TbSelector parameter
             *
             * @return {object} - TbSelector instance
             */
            prev: function( pSelector ){

                var that = this,
                    ret = tb( '' ), // empty tb selector object
                    result,
                    index;

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( this, 'prev', arguments );

                } else { // it must be a native tb object

                    result = this.parent().children();
                    index = [].indexOf.call( result, this );

                    if ( index ) {
                        [].push.call( ret, result[ index - 1 ] ); // push dom object to tb selector content
                    }

                }

                return !!pSelector ? ret.filter( pSelector ) : ret;
            },

            /**
             * first() method
             *
             * for each this[0...n] or this as tb() instance,
             * - get the first child of the tb object parent
             * - check it against the filter param pSelector
             * - return TbSelector result set (unique)
             *
             * @method first
             *
             * @param {variant} [pSelector] - any kind of TbSelector parameter
             *
             * @return {object} - TbSelector instance
             */
            first: function( pSelector ){

                var that = this,
                    ret = tb( '' ),
                    result;

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( this, 'first', arguments );

                } else { // it must be a native tb object

                    result = this.parent().children();
                    [].push.call( ret, result[ 0 ] ); // push dom object to tb selector content

                }

                return !!pSelector ? ret.filter( pSelector ) : ret;

            },

            /**
             * last() method
             *
             * for each this[0...n] or this as tb() instance,
             * - get the last child of the tb object parent
             * - check it against the filter param pSelector
             * - return TbSelector result set (unique)
             *
             * @method last
             *
             * @param {variant} [pSelector] - any kind of TbSelector parameter
             *
             * @return {object} - TbSelector instance
             */
            last: function( pSelector ){
                var that = this,
                    ret = tb(''),
                    result;

                if ( that instanceof TbSelector ) {
                    ret = walkSelector( this, 'last', arguments );
                } else {
                    result = this.parent().children();
                    [].push.call( ret, result[ result.length - 1 ] ); // push dom object to tb selector content
                }
                return !!pSelector ? ret.filter( pSelector ) : ret;
            },

            /**
             * toArray() method
             *
             * @method toArray
             *
             * @return {array} - TbSelector elements in an array
             */
            toArray: tb.dom().toArray, // simple mapping

            /**
             * filter() method
             *
             * for each this[0...n] or this as tb() instance,
             * - check them against the filter param pSelector
             * - return TbSelector result set (unique)
             *
             * @method filter
             *
             * @param {*} [pSelector] - any kind of TbSelector parameter
             *
             * @return {object} - TbSelector instance
             */
            filter: function( pSelector ){

                var that = this,
                    compare = tb( pSelector ).toArray(), // object array to check against
                    ret = tb();

                if ( !pSelector ) {
                    return that;
                }

                console.log( 'filter that, compare', that, compare );

                if ( that instanceof TbSelector ) {
                    [].map.call(
                        tb.dom().toArray.call( that ),     // convert these results to true array
                        function( tbObject ) {
                            if ( [].indexOf.call( compare, tbObject ) > -1 ){
                                [].push.call( ret, tbObject );
                            }
                        }
                    );
                } else if ( that instanceof tb ){
                    if ( compare.indexOf( that ) > -1 ){
                        [].push.call( ret, that );
                    }
                }

                console.log( 'filter ret', ret );

                return ret;
            },

            /**
             * not() method
             *
             * for each this[0...n] or this as tb() instance,
             * - check them against pSelector and remove all fits
             * - return TbSelector result set (unique)
             *
             * @method not
             *
             * @param {*} [pSelector] - any kind of TbSelector parameter
             *
             * @return {object} - TbSelector instance
             */
            not: function( pSelector ){

                var that = this,
                    compare = tb( pSelector ).toArray(), // object array to check against
                    ret,
                    index;

                if ( that instanceof TbSelector ) {
                    ret = that;
                } else {
                    ret = tb( '' );
                    [].push.call( ret, that );
                }

                that.each(
                    check,
                    function( key, tbObject ) {

                        index = [].indexOf.call( ret, tbObject );
                        if (  index > -1 ){
                            [].splice.apply( ret, [ index, 1 ] );
                        }

                    }
                );

                return ret;
            },

            /**
             * is() method
             *
             * for each this[0...n] or this as tb() instance,
             * - check them against pSelector and remove all that do not fit
             * - return TbSelector result set (unique)
             *
             * @method is
             *
             * @param {*} [pSelector] - any kind of TbSelector parameter
             *
             * @return {object} - TbSelector instance
             */
            is: function( pSelector ){

                var that = this,
                    check = tb( pSelector ).toArray(), // object array to check against
                    ret,
                    index;

                if ( that instanceof TbSelector ) {
                    ret = that;
                } else {
                    ret = tb();
                    [].push.call( ret, that );
                }

                check.forEach(
                    function( tbObject ) {

                        index = [].indexOf.call( ret, tbObject );
                        if (  index === -1 ){
                            [].splice.apply( ret, [ index, 1 ] );
                        }

                    }
                );

                return ret;
            },

            /**
             * add() method
             *
             * add elements to current result set
             * - return TbSelector result set (unique)
             *
             * @method add
             *
             * @param {*} [pSelector] - any kind of TbSelector parameter
             *
             * @return {object} - TbSelector instance
             */
            add: function( pSelector ){

                var that = this,
                    check = tb( pSelector ).toArray(), // object array to check against
                    ret,
                    index;


                if ( that instanceof TbSelector ) {
                    ret = that;
                } else {
                    ret = tb( '' );
                    [].push.call( ret, that );
                }

                check.forEach(
                    function( tbObject ) {

                        index = [].indexOf.call( ret, tbObject );

                        if (  index === -1 ){ // unique result set...
                            [].push.call( ret, tbObject );
                        }

                    }
                );

                return ret;
            },

            /**
             * on() method
             *
             * for each this[0...n] or this as tb() instance,
             * - add handler to handler array
             * - return TbSelector result set (unique)
             *
             * @method
             *
             * @param {string} pEventName - name of the handler function
             * @param {function} pHandler - the function to be added to the handler array
             * @param {boolean} [pOnce=false] - true = remove handler after first call, false = keep handler
             *
             * @return {object} - TbSelector instance
             */
            on: function( pEventName, pHandler, pOnce ){

                var that = this;

                pHandler.once = !!pHandler.once || !!pOnce;

                if ( that instanceof TbSelector ) {

                    walkSelector( that, 'on', arguments );

                } else if ( that instanceof tb) {

                    if ( !that.handlers ){
                        // console.log( 'adding handlers object for', that);
                        that.handlers = {};
                    }

                    if ( !that.handlers[ pEventName ] ){
                        that.handlers[ pEventName ] = [];
                    }

                    that.handlers[ pEventName ].push( pHandler );
                }

                return that;

            },

            /**
             * one() method
             *
             * for each this[0...n] or this as tb() instance,
             * - add handler to handler array
             * - return TbSelector result set (unique)
             *
             * @method
             *
             * @param {string} pEventName - name of the handler function
             * @param {function} pHandler - the function to be added to the handler array
             *
             * @return {object} - TbSelector instance
             */
            one: function( pEventName, pHandler ){

                var that = this;

                that.on( pEventName, pHandler, true ); // add event that is only being triggered once

                return that;

            },

            /**
             * off() method
             *
             * for each this[0...n] or this as tb() instance,
             * - delete handler from handler array
             * - return TbSelector result set (unique)
             *
             * @method
             *
             * @param {string} pEventName - name of the handler function
             * @param {function} pHandler - the function to be added to the handler array
             *
             * @return {object} - TbSelector instance
             */
            off: function( pEventName, pHandler ){

                var that = this,
                    index;

                if ( that instanceof TbSelector ) {

                    walkSelector( that, 'off', arguments );

                } else if ( that instanceof tb ) { // either a toplevel or an internal tb object

                    if ( !that.handlers[ pEventName ] ){
                        return;
                    }

                    index = that.handlers[ pEventName].indexOf( pHandler );

                    if ( index > -1 ){
                        that.handlers[ pEventName ].splice( index, 1 );
                    }

                }

                return that;

            }

        };

    })();

    // define TbSelector prototype MUST BE DONE HERE !
    TbSelector.prototype = {};

    // add TbSelector methods and properties
    for ( var i in tb.prototype ) if ( tb.prototype.hasOwnProperty(i)){
        TbSelector.prototype[i] = tb.prototype[i];
    }

    //Tb = tb; // to have an uppercase constructor name @todo: rethink this

    return tb;

})();

// requirement loading class
tb.require = function( pConfig ){

    var that = this,
        tbTarget = that.target;

    if ( !pConfig ) return;

    that.requirements = pConfig;

    // add requirement loading
    tb.loader.load(
        that.requirements,
        function(){
            that.target.trigger('init');
        }
    );

};

tb.require.prototype = {
    ready: function(){
        // do we need this???
    }
};

/**
 * stops event handling
 *
 * @function stop
 * @namespace tb
 * @static
 *
 * @param {boolean} pStopit - indicating whether to stop event handling
 *
 * @return {boolean} - true if event handling stopped, else false
 */
tb.stop = (function(pStopIt){
    var stopIt = pStopIt;
    return function( pStopIt ){
        return (stopIt = ( !!pStopIt ? pStopIt : stopIt ) );
    };
})( false );



/**
 * returns a unique id
 *
 * @function getId
 * @namespace tb
 * @static
 *
 * @return {string} - unique id
 */
tb.getId = function(){
    return 'id-' + (new Date()).getTime() + '-' + Math.random().toString().replace(/\./, '');
};



/**
 * tb.namespace() function
 *
 * sample calls:
 * tb.namespace( 'app.Dashboard' ) gets the constructor for dashboard
 *
 * and in the dashboard constructor:
 *
 * tb.namespace( 'app', true ).Dashboard = function(){ ...
 *
 *
 * @function namespace
 * @namespace tb
 * @static
 *
 * @param {string} pNamespace
 * @param {boolean} [pForceCreation] - true => force creation of namespace object if it didnt exist before
 * @param {object} [pObject] - object to scan
 *
 * @return {Object}        namespaceObject
 */
tb.namespace = function( pNamespace, pForceCreation, pObject ){

    if ( typeof pNamespace !== 'string' ){
        return false;
    }

    var namespaceArray = pNamespace.split('.');

    var walk = function( o, namespaceArray ) {

        if ( !o[ namespaceArray[0] ] && !!pForceCreation ) {
            o[ namespaceArray[0] ] = {};
        }

        if ( namespaceArray.length < 2 ){

            return o.hasOwnProperty( namespaceArray[0] ) ? o[ namespaceArray[0] ] : false;

        } else {

            if ( o.hasOwnProperty( namespaceArray[0] ) ) {
                o = o[ namespaceArray[0] ];
                namespaceArray.shift();
                return walk( o, namespaceArray );
            } else {
                return false;
            }

        }
    };

    return walk( !pObject ? window : pObject, namespaceArray );

};



/**
 * tb.bind() function
 *
 * sample calls:
 *
 * tb.bind( document.body )
 *
 * - scans the given element and all of its descendants
 *   in the DOM and looks for attributes "data-tb" in the nodes.
 * - resulting list will be scanned for those nodes that do not already
 *   have an tb object inside.
 * - creates a new tb object based on the class namespace given
 *   in the "data-tb" attribute
 * - stores it in the DOM element
 *
 * tb.bind( document.body, 'n1.n2.<className>' [ , <config data> ] )
 *
 * - creates a new tb object based on the 2nd parameter, giving 3rd as constructor parameter
 * - stores it in the DOM element
 * THIS VARIANT WILL overwrite ANY tbo OBJECT THAT ALREADY RESIDES IN THE DOM NODE!
 * @function bind
 * @namespace tb
 * @static
 *
 * @param   {object}     pSelector      DOM node
 *
 * @return {void}
 */
tb.bind = function( pSelector ){

    var rootElement,
        selected = [],
        elements = document.querySelectorAll(pSelector);

    // get root node
    if ( typeof pSelector === 'string' ) {
        rootElement = document.querySelectorAll(pSelector)['0'] || false;
    } else if ( pSelector instanceof HTMLElement ){
        rootElement = pSelector;
    } else {
        return;
    }

    // add self if data-tb attribute present
    if ( rootElement && rootElement.getAttribute('data-tb') ){
        selected.push( rootElement );
    }

    // add other elements
    if ( !!elements['length'] ){
        [].map.call(
            elements,
            function( element ){
                selected.push( element );
            }
        );
    }

    // instanciate tb instances for given elements
    selected.forEach(
        function( selectedElement ){
            var namespaces = selectedElement.getAttribute('data-tb').split(' ');

            namespaces.forEach(
                function( namespace ){
                    if ( !selectedElement[namespace] ){
                        //console.log( namespace );
                        selectedElement[namespace] = new tb( namespace, null, selectedElement );        // create tb object
                    }
                }
            );
        }
    );

};



/**
 * function tb.observable()
 *
 * - creates a function
 * - initializes a value to observe
 * - returns this function
 *
 * sample calls:
 *
 * o = tb.observable( {} );
 * o( { newData: 'newData' } ); // change observable value
 * o.observe( function(){ ... }, true ); // will be triggered when observable value changes, true indicates only once
 *
 * @function observable
 * @namespace tb
 * @static
 *
 * @param {*} pStartValue - initial content of observable
 *
 * @return {function}  observableFunction
 */
tb.observable = function( pStartValue ){

    var observedValue = pStartValue;

    // make observable function to return in the end
    var observableFunction = function( pValue ){

        if ( pValue !== undefined ){ // value has changed
            observedValue = pValue;
            observableFunction.notify();
        }
        return observedValue;
    };

    // list of all callbacks to trigger on observedValue change
    observableFunction.list = [];

    // function used to execute all callbacks
    observableFunction.notify = function(){

        // execute all callbacks
        observableFunction.list.forEach(
            function( func, key ){
                if ( typeof func === 'function' ){
                    func( observedValue );
                    if ( func.once ){
                        observableFunction.list.splice(key,1);
                    }
                } else {
                    observableFunction.list.splice(key,1);
                }
            }
        );

    };

    // function used to add a callbacks
    observableFunction.observe = function( pFunction, pOnce ){
        pFunction.once = pOnce || false;
        observableFunction.list.push( pFunction );
    };

    return observableFunction;
};

// twoBirds system status
tb.status = {
    loadCount: tb.observable(0)
};

/*
// debugging...
tb.status.loadCount.observe(function(){
    console.log( 'loadCount:', tb.status.loadCount() );
});
*/

tb.idle = function( pCallback ){

    var f = function(){
        if ( tb.status.loadCount() === 0 ){
            pCallback();
        } else {
            // if idle not yet reached, re-atttach function for ONE execution
            tb.status.loadCount.observe( f, true );
        }
    };

    tb.status.loadCount.observe( f, true );

};


/**
 * tb.Model constructor
 * create and return a simple CRUD model
 *
 * @class Model
 * @constructor
 * @namespace tb
 *
 * @param {object} pConfig - config parameter, usually an object @todo: variant is no valid data type
 *
 * @return {object} - the model instance
 */
tb.Model = function ( pConfig ) {
    var that = this;

    // result element
    that.data = tb.observable( {} );
    that.config = {};

    // default config mixin -> result will be in that.config
    tb.extend(
        that.config,
        {   // default settings, reference only
            'create': {
                url: '',
                method: 'PUT',
                success: function( pResult ){
                    that.data( pResult );
                }
            },
            'read': {
                url: '',
                method: 'GET',
                success: function( pResult ){
                    that.data( pResult );
                }
            },
            'update': {
                url: '',
                method: 'POST',
                success: function( pResult ){
                    that.data( pResult );
                }
            },
            'delete': {
                url: '',
                method: 'DELETE',
                success: function( pResult ){
                    that.data( pResult );
                }
            }
        },
        pConfig
    );

};

tb.Model.prototype = (function(){
    // private

    // create get parameter string
    function makeGetParameterString( pParameterObject ){

        var result='';

        Object
            .keys( pParameterObject )
            .forEach(
                function( key ) {
                    result += ( !!result ? '&' : '' ) + key + '=' + pParameterObject[key];
                }
            );

        return result;
    }

    // check parameters for any call
    function parmCheck( pCompare, pAgainst ){ // compare = parameters handed over in call

        var regEx = /^\{.*\}$/, // rexEx to detect parameter mapping
            isMapVar,
            against;

        // make a deep copy of target object
        against = ( JSON.parse( JSON.stringify( pAgainst ) ) );

        // console.log( ' pre parmCheck', pCompare, pAgainst );

        Object
            .keys( against )
            .forEach(
                function( key ){
                    var value = against[ key ];

                    // determine whether there is a mapped variable
                    isMapVar = !!regEx.exec( value ) && !!regEx.exec( value )[0];

                    // replace mapped value by actual value
                    if ( isMapVar ){
                        against[ key ] = tb.parse( value, pCompare );
                        if ( !!regEx.exec( against[ key ] ) && !!regEx.exec( against[ key ] )[0] ){
                            console.error( 'mapped variable not found in data:', value, !!regEx.exec( value )[0] );
                        }
                    } else {
                        if ( pCompare.hasOwnProperty( key ) ) {
                            against[ key ] = pCompare[ key ];
                        } else {
                            console.error( 'variable not found in data:', key, 'in', pCompare );
                        }
                    }
                }
            );

        //console.log( 'post parmCheck parameters:', pAgainst );

        return pAgainst;
    }

    return {

        'create': function( pParams ){
            var o = tb.extend( {}, this.config.create ),
                p = {},
                params = pParams || {}; // parameter object

            if ( !o.url ){
                console.error( 'no create url given!');
                return;
            }

            if ( o.params ){ // this indicates get or post parameters are expected
                p = parmCheck( params, o.params );
            }

            tb.request(
                tb.extend(
                    o,
                    { // if params given, use microparse to fill them in url
                        url: p ? tb.parse( this.config.create.url, p ) : this.config.create.url
                    },
                    {
                        data: p ? p : {}
                    }
                )
            );

        },

        'read': function( pParams ){

            var o = tb.extend( {}, this.config.read ),
                p = {},
                params = pParams || {}; // parameter object

            if ( !o.url ){
                console.error( 'no read url given!');
                return;
            }

            if ( o.params ){ // this indicates get or post parameters are expected
                p = parmCheck( pParams, o.params );
            }

            tb.request(
                tb.extend(
                    o,
                    { // if params given, use microparse to fill them in url
                        url: p ? tb.parse( this.config.read.url, p ) : this.config.read.url
                    },
                    {
                        data: p ? p : {}
                    }
                )
            );

        },

        'update': function( pParams ){
            var o = tb.extend( true, {}, this.config.update ),
                p = {},
                params = pParams || {}; // parameter object

            if ( !o.url ){
                console.error( 'no update url given!');
                return;
            }

            if ( o.params ){ // this indicates get or post parameters are expected
                p = parmCheck( params, o.params );
            }

            tb.request(
                tb.extend(
                    o,
                    { // if params given, use microparse to fill them in url
                        url: p ? tb.parse( this.config.update.url, p ) : this.config.update.url
                    },
                    {
                        data: p ? p : {}
                    }
                )
            );

        },

        'delete': function( pParams ){
            var o = tb.extend( true, {}, this.config['delete'] ),
                p = {},
                params = pParams || {}; // parameter object

            if ( !o.url ){
                console.error( 'no delete url given!');
                return;
            }

            if ( o.params ){ // this indicates get or post parameters are expected
                p = parmCheck( params, o.params );
            }

            tb.request(
                tb.extend(
                    o,
                    { // if params given, use microparse to fill them in url
                        url: p ? tb.parse( this.config.delete.url, p ) : this.config.delete.url
                    },
                    {
                        data: p ? p : {}
                    }
                )
            );

        }

    };

})();



/**
 * tb.extend() function
 * extend an object by another objects properties, always a deep copy
 *
 * @function extend
 * @namespace tb
 * @static
 *
 * @param {object} pObj - object to extend
 * @param {object} pSrc - other object
 *
 * @return {object} - other object
 */
tb.extend = function( pObj ){ // any number of arguments may be given
    var cp;

    while ( arguments[1] ){
        cp = arguments[1];
        Object
            .keys(cp)
            .forEach(
                function(key) {
                    if ( (cp[key]).constructor === Object ){
                        pObj[key] = tb.extend( pObj[key] || {}, cp[key] );
                    } else {
                        pObj[key] = cp[key];
                    }
                }
            );
        [].splice.call( arguments, 1, 1 ); // remove object that is done
    }

    return pObj;
};



/**
 * tb.parse() function
 * for each key/value in pObject, check string for {key}
 * replace occurence with <value>
 *
 * @function parse
 * @namespace tb
 * @static
 *
 * @param {string} pText - the text to parse
 * @param {object} pParse - hash object containing replacement key/<value>
 *  //@todo: missing parm description
 * @return {string} - result string
 */
tb.parse = function( pWhat, pParse ){

    if ( typeof pWhat === 'string' ){
        var vars = pWhat.match( /\{[^\{\}]*\}/ );

        if ( !!vars ) {
            vars
                .forEach(
                    function (pPropname) {
                        var propname = pPropname.substr(1, pPropname.length - 2),
                            propValue = tb.namespace(propname, false, pParse) || propname + ' not found!';

                        pWhat = pWhat.replace( pPropname, propValue );
                    }
                );
        }
    } else if ( !!pWhat.constructor ){
        switch ( pWhat.constructor ){
            case Object:
                Object
                    .keys( pWhat )
                    .forEach(
                        function( pKey ){
                            if ( pWhat.hasOwnProperty( pKey ) ){
                                pWhat[ pKey ] = tb.parse( pWhat[ pKey ], pParse );
                            }
                        }
                    );
                break;
            case Array:
                pWhat
                    .forEach(
                        function( pValue, pKey ){
                            pWhat[ pKey ] = tb.parse( pWhat[ pKey ], pParse );
                        }
                    );
                break;
        }
    }

    return pWhat;
};


/**
 * requirement handling
 */
(function(){
    // private

    function getTypeFromSrc( pSrc ){
        return pSrc.split('?')[0].split('.').pop();
    }

    // requirement constructor
    var _Requirement = function( pConfig ){

        var that = this,
            type = getTypeFromSrc( pConfig.src ), // filename extension
            typeConfigs = { // standard configuration types
                'css': {
                    tag: 'link',
                    attributes: {
                        type: 'text/css',
                        rel: 'stylesheet',
                        href: '{src}'
                    }
                },
                'js': {
                    tag: 'script',
                    attributes: {
                        type: 'text/javascript',
                        src: '{src}'
                    }
                }
            },
            typeConfig, // a single type configuration
            element,
            isTyped = !!typeConfigs[type];

        if ( !!tb.loader.requirementGroups[type][pConfig.src.split('?')[0]]
            &&  !!tb.loader.requirementGroups[type][pConfig.src.split('?')[0]].done ){ // already loaded

            console.log( ' rqLoader already requirementLoaded', src.split('?')[0], 'u' );
            that.trigger( 'requirementLoaded', src.split('?')[0], 'u' );

            return;
        }

        pConfig.type = type; // add type

        that.config = pConfig;

        // cache busting
        if ( !!that.config.src ){
            that.config.src = that.config.src + ( that.config.src.indexOf( '?' ) > -1 ? '&' : '?' ) + tb.getId();
        }

        //that.target = pConfig.target;
        that.src = pConfig.src;
        that.type = that.config.type = type;
        that.done = false;
        that.cb = that.config.cb || function(){};
        that.data = tb.observable( {} );

        // element 'load' callback
        function onLoad( e ){

            //console.log( 'onload', e);

            if ( !!e && e.data ){
                that.data( e.data );
            }

            that.done = true;

            // console.log( '::onLoad()', element.src, element.href );
            if ( that.type === 'js' ) {
                setTimeout(
                    function(){
                        // that.element.parent.removeChild( that.element );     // remove js script tag from head
                    }
                    ,200
                );
            }

            that.trigger( 'requirementLoaded', that.src, 'u' );

        }

        // execute onLoad only once
        onLoad.once = true;

        // handlers
        that.handlers = {
            'onLoad': onLoad
        };


        if ( isTyped ) { // either *.css or *.js file

            // get default config for type
            typeConfig = typeConfigs[type];

            // create DOM element
            element = document.createElement( typeConfig.tag );
            element.async = true;
            element.onreadystatechange = element.onload = function() {
                var state = element.readyState;
                if (!that.done && (!state || /loaded|complete/.test(state))) {
                    // console.log( 'loaded', element );
                    tb.status.loadCount( tb.status.loadCount() - 1 ); // decrease loadCount
                    that.trigger( 'onLoad', element );
                }
            };

            // add attributes to DOM element
            for ( var i in typeConfig.attributes ) if ( typeConfig.attributes.hasOwnProperty(i) ){
                element.setAttribute( i, tb.parse( typeConfig.attributes[i], that.config ) );
            }

            tb.status.loadCount( tb.status.loadCount() + 1 ); // increase loadCount

            // append node to head
            document.getElementsByTagName('head')[0].appendChild( element );

            that.element = element;

        } else { // load via request if unknown type, trigger callback with text or JSON

            var f = function( data ){

                if ( that.type === 'json' && !!data['text'] ){
                    try {
                        data = JSON.parse( data.text );
                    } catch( e ){
                        console.log( 'error parsing, JSON expected in:', data );
                    }
                } else {
                    data = data.text;
                }

                that.trigger( 'onLoad', data );
            };

            var options = {
                url: that.src,
                success: f,
                error: f
            };

            tb.request( options );

        }

    };

    _Requirement.prototype = {
        namespace: '_Requirement'
    };




    // requirement group constructor
    var _RequirementGroup = function( pConfig ){

        var that = this;

        that.type = pConfig.type;
        that.target = pConfig.target;

        that.requirements = {};

    };

    _RequirementGroup.prototype = {

        namespace: '_RequirementGroup',

        load: function( pSrc ){

            var that = this,
                rq = !!that.requirements[ pSrc ];

            if ( !rq ){ // not loading or loaded: add a new requirement

                rq = that.requirements[ pSrc ] = new tb(
                    _Requirement,
                    {
                        src: pSrc,
                        target: that.target
                    },
                    that.requirements
                );

                that.requirements[ pSrc ].target = tb.loader; // needed for event bubbling

            } else { // already loading or loaded

                rq = that.requirements[ pSrc ];

            }

            if ( !!rq.done ){ // already loaded
                console.log( 'already loaded', pSrc );
                rq.trigger( 'onLoad' );

            }

        }

    };




    var Loader = function( pConfig ){
        var that = this;

        that.config = pConfig;
        that.requirementGroups = {}; // will later contain requirement groups ( grouped by file extension )
        that.rqSets = []; // requirement sets, may contain various file types

        that.handlers = {
            requirementLoaded: requirementLoaded
        }
    };

    Loader.prototype = {

        namespace: '_Head',

        load: function( pSrc, pCallback ){

            var that = this,
                pCallback = pCallback || function( e ){ console.log( 'onLoad dummy handler on', e ); },
                type,
                rg,
                groupCallback,
                pSrc = typeof pSrc === 'string' ? [ pSrc ] : pSrc, // convert to array if string
                pSrc = ([]).concat( pSrc ); // make an array copy


            // will trigger loading if necessary ( async callback even if already loaded )
            pSrc
                .forEach(
                    function( filename ){
                        type = getTypeFromSrc( filename );
                        rg = !!that.requirementGroups[type];

                        if ( !rg ){ // add a new requirement group

                            that.requirementGroups[ type ] = new tb(
                                _RequirementGroup,
                                {
                                    type: type
                                },
                                that.requirementGroups
                            )

                            that.requirementGroups[ type ].target = tb.loader; // needed for event bubbling
                        }

                        rg = that.requirementGroups[ type ];

                        rg.load( filename );
                    }

                );

            pSrc.callback = pCallback;

            pSrc.done = function( pFilename ){ // will be called when each file 'requirementLoaded' was triggered
                var index = pSrc.indexOf( pFilename );

                if ( index > -1 ){
                    pSrc.splice( index, 1 );
                }
            };

            that.rqSets.push( pSrc );

        },

        get: function( pFileName ){

            var that = this,
                type = getTypeFromSrc( pFileName),
                rg = that.requirementGroups[type] ? that.requirementGroups[type] : false,
                rq = rg ? ( rg.requirements[pFileName] ? rg.requirements[pFileName] : false ) : false;

            return rq ? rq.data() : 'data missing for: ' + pFileName;
        }

    };

    // bind _Head instance
    tb.loader = new tb( Loader );

    function requirementLoaded( e ){

        var that = this,
            filename  = e.data.split('?')[0];

        //console.log( '<requirement loaded> handler in loader', filename, e, that );
        that
            .rqSets
            .forEach(
                function( pRqSet ){
                    pRqSet.done( filename );
                    if ( !pRqSet.length ){ // every file loaded
                        //console.log( '<requirement loaded> CALLBACK in loader', filename, e, that );
                        pRqSet.callback();
                        that.rqSets.splice( that.rqSets.indexOf( pRqSet ), 1 );
                    }
                }
            );

        e.stopPropagation();
    }

})();

/**
 * @memberOf tb
 * @namespace tb.request
 * @field
 * @description the twoBirds request object
 */
tb.request = (function () {
    /** @private */
    var loadlist = [],
        readyState = 'complete',
        cachable = false,
        log = false,
        count = 0,
        interval = 30,
        msoft = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];

    function getConnection(pId) {
        var obj = {},
            xhr,
            getConnection;

        if (typeof ActiveXObject !== 'undefined'){
            for (var i = 0; i < msoft.length; ++i) {
                try {
                    xhr = new ActiveXObject(msoft[i]);
                    obj = {
                        connection: xhr,
                        identifier: pId
                    };

                    getConnection = (function (pType) {
                        return function (pId) {
                            var http = new ActiveXObject(pType);
                            obj = {
                                connection: xhr,
                                identifier: pId
                            };
                            return obj;
                        };
                    })(msoft[i]);
                } catch (e) {
                }
            }
        }

        try {
            xhr = new XMLHttpRequest();
            obj = {
                connection: xhr,
                identifier: pId
            };
            /** @ignore */
            getConnection = function (pId) {
                var xhr = new XMLHttpRequest();
                obj = {
                    connection: xhr,
                    identifier: pId
                };
                return obj;
            };
        }
        catch (e) {
        }
        finally {
            return obj;
        }
    }

    /** @private */
    function handleReadyState(pReq, pCallback, pStateChange, pFailure, pOptions) {
        var connection = this;
        var poll = window.setInterval((function (pReadyState) {
            return function () {
                if (pReq.connection.readyState !== pReadyState) {
                    pReadyState = pReq.connection.readyState;
                    //pStateChange();
                }
                if (pReadyState === 4) {
                    if (pReq.aborttimer) {
                        window.clearTimeout(pReq.aborttimer);
                    }
                    window.clearInterval(poll);
                    handleTransactionResponse(pReq, pCallback, pFailure, pOptions);
                }
            };
        })(0), interval);

        return poll;
    }

    /** @private */
    function handleTransactionResponse(pReq, pCallback, pFailure, pOptions) {

        try {
            var httpStatus = pReq.connection.status;
        }
        catch (e) {
            var httpStatus = 13030;
        }
        if (httpStatus >= 200 && httpStatus < 300) {
            var responseObject = createResponseObject(pReq, pOptions);
            try {
                pCallback.call(pCallback, responseObject);
            }
            catch (e) {
                if (tb.debug) debugger;
            }
        }
        else {
            var responseObject = createResponseObject(pReq, tb.extend( {}, pOptions ) );
            console.log( 'failure pCallback call', pReq.src );
            pFailure.call( pFailure, pReq );
        }
        release(pReq);
    }

    /** @private */
    function createResponseObject(pObj, pOptions) {
        var obj = {
            tId: pObj.identifier,
            status: pObj.connection.status,
            statusText: pObj.connection.statusText,
            allResponseHeaders: pObj.connection.getAllResponseHeaders(),
            text: pObj.connection.responseText,
            xml: pObj.connection.responseXML,
            options: pOptions
        };
        return obj;
    }

    /** @private */
    function release(pReq) {
        dec( pReq );
        if (pReq.connection){
            pReq.connection = null;
        }
        delete pReq.connection;
        pReq = null;
        delete pReq;
    }

    function inc( pReq ) {
        loadlist.push( pReq );
        count++;
        readyState = 'loading';
    }

    function dec( pReq ) {
        if ( loadlist.indexOf( pReq ) ){
            count--;
            loadlist.splice( loadlist.indexOf( pReq ) );
            if ( count === 0 ){
                readyState = 'complete';
            }
        }
    }


    /**
     * @name tb.request
     * @function
     * @param pOptions { object } a hash object containing these options:<br><br><br>
     * @returns a twoBirds request object
     *
     * @param pOptions.url: (string, omitted) the URL to call
     * @param pOptions.parms: (object, optional) a hash object containing the parameters to post
     * @param pOptions.method: (string, optional, defaults to 'POST') the XHR method
     * @param pOptions.headers: (object, optional) a hash object containing additional XHR headers
     * @param pOptions.success: (function, optional) the function to call with the request result
     * @param pOptions.error: (function, optional) the function to call if request status not in 200...299
     * @param pOptions.statechange: (function, deprecated, optional) the function to call when readyState changes
     * @param pOptions.timeout: (object, optional ) structure sample: { cb: myFunction, ms:10000 }<br>
     * cb: callback to run when timeout occurs<br>
     * ms: number of milliseconds the request will run before being terminated
     * @param pOptions.cachable: (boolean, deprecated, optional) defaults to true, indicates whether or not to include a unique id in URL
     * @param pOptions.async: (boolean, optional, defaults to true) whether or not to make an asynchronous request
     */
    return function (pOptions) {
        var uid = 'tb' + tb.getId(),
            xmlreq = false,
            method = (pOptions.method ? pOptions.method.toUpperCase() : false) || 'GET',
            url = pOptions.url,
            parms = '',
            successHandler = pOptions.success || tb.nop,
            errorHandler = pOptions.error || tb.nop,
            stateHandler = pOptions.statechange || tb.nop,
            isCachable = pOptions.cachable || false,
            timeout = pOptions.timeout || false,
            isAsync = (typeof pOptions.async !== 'undefined' && pOptions.async === false) ? false : true;

        if (typeof pOptions.parms != 'undefined') {
            var ct = ( pOptions.headers && pOptions.headers['Content-Type']
                ? pOptions.headers['Content-Type']
                : 'application/x-www-form-urlencoded' );

            switch ( ct ){
                case 'application/json':
                    parms = JSON.stringify( pOptions.parms );
                    break;
                default:
                    for (var i in pOptions.parms) { // concat parameter string
                        parms += ((parms.length > 0 ? '&' : '') + i + '=' + pOptions.parms[i]);
                    }
                    break;
            }
        }

        console.log( 'request options', pOptions );

        inc();

        /*
        if (isCachable === false) { // proxy disable - cache busting
            url += (url.indexOf('?') < 0 ? '?' : '&') + 'tbUid=' + uid;
        }
        */

        xmlreq = getConnection(uid);
        if (xmlreq) {
            if ( method === 'GET' && parms !== '') {
                url = url + (url.indexOf('?') < 0 ? '?' : '&') + parms;
            }
            xmlreq.src=url;

            xmlreq.connection.open(method, url, isAsync);

            if (isAsync === true) {
                xmlreq.poll = handleReadyState(xmlreq, successHandler, stateHandler, errorHandler, pOptions);
            }

            // set request headers
            if (pOptions.headers) {
                for (var i in pOptions.headers) {
                    if (i !== 'Content-Type') {
                        xmlreq.connection.setRequestHeader(i, pOptions.headers[i]);
                    }
                }
            }

            // abort functionality
            if (timeout) {
                xmlreq.timeoutTimer = window.setTimeout(

                    function (pT, pR) {
                        var f = typeof pT.cb === 'function' ? pT.cb : false;
                        return function () {
                            //if ( !myR && myR.connection.status == 4 ) return;
                            if (typeof f == 'function') {
                                f( /*createResponseObject(myR)*/ );
                            }
                            pR.connection.abort();
                            window.clearInterval(pR.poll);
                        };
                    }(timeout, xmlreq), timeout.ms);
            }

            xmlreq.abort = ( function(xmlreq) {
                return function () {
                    window.clearInterval(xmlreq.poll);
                    if (xmlreq.connection) xmlreq.connection.abort();
                    release(xmlreq);
                };
            })( xmlreq );

            // send
            if (method === 'POST' || method === 'PUT') {
                if (parms !== '') {
                    xmlreq.connection.setRequestHeader('Content-Type', ct);
                    xmlreq.connection.send(parms);
                }
                else {
                    xmlreq.connection.send(null);
                }
            }
            else {
                xmlreq.connection.send(null);
            }
            // if sync request direct handler call
            if (isAsync === false) {
                tb.request.dec();
                if (xmlreq.connection.status >= 200 && xmlreq.connection.status < 300) {
                    successHandler( xmlreq );
                }
                else {
                    errorHandler( xmlreq );
                }
            }
            else {
                return xmlreq;
            }
            return;
        }
        else {
            return false;
        }
    };

})();


/**
 * document.ready bootstrap
 */
(function(){

    function domReady () {
        tb.bind( 'body' ); // find all tb dom nodes and add tb objects if not yet done
    }

    // Mozilla, Opera, Webkit
    if ( document.addEventListener ) {
        document.addEventListener( "DOMContentLoaded", function(){
            document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
            domReady();
        }, false );

    // If IE event model is used
    } else if ( document.attachEvent ) {
        // ensure firing before onload
        document.attachEvent("onreadystatechange", function(){
            if ( document.readyState === "complete" ) {
                document.detachEvent( "onreadystatechange", arguments.callee );
                domReady();
            }
        });
    }

})();
