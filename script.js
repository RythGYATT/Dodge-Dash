const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let player = { x: 240, y: 400, width: 20, height: 20, speed: 5 };
let obstacles = [];
let powerUps = [];
let score = 0;
let gameOver = false;
let obstacleSpeed = 2;
let slowMotion = false;
let invincible = false;
let slowMotionTimer = 0;
let invincibleTimer = 0;

// Create random obstacles
function createObstacle() {
    const x = Math.random() * (canvas.width - 50);
    obstacles.push({ x, y: 0, width: 50, height: 20 });
}

// Create power-ups
function createPowerUp() {
    const x = Math.random() * (canvas.width - 20);
    const type = Math.random() > 0.5 ? "slow" : "shield";
    powerUps.push({ x, y: 0, width: 20, height: 20, type });
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = invincible ? "#34d399" : "#f43f5e"; // Green when invincible
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw obstacles
function drawObstacles() {
    ctx.fillStyle = "#fbbf24";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Draw power-ups
function drawPowerUps() {
    powerUps.forEach(powerUp => {
        ctx.fillStyle = powerUp.type === "slow" ? "#60a5fa" : "#f87171";
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    });
}

// Update game logic
function update() {
    if (gameOver) return;

    // Move obstacles
    obstacles.forEach(obstacle => {
        obstacle.y += slowMotion ? obstacleSpeed / 2 : obstacleSpeed;

        // Check collision with player
        if (
            !invincible &&
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
        }
    });

    // Move power-ups
    powerUps.forEach(powerUp => {
        powerUp.y += obstacleSpeed;

        // Check collision with player
        if (
            player.x < powerUp.x + powerUp.width &&
            player.x + player.width > powerUp.x &&
            player.y < powerUp.y + powerUp.height &&
            player.y + player.height > powerUp.y
        ) {
            if (powerUp.type === "slow") {
                slowMotion = true;
                slowMotionTimer = 200; // 200 frames of slow motion
            } else if (powerUp.type === "shield") {
                invincible = true;
                invincibleTimer = 200; // 200 frames of invincibility
            }
            powerUp.y = canvas.height; // Move power-up offscreen
        }
    });

    // Remove offscreen obstacles and power-ups
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
    powerUps = powerUps.filter(powerUp => powerUp.y < canvas.height);

    // Spawn new obstacles and power-ups
    if (Math.random() < 0.02) createObstacle();
    if (Math.random() < 0.01) createPowerUp();

    // Update timers
    if (slowMotion) {
        slowMotionTimer--;
        if (slowMotionTimer <= 0) slowMotion = false;
    }
    if (invincible) {
        invincibleTimer--;
        if (invincibleTimer <= 0) invincible = false;
    }

    // Increase score and difficulty
    score++;
    if (score % 500 === 0) obstacleSpeed += 0.5;

    draw();
}

// Draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawObstacles();
    drawPowerUps();

    // Display score
    ctx.fillStyle = "#f8fafc";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);

    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
    }
}

// Move player
function movePlayer(direction) {
    if (direction === "left" && player.x > 0) player.x -= player.speed;
    if (direction === "right" && player.x + player.width < canvas.width) player.x += player.speed;
}

// Event listeners for controls
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") movePlayer("left");
    if (e.key === "ArrowRight") movePlayer("right");
    if (e.key === " " && gameOver) resetGame();
});

// Reset game
function resetGame() {
    player.x = 240;
    player.y = 400;
    obstacles = [];
    powerUps = [];
    score = 0;
    obstacleSpeed = 2;
    slowMotion = false;
    invincible = false;
    gameOver = false;
    createObstacle();
}

// Start game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Start game
createObstacle();
gameLoop();
