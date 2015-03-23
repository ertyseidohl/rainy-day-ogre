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

	exports.Renderer = function(options) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
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

			var offset = Math.sqrt(3);

			for (var i = 0; i < 10; i ++) {
				for (var j = 0; j < 10; j++) {
					var m;

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
					if (i % 2 === 0) {
						h.position.set(i * 1.5,0, (j + 0.5) * offset);
					} else {
						h.position.set(i * 1.5,0,j * offset);
					}
					this.scene.add(h);
				}
			}

			this.camera.position.set(0,20,0);
			this.camera.up = new THREE.Vector3(0,0,1);
			this.camera.lookAt(new THREE.Vector3(0,0,0));

			this.loop();
		},

		update: function() {

		},

		render : function() {
			this.renderer.render( this.scene, this.camera );
		}
	};

})(window);
