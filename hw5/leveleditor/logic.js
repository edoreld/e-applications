var oc,s;
var tool;
var sm;
var xml;
var selected;



/* UNDO */
/* Works like the same feature in Photoshop */

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

/* RECTANGLE */

function Rectangle() {
	s.ctx.fillStyle = "white";
}

Rectangle.draw = function(anchorX, anchorY, x, y, color) {
	// s.ctx.strokeStyle = color;
	// s.ctx.strokeRect(anchorX, anchorY, x - anchorX, y - anchorY);

	// s.ctx.fillStyle = color;

	s.ctx.strokeStyle = color;

	s.ctx.lineWidth = 3;

	s.ctx.strokeRect(anchorX, anchorY, x - anchorX, y - anchorY);
};

Rectangle.prototype.handleInput = function() {

	var coord = {};
	var anchor = {};
	var imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	var drawingSquare = false;
	var squareDrawn = false;
	var color, thickness;
	var mouseMoved;

	s.canvas.onmousedown = function(e) {
		mouseMoved = false;
		color = getColor();
		thickness = getThickness();
		anchor.x = e.clientX - s.getX();
		anchor.y = e.clientY - s.getY();
		drawingSquare = true;
		imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	};

	s.canvas.onmousemove = function(e) {
		if (drawingSquare) {
			mouseMoved = true;
			coord.x = e.clientX - s.getX();
			coord.y = e.clientY - s.getY();

			s.ctx.putImageData(imgData, 0, 0);
			Rectangle.draw(anchor.x, anchor.y, coord.x, coord.y, color, thickness);
			squareDrawn = true;
		}
	};

	s.canvas.onmouseup = function(e) {
		drawingSquare = false;
		// startX, startY, strokeStyle, lineWidth, endX, endY

		if (mouseMoved) {
			sm.save();

			coord.x = e.clientX - s.getX();
			coord.y = e.clientY - s.getY();

			xml.addAction('brick', anchor.x, anchor.y, getColor(), coord.x, coord.y);
		}
	};
};

/* LINE */

function Line() {
}

Line.draw = function(anchorX, anchorY, x, y, color) {
	s.ctx.strokeStyle = color;
	s.ctx.fillStyle = color;
	s.ctx.lineWidth = 3;
	s.ctx.beginPath();
	s.ctx.moveTo(anchorX, anchorY);
	s.ctx.lineTo(x,y);
	s.ctx.stroke();
	s.ctx.closePath();
};

Line.prototype.handleInput = function() {

	var coord = {};
	var anchor = {};
	var imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	var drawingPath = false;
	var color, thickness;
	var mouseMoved;

	s.canvas.onmousedown = function(e) {
		mouseMoved = false;
		color = getColor();
		thickness = getThickness();
		anchor.x = e.clientX - s.getX();
		anchor.y = e.clientY - s.getY();
		drawingPath = true;
		imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	};

	s.canvas.onmousemove = function(e) {
		if (drawingPath) {
			mouseMoved = true;
			coord.x = e.clientX - s.getX();
			coord.y = e.clientY - s.getY();
			s.ctx.putImageData(imgData, 0, 0);
			Line.draw(anchor.x, anchor.y, coord.x, coord.y, color);
		}
	};

	s.canvas.onmouseup = function(e) {
		drawingPath = false;

		if (mouseMoved) {
			sm.save();
			coord.x = e.clientX - s.getX();
			coord.y = e.clientY - s.getY();


			xml.addAction('wall', anchor.x, anchor.y, getColor(), coord.x, coord.y);
		}
	};
};

/* CIRCLE */

function Circle() {
	s.ctx.fillStyle = "white";
}

Circle.draw = function(anchorX, anchorY, x, y, color, thickness) {
	// s.ctx.strokeStyle = color;
	s.ctx.lineWidth = thickness;
	s.ctx.fillStyle = color;

	var radiusX = (anchorX - x) > 0 ? anchorX - x : x - anchorX;
	var radiusY = (anchorY - y) > 0 ? anchorY - y : y - anchorY;
	// Math.hypot calculates the square root of the squares of its arguments, so
	// we can use that instead. I am leaving the more manual line to see exactly what's
	// happening
	// var radius = Math.hypot(anchorX - x, anchorY - y)
	// I used Photoshop as inspiration for how the cursor should be positioned in regard to
	// the circle
	var radius = Math.sqrt((anchorX - x)*(anchorX - x) + (anchorY - y)*(anchorY - y));


	s.ctx.beginPath();
	s.ctx.arc(anchorX, anchorY, radius, 0, 2 * Math.PI);
	// s.ctx.stroke();
	s.ctx.fill();

};

