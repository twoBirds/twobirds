tb.nameSpace( 'demoapp.sys', true ).windowController = {

	name: 'demoapp.windowController',

    'tb.require': [
    	'demoapp/sys/windowController.css'
	],

	'tb.ui.scroll': {
		direction: 'y',
	    bubbleUp: false,
	    pixelsPerSecond: 2000,
	    attachDelay: 0,
	    easing: 'swing'
	},

	handlers: { 
		'tb.init': [
			function windowController_tb_init(ev){
				if ( this.ready === true ) return;
				console.log('windowController_tb_init', this);
				this.ready = true;
			}
		],

		'scroll.ready': [
			function windowController_scroll_ready(ev){
				//console.log('windowController_scroll_ready');
				this.trigger('this:scroll.update:ld');
				return false;
			}
		],

		'addWindow': [
			function windowController_addWindow(ev){
				//console.log('windowController_addWindow');
				$( this.target ).find('.__scroll-content:first').prepend( '<div data-tb="' + ev.data + '"></div>' );
				this.initChildren();
				this.trigger('this:scroll.update:ld');
				this.trigger('this:scroll.scrollTo:ld', 0);
				return false;
			}
		]

	}

};
