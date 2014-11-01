tb.nameSpace( 'demoapp', true ).userLogin = {

	name: 'demoapp.userLogin',

	handlers: {
		'tb.init': function userlogin_tb_init(ev){
			$( this.target ).html( tb.loader.get('demoapp/userLogin.html') );
			return false; // break here
		}
	},

	'tb.require': [
		'tb/md5.js',
		'demoapp/userLogin.html',
		'demoapp/userLogin.css'
	]

}