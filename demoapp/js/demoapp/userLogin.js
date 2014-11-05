tb.nameSpace( 'demoapp', true ).userLogin = {

	name: 'demoapp.userLogin',

	loginData: tb.observable( 'loginData', {} ),

	handlers: {
		
		'tb.init': function userlogin_tb_init(ev){
			var that = this; // for later use in callbacks

			$( this.target ).html( tb.loader.get('demoapp/userLogin.html') );

			this.form = $('.userlogin form');
			this.usernick = $('.userlogin input[name=usernick]');
			this.userpass = $('.userlogin input[name=userpass]');

			this.model = new tb.Model(
				{
					//url: 'service/login.{usernick}.{userpass}.json' // for file service, use if no php/mongo installed
					url: 'service.php?action=login&usernick={usernick}&userpass={userpass}' // php / mongo test
				}
			);

			this.model.data.observe( function userlogin_success(){ // this way it is a custom event instead of 'tb.model.success'
				that.trigger( 'userlogin.success', that.model.data() );
			});

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

			// quirky behaviour fix for link instead of submit button, but ok for now:
			$( this.target )
				.find('input')
				.on(
					'keypress',
					function(e) {
						if(e.which == 13) {
							$( that.target )
								.find('.userlogin-loginlink')
								.click();
						}
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

		'logout': function userlogin_logout(ev){
			$( this.target )
				.find('.userlogin-logoutlink')
				.click();
		},

		'userlogin.success': function userlogin_loginsuccess(ev){
			var html = tb.parse( this.data, tb.loader.get('demoapp/userGreeting.html') ),
				that = this;

			if ( $.isEmptyObject( ev.data ) ){ // no record returned
				this.trigger( ':tb.model.failure:l' );
				return;
			}

			this.loginData( this.data ); // demoapp.topMenu watching this

			$( this.target )
				.html( html )
				.find('.userlogin-logoutlink')
				.on(
					'click',
					function(){
						that.loginData({ usernick: 'Guest', userpass: 'd41d8cd98f00b204e9800998ecf8427e' });
						that.trigger(':tb.init:'); // a bit too easy, I know, but possible here
					}
				);
		},

		'tb.model.failure': function userlogin_loginfailure(ev){ // use system event so it also catches HTTP status errors
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