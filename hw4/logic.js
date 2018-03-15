var oc,s;
var tool;
var sm;
var xml;



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

/* SELECT */

function Select() {

}

Select.prototype.handleInput = function() {

	var mouseDown = false;
	var selectedNode;

	s.canvas.onmousedown = function(e) {

		mouseDown = true;

		x = e.clientX - s.getX();
		y = e.clientY - s.getY();

		var node = xml.selectAction(x, y);
		// select piece that matches most closely the mouse coordinates
		// modify the appearance of this piece so we know it's selected
	}

	s.canvas.onmousemove = function(e) {
		if (mouseDown === true) {

		}
		// the following lines might be out of order

		// move the piece following the mouse position
		// update the xml document

	}

	s.canvas.onmouseup = function(e) {
		mouseDown = false;
		// stop selecting
		// revert piece back to original lineWidth and strokeStyle if changed
	}
}

/* PENCIL */
function Pencil() {
}

Pencil.draw = function(oldX, oldY, x, y, color, thickness) {
	Line.draw(oldX, oldY, x, y, color, thickness);
};

Pencil.prototype.handleInput = function() {

	var x, y;
	var i;
	var mouseDown = false;
	var oldX, oldY;
	var color, thickness;
	var mouseMoved;
	var firstPoint = false;


	s.canvas.onmousedown = function(e) {
		color = getColor();
		thickness = getThickness();
		mouseMoved = false;
		firstPoint = true;
		x = e.clientX - s.getX();
		y = e.clientY - s.getY();
		oldX = x;
		oldY = y;
		mouseDown = true;
		i = 0;
	};

	s.canvas.onmousemove = function(e) {
		if (mouseDown) {
			if (firstPoint) {
				xml.addPen(oldX, oldY, color, thickness);
				xml.addPoint(i++, x, y);
				firstPoint = false;
			}
			mouseMoved = true;

			x = e.clientX - s.getX();
			y = e.clientY - s.getY();

			xml.addPoint(i++, x, y);
			// Mouse coordinates are relative to the window, not the canvas!


			// tool.draw(x, y);
			Pencil.draw(oldX, oldY, x, y, color, thickness);

			oldX = x;
			oldY = y;

		}
	};

	s.canvas.onmouseup = function(e) {
		mouseDown = false;

		if (mouseMoved) {
			sm.save();
			xml.endAction();
		}
	};
};

/* LINE */

function Line() {
}

Line.draw = function(anchorX, anchorY, x, y, color, thickness) {
	s.ctx.strokeStyle = color;
	s.ctx.fillStyle = color;
	s.ctx.lineWidth = thickness;
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
			Line.draw(anchor.x, anchor.y, coord.x, coord.y, color, thickness);
		}
	};

	s.canvas.onmouseup = function(e) {
		drawingPath = false;

		if (mouseMoved) {
			sm.save();
			coord.x = e.clientX - s.getX();
			coord.y = e.clientY - s.getY();


			xml.addLine(anchor.x, anchor.y, getColor(), getThickness(), coord.x, coord.y);
		}
	};
};

/* RECTANGLE */

function Rectangle() {
	s.ctx.fillStyle = "white";
}

Rectangle.draw = function(anchorX, anchorY, x, y, color, thickness) {
	// s.ctx.strokeStyle = color;
	// s.ctx.strokeRect(anchorX, anchorY, x - anchorX, y - anchorY);

	s.ctx.fillStyle = color;
	s.ctx.lineWidth = thickness;

	s.ctx.fillRect(anchorX, anchorY, x - anchorX, y - anchorY);
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

			xml.addRect(anchor.x, anchor.y, getColor(), getThickness(), coord.x, coord.y);
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
	var radius = 0.70 * Math.sqrt((anchorX - x)*(anchorX - x) + (anchorY - y)*(anchorY - y));


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
}

documentXML.prototype.getString = function(xml) {
	serializer = new XMLSerializer();
	return serializer.serializeToString(xml);
};

documentXML.prototype.update = function() {
	this.doc.innerHTML = '&lt;picture><br />' + this.xmlString + '&lt;/picture>';
}

documentXML.prototype.addAction = function(type, startX, startY, strokeStyle, lineWidth, endX, endY){

	var aux = '<action type="' + type + '" startX="' + startX + '" startY="' + startY + '" strokeStyle="' + strokeStyle + '" lineWidth="' + lineWidth + '"';

	if (endX != null && endY != null) {
		aux += ' endX="' + endX + '" endY="' + endY + '">';
		aux += "</action>"
	} else {
		aux+= ">";
	}

	aux = '\t' + sanitizeText(aux) + '<br />';

	this.xmlString += aux;
	this.update();
};

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

documentXML.prototype.addRect = function(startX, startY, strokeStyle, lineWidth, endX, endY) {
	this.addAction("rect", startX, startY, strokeStyle, lineWidth, endX, endY);
}

