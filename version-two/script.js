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
   },

   renderScore: function() {
      const scoreEl = document.querySelector('#scoreEl');
      scoreEl.innerHTML = model.score;
   }

};

let model = {
   snake: [2, 1, 0],
   gridSize: 100,
   tail: 0,
   score: 0,
   speed: 1000,
   levelUp: .9,

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
         clearInterval(controller.intervalID);
         this.speed *= this.levelUp;
         controller.intervalID = window.setInterval(this.moveSnake, this.speed);
         view.renderApple();
         this.score++;
         view.renderScore();
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
   intervalID: 0,

   startGame: function() {
      controller.intervalID = window.setInterval(model.moveSnake, model.speed);
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



