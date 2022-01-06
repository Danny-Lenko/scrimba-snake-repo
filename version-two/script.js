"use strict"

window.onload = function() {
   view.renderGrid();
   view.renderSnake();
   document.querySelector('#startBtn').addEventListener('click', controller.startGame);
   document.onkeyup = controller.controlSnake;
   document.querySelector('#modeBtn').addEventListener('click', controller.chooseMode);
   
   document.querySelector('#biggerGrid').addEventListener('click', model.biggerGrid);
   document.querySelector('#smallerGrid').addEventListener('click', model.smallerGrid);
   document.querySelector('#thinerSnake').addEventListener('click', model.thinerSnake);
   document.querySelector('#thickerSnake').addEventListener('click', model.thickerSnake);

   document.querySelector('#exitModal').addEventListener('click', model.exitModal);
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
         if (gridElList[model.snake[0]]) {
            gridElList[model.snake[i]].classList.add('snake');
         }
      }
   },

   renderApple: function() {
      const gridElList = document.getElementsByClassName('square');
      if (gridElList[this.appleIndex]) {
         gridElList[this.appleIndex].classList.remove('apple');
      }
      do {
         this.appleIndex = Math.floor(Math.random() * model.gridSize);
      } while(gridElList[this.appleIndex].classList.contains('snake'));
      gridElList[this.appleIndex].classList.add('apple');
   },

   renderScore: function() {
      const scoreEl = document.querySelector('#scoreEl');
      scoreEl.innerHTML = model.score;
   },

   clearGrid: function() {
      const gridEl = document.querySelector('.gridEl');
      while(gridEl.firstChild) {
         gridEl.removeChild(gridEl.firstChild);
      }
   },

};

let model = {
   snake: [2, 1, 0],
   gridSize: 100,
   gridLength: 0,
   tail: 0,
   score: 0,
   speed: 1000,
   levelUp: .9,
   squareSize: 20,

   moveSnake: function() {
      const gridElList = document.getElementsByClassName('square');
      model.gridLength = Math.sqrt(model.gridSize);

      if (
         model.snake[0] % model.gridLength === model.gridLength - 1 
         && controller.direction === 1

         || model.snake[0] % model.gridLength === 0 
         && controller.direction === -1

         || model.snake[0] - model.gridLength < 0
         && controller.direction === -model.gridLength

         || model.snake[0] + model.gridLength >= model.gridSize
         && controller.direction === model.gridLength

         || gridElList[model.snake[0] + controller.direction].classList.contains('snake')
         ) {
            controller.btnClickable = true;
            return clearInterval(controller.intervalID);
      }

      model.tail = model.snake[model.snake.length - 1];
      model.snake.pop();
      gridElList[model.tail].classList.remove('snake');
      model.snake.unshift(model.snake[0] + controller.direction);
      model.growSnake(gridElList);
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

   growSnake: function(grid) {
      if (this.eatApple()) {
         grid[this.tail].classList.add('snake');
         this.snake.push(this.tail);
      }
   },

   biggerGrid: function() {
      clearInterval(controller.intervalID);
      changeGridSize('300px', '300px', 225);
      restartModeChanges();
      changeButton(document.querySelector('#biggerGrid'), document.querySelector('#smallerGrid'));
   },
   smallerGrid: function() {
      clearInterval(controller.intervalID);
      changeGridSize('200px', '200px', 100);
      restartModeChanges();
      changeButton(document.querySelector('#smallerGrid'), document.querySelector('#biggerGrid'));
   },

   thinerSnake: function() {
      model.gridSize *= 4;
      changeSnakeWidth('10px', '10px');
      changeButton(document.querySelector('#thinerSnake'), document.querySelector('#thickerSnake'));
   },
   thickerSnake: function() {
      model.gridSize = 100;
      changeSnakeWidth('20px', '20px');
      changeButton(document.querySelector('#thickerSnake'), document.querySelector('#thinerSnake'));
   },

   exitModal: function() {
      document.querySelector('.mode').style.display = 'none';
   }
   
};

let controller = {
   direction: 1,
   intervalID: 0,
   btnClickable: true,

   startGame: function() {
      if (controller.btnClickable) {
         controller.resetGame();
         controller.intervalID = window.setInterval(model.moveSnake, model.speed);
         view.renderApple();
         controller.btnClickable = false;   
      }
   },

   controlSnake: function(e) {
      if (e.key === 'ArrowDown' || e.key === 'Down') {
         controller.direction = model.gridLength;
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
         controller.direction = -model.gridLength;
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
         controller.direction = 1;
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
         controller.direction = -1;
      }
   },

   resetGame: function() {
      const gridElList = document.getElementsByClassName('square');
      clearInterval(controller.intervalID);
      for (let i = 0; i < model.gridSize; i++) {
         gridElList[i].classList.remove('snake');
      }
      model.snake = [2, 1, 0];
      model.tail = 0;
      model.score = 0;
      model.speed = 1000;
      view.renderSnake();
      this.direction = 1;
      this.intervalID = 0;
      view.renderScore();
   },

   chooseMode: function() {
      document.querySelector('.mode').style.display = 'block';
   }

};

function changeGridSize(width, height, gridSize) {
   const gridEl = document.querySelector('.gridEl');
   view.clearGrid();
   gridEl.style.width = width;
   gridEl.style.height = height;
   model.gridSize = gridSize;
   view.renderGrid();
   view.renderSnake();
}

function changeSnakeWidth(width, height) {
   view.clearGrid();
   view.renderGrid();
   const gridElList = document.getElementsByClassName('square');
   for (let i = 0; i < gridElList.length; i++) {
      gridElList[i].style.width = width;
      gridElList[i].style.height = height;
   }
   view.renderSnake();
}

function restartModeChanges() {
   clearInterval(controller.intervalID);
   controller.resetGame();
   if (!controller.btnClickable) {
      controller.btnClickable = true;
   }
}

function changeButton(hide, show) {
   hide.style.display = 'none';
   show.style.display = 'inline-block';
}