documentXML.prototype.addCircle = function(startX, startY, strokeStyle, lineWidth, endX, endY) {
	this.addAction("cycle", startX, startY, strokeStyle, lineWidth, endX, endY);
}

var fullXMLString;

documentXML.prototype.getXML = function(){
	var parser = new DOMParser();
	fullXMLString = '<picture>' + unsanitizeText(this.xmlString) + '</picture>';
	return parser.parseFromString(fullXMLString, "text/xml");
};

documentXML.prototype.selectAction = function(x, y) {
	xmlDoc = this.getXML().childNodes[0].getElementsByTagName('action');
	var match;

	for (var i = 0 ; i < xmlDoc.length; i++) {
		type = xmlDoc[i].attributes[0].value;

		switch (type) {
			case 'pen':
				match = this.getMatchPen(xmlDoc[i], x, y);
				break;
			default:
				isMatch = this.isMatch(xmlDoc[i], x, y)
		}
	}

	if (match) {
		this.selectNode(match);
		return match;
	}
	return null;
}


documentXML.prototype.getMatchPen = function(node, x, y) {
	// oldX = parseInt(node.attributes[1].value);
	// oldY = parseInt(node.attributes[2].value);
	stroke = node.attributes[3].value;
	thickness = node.attributes[4].value;

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
	var tolerance = thickness + 2;

	if (Math.abs(x - oldX) <= tolerance && Math.abs(y - oldY) <= tolerance) {
		console.log('Match');
		console.log('x - nodeX = ' + Math.abs(x - oldX));
		console.log('y - nodeY = ' + Math.abs(y - oldY));
		return true;
	} else {
		console.log('No Match');
		console.log('x - nodeX: ' + Math.abs(x - oldX));
		console.log('y - nodeY: ' + Math.abs(y - oldY));
	}
	return false;
};

documentXML.prototype.isMatch = function(node, x, y) {
	nodeX = node.attributes[1].value;
	nodeY = node.attributes[2].value;

	if (Math.abs(x - nodeX) <= 3 && Math.abs(y - nodeY <= 3)) {
		console.log('match');
		return true;
	} else {
		console.log('x - nodeX: ' + Math.abs(x - nodeX));
		console.log('y - nodeY: ' + Math.abs(y - nodeY));
	}
	return false;
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

function setSelectMode() {
	tool = new Tool(new Select());
}
/* UTILS */

function clearCanvas() {
	s.ctx.putImageData(sm.saves[0], 0, 0);
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

function sanitizeText(text) {

	return text.replace(/\</g,'&lt;').trim();
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

	xhttp = new XMLHttpRequest();
	xhttp.open("GET",fname,false);
	xhttp.send();

	var actionHistory  = document.getElementById("action-history");

	displayFile(actionHistory, xhttp.responseXML.childNodes[0]);
}


function displayFile(actionHistory, xmlResponse) {
	actions = xmlResponse.getElementsByTagName('action');
	for (var i = 0 ; i < actions.length; i++) {
		draw(actionHistory, actions[i]);
	}
}

function draw(actionHistory, node) {
	type = node.attributes[0].value;

	console.log(node);

	if (type === "cycle" || type === "rect" || type === "line") {
		drawDragAndDrop(type, actionHistory, node);
	}
	else if (type === "pen") {
		drawPencil(actionHistory, node);
	}
}


var points;
function drawPencil(actionHistory, node) {
	startX = node.attributes[1].value;
	startY = node.attributes[2].value;
	strokeStyle = node.attributes[3].value;
	lineWidth = node.attributes[4].value;

	points = node.getElementsByTagName('point');
	for (var i = 0; i < points.length ; i++) {
		x = points[i].attributes[1].value;
		y = points[i].attributes[2].value;

		Pencil.draw(startX, startY, x, y, strokeStyle, lineWidth);

		startX = x;
		startY = y;
	}



}

function drawDragAndDrop(type, actionHistory, node) {
	startX = node.attributes[1].value;
	startY = node.attributes[2].value;
	strokeStyle = node.attributes[3].value;
	lineWidth = node.attributes[4].value;
	endX = node.attributes[5].value;
	endY = node.attributes[6].value;

	console.log(type);
	switch (type) {
		case "rect":
		Rectangle.draw(startX, startY, endX, endY, strokeStyle, lineWidth);
		break;
		case "cycle":
		Circle.draw(startX, startY, endX, endY, strokeStyle, lineWidth);
		break;
		case "line":
		Line.draw(startX, startY, endX, endY, strokeStyle, lineWidth);
		break;
		default:
		console.log("type unrecognized, :-(");
		break;
	}
}

window.onload = function(e) {
	s = new CanvasState(document.getElementById("canvas"));
	sm = new SaveManager();
	sm.saves[0] = s.ctx.getImageData(0, 0, s.width, s.height);
	setPencilMode();

	xml = new documentXML();

	// startX, startY, strokeStyle, lineWidth, endX, endY

	xml.update();
};
	//https://stackoverflow.com/questions/349250/how-to-display-xml-in-javascript