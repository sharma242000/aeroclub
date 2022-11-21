/*
  Animated Textures
  by Aaron Sherrill
  Copyright 2019
*/
$( document ).ready(function() {
  // js goes in here.

THREE.SpriteSheetTexture = function(image, framesX, framesY, frameWidth, frameHeight, frameDelay, _endFrame) {
	
	var canvas = document.createElement('canvas');
	canvas.width = frameWidth;
	canvas.height = frameHeight;
	
	var timer, x = y = count = startFrame = 0;
		var endFrame = _endFrame || framesX * framesY;
		var ctx = canvas.getContext('2d');

	$(canvas).css({
			width: frameWidth,
			height: frameHeight
		});
		
		var img = new Image();
		img.crossOrigin = "Anonymous"
		img.onload = function(){
			console.log("spritesheet loaded");
			timer = setInterval(nextFrame, frameDelay);
		}
		img.src = image;
	
		function nextFrame() {
			count++;
			
			if(count >= endFrame ) {
				count = 0;
			};
			
			x = (count % framesX) * frameWidth;
			y = ((count / framesX)|0) * frameHeight;
			
			ctx.clearRect(0, 0, frameWidth, frameHeight);
			ctx.drawImage(img, x, y, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
		}
	
	return new THREE.CanvasTexture(canvas);
}

//
var Mathutils = {
    normalize: function($value, $min, $max) {
        return ($value - $min) / ($max - $min);
    },
    interpolate: function($normValue, $min, $max) {
        return $min + ($max - $min) * $normValue;
    },
    map: function($value, $min1, $max1, $min2, $max2) {
        if ($value < $min1) {
            $value = $min1;
        }
        if ($value > $max1) {
            $value = $max1;
        }
        var res = this.interpolate(this.normalize($value, $min1, $max1), $min2, $max2);
        return res;
    }
};
var markers = [];


//Get window size
var ww = window.innerWidth,
  wh = window.innerHeight;

var composer, params = {
    exposure: 1.3,
    bloomStrength: .9,
    bloomThreshold: 0,
    bloomRadius: 0
  };

//Create a WebGL renderer
var renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
  antialias: true,
  shadowMapEnabled: true,
  shadowMapType: THREE.PCFSoftShadowMap
});
renderer.setSize(ww, wh);

//Create an empty scene
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x5dbcd2,0,150);

var clock = new THREE.Clock();

//Create a perpsective camera
var cameraRotationProxyX = 3.14159;
var cameraRotationProxyY = 0;

var camera = new THREE.PerspectiveCamera(45, ww / wh, 0.001, 200);
camera.rotation.y = cameraRotationProxyX;
camera.rotation.z = cameraRotationProxyY;

//camera.position.z = 400;
var c = new THREE.Group();
c.position.z = 400;

c.add(camera);
scene.add(c);


//set up render pass
var renderScene = new THREE.RenderPass( scene, camera );
var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
			bloomPass.renderToScreen = true;
			bloomPass.threshold = params.bloomThreshold;
			bloomPass.strength = params.bloomStrength;
			bloomPass.radius = params.bloomRadius;
			composer = new THREE.EffectComposer( renderer );
			composer.setSize( window.innerWidth, window.innerHeight );
			composer.addPass( renderScene );
			composer.addPass( bloomPass );


//Array of points
var points = [
	[10, 89, 0],
	[50, 88, 10],
	[76, 139, 20],
	[126, 141, 12],
	[150, 112, 8],
	[157, 73, 0],
	[180, 44, 5],
	[207, 35, 10],
	[232, 36, 0]
];

var p1, p2;

//Convert the array of points into vertices
for (var i = 0; i < points.length; i++) {
  var x = points[i][0];
  var y = points[i][2];
  var z = points[i][1];
  points[i] = new THREE.Vector3(x, y, z);
}
//Create a path from the points
var path = new THREE.CatmullRomCurve3(points);
//path.curveType = 'catmullrom';
path.tension = .5;

//Create a new geometry with a different radius
var geometry = new THREE.TubeGeometry( path, 300, 4, 32, false );

var texture = new THREE.TextureLoader().load( 'https://wallpaperplay.com/walls/full/4/7/b/40696.jpg' , function ( texture ) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 15, 2 );

} );


var mapHeight = new THREE.TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/waveform-bump3.jpg', function( texture){
 
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 15, 2 );
  
});

var material = new THREE.MeshPhongMaterial({
  side:THREE.BackSide,
  map: texture,
  shininess: 20,
  bumpMap: mapHeight,
  bumpScale: -.03,
  specular: 0x000000
});

//Create a mesh
var tube = new THREE.Mesh( geometry, material );
//tube.receiveShadows = true;
//Push the mesh into the scene
scene.add( tube );

//inner tube.=========================================

//Create a new geometry with a different radius
var geometry = new THREE.TubeGeometry( path, 150, 3.4, 32, false );
var geo = new THREE.EdgesGeometry( geometry );
//THREE.EdgesGeometry( geometry );

