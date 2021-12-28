"use strict"

window.onload = function() {
   view.renderGrid();
}

let view = {

   renderGrid: function() {
      const gridEl = document.querySelector('.gridEl');
      const square = `<div class='square'><div>`;
      for (let i = 0; i < 100; i++) {
         gridEl.innerHTML += square;
      }
   }
};



