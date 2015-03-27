;(function(exports){

	var floorLevel = 0;

	var makeHexPoint = function(i) {
		return new THREE.Vector3(
			Math.cos(2*Math.PI*i/6),
			floorLevel,
			Math.sin(2*Math.PI*i/6)
		);
	};

	var hexPoints = [];

	for (var i = 6; i > 0; i--) {
		hexPoints.push(makeHexPoint(i));
	}

	var triangles = [
		new THREE.Face3(1,5,0),
		new THREE.Face3(1,4,5),
		new THREE.Face3(1,2,4),
		new THREE.Face3(2,3,4)
	];

	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.SmoothShading } );
	var material2 = new THREE.MeshLambertMaterial( { color: 0x444444, shading: THREE.SmoothShading } );
	var material3 = new THREE.MeshLambertMaterial( { color: 0x666666, shading: THREE.SmoothShading } );
	var material4 = new THREE.MeshLambertMaterial( { color: 0x222222, shading: THREE.SmoothShading } );

	function buildAxis( src, dst, colorHex, dashed ) {
		var geom = new THREE.Geometry(),
			mat;
		if(dashed) {
			mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
		} else {
			mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
		}
		geom.vertices.push( src.clone() );
		geom.vertices.push( dst.clone() );
		geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
		var axis = new THREE.Line( geom, mat, THREE.LinePieces );
		return axis;
	}

	function buildAxes( length ) {
		var axes = new THREE.Object3D();
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
		return axes;
	}

	exports.Renderer = function(options) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		this.shouldShowAxes = false;
		this.currentShouldShowAxes = false;
		this.axes = null;

		options.container.appendChild(this.renderer.domElement);

		var self = this;
		this.loop = function() {
			requestAnimationFrame( self.loop );
			self.update();
			self.render();
		};
	};

	exports.Renderer.prototype = {
		run : function() {
		// add subtle blue ambient lighting
			var ambientLight = new THREE.AmbientLight(0x446600);
			this.scene.add(ambientLight);

			var geometry = new THREE.Geometry();
			geometry.vertices = hexPoints.slice(0);
			geometry.faces = triangles.slice(0);

			var hexOffset = Math.sqrt(3);

			var iOffset = -7;
			var jOffset = -11;

			for (var i = 0; i < 15; i ++) {
				for (var j = 0; j < 22; j++) {
					var _i = i + iOffset,
						_j = j + jOffset,
						m;

					if (i % 2 === 0) {
						if (j % 2 === 0) {
							m = material4;
						} else {
							m = material2;
						}
					} else {
						if (j % 2 === 0) {
							m = material3;
						} else {
							m = material;
						}
					}

					var h = new THREE.Mesh( geometry, m);
					if (_i % 2 === 0) {
						h.position.set(-_i * 1.5,0, -(_j + 0.5) * hexOffset);
					} else {
						h.position.set(-_i * 1.5,0,-_j * hexOffset);
					}
					this.scene.add(h);
				}
			}

			this.camera.position.set(0,18,-25);
			this.camera.up = new THREE.Vector3(0,0,1);
			this.camera.lookAt(new THREE.Vector3(0,0,0));

			controls = new THREE.OrbitControls( this.camera );
			controls.minPolarAngle = Math.PI * 1/2; // radians
			controls.maxPolarAngle = Math.PI * (7/8); // radians
			controls.minAzimuthAngle = Math.PI; // radians
			controls.maxAzimuthAngle = Math.PI; // radians
			controls.mouseButtons = {
				ORBIT: THREE.MOUSE.RIGHT,
				ZOOM: THREE.MOUSE.MIDDLE,
				PAN: THREE.MOUSE.LEFT
			};

			this.axes = buildAxes(10);
			window.addEventListener('keydown', function(e) {
				if (e.keyCode == 65) { //a
					this.shouldShowAxes = !this.shouldShowAxes;
				}
			}.bind(this), false);

			this.loadGiantMan();

			this.loop();
		},

		loadGiantMan: function() {
			var manager = new THREE.LoadingManager();
			var onProgress = function ( xhr ) {
				if ( xhr.lengthComputable ) {
					var percentComplete = xhr.loaded / xhr.total * 100;
					console.log( Math.round(percentComplete, 2) + '% downloaded' );
				}
			};

			var onError = function ( xhr ) {
				console.log("ERROR");
			};

			var textureLoader = new THREE.ImageLoader( manager );
			var texture = new THREE.Texture();
			textureLoader.load( 'textures/UV_Grid_Sm.jpg', function ( image ) {
				texture.image = image;
				texture.needsUpdate = true;
			} );
			var sc = this.scene;

			var objectLoader = new THREE.OBJLoader( manager );
			objectLoader.load( 'obj/male02.obj', function ( object ) {
				object.traverse( function ( child ) {
					if ( child instanceof THREE.Mesh ) {
						child.material.map = texture;
					}
				});
				object.position.y = 0;
				object.scale.set(0.02,0.02,0.02);
				sc.add( object );
			}, onProgress, onError );
		},

		update: function() {
			if(this.currentShouldShowAxes !== this.shouldShowAxes) {
				this.currentShouldShowAxes = this.shouldShowAxes;
				if (this.shouldShowAxes) {
					console.log(this.camera.position);
					this.scene.add(this.axes);
				} else {
					this.scene.remove(this.axes);
				}
			}
		},

		render : function() {
			this.renderer.render( this.scene, this.camera );
		}
	};

})(window);
