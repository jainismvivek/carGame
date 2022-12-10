"use strict";

// ! Global Varaibles
let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};
let player = { speed: 5, score: 0 };
let MaxScore = 0;
let scoreList = [];
// ! Selectors
const outer_modal = document.querySelector(".starter-modal-outer");
const start_button = document.querySelector(".start-button");
const play_again_button = document.querySelector(".play-again-button");
const gameArea = document.querySelector(".gameArea");
const score = document.querySelector(".current-score span");
const game_over_modal_outer = document.querySelector("#game-over-modal-outer");
const game_over_text = document.querySelector("#game-over-modal-inner span");
//  ! Event Listeners
start_button.addEventListener("click", handleGameStart);
play_again_button.addEventListener("click", handlePlayAgain);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", handleKeyUp);

// ! Initial declarations
game_over_modal_outer.classList.add("hidden");

function handlePlayAgain() {
  const playerName = document.querySelector("#playerName");
  if (!game_over_modal_outer.classList.contains("hidden"))
    game_over_modal_outer.classList.add("hidden");
  else game_over_modal_outer.classList.remove("hidden");
  if (playerName.value === "") return start();
  const scoreObj = {
    player: playerName.value,
    score: player.score,
  };
  playerName.value = "";
  scoreList.push(scoreObj);
  localStorage.setItem("car-scores", JSON.stringify(scoreList));
  return start();
}

// ! Fetch Max Score from localStorage
function fetchScoresFromLocalStorage() {
  const scores = localStorage.getItem("car-scores");
  if (scores === null) {
    localStorage.setItem("car-scores", JSON.stringify(scoreList));
  } else {
    scoreList = [...JSON.parse(scores)];
  }
}

function handleGameStart() {
  outer_modal.dataset.outermodal = false;
  return start();
}

function moveLines() {
  let lines = document.querySelectorAll(".line");
  lines.forEach(function (item) {
    if (item.y > 1500) {
      item.y -= 1500;
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}
function iscollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function moveEnemy(car) {
  let lines = document.querySelectorAll(".enemy");
  lines.forEach(function (item) {
    if (iscollide(car, item)) {
      endGame();
    }

    if (item.y > 1500) {
      item.y = -600;
      item.style.left = Math.floor(Math.random() * 150) + "px";
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}
function playGame() {
  let car = document.querySelector(".car");
  moveLines();
  moveEnemy(car);
  let road = gameArea.getBoundingClientRect();
  if (player.start) {
    if (keys.ArrowUp && player.y > (road.top + 100) * -1) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < road.height - 50) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < road.width - 50) {
      player.x += player.speed;
    }
    car.style.left = player.x + "px";
    car.style.top = player.y + "px";

    window.requestAnimationFrame(playGame);
    player.score++;
    score.innerText = player.score;
  }
}

function pressOn(e) {
  keys[e.key] = true;
}

function handleKeyUp(e) {
  if (e.key === "Enter") return handleGameStart();
  keys[e.key] = false;
}

function endGame() {
  player.start = false;
  game_over_modal_outer.classList.remove("hidden");
  let gameOver_text;
  if (MaxScore === 0)
    gameOver_text = `You have set the new Max score ${player.score}`;
  else if (player.score > MaxScore)
    gameOver_text = `But hey you beat the highest score ${MaxScore}`;
  else
    gameOver_text = `Better luck next time to beat the max Score ${MaxScore}`;
  game_over_text.textContent = gameOver_text;
}

function start() {
  fetchScoresFromLocalStorage();
  displayTopScores();
  gameArea.innerHTML = "";
  player.start = true;
  player.score = 0;
  for (let x = 0; x < 10; x++) {
    let div = document.createElement("div");
    div.classList.add("line");
    div.y = x * 150;
    div.style.top = x * 150 + "px";
    gameArea.appendChild(div);
  }
  window.requestAnimationFrame(playGame);
  const car = createElementWithClass("div", ["car"]);
  const playerCarDiv = createElementWithClass("div", ["playerCarOuter"]);
  const playerCarImg = createElementWithClass("img");
  playerCarImg.setAttribute("src", "./assets/player.png");
  playerCarDiv.appendChild(playerCarImg);
  car.appendChild(playerCarDiv);
  gameArea.appendChild(car);
  player.x = car.offsetLeft;
  player.y = car.offsetTop;
  player.start = true;
  for (let x = 0; x < 3; x++) {
    let enemy = createElementWithClass("div", ["enemy"]);
    const enemyCarDiv = createElementWithClass("div", [
      "enemyCarDiv",
      `enemyCar${x + 1}`,
    ]);
    const enemyCarImg = createElementWithClass("img");
    enemyCarImg.setAttribute("src", `./assets/enemyCar${x + 1}.png`);
    enemyCarDiv.appendChild(enemyCarImg);
    enemy.appendChild(enemyCarDiv);
    //enemy.y = Math.floor(Math.random()*500)*-1
    enemy.y = (x + 1) * 600 * -1;
    enemy.style.top = enemy.y + "px";
    enemy.style.left = Math.floor(Math.random() * 150) + "px";
    gameArea.appendChild(enemy);
  }
}
function displayTopScores() {
  const top_score = document.querySelector(".top-scores");
  const prev_score_wrapper = document.querySelector(".scores-wrapper");
  if (prev_score_wrapper) prev_score_wrapper.remove();

  const scores_wrapper = createElementWithClass("div", ["scores-wrapper"]);
  scoreList.sort((a, b) => b.score - a.score);
  scoreList.map((list) => {
    const playerDiv = createElementWithClass("div", ["playerDiv"]);
    // Create Player Name
    const playerName = createElementWithClass("h5");
    playerName.textContent = list.player;
    // Create Player Score
    const playerScore = createElementWithClass("span");
    playerScore.textContent = list.score;
    // Append Player name and score to PlayerDiv
    playerDiv.appendChild(playerName);
    playerDiv.appendChild(playerScore);
    // Append PlayerDiv to top_score
    scores_wrapper.appendChild(playerDiv);
  });
  top_score.appendChild(scores_wrapper);
}

function createElementWithClass(ele, clsName) {
  const element = document.createElement(ele);
  if (clsName) element.classList.add(...clsName);
  return element;
}
