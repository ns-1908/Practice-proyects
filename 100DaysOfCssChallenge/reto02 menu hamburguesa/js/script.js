const menu = document.querySelector('.menu');

let lineTop = document.querySelector('.line1');
let lineCenter = document.querySelector('.line2');
let lineBottom = document.querySelector('.line3');

menu.addEventListener('click', ()=>{
    lineTop.classList.toggle('top');
    lineCenter.classList.toggle('center');
    lineBottom.classList.toggle('bottom');
});