var mat = new THREE.LineBasicMaterial( {
  linewidth: 2,
  opacity: .2,
  transparent: 1
} );

var wireframe = new THREE.LineSegments( geo, mat );


scene.add( wireframe );

  
  



//-------------------------


//Create a point light in our scene
var light = new THREE.PointLight(0xffffff, .35, 4,0);
light.castShadow = true;
scene.add(light);


function updateCameraPercentage(percentage) {
  p1 = path.getPointAt(percentage%1);
  p2 = path.getPointAt((percentage + 0.03)%3);
  p3 = path.getPointAt((percentage + 0.05)% 1);

  c.position.set(p1.x,p1.y,p1.z);
  c.lookAt(p2);
  light.position.set(p2.x, p2.y, p2.z);
}


var cameraTargetPercentage = 0;
var currentCameraPercentage = 0;



gsap.defaultEase = Linear.easeNone;

var tubePerc = {
  percent: 0
}

gsap.registerPlugin(ScrollTrigger);

var tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scrollTarget",
    start: "top top",
    end: "bottom 100%",
    scrub: 5,
    markers: {color: "white"}
  }
})
tl.to(tubePerc, {
   percent:.96,
   ease: Linear.easeNone,
   duration: 10,
   onUpdate: function() {
     cameraTargetPercentage = tubePerc.percent;
   }
});


function render(){
  //texture.offset.x+=.004
  //texture2.needsUpdate = true;
  currentCameraPercentage = cameraTargetPercentage
  
  camera.rotation.y += (cameraRotationProxyX - camera.rotation.y) / 15;
  camera.rotation.x += (cameraRotationProxyY - camera.rotation.x) / 15;
  
  updateCameraPercentage(currentCameraPercentage);
  
  //animate texture
  
  particleSystem1.rotation.y += 0.00002;
  particleSystem2.rotation.x += 0.00005;
  particleSystem3.rotation.z += 0.00001;
  
  //Render the scene
  //renderer.render(scene, camera);
  composer.render();

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

$('canvas').click(function(){
  console.clear();
  markers.push(p1);
  console.log(JSON.stringify(markers));
});

window.addEventListener( 'resize', function () {
  
  var width = window.innerWidth;
  var height = window.innerHeight;
  
  camera.aspect = width / height;
	camera.updateProjectionMatrix();
  
  renderer.setSize( width, height );
  composer.setSize( width, height );
  
}, false );



var lastPlace = 0;
var newPlace = 0;



//particle system
// create the particle variables
//
var spikeyTexture = new THREE.TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/spikey.png');


var particleCount = 50000,
    particles1 = new THREE.Geometry(),
    particles2 = new THREE.Geometry(),
    particles3 = new THREE.Geometry(),
    pMaterial = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: .5,
      map: spikeyTexture,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

// now create the individual particles
for (var p = 0; p < particleCount; p++) {

  // create a particle with random
  // position values, -250 -> 250
  var pX = Math.random() * 500 - 250,
      pY = Math.random() * 50 - 25,
      pZ = Math.random() * 500 - 250,
      particle = new THREE.Vector3(pX, pY, pZ);

  // add it to the geometry
  particles1.vertices.push(particle);
}

// now create the individual particles
for (var p = 0; p < particleCount; p++) {

  // create a particle with random
  // position values, -250 -> 250
  var pX = Math.random() * 500,
      pY = Math.random() * 10 - 5,
      pZ = Math.random() * 500,
      particle = new THREE.Vector3(pX, pY, pZ);

  // add it to the geometry
  particles2.vertices.push(particle);
}

// now create the individual particles
for (var p = 0; p < particleCount; p++) {

  // create a particle with random
  // position values, -250 -> 250
  var pX = Math.random() * 500,
      pY = Math.random() * 10 - 5,
      pZ = Math.random() * 500,
      particle = new THREE.Vector3(pX, pY, pZ);

  // add it to the geometry
  particles3.vertices.push(particle);
}

// create the particle system
var particleSystem1 = new THREE.ParticleSystem(
    particles1,
    pMaterial);

var particleSystem2 = new THREE.ParticleSystem(
    particles2,
    pMaterial);

var particleSystem3 = new THREE.ParticleSystem(
    particles3,
    pMaterial);

// add it to the scene
scene.add(particleSystem1);
scene.add(particleSystem2);
scene.add(particleSystem3);


$(document).mousemove(function(evt) {
  cameraRotationProxyX = Mathutils.map(evt.clientX, 0, window.innerWidth, 3.24, 3.04);
  cameraRotationProxyY = Mathutils.map(evt.clientY, 0, window.innerHeight, -.1, .1);
});



/* my javascript code */
/* for scrolling */
if(screen.width>=600){
  $(window).scroll(function () {
    if ($(this).scrollTop() > 5670) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'visible');
    } else if ($(this).scrollTop() > 5040) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'visible');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 4410) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'visible');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 3780) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'visible');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 3150) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'visible');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 2520) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'visible');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 1890) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'visible');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 1260) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'visible');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 630) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'visible');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else {
        $("#div1").css('visibility', 'visible');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    }
});
}
else{
  $(window).scroll(function () {
    if ($(this).scrollTop() > 6300) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'visible');
    } else if ($(this).scrollTop() > 5600) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'visible');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 4900) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'visible');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 4200) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'visible');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 3500) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'visible');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 2800) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'visible');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 2100) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'visible');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 1400) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'visible');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else if ($(this).scrollTop() > 700) {
        $("#div1").css('visibility', 'hidden');
        $("#div2").css('visibility', 'visible');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    } else {
        $("#div1").css('visibility', 'visible');
        $("#div2").css('visibility', 'hidden');
        $("#div3").css('visibility', 'hidden');
        $("#div4").css('visibility', 'hidden');
        $("#div5").css('visibility', 'hidden');
        $("#div6").css('visibility', 'hidden');
        $("#div7").css('visibility', 'hidden');
        $("#div8").css('visibility', 'hidden');
        $("#div9").css('visibility', 'hidden');
        $("#div10").css('visibility', 'hidden');
    }
});
}



