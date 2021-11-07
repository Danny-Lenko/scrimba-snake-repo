"use strict"

const gridEl = document.querySelector('.gridEl');
const scoreEl = document.querySelector('#scoreEl');
const startBtn = document.querySelector('#startBtn');
const width = 10;

let grid = [];
let currentSnake = [2, 1, 0];
let direction = 1;
let tail = 0;
let appleIndex = 0;
let userScore = 0;
let defaultSpeed = 1000;
let moveID = 0;

function createGrid() {
   for (let i = 0; i < width*width; i++) {
      const div = document.createElement('div');
      div.classList.add('square');
      gridEl.appendChild(div);
      grid.push(div);
   }
}
createGrid();

currentSnake.forEach(index => grid[index].classList.add('snake'));

function startGame() {
   moveID = setInterval(moveSnake, defaultSpeed);
}
// startGame();

function moveSnake() {

   if (currentSnake[0] % width === width-1 && direction === 1 ||
      currentSnake[0] % width === 0 && direction === -1 ||
      currentSnake[0] - width < 0 && direction === -width ||
      currentSnake[0] + width >=100 && direction === +width ||
      grid[currentSnake[0] + direction].classList.contains('snake')) {
         return clearInterval(moveID);
      }

   tail = currentSnake.pop();
   grid[tail].classList.remove('snake');
   let head = currentSnake[0] + direction;
   currentSnake.unshift(head);

   eatApple();

   grid[head].classList.add('snake');

}

function controlSnake(event) {
   if (event.key === "ArrowDown" || event.key === "Down") {
      direction = width;
   } else if (event.key === "ArrowUp" || event.key === "Up") {
      direction = -width;
   } else if (event.key === "ArrowLeft" || event.key === "Left") {
      direction = -1;
   } else if (event.key === "ArrowRight" || event.key === "Rigth") {
      direction = 1;
   }
}

function showApple() {
   do {
      appleIndex = Math.floor(Math.random() * grid.length);
   } while( grid[appleIndex].classList.contains('snake') ) {
      grid[appleIndex].classList.add('apple');
   }
}
showApple();

function eatApple() {
   if ( grid[currentSnake[0]].classList.contains('apple') ) {
      console.log('appleHit');
      grid[currentSnake[0]].classList.remove('apple');
      showApple();
      grid[tail].classList.add('snake');
      currentSnake.push(tail);
      userScore++;
      scoreEl.innerHTML = userScore;

      clearInterval(moveID);
      defaultSpeed *= 0.9; 
      moveID = setInterval(moveSnake, defaultSpeed);
   }
}

document.addEventListener('keyup', controlSnake);
startBtn.addEventListener('click', startGame);
