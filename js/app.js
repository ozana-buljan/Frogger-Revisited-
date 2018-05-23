/* *** *** *** *** *** DECLARATIONS *** *** *** *** *** */
/* *** *** *** *** constants *** *** *** *** */

const START_X = 202; // X Start-Position of the player,
const START_Y = 404; // Y Start-Position of the player,

const allEnemies = []; //array to hold all enemies
const allItems = [];

/* *** *** *** *** DOM elements *** *** *** *** */
const lives = document.querySelector("#lives");
const levels = document.querySelector("#level");


/* *** *** *** *** start values *** *** *** *** */
let key = null;

/* *** *** *** *** *** CLASSES *** *** *** *** *** */
/* *** *** *** *** Class: Enemy *** *** *** *** */
// class ENEMY -> from which enemies derive their properties and methods
//enemies are later created and placed in allEnemies array (below classes section)
// Enemy's speed and stating points on x-axis are randomized in order for them to move non-synchronously

class Enemy {
    constructor(y) {
        this.x = Math.floor((Math.random() * ((-600) - (-10)) + (-10)));
        this.y = y;
        this.speed = Math.floor((Math.random() * (8 - 3) + 3));
        this.sprite = "images/enemy-car.svg";
        this.id;
    }

    // Method: enemy.update() -> updates the enemy's position by taking parameter(dt), a time delta between ticks and calculating new random speed of the enemy each time it's called.
    //Also regulates that enemy stays on screen-> each time enemy hits the right edge of canvas, it returns it to -100 x-position
    update(dt) {
        if (this.x >= 505) {
            this.speed = Math.floor((Math.random() * (8 - 3) + 3));
            this.x = -100;
        } else {
            this.x += (505 / this.speed) * dt;
        }
    }

    // Method: enemy.render() -> draws the enemy on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    //Method: enemy.collision() -> checks if player and enemy are colliding by iterating over the allItems array and comparing the x- and y-values of every array element with the x- and y-values of the player. If they do collide, the method player.collide is invoked.
    //invoked in Engine.js -> function updateEntities();
    collision() {
        if (this.y === (player.y - 12) && this.x > player.x - 75 && this.x < player.x + 70) {
            player.collide();
        }
    }
}
/* *** *** *** *** Class: Player *** *** *** *** */

