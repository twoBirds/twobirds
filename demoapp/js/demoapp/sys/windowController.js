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
		'tb.init': function windowController_tb_init(ev){
			if ( this.ready === true ) return;
			this.ready = true;
		},

		'scroll.ready': function windowController_scroll_ready(ev){
			this.trigger('this:scroll.scollTo:ld', 0);
			return false;
		},

		'addWindow': function windowController_addWindow(ev){
			$( this.target ).find('.__scroll-content:first').prepend( '<div data-tb="' + ev.data + '"></div>' );
			this.initChildren();
			this.trigger('this:scroll.scrollTo:ld', 0);
			return false;
		},

		'closeAllWindows': function windowController_addWindow(ev){
			this.children().trigger(':window.close:ld');
			return false;
		}

	}

};
