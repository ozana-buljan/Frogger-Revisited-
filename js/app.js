/*
 **** TO DO ****
 **BasicGame**
 * Create Player Class based on the sample Enemy Class provided.
 * Fill in default player instance location info. (HINT: x? y?)
 * Create one player instance from Player Class. (You will see the game scenes get initialised)
 * Create multiple enemy instance from Enemy Class.
 * Fill in default enemy instance location info.
 * Fill in update enemy instance moving function.
 * Create player input handle function.
 * Create function to detect collision.
 **Additional Features**
 * Add score
 * Add lives
 * Add timer + stop timer
 * Add win modal
 * Choose a player
 * Sounds & Music
 */

/* *** ES6 *** */



//class Game -> from which Enemy and Player inherit shared properties and methods
class Game {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
    }
    render() {
        ctx.drawImage(Resources.get(this.image), this.x, this.y);
    }
}

// Enemies our player must avoid
class Enemy extends Game {
    constructor(x, y, image, speed) {
        super(x, y, image, speed);
        this.speed = speed;
        this.sprite = "images/enemy-bug.png"; // The image/sprite for enemies
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
    }
    // Draw the enemy on the screen, required method for game
}
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(x, y, image, lives) {
        super(x, y, image, lives);
        this.lives = lives;
        this.sprite = "images/char-boy.png";
    }
    update(dt) {

    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    handleInput() {

    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let enemy1 = new Enemy(-100, 140, 'images/enemy-bug.png', 50);
let enemy2 = new Enemy(-100, 60, 'images/enemy-bug.png', 20);
let enemy3 = new Enemy(-100, 220, 'images/enemy-bug.png', 30);
let allEnemies = [enemy1, enemy2, enemy3];
let hearts = document.getElementsByTagName('ul')[0];
let points = document.getElementById('points');
let score = 0;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
