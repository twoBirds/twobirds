tb.nameSpace('demoapp.sys').windowController = {

	name: 'demoapp.windowController',

    'tb.require': [ // window is predictive load
    	'tb/ui/scroll.js',
    	'demoapp/sys/windowController.css',
		'demoapp/sys/window.js',
		'demoapp/sys/window.html',
		'demoapp/sys/window.css'
	],

	'tb.events': [ // what events do i listen to ?
		{	name: 'tb.require:done',
			handler: function(ev){
				if ( this.ready ) return;
				//console.log('controller init');
				this.ready = true;
				
				this['tb.ui.scroll'] = {
					direction: 'y',
			        bubbleUp: false,
			        pixelsPerSecond: 2000,
			        attachDelay: 0,
			        easing: 'swing'
    			};
    			this.inject( 'tb.ui.scroll' );
			}
		},

		{	name: /scroll:ready/,
			handler: function(ev){
				//console.log('controller /scroll:ready/', this);
				// add test window(s)
				//this.trigger('addWindow', 'demoapp/infoWindow.js');
				this.trigger('scroll:update');
				return false;
			}
		},

		{	name: 'addWindow',
            handler: function(ev){
				//console.log('controller /addWindow/', this);
				$( this.target ).find('.__scroll-content:first').prepend( '<div data-tb="' + ev.data + '"></div>' );
				this.initChildren();
				this.trigger('scroll:update');
				this.trigger('scroll:scrollTo', 0);
			}
		}

	]

};
