demoapp.window = {

	name: 'demoapp.window',

	active: false, // indicates this is the active window 

	'tb.require': [
		'demoapp/window.html',
		'demoapp/window.css'
	],

	'tb.events': [ // what events do i listen to ?
		{	name: 'tb.require:done',
			handler: function(ev){
				if ( this.ready ) return;
				this.ready = true;
				
				//console.log('window init', ev);

				// mix configuration
				this.config = $.extend( 
					true, 
					{
						title: '<title placeholder>',
						height: '200px',
						canClose: false,
						status: '<status placeholder>'
					}, 
					this.config 
				);
				this.canClose = this.config.canClose;

				$( this.target )
					.html( tb.loader.get('demoapp/window.html') )
					.on( 'click', (function(that){ return function(){
						//console.log('onClick trigger window:active', true);
						that.trigger('window:active', true);
					};})(this) );

				console.log( this.target );
				var content = $( this.target ).find('> div > div:nth-child(2)'),
					title = $( this.target ).find('> div > div:nth-child(1)'),
					status = $( this.target ).find('> div > div:nth-child(3)');
				console.log( content[0] );
				
				content.css('height', this.config.height );
				title.text( this.config.title || '&nbsp;' );
				status.text( this.config.status || '&nbsp;' );

				this['tb.ui.scroll'] = {
					content: content[0],
					direction: 'y',
			        bubbleUp: true,
			        pixelsPerSecond: 2000,
			        attachDelay: 2000,
			        easing: 'swing'
    			};
    			this.inject( 'tb.ui.scroll' );

				this.trigger('window:active', true)
			}
		},

		{	name: 'window:close',
			handler: function(ev){
				if ( this.canClose || ev.data === true ){
					var next = $( this.target ).next();
					if ( next[0] ) next.data('tbo').trigger('window:active', true);
					$( this.target ).detach();
					tb(/windowController/).trigger('scroll:update');
					return;
				}
				this.descendants().trigger({ name: 'window:closeRequested' });
				this.canClose = true;
				setTimeout( (function(that){ return function(){
					if ( that.canClose ){
						that.trigger('window:close', true);
					}
				};})(this), 300)
			}
		},

		{	name: 'window:active',
			handler: function(ev){
				//console.log('window:active', ev.data, this );
				if ( this.active === ev.data ) return;
				this.active = ev.data;
				var win = $( this.target ).find('.demoapp-window');
				if ( this.active ){
					win.addClass('_demoapp-window-active');
	                var windows = tb(/./).instanceOf( demoapp.window ),
	                	checkname = this._root().name;
					if (windows instanceof Array) $.each( windows, function( i, v ){
		                if( v.name !== checkname ){
				            v.trigger('window:active', false);
		                }
	                });
				} else {
					win.removeClass('_demoapp-window-active');
				}
			}
		},

		{	name: 'window:denyclose',
			handler: function(ev){
				console.log('window deny close', ev.data);
				that.canClose = false;
			}
		}

	]

};
