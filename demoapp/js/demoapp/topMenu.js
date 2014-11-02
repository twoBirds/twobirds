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

		'loadmenu': function topmenu_load_menu(ev){
			console.log( 'topmenu loadmenu', ev );
			this.model.get( ev.data );
		},

		'tb.model.success': function topmenu_load_success(ev){
			console.log( 'topmenu tb.model.success', ev );
			$( this.target ).html( ev.data );
		},
		
		'tb.model.failure': function topmenu_load_failure(ev){
			console.log( 'topmenu tb.model.failure', ev );
		}		

	},

	'tb.require': [
		'demoapp/topMenu.css'
	]

}