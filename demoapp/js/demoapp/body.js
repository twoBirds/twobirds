demoapp.body = {

	name: 'demoapp.body',

	'tb.events': [ 
		{	name: /tb.require:done/, 
			handler: function(ev){
				$(this.target).html( tb.loader.get('demoapp/body.html') );

				var url = $('.thissitenamelink')
					.text( window.location.host )
					.attr( 'href', window.location.protocol + '//' + window.location.host );

				this.initChildren();
			}
		}
	],

	'tb.require': [
		'demoapp/props/icomoon/style.css',
		'demoapp/body.html',
		'demoapp/body.css'
	]

}