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
	// private init twobirds objects in DOM
	// args[0] is DOM node or set to DOM body node if undefined
	_init = function(){
		
		// construct args array
		//console.log( arguments );
		_init.initialzed = true;

		var args = Array.prototype.slice.call( arguments, 0 );

		//console.log( '_init ', arguments )
		if (!args[0]) { 
			if (!_init['initialized']){
				args.push( 'body' );
			} else {
				return;
			}
		}
		
		//walk args array -> every domNode /w [data-tb]
		for ( var i=0, l=args.length; i<l; i++ ) {
			// construct matches		
			if ( $( args[i] ).attr('data-tb') ){
				var set = $( args[i] );
				set = set.add(set.find('[data-tb]'));
			} else {
				var set = $( args[i] ).find('[data-tb]');
			}

			//console.log( '_init set = ', set )

			if ( !set ){
				//console.log('no tb-data elements for', args[i] );
			} else {
				set.each( function( i, v ){ // for each domNode:data-tb element

					//console.log( '_init set element = ', i, v );
					
					if ( $(v).data('tbo') === undefined ){
						// create top level object
						var tbo = new tb(v);
						tbo.name = tb.getid();
					} else {
						//console.log( '_init set element ALREADY INITIALIZED' );
						return; // already initialized
					}

					//console.log( '_init set element new tbo = ', tbo );

					var a = $(v).attr('data-tb').split(' ');

					tb.require( a, (function( tbo, a, v ){ return function(){
						//console.log( '_init set element new tbo CALLBACK', tbo );
						$.each( a, function( i, e ){
							var ns = e.replace( /.js$/, '').replace( /\//g, '.' );
							//console.log( '_init set element new tbo CALLBACK INJECT', ns );
							tbo.inject.apply( tbo, [ ns ] );
						});
					};})( tbo, a, v ));
						
				});
			};
		}
	};

	// private: match tbo engine
	function _me( e, s ){ // e = tbo object, e = selector
		if ( e instanceof HTMLElement ){
			//console.log( 'convert:', e );
			e = $(e).data('tbo');
			//console.log( 'now is :', e );
		}
		if ( e === undefined || !e instanceof tb ) return false;
		//console.log( 'selector _me', e, s );
		
		if ( typeof s === 'string' || s instanceof String ){ // assume jquery selector
			return $(e.target).is(s);
		} else if ( $.isPlainObject(s) && !s instanceof tb ){ // a test object to match against
			var match = true;
			$.each( s, function( key, val){
				if ( !e[key] || !( val === e[key] || typeof e[key] === val || (val instanceof RegExp && typeof e[key] === 'string' && val.test(e[key]) ) ) ) {
					match = false;
					$.each( $.extend( [], true, e ), function( i, v ){
						match = match || v.is( s );
					});
					return match;
				}
			});
			return match;
		} else if ( s instanceof RegExp ){ 
			// shortcut for testing name against regexp, 
			// e.g. tb(/body/) all tb objects that contain 'body' in their name
			return s.test( e.instanceOf().join(',') );
		} else { // assume object match
			// this will return the exact sub object match
			var i = e.instanceOf( s );
			//if ( i !== false ) console.log('return subobject', i );
			return i;
		}
		return false;
	}

	// private: match array engine
	function _ma( a, s ){ // a = Array, e = selector
		var r = [];
		//console.log( 'selector _ma', a, s );
		$.each( a, function( i, v ){
			if ( v instanceof HTMLElement ){
				//console.log( 'selector _ma element', v, v instanceof HTMLElement, $(v).data('tbo') );
				v = $(v).data('tbo');
			}
			var e =  _me( v, s );
			if ( e !== undefined && e !== false ){
				r.push( e === true ? v : e );
			}
		});
		//console.log( 'selector _ma', r );
		$.extend(r, true, tb.prototype)
		return r.length === 1 ? r[0] : r ;
	}

	// private: selector engine
	function _se( s ){

		var s = s || {}, // no selector --> everything matches
			a = this === window ? $('[data-tb]') : this; // either jquery all tb DOM nodes array or assume result set

		//console.log( 'selector _se', a );

		if ( this === window ){ // simple selector call tb('...') 
			return _ma( a, s );
		} else if ( a instanceof Array || a instanceof tb ){ // assume call on instance(s) e.g. tb('body').filter(...)
			return _ma( this, s );
		}
		return false; // return array of tbo objects
	}

	// explicit public part
	window.tb = function( a ){
		if( a instanceof HTMLElement ){ // a DOM node
			
			this.target = a;
			this.handlers = {};

		} else if ( a ) { // treat as selector
			//console.log( 'selector', a );
			return _se( a );
		}
	};

	window.tb.prototype = (function(){
		// private methods, static private vars
		// no need to auto-comment these

		return { // public prototype, public static vars

			addHandler: function( pName, pFunction ){

				if ( pName === undefined 
					|| pFunction === undefined
					|| typeof pName !== 'string'
					|| typeof pFunction !== 'function'){
					return;
				}

				if ( this['handlers'] === undefined ){
					this.handlers = {};
				}
				if ( this['handlers'][pName] === undefined ){
					this['handlers'][pName] = [];
				}
				
				this['handlers'][pName].push( pFunction );
				//_persist( this ); // save root object to DOM
			},

			removeHandler: function( pName, pFunction ){
				if ( pName === undefined || typeof pName !== 'string' ){
					return;
				}

				if ( this['handlers'] === undefined || this['handlers'][pName] === undefined ){
					return;
				}
				
				var a = [];

				if ( pFunction !== undefined ){
					$.each( this['handlers'][pName], function( i, v ){
						if ( v !== pFunction ){
							a.push( v );
						}
					});
				}

				if ( a.length > 0){
					this['handlers'][pName] = a;
				} else {
					this['handlers'][pName] = null;			
					delete this['handlers'][pName];			
				}
				//_persist( this ); // save root object to DOM
			},

			handle: function( evt ){
				var bubble = evt.bubble,
					name = evt.name.split(':')[1],
					data = evt.data,
					cont = true,
					that = this;
				$.each( this.handlers, function( i, v ){
					if ( i === name ){
						$.each( v, function( j, w ){
							if (cont === true) {
								cont = w.apply( that, [ evt ] ) === false ? false : true;
							}
						});
					}
				});
				return cont;
			},

			trigger: function( pName, pData ){
	
				/*
				EVENT SYNTAX:
				<selector>:<eventName>:<bubble>
				
				<selector> : '', '*', '<tl tb selector>', 'this', 'root', 'super' 
					(the latter 3 indicating local bubbling, the other top level bubbling)
				<eventName>: any string
				<bubble>: 'l', 'u', 'd' (or any combination of these) 

				AUTOMATIC EVENT EXPANSION EXAMPLES:
				'eventName'	 =>	'*:eventName:ld'
				':eventName:' => 'this:eventName:l'
				'*:eventName' => '*:eventName:ld'
				*/

				function handleEvent( evt ){
					var bubble = evt.bubble,
						cont = true,
						that = this;

					// this
					if ( typeof this === 'array' || this instanceof Array ){
						$.each( this, function( i, v ){
							handleEvent.apply( v, [ evt ] );
						});
					} 

					if ( this['handlers'] ){
						cont = this.handle.apply( this, [ evt ] ) === false ? false : true;
					}

					// bubble
					if ( cont === true ){
						if ( bubble.indexOf('l') > -1 ){ // local
							if ( bubble.indexOf('d') > -1 ){ // down
								$.each( this, function( i, v ){
									if ( /\./.test(i) && v instanceof tb ){ // this one is a subobject
										cont = handleEvent.apply( that[i], [evt] ) === false ? false : true;
									}
								});
							}
							if ( bubble.indexOf('u') > -1 ){ // up
								if ( this['_super'] !== undefined ){ // this one is a subobject
									//console.log( 'bubble up', evt.name, evt.bubble, bubble, that.name, that._super().name );
									cont = handleEvent.apply( that._super(), [evt] ) === false ? false : true;
								}
							}
						}
					}
					//_persist( this ); // save root object to DOM
					return cont;
				}

				// recover full event description
				if ( pName.indexOf(':') === -1 ){
					// simple tlo event
					pName = '*:' + pName + ':ld'; // standard = starting at every tlo object, bubble down inside tlo
				}

				var ea = pName.split(':');

				if (ea.length === 2){ // 3rd missing, guess which is which
					if ( ea[1].lenght < 4 && !/[^l|u|d]/.test( ea[1] ) ){
						// 2nd seems to be bubble parameter, so 1st should be event name
						ea = ea.unshift('this'); // event starts local, and follows bubble rules as defined
					} else { // 2nd seems to be event name, 1st assumed to be target selector
						ea.push( 'ld' ); // bubble from target local down
					}
				}

				// now that we have the real expanded event name,
				// set empty strings to standard behaviour
				if ( ea[0].length === 0 ){ // no target selected
					ea[0] = 'this';	// only this (sub-)object
				}
				if ( ea[2].length === 0 ){ // no bubble behaviour defined
					ea[2] = 'ld';	// assume local down only
				}

				// reassemble complete event name
				pName = ea.join(':');

				// event structure:
				var evt = {
						name: pName, 			// must be overwritten
						origin: this,			// target tb object origin
						target: ea[0], 			// jquery origin element
						bubble: ea[2],			// do not bubble, other options 'l', u', 'd', and any combination of it
						data: pData
					};

				if ( $.isPlainObject( pData ) ) $.extend( 
					// if pData is object also merge it into evt object
					// to allow for overloading of origin etc. 
					evt,
					pData
				); 

				var start;
				switch ( ea[0] ){
					case 'this':
						start = this;
						break;
					case 'root':
						start = this['_super'] ? this._root() : this;
						break;
					case 'super':
						start = this['_super'] ? this._super() : false;
						break;
					default: // tlo selector
						start = ea[0].indexOf('.') > -1 ? tb( tb.nameSpace( ea[0] ) ) : tb( ea[0] );
						break;
				}

				//console.log( 'TRIGGER', arguments, evt, 'ON', start );
				if ( start !== false ) setTimeout( 
					(function( start, evt ){ return function(){
						handleEvent.apply( start, [ evt ] );
					};})( start, evt ),
					0 // as instantaneous as possible
				);
			},

			is: function( s ){ // selector match
				var o = this instanceof Array ? this[0] : this;
				if (!s) return true;
				return _me( o, s );
			},

			instanceOf: function( pObj ){ 
				
				if ( this instanceof Array && this[0] && this[0] instanceof tb ){ // chained method, filter result set
					var r = [];
					$.each( this, function(i,v){
						var t = v.instanceOf( pObj );
						if ( t !== false ) {
							r.push( t );
						}
					});
					//console.log('instanceOf array result', r);
					$.extend(r, true, tb.prototype);
					return r.length === 1 ? r[0] : r;
				
				} else if ( this instanceof tb ) { // instanceof tb, normal method
					var root = this['_super'] !== undefined ? this._root() : this,
						result = false,
						names = [],
						match;

					names.push( root.name );

					function walk( pTb, pObj ){
						$.each( pTb, function( i, v ){
							if ( v instanceof tb && v['_super'] !== undefined ){ // sub object, not handle to foreign tb element
								names.push( v.name );
								if ( pObj !== undefined && match === undefined && pObj.name === v.name ){ // sub object fit
									//console.log( 'walk match', pTb[i] );
									match = pTb[i];
								}
								walk( v, pObj );
							}
						});
					}
					
					if ( pObj !== undefined ){
						if ( pObj instanceof String || typeof pObj === 'string' ) { // exact match of namespace
							var a = root.instanceOf(); // all sub objects
							return a.indexOf( pObj ) > -1 ? true : false;
						} else if ( pObj instanceof RegExp ) { // looking for regexp match in names
							var a = root.instanceOf(); // all sub objects
							$.each( a, function( i, v ){
								if ( pObj.test( v ) ) {
									result = true;
								}
							});
						} else { // assume repo object or tb instance object --> return subobject if match
							walk( root, pObj ); // recursively scan object
							//if ( match !== undefined ) console.log( 'instanceOf match', match );
							return match !== undefined ? match : false;
							//return a.indexOf( pObj.name ) > -1 ? true : false;
						}
					} else {
						walk( root ); // recursively scan object
						return names;
					}

					return result;
				}
			},

			initChildren: function(){
				if ( this['_super'] !== undefined ) return this._root().initChildren();
				if ( this['target'] ) {
					var elms = $(this.target)
									.find('[data-tb]')
									.map(function() {
										return $( this ).data('tbo') ? null : $( this );
										})
									.get();
					$.each( elms, function( i, v ){
						//console.log( 'initChildren', v );
						_init( v );
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

			inject: function( namespace, props, recurse ){

				var obj = tb.nameSpace( namespace, true ),
					props = props || this[namespace],
					that = this;

				if ( $.isEmptyObject(this[namespace]) ){
					this[namespace] = new tb( this.target );
				}

				// depending on the type of the loaded resource...
				switch( typeof obj ){

					case 'function':
						if ( obj.prototype === Function.prototype ){
							console.log( 'inject function', obj );
							obj.apply( this, [ this[namespace] ] );
						} else { // a constructor
							var c = tb.nameSpace(namespace), // constructor
								r = new c( this[namespace] );
							this[namespace] = r;
							this[namespace]['_tbo'] = this;
						}
						break;

					case 'object':
						var props = this[namespace],
							tbo = new tb( this.target );

						$.extend( // mix in repo object
							true,
							tbo,
							obj
						); 

						//console.log( 'inject '+namespace+' walk handlers' );
						// walk handlers and convert each to array of functions if necessary
						if ( tbo['handlers'] && $.isPlainObject( tbo['handlers'] ) ) {
							$.each( tbo['handlers'], function( i, v ){
								if ( $.isFunction(v) ){
									tbo['handlers'][i] = [ v ]; // convert to array to be able to add more handlers for this event
								}
							});
						}

						//console.log( 'inject walk object' );
						// walk object, recursive inject tb objects
						$.each( tbo, function( i, v ){
							if ( tbo.hasOwnProperty( i ) ){
								if ( /\./.test( i ) && i !== 'tb.require' ){ // it is a dotted (namespaced) element
									// recursive inject
									//console.log( 'recursive INJECT', i, 'INTO', tbo.name, 'PROPS', v );
									tbo.inject.apply( tbo, [ i, v, true ] );
									//console.log( 'result INJECTED', tbo );
								}
							}
						});

						//console.log( 'inject special properties' );
						// inject special properties
						$.extend( // mix in special properties
							true,
							tbo,
							{
								config: props,
								_root: function(){
									var that = this;
									while ( that['_super'] ){
										that = that._super();
									}
									return that;
								},
								_super: (function(that){ return function(){
									return that;
								};})(this)
							}
						);

						//console.log( 'inject', tbo, ' INTO ', this);
						this[namespace] = tbo;

						//console.log( 'result after [' + namespace + '] is injected:', this );
						break;

					default: 
						//console.log('no handler -> ran into default', i );
						break;
				}

				if ( recurse !== true ) this.trigger('root:tb.init:ld');
				if ( !this['_super'] ) $( this.target ).data('tbo', this);
			},

			parents: function( s ){
				var r = [];
				if ( this instanceof Array ){
					$.each( this, function( i, v ){
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
					$.each( this, function( i, v ){
						var d = v.descendants(s)
						$.extend(r, true, d instanceof tb ? [d] : d );
					});
				}
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
								//console.log( indentString + '\t<element is anchestor of origin tbo, recursion warning>');
							}
						}
					});
				}
			}

		};
	})();

	// bootstrap application when ready ==> MUST BE LAST IN TB FILE
	$( function(){
		$.extend( true, window['tb'], tb.config || {} ); 
		_init(); 
	} );

})();

