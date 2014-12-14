tb.nameSpace('demoapp.sys').window = {

	name: 'demoapp.sys.window',

	active: false, // indicates this is the active window 

	'tb.require': [
		'tb/ui/simpleTooltip.css',
		'demoapp/sys/window.html',
		'demoapp/sys/window.css'
	],

	handlers: {
		'tb.init': function sys_window_tb_init(ev){
			var that = this;

			if ( this.ready ) return;
			this.ready = true;
			
			// mix configuration
			this.config = $.extend( 
				true, 
				{
					title: '-',
					canClose: true,
					canMove: true,
					canCollapse: true,
					status: '-',
					scrollBar: true
				}, 
				this.config 
			);
			this.canClose = this.config.canClose;

			$( this.target )
				.html( tb.loader.get('demoapp/sys/window.html') );

			this.win = $( this.target ).find('> div');
			this.title = $( this.target ).find('> div > div:nth-child(1) > div.title'),
			this.content = $( this.target ).find('> div > div:nth-child(2)'),
			this.status = $( this.target ).find('> div > div:nth-child(3)');
			
			if ( this.config.canClose === false ){
				$( this.target )
					.find('> div > div:nth-child(1) span i.close-icon')
					.hide();
			}

			if ( this.config.canCollapse === false ){
				$( this.target )
					.find('> div > div:nth-child(1) span i.contract-icon')
					.hide();
			}

			if ( this.config.canMove === false ){
				$( this.target )
					.find('> div > div:nth-child(1) span i[class*=" move"]')
					.hide();
			}

			if ( this.config['height'] !== undefined ) this.content.css('height', this.config.height );
			this.title.html( this.config.title );
			this.status.html( this.config.status );

			// if scrollBar attach it
			if ( this.config.scrollBar === true ) {
				// SPECIAL CASE: 
				// no requirement loading necessary, 
				// since parent() already has a scroll!
				this['tb.ui.scroll'] = {
					content: this.content[0],
					direction: 'y',
			        bubbleUp: true,
			        pixelsPerSecond: 2000,
			        attachDelay: 2000,
			        easing: 'swing'
    			};

    			this.inject( 'tb.ui.scroll' );

    			this['tb.ui.scroll'].addHandler(
    				'scroll.active', 
    				function(){
    					this._super().trigger(':window.active:', true); // make window active when scroll becomes active
    				}
    			);

				this.content = $(this.target).find('.__scroll-content');
			}

			// behaviour
			$( this.target )
				.on( 'click', function(){
					that.trigger(':window.active:', true);
					});
				
			this.title
				.parent()
				.on( 'mouseover', function(){
					that.trigger(':window.active:', true);
					});

			this.status
				.on( 'mouseover', function(){
					that.trigger(':window.active:', true);
					});

			$( this.target ).find('> div > div:nth-child(1) > span > i.close-icon').on(
				'click',
				function(ev){
					that.parent().trigger(':updateBehaviour:ld'); // must come first, otherwise reference is gone
					that.trigger(':window.close:');
				}
			);

			$( this.target ).find('> div > div:nth-child(1) > span > i.contract-icon').on(
				'click',
				function(ev){
					$( that.target )
						.find('> div > div:nth-child(1) > span > i.contract-icon')
						.hide();
					$( that.target )
						.find('> div > div:nth-child(1) > span > i.expand-icon')
						.show();
					$( that.target ).find('> div > div:nth-child(2)').hide();
				}
			);

			$( this.target ).find('> div > div:nth-child(1) > span > i.expand-icon').on(
				'click',
				function(ev){
					$( that.target )
						.find('> div > div:nth-child(1) > span > i.expand-icon')
						.hide();
					$( that.target )
						.find('> div > div:nth-child(1) > span > i.contract-icon')
						.show();
					$( that.target ).find('> div > div:nth-child(2)').show();
				}
			);

			$( this.target ).find('> div > div:nth-child(1) > span > i.movetop-icon').on(
				'click',
				function(ev){
					var windowController = tb( demoapp.windowController ),
						thisWindow = $( that._root().target ),
						firstWindow = windowController.children(/demoapp.sys.window/)[0],
						previousWindow = thisWindow.prev();

					$( previousWindow[0] ).data('tbo').trigger(':window.active:ld', true );

					$( firstWindow.target )
						.parent()
						.prepend( thisWindow.detach() );

				}
			);

			$( this.target ).find('> div > div:nth-child(1) > span > i.moveup-icon').on(
				'click',
				function(ev){
					var thisWindow = $( that._root().target ),
						previousWindow = thisWindow.prev();

					$( previousWindow[0] ).data('tbo').trigger(':window.active:ld', true );

					thisWindow
						.detach()
						.insertBefore( previousWindow );
				}
			);

			$( this.target ).find('> div > div:nth-child(1) > span > i.movedown-icon').on(
				'click',
				function(ev){
					var thisWindow = $( that._root().target ),
						nextWindow = thisWindow.next();

					$( nextWindow[0] ).data('tbo').trigger(':window.active:ld', true );

					thisWindow
						.detach()
						.insertAfter( nextWindow );
				}
			);

			$( this.target ).find('> div > div:nth-child(1) > span > i.movebottom-icon').on(
				'click',
				function(ev){
					var thisWindow = $( that._root().target ),
						nextWindow = thisWindow.next();
					
					$( nextWindow[0] ).data('tbo').trigger(':window.active:ld', true);

					thisWindow
						.parent()
						.append( thisWindow.detach() );
				}
			);

			this.trigger(':window.active:', true);
			this.trigger(':window.ready:lu');
			this.trigger(':scroll.update:d');
			tb(/demoapp.windowController/).trigger('scroll.update');
			tb(/demoapp.windowController/).trigger(':updateBehaviour:ld');
		},


		'window.updateBehaviour': function sys_window_update_behaviour(ev){
			var previousWindow = $(  this._root().target ).prev(),
				nextWindow = $(  this._root().target ).next();
			
			if ( previousWindow[0] === undefined ){ // this is the topmost window
				this.win.addClass( '_demoapp-window-topwindow' );
			}  else {
				this.win.removeClass( '_demoapp-window-topwindow' );
			}
			if ( nextWindow[0] === undefined ){ // this is the topmost window
				this.win.addClass( '_demoapp-window-bottomwindow' );
			}  else {
				this.win.removeClass( '_demoapp-window-bottomwindow' );
			} 
		},

		'window.setStatus': function sys_window_set_status(ev){
			this.status.html( ev.data );
		},

		'window.setTitle': function sys_window_set_title(ev){
			this.title.html( ev.data );
		},

		'window.close': function sys_window_close(ev){
			if ( this.canClose || ev.data === true ){
				var next = $( this.target ).next();
				if ( next[0] ) next.data('tbo').trigger(':window.active:ld', true);
				$( this.target ).detach();
				tb(/windowController/).trigger(':scroll.update:ld');
				return;
			}
			this.descendants().trigger({ name: ':window.closeRequested:' });
			this.canClose = true;
			setTimeout( (function(that){ return function(){
				if ( that.canClose ){
					that.trigger(':window.close:', true);
				}
			};})(this), 300)
		},

		'window.active': function sys_window_active(ev){
			if ( this.active === ev.data ) return;
			this.active = ev.data;
			var win = $( this.target ).find('._demoapp-window');
			if ( this.active === true ){
				win.addClass('_demoapp-window-active');
	            this.trigger(':window.updateBehaviour:l');
                var windows = tb(/demoapp.sys.window/),
                	checkname = this._root().name;
				if (windows instanceof Array) $.each( windows, function( i, v ){
	                if( v.name !== checkname ){
			            v.trigger(':window.active:ld', false);
	                }
                });
			} else {
				win.removeClass('_demoapp-window-active');
			}
			return false;
		},

		'window.denyclose': function sys_window_denyclose(ev){
			console.log('window deny close', ev.data);
			that.canClose = false;
		}

	}

};
