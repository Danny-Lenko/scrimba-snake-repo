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
   document.querySelector('#wallsOff').addEventListener('click', model.wallsOff);
   document.querySelector('#wallsOn').addEventListener('click', model.wallsOn);
   
   document.querySelector('#speed16').addEventListener('click', model.speedLimit16);
   document.querySelector('#speed20').addEventListener('click', model.speedLimit20);
   document.querySelector('#speedNormal').addEventListener('click', model.speedNormal);

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
   wallsEnabled: true,
   speedLimit: 100,

   moveSnake: function() {
      const gridElList = document.getElementsByClassName('square');
      model.gridLength = Math.sqrt(model.gridSize);

      if (model.wallsEnabled) {
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
      }

      model.tail = model.snake[model.snake.length - 1];
      model.snake.pop();
      gridElList[model.tail].classList.remove('snake');
      model.snake.unshift(model.snake[0] + controller.direction);
      if (!model.wallsEnabled) {
         travelSnakeThroughWalls(gridElList);
      }
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
         checkSpeedLimits(this.speedLimit);
         return true;
      }
   },

   growSnake: function(grid) {
      if (this.eatApple()) {
         grid[this.tail].classList.add('snake');
         this.snake.push(this.tail);
      }
   },

   // ----------------
   // modes settings

   biggerGrid: function() {
      clearInterval(controller.intervalID);
      changeGridSize('300px', '300px');
      restartModeChanges();
      changeButton(document.querySelector('#biggerGrid'), document.querySelector('#smallerGrid'));
   },
   smallerGrid: function() {
      clearInterval(controller.intervalID);
      changeGridSize('200px', '200px');
      restartModeChanges();
      changeButton(document.querySelector('#smallerGrid'), document.querySelector('#biggerGrid'));
   },

   thinerSnake: function() {
      clearInterval(controller.intervalID);
      model.gridSize *= 4;
      changeSnakeWidth('10px', '10px');
      restartModeChanges();
      changeButton(document.querySelector('#thinerSnake'), document.querySelector('#thickerSnake'));
   },
   thickerSnake: function() {
      clearInterval(controller.intervalID);
      model.gridSize /= 4;
      changeSnakeWidth('20px', '20px');
      restartModeChanges()
      changeButton(document.querySelector('#thickerSnake'), document.querySelector('#thinerSnake'));
   },

   wallsOff: function() {
      document.querySelector('.gridEl').style.border = '2px solid darkgray';
      model.wallsEnabled = false;
      changeButton(document.querySelector('#wallsOff'), document.querySelector('#wallsOn'));
   },
   wallsOn: function() {
      document.querySelector('.gridEl').style.border = '2px solid black';
      model.wallsEnabled = true;
      changeButton(document.querySelector('#wallsOn'), document.querySelector('#wallsOff'));
   },

   speedLimit16: function() {
      document.querySelector('#speedMessage').innerHTML = '-- Speed Limit 16 --';
      model.speedLimit = 16;
      changeButton(document.querySelector('#speed16'), document.querySelector('#speed20'));
   },
   speedLimit20: function() {
      document.querySelector('#speedMessage').innerHTML = '-- Speed Limit 20 --';
      model.speedLimit = 20;
      changeButton(document.querySelector('#speed20'), document.querySelector('#speedNormal'));
   },
   speedNormal: function() {
      document.querySelector('#speedMessage').innerHTML = '-- No Speed Limits --';
      model.speedLimit = 100;
      changeButton(document.querySelector('#speedNormal'), document.querySelector('#speed16'));
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
      if ( (e.key === 'ArrowDown' || e.key === 'Down') 
         && controller.direction !== -model.gridLength ) {
            controller.direction = model.gridLength;
      } else if ( (e.key === 'ArrowUp' || e.key === 'Up')
         && controller.direction !== model.gridLength ) {
            controller.direction = -model.gridLength;
      } else if ( (e.key === 'ArrowRight' || e.key === 'Right') 
         && controller.direction !== -1 ) {
            controller.direction = 1;
      } else if ( (e.key === 'ArrowLeft' || e.key === 'Left') 
         && controller.direction !== 1) {
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

// -------------------
// auxiliary functions

function changeGridSize(width, height) {
   const gridEl = document.querySelector('.gridEl');
   view.clearGrid();
   gridEl.style.width = width;
   gridEl.style.height = height;
   let oneSideSquares = parseInt(width) / model.squareSize;
   model.gridSize = oneSideSquares * oneSideSquares;
   view.renderGrid();

   const gridElList = document.getElementsByClassName('square');
   for (let i = 0; i < gridElList.length; i++) {
      gridElList[i].style.width = model.squareSize + 'px';
      gridElList[i].style.height = model.squareSize + 'px';
   }
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
   model.squareSize = parseInt(width);
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

function travelSnakeThroughWalls(grid) {
   if (model.snake[1] % model.gridLength === model.gridLength - 1 
      && controller.direction === 1) {
         model.snake[0] -= model.gridLength;
   } else if (model.snake[1] % model.gridLength === 0 
      && controller.direction === -1) {
         model.snake[0] += model.gridLength;
   } else if (model.snake[1] - model.gridLength < 0
      && controller.direction === -model.gridLength) {
         model.snake[0] = model.snake[0] + model.gridSize; 
   } else if (model.snake[1] + model.gridLength >= model.gridSize
      && controller.direction === model.gridLength) {
         model.snake[0] -= model.gridSize;
   } else if (grid[model.snake[1] + controller.direction].classList.contains('snake')) {
      controller.btnClickable = true;
      return clearInterval(controller.intervalID);
   }
}

function checkSpeedLimits(limit) {
   if (model.score === limit) {
      model.levelUp = 1;
   } 
}




