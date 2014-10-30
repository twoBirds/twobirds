tb.nameSpace( 'demoapp', true ).body = {

	name: 'demoapp.body',

	handlers: {
		'tb.init': function body_init(ev){
			$(this.target).html( tb.loader.get('demoapp/body.html') );

			var url = $('.thissitenamelink')
				.text( window.location.host )
				.attr( 'href', window.location.protocol + '//' + window.location.host );

			this.initChildren();
		}
	},

	'tb.require': [
		'demoapp/props/icomoon/style.css',
		'demoapp/body.html',
		'demoapp/body.css'
	]

}