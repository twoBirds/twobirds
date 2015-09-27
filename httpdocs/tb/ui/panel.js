tb.namespace('tb.ui', true).panel = (function(){

	function onInit(){

		var that = this;

		that.$titleBar = $('<div />').appendTo( that.target );
		that.$content = $('<div />').appendTo( that.target );

		that.$titleBar.on(
			'click',
			function(){
				that.toggle();
			}
		);
		
		$( that.target ).css( that.config.css || {} );

		that.setTitle( that.config.title || '-' );
		that.setContent( that.config.content || '-no content-' );
	}

	function panel( pConfig ){

		var that = this;

		that.config = pConfig || {};

		that.handlers = {
			'init': onInit			
		};

	}

	panel.prototype = {

		namespace: 'tb.ui.panel',

		setTitle: function( pTitle ){
			var that = this;
			that.$titleBar.html( '<span>' + pTitle + '</span>');
			that.trigger( 'setTitle', pTitle );
		},
		
		setContent: function( pContent ){
			var that = this;
			that.$content.html( '<span>' + pContent + '</span>');
			that.trigger( 'setContent', pContent );
		},
		
		toggle: function(){
			var that = this;
			that.$content.toggle();
			that.trigger('toggle');
		},
		
		show: function(){
			var that = this;
			that.$content.show();
			that.trigger('show');
		},
		
		hide: function(){
			var that = this;
			that.$content.hide();
			that.trigger('hide');
		},
		
		'tb.require': [
			'/tb/ui/panel.css'
		]

	};

	return panel;

})();