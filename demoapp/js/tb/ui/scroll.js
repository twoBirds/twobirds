tb.nameSpace('tb.ui', true).scroll = {

	name: 'tb.ui.scroll',

	'tb.require': [
		'jqPlugins/cssPx.js',
		'jqPlugins/mouseWheel.js',
		'tb/ui/scroll.css'
	],

	handlers: {

		// requirement loading done - start init
		'tb.init': function scroll_tb_init(ev){
			if (this.ready) return;
			this.ready = true;
			// console.log('scroll req loaded');
			this.init.apply( this );
		},

		// toggle scroll active class ( & freeze surrounding scroll )
		'scroll.active': function scroll_active(ev) {
			//console.log('HANDLER FUNCTION scrollActive', ev.data, this);
			if (ev.data) {
				// disable all other scrolls
				var scrolls = tb(/tb.ui.scroll/);
				$.each( scrolls, function( i, v ){
					if ( v.id !== this.id ){
						v.trigger('this:scroll.active:ld', false)
					}
				});
				// now activate this one
				this.scrollRoot.addClass('_tb-ui-scroll-active');
				this.parents(/tb.ui.scroll/).trigger('this:scroll.active:ld', false);
				this.scrollRoot.css('overflow-'+this.config.direction, 'scroll');
				this.active = true;
			} else {
				this.scrollRoot.css('overflow', 'hidden');
				this.scrollRoot.removeClass('_tb-ui-scroll-active');
				this.active = false;
			}
		},

		// freeze scroll
		'scroll.freeze': function scroll_freeze(ev) {
			//console.log('HANDLER FUNCTION scrollEnable', pBool);
			var self = this.scrollRoot,
				root = this.root,
				scrollBar = this.scrollBar,
				dir = this.direction;

			this.isScrollFrozen = ev.data;
			self[0].style['overflow-' + dir] = ( ev.data ? 'hidden' : 'scroll' );
			
			if (!ev.data) { // unfreeze directly ...
				self.removeClass('_tb-ui-scroll-frozen');
			} else { // hide scrollbar
				self.addClass('_tb-ui-scroll-frozen');
			}

			this.trigger(':scroll.update:');
					
		},

		// enable scroll
		'scroll.enable': function scroll_enable(ev) {
			//console.log('HANDLER FUNCTION scrollEnable', pBool);
			this.isScrollEnabled = ev.data;
			//console.log('enable', pBool, self);
			this.trigger(':scroll.update:');
			this.parent().trigger(':scroll.enable:', !ev.data); // disable/enable parent scroll ***
		},

		// toggle scrollon class ( blink effect when moved )
		'scroll.scrolling': function scroll_scrolling(ev){
			//console.log('HANDLER FUNCTION scrollScrolling:', ev );
			if (ev.data) {
				this.scrollRoot.addClass('_tb-ui-scroll-scrolling');
			} else {
				this.scrollRoot.removeClass('_tb-ui-scroll-scrolling');
			}
		},

		// create scroll DOM structure
		'scroll.init': function scroll_init(ev){
			//console.log( 'SCROLL INIT', this );
			// make dom substructure
			//console.log(this, ev);
			
			// rewrap inner elements with scrolling container divs
			/*
			 div = this.target
			 -div = scrollParent
			 --div = scrollContainer
			 ---$self ...
			 -div = scroll bar
			 --div = scroll handle
			 */
			var that = this;

			if ( this.config.content ) {
				this.target = $(this.config.content)[0] || this.target;
			}
			$( this.target ).html('<div class="__scroll-content"></div>');
			
			// wrap content
			$( this.target )
				.css({ 'overflow': 'hidden' })
				.children(':first') // assume div inside scroll root !!!
				.addClass( '__scroll-content')
				.wrap('<div><div></div></div>')        //wrap containers
				.parent() // container
				.parent() // parent
				.parent() // root
				.append('<div><div></div></div>');     // add scrollbar

			this.root = $(this.target);
			this.scrollRoot = this.root.children(':first');
			this.scrollContainer = this.scrollRoot.children(':first');
			this.scrollContent = this.scrollContainer.children(':first');
			this.scrollBar = this.root.children(':last');
			this.scrollHandle = this.scrollBar.children(':first');

			this.isScrollEnabled = true;
			this.isScrollFrozen = false;
			this.mousedown = false;
			this.dragmode = false;
			
			// inject content position into super object
			this._super().content = this.scrollContent;

			this.scrollRoot.addClass( '_tb-ui-scroll-' + this.config.direction );

			// this indicates the scroll is moving or has been activated
			this.scrollOn = function () {
				that.trigger(':scroll.scrolling:', true);

				clearTimeout(this.scrollingClassTimeout);

				this.scrollingClassTimeout = setTimeout(
					(function (that) {
						return function () {
							that.trigger(':scroll.scrolling:', false);
						};
					})(this),
					500
					);
			};
			
			/*
			ATTACH NATIVE HANDLERS
			*/

			// attach scroll handler
			this.scrollRoot.on('scroll', function (ev) {
				// stop if not active and not a touch device, of scroll is frozen
				if ( ( !that.isTouchDevice && !that.active ) || that.isScrollFrozen === true ){
					//console.log( 'scroll td, a, f', that.isTouchDevice, that.active, that.isScrollFrozen );
					ev.stopImmediatePropagation();
					ev.stopPropagation();
					ev.preventDefault();
					ev.originalEvent.stopImmediatePropagation();
					ev.originalEvent.stopPropagation();
					ev.originalEvent.preventDefault();
					return false;
				}

				//console.log('scroll', that);
				that.scrollOn();
				that.trigger(':scroll.update:');

				if (!$._data( that.scrollRoot[0], "events").mousewheel ) {
					// if no wheel handler attached here & not about to -> its a touch event
					//console.log('touch event SCROLL');
					that.scrollRoot.trigger(':scroll.active:', true);
				}

				ev.stopPropagation();

			});

			// attach mouseenter / mouseleave handler
			this.root.hover(
				function (ev) {
					//console.log('HANDLER FUNCTION mouseenter', this, that);
					//console.log( 'mouseenter events', $._data( that.scrollRoot[0], 'events') );

					if (that.mousedown === true) {
						ev.stopPropagation();
						ev.preventDefault();
						return false;
					}
					that.trigger(':scroll.wheelHandlerTimeout:');
					//ev.stopImmediatePropagation();
				},
				function (ev) {
					//console.log('HANDLER FUNCTION mouseleave', this, that);

					if (that.mousedown === true || that.scrollBar.is(':hover')) {
						ev.stopPropagation();
						ev.preventDefault();
						return false;
					}

					// kill timeout, just to be sure
					window.clearTimeout(this.attachWheelHandlerTimeout);
					that.attachWheelHandlerTimeout = null;

					that.trigger(':scroll.detachWheelHandler:');
					that.trigger(':scroll.active:', false);

				}
			);

			this.scrollContainer.on(
				'click',
				function(ev){
					//console.log('scrollContainer click', that );
					//that.trigger(':scroll.active:', true);
					that.trigger(':scroll.attachWheelHandler:');
					//ev.stopPropagation();
				}
			);

			this.scrollHandle.on( 
				'click', 
				function (ev) {
					//console.log('scrollHandle click', ev);
					ev.stopImmediatePropagation(); // TBD: strange behaviour otherwise 
					ev.stopPropagation();
					ev.preventDefault();
				}
			);

			this.scrollHandle.on(
				'mousedown', 
				function (ev) {
					//console.log('scrollHandle mousedown', ev, ev['client' + (that.direction === 'x' ? 'X' : 'Y')]);
					if ( that.dragmode ) return;
					that.dragmode = true;
					that.dragstart = ev['client' + (that.direction === 'x' ? 'X' : 'Y')];
					that.dragstarthandle = parseInt( that.scrollHandle.position()[ that.direction === 'x' ? 'left' : 'top'] );
					that.scrollOn();
					//console.log('scrollHandle dragstart', parseInt( that.scrollHandle.position()[ that.direction === 'x' ? 'left' : 'top'] ) ) ;

					$('body').on( 'mousemove', (function(that){ return function (ev) {
						//console.log('body mousemove', ev, ev['client' + (that.direction === 'x' ? 'X' : 'Y')]);
						if ( that.dragmode ){
							//console.log('scrollBar mousemove in dragmode', ev);
							that.setNewOffset.apply( that, [ ev['client' + (that.direction === 'x' ? 'X' : 'Y')] - that.dragstart ] );
						}
					};})(that));

					$('body').on( 'mouseup', (function(that){ return function (ev) {
						//console.log('body mouseup', ev, that);
						that.dragmode = false;
						$('body').off( 'mousemove' );
						$('body').off( 'mouseup' );
					};})(that));

					ev.stopPropagation();
					ev.preventDefault();
				}
			);

			this.scrollBar.on(
				'click',
				function (ev) {
					//console.log('scrollBar click', ev);
					if (that.isScrollFrozen) return;
					if (ev.target.innerHTML) { // click on scrollBar but outside handle
						that.setNewPosition.apply( that, [ ev.originalEvent['layer' + (that.direction === 'x' ? 'X' : 'Y')] ] );
					}
					ev.stopPropagation();
				}
			);

			this.scrollOn();

			if( this.root.is(':hover') ) {
				this.trigger(':scroll.wheelHandlerTimeout:');
			} else {
				this.trigger(':scroll.active:', false);
			}

			this.trigger(':scroll.update:');
			this.trigger(':scroll.ready:lu');
		},
		
		// attach scroll ready handler
		'scroll.ready': function scroll_scrollReady(ev) {
			this.ready = true;
		},

		// attach scrollTo handler
		'scroll.scrollTo': function scroll_scrollTo(ev) {
			//console.log('HANDLER FUNCTION scrollTo', ev.data, this);
			if (this.isScrollFrozen) return;
			this.scrollRoot.trigger(':scroll.stopAnimation:');
			var dir = this.direction,
				myProps = {},
				elm = this.scrollRoot,
				which = 'scroll' + (dir === 'x' ? 'Left' : 'Top'),
				op = elm[0][which],
				dist = ev.data - op,
				duration = Math.abs(dist) / this.pixelsPerSecond * 1000;

			this.scrollOn();
			elm[0][which] = ev.data;
		},

		// stop animation handler
		'scroll.stopAnimation': function scroll_stopAnimation(ev) {
			//console.log('HANDLER FUNCTION scrollStopAnimation');
			this.root.stop();
		},

		// update scrollbar size and position
		'scroll.update': function scroll_update(ev) {
			//console.log('SCROLL UPDATE', this);
			var dir = this.config.direction,
				root = this.root,
				self = this.scrollRoot,
				container = this.scrollContainer,
				content = this.scrollContent,
				scrollBar = this.scrollBar,
				scrollHandle = this.scrollHandle,
				parentSize = root ? root['inner' + (dir === 'x' ? 'Width' : 'Height')]() : false,
				scrollPos,
				scrollBarSize = parentSize ? parentSize
					- scrollBar.cssPx('margin-' + (dir === 'x' ? 'left' : 'top'))
					- scrollBar.cssPx('margin-' + (dir === 'x' ? 'right' : 'bottom'))
					- scrollBar.cssPx('border' + (dir === 'x' ? 'Left' : 'Top') + 'Width')
					- scrollBar.cssPx('border' + (dir === 'x' ? 'Right' : 'Bottom') + 'Width')
				: false;

			if ( !scrollBar ) return; // TBD hotfix

			// do not remove: if last element was deleted from DOM...
			// ...native scrollPos is not updated correctly, but will be after setting it
			scrollBar.css((dir === 'x' ? 'left' : 'top'), 0);
			var scrollProp = 'scroll' + (dir === 'x' ? 'Left' : 'Top');
			root[0][scrollProp] = root[0][scrollProp]; // ABSOLUTELY REQUIRED !!!
			scrollPos = self[0][scrollProp];
			var containerSize = content['outer' + (dir === 'x' ? 'Width' : 'Height')](); // do not move this line 
					
			// set scrollbar position and size
			//scrollBar.css((dir === 'x' ? 'left' : 'top'), scrollPos);
			scrollBar.css((dir === 'x' ? 'width' : 'height'), scrollBarSize);

			//console.log('update => ', parentSize, containerSize);

			if ( !this.isScrollEnabled===true // scroll disabled
				|| parentSize + 1 > containerSize) { // disable immediately
				// //console.log( 'hide scrollbar' );
				//console.log('=> no scroll bar needed.', parentSize, containerSize );
				this.scrollRoot.removeClass('_tb-ui-scroll-on');
				return;
			}

			var sbInnerSize = scrollBarSize - 2,
				handleSize = sbInnerSize * ( parentSize / containerSize ),
				handleRange = sbInnerSize - handleSize,
				nativeRange = containerSize - parentSize,
				nativePosFactor = scrollPos === 0 ? 0 : scrollPos / nativeRange, 
				handlePos = handleRange * nativePosFactor,
				handleEndMargin = Math.max( sbInnerSize - handlePos - handleSize, 0 );

			// set scrollHandle position and size
			scrollHandle.css((dir === 'x' ? 'left' : 'top'), handlePos);
			scrollHandle.css((dir === 'x' ? 'right' : 'bottom'), Math.max(handleEndMargin, 0) );

			// finalize
			this.scrollRoot.addClass('_tb-ui-scroll-on');
			//tb.nop(this.scrollRoot[0].offsetHeight);
		},

		// attach wheel handler timeout
		'scroll.wheelHandlerTimeout': function scroll_wheelHandlerTimeout(ev) {
			//console.log( 'HANDLER scroll:wheelHandlerTimeout', this);
			if (!this.attachWheelHandlerTimeout && !$._data( this.scrollRoot[0], "events")['mousewheel']) { // attach only once
				this.attachWheelHandlerTimeout = window.setTimeout(
					(function (that) {
						return function () {
							that.attachWheelHandlerTimeout = null;
							that.trigger(':scroll.attachWheelHandler:');
						};
					})( this ),
					// if parent scroll -> delay
					this.config['attachDelay'] || 0
				);
			}
		},

		// attach wheel handler
		'scroll.attachWheelHandler': function scroll_attachWheelHandler(ev) {
			//console.debug('HANDLER FUNCTION attachWheelHandler', this);
			var root = this.root,
				self = this.scrollRoot,
				content = this.scrollContent,
				events = $._data( this.scrollRoot[0], 'events');
			
			// kill timeout, just to be sure
			window.clearTimeout(this.attachWheelHandlerTimeout);
			this.attachWheelHandlerTimeout = null;
			
			//console.log( this.scrollRoot, events );
			if ( ( events && events['mousewheel'] ) // already attached
				|| this.scrollRoot.hasClass('_tb-ui-scroll-on') === false // ... or scroll is off: return
				/* || $( this.root ).is(':hover') */ ) return; // ... or ponter left area
			
			// activate scroll
			this
				.trigger(':scroll.active:', true);

			//console.log('attach');
			// attach native handler
			this.root
				.off('mousewheel')
				.on('mousewheel', (function(that){ return function (ev, delta) {
					// we need to preserve 'this' as 'that'
					// console.log('NATIVE HANDLER mousewheel', ev, delta );
					var dir = that.direction,
						elm = that.scrollRoot,
						which = 'scroll' + (dir === 'x' ? 'Left' : 'Top'),
						op = elm[0][which],
						move = (52 * ev.deltaY * -1),
						np = op + move;

					if (that.isScrollFrozen) {
						ev.preventDefault();
						ev.originalEvent.preventDefault();
						return;
					}                                        
					
					that.trigger(':scroll.update:');
					that.scrollOn();

					elm[0][which] = np;

					// bubble wheel event up the dom, so outer container scrolls 
					// when inner position reaches bounds
					if ( that.config.bubbleUp === true && op === elm[0][which] ) {
						if ($( that.root ).parents(/tb.ui.scroll/) ) {
							$( that.root ).parents(/tb.ui.scroll/).trigger(ev, delta);
						} 
					}

					ev.stopPropagation();
					ev.preventDefault();
				};})(this) );
		
		},

		// detach wheel handler
		'scroll.detachWheelHandler': function scroll_detachWheelHandler(ev) {
			//console.debug('HANDLER FUNCTION detachWheelHandler', this);
			this.trigger(':scroll.active:', false);

			// kill timeout, just to be sure
			window.clearTimeout(this.attachWheelHandlerTimeout);
			this.attachWheelHandlerTimeout = null;

			//console.log( 'dwh events', $._data( this.scrollRoot[0], 'events') );
			this.root.off('mousewheel');
		},

		// destroy scroll
		'destroy': function scroll_destroy(ev) {
			this.root
				.off('mouseenter')
				.off('mouseleave')
				.off('mousewheel');
			$( this.target ).html( this.scrollContent.detach() );
		}
	
	},

	init: function(){
		this.trigger(':scroll.init:', $.extend(
			true,
			{ // default
				direction: 'y',
				bubbleUp: false,
				pixelsPerSecond: 2000,
				attachDelay: 0,
				easing: 'swing'
			},
			this.config || {}
		));
	},

	setNewPosition: function(pPos) {
		// pPos = click offset inside scrollbar
		var dir = this.direction,
			p = pPos - (this.scrollHandle['outer'+( dir === 'x' ? 'Width' : 'Height' ) ]() / 2), 
			p = ( p > 0 ? p : 0.0001 ), // zero if negative
			maxScroll = this.scrollContainer[0]['scroll' + (dir === 'x' ? 'Width' : 'Height')],
			maxScrollBar = this.scrollBar['inner' + (dir === 'x' ? 'Width' : 'Height')](),
			scrollClickFactor = p / maxScrollBar,
			newOffset = maxScroll * scrollClickFactor;
		//console.log('setNewOffset', p, dir, maxScroll, maxScrollBar, scrollClickFactor, newOffset);            
		this.trigger(':scroll.scrollTo:', newOffset);
	},

	setNewOffset: function(pPixelDifference) {
		// pPixelDifference = movement of scrollbar
		var dir = this.direction,
			maxScroll = this.scrollContainer[0]['scroll' + (dir === 'x' ? 'Width' : 'Height')],
				// + this.scrollHandle['outer' + (dir === 'x' ? 'Width' : 'Height')](),
			maxScrollBar = this.scrollBar['inner' + (dir === 'x' ? 'Width' : 'Height')](),
			scrollFactor = maxScroll / maxScrollBar,
			newOffset = (this.dragstarthandle + pPixelDifference) * scrollFactor;
		this.trigger(':scroll.scrollTo:', newOffset);
	},

	isTouchDevice: (function() { // run only once
		return 'ontouchstart' in window // works on most browsers 
		  || 'onmsgesturechange' in window; // works on ie10
	})()

}

// attach window resize handler
$(window).on('resize', function () {
	tb(/tb.ui.scroll/).trigger(':scroll.update:ld');
});