Circle.prototype.handleInput = function() {

	var coord = {};
	var anchor = {};
	var imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	var drawingSquare = false;
	var mouseMoved;
	var color, thickness;

	s.canvas.onmousedown = function(e) {
		color = getColor();
		thickness = getThickness();
		mouseMoved = false;
		anchor.x = e.clientX - s.getX();
		anchor.y = e.clientY - s.getY();
		drawingSquare = true;
		imgData = s.ctx.getImageData(0, 0, s.width, s.height);
	};

	s.canvas.onmousemove = function(e) {
		if (drawingSquare) {
			mouseMoved = true;
			coord.x = e.clientX - s.getX();
			coord.y = e.clientY - s.getY();

			s.ctx.putImageData(imgData, 0, 0);
			Circle.draw(anchor.x, anchor.y, coord.x, coord.y, color, thickness);
		}
	};

	s.canvas.onmouseup = function(e) {
		drawingSquare = false;

		if (mouseMoved) {
			sm.save();

			coord.x = e.clientX - s.getX();
			coord.y = e.clientY - s.getY();


			xml.addCircle(anchor.x, anchor.y, color, thickness, coord.x, coord.y);
		}
	};
};

/* CANVAS */
function CanvasState(canvas) {
	this.boundingClientRect = canvas.getBoundingClientRect();
	this.canvas = canvas;
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext("2d");
}

CanvasState.prototype.clear = function() {
	s.ctx.clearRect(0, 0, this.width, this.height);
};

CanvasState.prototype.getX = function() {
	this.boundingClientRect = canvas.getBoundingClientRect();
	return this.boundingClientRect.x;
}

CanvasState.prototype.getY = function() {
	this.boundingClientRect = canvas.getBoundingClientRect();
	return this.boundingClientRect.y;
}

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

/*  = EXAMPLES =

<action type="line" startX="421" startY="99" strokeStyle="yellow" lineWidth="5" endX="418" endY="199" ></action>

<action type="rect" startX="48" startY="68" strokeStyle="black" lineWidth="5" endX="482" endY="234" ></action>

<action type="cycle" startX="236" startY="305" strokeStyle="black" lineWidth="5" endX="288" endY="334" ></action>

<action type="pen" startX="352" startY="100" strokeStyle="green" lineWidth="5">
<point index="0" x="351" y="100" />
</action>

*/

/* XML DOC */

function documentXML() {
	this.doc = document.getElementById("action-history");
	this.xmlString = '';
	this.width = 500;
	this.height = 500;
}

var fullXMLString;

documentXML.prototype.getXML = function(){
	var parser = new DOMParser();
	if (!unsanitizeText(this.xmlString).startsWith('<arkanoidlevel>')) {
		fullXMLString = '<arkanoidlevel>' + unsanitizeText(this.xmlString) + '</arkanoidlevel>';
	} else {
		fullXMLString = unsanitizeText(this.xmlString);
	}
	return parser.parseFromString(fullXMLString, "text/xml");
};

documentXML.prototype.getString = function(xml) {
	serializer = new XMLSerializer();
	return serializer.serializeToString(xml);
};

documentXML.prototype.update = function() {
	if (!this.xmlString.startsWith('&lt;arkanoidlevel') && !this.xmlString.startsWith('<arkanoidlevel>')) {
		this.doc.innerHTML = '&lt;arkanoidlevel width="' + this.width + '" height="' + this.height + '"><br />' + sanitizeText(this.xmlString) + '&lt;/arkanoidlevel>';
	} else {
		this.doc.innerHTML = sanitizeText(this.xmlString);
	}
}

documentXML.prototype.clear = function() {
	this.xmlString = "";
	this.update();
}

documentXML.prototype.addAction = function(type, startX, startY, strokeStyle, endX, endY){

	var aux;

	switch (type) {
		case 'brick':
			aux = this.addBrick(startX, startY,strokeStyle,endX,endY);
			break;
		case 'wall':
			aux = this.addWall(startX, startY, strokeStyle, endX, endY);
			break;
	}

	aux += ' /><br />';

	this.xmlString += aux;
	this.update();
};

documentXML.prototype.addBrick = function(left, topN, color, right, bottom) {
	return '<brick color="' + color + '" left="' + left + '" top="' + topN + '" right="' + right + '" bottom="' + bottom + '"';

}

documentXML.prototype.addWall = function(left, topN ,color, right, bottom) {
	return '<wall color="' + color + '" left="' + left + '" top="' + topN + '" right="' + right + '" bottom="' + bottom + '"';
}

documentXML.prototype.endAction = function() {
	this.xmlString += "&lt;/action><br />";
	this.update();
}

documentXML.prototype.addPen  = function(startX, startY, strokeStyle, lineWidth)
{
	this.addAction("pen", startX, startY, strokeStyle, lineWidth, null, null);
};

