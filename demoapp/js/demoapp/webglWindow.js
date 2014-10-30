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
			console.log( 'webGL WINDOW READY content = ', ev.origin.content );

			this.scene = new THREE.Scene(); 
			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 ); 
			this.renderer = new THREE.WebGLRenderer( { alpha: true } );
			this.renderer.setClearColor( 0x000000, 0 );

			this.renderer.setSize( ev.origin.content.width(), ev.origin.content.height() ); 
			
			//document.body.appendChild( renderer.domElement ); 
			ev.origin.content.append( this.renderer.domElement ); 
			
			this.geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
			//this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 
			this.material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0xaaaaaa, shininess: 50, shading: THREE.FlatShading } ); 
			this.cube = new THREE.Mesh( this.geometry, this.material ); 
			
			this.scene.add( this.cube ); 
			
			this.directionalLight1 = new THREE.DirectionalLight( 0x0000aa, 0.5 ); 
			this.directionalLight1.position.set( 0, 3, 0 ); 
			
			this.scene.add( this.directionalLight1 );
			
			this.directionalLight2 = new THREE.DirectionalLight( 0xaa0000, 0.5 ); 
			this.directionalLight2.position.set( 0, 0, 5 ); 
			
			this.scene.add( this.directionalLight2 );
			
			this.camera.position.z = 5; 
			
			this.cameraMove = -0.02;

			console.log( this );
			this.render = (function(that){ return function () { 
				requestAnimationFrame( that.render ); 
				that.cube.rotation.x += 0.05; 
				that.cube.rotation.y += 0.05; 
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
			this.renderer.setSize( ev.origin.content.width(), ev.origin.content.height() ); 
		}

	}

};

// attach window resize handler
$(window).on('resize', function () {
	tb(/webglWindow/).trigger(':window.resize:ld');
});

