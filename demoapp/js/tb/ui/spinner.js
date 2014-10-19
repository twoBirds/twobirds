tb.ui = tb.ui || {};

tb.ui.spinner = {

	name: 'tb.ui.spinner',

	handlers: [

		{	name: 'tb.require:done', // when loaded
			handler: function(ev){
				this.init();
				return false; // dont bubble up
			}
		},

		{	name: 'on', // any type of request ongoing
			handler: function(ev){
				$(this.target).show();
			}
		},
		{	name: 'off', // any type of request ongoing
			handler: function(ev){
				$(this.target).hide();
			}
		}
	],

	'tb.require': [
		'tb/ui/spinner.html',
		'tb/ui/spinner.css'
	],

	// constructor
	'init': function(){
		//console.log('tb.spinner.init', this);
		$(this.target).html( tb.loader.get('tb/ui/spinner.html') );
	}
}