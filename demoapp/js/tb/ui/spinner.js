tb.nameSpace( 'tb.ui', true ).spinner = {

	name: 'tb.ui.spinner',

	'tb.require': [
		'tb/ui/spinner.html',
		'tb/ui/spinner.css'
	],
	
	handlers: {

		'tb.init': [
			function spinner_tb_init(ev){
				//console.log('spinner_tb_init');
				$(this.target).html( tb.loader.get('tb/ui/spinner.html') );
			}
		],

		'tb.ui.spinner.on': [
			function spinner_on(ev){
				//console.log('spinner_on');
				$(this.target).show();
			}
		],

		'tb.ui.spinner.off': [
			function spinner_off(ev){
				//console.log('spinner_off');
				$(this.target).hide();
			}
		]

	}

}