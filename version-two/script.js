"use strict"

window.onload = function() {
   view.renderGrid();
   view.renderSnake();
   document.querySelector('#startBtn').addEventListener('click', controller.startGame);
   document.onkeyup = controller.controlSnake;
}

let view = {

   renderGrid: function() {
      const gridEl = document.querySelector('.gridEl');
      for (let i = 0; i < 100; i++) {
         const square = document.createElement('div');
         gridEl.appendChild(square);
         square.setAttribute('class', 'square');
      }
   },

   renderSnake: function() {
      const gridElList = document.getElementsByClassName('square');
      for (let i = 0; i < model.snake.length; i++) {
         gridElList[model.snake[i]].classList.add('snake');
      }
   }

};

let model = {
   snake: [2, 1, 0],

   moveSnake: function() {
      const gridElList = document.getElementsByClassName('square');
      const tail = model.snake.pop();
      gridElList[tail].classList.remove('snake');
      model.snake.unshift(model.snake[0] + controller.direction);
      view.renderSnake();
   },

   
};

let controller = {
   direction: 1,

   startGame: function() {
      model.moveSnake();
      let intervalID = window.setInterval(model.moveSnake, 1000);
   },

   controlSnake: function(e) {
      if (e.key === 'ArrowDown' || e.key === 'Down') {
         controller.direction = 10;
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
         controller.direction = -10;
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
         controller.direction = 1;
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
         controller.direction = -1;
      }
   }

};