// class PLAYER -> from which player object derives its properties and methods
//c0nstructor takes 2 arguments: x and y coordinate, and then uses them to move player on the canvas (rendered as animation)
//player moves via key inputs (allowed keys: UP, DOWN, LEFT, RIGHT) - without keys player cannot move. At the start of the game, while modal is on - keys are disabled and enabled when the game starts
//player also keeps track of collectible items (fly, dragonfly, butterfly and hearts), levels, score, as well as how many times player reached the other side
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.moveX = this.x;
        this.moveY = this.y;
        this.sprite = "images/frog-green.svg";
        this.level = 0;
        this.score = 0;
        this.scoreWater = 0;
        this.life = 3;
        this.collected = 0;
        this.collectedFly = 0;
        this.collectedDragonfly = 0;
        this.collectedButterfly = 0;
        this.moves = false;
    }


    // Method: player.render() -> drawing the Player on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    // Method: player.handleInput() -> takes the key pressed as an argument and saves it into global key variable
    handleInput(keycode) {
        if (keycode !== undefined && player.moves === true) {
            key = keycode;
        }
    };

    //Method: player.update() -> uses global key variable's value and sets the movement. Each of allowed keys (UP, DOWN, LEFT, RIGHT) moves the player on the x or y axis. If loops have condition which checks if key was pressed and if the player is running against the obstacle by comparing the x and y values of the player and the obstacle
    update() {
        if (key !== null) {
            switch (key) {
                case "left":
                    if (this.x > 0) {
                        if (this.x - 101 === obstacle.x - 20 && this.y === obstacle.y - 48) {
                            this.x = this.x;
                        } else {
                            this.x = this.x - 101;
                        }
                    }
                    break;
                case "right":
                    if (this.x < 404) {
                        if (this.x + 101 === obstacle.x - 20 && this.y === obstacle.y - 48) {
                            this.x = this.x;
                        } else {
                            this.x = this.x + 101;
                        }
                    }
                    break;
                case "up":
                    if (this.y > 83) {
                        if (this.y - 83 === obstacle.y - 48 && this.x === obstacle.x - 20) {
                            this.y = this.y;
                        } else {
                            this.y = this.y - 83;
                        }
                    } else {
                        player.reachWater();
                    }
                    break;
                case "down":
                    if (this.y < 380) {
                        if (this.y + 83 === obstacle.y - 48 && this.x === obstacle.x - 20) {
                            this.y = this.y;
                        } else {
                            this.y = this.y + 83;
                        }
                        break;
                    }
            }
            key = null;
        }
    };

    //Method: player.reachWater() -> invoked when player reaches the other side of canvas; updates score, reaching water score, level and returns player to a starting position
    reachWater() {
        this.score += 10;
        document.querySelector("#score").textContent = this.score;
        this.scoreWater += 1;
        document.querySelector("#score-water").textContent = this.scoreWater;
        this.x = START_X;
        this.y = START_Y;
        obstacle.newRound = true;
        this.levelUp();
    };

    //Method: player.collide() ->  invoked when enemy.collision() happens. Removes a life from the palyer and returns player to a starting position, updating obsacles. If lives reach 0, the method player.endGame is invoked and the game is over.

    collide() {
        this.life -= 1;
        lives.innerHTML = this.life;
        this.x = START_X;
        this.y = START_Y;
        obstacle.newRound = true;
        if (this.life === 0) {
            this.endGame();
        }
    };
    //Method: player.levelUp() ->  for each interval in score (50-100-250-500-1000-2500-5000) sets the level and updates the score-panel

    levelUp() {
        if (this.score <= 50) {
            document.querySelector("#level").textContent = 0;
        } else if (this.score > 50 && this.score <= 100) {
            document.querySelector("#level").textContent = 1;
        } else if (this.score > 100 && this.score <= 250) {
            document.querySelector("#level").textContent = 2;
        } else if (this.score > 250 && this.score <= 500) {
            document.querySelector("#level").textContent = 3;
        } else if (this.score > 500 && this.score <= 1000) {
            document.querySelector("#level").textContent = 4;
        } else if (this.score > 1000 && this.score <= 2500) {
            document.querySelector("#level").textContent = 5;
        } else if (this.score > 2500 && this.score <= 5000) {
            document.querySelector("#level").textContent = 6;
        } else if (this.score > 5000) {
            document.querySelector("#level").textContent = 7;
        }
    }
    //Method: player.endGame() ->  invoked when player loses all his lives; triggers a game over modal
    endGame() {
        setTimeout(function () {
            confirm("Sorry, you loose. Try it again!");
            player.reset();
            start();
        }, 500);
    }
    //Method: player.reset() ->  resets all the game stats and progress; triggers start game modal
    //Called in Engine.js -> within init() method
    reset() {
        this.life = 3;
        this.collected = 0;
        this.level = 0;
        this.score = 0;
        this.scoreWater = 0;
        this.collectedFly = 0;
        this.collectedDragonfly = 0;
        this.collectedButterfly = 0;
        document.querySelector("#lives").innerHTML = this.life;
        document.querySelector("#collected").innerHTML = this.collected;
        document.querySelector("#fly-coll").innerHTML = this.collectedFly;
        document.querySelector("#dragonfly-coll").innerHTML = this.collectedDragonfly;
        document.querySelector("#butterfly-coll").innerHTML = this.collectedButterfly;
        document.querySelector("#score").innerHTML = this.score;
        document.querySelector("#score-water").innerHTML = this.scoreWater;
        player.startModalShow();
    }
    //Method: player.startModalShow() ->  opens start modal
    startModalShow() {
        document.querySelector("#start-modal").style.display = "block";
        const startBtn = document.querySelector("#start-game");
        startBtn.addEventListener("click", player.startModalHide);
    }
    //Method: player.startModalHide() ->  closes start modal
    startModalHide() {
        document.querySelector("#start-modal").style.display = "none";
        player.choosePlayer();
    }
    //Method: player.choosePlayer() ->  takes value of chosen radio button in for and adjustes the image of chosen player
    choosePlayer() {
        player.sprite = document.formular.player.value;
        player.moves = true;
    }
}


