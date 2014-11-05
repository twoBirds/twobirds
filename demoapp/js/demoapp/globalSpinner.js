demoapp.globalSpinner = {

	name: 'demoapp.globalSpinner',

	'tb.ui.spinner': {},

	handlers: {

		'tb.init': function globalSpinner_tb_init(){
			var that = this['tb.ui.spinner'];

			// observe loading status and trigger spinner accordingly
			tb.loader.loading.observe( function( pBool ){ 
				if ( pBool ){
					that.trigger(':tb.ui.spinner.on:');
				} else {
					that.trigger(':tb.ui.spinner.off:');
				}
			});

		}

	}

}