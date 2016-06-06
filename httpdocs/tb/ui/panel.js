tb.namespace('tb.ui', true).panel = (function(){

	function panel( pConfig ){

		var that = this;

		that.config = pConfig || {};

		that.handlers = {
			'init': init
		};

	}

	panel.prototype = {

		namespace: 'tb.ui.panel',

		setTitle: setTitle,

		setContent: setContent,

		toggle: toggle,

		show: show,

		hide: hide,

		'tb.require': [
			'/tb/ui/panel.css'
		]

	};

	return panel;

	function init(){

		var that = this;

		console.log( 'panel init() handler ');

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

	function setTitle( pTitle ){
		var that = this;
		that.$titleBar.html( '<span>' + pTitle + '</span>');
		that.trigger( 'setTitle', pTitle );
	}

	function setContent( pContent ){
		var that = this;
		that.$content.html( '<span>' + pContent + '</span>');
		that.trigger( 'setContent', pContent );
	}

	function toggle(){
		var that = this;
		that.$content.toggle();
		that.trigger('toggle');
	}

	function show(){
		var that = this;
		that.$content.show();
		that.trigger('show');
	}

	function hide(){
		var that = this;
		that.$content.hide();
		that.trigger('hide');
	}


})();