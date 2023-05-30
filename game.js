// Constants
const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const PIPE_WIDTH = 80;
const PIPE_HEIGHT = 300;
const PIPE_GAP = 200;

// Game variables
let gameArea, bird, pipes, score, isGameOver;

// Initialize game
function startGame() {
    gameArea = document.getElementById('game-area');
    bird = document.getElementById('bird');
    pipes = [];
    score = 0;
    isGameOver = false;

    // Event listener for flapping the bird
    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 32 && !isGameOver) {
            flap();
        }
    });

    // Game loop
    setInterval(function() {
        if (!isGameOver) {
            moveBird();
            movePipes();
            checkCollision();
        }
    }, 20);
}

// Bird flap
function flap() {
    bird.style.top = (bird.offsetTop + JUMP_FORCE) + 'px';
}

// Move bird
function moveBird() {
    if (bird.offsetTop < gameArea.offsetHeight - bird.offsetHeight) {
        bird.style.top = (bird.offsetTop + GRAVITY) + 'px';
    } else {
        gameOver();
    }
}

// Create new pipe
function createPipe() {
    const pipePosition = gameArea.offsetWidth;
    const pipeUp = createPipeElement(pipePosition, 0, true);
    const pipeDownHeight = Math.random() * (gameArea.offsetHeight - PIPE_GAP - PIPE_HEIGHT);
    const pipeDown = createPipeElement(pipePosition, pipeDownHeight + PIPE_GAP, false);
    pipes.push({ up: pipeUp, down: pipeDown });
}

// Create pipe element
function createPipeElement(x, height, isUp) {
    const pipe = document.createElement('div');
    pipe.className = 'pipe';
    pipe.style.left = x + 'px';
    pipe.style.height = PIPE_HEIGHT + 'px';
    if (isUp) {
        pipe.style.bottom = (gameArea.offsetHeight - height - PIPE_HEIGHT) + 'px';
    } else {
        pipe.style.top = height + 'px';
    }
    gameArea.appendChild(pipe);
    return pipe;
}

// Move pipes
function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        pipe.up.style.left = (pipe.up.offsetLeft - 2) + 'px';
        pipe.down.style.left = (pipe.down.offsetLeft - 2) + 'px';

        // Remove pipes that are out of the game area
        if (pipe.up.offsetLeft + PIPE_WIDTH < 0) {
            gameArea.removeChild(pipe.up);
            gameArea.removeChild(pipe.down);
            pipes.splice(i, 1);
            i--;
        }
    }

    // Create new pipe every 200 frames
    if (score % 200 === 0) {
        createPipe();
    }
}

// Check collision
function checkCollision() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (isColliding(bird, pipe.up) || isColliding(bird, pipe.down)) {
            gameOver();
            break;
        }
    }
}

// Check if two elements are colliding
function isColliding(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.right < rect2.left ||
        rect1.left > rect2.right
    );
}

// Game over
function gameOver() {
    isGameOver = true;
}

// Start the game
startGame();
