"use strict"

const gridEl = document.querySelector(".gridEl");

let grid = [];
let snake = [2, 1, 0];
let appleIndex = 0;


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
   let tail = snake[snake.length - 1];
   snake.pop();
   grid[tail].classList.remove('snake');

   grid[snake[0] + 1].classList.add('snake');
   snake.unshift(snake[0] + 1)
}

let intervalID = setInterval(moveSnake, 1000);
clearInterval(intervalID);

function renderApple() {

   do {
      appleIndex = Math.floor(Math.random() * 100);
   } while (grid[appleIndex].classList.contains('snake')) {
      grid[appleIndex].classList.add('apple');
   }
}
renderApple();