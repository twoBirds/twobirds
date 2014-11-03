demoapp.adaptiveWindow = {

	name: 'demoapp.adaptiveWindow',

	'demoapp.sys.window': {
        canClose: true,
		title: 'Adaptive Window',
		status: 'ok',
		scrollBar: false      
    },

    'tb.require': [
		'demoapp/adaptiveWindow.html'
	],

	handlers: {
		'tb.init': function adaptiveWindow_tb_init(ev){
		},

		'window.ready': function infoWindow_window_ready(ev){
			this['demoapp.sys.window'].content.html( tb.loader.get('demoapp/adaptiveWindow.html') );
			this.trigger('root:scroll.update:ld');
		}
	}

};