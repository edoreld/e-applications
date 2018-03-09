var oc,s;
var tool;
var sm;

/* UNDO */

// ctx.getImageData();
// ctx.putImageData();
// https://stackoverflow.com/questions/11268218/how-to-give-a-preview-for-the-line-tool

/* TOOL */
function Tool(tool) {
	this.tool = tool;
	this.tool.handleInput();
}

Tool.prototype.draw = function(x, y) {
	this.tool.draw(x, y);
};

/* PENCIL */
function Pencil() {
	var oldX;
	var oldY;
}

Pencil.prototype.draw = function(x, y) {
	s.ctx.beginPath();
	s.ctx.lineWidth = getThickness();
	s.ctx.strokeStyle = getColor();
	s.ctx.moveTo(x, y);
	s.ctx.lineTo(this.oldX, this.oldY)
	s.ctx.stroke();
	s.ctx.closePath();
};

Pencil.prototype.handleInput = function() {

	var x, y;

	var mouseDown = false;

	s.canvas.onmousedown = function(e) {
		x = e.clientX - s.x;
		y = e.clientY - s.y;
		tool.tool.oldX = x;
		tool.tool.oldY = y;
		mouseDown = true;
	};

	s.canvas.onmousemove = function(e) {
		if (mouseDown) {
			// Mouse coordinates are relative to the window, not the canvas!
			x = e.clientX - s.x;
			y = e.clientY - s.y;

			// tool.draw(x, y);
			tool.draw(x, y);

			tool.tool.oldX = x;
			tool.tool.oldY = y;

		}
	};

	s.canvas.onmouseup = function(e) {
		x = e.clientX - s.x;
		y = e.clientY - s.y;
		mouseDown = false;
		sm.save();
	};
};

/* LINE */

function Line() {
}

Line.prototype.draw = function(anchorX, anchorY, x, y) {
	s.ctx.beginPath();
	s.ctx.moveTo(anchorX, anchorY);
	s.ctx.lineTo(x,y);
	s.ctx.lineWidth = getThickness();
	s.ctx.strokeStyle = getColor();
	s.ctx.fillStyle = getColor();
	s.ctx.stroke();
};

Line.prototype.handleInput = function() {

	var coord = {};
	var anchor = {};
	var imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	var drawingPath = false;

	s.canvas.onmousedown = function(e) {
		anchor.x = e.clientX - s.x;
		anchor.y = e.clientY - s.y;
		drawingPath = true;
		imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	};

	s.canvas.onmousemove = function(e) {
		if (drawingPath) {
			coord.x = e.clientX - s.x;
			coord.y = e.clientY - s.y;
			clearCanvas();
			s.ctx.putImageData(imgData, 0, 0);
			tool.tool.draw(anchor.x, anchor.y, coord.x, coord.y);
		}
	};

	s.canvas.onmouseup = function(e) {
		drawingPath = false;
		sm.save();
	};
};

/* RECTANGLE */

function Rectangle() {
	s.ctx.fillStyle = "white";
}

Rectangle.prototype.draw = function(anchorX, anchorY, x, y) {
	s.ctx.lineWidth = getThickness();
	s.ctx.strokeStyle = getColor();
	s.ctx.strokeRect(anchorX, anchorY, x - anchorX, y - anchorY);
};

Rectangle.prototype.handleInput = function() {

	var coord = {};
	var anchor = {};
	var imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	var drawingSquare = false;

	s.canvas.onmousedown = function(e) {
		anchor.x = e.clientX - s.x;
		anchor.y = e.clientY - s.y;
		drawingSquare = true;
		imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	};

	s.canvas.onmousemove = function(e) {
		if (drawingSquare) {
			coord.x = e.clientX - s.x;
			coord.y = e.clientY - s.y;

			s.ctx.putImageData(imgData, 0, 0);
			tool.tool.draw(anchor.x, anchor.y, coord.x, coord.y);
		}
	};

	s.canvas.onmouseup = function(e) {
		drawingSquare = false;
		sm.save();
	};
};

/* CIRCLE */

