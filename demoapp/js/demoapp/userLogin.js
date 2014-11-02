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
						that.data = { 
							usernick: that.usernick.val(), 
							userpass: that.userpass.val() 
						};

						that.trigger(':login:')
					}
				);

			return false; // break here
		},

		'login':  function userlogin_login(ev){
			// convert pass to md5
			var val = decodeURIComponent( this.userpass.val() ),
				md5 = tb.md5.hex_md5( val );

			this.userpass.val( md5 );
			this.data.userpass = md5;
			
			this.model.get( this.form.serialize() );
			this.userpass.val(val);
		},

		'tb.model.success': function userlogin_loginsuccess(ev){
			var html = tb.parse( this.data, tb.loader.get('demoapp/userGreeting.html') ),
				that = this;

			$( this.target ).html( html );

			$( this.target )
				.find('.userlogin-logoutlink')
				.on(
					'click',
					function(){
						that.data = {};
						that.trigger(':tb.init:'); // a bit too easy. I know, but possible here
					}
				);

			tb(/topMenu/).trigger( 
				'loadmenu', 
				that.data
			);

		},

		'tb.model.failure': function userlogin_loginfailure(ev){
			var that = this;

			this.userpass.addClass( 'login-failed' );
			this.userpass.one( 'focus', function(){
				that.userpass.removeClass( 'login-failed' );
			});
		}

	},

	'tb.require': [
		'tb/md5.js',
		'demoapp/userGreeting.html',
		'demoapp/userLogin.html',
		'demoapp/userLogin.css'
	]

}