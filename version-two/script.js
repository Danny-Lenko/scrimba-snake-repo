"use strict"

window.onload = function() {
   view.renderGrid();
   view.renderSnake();
   document.querySelector('#startBtn').addEventListener('click', controller.startGame);
   document.onkeyup = controller.controlSnake;
}

let view = {
   appleIndex: 0,

   renderGrid: function() {
      const gridEl = document.querySelector('.gridEl');
      for (let i = 0; i < model.gridSize; i++) {
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
   },

   renderApple: function() {
      const gridElList = document.getElementsByClassName('square');
      gridElList[this.appleIndex].classList.remove('apple');
      do {
         this.appleIndex = Math.floor(Math.random() * model.gridSize);
      } while(gridElList[this.appleIndex].classList.contains('snake'));
      gridElList[this.appleIndex].classList.add('apple');
   }

};

let model = {
   snake: [2, 1, 0],
   gridSize: 100,
   tail: 0,

   moveSnake: function() {
      const gridElList = document.getElementsByClassName('square');
      model.tail = model.snake[model.snake.length - 1];
      model.snake.pop();
      gridElList[model.tail].classList.remove('snake');
      model.snake.unshift(model.snake[0] + controller.direction);
      model.growSnake();
      view.renderSnake();
   },

   eatApple: function() {
      if (this.snake[0] === view.appleIndex) {
         view.renderApple();
         return true;
      }
   },

   growSnake: function() {
      const gridElList = document.getElementsByClassName('square');
      if (this.eatApple()) {
         gridElList[this.tail].classList.add('snake');
         this.snake.push(this.tail);
      }
   }
   
};

let controller = {
   direction: 1,

   startGame: function() {
      let intervalID = window.setInterval(model.moveSnake, 1000);
      view.renderApple();
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



