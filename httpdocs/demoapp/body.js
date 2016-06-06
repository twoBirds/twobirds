tb.namespace('demoapp', true).body = (function(){

	function onInit(){
		
		var that = this;
		
		new tb(
			'tb.ui.panel',
			{
				title: '-no title-',
				css: {
					width: '100%'
				}
			},
			$( '<div />' ).appendTo( that.target )
		);

	}

	function body(){
		
		var that = this;

		that.handlers = {
			'init': onInit
		};

	}

	body.prototype = {

		namespace: 'demoapp.body',

		'tb.require': [
			'/demoapp/body.css'
		]

	};

	return body;

})();