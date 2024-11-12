const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const powerupNotice = document.getElementById('powerup-notice');
const menu = document.getElementById('menu');
let playerPosition = gameContainer.clientWidth / 2;
let score = 0;
let rockSpeed = 3;
let rockInterval = 1500;
let gameRunning = true;
let gamePaused = false;
let isJumping = false;
let powerupAvailable = false;
let powerupLevel = 0;

const powerups = [
    { name: 'Invincibility', effect: () => activateInvincibility(), cost: 10 },
    { name: 'Super Speed', effect: () => activateSuperSpeed(), cost: 20 },
    { name: 'High Jump', effect: () => activateHighJump(), cost: 30 },
    { name: 'Double Points', effect: () => activateDoublePoints(), cost: 40 },
    { name: 'Slow Motion Rocks', effect: () => activateSlowMotion(), cost: 50 },
];

// Toggle the hamburger menu and pause/resume the game
function toggleMenu() {
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
        resumeGame();
    } else {
        menu.style.display = 'flex';
        pauseGame();
    }
}

// Pause the game
function pauseGame() {
    gameRunning = false;
    gamePaused = true;
}

// Resume the game
function resumeGame() {
    gameRunning = true;
    gamePaused = false;
}

// Open shop from menu
function openShop() {
    if (powerupAvailable) {
        buyPowerup();
    } else {
        alert("No power-ups available to buy right now.");
    }
}

// Restart the game
function restartGame() {
    window.location.reload();
}

// Update score and display power-up notice if available
function updateScore() {
    score += 1;
    scoreDisplay.textContent = score;

    if (score >= (powerupLevel + 1) * 10 && powerupLevel < powerups.length) {
        powerupAvailable = true;
        powerupNotice.style.display = 'block';
    }
}

// Move player with arrow keys and WASD
document.addEventListener('keydown', (event) => {
    if (gameRunning) {
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            playerPosition -= 20;
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            playerPosition += 20;
        } else if ((event.key === 'ArrowUp' || event.key === 'w') && !isJumping) {
            jump();
        } else if (event.key === 's' && powerupAvailable) {
            buyPowerup();
        }

        playerPosition = Math.max(0, Math.min(gameContainer.clientWidth - player.offsetWidth, playerPosition));
        player.style.left = playerPosition + 'px';
    }
});

// Player jump function
function jump() {
    isJumping = true;
    let jumpHeight = 150;

    player.style.transition = 'bottom 0.3s ease';
    player.style.bottom = parseInt(player.style.bottom) + jumpHeight + 'px';

    setTimeout(() => {
        player.style.transition = 'bottom 0.3s ease';
        player.style.bottom = '20px';
        isJumping = false;
    }, 600);
}

// Buy power-up function
function buyPowerup() {
    if (powerupLevel < powerups.length) {
        powerups[powerupLevel].effect();
        powerupLevel++;
        powerupAvailable = false;
        powerupNotice.style.display = 'none';
    }
}

// Power-up effects
function activateInvincibility() {
    alert("Invincibility activated!");
    // Invincibility logic can be implemented here
}

function activateSuperSpeed() {
    alert("Super Speed activated!");
    playerPosition += 50;
}

function activateHighJump() {
    alert("High Jump activated!");
    isJumping = true;
}

function activateDoublePoints() {
    alert("Double Points activated!");
    score *= 2;
}

function activateSlowMotion() {
    alert("Slow Motion Rocks activated!");
    rockSpeed /= 2;
}

// Function to create falling rocks
function createRock() {
    if (!gameRunning) return; // Only create rocks if the game is running
    
    const rock = document.createElement('div');
    rock.classList.add('rock');
    rock.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
    rock.style.top = '0px';
    gameContainer.appendChild(rock);

    // Move the rock down
    const rockFall = setInterval(() => {
        if (!gameRunning) return; // Stop moving rocks if game is paused

        let rockPosition = rock.getBoundingClientRect();
        rock.style.top = rockPosition.top + rockSpeed + 'px';

        if (rockPosition.top > gameContainer.clientHeight) {
            clearInterval(rockFall);
            rock.remove();
            updateScore();
        }

        const playerPosition = player.getBoundingClientRect();
        if (
            rockPosition.left < playerPosition.right &&
            rockPosition.right > playerPosition.left &&
            rockPosition.top < playerPosition.bottom &&
            rockPosition.bottom > playerPosition.top
        ) {
            gameOver();
        }
    }, 20);
}

// Function to end the game
function gameOver() {
    gameRunning = false;
    alert(`Game Over! Your score is ${score}`);
    window.location.reload();
}

// Start generating rocks and increasing difficulty
function startGame() {
    setInterval(() => {
        if (gameRunning) {
            createRock();
            increaseDifficulty();
        }
    }, rockInterval);
}

function increaseDifficulty() {
    if (rockInterval > 500) rockInterval -= 100;
    rockSpeed += 0.5;
}

startGame();