function Circle() {
	s.ctx.fillStyle = "white";
}

Circle.prototype.draw = function(anchorX, anchorY, x, y) {

	s.ctx.lineWidth = getThickness();;
	var radiusX = (anchorX - x) > 0 ? anchorX - x : x - anchorX;
	var radiusY = (anchorY - y) > 0 ? anchorY - y : y - anchorY;
	// Math.hypot calculates the square root of the squares of its arguments, so
	// we can use that instead. I am leaving the more manual line to see exactly what's
	// happening
	// var radius = Math.hypot(anchorX - x, anchorY - y)
	// I used Photoshop as inspiration for how the cursor should be positioned in regard to
	// the circle
	var radius = 0.70 * Math.sqrt((anchorX - x)*(anchorX - x) + (anchorY - y)*(anchorY - y));

	s.ctx.beginPath();
	s.ctx.arc(anchorX, anchorY, radius, 0, 2 * Math.PI);
	s.ctx.stroke();

};

Circle.prototype.handleInput = function() {

	var coord = {};
	var anchor = {};
	var imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	var drawingSquare = false;

	s.canvas.onmousedown = function(e) {
		anchor.x = e.clientX - s.x;
		anchor.y = e.clientY - s.y;
		drawingSquare = true;
		imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	};

	s.canvas.onmousemove = function(e) {
		if (drawingSquare) {
			coord.x = e.clientX - s.x;
			coord.y = e.clientY - s.y;

			s.ctx.putImageData(imgData, 0, 0);
			tool.tool.draw(anchor.x, anchor.y, coord.x, coord.y);
		}
	};

	s.canvas.onmouseup = function(e) {
		drawingSquare = false;
		sm.save();
	};
};

/* CANVAS */
function CanvasState(canvas) {
	this.boundingClientRect = canvas.getBoundingClientRect();
	this.x = this.boundingClientRect.x;
	this.y = this.boundingClientRect.y;
	this.canvas = canvas;
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext("2d");
}

CanvasState.prototype.clear = function() {
	s.ctx.clearRect(0, 0, this.width, this.height);
};

/* SAVE MANAGER */

function SaveManager() {
	this.saves = [];
	this.saveIndex = 0;
}

SaveManager.prototype.save = function() {
	this.saveIndex++;
	this.saves[this.saveIndex] = s.ctx.getImageData(0, 0, s.width, s.height);
	this.saves = this.saves.slice(0, this.saveIndex + 1);
};

SaveManager.prototype.load = function(index) {
	s.ctx.putImageData(this.saves[index], 0, 0);
}

SaveManager.prototype.undo = function undo() {
	if (this.saveIndex > 0)
	{
		this.load(this.saveIndex - 1);
		this.saveIndex--;
	}
}

SaveManager.prototype.redo = function redo() {
	if (this.saveIndex < this.saves.length - 1) {
		this.load(++this.saveIndex);
	}
}

/* TOOL MODES SETTING */

function setPencilMode() {
	tool = new Tool(new Pencil());
}

function setLineMode() {
	tool = new Tool(new Line());
}

function setRectangleMode() {
	tool = new Tool(new Rectangle());
}

function setCircleMode() {
	tool = new Tool(new Circle());
}

/* UTILS */

function clearCanvas() {
	s.ctx.putImageData(oc, 0, 0);
}

/* ELEMENT GETTERS */
function getColor() {
	return "#" + document.getElementById("selected-color").value;
}

function getThickness() {
	return document.getElementById("thickness").value;
}

function modifyThickness(value) {
	document.getElementById('thickness').value = parseInt(document.getElementById('thickness').value) + value;
}

window.onload = function(e) {
	s = new CanvasState(document.getElementById("canvas"));
	sm = new SaveManager();
	sm.saves[0] = s.ctx.getImageData(0, 0, s.width, s.height);
	setPencilMode();
};

// window.onmousemove = function(e) {
// 	// console.log('X: ' + (Number) (e.clientX - s.x) + ', Y:' + (Number) (e.clientY - s.y));
// }