demoapp.contactWindow = {

	name: 'demoapp.contactWindow',

	'demoapp.sys.window': {
        canClose: false,
        canMove: false,
        canCollapse: false,
		title: 'contact',
		status: '-',
		scrollBar: false      
    },

	handlers: {
		'window.ready': function imageWindow_window_ready(ev){
			this['demoapp.sys.window'].content.html( 
				'<br>'+
				'<a href="mailto:frank_thuerigen@yahoo.de?subject=RE:twoBirds">eMail</a><br>'+
				'<a href="skype:frank.thuerigen?chat">skype frank.thuerigen</a><br>'+
				'<br>'
			);
		}
	}

};