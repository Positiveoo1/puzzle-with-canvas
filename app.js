const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelIndicator = document.getElementById('level-indicator');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');

let player, items, obstacles, puzzles, currentLevel, keysPressed, levelUpMessageTimer;

function initGame() {
    player = { x: 50, y: 500, width: 40, height: 40, speed: 5 };
    items = [];
    obstacles = [];
    puzzles = [];
    currentLevel = 1;
    keysPressed = {};
    levelUpMessageTimer = 0;
    loadLevel(currentLevel);
}

const levels = [
    {
        items: [{ x: 200, y: 550, width: 20, height: 20 }],
        obstacles: [{ x: 400, y: 560, width: 100, height: 20 }],
        puzzles: [{ x: 600, y: 550, width: 40, height: 40, solved: false }]
    },
    {
        items: [{ x: 150, y: 550, width: 20, height: 20 }, { x: 700, y: 550, width: 20, height: 20 }],
        obstacles: [{ x: 300, y: 560, width: 100, height: 20 }, { x: 500, y: 560, width: 100, height: 20 }],
        puzzles: [{ x: 650, y: 550, width: 40, height: 40, solved: false }]
    },
];

function loadLevel(level) {
    if (level > levels.length) {
        level = 1;
        currentLevel = 1;
    }
    const levelData = levels[level - 1];
    items = levelData.items;
    obstacles = levelData.obstacles;
    puzzles = levelData.puzzles;
    levelIndicator.textContent = `Level: ${level}`;
    showLevelUpMessage(level);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = 'gold';
    items.forEach(item => {
        ctx.fillRect(item.x, item.y, item.width, item.height);
    });

    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    ctx.fillStyle = 'green';
    puzzles.forEach(puzzle => {
        ctx.fillRect(puzzle.x, puzzle.y, puzzle.width, puzzle.height);
    });

    if (levelUpMessageTimer > 0) {
        ctx.fillStyle = 'yellow';
        ctx.font = '30px Arial';
        ctx.fillText('Level Up!', canvas.width / 2 - 70, canvas.height / 2);
        levelUpMessageTimer--;
    }
}

function update() {
    if (keysPressed['ArrowLeft'] || keysPressed['Left']) player.x -= player.speed;
    if (keysPressed['ArrowRight'] || keysPressed['Right']) player.x += player.speed;
    if (keysPressed['ArrowUp'] || keysPressed['Up']) player.y -= player.speed;
    if (keysPressed['ArrowDown'] || keysPressed['Down']) player.y += player.speed;

    items = items.filter(item => {
        if (isColliding(player, item)) {
            return false; 
        }
        return true;
    });

    puzzles.forEach(puzzle => {
        if (isColliding(player, puzzle) && !puzzle.solved) {
            puzzle.solved = true;
        }
    });

    if (items.length === 0) {
        currentLevel++;
        loadLevel(currentLevel);
    }

    draw();
}

function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Show level up message
function showLevelUpMessage(level) {
    levelUpMessageTimer = 60; // Show message for 60 frames
}

// Handle key down
window.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
});

// Handle key up
window.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

// Handle touch controls
leftButton.addEventListener('touchstart', () => keysPressed['Left'] = true);
leftButton.addEventListener('touchend', () => keysPressed['Left'] = false);
rightButton.addEventListener('touchstart', () => keysPressed['Right'] = true);
rightButton.addEventListener('touchend', () => keysPressed['Right'] = false);
upButton.addEventListener('touchstart', () => keysPressed['Up'] = true);
upButton.addEventListener('touchend', () => keysPressed['Up'] = false);
downButton.addEventListener('touchstart', () => keysPressed['Down'] = true);
downButton.addEventListener('touchend', () => keysPressed['Down'] = false);

// Game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Initialize and start game
initGame();
gameLoop();