/**
 * handles all requirements loading
 * @namespace tb.require
 */
tb.require = function( pA, pCb, pId ){

	var myCb = pCb || tb.nop,
		id = pId || tb.getid(),
		myA = typeof pA === 'string' || pA instanceof String ? [pA] : pA,
		lA = []; // array of files that need to be loaded

	if ( ! ( typeof myA === Array || myA instanceof Array ) ) return;

	// if called as a tb().require() method
	if ( this instanceof tb || this['trigger'] ){
		myCb = (function(that, a, myCb){ return function(){
			that.trigger({
				name: ':tb.require.done:', 
				data: a 
			});
			myCb();
		};})(this, myA, myCb );
	}

	$.each( myA, function( i, v ){
		if ( !tb.loader.test( v ) ) { // not loading or not finished loading
			lA.push( v );
		}
	});

	if ( lA.length === 0 ) { // all requirements met
		myCb();
		return;
	} else { // open requirements: add to requirements group object
		lA.cb = myCb;
		lA.id = id;
		var aLeft = $.extend( true, [], lA );
		aLeft.cb = myCb;
		aLeft.id = id;
		if ( pId === id ){ // if an id is given, add to existing requirements group
			$.each( tb.require.groups, function( i, v ){
				if ( v.id === pId ){
					while ( lA.length > 0 ){
						tb.require.groups[i].push( lA.pop() );
					}
				} 
			});
		} else { // add new requirements group
			tb.require.groups.push( lA );
		}
	}

	$.each( aLeft, function( i, v ){ // now do the loading
		tb.loader.load( v, tb.require.checkGroups, id ); 
		// id is used to extend the checkgroup on recursive loads
	});

	return id;
};


