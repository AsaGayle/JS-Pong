// WIDTH and HEIGHT of canvas 
var WIDTH = 700, HEIGHT = 600;
var pi = Math.PI;
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
    speed: 5,
    
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
        if(this.x < 0 || this.x + this.side > WIDTH){
            var offsetx = this.vel.x < 0 ? 0 - this.x : WIDTH - (this.x+this.side);
            this.x += 2*offsetx;
            this.vel.x += -1;
        }
    },
    draw: function () {
        'use strict';
        ctx.fillRect(this.x, this.y, this.side, this.side);
    }
};

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