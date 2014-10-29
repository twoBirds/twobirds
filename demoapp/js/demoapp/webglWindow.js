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
		'window.ready': [
			function webglWindow_window_ready(ev){
				console.log( 'webGL WINDOW READY content = ', ev.origin.content );

				// create id for canvas
				//var id = tb.getid(),
				//	html = tb.parse( { 'id': id }, tb.loader.get('demoapp/webglWindow.html') );

				//console.log( 'webGL WINDOW READY html = ', html );
				//ev.origin.content.html(html);

				var scene = new THREE.Scene(); 
				var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 ); 
				var renderer = new THREE.WebGLRenderer( { alpha: true } );
				renderer.setClearColor( 0x000000, 0 );

				renderer.setSize( ev.origin.content.width(), ev.origin.content.height() ); 
				
				//document.body.appendChild( renderer.domElement ); 
				ev.origin.content.append( renderer.domElement ); 
				
				var geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
				//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 
				var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } ); 
				var cube = new THREE.Mesh( geometry, material ); 
				
				scene.add( cube ); 
				
				areaLight1 = new THREE.AreaLight( 0xffffff, 1 ); 
				areaLight1.position.set( 0.0001, 10.0001, -18.5001 ); 
				areaLight1.rotation.set( -0.74719, 0.0001, 0.0001 ); 
				areaLight1.width = 10; 
				areaLight1.height = 1; 
				scene.add( areaLight1 );
				
				camera.position.z = 5; 
				
				var cameraMove = -0.02;

				var render = function () { 
					requestAnimationFrame( render ); 
					cube.rotation.x += 0.05; 
					cube.rotation.y += 0.05; 
					camera.position.z += cameraMove;
					if ( camera.position.z < 2 || camera.position.z > 5 ) cameraMove *= -1;
					renderer.render(scene, camera); 
				}; 

				render(); 			}
		],

		'tb.init': [
			function webglWindow_tb_init(ev){
				if (this.ready) return;
				this.ready = true;
			}

		]

	}

};