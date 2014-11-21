tb.nameSpace( 'demoapp', true ).globalSpinner = {

	name: 'demoapp.globalSpinner',

	'tb.ui.spinner': {},

	handlers: {

		'tb.init': function globalSpinner_tb_init(){
			var that = this;

			// observe loading status and trigger spinner accordingly
			tb.loader.loading.observe( function globalSpinner_setSpinner( pBool ){ 
				if ( pBool ){
					that.trigger(':tb.ui.spinner.on:d');
				} else {
					that.trigger(':tb.ui.spinner.off:d');
				}
			});

		}

	}

}