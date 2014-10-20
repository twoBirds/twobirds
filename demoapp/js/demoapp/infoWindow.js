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

	'tb.events': [ // what events do i listen to ?
		{	name: 'tb.require:done',
			handler: function(ev){
				if (this.ready) return;
				this.ready = true;
			}
		},

		{	name: 'scroll:ready',
			handler: function(ev){
				$(this.target).find('.__scroll-content').html( tb.loader.get('demoapp/infoWindow.html') );
				tb(/windowController/).trigger('scroll:update')
				this.trigger('scroll:update');
			}
		}

	]

};