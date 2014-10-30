demoapp.webglWindow = {

	name: 'demoapp.webglWindow',

	'demoapp.sys.window': {
		height: '300px',
		canClose: true,
		title: 'webGL Window',
		status: 'ok',
		scrollBar: false           
	},

	'tb.require': [
		'libs/three/three.js'
	],

	handlers: {
		'window.ready': function webglWindow_window_ready(ev){
			this.trigger(':display:');
		},

		'display': function webglWindow_display(){
			var width = this['demoapp.sys.window'].content.width(), 
				height = this['demoapp.sys.window'].content.height();

			this.scene = new THREE.Scene(); 
			this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 ); 
			this.renderer = new THREE.WebGLRenderer( { alpha: true } );
			this.renderer.setClearColor( 0x000000, 0 );

			console.log(this);
			this.renderer.setSize( width, height ); 
			
			//document.body.appendChild( renderer.domElement ); 
			this['demoapp.sys.window'].content.append( this.renderer.domElement ); 
			
			this.geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
			//this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 
			this.material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0xaaaaaa, shininess: 50, shading: THREE.FlatShading } ); 
			this.cube = new THREE.Mesh( this.geometry, this.material ); 
			
			this.scene.add( this.cube ); 
			
			this.directionalLight1 = new THREE.DirectionalLight( 0x0000aa, 0.5 ); 
			this.directionalLight1.position.set( -5, 3, 5 ); 
			
			this.scene.add( this.directionalLight1 );
			
			this.directionalLight2 = new THREE.DirectionalLight( 0xaa0000, 0.5 ); 
			this.directionalLight2.position.set( 5, 0, 5 ); 
			
			this.scene.add( this.directionalLight2 );
			
			this.directionalLight3 = new THREE.DirectionalLight( 0x666666, 0.5 ); 
			this.directionalLight3.position.set( 0, 0, 6 ); 
			
			this.scene.add( this.directionalLight3 );
			
			this.camera.position.z = 5; 
			
			this.cameraMove = -0.02;

			console.log( this );
			this.render = (function(that){ return function () { 
				requestAnimationFrame( that.render ); 
				that.cube.rotation.x += 0.01; 
				that.cube.rotation.y += 0.01; 
				that.cube.rotation.z += 0.01; 
				that.camera.position.z += that.cameraMove;
				if ( that.camera.position.z < 2 || that.camera.position.z > 5 ) that.cameraMove *= -1;
				that.renderer.render(that.scene, that.camera); 
			};})( this );

			this.render();
		},

		'tb.init': function webglWindow_tb_init(ev){
			if (this.ready) return;
			this.ready = true;
		},

		'window.resize': function webglWindow_tb_init(ev){
			console.log( 'window.resize', this );
			//camera.aspect = window.innerWidth / window.innerHeight;
			//camera.updateProjectionMatrix();

			//renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.setSize( ev.origin.content.width(), ev.origin.content.height() ); 
		}

	}

};

// attach window resize handler
$(window).on('resize', function () {
	tb(/webglWindow/).trigger('this:window.resize:ld');
});