//HEARTS
/**
 * Show heart (player's life)

function showHeart() {
    for (const argument of arguments) {
        document.querySelector(
            argument
        ).innerHTML = `<img src="images/heart.svg" class="coll-img">`;
    }
}

 * Hide heart (player's life)

function hideHeart() {
    for (const argument of arguments) {
        document.querySelector(argument).innerHTML = ``;
    }
}


 * Show needed number of hearts

function showHearts(numberOfLives) {
    if (numberOfLives == 1) {
        hideHeart("#heart-2", "#heart-3");
    } else if (numberOfLives == 2) {
        hideHeart("#heart-3");
    } else if (numberOfLives == 3) {
        showHeart("#heart-1", "#heart-2", "#heart-3");
    }
} */

//gems


// Collectibles superclass
class Collectibles {

    constructor() {
        this.width;
        this.height;
        this.x;
        this.y;
        this.time_now = 0;
        this.time_target = 0;
        this.show = false;
        this.sprite;
        this.id;
    }
    // creating an random position of the gems
    chance() {
        this.x = 20 + 101 * (Math.floor(Math.random() * (5 - 0) + 0));
        this.y = 120 + 83 * (Math.floor(Math.random() * (3 - 0) + 0));
    };

    // update the gems, taking the actual time, adding some random time into the object value time_target. When actual time outruns the time_target, method change is fired an changes the position of the fly

    update() {}

    // drawing the gem on the canvas
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    }
}

class CollFly extends Collectibles {
    constructor() {
        super();
        this.width = 50;
        this.height = 50;
        this.sprite = 'images/coll-fly.svg';
        this.id = "fly";
    }
    update() {
        if (this.time_now >= this.time_target) {
            this.chance();
            this.time_target = Date.now() + Math.floor(Math.random() * (15000 - 3000) + 3000);
        }
        this.time_now = Date.now();
    }
}


// creating a BlueGems class, include the key .display. If the value is false,
// the method update can create an new blue gem after a random time. If it´s true, the update-method puts the blue gem out of side for a random time.

class CollDragonfly extends Collectibles {
    constructor() {
        super();
        this.width = 70;
        this.height = 90;
        this.chance();
        this.sprite = 'images/coll-dragonfly.svg';
        this.id = "dragonfly";
    }

    // update-method for the blue gem, calculates a random time between 3 and 10 sec if display===false blue gem is put in a visible position, if display===true the blue gem is hidden for 3 to 10 sec from the canvas (-100, -100)

    update() {
        if (this.time_now >= this.time_target) {
            if (this.display === false) {
                this.chance();
                this.display = true;
            } else {
                this.x = -500;
                this.y = -500;
                this.display = false;
            }
            this.time_target = Date.now() + Math.floor(Math.random() * (15000 - 3000) + 5000);
        }
        this.time_now = Date.now();
    }
}

// creating a OrangeGems class, include the key .display. If the value is false, the method update can create an new blue gem after a random time. If it´s true, the update-method puts the blue gem out of side for a random time.

class CollButterfly extends Collectibles {
    constructor() {
        super();
        this.width = 90;
        this.height = 90;
        this.chance();
        this.sprite = 'images/coll-butterfly.svg';
        this.id = "butterfly";
    }

    // update-method for the blue gem, calculates a random time between 3 and 10 sec if display===false blue gem is put in a visible position, if display===true the blue gem is hidden for 3 to 10 sec from the canvas (-100, -100)

