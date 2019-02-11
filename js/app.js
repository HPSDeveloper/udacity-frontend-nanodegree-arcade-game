function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Enemies our player must avoid
const Enemy = function (xPos = 500 /*causes reset*/, lane = getRandomInt(1, 3)) {
    this.width = 70;
    this.height = 60;
    this.waitTicks = 0;
    /* number of rounds to wait after reset to start position */

    this.x = xPos;
    this.lane = lane;
    this.y = Engine.prototype.LANES_Y_DIMENSIONS[lane];

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// Param 'dt': You should multiply any movement by the dt parameter
//             which will ensure the game runs at the same speed for
//              all computers.
Enemy.prototype.update = function (dt) {
    this.START_POS = -100;

    if (this.x > 500) {
        //Enemy is at the end of its lane
        // -> reset to start position in a random lane with random wait ticks.
        this.x = this.START_POS;
        this.waitTicks = getRandomInt(0, 10) / dt;
        this.lane = getRandomInt(1, 3);
        this.y = Engine.prototype.LANES_Y_DIMENSIONS[this.lane];
    }

    if (this.waitTicks > 0) {
        this.waitTicks -= 1; //As soon as waitTicks are <= 0 the Enemy may start its journey again.
    } else {
        if (this.x != this.START_POS || !this.startBlockIsOccupied(this.lane)) {
            this.x = this.x + 10 * dt;
        }
    }
};

/**
 * Check if a given x position is on this Enemy.
 */
Enemy.prototype.isInTouch = function (x) {
    return x > this.x && x < this.x + this.width;
};

/**
 * Check if a start block of a given lange is  occupied
 */
Enemy.prototype.startBlockIsOccupied = function (lane) {
    return Engine.prototype.allEnemies.filter(enemy => enemy.lane == lane)
            .filter(enemy => enemy.x > this.START_POS)
            .filter(enemy => enemy.x < 60).length > 0;
};

/**
 * Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
 * Player figure
 */
const Player = function () {
    this.width = 70;
    this.startX = 200;
    this.startY = 340;
    this.x = this.startX;
    this.y = this.startY;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-princess-girl.png';
};

Player.prototype.playerHight = 50;
/**
 * Check if the Player has successfully reached the target.
 */
Player.prototype.isAtTarget = function () {
    return Engine.prototype.LANES_Y_DIMENSIONS[1] > this.y + Player.prototype.playerHight + 20;
};

/**
 * Draw the enemy on the screen, required method for game
 */
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Update the Player's position, required method for game
 * Parameter: dt, a time delta between ticks
 */
Player.prototype.update = function (dt) {
    if (Engine.prototype.touchesEnemy()) {
        Engine.prototype.touchedEnemyTimeDownCounter = Engine.prototype.TOUCHED_ENEMY_DOWNCNT_START_VALUE;
        Engine.prototype.score -= 3;
        this.x = this.startX;
        this.y = this.startY;
    }
    if (this.isAtTarget()) {
        Engine.prototype.score++;
        //In order to count down how long the congratulation text is displayed:
        Engine.prototype.congratulationTimeDownCounter = Engine.prototype.CONGRATULATION_DISPLAY_DOWNCNT_START_VALUE;
        this.x = this.startX;
        this.y = this.startY;
    }
};

/**
 * Handle user input
 */
Player.prototype.handleInput = function (keyCode) {
    let stepWidth = 10;
    if (keyCode == 'left' && (this.x - stepWidth) >= Engine.prototype.MIN_X) { //left
        this.x = this.x - stepWidth;
    } else if (keyCode == 'up' && (this.y - stepWidth) >= Engine.prototype.MIN_Y) { //up
        this.y = this.y - stepWidth;
    } else if (keyCode == 'right' && (this.x + stepWidth) <= Engine.prototype.MAX_X) { //right
        this.x = this.x + stepWidth;
    } else if (keyCode == 'down' && (this.y + stepWidth) <= Engine.prototype.MAX_Y) { // down
        this.y = this.y + stepWidth;
    }
};


/**
 * This listens for key presses and sends the keys to your
 * Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function (e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    Engine.prototype.player.handleInput(allowedKeys[e.keyCode]);
});
