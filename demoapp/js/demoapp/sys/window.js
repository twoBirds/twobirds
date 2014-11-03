tb.nameSpace('demoapp.sys').window = {

	name: 'demoapp.sys.window',

	active: false, // indicates this is the active window 

	'tb.require': [
		'demoapp/sys/window.html',
		'demoapp/sys/window.css'
	],

	handlers: {
		'tb.init': function sys_window_tb_init(ev){
			if ( this.ready ) return;
			this.ready = true;
			
			// mix configuration
			this.config = $.extend( 
				true, 
				{
					title: '<title placeholder>',
					canClose: false,
					status: '<status placeholder>',
					scrollBar: true
				}, 
				this.config 
			);
			this.canClose = this.config.canClose;

			$( this.target )
				.html( tb.loader.get('demoapp/sys/window.html') )
				.on( 'click', (function(that){ return function(){
					//console.log('onClick trigger window:active', true);
					that.trigger(':window.active:', true);
				};})(this) );

			this.content = $( this.target ).find('> div > div:nth-child(2)'),
			this.title = $( this.target ).find('> div > div:nth-child(1)'),
			this.status = $( this.target ).find('> div > div:nth-child(3)');
			
			if ( this.config['height'] !== undefined ) this.content.css('height', this.config.height );
			this.title.text( this.config.title || '&nbsp;' );
			this.status.text( this.config.status || '&nbsp;' );

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

			this.trigger(':window.active:', true);
			this.trigger(':window.ready:lu');
			tb(/windowController/).trigger('scroll.update');
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
			var win = $( this.target ).find('.demoapp-window');
			if ( this.active === true ){
				win.addClass('_demoapp-window-active');
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
