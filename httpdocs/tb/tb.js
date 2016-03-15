/**
 * twoBirds V6 core functionality
 *
 * @author          frank.thuerigen <frank_thuerigen@yahoo.de>
 * @copyright       copyright (c) 2006- by author, unlimited license granted
 * @license         http://www.gnu.org/copyleft/gpl.html GNU GPL v3
 *
 */

tb = (function(){
    //private

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
            $.each(
                $.makeArray( pSelectorObject ),     // convert these results to true array
                function walkSelectorEach( key, tbObject ) {
                    result = tbObject[pMethodName].apply( tbObject, $.makeArray( pArguments ) );
                    $.each(
                        $.makeArray( result ),
                        function( key, resultObject ){
                            if ( Array.prototype.indexOf.call( ret, resultObject ) === -1 ){
                                Array.prototype.push.call( ret, resultObject );
                            }
                        }
                    );
                }
            );
        }
        return ret;
    }

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
        $.extend(
            true,
            this,
            {   // default config
                bubble: pBubble || 'l',
                data: pEventData || {},
                name: pEventName || '',
                __stopped__: false,
                __immediateStopped__: false
            }
        );
    };

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
            elements,
            isTbObject;

        that.length = 0;

        switch (typeof pSelector) {

            // selection by jQuery selector string
            case 'string':

                var hasTbElements = false,
                    tbElements = [];

                $(pSelector).filter(function () {

                    var data = $(this).data() || {};

                    $.each(
                        data,
                        function( key, value ){
                            if ( !!value['__tb__'] ){
                                hasTbElements = true;
                                tbElements.push( value );
                            }
                        }
                    );

                });

                if ( hasTbElements ) $.map(
                    tbElements,
                    function ( value ) {
                        Array.prototype.push.call( that, value );
                    }
                );

                break;

            // selection by regEx: get all tb instances from DOM
            // check whether they contain a "namespace" property that matches regexp
            // selection by HTML node: get tb instances contained in node
            case 'object':

                if ( pSelector instanceof RegExp ){ // it is a regular expression

                    var hasTbElements = false,
                        tbElements = [];

                    $('[data-tb]').filter(function () {
                        var data = $(this).data() || {};

                        if ( $(this).attr('data-tb').match( pSelector ) ) $.each(
                            data,
                            function( key, value ){
                                if ( !!value['__tb__'] ){
                                    hasTbElements = true;
                                    tbElements.push( value );
                                }
                            }
                        );

                    });

                    if ( hasTbElements ) $.map(
                        tbElements,
                        function ( value ) {
                            if ( typeof value.namespace === 'string' && value.namespace.match( pSelector ) ){
                                //console.log( 'add namespace match', that );
                                Array.prototype.push.call( that, value );
                            }
                        }
                    );

                } else if ( typeof pSelector.nodeType !== 'undefined' ){

                    var tbElements = [];

                    $(pSelector).filter(function () {

                        var data = $(this).data() || {},
                            hasTbElement = false;

                        $.each(
                            data,
                            function( key, value ){
                                if ( !!value['__tb__'] ){
                                    hasTbElement = true;
                                    tbElements.push( value );
                                }
                            }
                        );

                    });

                    if ( hasTbElements ) $.map(
                        tbElements,
                        function ( value ) {
                            // console.log( 'dom node instance', that );
                            Array.prototype.push.call( that, value );
                        }
                    );

                }

                break;

            // selection by constructor: get all tb instances from DOM,
            // check whether their prototype matches constructor prototype
            case 'function':

                var tbElements = [];

                $('[data-tb]').filter(function () {

                    var data = $(this).data() || {},
                        hasTbElement = false;

                    $.each(
                        data,
                        function( key, value ){
                            if ( !!value['__tb__'] ){
                                hasTbElements = true;
                                tbElements.push( value );
                            }
                        }
                    );

                });

                // if there are tb elements, check for match
                if ( hasTbElements ) $.map(
                    tbElements,
                    function ( value ) {
                        if ( value.namespace === pSelector.prototype.namespace ){
                            // console.log( 'add constructor instance', pSelector, that );
                            Array.prototype.push.call( that, value );
                        }
                    }
                );

                break;
        }

        //if ( pSelector !== '' ) console.log( 'result', pSelector, '-->', that );

    };

    TbSelector.prototype = (function(){
        // private static

        return {
            // public methods and properties

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
                    tbEvent,
                    newHandlers;

                // tb.status.eventCount( tb.status.eventCount() + 1 ); // increase eventCount

                if( tb.stop() ){ // @todo rethink this, may be misleading since it seems to stop tb event handling but doesnt
                    console.info( 'stopped TbEvent', arguments );
                    return;
                }

                // construct event if necessary
                tbEvent = pEvent instanceof TbEvent ? pEvent : new TbEvent( pEvent, pEventData, pBubble );

                // execute handlers via setTimeout
                if ( that instanceof TbSelector ) {
                    $.each(
                        $.makeArray( that ),
                        function( key, tbObject ) {
                            if ( tbObject ) tbObject.trigger( tbEvent );
                        }
                    );
                } else { // it must be a native tb object

                    if ( that.handlers[tbEvent.name] && tbEvent.bubble.indexOf( 'l' ) > -1 ) {
                        newHandlers = [];

                        $.each(
                            that.handlers[tbEvent.name],
                            function (key, handler) {
                                setTimeout(
                                    function() {
                                        // call handler function
                                        // in the scope of the tbObject
                                        if ( tbEvent.bubble.indexOf('l') > -1
                                            && !tbEvent.__immediateStopped__ ){

                                            handler.apply(that, [tbEvent]);

                                        }
                                    },
                                    0
                                );

                                if ( !handler.once ) {
                                    newHandlers.push( that.handlers[tbEvent.name][ key ] );
                                }

                            }
                        );

                        that.handlers[tbEvent.name] = newHandlers;

                    }

                    //bubble
                    setTimeout(

                        function() {

                            // this will be called after all local event handlers have been called
                            // if one of these sets __stopped__ to true, bubbling is cancelled
                            if ( tbEvent.__stopped__ || tbEvent.__immediateStopped__  ) {
                                return;
                            }

                            // bubble up
                            if ( tbEvent.bubble.indexOf('u') > -1 ){
                                tbEvent.bubble += tbEvent.bubble.indexOf('l') === -1 ? 'l' : '';
                                that.parent().trigger( tbEvent );
                            }

                            // bubble down
                            if ( tbEvent.bubble.indexOf('d') > -1 ){
                                tbEvent.bubble += tbEvent.bubble.indexOf('l') === -1 ? 'l' : '';
                                that.children().trigger( tbEvent );
                            }

                        },

                        0
                    );

                }

                // after all, decrease event count ( before that, bubbled event triggers will increase it )
                setTimeout(
                    function() {
                        // tb.status.eventCount( tb.status.eventCount() - 1 ); // decrease eventCount
                    },
                    0
                );

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
                    ret = tb(''),
                    done = false,
                    thisInstance;

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( that, 'parents', arguments );

                } else if ( that.__tb__ && !!that.target && !!that.target.nodeType ) { // it must be a native toplevel tb object

                    $( that.target )
                        .parents( '[data-tb]' )
                        .each( function(){
                            var data = $(this).data() || {};

                            $.each(
                                data,
                                function( key, value ){
                                    if ( !!value['__tb__'] ){
                                        Array.prototype.push.call( ret, value ); // push dom object to tb selector content
                                    }
                                }
                            );
                        });

                } else { // it is an embedded object, local target is another (parent) tb object

                    thisInstance = that[ 'target' ];
                    if ( thisInstance ){
                        Array.prototype.push.call( ret, thisInstance ); // push dom object to tb selector content
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
                    ret = tb( '' ),
                    result;

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( that, 'parent', arguments );

                } else if ( that.__tb__ && !!that.target.nodeType ) { // it must be a native tb object

                    result = $( that.target )
                        .parents( '[data-tb]' )[0];

                    var data = $(result).data() || {};

                    $.each(
                        data,
                        function( key, value ){
                            if ( !!value['__tb__'] ){
                                Array.prototype.push.call( ret, value ); // push dom object to tb selector content
                            }
                        }
                    );

                } else { // it is an embedded object, local target is another (parent) tb object

                    Array.prototype.push.call( ret, that.target ); // push dom object to tb selector content

                }
                return pSelector ? ret.filter( pSelector ) : ret;
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
                    ret = tb('');

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( this, 'descendants', arguments );

                } else if ( that.__tb__ && !!that.target.nodeType && !pLocalOnly ) { // it must be a native tb object

                    $(that.target)
                        .find('[data-tb]')
                        .each(
                            function () {
                                var data = $(this).data() || {};

                                $.each(
                                    data,
                                    function( key, value ){
                                        if ( !!value['__tb__'] ){
                                            Array.prototype.push.call( ret, value ); // push dom object to tb selector content
                                        }
                                    }
                                );
                            }
                        );

                } else if ( !!pLocalOnly ){ // walk descendants

                    function walk( pObject ){

                        var children = pObject.children( false, true ); // false = no selector, true = only internal children

                        Array.prototype.push.call( ret, pObject ); // push object to tb selector content

                        if ( children.length ){
                            $.each(
                                $.makeArray( children ),
                                function( key, value ){
                                    walk( value );
                                }
                            );
                        }
                    }

                    // add local descendants
                    $.each(

                        $.makeArray( that.children( false, true ) ),

                        function( key, value ){
                            walk( value );
                        }

                    );

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
             * @param {variant} [pSelector] - any kind of TbSelector parameter
             * @param {boolean} [pLocalOnly] - only local children of given tb instance
             *
             * @return {object} - TbSelector instance
             */
            children: function( pSelector, pLocalOnly ){

                var that = this,
                    ret = tb( ''); // empty tb selector object

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( that, 'children', arguments );

                } else if ( that.__tb__ && !!that.target.nodeType && !pLocalOnly ) { // it must be a native tb object

                    $( that.target )
                        .find( '[data-tb]')
                        .filter(
                            function() {
                                return $( this ).parents('[data-tb]')[0] === that.target;
                            }
                        )
                        .each(
                            function() {
                                var data = $(this).data() || {};

                                $.each(
                                    data,
                                    function( key, value ){
                                        if ( !!value['__tb__'] ){
                                            Array.prototype.push.call( ret, value ); // push dom object to tb selector content
                                        }
                                    }
                                );
                            }
                        );

                } else if ( !!pLocalOnly ){

                    $.each(
                        that,
                        function( key, value ){
                            if ( !!value['__tb__'] ){
                                Array.prototype.push.call( ret, value ); // push dom object to tb selector content
                            }
                        }
                    );

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
                    index = Array.prototype.indexOf.call( result, that );

                    if ( result.length > index + 1 ) {
                        Array.prototype.push.call( ret, result[ index + 1 ] ); // push dom object to tb selector content
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
                    index = Array.prototype.indexOf.call( result, this );

                    if ( index ) {
                        Array.prototype.push.call( ret, result[ index - 1 ] ); // push dom object to tb selector content
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
                    Array.prototype.push.call( ret, result[ 0 ] ); // push dom object to tb selector content

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
                    Array.prototype.push.call( ret, result[ result.length - 1 ] ); // push dom object to tb selector content
                }
                return !!pSelector ? ret.filter( pSelector ) : ret;
            },

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
                    check = $.makeArray( tb( pSelector ) ), // object array to check against
                    ret = tb( '' );

                if ( !pSelector ) {
                    return that;
                }

                if ( that instanceof TbSelector ) {
                    $.each(
                        $.makeArray( that ),     // convert these results to true array
                        function( key, tbObject ) {
                            if ( check.indexOf( tbObject ) > -1 ){
                                Array.prototype.push.call( ret, tbObject );
                            }
                        }
                    );
                } else {
                    if ( check.indexOf( that ) > -1 ){
                        Array.prototype.push.call( ret, that );
                    }
                }

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
                    check = $.makeArray( tb( pSelector ) ), // object array to check against
                    ret,
                    index;

                if ( that instanceof TbSelector ) {
                    ret = that;
                } else {
                    ret = tb( '' );
                    Array.prototype.push.call( ret, that );
                }

                $.each(
                    check,
                    function( key, tbObject ) {

                        index = Array.prototype.indexOf.call( ret, tbObject );
                        if (  index > -1 ){
                            Array.prototype.splice.apply( ret, [ index, 1 ] );
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
                    check = $.makeArray( tb( pSelector ) ), // object array to check against
                    ret,
                    index;

                if ( that instanceof TbSelector ) {
                    ret = that;
                } else {
                    ret = tb( '' );
                    Array.prototype.push.call( ret, that );
                }

                $.each(
                    check,
                    function( key, tbObject ) {

                        index = Array.prototype.indexOf.call( ret, tbObject );
                        if (  index === -1 ){
                            Array.prototype.splice.apply( ret, [ index, 1 ] );
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
                    check = $.makeArray( tb( pSelector ) ), // object array to check against
                    ret,
                    index;


                if ( that instanceof TbSelector ) {
                    ret = that;
                } else {
                    ret = tb( '' );
                    Array.prototype.push.call( ret, that );
                }

                $.each(
                    check,
                    function( key, tbObject ) {

                        index = Array.prototype.indexOf.call( ret, tbObject );

                        if (  index === -1 ){
                            Array.prototype.push.call( ret, tbObject );
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

                } else if ( that.__tb__ ) {

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

                } else if ( that.__tb__ ) { // either a toplevel or an internal tb object

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

        function makePrototype( pConfig ){

            var f = function ( pConfig ){
                $.extend(
                    true,
                    this,
                    pConfig
                );
            };

            f.prototype = $.extend(
                true,
                {
                    constructor: tb
                },
                TbSelector.prototype
            );

            var r = new f( pConfig );

            return r;
        }


        if ( that instanceof tb ) {    // called as constructor, create and return tb object instance
            var isNamespace = typeof arguments[0] === 'string',
                tbClass =  isNamespace ? tb.namespace( arguments[0] ) : arguments[0],
                tbInstance,
                fileName;

            if ( isNamespace && !tbClass ){
                fileName = arguments[0].replace( /\./g, '/' ) + '.js';

                tb.loader.load(
                    fileName,
                    (function( args ){
                        return function(){
                            new tb(
                                args[0],
                                args[1] || {},
                                args[2] || false
                            );
                        }
                    })( Array.prototype.slice.call( arguments ) )
                );

                return;
            }

            // it is a constructor call, like "new tb(...)"
            if ( typeof tbClass === 'function' ){

                //console.log( 'constructor', arguments, tbClass);

                if ( !tbClass.prototype.__tb__ ){
                    // extend prototype with selector prototype
                    //console.log( 'extend', tbClass.name, tbClass.prototype );
                    tbClass.prototype = makePrototype( tbClass.prototype );
                    tbClass.prototype.__tb__ = 'V6.0a';
                }

                // make a new instance of given constructor
                tbInstance = new tbClass( arguments[1] || {}, arguments[2] ); // hidden parameter target
                //console.log( 'tbInstance', tbInstance );

                // prepare .namespace property of tb object
                if ( !tbInstance.namespace ){
                    tbInstance.namespace = typeof arguments[0] === 'string'
                        ? arguments[0]
                        : arguments[0].namespace || tb.getId(); // if nothing helps, a unique id
                }

                // prepare .target property of tb object
                tbInstance.target = arguments[2] || false; // preset
                if ( !!arguments[2] ){
                    if ( arguments[2].jquery && arguments[2][0] ){ // it is a jQuery result set
                        tbInstance.target = arguments[2][0];
                    } else {
                        tbInstance.target = arguments[2];
                    }
                } else {
                    tbInstance.target = null;
                }

                // if it is a DOM element:
                // - add class to DOM data
                // - $(target).addClass( <namespacedClassname> )
                // - if not already there add namespace to target data-tb attribute
                if ( tbInstance.target && tbInstance.target.nodeType ){
                    var $that = $( tbInstance.target );

                    $that
                        .data( tbInstance.namespace, tbInstance );

                    // if element does not reside in the DOM <head> add class
                    if ( tbInstance.target !== document.head && !$that.parents( 'head' )[0] ){
                        $that
                            .addClass( tbInstance.namespace.replace( /\./g, '-').toLowerCase() );
                    }

                    // add namespace to DOM "data-tb" attribute
                    if ( !$that.attr( 'data-tb' ) ){
                        $that.attr( 'data-tb', tbInstance.namespace );
                    } else if ( $that.attr( 'data-tb').split( ' ').indexOf( tbInstance.namespace ) === -1 ){
                        $that.attr( 'data-tb', $that.attr( 'data-tb' ) + ' ' + tbInstance.namespace );
                    }

                }

                // create handlers array if necessary
                if ( !tbInstance[ 'handlers' ] ){
                    tbInstance.handlers = {};
                } else {
                    // if there are single named event handler functions,
                    // convert them to array of functions
                    $.each(
                        tbInstance.handlers,
                        function( key, value ){
                            if ( typeof value === 'function' ){
                                tbInstance.handlers[key] = [ value ];
                            }
                        }
                    );
                }

                // add property declared classes (prop contains ".") as tb objects
                $.each(
                    tbInstance,
                    function( key, value ){
                        if ( typeof key === 'string'
                            && key.indexOf( '.' ) > -1
                            ){ // prop name contains ".", treat as tb class
                            tbInstance[key] = new tb( key, value, tbInstance );
                        }
                    }
                );

                // trigger init on "tb.idle" event;
                if ( tb.status.eventCount() > 0 ) {
                    tb.idle(function(){
                        //console.log( 'deferred trigger ::init() on', tbInstance.namespace, tbInstance );
                        tbInstance.trigger( 'init' );
                    });
                } else {
                    //console.log( 'trigger ::init() now on', tbInstance.namespace, tbInstance );
                    tbInstance.trigger( 'init' );
                }

                return tbInstance;

            }

        } else {                         // arguments[0] is string or regex, return selector result

            return new TbSelector( arguments[0] );

        }

    };

    return tb;

})();

// requirement loading class
tb.require = function( pConfig ){

    var that = this,
        tbTarget = that.target;

    if ( !pConfig ) return;
    //console.log( 'tbRequire config', pConfig, that );

    that.requirements = pConfig;

    // add requirement loading
    tb.loader.load(
        that.requirements,
        function(){
            // after loading, remove requirement array
            // tbTarget['tb.require'] = null;
            // delete tbTarget['tb.require'];
            // init will be triggered in when idle
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

            return o[ namespaceArray[0] ] || false;

        } else {

            if ( !!o[ namespaceArray[0] ] ) {
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
 * @param   {string}     [pNamespace]   contains the namespace path to the class
 * @param   {variant}    [pConfig]      any data, will be used as a parameter when pNameSpace class is constructed @todo: 'variant' is no valid data type. use '{Object|Array|String} or similar
 *
 * @return {void}
 */
tb.bind = function( pSelector, pNamespace, pConfig ){

    var selection;

    if ( pNamespace ){ // namespace is given
        selection = $( pSelector );
        selection.attr( 'data-tb', pNamespace );
    } else { // namespace not given, scan dom for data-tb attribute
        selection = $( pSelector )
            .find('[data-tb]')
            .andSelf()
            .filter('[data-tb]')
            .filter( function () {
                var obj = $(this).data( 'tbo' ),
                    noTbObject = ( typeof obj !== 'object' || ! obj instanceof tb );
                return noTbObject;
            });
    }

    // iterate over elements
    $.each(
        selection,
        function( key, value ){

            var namespace = pNamespace || $(this).attr('data-tb'); // namespace of constructor

            new tb( namespace, pConfig, value );        // create tb object

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
        $.each(
            observableFunction.list,
            function( key, func ){
                // currently only trigger functions allowed
                if ( $.isFunction( func ) ){
                    func( observedValue );
                    if ( func.once === true ){
                        observableFunction.list[key] = null;
                        delete observableFunction.list[key];
                    }
                }
            }
        );

        // cleanup callback array
        observableFunction.list = $.map(
            observableFunction.list,
            function(value){
                return(value);
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
    eventCount: tb.observable(0)
};

/*
// debugging...
tb.status.eventCount.observe(function(){
    console.log( 'eventCount:', tb.status.eventCount() );
});
*/

tb.idle = function( pCallback ){

    var f = function(){
        if ( tb.status.eventCount() === 0 ){
            pCallback();
        } else {
            // if idle not yet reached, re-atttach function for ONE execution
            tb.status.eventCount.observe( f, true );
        }
    };

    tb.status.eventCount.observe( f, true );
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
    $.extend(
        true,
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

        $.each(
            pParameterObject,
            function( key, value ){
                result += ( !!result ? '&' : '' ) + key + '=' + value;
            }
        );

        return result;
    }

    // check parameters for any call
    function parmCheck( pCompare, pAgainst ){ // compare = parameters handed over in call

        var regEx = /^\{.*\}$/, // rexEx to detect parameter mapping
            isMapVar;

        // make a deep copy of target object
        pAgainst = ( JSON.parse( JSON.stringify( pAgainst ) ) );

        // console.log( ' pre parmCheck', pCompare, pAgainst );

        $.each(
            pAgainst,
            function( key, value ){

                // determin whether there is a mapped variable
                isMapVar = !!regEx.exec( value ) && !!regEx.exec( value )[0];

                // console.log( 'isMapVar, compareParameters, value, key', isMapVar, pCompare, value, key );

                // replace mapped value by actual value
                if ( isMapVar ){
                    pAgainst[ key ] = tb.parse( value, pCompare );
                    if ( !!regEx.exec( pAgainst[ key ] ) && !!regEx.exec( pAgainst[ key ] )[0] ){
                        console.error( 'mapped variable not found in data:', value, !!regEx.exec( value )[0] );
                    }
                } else {
                    if ( pCompare.hasOwnProperty( key ) ) {
                        pAgainst[ key ] = pCompare[ key ];
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
            var o = $.extend( true, {}, this.config.create ),
                p = {},
                pParams = pParams || {}, // parameter object
                ajax;

            //console.log('create', pParams);

            if ( !o.url ){
                console.error( 'no create url given!');
                return;
            }

            if ( o.params ){ // this indicates get or post parameters are expected
                p = parmCheck( pParams, o.params );
            }

            var ajax = $.extend(
                true,
                o,
                { // if params given, use microparse to fill them in url
                    url: p ? tb.parse( this.config.create.url, p ) : this.config.create.url
                },
                {
                    data: p ? p : {}
                }
            );

            // console.log( 'save', ajax );

            $.ajax( ajax );

        },

        'read': function( pParams ){

            var o = $.extend( true, {}, this.config.read ),
                p = {},
                pParams = pParams || {}; // parameter object

            if ( !o.url ){
                console.error( 'no read url given!');
                return;
            }

            if ( o.params ){ // this indicates get or post parameters are expected
                p = parmCheck( pParams, o.params );
            }

            $.ajax(
                $.extend(
                    true,
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
            var o = $.extend( true, {}, this.config.update ),
                p = {},
                pParams = pParams || {}; // parameter object

            if ( !o.url ){
                console.error( 'no update url given!');
                return;
            }

            if ( o.params ){ // this indicates get or post parameters are expected
                p = parmCheck( pParams, o.params );
            }

            $.ajax(
                $.extend(
                    true,
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
            var o = $.extend( true, {}, this.config['delete'] ),
                p = {},
                pParams = pParams || {}; // parameter object

            if ( !o.url ){
                console.error( 'no delete url given!');
                return;
            }

            if ( o.params ){ // this indicates get or post parameters are expected
                p = parmCheck( pParams, o.params );
            }

            $.ajax(
                $.extend(
                    true,
                    o,
                    { // if params given, use microparse to fill them in url
                        url: p ? tb.parse( this.config['delete'].url, p ) : this.config.create.url
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
 *
 * @return {string} - result string
 */
tb.parse = function( pText, pParse, pPrevNamespace ){
    var operation = typeof pParse === 'array' ? 'map' : 'each',
        prevNamespace = pPrevNamespace || '',
        search;

    $[operation]( pParse, function( pKey, pValue ){ // operation is either $.map() or $.each()
        var value = operation === 'map' ? pKey : pValue,
            key =  operation === 'map' ? pValue : pKey;

        // if we are in recursion
        if ( prevNamespace ){
            prevNamespace = prevNamespace.replace(
                /-/g,
                key
            );
        }

        // do it...
        if ( $.isPlainObject( value ) ){
            pText = tb.parse( pText, value, (prevNamespace ? prevNamespace : key) + '.-' ); // '-' being the placeholder for the new key
        } else if (  $.isArray( value )  ){
            pText = tb.parse( pText, value, (prevNamespace ? prevNamespace : key) + '[-]' );
        } else {
            search = '\{' + (prevNamespace ? prevNamespace : key) + '\}';
            pText = pText.replace( search, value );
        }

    });

    return pText;
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

        pConfig.type = type; // add type

        that.config = pConfig;

        // cache busting
        if ( !!that.config.src ){
            that.config.src = that.config.src + ( that.config.src.indexOf( '?' ) > -1 ? '&' : '?' ) + tb.getId();
        }

        //console.log( 'load', pConfig.src );

        //that.target = pConfig.target;
        that.src = pConfig.src;
        that.type = that.config.type = type;
        that.done = false;
        that.cb = that.config.cb || function(){};
        that.data = tb.observable( {} );

        // element 'load' callback
        function onLoad( e ){

            if ( e && e.data ){
                that.data( e.data );
            }

            that.done = true;

            // console.log( '::onLoad()', element.src, element.href );
            if ( that.type === 'js' ) {
                setTimeout(
                    function(){
                        //$( that.element ).remove();
                    }
                    ,200
                );
            }
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
                    //console.log( 'loaded', element );
                    tb.status.eventCount( tb.status.eventCount() - 1 ); // decrease eventCount
                    that.trigger( 'onLoad' );
                }
            };

            // add attributes to DOM element
            $.each(
                typeConfig.attributes,
                function( key, value ){
                    $( element ).attr( key, tb.parse( value, that.config ) );
                }
            );

            //console.log( element );

            tb.status.eventCount( tb.status.eventCount() + 1 ); // increase eventCount

            // append node to head
            document.getElementsByTagName('head')[0].appendChild( element );

            that.element = element;

        } else { // load via request if unknown type

            var f = function( data ){
                that.data( data );
                that.trigger( 'onLoad', data );
            };

            $.ajax(
                that.src,
                {
                    contentType: 'text/plain',
                    dataType: 'text',
                    success: f,
                    error: f
                }
            );
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

        load: function( pSrc, pCallback ){

            var that = this,
                rq = !!that.requirements[ pSrc ],
                functionWrapper;

            if ( !rq ){ // not loading or loaded: add a new requirement

                rq = that.requirements[ pSrc ] = new tb(
                    _Requirement,
                    {
                        src: pSrc,
                        cb: pCallback,
                        target: that.target
                    },
                    that.requirements
                );

            } else { // already loading or loaded

                rq = that.requirements[ pSrc ];

            }

            functionWrapper = function(){
                pCallback( this );
            };

            rq.on(
                'onLoad',
                functionWrapper,
                true
            );

            if ( rq.done ){ // already loaded

                rq.trigger( 'onLoad' );

            }

        }

    };




    var Loader = function( pConfig ){
        var that = this;

        that.config = pConfig;
        that.requirementGroups = {}; // will later contain requirementgroup tbo's in <head>
    };

    Loader.prototype = {

        namespace: '_Head',

        load: function( pSrc, pCallback ){

            var that = this,
                pCallback = pCallback || function( e ){ console.log( 'onLoad dummy handler on', e ); },
                type,
                rg,
                groupCallback;

            // load a group requirement ( multiple files )
            if ( typeof pSrc !== 'string' ){

                groupCallback = (function( pSources, pCallback ){
                    return function( pElement ){
                        var index = pSources.indexOf( pElement.src );

                        pSources.splice( index, 1 );

                        if ( !pSources.length ){
                            pCallback();
                        }
                    };
                })( pSrc, pCallback );

                $.each(
                    pSrc,
                    function( key, value ){
                        that.load( value, groupCallback )
                    }
                );

                return;
            }

            // load a single requirement
            type = getTypeFromSrc( pSrc );
            rg = !!that.requirementGroups[type];

            if ( !rg ){ // add a new requirement group

                that.requirementGroups[ type ] = new tb(
                    _RequirementGroup,
                    {
                        type: type
                    },
                    that.requirementGroups
                )

            }

            rg = that.requirementGroups[ type ];

            rg.load( pSrc, pCallback );

        },

        data: function( pFileName, pData ){

            var that = this,
                type = getTypeFromSrc( pFileName),
                rg = that.requirementGroups[type] ? that.requirementGroups[type] : false,
                rq = rg ? ( rg.requirements[pFileName] ? rg.requirements[pFileName] : false ) : false;

            return rq ? rq.data( pData ) : 'unknown: ' + pFileName;
        }

    };

    // bind _Head instance
    tb.loader = new tb( Loader );

})();

/**
 * document.ready bootstrap
 */
$(function(){   // jQuery document.ready

    // scan document for tb-data attributes
    tb.bind( document.body ); // find all tb dom nodes and add tb objects if not yet done

});