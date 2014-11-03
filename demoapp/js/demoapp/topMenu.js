tb.nameSpace( 'demoapp', true ).topMenu = {

	name: 'demoapp.topMenu',

	handlers: {
		
		'tb.init': function userlogin_tb_init(ev){
			this.model = new tb.Model(
				{
					url: 'service/menu.{usernick}.{userpass}.fragment' // {...} being the placeholders for later get() invocation
				},
				this
			);

			// load standard menu
			this.trigger(':loadmenu:', { usernick: 'Guest', userpass: 'd41d8cd98f00b204e9800998ecf8427e' } );

			return false; // break here
		},

		'tb.idle': function topmenu_tb_idle(ev){
			var that = this;
			tb( demoapp.userLogin ).loginData.observe( function( pParm ){
				that.trigger(':loadmenu:', pParm );
				that.removeHandler( 'tb.idle' );
			});
		},

		'loadmenu': function topmenu_load_menu(ev){
			this.model.get( ev.data );
		},

		'tb.model.success': function topmenu_load_success(ev){
			$( this.target ).html( ev.data );
			$( this.target )
				.on(
					'click',
					'li > ul > li',
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
		},
		
		'tb.model.failure': function topmenu_load_failure(ev){
		}		

	},

	'tb.require': [
		'demoapp/topMenu.css'
	]

}