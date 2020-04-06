//Stars and their attributes
var starCount;
var stars;
var maxSpeed = 10;

//Vortices
var vortexCount = 20;
var vortices;
var baseVortexMass = 10;
var vortexCriticalMass;
var currentPolarity = 0;

//System variables
var framerate = 60;
var currentFPS = 0;
var canvas;
var context;
var mousePos = new Vector(0, 0);

//Variables concerning gravity
var gravC = 20;
var starC = 4;

//Initializing functions
function init() {
	canvas = document.getElementById("screen");
	context = canvas.getContext("2d");
	onResize(null);

	setInterval(updateWorld, 1000 / framerate);
	setInterval(writeFramerate, 1000);

	canvas.addEventListener("click", onClick, false);
	canvas.addEventListener("mousemove", mouseMove, false);
	window.addEventListener("resize", onResize, false);
	document.getElementById("particles").addEventListener("input", particleChange, false);
	document.getElementById("positivePolarityButton").addEventListener("click", posPolarity, false);
	document.getElementById("negativePolarityButton").addEventListener("click", negPolarity, false);

	particleChange();
}

function generate() {
	stars = new Array(starCount);
	for(i=0; i<starCount; i++) {
		stars[i] = new Star();
	}
	vortices = new Array(vortexCount);
	for(i=0; i<vortexCount; i++) {
		vortices[i] = new Vortex(Vector(0, 0));
	}
}
//----------------------------------

//Action listener functions
function onResize(e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context = canvas.getContext("2d");
}

function mouseMove(e) {
	mousePos.set(e.clientX, e.clientY);
}

function particleChange(e) {
	var particles = document.getElementById("particles");
	document.getElementById("rangeValue").innerHTML = particles.value;
	starCount = particles.value;
	vortexCriticalMass = starCount;
	generate();
}

function onClick(e) {
	for(i=0; i<vortexCount; i++) {
		if(vortices[i].active && vortices[i].position.sub(mousePos).value() < vortices[i].radius) {
			vortices[i].collapse();
			return;
		}
	}
	addVortex();
}

function posPolarity(e) {
	currentPolarity = 0;
}

function negPolarity(e) {
	currentPolarity = 1;
}

function writeFramerate() {
	console.log(currentFPS + " FPS");
	currentFPS = 0;
}

//----------------------------------

function updateWorld() {
	context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	for(i=0; i<starCount; i++) {
		if(stars[i].active) {
			stars[i].update();
			stars[i].draw();
		}
	}
	for(j=0; j<vortexCount; j++) {
		if(vortices[j].active) {
			vortices[j].update();
			vortices[j].draw();
		}
	}
	currentFPS++;
}

function addVortex() {
	for(i=0; i<vortexCount; i++) {
		if(!vortices[i].active) {
			vortices[i].place(mousePos);
			break;
		}
	}
}

//Star class
function Star() {
	this.position = new Vector(Math.random() * canvas.width, Math.random() * canvas.height);
	this.velocity = new Vector(Math.random() * 2 * maxSpeed - maxSpeed, Math.random() * 2 * maxSpeed - maxSpeed);
	this.mass = 1;
	this.active = true;

	this.update = function() {
			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;
			if(this.position.x >= canvas.width || this.position.x <= 0)this.velocity.x = -this.velocity.x;
			if(this.position.y >= canvas.height || this.position.y <= 0)this.velocity.y = -this.velocity.y;
			//if(this.velocity.value() > maxSpeed)
			this.velocity = this.velocity.mult(0.99);

			for(j=0; j<vortexCount; j++) {
				if(vortices[j].active) {
					var tempVec = vortices[j].position.sub(this.position);
					var dist = tempVec.value();
					tempVec = tempVec.normalize().mult(1 / (dist * dist) * gravC * vortices[j].mass);
					if(vortices[j].polarity == 0){
						this.velocity = this.velocity.add(tempVec);
					}else if(vortices[j].polarity == 1){
						this.velocity = this.velocity.add(tempVec.mult(-2));
					}
					if(dist < vortices[j].radius && this.active) {
						vortices[j].mass += this.mass;
						//this.position = vortices[j].position;
						this.active = false;
					}
				}
			}
		};

	this.draw = function() {
			context.fillStyle = "#aaa";
			context.beginPath();
			context.arc(this.position.x, this.position.y, 1.5, 0, 2*Math.PI);
			context.fill();
		};
}
//----------------------------------

//Vortex class
function Vortex(v) {
	this.position = v;
	this.mass = baseVortexMass;
	this.active = false;
	this.radius = 10;
	this.polarity = 1;

	this.place = function(v) {
			this.position = new Vector(v.x, v.y);
			this.active = true;
			this.polarity = currentPolarity;
		};

	this.collapse = function() {
			for(i=0; i<starCount; i++) {
				if(this.position.sub(stars[i].position).value() < this.radius && !stars[i].active)stars[i].active = true;
			}
			this.mass = baseVortexMass;
			this.radius = 10;
			this.active = false;
		};

	this.update = function() {
			this.radius = this.mass / 10 + 10;
			if(this.mass > vortexCriticalMass)this.collapse();
		};

	this.draw = function() {
			var grad=context.createRadialGradient(this.position.x, this.position.y, 0, this.position.x, this.position.y, 1.43 * this.radius);
			if(this.polarity == 0){
				grad.addColorStop(0, "rgba(180, 180, 255, 1)");
				grad.addColorStop(0.7, "rgba(255, 255, 255, 1)");
				grad.addColorStop(1, "rgba(0, 0, 0, 0)");
			}else if(this.polarity == 1){
				grad.addColorStop(0, "rgba(255, 0, 0, 1)");
				grad.addColorStop(0.7, "rgba(255, 150, 150, 1)");
				grad.addColorStop(1, "rgba(0, 0, 0, 0)");
			}
			context.fillStyle = grad;
			context.beginPath();
			context.arc(this.position.x, this.position.y, 1.43 * this.radius, 0, 2*Math.PI);
			context.fill();
		};
}
//----------------------------------

//Vector class
function Vector(x, y) {
	this.x = x;
	this.y = y;

	this.set = function(x, y) {
			this.x = x;
			this.y = y;
		};

	this.add = function(v) {
			return new Vector(this.x + v.x, this.y + v.y);
		};

	this.sub = function(v) {
			return new Vector(this.x - v.x, this.y - v.y);
		};

	this.mult = function(f) {
			return new Vector(this.x * f, this.y * f);
		};

	this.value = function() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		};

	this.normalize = function() {
			var val = this.value();
			return new Vector((1/val) * this.x, (1/val) * this.y);
		};

	this.equals = function(v) {
			return (this.x == v.x && this.y == v.y);
		};
}
//----------------------------------