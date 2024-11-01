// ============================================================================================== //
// ============================================================================================== //
                      // VARIÁVEIS

// ============================================================================================== //
// ============================================================================================== //



const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 400;
const cellSize = 30;



let currentPhase = 0;
let score = 0;
let health = 100;

const rat = { x: 1, y: 1, size: cellSize - 6, color: 'gray', speed: 2 };
const obstacles = [];
let goal = { x: 17, y: 5 };

// ============================================================================================== //
// ============================================================================================== //
                        //INICIO DAS CONFIGURAÇÕES DAS FASES //

// ============================================================================================== //
// ============================================================================================== //
const phases = [
  {
    layout: [
      'WWWWWWWWWWWWWWWWWWWW',
      'W...............W..W',
      'W.WWWW.WWWW.WWWW.W.W',
      'W.W............W...W',
      'W.W.WW.WWWWWW.WWWW.W',
      'W...W...W.....W....W',
      'WWWWWWWWWWWWWWWWWWWW'
    ],
    obstacles: [{ type: 'bacteria', x: 5, y: 1 }, { type: 'human', x: 9, y: 4 }, { type: 'trash', x: 4, y: 3 }],
    goal: { x: 17, y: 5 }
  },
  {
    layout: [
      'WWWWWWWWWWWWWWWWWWWW',
      'W..T............H..W',
      'W.WWWW.WWWW.WWWW.W.W',
      'W.W.............B..W',
      'W.W.WW.WWWWWW.WWWW.W',
      'W...W...W.....W....W',
      'WWWWWWWWWWWWWWWWWWWW'
    ],
    obstacles: [{ type: 'bacteria', x: 7, y: 2 }, { type: 'human', x: 5, y: 5 }, { type: 'trash', x: 9, y: 3 }],
    goal: { x: 1, y: 5 }
  },
  {
    layout: [
      'WWWWWWWWWWWWWWWWWWWW',
      'W.....H...B.......TW',
      'W.WWWW.WWWW.WWWW.W.W',
      'W.W...........T....W',
      'W.W.WW.WWWWWW.WWWW.W',
      'W...W...W.....W....W',
      'WWWWWWWWWWWWWWWWWWWW'
    ],
    obstacles: [{ type: 'bacteria', x: 8, y: 2 }, { type: 'human', x: 3, y: 4 }, { type: 'trash', x: 10, y: 5 }],
    goal: { x: 18, y: 5 }
  }
];


// ============================================================================================== //
// ============================================================================================== //
                        //FIM DAS CONFIGURAÇÕES DAS FASES //

// ============================================================================================== //
// ============================================================================================== //




// ============================================================================================== //
// ============================================================================================== //
                      // ELEMENTOS VISUAIS DO JOGO 

// ============================================================================================== //
// ============================================================================================== //


function updateHUD() {
  document.getElementById('score').textContent = score;
  document.getElementById('health').textContent = health;
  document.getElementById('phase').textContent = currentPhase + 1;
}

// Carrega a fase atual
function loadPhase() {
  health = 100;
  rat.x = 1;
  rat.y = 1;
  obstacles.length = 0;
  phases[currentPhase].obstacles.forEach(obs => {
    obstacles.push({ ...obs });
  });
  goal = { ...phases[currentPhase].goal };
  updateHUD();
}

// Desenha o labirinto com base no layout
function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  phases[currentPhase].layout.forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      if (cell === 'W') {
        ctx.fillStyle = '#333';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    });
  });
}

// Desenha o rato e atualiza sua posição
function drawRat() {
  ctx.fillStyle = rat.color;
  ctx.fillRect(rat.x * cellSize, rat.y * cellSize, rat.size, rat.size);
}

// Desenha obstáculos com animações
function drawObstacles() {
  obstacles.forEach(obs => {
    ctx.fillStyle = obs.type === 'bacteria' ? 'green' : obs.type === 'human' ? 'red' : 'brown';
    ctx.fillRect(obs.x * cellSize, obs.y * cellSize, cellSize - 6, cellSize - 6);
  });
}

// Desenha o objetivo
function drawGoal() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(goal.x * cellSize, goal.y * cellSize, cellSize, cellSize);
}

// Movimenta o rato
function moveRat(key) {
  let newX = rat.x, newY = rat.y;
  if (key === 'ArrowUp') newY--;
  if (key === 'ArrowDown') newY++;
  if (key === 'ArrowLeft') newX--;
  if (key === 'ArrowRight') newX++;

  const cell = phases[currentPhase].layout[newY]?.[newX];
  if (cell !== 'W' && cell !== undefined) {
    rat.x = newX;
    rat.y = newY;
  }
}

// Checa colisões com obstáculos e objetivos
function checkCollisions() {
  obstacles.forEach(obs => {
    if (rat.x === obs.x && rat.y === obs.y) {
      if (obs.type === 'bacteria') health -= 15;
      if (obs.type === 'human') health -= 30;
      if (obs.type === 'trash') health -= 10;
      updateHUD();
      if (health <= 0) resetGame();
    }
  });
  if (rat.x === goal.x && rat.y === goal.y) {
    score += 100;
    if (currentPhase + 1 < phases.length) {
      currentPhase++;
      loadPhase();
    } else {
      alert("Parabéns! Você terminou todas as fases.");
      resetGame();
    }
  }
}

// Reinicia o jogo
function resetGame() {
  score = 0;
  currentPhase = 0;
  loadPhase();
}

// Loop principal do jogo
function gameLoop() {
  drawMaze();
  drawRat();
  drawObstacles();
  drawGoal();
  checkCollisions();
  requestAnimationFrame(gameLoop);
}

// Configuração dos controles
window.addEventListener('keydown', e => {
  moveRat(e.key);
});

// Início do jogo
loadPhase();
gameLoop();
