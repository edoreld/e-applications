var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;
function reOffset(){
    var BB=canvas.getBoundingClientRect();
    offsetX=BB.left;
    offsetY=BB.top;
}
var offsetX,offsetY;
reOffset();
window.onscroll=function(e){ reOffset(); }
window.onresize=function(e){ reOffset(); }

var startX,startY;

var radius=5;
var nextLetter=65;
var anchors=[];
var connectors=[];
var draggingIndex=-1;
var fullDrag = null;
function addAnchor(x,y){
    anchors.push({
        label:String.fromCharCode(nextLetter),
        x:x,
        y:y,
    });
    nextLetter++;
}

draw();

$("#canvas").mousedown(function(e){handleMouseDown(e);});
$("#canvas").mousemove(function(e){handleMouseMove(e);});
$("#canvas").mouseup(function(e){handleMouseUpOut(e);});
$("#canvas").mouseout(function(e){handleMouseUpOut(e);});


function draw(){

    //
    ctx.clearRect(0,0,cw,ch);
    ctx.strokeStyle='black';
    // draw connecting lines
    for(var i=0;i<connectors.length;i++){
        var c=connectors[i];
        var s=anchors[c.start];
        var e=anchors[c.end];
        ctx.beginPath();
        ctx.moveTo(s.x,s.y);
        ctx.lineTo(e.x,e.y);
        ctx.stroke();
    }

    //draw lines
    if (anchors.length>0 && anchors.length%4>0){
       ctx.strokeStyle='gray';
       var al = anchors.length-1;
       var almod4 = al%4;
       if (almod4==1 || almod4==2){
       //draw extra line
           ctx.beginPath();
           ctx.moveTo(anchors[al-1].x,anchors[al-1].y);
           ctx.lineTo(mouseX,mouseY);
           ctx.stroke();
       }
       ctx.beginPath();
       ctx.moveTo(anchors[al].x,anchors[al].y);
       ctx.lineTo(mouseX,mouseY);
       ctx.stroke();
    }

    // draw circles
    for(var i=0;i<anchors.length;i++){
        ctx.beginPath();
        ctx.arc(anchors[i].x,anchors[i].y,radius,0,Math.PI*2);
        ctx.fill();
        ctx.fillText(anchors[i].label,anchors[i].x-5,anchors[i].y-15);
    }

}

function handleMouseDown(e){
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();

    startX=parseInt(e.clientX-offsetX);
    startY=parseInt(e.clientY-offsetY);

    draggingIndex=-1;
    for(var i=0;i<anchors.length;i++){
        var a=anchors[i];
        var dx=startX-a.x;
        var dy=startY-a.y;
        if(dx*dx+dy*dy<radius*radius){
            draggingIndex=i;
            break;
        }
    }

    //Detect if we're on a line:
    fullDrag = mouseOnLine({x:startX, y: startY});

    // If a drag hasn't started, add another anchor here
    if(draggingIndex==-1 && fullDrag == null){
        addAnchor(startX,startY);
        var al = anchors.length-1;
        var almod4 = al%4;
        if(almod4==1){
            connectors.push({start:al-1,end:al});
        }
        if(almod4==2){
            connectors.push({start:al-2,end:al});
            connectors.push({start:al-1,end:al});
        }
        if(almod4==3){
            connectors.push({start:al-2,end:al});
            connectors.push({start:al-1,end:al});
        }
        draw();
    }

}

function handleMouseUpOut(e){
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();

    mouseX=parseInt(e.clientX-offsetX);
    mouseY=parseInt(e.clientY-offsetY);

    draggingIndex=-1;
    fullDrag = null;
}


function handleMouseMove(e){

    //if(draggingIndex<0 && fullDrag == null){return;}
	mouseX=parseInt(e.clientX-offsetX);
    mouseY=parseInt(e.clientY-offsetY);

    if (draggingIndex >= 0) {
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();

        var a=anchors[draggingIndex];
        a.x+=(mouseX-startX);
        a.y+=(mouseY-startY);
        startX=mouseX;
        startY=mouseY;
    } else if (fullDrag != null) {

        var startPoints = Math.floor(fullDrag.start / 4) * 4;

        for (var i = 0; i < 4; i++) {
        	anchors[startPoints+i].x +=(mouseX-startX);
            anchors[startPoints+i].y +=(mouseY-startY);
        }

        startX=mouseX;
        startY=mouseY;
    }
    draw();
}

function mouseOnLine(mousePos) {

    for (var i = 0 ; i < connectors.length; i++){
    	var pA = anchors[connectors[i].start];
        var pB = anchors[connectors[i].end];

        var first = distanceBetween(pA,mousePos) + distanceBetween(pB,mousePos);
        var second = distanceBetween(pA,pB);
        if (Math.abs(first - second) < 0.3)
            return connectors[i];

    }

    return null;
}

var distanceBetween = function (point1, point2) {

    var distX = Math.abs( point1.x - point2.x);
    var distY = Math.abs(point1.y - point2.y);
    return Math.sqrt((distX * distX) + (distY * distY));
}