tb.require.groups = [];

tb.require.checkGroups = function(){ // check all requirement groups

	//console.log( ' check groups:', $.extend([], true, tb.require.groups) );

	function checkRg( pI, pV ){ // check requirement group
		var pV = pV || tb.nop,
			done = true,
			aLeft = [];
		
		aLeft.cb = pV.cb || tb.nop;
		aLeft.id = pV.id || null;
		
		$.each( pV, function( i, v ){
			if ( !tb.loader.test( v ) ){
				aLeft.push(v);
				done = false;
			}
		});

		if ( done === true ){ // execute callback and delete req group 
			tb.require.groups.splice( pI, 1 );
			if (pV.cb) pV.cb(); // execute callback
			return;
		} else {
			tb.require.groups[pI] = aLeft;
		};
	}

	$.each( tb.require.groups, function( i, v ){
		checkRg( i, v );
	});
}

tb.prototype.require = tb.require;

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

	if ( pCreate === true ){
		while ( a[0] ){
			var me = a.shift();
			if ( !e.hasOwnProperty(me) ){
				e[me]={};
			}
			e=e[me];
			ns = ns + '.' + me;
		}
	} else {
		while ( a[0] ){
			var me = a.shift();
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
 * @namespace tb.observable
 * @function
 * @description returns an observable type setter / getter function  
 */
tb.observable = function( pN, pV ){

	var f = function( pValue ){
		var that = this;
		if ( pValue !== undefined ){
			pV = pValue;
			if ( this instanceof tb ){
				if (!arguments.callee['tbo']) arguments.callee.tbo = function(){
					return that;
				};
			}
			f.notify();
		} 
		return pV;
	};

	f.list = [];

	f.notify = function(){
		$.each( f['list'], function( i, v ){
			if ( $.type(v) === 'string' ){
				var r = new RegExp( s );
			}
			if ( $.isFunction(v) ){
				v( pV );
			} else {
				tb( r ).trigger( ':tb.observable.notify:', { varName: pN, value: pV } );
			}
		});
	};

	f.observe = function( pO ){
		var id = pO instanceof tb ? pO.name : $.isFunction( pO ) === true ? pO : false; // id = tbo, function or false
		if ( id !== false && f.list.indexOf( id ) === -1 ){
			f.list.push( id );
		}	
	};

	return f;
}

/** @memberOf tb
 * @namespace tb.Cache
 * @class
 * @description provides a caching mechanism 
 */
tb.Model = function ( pOptions, pObject ) {
	//default
	$.extend( 
		this, 
		{
			url: '',
			method: 'GET',
			ok: true
		}
	);

	if ( !$.isPlainObject( pOptions ) || pOptions['url'] === undefined || pOptions['url'].length === 0 ){
		this.ok = false;
		this.url = 'no url given to model'
		return;
	}

	this.url = pOptions.url;

	this.tbo = (function(that){ return function(){
		return that;
	};})(pObject)

	this.data = tb.observable.apply( pObject, [ 'data', {} ] );
};

tb.Model.prototype = (function(){ 

	function _convertToHash( pString ){
		var paramObject = {},
			para,
			kv;
		
		if ( pString !== undefined ){
			para = pString.split( '&' );
			$.each( para, function( i, v ){
				kv = v.split('=');
				paramObject[ kv[0] ] = kv[1];
			});
		}

		return paramObject
	}

	return {

		'get': function( pPara ){ // if parameter given, expects either hash object or string of GET type parameters like a=...&b=... 
			// map in url
			var model = this, // the model
				tbo = model['tbo'] ? this.tbo() : false, // the twobirds object the model is attached to
				myUrl = tb.parse( $.isPlainObject( pPara ) ? pPara : _convertToHash( pPara ), this.url );

			tb.request({
				url:  myUrl,
				method: 'GET',
				cachable: true,
				success: function( pXml, pText ){
					try {
						pText = JSON.parse( pText );
					} catch (e) {} // otherwise it stays plain text result
					model.data( pText ); // set model data
					if ( tbo !== false ) tbo.trigger( ':tb.model.success:', pText );
				},
				failure: function( pXml, pText ){
					if ( tbo !== false ) tbo.trigger( ':tb.model.failure:', myUrl );
				}
			});

			//console.log( myUrl );
		}

	};

})();

/** 
 * @memberOf tb
 * @namespace tb.parse
 * @function
 * @description microparser 
 * @param pParse object, parse hash
 * @param pText, text to parse
 */
tb.parse = function( pParse, pText ){
	$.each( pParse, function(i, v){
		pText = pText.replace( (new RegExp('\{'+i+'\}', 'g')), v );
	});
	return pText;
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

		loading: tb.observable( 'tb_loading', false ),
		
		/**
		 * start or end of load trigger this function
		 * @param pInc { numeric, omitted, -1 or +1 }
		 * @param pPath { string, optional } path part of the URL
		 */
		count: function( pInc, pPath ){
			count += pInc;
			if ( count === 0 ){
				//tb('*').trigger('tb.idle');
				tb.loader.loading( false );
			} else if ( count === 1 && Math.abs( pInc ) === pInc ) {
				//tb('*').trigger('tb.loading');
				tb.loader.loading( true );
			}
		},

		/**
		 * load a resource using the specific type loader
		 * @param pPath {string, omitted} path part of the URL
		 * @param pCallback {function, optional} callback function after resource has loaded
		 * @returns
		 */
		load : function(){ // general loader switch
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
	function addScript( pPath, pUrl, pCb, pId ) {
		var head = document.getElementsByTagName('head')[0],
			script = document.createElement('script'),
			done = false;

		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', pUrl);

		if ( pId !== undefined ){
			$.each( tb.require.groups, function( i, v ){
				if ( v.id === pId && tb.require.groups[i].indexOf( pPath ) === -1 ){
					tb.require.groups[i].push( pPath );
				}
			});
		}

		function completed(){
			var ns = pPath.replace(/\//g, '.').replace(/.js$/, ''),
				ns = tb.nameSpace( ns );

			// make sure, this is called only once
			if ( done ) return;
			done = true;

			c.set( pPath, 1 );
			
			// check for further requirements:
			if ( ns && $.isPlainObject(ns) ){ 
				$.each( ns, function( i, v ){
					if ( (/\./).test(i) ){ // a 'dotted' property
						if ( i === 'tb.require' ){
							tb.require( // load requirement array into existing requirement group
								v, 
								(function(o, pCb){ return function(){
									delete o['tb.require'];
									if (pCb) {
										pCb();
									} 
									tb.require.checkGroups();
								};})( ns, pCb ),
								pId
							);
						} else { // other dotted property
							var o = tb.nameSpace( i, true ); // create empty object if nothing present
							if ( $.isPlainObject( o ) && $.isEmptyObject( o ) ){ // no content in this namespace 
								var fn = i.replace( /\./g, '/' ) + '.js';
								tb.loader.load( // load js file 
									fn, 
									(function(o, pCb){ return function(){ // load requirement array
										if (pCb) {
											pCb();
										} 
										tb.require.checkGroups();
									};})( ns, pCb ),
									pId
								); 
							}
						}
					}
				});
			}

			// now check groups
			tb.require.checkGroups();

			tb.loader.count( -1, 'JS: ' + pPath );
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
		load: function ( pPath, pCb, pId ) {
			var url,
				pCb = pCb || tb.nop;

			if ( !pPath ) return;
			url =  tb.loader.js.prefix + pPath + '?' + tb.getid();
			tb.loader.count( 1, 'JS: ' + pPath );
			c.set( pPath, 0 );  
			addScript.apply( this, [ pPath, url, pCb, pId ] );
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

			if (pText.length === 0) pText = '/* empty css file */';

			tb.loader.css.cache.set( pPath, pText );

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

			tb.loader.count( -1, 'CSS: ' + pPath );
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
 * @namespace tb.loader.html
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
			if (pCb) pCb();
			tb.loader.count( -1, 'HTML: ' + pPath );
		};
	}

	/** @lends tb.loader.html */
	return {
		/** @private */
		cache: c,

		/**
		 * @function
		 * @memberOf tb.loader.html
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

/**
 * json file loader
 * @namespace tb.loader.json
 */
tb.loader.json = (function () {
	
	/** @private */
	function cb( pPath, pUrl, pCb ) {
		//console.log('generate html callback');
		return function (pXml, pText) {
			pText = !pText ? '{ error: "empty text, expected JSON string?" }' : pText;
			tb.loader.count( -1, 'JSON: ' + pPath );
			var data = eval( '('+pText+')') || 'PARSE ERROR in JSON string: ' + pText;
			if (pCb) pCb( { data: data } );
		};
	}

	/** @lends tb.loader.tpl */
	return {
		/**
		 * @function
		 * @memberOf tb.loader.json
		 */
		load: function ( pPath, pCb ) {
			var done = false,
				url = ( tb.loader.json['prefix'] || '') + pPath,
				myCb = pCb || tb.nop; // CAUTION: see below, triggers loading via request
			
			if ( !pPath ) return;

			tb.loader.count( 1, 'JSON: ' + pPath );

			var options = {
					method: 'GET',
					url: url,
					success: cb( pPath, url, pCb )
				};

			c.set( pPath, 0 );

			tb.request( options );

			return pPath;
		}
	};
})();

