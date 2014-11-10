demoapp.adaptiveWindow = {

	name: 'demoapp.adaptiveWindow',

	'demoapp.sys.window': {
        canClose: true,
		title: 'Adaptive Window',
		status: 'ok',
		scrollBar: false      
    },

    'tb.require': [
		'demoapp/adaptiveWindow.css'
	],

	handlers: {
		'tb.init': function adaptiveWindow_tb_init(ev){
			var that = this;

			// model
			this.model = new tb.Model({
				url: 'http://api.icndb.com/jokes/random/{count}?limitTo=[nerdy]' // cross origin call
			});

			// on model data change
			this.model.data.observe( function adaptiveWindow_success(){ // this way it is a custom event instead of 'tb.model.success'
				that.trigger( ':adaptiveWindow.success:', that.model.data() );
			});

		},

		'window.ready': function adaptiveWindow_ready(ev){
			this['demoapp.sys.window'].content.html( '<div class="_adaptiveWindow"></div>' );
			this.model.get( { "count": 1+(Math.random()*10) } );
		},

		'adaptiveWindow.success': function adaptiveWindow_success(ev){
			var html = '<p style="font-style:italic;font-weight:normal">When CN humbly asked me whether I could make this bold, i did because...</p><br />';

			$.each( ev.value, function( i, v ){
				html += '<p><i aria-hidden="true" class="icon-info"></i>&nbsp;' + v.joke + '</p>'
			});

			html += '<br />';
			this.trigger(':window.setStatus:d', '<p style="font-style:italic;font-weight:normal">Most of all, he personally invented the <i class="blink">blink</i> tag.'+
				' It even works on paper and 3D printers if he prints it.</p>');
			$( this.target ).find('._adaptiveWindow').html( html );
		}

	}

};