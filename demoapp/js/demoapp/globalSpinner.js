demoapp.globalSpinner = {

	name: 'demoapp.globalSpinner',

	'tb.ui.spinner': {},

	handlers: {

		'tb.loading': [
			function globalSpinner_tb_loading(ev){
				//console.log('globalSpinner_tb_loading', this);
				this['tb.ui.spinner'].trigger(':tb.ui.spinner.on:');
			}
		],

		'tb.idle': [
			function globalSpinner_tb_idle(ev){
				//console.log('globalSpinner_tb_idle', this);
				this['tb.ui.spinner'].trigger(':tb.ui.spinner.off:');
			}
		]
	}

}