documentXML.prototype.addPoint = function(index, x, y) {
	// <point index="37" x="178" y="112" />
	var aux = '<point index="' + index + '" x="' + x + '" y="' + y + '" />';
	this.xmlString += sanitizeText(aux) + '<br />';
	this.update();
};



documentXML.prototype.addLine = function(startX, startY, strokeStyle, lineWidth, endX, endY) {
	this.addAction("line", startX, startY, strokeStyle, lineWidth, endX, endY);
}

documentXML.prototype.addCircle = function(startX, startY, strokeStyle, lineWidth, endX, endY) {
	this.addAction("cycle", startX, startY, strokeStyle, lineWidth, endX, endY);
}

var match;
documentXML.prototype.selectAction = function(x, y) {
	// console.log("Selecting...");
	XML = this.getXML();
	xmlDoc = XML.childNodes[0].getElementsByTagName('action');
	match = null;

	for (var i = xmlDoc.length - 1 ; i >= 0; i--) {
		type = xmlDoc[i].attributes[0].value;

		switch (type) {
			case 'pen':
			match = this.getMatchPen(xmlDoc[i], x, y);
			break;
			case 'line':
			match = this.isCursorWithinLine(xmlDoc[i], x, y);
			break;
			case 'rect':
			match = this.isCursorWithinRectangle(xmlDoc[i], x, y);
			break;
			case 'cycle':
			match = this.isCursorWithinCircle(xmlDoc[i], x, y);
			break;
		}

		if (match != null) {

			this.xmlString = this.getString(XML);
			// this.update();
			selected = i;
			return match;
		}

	}

	return null;
}


documentXML.prototype.getMatchPen = function(node, x, y) {
	// oldX = parseInt(node.attributes[1].value);
	// oldY = parseInt(node.attributes[2].value);
	stroke = node.attributes[3].value;
	thickness = parseInt(node.attributes[4].value);

	// console.log("Thickness: " + thickness)

	points = node.getElementsByTagName('point');
	for (var i = 0 ; i < points.length ; i++) {
		pointX = parseInt(points[i].attributes[1].value);
		pointY = parseInt(points[i].attributes[2].value);

		if (this.matchingCoords(pointX, pointY, x, y, thickness)) {
			return node;
		}
	}

	return null;
}


documentXML.prototype.matchingCoords = function(oldX, oldY, x, y, thickness){
	var tolerance = parseInt(thickness) + parseInt(4);



	if (Math.abs(x - oldX) <= tolerance  && Math.abs(y - oldY) <= tolerance) {
		// console.log('Match');
		// console.log( "tolerance: " + tolerance);
		// console.log('x - nodeX = ' + Math.abs(x - oldX));
		// console.log('y - nodeY = ' + Math.abs(y - oldY));
		return true;
	}
	return false;
};

documentXML.prototype.isCursorWithinRectangle = function(node, x, y) {
	var aux;
	startX = node.attributes[1].value;
	startY = node.attributes[2].value;
	endX = node.attributes[5].value;
	endY = node.attributes[6].value;

	if (this.isCursorWithinRectangleAlt(startX, startY, endX, endY, x, y)) {
		return node;
	}
	return null;
}

documentXML.prototype.isCursorWithinRectangleAlt = function(startX, startY, endX, endY, x, y) {
	if (endX < startX) {
		aux = endX;
		endX = startX;
		startX = aux;
	}

	if (endY < startY) {
		aux = endY;
		endY = startY;
		startY = aux;
	}


	if ((x >= startX && x <= endX) && (y >= startY && y <= endY)) {

		return true;
	}

	return null;
}

documentXML.prototype.isCursorWithinCircle = function(node, x, y) {
	startX = node.attributes[1].value;
	startY = node.attributes[2].value;
	endX = node.attributes[5].value;
	endY = node.attributes[6].value;

	var radius = Math.hypot(Math.abs(endX - startX), Math.abs(endY - startY));

	var distSqr = Math.pow(startX - x, 2) + Math.pow(startY - y, 2);

	if (distSqr < radius * radius) {
		return node;
	}
	return null;

}

documentXML.prototype.isCursorWithinLine = function(node, x, y) {

	startX = node.attributes[1].value;
	startY = node.attributes[2].value;
	thickness = node.attributes[4].value;
	endX = node.attributes[5].value;
	endY = node.attributes[6].value;

	if (endX < startX) {
		aux = endX;
		endX = startX;
		startX = aux;
	}

	if (endY < startY) {
		aux = endY;
		endY = startY;
		startY = aux;
	}

	lineLength = distanceBetweenPoints(startX, startY, endX, endY);
	distanceFromPointToA = distanceBetweenPoints(startX, startY, x, y);
	distanceFromPointToB = distanceBetweenPoints(endX, endY, x, y);

	if (distanceFromPointToA + distanceFromPointToB <= lineLength + 5) {
		return node;
	}
	return null;
}

