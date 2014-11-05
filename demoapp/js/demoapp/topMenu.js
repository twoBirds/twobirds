tb.nameSpace( 'demoapp', true ).topMenu = {

	name: 'demoapp.topMenu',

	handlers: {
		
		'tb.init': function userlogin_tb_init(ev){
			var that = this;

			this.model = new tb.Model(
				{
					url: 'service/menu.{usernick}.{userpass}.fragment' // {...} being the placeholders for later get() invocation
				},
				this
			);

			tb.loader.loading.observe( function topmenu_loading_changed( data ){
				if ( data === false ) tb( demoapp.userLogin ).loginData.observe( function topmenu_on_user_change( data ){
					that.trigger(':loadmenu:', data );
				}); // missing ,true => continous watch 
			}, true ); // true => only once

			// behaviour
			$( this.target )
				.on(
					'click',
					'ul#Navigation > li > ul > li',
					function( ev ){
						var t = $(ev.currentTarget).find('a').attr('href');
						t = t.split(':');
						if ( !t[1] ) return;
						tb( t[0] ).trigger( t[1], t[2] || '' );
					}
				)
				.on(
					'click',
					'a',
					function( ev ){
						ev.preventDefault();
					}
				)
				.on(
					'click',
					'#Navigation li[href="#"]',
					function( ev ){
						ev.stopImmediatePropagation();
						ev.preventDefault();
					}
				);

			// load standard menu
			this.trigger(':loadmenu:', { usernick: 'Guest', userpass: 'd41d8cd98f00b204e9800998ecf8427e' } );

			return false; // break here
		},

		'loadmenu': function topmenu_load_menu(ev){
			this.model.get( ev.data );
		},

		'tb.model.success': function topmenu_load_success(ev){
			$( this.target ).html( ev.data );
		},
		
		'tb.model.failure': function topmenu_load_failure(ev){
		}		

	},

	'tb.require': [
		'demoapp/topMenu.css'
	]

}