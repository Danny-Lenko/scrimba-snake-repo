"use strict"

window.onload = function() {
   view.renderGrid();
   view.renderSnake();
}

let view = {
   snake: [2, 1, 0],

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
      for (let i = 0; i < this.snake.length; i++) {
         gridElList[this.snake[i]].classList.add('snake');
      }
   }

};



