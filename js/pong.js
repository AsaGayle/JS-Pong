// Global variables
// WIDTH and HEIGHT of canvas
var WIDTH = 700, HEIGHT = 600;
var pi = Math.PI; //Global PI variable
var canvas, ctx, keystate;
var player, ai, ball;

// UpArrow and DownArrow set to equivalent keyboard key values
var UpArrow = 38, DownArrow = 40;

//player object
//player controlled object using the up and down arrows
player = {
    // Object initial position set to null.
    // Start position handled by draw method
    x: null,
    y: null,
    width: 20,
    height: 100,

    // moves player object by changing y position depending
    // on keystate (UpArrow or DownArrow value equivalent)
    update: function () {
        "use strict";
        if (keystate[UpArrow]) { this.y -= 7; }
        if (keystate[DownArrow]) { this.y += 7; }
    },
    // function initializes object placement (this.x/y) as
    // and draws it in start position.
    draw: function () {
        "use strict";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

//ai object
ai = {
    // Object initial position set to null.
    // Start position handled by draw method
    x: null,
    y: null,
    width: 20,
    height: 100,

    update: function () {
        'use strict';
        // destination = placement of ai paddle
        // ai paddle follows ball slowly to make it beatable
        var destination = ball.y - (this.height -ball.side)*0.5
        this.y += (destination - this.y) * 0.075;
    },
    // function initializes object placement (this.x/y) as
    // and draws it in start position.
    draw: function () {
        'use strict';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

//ball object
ball = {
    // Object initial position set to null.
    // Start position handled by draw method
    x: null,
    y: null,
    vel: null, //Ball velocity
    side: 20,
    speed: 10,

    update: function () {
        'use strict';
        this.x += this.vel.x;
        this.y += this.vel.y;

        // If the ball's y is less than 0
        // or any of its sides + y are greater than
        // HEIGHT reverse velocity via (this.vel.y) *= -1;
        if(this.y < 0 || this.y + this.side > HEIGHT){
            var offsety = this.vel.y < 0 ? 0 - this.y : HEIGHT - (this.y+this.side);
            this.y += 2*offsety;
            this.vel.y *= -1;
        };

        // HIT DETECTION function

        // KEY: p = paddle  x/y = x and y  positions of object
        //      b = ball    w/h = width and height of object

        // Take the current position of the paddle it comes close to (px, py, pw, ph)
        // and the position and dimensions of the ball (bx, by, bw, bh) and returns true
        // when in contact with player object (when all statements in return are true)
        var hitDetect = function(px, py, pw, ph, bx, by, bw, bh) {
            return px < bx+bw && py < by+bh && bx < px+pw && by < py+ph;
        };

        var paddle = this.vel.x < 0 ? player : ai;
        if(hitDetect(paddle.x, paddle.y, paddle.width, paddle.height,
          this.x, this.y, this.side, this.side)
            )
          {
              this.x = paddle===player ? player.x+player.width : ai.x - this.side;
              var paddle_pos = (this.y+this.side - paddle.y)/(paddle.height+this.side);
              var ball_angle = 0.25*pi*(2*paddle_pos -1); // pi/4 = 45 degrees
              this.vel.x = (paddle === player ? 1 : -1)*this.speed*Math.cos(ball_angle);
              this.vel.y = this.speed*Math.sin(ball_angle);
          };
    },
    draw: function () {
        'use strict';
        ctx.fillRect(this.x, this.y, this.side, this.side);
    }
};

//main function
function main() {
    'use strict';
    canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    keystate = {};
    document.addEventListener("keydown", function (evt) {
        keystate[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function (evt) {
        delete keystate[evt.keyCode];
    });

    init();

    var loop = function () {
        update();
        draw();

        window.requestAnimationFrame(loop, canvas);
    };
    window.requestAnimationFrame(loop, canvas);

}

//initialize function
// Sets ball and paddle positions at the start
// of main
function init() {
    'use strict';
    player.x = player.width;
    player.y = (HEIGHT - player.height) / 2;

    ai.x = WIDTH - (player.width + ai.width);
    ai.y = (HEIGHT - ai.height) / 2;

    ball.x = (WIDTH - ball.side) / 2;
    ball.y = (HEIGHT - ball.side) / 2;

    ball.vel = {
        x:0,
        y: 0,
        x: ball.speed
    }
}

function update() {
    'use strict';
    ball.update();
    player.update();
    ai.update();
}

function draw() {
    'use strict';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.save();

    ctx.fillStyle = "#fff";

    ball.draw();
    player.draw();
    ai.draw();

    var w = 4;
    var draw_x = (WIDTH - w) * 0.5;
    var draw_y = 0;
    var step = HEIGHT / 45;
    while (draw_y < HEIGHT) {
        ctx.fillRect(draw_x, draw_y + step * 0.25, w, step * 0.5);
        draw_y += step;
    }
    ctx.restore();
}

main();
