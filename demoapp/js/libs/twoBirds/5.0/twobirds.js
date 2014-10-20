/**
 *  @fileoverview
 *  TWOBIRDS JavaScript framework library 
 *  @version 5.0a
 *  @author Frank Thuerigen 
 *          frank_thuerigen@yahoo.de
 */
 
/**
 * object.getPrototypeOf() gets the prototype of an object instance
 * 
 * @addon to Object core class
 * @augments Object
 * @param pObj ( object ) some object 
 * @return protoype of pObj
 * @type object
 * 
 * thx John Resig,  http://ejohn.org/blog/objectgetprototypeof/ 
 */
if ( typeof Object.getPrototypeOf !== "function" ) {
  if ( typeof "test".__proto__ === "object" ) { // Mozilla
    Object.getPrototypeOf = function(pObj){
      return pObj ?  pObj.__proto__ : this.__proto__;
    };
  } else {
    Object.getPrototypeOf = function(pObj){
      // May break if the constructor has been tampered with
      return pObj ? pObj.constructor.prototype : this.constructor.prototype;
    };
  }
}

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function( pEle )
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === pEle)
        return from;
    }
    return -1;
  };
}

/**
 * twobirds constructor
 * @memberOf window
 * @namespace tb
 * @params e: Dom Node
 * @description 
 */
