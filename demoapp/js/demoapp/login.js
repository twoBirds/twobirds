tb.nameSpace('demoapp').login = {

	'handlers': {
		'tb.require:done': function login_require_done(ev){
			this.init();
			return false; // break here
		}
	},

	'tb.require': [
		'demoapp/login.html',
		'demoapp/login.css'
	],

	'init': function(){
		$(this.target).html( tb.loader.get('demoapp/login.html') );
	}

}