    update() {
        if (this.time_now >= this.time_target) {
            if (this.display === false) {
                this.chance();
                this.display = true;
            } else {
                this.x = -500;
                this.y = -500;
                this.display = false;
            }
            this.time_target = Date.now() + Math.floor(Math.random() * (15000 - 3000) + 8000);
        }
        this.time_now = Date.now();
    }
}

// creating an new obstacle-object, including key newRound which is used in method update
class Obstacle extends Collectibles {
    constructor() {
        super();
        this.width = 100;
        this.height = 100;
        this.chance();
        this.sprite = "images/obstacle.svg";
        this.newRound = false;
        this.id = "obstacle";
    }
    //update-method brings the obstacle in another position if the player hits the top of
    // the canvas and is pushed back into the initial position - to avoid, that the
    // obstacle is whole the game in the same position
    update() {
        if (this.newRound === true) {
            this.chance();
            this.newRound = false;
        }
    }
}


// creating the Heart-object
class Heart extends Collectibles {
    constructor() {
        super();
        this.width = 80;
        this.height = 80;
        this.chance();
        this.sprite = 'images/heart.svg';
        this.id = "heart";
    }

    // update-methods fires after a time between 3 and 10 sec. If heart wasn´t on the
    // canvas (display===false) heart is pushed to a visible position on the canvas
    // if heart was visible on the canvas, it is pushed into an invisible area of the
    // canvas. It reoccur after 3 to 10 sec.
    update() {
        if (this.time_now >= this.time_target) {
            if (this.display === false) {
                this.chance();
                this.display = true;
            } else {
                this.x = -500;
                this.y = -500;
                this.display = false;
            }
            this.time_target = Date.now() + Math.floor(Math.random() * (15000 - 3000) + 10000);
        }
        this.time_now = Date.now();
    }

}


// function (invoked in Engine, function update) checking if player is hitting a
// gem by iterating over the allItems-array and comparing the x- and y-values of
// the elements with the x- and y-values of the player. If hitting fly, 10 point
// is added to player.score, if hitting blue, 3 Points are added.
// when score === 10, the method player.endGame() is ending the game

function collisionItems() {
    for (var i = 0; i < allItems.length; i++) {
        if (allItems[i].y === player.y + 48 && allItems[i].x === player.x + 20) {
            let item = allItems[i].id;
            switch (item) {
                case "fly":
                    player.collected += 1;
                    player.collectedFly += 1;
                    player.score += 10;
                    break;
                case "dragonfly":
                    player.collected += 1;
                    player.collectedDragonfly += 1;
                    player.score += 20;
                    break;
                case "butterfly":
                    player.collected += 1;
                    player.collectedButterfly += 1;
                    player.score += 30;
                    break;
                case "heart":
                    player.life += 1;
                    player.score += 5;
                    break;
            }
            document.querySelector("#collected").innerHTML = player.collected;
            document.querySelector("#fly-coll").innerHTML = player.collectedFly;
            document.querySelector("#dragonfly-coll").innerHTML = player.collectedDragonfly;
            document.querySelector("#butterfly-coll").innerHTML = player.collectedButterfly;
            document.querySelector("#score").innerHTML = player.score;
            lives.innerHTML = player.life;
            allItems[i].time_now = 0;
            allItems[i].time_target = 0;
            allItems[i].update();
        }
    }
};


// Creating new enemy-objects with the object-creator-functions
let enemy1 = new Enemy(60);
let enemy2 = new Enemy(143);
let enemy3 = new Enemy(226);

// Creating all the other objects with object-creator
let player = new Player(START_X, START_Y);
let flies = new CollFly();
let dragonfly = new CollDragonfly();
let butterfly = new CollButterfly();
let obstacle = new Obstacle();
let heart = new Heart();

//Creating an array of all enemies to iterate over it in the function collision
allEnemies.push(enemy1, enemy2, enemy3);

// Creating an array of all gems and the heart items  to iterate over it in the function collisionItems
allItems.push(flies, dragonfly, butterfly, heart);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


//MODALS

$(document).ready(function () {
    $('.modal').modal();
});
