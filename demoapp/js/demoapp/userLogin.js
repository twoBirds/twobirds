tb.nameSpace( 'demoapp', true ).userLogin = {

	name: 'demoapp.userLogin',

	handlers: {
		
		'tb.init': function userlogin_tb_init(ev){
			var that = this;

			$( this.target ).html( tb.loader.get('demoapp/userLogin.html') );

			this.form = $('.userlogin form');
			this.usernick = $('.userlogin input[name=usernick]');
			this.userpass = $('.userlogin input[name=userpass]');

			this.model = new tb.Model(
				{
					url: 'service/login.{usernick}.{userpass}.json' // {...} being the placeholders for later get() invocation
				},
				this
			);

			$( this.target )
				.find('.userlogin-loginlink')
				.on(
					'click',
					function(){
						that.data = { usernick: that.usernick.val() }
						that.trigger(':login:')
					}
				);

			return false; // break here
		},

		'login':  function userlogin_login(ev){
			// convert pass to md5
			var val = decodeURIComponent( this.userpass.val() );
			this.userpass.val( tb.md5.hex_md5( val ) );
			this.model.get( this.form.serialize() );
			this.userpass.val(val); // not really necessary ;-)
		},

		'tb.model.success': function userlogin_loginsuccess(ev){
			var html = tb.parse( this.data, tb.loader.get('demoapp/userGreeting.html') );
			$( this.target ).html( html );

			$( this.target )
				.find('.userlogin-logoutlink')
				.on(
					'click',
					function(){
						that.data = {};
						that.trigger(':tb.init:'); // a bit tricky I know but possible here
					}
				);

		},

		'tb.model.failure': function userlogin_loginfailure(ev){
			this.userpass.addClass( 'login-failed' );
		}
	},

	'tb.require': [
		'tb/md5.js',
		'demoapp/userGreeting.html',
		'demoapp/userLogin.html',
		'demoapp/userLogin.css'
	]

}