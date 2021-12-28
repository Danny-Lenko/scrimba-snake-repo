"use strict"

const gridEl = document.querySelector(".gridEl");
const startBtn = document.querySelector('#startBtn');
const scoreEl = document.querySelector('#scoreEl');

let grid = [];
let snake = [2, 1, 0];
let appleIndex = 0;
let direction = 1;
let tail = "";
let defaultSpeed = 1000;
let speedUp = 0.9;
let intervalID = 0;
let userScore = 0;

startBtn.addEventListener('click', function() {
   intervalID = setInterval(moveSnake, defaultSpeed);
})

function createGrid() {
   for (let i = 0; i < 100; i++) {
      let square = document.createElement('div');
      square.classList.add('square');
      gridEl.append(square);
      grid.push(square);
   }
}
createGrid();

snake.forEach(index => grid[index].classList.add('snake') );

function moveSnake() {

   if ( snake[0] % 10 === 9 && direction === 1
      || snake[0] % 10 === 0 && direction === -1
      || snake[0] + 10 >= 100 && direction === 10
      || snake[0] - 10 < 0 && direction === -10
      || grid[snake[0] + direction].classList.contains('snake')) {
      return clearInterval(intervalID);
   }

   tail = snake[snake.length - 1];
   snake.pop();
   grid[tail].classList.remove('snake');

   grid[snake[0] + direction].classList.add('snake');
   snake.unshift(snake[0] + direction)

   eatApple();
}

function renderApple() {
   do {
      appleIndex = Math.floor(Math.random() * 100);
   } while (grid[appleIndex].classList.contains('snake')) {
      grid[appleIndex].classList.add('apple');
   }
}
renderApple();

function controlSnake(event) {
   if (event.key === "ArrowDown" || event.key === "Down") {
      direction = 10;
   } else if (event.key === "ArrowUp" || event.key === "Up") {
      direction = -10;
   } else if (event.key === "ArrowLeft" || event.key === "Left") {
      direction = -1;
   } else if (event.key === "ArrowRight" || event.key === "Right") {
      direction = 1;
   }
}
document.addEventListener('keyup', controlSnake);

function eatApple() {
   if (grid[snake[0]].classList.contains('apple')) {
      grid[appleIndex].classList.remove('apple');
      grid[tail].classList.add('snake');
      snake.push(tail);

      clearInterval(intervalID);
      defaultSpeed *= speedUp;
      intervalID = setInterval(moveSnake, defaultSpeed);

      renderApple();
      userScore++;
      scoreEl.innerHTML = userScore;
   }
}