$(window).scroll(function(){
  if(screen.width<=600){
    $("#div1").css("opacity",1-$(window).scrollTop()/900);
  }else{
    $("#div1").css("left", (200-$(window).scrollTop()));
    $("#div1").css("opacity",1-$(window).scrollTop()/900);
  }
  });
$(window).scroll(function(){
  if(screen.width<=600){
    $("#div2").css("opacity",1-($(window).scrollTop()-700)/900);
  }
  else{
    if($(this).scrollTop()<830){
    $("#div2").css("right", (200));
  }
  else{
    $("#div2").css("right", (830-$(window).scrollTop()));
    $("#div2").css("opacity",1-($(window).scrollTop()-830)/900);
  }
  }
  });
$(window).scroll(function(){
  if(screen.width<=600){
    $("#div3").css("opacity",1-($(window).scrollTop()-1400)/900);
  }
  else{
    if($(this).scrollTop()<1460){
    $("#div3").css("left", (200));
  }
  else{
    $("#div3").css("left", (1460-$(window).scrollTop()));
    $("#div3").css("opacity",1-($(window).scrollTop()-1460)/900);
  }
  }
  });
$(window).scroll(function(){
  if(screen.width<=600){
    $("#div4").css("opacity",1-($(window).scrollTop()-2100)/900);
  }
  else{
    if($(this).scrollTop()<2090){
    $("#div4").css("right", (200));
  }
  else{
    $("#div4").css("right", (2090-$(window).scrollTop()));
    $("#div4").css("opacity",1-($(window).scrollTop()-2090)/900);
  }
  }
  });
$(window).scroll(function(){
  if(screen.width<=600){
    $("#div5").css("opacity",1-($(window).scrollTop()-2800)/900);
  }
  else{
    if($(this).scrollTop()<2720){
    $("#div5").css("left", (200));
  }
  else{
    $("#div5").css("left", (2720-$(window).scrollTop()));
    $("#div5").css("opacity",1-($(window).scrollTop()-2720)/900);
  }
  }
  });
$(window).scroll(function(){
  if(screen.width<=600){
    $("#div6").css("opacity",1-($(window).scrollTop()-3500)/900);
  }
  else{
    if($(this).scrollTop()<3350){
    $("#div6").css("right", (200));
  }
  else{
    $("#div6").css("right", (3350-$(window).scrollTop()));
    $("#div6").css("opacity",1-($(window).scrollTop()-3350)/900);
  }
  }
  });
$(window).scroll(function(){
  if(screen.width<=600){
    $("#div7").css("opacity",1-($(window).scrollTop()-4200)/900);
  }
  else{
    if($(this).scrollTop()<3980){
    $("#div7").css("left", (200));
  }
  else{
    $("#div7").css("left", (3980-$(window).scrollTop()));
    $("#div7").css("opacity",1-($(window).scrollTop()-3980)/900);
  }
  }
  });
$(window).scroll(function(){
  if(screen.width<=600){
    $("#div8").css("opacity",1-($(window).scrollTop()-4900)/900);
  }
  else{
    if($(this).scrollTop()<4610){
    $("#div8").css("right", (200));
  }
  else{
    $("#div8").css("right", (4610-$(window).scrollTop()));
    $("#div8").css("opacity",1-($(window).scrollTop()-4610)/900);
  }
  }
  });
$(window).scroll(function(){
  if(screen.width<=600){
    $("#div9").css("opacity",1-($(window).scrollTop()-5600)/900);
  }
  else{
    if($(this).scrollTop()<5240){
    $("#div9").css("left", (200));
  }
  else{
    $("#div9").css("left", (5240-$(window).scrollTop()));
    $("#div9").css("opacity",1-($(window).scrollTop()-5240)/900);
  }
  }
  });


});

