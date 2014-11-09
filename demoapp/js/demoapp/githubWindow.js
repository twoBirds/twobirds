demoapp.githubWindow = {

	name: 'demoapp.githubWindow',

	'demoapp.sys.window': {
        canClose: false,
        canMove: false,
        canCollapse: false,
		title: 'get source',
		status: '-',
		scrollBar: false      
    },

	handlers: {
		'window.ready': function imageWindow_window_ready(ev){
			this['demoapp.sys.window'].content.html( 
				'<br />'+
				'<a href="https://github.com/FrankieTh-xx/twobirds" target="_blank">get system from github</a><br />'+
				'<br />'
			);
		}
	}

};