demoapp.infoWindow = {

	name: 'demoapp.infoWindow',

	'demoapp.sys.window': {
        height: '300px',
		canClose: true,
		title: 'Information Window',
		status: 'ok'           
    },

    'tb.require': [
		'demoapp/infoWindow.html'
	],

	handlers: {
		'tb.init': function infoWindow_tb_init(ev){
			if (this.ready) return;
			this.ready = true;
		},

		'scroll.ready': function infoWindow_scroll_ready(ev){
			$(this.target).find('.__scroll-content').html( tb.loader.get('demoapp/infoWindow.html') );
			this.trigger('root:scroll.update:ld');
		}
	}

};