(function(){

	// private: match tbo engine
	function _me( e, s ){ // e = tbo object, e = selector
		if ( e && e['nodeType'] && $(e).data('tbo') ) e = $(e).data('tbo');
		if ( !e || !e instanceof tb ) return false;
		if ( !s instanceof RegExp ) console.log( '_me', e, s );
		//if ( !e ) return false;

		if ( typeof s === 'string' ){ // assume jquery selector
			return $(e.target).is(s);
		} else if ( $.isPlainObject(s) ){ // a test object to match against
			//console.log( 'testing', e, 'against', tb );
			var match = true;
			$.each( s, function( key, val){
				//console.log( key, val, e );
				if ( !e[key] || !( val === e[key] || typeof e[key] === val || (val instanceof RegExp && typeof e[key] === 'string' && val.test(e[key]) ) ) ) {
					match = false;
					//console.log('no match');
					$.each( $.extend( [], true, e ), function( i, v ){
						//console.log( 'test sub object', v, s );
						//console.log( 'test sub object', v.is( s ) );
						match = match || v.is( s );
					});
					return match;
				}
			});
			return match;
		} else if ( s instanceof RegExp ){ 
			// shortcut for testing name against regexp, 
			// e.g. tb(/body/) all tb objects that contain 'body' in their name
			//console.log( _me( e, { name: s } ), e, s );
			return s.test( e.instanceOf().join(',') );
		}
		return false;
	}

	// private: match array engine
	function _ma( a, s ){ // a = Array, e = selector
		var r = [];
		//console.log( '_ma', a, s );
		$.each( a, function( i, v ){
			if ( v && v['nodeType'] && $(v).data('tbo') ){
				v = $(v).data('tbo');
				//console.log( '_ma v=', v, v instanceof tb );
			}
			if ( _me( v, s ) ){
				//console.log( 'add match', v );
				r.push( v );
			}
		});
		$.extend(r, true, tb.prototype)
		return r.length === 1 ? r[0] : r ;
	}

	// private: selector engine
	function _se( s ){

		var s = s || {}, // no selector --> everything matches
			a = this === window ? $('[data-tb]') : this, // either jquery all tb DOM nodes array or assume result set
			r = [];

		if ( this === window ){ // simple selector call tb('...') 
			return _ma( a, s );
		} else if ( a instanceof Array || a instanceof tb ){ // assume call on instance(s) e.g. tb('body').filter(...)
			//console.log( '-ARRAY or TBO testing selector ', typeof s, '(', s, ') in ', a );
			return _ma( this, s );
		}
		return false; // return array of tbo objects
	}

	// explicit public part
	window.tb = function( a ){
		if( a && typeof a === 'object' && typeof a['nodeType'] !== 'undefined' ){ // a DOM node
			
			this.target = a;

		} else if ( a ) { // treat as selector

			return _se( a );

		}
	};

	window.tb.prototype = (function(){
		// private methods, static private vars
		// no need to auto-comment these

		return { // public prototype, public static vars

			trigger: function(){}, // skeleton, overloaded later

			is: function( s ){ // selector match
				var o = this instanceof Array ? this[0] : this;
				if (!s) return true;
				return _me( o, s );
			},

			instanceOf: function( pObj ){ 
				
				if ( this instanceof Array && this[0] && this[0] instanceof tb ){ // chained method, filter result set
					var r = [];
					$.each( this, function(i,v){
						if ( v.instanceOf( pObj ) ) {
							//console.log( 'filter match', pObj, v );
							r.push( v );
						}
					});
					$.extend(r, true, tb.prototype);
					return r.length === 1 ? r[0] : r;
				
				} else if ( this instanceof tb ) { // instanceof tb, normal method
					var root = this['_super'] ? this._root() : this,
						result = false,
						names = [];

					//console.log( this );

					function walk( pTb ){
						$.each( pTb, function( i, v ){
							if ( v instanceof tb && v['_super'] ){ // sub object, not handle to foreign tb element
								names.push( v.name );
								walk( v );
							}
						});
					}
					
					if ( pObj !== undefined ){
						var a = root.instanceOf(); // all sub objects
						if ( pObj instanceof String || typeof pObj === 'string' ) {
							//console.log( 'STRING check', a, 'for', pObj );
							return a.indexOf( pObj ) > -1 ? true : false;
						} else if ( pObj instanceof RegExp ) {
							//console.log( 'REGEXP check', a, 'for', pObj );
							$.each( a, function( i, v ){
								//console.log( ' check', i, v, 'for', pObj, '=>', pObj.test( v )  );
								if ( pObj.test( v ) ) {
									result = true;
								}
							});
						} else { // assume repo object
							//console.log( 'OBJECT check', a, 'for', pObj );
							return a.indexOf( pObj.name ) > -1 ? true : false;
						}
					} else {
						walk( root ); // recursively scan object
						return names;
					}

					return result;
				}
			},

			initChildren: function(){
				if ( this['_super'] ) return this._root().initChildren();
				if ( this['target'] ) {
					var elms = $(this.target)
									.find('[data-tb]')
									.map(function() {
										return $( this ).data('tbo') ? null : $( this );
										})
									.get();
					//console.log( 'initChildren()', elms );
					$.each( elms, function( i, v ){
						//console.log('initChildren(i,v)', i, v);
						//setTimeout(
						//	(function(v){ return function(){ 
								tb.init( v );
						//	};})(v),
						//	0
						//);
					});
				}
			},

			filter: function( s ){ // s: selector
				if ( s ){
					if ( this instanceof Array ){
						return _ma( this, s );
					} else if ( this instanceof tb ){
						if ( this['_super'] !== undefined ) {
							return this._root().filter(s);
						}
						return _me( this, s ) ? [ this ] : $.extend([], true, r[0] || tb.prototype); 
					}
				}
				return this;
			},

			inject: function( namespace, props ){
				var obj = tb.nameSpace( namespace, true ),
					props = props || this[namespace];

				this.status = 'inject';
				// async load obj if not available yet
				if ( $.isEmptyObject( obj ) && typeof obj === 'object' ){
					//console.log( 'REQUIRE ', namespace, namespace.replace( /\./g, '/' ) + '.js' );
					var fn = namespace.replace( /\./g, '/' ) + '.js';
					this.status = 'inject::require ' + fn;
					tb.require(
						[ fn ],
						(function(that, namespace){ return function(){
							// retry inject
							that.inject.apply( that, [ namespace ] )
						};})(this, namespace)
					);
					return;
				}

				//console.log( 'INJECT ', obj, ' NAMESPACE ', namespace, ' INTO ', this );

				// depending on the type of the loaded resource...
				switch( typeof obj ){
					case 'function':
						//console.log( 'func prototype:', obj.prototype );
						if ( $.isEmptyObject( obj.prototype ) ){
							//console.log('call plain function', namespace, 'with', this[namespace], 'on', this['_root'] ? this._root() : this );
							obj.apply( this['_root'] ? this._root() : this, [ this[namespace] ] );
						} else { // a constructor
							//console.log('inject new object', tb.nameSpace(namespace), 'into this[\''+ namespace+ '\'], this=', this );
							var result = new tb.nameSpace(namespace)( this );
							$.extend( true, this, result );
						}
						break;
					case 'object':
						//console.log('inject plain object', obj, 'into this[\''+ namespace+ '\']' );
						var props = this[namespace];
						this[namespace] = new tb( this.target );
						$.extend( 
							true,
							this[namespace],
							new tb( this.target ), 
							{
								_super: this, 
								config: props,
								_root: function(){
									var that = this;
									while ( that._super ){
										that = that._super;
									}
									return that;
								} 
							},
							obj
						); 
						//console.log( this[namespace], 'INSTANCEOF', obj );
						//this[namespace].instanceOf( obj, true );
						var that = this;
						$.each( this[namespace], function( i, v ){
							//console.log('test property', i, 'in this[\''+ namespace+ '\']', this );
							if ( that[namespace].hasOwnProperty( i ) && that[namespace][i] !== that[i] ){
								//console.log('-hasOwnProperty', i );
								if ( /\./.test( i ) ){ // it is a namespaced element
									// recursive inject
									//console.log('--recurse inject', i, 'in that[\''+ namespace+ '\'][\''+ i+ '\']' );
									var o = that[namespace];
									o.inject.apply( o, [ i ] );
								}
							}
						});
						//console.log('injected plain object',obj,'into this[\''+ namespace+ '\']: this => ', this );
						break;
					default: 
						//console.log('no handler -> ran into default', i );
						break;
				}
				this.status = 'done';
				if ( !this['_super']) $( this.target ).data('tbo', this);
			},

			parents: function( s ){
				var r = [];
				if ( this instanceof Array ){
					//console.log( 'array', this);
					$.each( this, function( i, v ){
						//console.log( 'check', v);
						var p = v.parents(s);
						$.extend(r, true, p instanceof tb ? [p] : p );
					});
				} else if ( this instanceof tb ){
					if ( this['_super'] !== undefined ) {
						return this._root().parents(s);
					}
					$( this.target ).parents('[data-tb]').each(function(i, v){
						v = $(v).data('tbo');
						if ( r.indexOf( v ) < 0 ) {
							r.push( v );
						}
					});
				}
				$.extend(r, true, tb.prototype)
				if (s) r = r.filter(s);
				return r.length === 1 ? r[0] : r;
			},

			parent: function(s){
				var r = [];
				if ( typeof this === 'array' || this instanceof Array ){
					$.each( this, function( i, v ){
						var p = v.parent(s);
						$.extend(r, true, p instanceof tb ? [p] : p );
					});
				} else if ( this instanceof tb ){
					if ( this['_super'] !== undefined ) {
						return this._root().parent(s);
					}
					var p = $( this.target ).parents('[data-tb]'),
						t = p[0] ? $( p[0] ).data('tbo') : null; 
					r =  t ? [ t ] : [];
				}
				$.extend(r, true, tb.prototype)
				if (s) r = r.filter(s);
				return r.length === 1 ? r[0] : r;
			},

			children: function(s){
				var r = [],
					that = this;
				if ( this instanceof Array ){
					//console.log( 'children array', this);
					$.each( this, function( i, v ){
						var c = v.children(s);
						$.extend(r, true, c instanceof tb ? [c] : c );
					});
				} else if ( this instanceof tb ){
					if ( this['_super'] !== undefined ) {
						return this._root().children(s);
					}
					$( this.target ).find('[data-tb]').each(function(i, v){
						v = $(v).data('tbo');
						if ( v.parent() === that && r.indexOf( v ) < 0 ) {
							r.push( v );
						}
					});
				}
				$.extend(r, true, tb.prototype)
				if (s) r = r.filter(s);
				return r.length === 1 ? r[0] : r;
			},

			descendants: function(s){
				var r = [];
				if ( this instanceof tb ){
					if ( this['_super'] !== undefined ) {
						return this._root().descendants(s);
					}
					$( this.target ).find('[data-tb]').each(function( i, v ){
						r.push( $(v).data('tbo') );
					});
				} else if ( this instanceof Array ){
					// assume array of tbo objects
					//console.log( this instanceof Array, this[0], this[0] instanceof tb );
					$.each( this, function( i, v ){
						var d = v.descendants(s)
						$.extend(r, true, d instanceof tb ? [d] : d );
					});
				}
				//console.log('--descendants(',s ? s : '',') are:', r);
				$.extend(r, true, tb.prototype)
				if (s) r = r.filter(s);
				return r.length === 1 ? r[0] : r;
			},

			structure: function( pIndent, pPropName, pOrigin ){
				var origin = pOrigin instanceof tb ? pOrigin : this,
					name = this.name,
					indent = typeof pIndent === 'number' ? pIndent : 0,
					indentString = (new Array( indent + 1 )).join( '\t' ),
					propName = pPropName || '';
				if ( this instanceof Array || typeof this === 'array' ){
					$.each( this, function( i, v ){
						if ( v && $.type(v) != 'null' ) if ( v instanceof tb ){
							v.structure.apply( v, [ indent ] );
						}
					});
				} else if ( this instanceof tb ) {
					console.log( indentString + ( propName.length > 0 ? '[\'' + propName + '\']: ' : '') + this['name'] || '<no name>', this);
					$.each( this, function( i, v ){
						if ( /^_/.test( i ) ) {  // ignore internal values
							//console.log( indentString + i + ': <internal property>' );
						}
						if ( v && $.type(v) != 'null' ) if ( v instanceof tb ){
							var p = origin.parents(),
								p = typeof p === 'array' ? p : [p];
							if ( p.indexOf(v) === -1 ){
								v.structure.apply( v, [ indent + 1, i, origin ] );
							} else {
								console.log( indentString + '\t<element is anchestor of origin tbo, recursion warning>');
							}
						}
					});
				}
			}

		};
	})();
})();

