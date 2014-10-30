demoapp.globalSpinner = {

	name: 'demoapp.globalSpinner',

	'tb.ui.spinner': {},

	handlers: {

		'tb.loading': function globalSpinner_tb_loading(ev){
			this['tb.ui.spinner'].trigger(':tb.ui.spinner.on:');
		},

		'tb.idle': function globalSpinner_tb_idle(ev){
			this['tb.ui.spinner'].trigger(':tb.ui.spinner.off:');
		}
	}

}