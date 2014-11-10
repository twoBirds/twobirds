demoapp.imageWindow = {

	name: 'demoapp.imageWindow',

	'demoapp.sys.window': {
        canClose: false,
        canMove: false,
        canCollapse: false,
		title: 'Frank Th&uuml;rigen',
		status: '<a href="tel:+41555342907">tel: +41 (55) 53 42 907</a>',
		scrollBar: false      
    },

	handlers: {
		'window.ready': function imageWindow_window_ready(ev){
			this['demoapp.sys.window'].content.html( '<image src="props/FrankThürigen.jpg" style="width:100%;margin-bottom:-3px;" />' );
		}
	}

};