/**
 * init twobirds objects
 * @memberOf tb
 * @namespace tb.init
 * @params arguments is any mix of elements
 * @description 
 */
tb.init = function(){
	
	// construct args array
	//console.log( arguments );
	tb.init.initialzed = true;

	var args = Array.prototype.slice.call( arguments, 0 );

	//console.log( 'Attempt: tb.init' )
	if (!args[0]) { 
		if (!tb.init['initialized']){
			//console.log( '-> add cold start "body"' )
			args.push( 'body' );
		} else {
			//console.log( '-> no parm but already initialized -> return' )
			return;
		}
	}
	
	//walk args array -> every domNode /w [data-tb]
	for ( var i=0, l=args.length; i<l; i++ ) {
		//console.log( args[i] );
		// construct matches		
		if ( $( args[i] ).attr('data-tb') ){
			var set = $( args[i] );
			set = set.add(set.find('[data-tb]'));
		} else {
			var set = $( args[i] ).find('[data-tb]');
		}

		if ( !set ){
			//console.log('no tb-data elements for', args[i] );
		} else {
			set.each( function( i, v ){ // for each domNode:data-tb element

				if ( !$(v).data('tbo') ){
					var tbo = new tb(v);
					tbo.name = tb.getid();
					tbo.status = 'init';
					$(v).data('tbo', tbo );
				} else {
					return; // already initialized
				}

				var a = $(v).attr('data-tb').split(' ');
				$( a ).each(function( i, e ){ // walk each .js file definition in data-tb
					//console.log( 'tb.init element', e );
					var ns = e.replace(/\//g, '.').split('.');
					//console.log( 'tb.init ns', ns );
					ns.pop(); // cut extension
					ns = ns.join('.');
					e = tb.nameSpace( ns, true );
					tbo[ns] =  new tb(v);
					//console.log( 'init: ', tbo, ns );
					tbo.inject.apply( tbo, [ ns ] );
				});
				tbo.status = 'done';
			});
		};
	}
};

/**
 * handles all requirements loading
 * @namespace tb.require
 */
tb.require = function( pA, pCb ){

	var myCb = pCb || tb.nop,
		myA = typeof pA === 'string' || pA instanceof String ? [pA] : pA,
		lA = []; // array of files that need to be loaded

	if ( ! ( typeof myA === Array || myA instanceof Array ) ) return;

	//console.log( 'require', pA, this, this instanceof tb );

	// if called as a tb().require()
	// will trigger 'tb.require:done' on that tb object when finished
	//console.log( 'tb.require() this=', this, this instanceof tb );
    if ( this instanceof tb || this['trigger'] ){
		//console.log( 'tb.require() callback construction for tb object', this );
    	myCb = (function(that, a, myCb){ return function(){
	        //console.log('require CB on object: ', that, a, myCb);
    		that.trigger({
    			name: 'tb.require:done', 
    			data: a 
    		});
    		myCb();
    	};})(this, myA, myCb );
    }

    $.each( myA, function( i, v ){
        if ( !tb.loader.test( v ) ) { // not finished loading
        	lA.push( v );
        }
    });

    //console.log( 'lA', lA );

    if ( lA.length === 0 ) { // all requirements met
    	//console.log('tb.require all reqs met', myA);
        myCb();
        return;
    } else { // open requirements: add to requirements group object
    	//console.log('tb.require open reqs', lA);
    	lA.cb = myCb
    	tb.require.groups.push( lA );
    }

    $.each( lA, function( i, v ){
        tb.loader.load( v, tb.require.checkGroups );
    });
};


tb.require.groups = [];

tb.require.checkGroups = function(){ // check all requirement groups

	//console.log( ' check groups:', $.extend([], true, tb.require.groups) );

	function checkRg( pI, pV ){ // check requirement group
		var pV = pV || tb.nop,
			done = true,
			aLeft = [];
		
		aLeft.cb = pV.cb || tb.nop;
		
		//console.log( 'checkGroup', pI, pV );
		$.each( pV, function( i, v ){
			//console.log( '-', i, v, tb.loader.test( v ) );
			if ( !tb.loader.test( v ) ){
				aLeft.push(v);
				done = false;
			}
		});

		if ( done === true ){ // execute callback and delete req group 
			//console.log( 'done group', pV);
			tb.require.groups.splice( pI, 1 );
			//console.log( 'execute group callback', pV.cb.toString() );
			if (pV.cb) pV.cb(); // execute callback
			return;
		} else {
			//console.log( 'group', pV, ' is now ', aLeft );
			tb.require.groups[pI] = aLeft;
		};
	}

	$.each( tb.require.groups, function( i, v ){
		checkRg( i, v );
	});
}

// add trigger function to tb prototype
// so result sets will have it too
tb.prototype.require = tb.require;

/**
 * create namespace
 * @class
 * @memberOf tb
 * @namespace tb.nameSpace
 * @description 
 */
tb.events = function( pTb ){
	// add trigger function to tb prototype
	// so result sets will have it too
	// tb.prototype.trigger = tb.prototype['trigger'] || tb.events.prototype.trigger;
	var handlers = pTb.handlers || [];
	//console.log( 'new events', pTb, pTb['tb.events'] );
	$.extend( handlers, pTb['tb.events'] || [] );
	delete  pTb['tb.events'];
	return { handlers: handlers };
}

tb.events.prototype = (function(){ 

	function handleEvent(ev){
		// event handler
		var that = this,
			bubble = true;
		//console.log('TB event caught:', ev, 'in TB    ', that );
		if (this['handlers']) $.each( this.handlers, function( i, v ){
			if ( v.name === ev.name || ( v.name instanceof RegExp && v.name.test(ev.name) ) ){
				//console.log('TB event match:', ev, 'in', that );
				if ( v['handler'] ) {
					//console.log('call handler', v['name'], v['handler'] , 'in the scope of', that );
					bubble = bubble && v['handler'].apply( that, [ev] ) === false ? false : true;
					// bubble
					if ( bubble && ev.bubble ){
						var b = evt.bubble;
						//console.log( 'bubble', b, 'in', that );
						if ( b.indexOf( 'u' ) > -1 && that.parent()[0] ){
							//console.log( 'bubble up', that.parent()[0] );
							evt.bubble='u';
							that.parent().trigger.apply( that.parent(), [evt] );
						}
						if ( b.indexOf( 'd' ) > -1 ){
							//console.log( 'bubble down', that, that.children() );
							evt.bubble='d';
							var c = that.children();
							if ( c instanceof Array || typeof c === 'array' ) {
								$.each( that.children(), function( i, v ){
									if (v instanceof tb) v.trigger( evt );
								});
							} else if ( c instanceof tb ) {
								c.trigger( evt );
							}
						}
					}
				}
			}
		});
		//console.log('subtrigger of', that);
		$.each( that, function( i, v ){
			//console.log(' test', i, v );
			if ( v instanceof tb ) if ( i && typeof i === 'string' && !(/^_/).test(i) && v['_super'] ) {
				//console.log(' -> is tb', v);
				handleEvent.apply( v, [ ev ] );
			}
		});
		return true;
	};

	return {
		trigger: function(ev, data){
			// event standard structure:
			var stdEv = {
					name: 'stdEvent', 			// must be overwritten
					origin: this,				// tb object origin
					target: $( this.target ), 	// jquery origin element
					bubble: ''					// do not bubble, other options 'u', 'd', 'ud'
				},
				evt;

			if ( typeof ev === 'string' || ev instanceof String ){ // simple event, notification, ev = name
				// convert to obj:
				evt = $.extend(
					stdEv,
					true,
					{
						name: ev,
						data: data
					}
				);
			} else if ( typeof ev === 'object' || ev instanceof Object ){
				evt = $.extend(
					stdEv,
					true,
					{ data: data },
					ev
				);
			}
			
			//console.log( 'trigger', evt, 'on', this['_root'] ? this._root() : this );

			if ( this instanceof Array ){
				// assume array
				// console.log( 'trigger', ev, 'on array', this );
				$.each( this, function( i, v ){
					if ( v instanceof tb ) v.trigger( evt );
				});
			} else {
				setTimeout( 
					(function( that, evt ){ return function(){
						handleEvent.apply( $(that.target).data('tbo'), [ evt ] );
					};})( this['_super'] !== undefined ? this._root() : this, evt ),
					20
				);
			}
			return this;
		}
	};
})();

tb.prototype.trigger = tb.events.prototype.trigger;

/**
 * browser sniff - TBD replace by feature sniffer, modernizr
 * @memberOf tb
 * @namespace tb.browser
 * @description <br>tb.browser = {<br>
    version: ((navigator.userAgent.toLowerCase()).match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],<br>
    safari: /webkit/.test(navigator.userAgent.toLowerCase()),<br>
    opera: /opera/.test(navigator.userAgent.toLowerCase()),<br>
    msie: /msie/.test(navigator.userAgent.toLowerCase()) && !/opera/.test(navigator.userAgent.toLowerCase()),<br>
    mozilla: /mozilla/.test(navigator.userAgent.toLowerCase()) && !/(compatible|webkit)/.test(navigator.userAgent.toLowerCase())<br>
};<br>
 */
tb.browser = {
    version: ((navigator.userAgent.toLowerCase()).match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: /webkit/.test(navigator.userAgent.toLowerCase()),
    opera: /opera/.test(navigator.userAgent.toLowerCase()),
    msie: /msie/.test(navigator.userAgent.toLowerCase()) && !/opera/.test(navigator.userAgent.toLowerCase()),
    mozilla: /mozilla/.test(navigator.userAgent.toLowerCase()) && !/(compatible|webkit)/.test(navigator.userAgent.toLowerCase())
};

/**
 * create namespace
 * @memberOf tb
 * @namespace tb.nameSpace
 * @description 
 */
tb.nameSpace = function( pString, pCreate ){
	var a = pString.split('.'),
		e = window,
		ns = 'window',
		ret = false;

	//console.log('ns check', pString, 'in', ns)

	if ( pCreate ){
		while ( a[0] ){
			var me = a.shift();
			//console.log('check', me, 'in', ns, '->', e, e[me] );
			if ( !e.hasOwnProperty(me) ){
				e[me]={};
			}
			e=e[me];
			ns = ns + '.' + me;
		}
	} else {
		while ( a[0] ){
			var me = a.shift();
			//console.log('check', me, 'in', ns, '->', e, e[me] );
			if ( !e.hasOwnProperty(me) ){
				return false;
			} 
			e=e[me];
			ns = ns + '.' + me;
		}		
	}

	return e;
}

/** @memberOf tb
 * @namespace tb.Cache
 * @class
 * @description provides a caching mechanism 
 */
tb.Cache = function () {
	/** @private
	 * cache hash */
    this.c = {};
};

tb.Cache.prototype = (function () {
    /**
     * @private
     * @description Deletes an item from the cache
     * @param pId Id of the item
     */

    function d(pId) {
        this.c[pId] = null;
        delete this.c[pId];
    }

    /**
     * @private
     * @description Adds an item to the cache
     * @param pWhat Item
     */

    function a(pWhat) {
        var myId = tb.getid();
        this.c[myId] = pWhat;
        return myId;
    }

    /** @lends tb.Cache */
    return {
        /**
         * @public
         * @description Cache of the TwoBirds object
         */
        c: this.c,
        // debugging handler
        /**
         * @public
         * @description Adds a key-value pair to the cache
         * @param pId key
         * @param pContent value
         */
        set: function (pId, pContent) {
            if (pId) {
                this.c[pId] = pContent;
            }
            else {
                return a.call(this, pContent);
            }
        },

        /**
         * @public
         * @description Returns the value to the given key from the cache
         * @param pId key
         * @returns value or false if it doesn't exist
         * 
         */
        get: function (pId) {
            return this.c[pId] || false;
        },

        extract: function (pId) {
            var r = this.c[pId];
            pId = pId ? d.call(this, pId) : null;
            return r || false;
        },

        /**
         * @public
         * @description Clears the cache
         * @returns previous cache entries
         */
        flush: function () {
            var c = this.c;
            this.c = {};
            return c;
        }

    };
})();

/**
 * @memberOf tb
 * @namespace tb.Chain
 * @class
 * @description a collection object for functions, which can be executed with one call
 */
tb.Chain = function () {
    this.chain = {};
};

tb.Chain.prototype = {
	/**
	 * @description returns number of entries in chain
	 */
    length: function () {
    	var i, 
    		j = 0;
    	for (var i in this.chain) j++;
    	return j;
    },

	/**
	 * @description Adds a function to the chain
	 * @param pName key
	 * @param pCb function
	 */
    add: function (pName, pCb) {
        //console.log('adding to chain: ' + pName + '    ' + tb.serialize(pCb) );
        this.chain[pName] = pCb;
    },

    /**
     * @description Removes a function from the chain
     * @param pName key
     */
    remove: function (pName) {
    	if ( pName ){
            delete this.chain[pName];
    	}
    	else {
    		this.chain = {};
    	}
    },

    /**
     * Removes all functions from the chain
     */
    flush: function() {
    	this.chain = {};
    },

    /**
     * @description Executes the chain of functions
     * @param (arguments) (any type) parameters to hand over to the functions 
     */
    execute: function() {
        //console.log('executing chain with Parameters: ' + tb.serialize( arguments ) );
        for (var i in this.chain) {
            if (typeof this.chain[i] === 'function') {
                //console.log('executing  chain: ' + tb.serialize( this.chain[i] ) );
                //console.log('using parameters: ' + tb.serialize( pParms ) );
                this.chain[i].apply(this, arguments);
            }
        }
    }
};

/**
 * @memberOf tb
 * @public
 * @description An empty function
 */
tb.nop = function () {
};

/**
 * @public
 * @description window.setTimeout() placeholder
 * @param pFunc { function } function to execute
 * @param pTimeout { number, optional, default 0 } milliseconds to wait
 */
tb.sync = function ( pFunc, pTimeout ) {
    window.setTimeout( pFunc, pTimeout || 0 );
};

/**
 * @public
 * @description bind an object to a functions 'this' scope
 * @param pFunc { function } function 
 * @param pObj { object } object to bind 'this' to
* @return resulting function
* @type function
 */
tb.bind = function ( pFunc, pObj ) {
    var retFunc = function(){ ( pFunc._super ? pFunc._super : pFunc ).apply( pObj, arguments ); };
    retFunc._super = ( pFunc._super ? pFunc._super : pFunc );
    return retFunc;
};

/**
 * @public
 * @description returns a unique identifier string
 * @return unique identifier
 * @type string
 */
tb.getid = function(){
    var myDate = new Date();
    return '_' + myDate.getTime() + '_' + Math.random().toString().replace(/\./, '');
};

/**
 * @memberOf tb
 * @namespace tb.request
 * @field
 * @description the twoBirds request object
 */
tb.request = (function () {
    /** @private */
    var interval = 30,
        msoft = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];

    /** @private */
    function addhandler(pId, pCb) {
        tb.cache.set(pId, pCb);
    }

    /** @private */
    function getConnection(pId) {
        var myObj = {};
        var myHttp;

        if (typeof ActiveXObject !== 'undefined') for (var i = 0; i < msoft.length; ++i) {
            try {
                myHttp = new ActiveXObject(msoft[i]);
                myObj = {
                    connection: myHttp,
                    identifier: pId
                };
                /** @ignore */
                getConnection = (function (pType) {
                    return function (pId) {
                        var myHttp = new ActiveXObject(pType);
                        myObj = {
                            connection: myHttp,
                            identifier: pId
                        };
                        return myObj;
                    };
                })(msoft[i]);
            }
            catch (e) {}
        }

        try {
            myHttp = new XMLHttpRequest();
            myObj = {
                connection: myHttp,
                identifier: pId
            };
            /** @ignore */
            getConnection = function (pId) {
                var myHttp = new XMLHttpRequest();
                myObj = {
                    connection: myHttp,
                    identifier: pId
                };
                return myObj;
            };
        }
        catch (e) {
        }
        finally{
        	return myObj;
        }
    }

    /** @private */
    function handlereadyState(pReq, pCallback, pStateChange, pFailure) {
        var myConnection = this;
        var myReq = pReq;
        var myPoll = window.setInterval((function (preadyState) {
            return function () {
            	if (myReq.connection.readyState !== preadyState) {
                    preadyState = myReq.connection.readyState;
                    //pStateChange();
                }
                if ( preadyState === 4) {
                    if (myReq.aborttimer) {
                        window.clearTimeout(myReq.aborttimer);
                    }
                    window.clearInterval(myPoll);
                    handleTransactionResponse(pReq, pCallback, pFailure);
                }
            };
        })( 0 ), interval );
        return myPoll;
    }

    /** @private */
    function handleTransactionResponse(pReq, pCallback, pFailure) {
        try {
            var httpStatus = pReq.connection.status;
        }
        catch (e) {
            var httpStatus = 13030;
        }
        if (httpStatus >= 200 && httpStatus < 300) {
            var responseObject = createResponseObject(pReq, pCallback.argument);
            try {
            	//console.log( pReq.src );
            	//console.log( 'request callback: '+pCallback.toString() );
                pCallback.apply(pCallback, [responseObject.responseXml, responseObject.responseText, responseObject]);
            }
            catch (e) {
            	if ( tb.debug ) debugger; 
            }
        }
        else {
            var responseObject = createResponseObject(pReq, pCallback.argument);
            pFailure.apply( pFailure, [ responseObject ] );
        }
        release(pReq);
    }

    /** @private */
    function createResponseObject(pObj, pCallbackArg) {
        var myObj = {};
        myObj.tId = pObj.identifier;
        myObj.status = pObj.connection.status;
        myObj.statusText = pObj.connection.statusText;
        myObj.allResponseHeaders = pObj.connection.getAllResponseHeaders();
        myObj.responseText = pObj.connection.responseText;
        myObj.responseXML = pObj.connection.responseXML;
        if (pCallbackArg) {
            myObj.argument = pCallbackArg;
        }
        return myObj;
    }

    /** @private */
    function release(pReq) {
        tb.request.dec();
        if (pReq.connection) pReq.connection = null;
        delete pReq.connection;
        pReq = null;
        delete pReq;
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
 * @param pOptions.failure: (function, optional) the function to call if request status not in 200...299
 * @param pOptions.statechange: (function, deprecated, optional) the function to call when readyState changes
 * @param pOptions.timeout: (object, optional ) structure sample: { cb: myFunction, ms:10000 }<br>
 * cb: callback to run when timeout occurs<br>
 * ms: number of milliseconds the request will run before being terminated
 * @param pOptions.cachable: (boolean, deprecated, optional) defaults to true, indicates whether or not to include a unique id in URL
 * @param pOptions.async: (boolean, optional, defaults to true) whether or not to make an asynchronous request
     */
    return function (pOptions) {
        var myIndex = tb.getid(),
            myUid = 'tb' + myIndex,
            myXmlreq = false,
            myMethod = (pOptions.method ? pOptions.method.toUpperCase() : false) || 'POST',
            myUrl = pOptions.url,
            myParms = '';

        if (typeof pOptions.parms != 'undefined') {
        	var ct = ( pOptions.headers && pOptions.headers['Content-Type'] 
        				? pOptions.headers['Content-Type'] 
        				: 'application/x-www-form-urlencoded' );
        	
        	switch ( ct ){
        	case 'application/json':
        		myParms = $.toJSON( pOptions.parms );
        		break;
        	default:
                for (var i in pOptions.parms) { // concat parameter string
                    myParms += ((myParms.length > 0 ? '&' : '') + i + '=' + pOptions.parms[i]);
                }
        		break;
        	}
        }
        
        var myResponseXmlHandler = pOptions.success || tb.nop,
            myFailureHandler = pOptions.failure || tb.nop,
            myStateHandler = pOptions.statechange || tb.nop,
            myIsCachable = pOptions.cachable || false,
            myTimeout = pOptions.timeout || false,
            myIsAsync = (typeof pOptions.async !== 'undefined' && pOptions.async === false) ? false : true;

        tb.request.inc();

        if (myIsCachable === false) { // proxy disable
            myUrl += (myUrl.indexOf('?') < 0 ? '?' : '&') + 'tbUid=' + myUid;
        }

        myXmlreq = getConnection(myUid);
        if (myXmlreq) {
            if ( myMethod === 'GET' && myParms !== '') {
                myUrl = myUrl + (myUrl.indexOf('?') < 0 ? '?' : '&') + myParms;
            }
            myXmlreq.src=myUrl;

            myXmlreq.connection.open(myMethod, myUrl, myIsAsync);

            if (myIsAsync === true) {
                myXmlreq.poll = handlereadyState(myXmlreq, myResponseXmlHandler, myStateHandler, myFailureHandler, myUrl);
            }

            // set request headers
            if (pOptions.headers) {
                for (var i in pOptions.headers) {
                	if (i !== 'Content-Type') {
                		myXmlreq.connection.setRequestHeader(i, pOptions.headers[i]);
                	}
                }
            }

            // abort functionality
            if (myTimeout) {
                myXmlreq.timeoutTimer = window.setTimeout(

                function (pT, pR) {
                    var myF = typeof pT.cb === 'function' ? pT.cb : false;
                    return function () {
                        //if ( !myR && myR.connection.status == 4 ) return;
                        if (typeof myF == 'function') {
                            myF( /*createResponseObject(myR)*/ );
                        }
                        pR.connection.abort();
                        window.clearInterval(pR.poll);
                    };
                }(myTimeout, myXmlreq), myTimeout.ms);
            }

            myXmlreq.abort=tb.bind( function () {
                window.clearInterval(this.poll);
                if (this.connection) this.connection.abort();
                release(this);
            }, myXmlreq );

            // send
            if (myMethod === 'POST' || myMethod === 'PUT') {
                if (myParms !== '') {
                    myXmlreq.connection.setRequestHeader('Content-Type', ct);
                    myXmlreq.connection.send(myParms);
                }
                else {
                    myXmlreq.connection.send(null);
                }
            }
            else {
                myXmlreq.connection.send(null);
            }
            // if sync request direct handler call
            if (myIsAsync === false) {
                tb.request.dec();
                if (myXmlreq.connection.status >= 200 && myXmlreq.connection.status < 300) {
                    myResponseXmlHandler(myXmlreq.connection.responseXML, myXmlreq.connection.responseText);
                }
                else {
                    myFailureHandler( myXmlreq );
                }
            }
            else {
                return myXmlreq;
            }
            return;
        }
        else {
            return false;
        }
    }
})();

tb.request.loadlist = [];
tb.request.readyState = 'complete';
tb.request.cachable = false;
tb.request.log = false;

tb.request.inc = function ( pReq ) {
    tb.request.loadlist.push( pReq );
    tb.request.count = tb.request.loadlist.length;
    tb.request.readyState = 'loading';
};

tb.request.dec = function ( pReq ) {
    for ( var i=0, l=tb.request.loadlist.length; i < l; i++){
    	if ( pReq === tb.request.loadlist[i] ){
            tb.request.loadlist.splice( i, 1 );
            tb.request.count = tb.request.loadlist.length;
            if ( tb.request.loadlist.length === 0 ){
                tb.request.readyState = 'complete';
            }
            break;
    	}
    }
};


/* 
 * This bugfix ensures that forgotten console-commands don´t crash the system
 */
if ( !console ) { 
	console = {}; 
}

$.each( 
	['log','debug','info','warn','error','assert',
    'dir','dirxml','trace','group','groupCollapsed',
    'groupEnd','time','timeEnd','profile','profileEnd',
    'count','exception','table'],
    function( i, v ){
		console[v] = console[ v ] || tb.nop;
	}
);

/**
 *  this object contains all twoBirds LOADER specific functionality
 *  @namespace tb.loader
 */
tb.loader = (function(){
	// count is used to trigger idle or loading status for global spinner if necessary
	var count = 0;

	/** @private */
	function getType( pPath ){
		return pPath.split('.').pop();
	}

	/** @lends tb.loader */
    return {
    	/** @function
    	 * @private
    	 */
    	getType: getType,
    	
    	/**
    	 * start or end of load trigger this function
    	 * @param pInc { numeric, omitted, -1 or +1 }
    	 * @param pPath { string, optional } path part of the URL
    	 */
    	count: function( pInc, pPath ){
    		count += pInc;
    		//console.log( 'load count', count, pInc === 1 ? '-->' : '<--', pPath );
    		if ( count === 0 ){
    			//console.log('tb status idle', tb('*'));
    			tb('*').trigger('tb:idle');
    		} else if ( count === 1 && Math.abs( pInc ) === pInc ) {
    			//console.log('tb status loading', tb('*'));
    			tb('*').trigger('tb:loading');
    		}
		},

    	/**
    	 * load a resource using the specific type loader
    	 * @param pPath {string, omitted} path part of the URL
    	 * @param pCallback {function, optional} callback function after resource has loaded
    	 * @returns
    	 */
		load : function(){ // general loader switch
			//console.log( 'load apply', Array.prototype.slice.call( arguments ) );
			return tb.loader[ getType( arguments[0] ) ].load.apply( this, Array.prototype.slice.call( arguments ) );
		},

        /**
         * tests whether a resource was loaded already using the specific type loader
         * @param pPath {string, omitted} path part of the URL
         * @returns
         */
		test: function ( pPath ) { // returns true when element has loaded, false otherwise
	        return tb.loader[ getType( pPath ) ].test( pPath );
	    },
	    
	    /**
	     * get a resource using the specific type loader
	     * @param pPath
	     * @returns
	     */
	    get: function( pPath ){ // get result from loader cache
	        return tb.loader[ getType( pPath ) ].cache.get( pPath );
	    },

	        /** private */
    	errCb: function( url) {
	    	//console.log('generate css callback');
	        return function(){
	        	throw ( 'NOT LOADED: ' + url );
	        };
	    }
    };
})();

/**
 * javascript file loader
 * @namespace tb.loader.js
 */
tb.loader.js = (function () {
    var c = new tb.Cache();

    // execute JavaScript by <script>-tag
    function addScript( pPath, pUrl, pCb ) {
  		var head = document.getElementsByTagName('head')[0],
			script = document.createElement('script'),
			done = false;

		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', pUrl);

		function completed(){
			// make sure, this is called only once
			if ( done ) return;
			done = true;
			c.set( pPath, 1 );
            tb.loader.count( -1, 'JS: ' + pPath );
			if ( pCb ) pCb();
			tb.require.checkGroups();
		}
		
		script.onload = completed;
		script.addEventListener('load', completed, false);

		script.onreadyStatechange = function () {
			var state = script.readyState;
			if (state === 'loaded' || state === 'complete') {
				script.onreadyStatechange = null;
				completed();
			}
		}

		head.appendChild(script);
    }

    /** @lends tb.loader.js */
    return {

    	/** @private */
        cache: c,

		/**
		 * @function
		 * @memberOf tb.loader.js
		 */
        load: function ( pPath, pCb ) {
            var url,
                pCb = pCb || tb.nop;

        	if ( !pPath ) return;
        	url =  tb.loader.js.prefix + pPath + '?' + tb.getid();
			tb.loader.count( 1, 'JS: ' + pPath );
            c.set( pPath, 0 );   	
        	addScript( pPath, url, pCb);
        },

        test: function( pPath ){
        	var i = c.get( pPath );
        	return !!i; // status 1 is done
        }
    };
})();


/**
 * css file loader
 * @namespace tb.loader.css
 */
tb.loader.css = (function () {
    var c = new tb.Cache();

    /** private */
    function cb( pPath, pUrl, pCb ) {
    	//console.log('generate css callback');
        return function (pXml, pText ) {

            var css = document.createElement('style'),
                head = document.getElementsByTagName('head')[0],
                filepath = pUrl.split('/');

            filepath.pop();
            filepath = filepath.join('/') + '/';
            
        	//console.log('filepath', filepath );
        	//console.log('css loader callback function', pPath, pUrl );

            tb.loader.css.cache.set( pPath, pText );
            tb.loader.count( -1, 'CSS: ' + pPath );

            css.setAttribute('type', 'text/css');
            css.setAttribute('filename', pPath);

            // correct static content urls
            pText = pText.replace(/url\((.*)\)/g, 'url(' + filepath + '$1)');
            /*
            pText = pText.replace(/src="(.*)"/g, 'src="' + filepath + '$1"');
            pText = pText.replace(/href="(.*)"/g, 'href="' + filepath + '$1"');
			*/

			if (tb.browser.msie) {
                css.styleSheet.cssText = pText;
            }
            else {
                css.appendChild(document.createTextNode(pText));
            }

            //myHead.insertBefore(myCss, myHead.firstChild);
            head.appendChild(css);

            //console.log('CSS loader execute: '+tb.serialize( pCb ) );
            if (pCb) pCb();
        	//console.log('css loader callback checkRg call');
        	tb.require.checkGroups();
        };
    }

    /** @lends tb.loader.css */
    return {
        /** private */
        cache: c,

		/**
		 * @function
		 * @memberOf tb.loader.css
		 */
        load: function ( pPath, pCb ) {
            var done = false,
            	url = ( tb.loader.css['prefix'] || '') + pPath,
                myCb = pCb || tb.nop; // CAUTION: see below, triggers loading via request
            
        	if ( !pPath ) return;
			tb.loader.count( 1, 'CSS: ' + pPath );

            //console.log( 'loader.css.load', pPath, pCb );
            c.set( pPath, 0 );

            if ( pCb ) { // if callback load via request
	            //console.log( 'loader.css.load METHOD xhr', pPath, pCb );
                tb.request({
                	method: 'GET',
                    url: url,
                    success: cb( pPath, url, pCb ),
                    failure: tb.loader.errCb( url )
                });
            } else { // if no callback append link to head ( predictive load )
	            //console.log( 'loader.css.load METHOD head.insertBefore', pPath, pCb );
                var css = document.createElement('link');
                css.setAttribute('rel', 'stylesheet');
                css.setAttribute('type', 'text/css');
                css.setAttribute('href', myUrl);
                head.insertBefore(myCss, myHead.firstChild);
            }
        },

        test: function( pPath ){
        	var i = c.get( pPath );
        	return !!i; // status 1 is done
        }
    };
})();

/**
 * template file loader
 * @namespace tb.loader.tpl
 */
tb.loader.html = (function () {
    var c = new tb.Cache();
    
    /** @private */
    function cb( pPath, pUrl, pCb ) {
    	//console.log('generate html callback');
        return function (pXml, pText) {
	    	pText = !pText ? '<div>template was an empty string</div>' : pText;
            tb.loader.html.cache.set( pPath, pText );
            //console.log('execute html callback', pPath, pUrl, pCb, tb.loader.html.cache.c );
        	tb.loader.count( -1, 'HTML: ' + pPath );
            if (pCb) pCb();
        };
    }

    /** @lends tb.loader.tpl */
    return {
    	/** @private */
        cache: c,

		/**
		 * @function
		 * @memberOf tb.loader.tpl
		 */
        load: function ( pPath, pCb ) {
            var done = false,
            	url = ( tb.loader.html['prefix'] || '') + pPath,
                myCb = pCb || tb.nop; // CAUTION: see below, triggers loading via request
            
        	if ( !pPath ) return;

			tb.loader.count( 1, 'HTML: ' + pPath );

            var options = {
                    method: 'GET',
                    url: url,
                    success: cb( pPath, url, pCb )
                };

            c.set( pPath, 0 );

            tb.request( options );

            return pPath;
        },

        test: function( pPath ){
        	var i = c.get( pPath );
        	return !!i; // status 1 is done
        }
    };
})();

// bootstrap application when ready ==> MUST BE LAST IN TB FILE
$( function(){
	$.extend( true, window['tb'], tb.config || {} ); 
	tb.init(); 
} );