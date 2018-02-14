"use strict";
var s; // CanvasState
var player1;
var player2;
var ball;
var playerWidth = 20;
var playerHeight = 80;
var player1Color = "#FF0000";
var player2Color = "#0000FF";
var ballFillColor = "#000000";
var ballStrokeColor = "#000000";
var speed = 1.5;
var robotPlayer = false;
// var map = {};
var keys = {};
var gameStart = true;

function Ball(x, y, r, fill, stroke) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.fill = fill;
    this.stroke = stroke;
    this.dX = 1;
    this.dY = 0;
}

Ball.prototype.draw = function(ctx) {
    s.ctx.beginPath();
    s.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    s.ctx.fillStyle = this.fill;
    s.ctx.fill();
    s.ctx.strokeStyle = this.stroke;
    s.ctx.stroke();
};

function Shape(x, y, width, height, fill) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = fill;
}

Shape.prototype.draw = function(ctx) {
    s.ctx.fillStyle = this.fill;
    s.ctx.fillRect(this.x, this.y, this.width, this.height);
};

function CanvasState(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext("2d");
}

CanvasState.prototype.clear = function() {
    s.ctx.clearRect(0, 0, this.width, this.height);
};

function updatePlayer(player) {

    if (player.y + player.height >= s.height - 5) {
        player.y = s.height - 5 - player.height;
    } else if (player.y <= 5) {
        player.y = 5;
    }

    player.draw();
}

function resetBall(ball) {
    ball.x = s.width / 2;
    ball.y = s.height / 2;
    ball.r = 10;
    ball.draw();
}

function gameReset(ball) {
    resetBall(ball);
    gameStart = true;
    speed = 1.5;
    ball.dX = 1;
    ball.dY = 0;
}

function vsBot() {
    robotPlayer = true;

}
function updateBall(ball) {

    // Handling of bounce form top and bottom walls
    if (ball.y + ball.r > s.height || ball.y - ball.r < 0) {
        ball.dY = -ball.dY;
    }

    // Handling of ball reaching right wall
    if (ball.x + ball.r > s.width) {

        document.getElementById("player2-score").innerHTML++;
        gameReset(ball);
        return;

    } else if (ball.x - ball.r < 0) {
        document.getElementById("player1-score").innerHTML++;
        gameReset(ball);
        return;
    }

    // Handling of bounce from right piece
    if (ball.x + ball.r > player1.x) {

        // Handling of bounce from right piece
            if (ball.y + ball.r > player1.y + player1.height / 2 && ball.y < player1.y + player1.height) {
                console.log("bottom");
                ball.dX = -ball.dX;
                ball.dY += (ball.y - (player1.y + player1.height / 2)) / 40;
            } else if ((ball.y + ball.r) <= player1.y + player1.height / 2 && ball.y > player1.y) {
                console.log("top");
                ball.dX = -ball.dX;
                ball.dY -= ((player1.y + player1.height / 2) - (ball.y + ball.r)) / 40;
            }
    }

    // Handling of bounce from left piece
    if (ball.x - ball.r < player2.x + player2.width) {

            if (ball.y > player2.y + player2.height / 2 && ball.y < player2.y + player2.height) {
                console.log("bottom");
                ball.dX = -ball.dX;
                ball.dY += (ball.y - (player2.y + player2.height / 2)) / 40;
            } else if (ball.y <= player2.y + player2.height / 2 && ball.y > player2.y) {
                ball.dX = -ball.dX;
                ball.dY -= ((player2.y + player2.height / 2) - ball.y) / 40;
            }
    }

    if (gameStart) {
       if (Math.random() > 0.5) {
        ball.dX = -ball.dX;
    }
    gameStart = false;
}

ball.x += ball.dX * speed;
ball.y += ball.dY * speed;

speed += 0.0005;
document.getElementById("ball-speed").innerHTML = speed;


ball.draw();
}

window.onload = function() {
    s = new CanvasState(document.getElementById("canvas"));

    player1 = new Shape(s.width - 40, s.height / 2 - playerHeight / 2, playerWidth, playerHeight, player2Color);
    player2 = new Shape(20, s.height / 2 - playerHeight / 2, playerWidth, playerHeight, player1Color);
    ball = new Ball(s.width / 2, s.height / 2, 10, ballFillColor, ballStrokeColor);

    player1.draw(s.ctx);
    player2.draw(s.ctx);
    ball.draw(s.ctx);

    /* EVENT LISTENERS */

    document.body.addEventListener("keydown", function(e) {
        keys[e.key] = true;
    });
    document.body.addEventListener("keyup", function(e) {
        keys[e.key] = false;
    });

    setInterval(update, 10);
};

function update() {
    // console.log("launching");
    var speed = 3;


    if (keys.ArrowDown) {
        if (!robotPlayer) { player1.y += speed };
        if (keys.s) {
            player2.y += speed;
        } else if (keys.w) {
            player2.y -= speed;
        }
    } else if (keys.ArrowUp) {
        if (!robotPlayer) { player1.y -= speed; };
        if (keys.w) {
            player2.y -= speed;
        } else if (keys.s) {
            player2.y += speed;
        }
    } else if (keys.w) {
        player2.y -= speed;
    } else if (keys.s) {
        player2.y += speed;
    }

    if (robotPlayer) {
        moveAI(ball);
    }

    s.clear();
    updatePlayer(player1);
    updatePlayer(player2);

    updateBall(ball);
}

function resetScores() {
    document.getElementById("player2-score").innerHTML = 0;
    document.getElementById("player1-score").innerHTML = 0;
}

function moveAI() {
    resetScores();
    if (ball.y > player1.y + player1.height / 2) {
        player1.y += speed;
    } else {
        player1.y -= speed;
    }
}

function vsHuman() {
    robotPlayer = false;
}

function clearCanvas() {
    s.clear();
}

/* DEBUG */
window.onkeydown = function(e) {
    console.log("You pressed a key!");
    console.log("e.key = " + e.key);
};

window.onkeydown = function(e) {
    // console.log(player1.y);
};