demoapp.globalSpinner = {

	name: 'demoapp.globalSpinner',

	'tb.ui.spinner': {},

	handlers: [

		{	name: 'tb:loading', // any type of request ongoing
			handler: function(ev){
				this.trigger('on');
			}
		},
		{	name: 'tb:idle', // any type of request ongoing
			handler: function(ev){
				this.trigger('off');
			}
		}
	]

}