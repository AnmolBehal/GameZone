const gameContainer = document.getElementById('game-container');
const basket = document.getElementById('basket');
const scoreBoard = document.getElementById('score');
const livesBoard = document.getElementById('lives');
const gameMenu = document.getElementById('game-menu');
const gameOverScreen = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');

let score = 0;
let lives = 3;
let gameInterval;
let isGameRunning = false;

// Start or Restart Game
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !isGameRunning) {
    startGame();
  }
});

function startGame() {
  // Reset variables
  score = 0;
  lives = 3; // Start with 3 lives
  isGameRunning = true;
  scoreBoard.textContent = score;
  updateLivesDisplay();

  // Hide menu or game over screen
  gameMenu.style.display = 'none';
  gameOverScreen.style.display = 'none';
  gameContainer.style.display = 'block';

  // Start game loop
  gameInterval = setInterval(createObject, 1500); // Objects fall every 1.5 seconds
}

// End Game
function endGame() {
  isGameRunning = false;
  clearInterval(gameInterval);
  gameContainer.style.display = 'none';
  gameOverScreen.style.display = 'flex';
  finalScore.textContent = score;
}

// Update Lives Display
function updateLivesDisplay() {
  livesBoard.innerHTML = '❤️'.repeat(lives);
}

// Move basket left and right
document.addEventListener('keydown', (event) => {
  if (!isGameRunning) return;

  const basketPosition = basket.offsetLeft;
  if (event.key === 'ArrowLeft' && basketPosition > 0) {
    basket.style.left = basketPosition - 20 + 'px';
  } else if (event.key === 'ArrowRight' && basketPosition < gameContainer.offsetWidth - basket.offsetWidth) {
    basket.style.left = basketPosition + 20 + 'px';
  }
});

// Create falling objects
function createObject() {
  const object = document.createElement('div');
  object.classList.add('object');

  // Randomize object type (normal or life)
  if (Math.random() < 0.15) {
    object.classList.add('life-heart'); // 15% chance for a life heart
  }

  // Restrict falling area to the center of the game container
  object.style.left = Math.random() * (gameContainer.offsetWidth - 30) + 'px';
  object.style.top = '0px';
  gameContainer.appendChild(object);
  moveObject(object);
}

// Move falling objects
function moveObject(object) {
  let position = 0;
  const interval = setInterval(() => {
    const basketRect = basket.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    // Collision detection
    const isCaught =
      objectRect.bottom >= basketRect.top &&
      objectRect.top <= basketRect.bottom &&
      objectRect.right >= basketRect.left &&
      objectRect.left <= basketRect.right;

    if (isCaught) {
      clearInterval(interval);

      if (object.classList.contains('life-heart')) {
        lives++;
        updateLivesDisplay();
      } else {
        score++;
        scoreBoard.textContent = score;
      }

      object.remove(); // Remove caught object
    } else if (position > gameContainer.offsetHeight - 30) {
      clearInterval(interval);

      if (!object.classList.contains('life-heart')) {
        lives--;
        updateLivesDisplay();
        if (lives <= 0) {
          endGame();
        }
      }

      object.remove(); // Remove missed object
    } else {
      position += 5;
      object.style.top = position + 'px';
    }
  }, 50);
}
