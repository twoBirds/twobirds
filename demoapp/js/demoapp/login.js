tb.nameSpace('demoapp').login = {

	'tb.events': [ // what events do i listen to ?
		{	name: /tb.require:done/, // just to illustrate regexes
			handler: function(ev){
				//console.log( this.name + '.init()')
				this.init();
				return false; // dont bubble up
			}
		}
	],

	'tb.require': [
		'demoapp/login.html',
		'demoapp/login.css'
	],

	// constructor
	'init': function(){
		// display template
		$(this.target).html( tb.loader.get('demoapp/login.html') );
	}

}