function distanceBetweenPoints(x1, y1, x2, y2) {
	return Math.hypot(x2 - x1, y2 - y1);
}



/* TOOL MODES SETTING */

function setPencilMode() {
	tool = new Tool(new Pencil());
}

function setWallMode() {
	setLineMode();
}
function setLineMode() {
	tool = new Tool(new Line());
}

function setBrickMode() {
	setRectangleMode();
}
function setRectangleMode() {
	tool = new Tool(new Rectangle());
}

function setCircleMode() {
	tool = new Tool(new Circle());
}

function setSelectMode() {
	tool = new Tool(new Select());
}
/* UTILS */

function clearCanvas() {
	s.ctx.putImageData(sm.saves[0], 0, 0);
	xml.clear();
}

/* ELEMENT GETTERS */
function getColor() {
	return document.getElementById("selected-color").value;
}

function getThickness() {
	return 3;
}

function modifyThickness(value) {
	document.getElementById('thickness').value = parseInt(document.getElementById('thickness').value) + value;
}

function sanitizeText(text) {

	return text.replace(/(?!<br )</g,'&lt;').trim();
}

function unsanitizeText(text) {
	return text.replace(/\&lt;/g, '<').trim();
}

function loadTest() {
	var fname = 'test.xml';

	xhttp = new XMLHttpRequest();
	xhttp.open("GET",fname,false);
	xhttp.send();

	return xhttp.responseXML.childNodes[0]
}

function load(){

	var fname = document.getElementById("filename").value;
	if (fname !== '') {
	clearCanvas();


	xhttp = new XMLHttpRequest();
	xhttp.open("GET",fname,false);
	xhttp.send();

	var actionHistory  = document.getElementById("action-history");

	displayFile(actionHistory, xhttp.responseXML.childNodes[0]);
	}
}

function loadXML(xml) {
	clearCanvas();

	var actionHistory  = document.getElementById("action-history");

	displayFile(actionHistory, xml);
}


function displayFile(actionHistory, xmlResponse) {
	actions = xmlResponse.getElementsByTagName('*');
	for (var i = 0 ; i < actions.length; i++) {
		draw(actionHistory, actions[i]);
	}
}

function draw(actionHistory, node) {
	tag = node.nodeName;
	if (tag !== 'brick' && tag !== 'wall') {
		return;
	}

	// console.log(node);

	drawDragAndDrop(tag, actionHistory, node);
}

function drawDragAndDrop(type, actionHistory, node) {
	color = node.attributes[0].value;
	left = node.attributes[1].value;
	topN = node.attributes[2].value
	right = node.attributes[3].value;
	bottom = node.attributes[4].value;

	// console.log(type);
	switch (type) {
		case "brick":
			Rectangle.draw(left, topN, right, bottom, color);
			break;
		case "wall":
			Line.draw(left, topN, right, bottom, color);
			break;
		default:
		console.log("type unrecognized, :-(");
		break;
	}
	// type, startX, startY, strokeStyle, endX, endY
	xml.addAction(type, left, topN, color, right, bottom);
}


var points;

function drawPencil(actionHistory, node) {
	startX = node.attributes[1].value;
	startY = node.attributes[2].value;
	strokeStyle = node.attributes[3].value;
	lineWidth = node.attributes[4].value;

	xml.addPen(startX, startY, strokeStyle, lineWidth);
	points = node.getElementsByTagName('point');
	for (var i = 0; i < points.length ; i++) {
		x = points[i].attributes[1].value;
		y = points[i].attributes[2].value;
		xml.addPoint(i, x, y);

		Pencil.draw(startX, startY, x, y, strokeStyle, lineWidth);


		startX = x;
		startY = y;
	}

	xml.endAction();
}

function increaseCanvasWidth() {
	document.getElementById('canvas').attributes[1].value = parseInt(document.getElementById('canvas').attributes[1].value) + 1;
	document.getElementById('x-canvas').value = parseInt(document.getElementById('x-canvas').value) + 1;
}

function increaseCanvasHeight() {
	document.getElementById('canvas').attributes[2].value = parseInt(document.getElementById('canvas').attributes[2].value) + 1;
	document.getElementById('y-canvas').value = parseInt(document.getElementById('y-canvas').value) + 1;
}



window.onload = function(e) {
	s = new CanvasState(document.getElementById("canvas"));
	sm = new SaveManager();
	sm.saves[0] = s.ctx.getImageData(0, 0, s.width, s.height);
	setBrickMode();
	selected = -1;

	xml = new documentXML();

	// startX, startY, strokeStyle, lineWidth, endX, endY

	xml.update();
};
	//https://stackoverflow.com/questions/349250/how-to-display-xml-in-javascript