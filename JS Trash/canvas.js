//Variables
const pi = Math.PI;
var mouse = {
    'x': 0,
    'y': 0,
};
var mouseDown = {
    'down': 0,
    'x': 0,
    'y': 0,
}
var pointer = {
    'i': 0,
    'j': 0,
}
var pointerValues = {
    37: {'x':-1, 'y':0},
    38: {'x':0, 'y':-1},
    39: {'x':1, 'y':0},
    40: {'x':0, 'y':1},
}


var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }



//Selectors
const canvas = document.querySelector('.canvas');
canvas.setAttribute("tabindex", 0);

const c = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const pointerImg = document.querySelector('.pointer');
//console.log(pointer);




//Event Listeners
window.addEventListener('resize', function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
})
canvas.onmousemove = function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    //console.log(mouse);
}
canvas.onmousedown = function(e) {
    mouseDown.down = true;
    mouseDown.x = e.clientX;
    mouseDown.y = e.clientY;
}
canvas.onmouseup = function(e) {
    mouseDown.down = false;
}
canvas.addEventListener('keydown', movePointer);



//Testing




//Functions
function Cell(i, j, x, y, size) {
    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = 'black';

    this.update = function() {
        this.draw();
    }

    this.draw = function() {
        c.beginPath()
        c.rect(this.x, this.y, this.size, this.size);
        c.strokeStyle = 'black';
        c.fillStyle = this.color;
        c.stroke(); c.fill();
        c.closePath();
    }

}

function Pointer(image, i, j, x, y, size) {
    this.image = image;
    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.size = size;

    this.update = function() {
        this.draw();
    }

    this.draw = function() {
        c.drawImage(this.image, this.x, this.y, this.size-1, this.size - 1);
    }

    this.move = function(dx, dy) {
        this.x += dx*(this.size+1);
        this.y += dy*(this.size+1);
        this.i += dy;
        this.j += dx;
    }
}


var gridWidth = 50;
var gridHeight = 20;
var gridSize = 30;

var cells = [];
for(let i=0;i<gridHeight;i++) {
    cells [i] = new Array(gridWidth);
}

function init() {

    var xStart = (canvas.width - gridWidth*gridSize)/2;
    var yStart = (canvas.height - gridHeight*gridSize)/2;

    var xPos = xStart;
    var yPos = yStart;
    for(let i=0;i<gridHeight;i++){
        for(let j=0;j<gridWidth;j++) {
            cells[i][j] = new Cell(i, j, xPos, yPos, gridSize);
            xPos += gridSize;
        }
        yPos += gridSize;
        xPos = xStart;
    }
}
init();


for(let i=0;i<gridHeight;i++){
    for(let j=0;j<gridWidth;j++){
        cells[i][j].update();
    }
}

window.onload = function() {
    let randI = Math.floor(Math.random()*gridHeight), randJ = Math.floor(Math.random()*gridWidth);
    let pointerX = cells[randI][randJ].x, pointerY = cells[randI][randJ].y, pointerSize = cells[randI][randJ].size;
    pointer = new Pointer(pointerImg, randI, randJ, pointerX, pointerY, pointerSize);
    pointer.update();
    canvas.focus();
}

//c.drawImage(pointer, 300, 300);

function animate() {
    requestAnimationFrame(animate);
    if(pressedKeys[32]==true) return;
    
    //c.clearRect(0, 0, canvas.width, canvas.height);

    
    
}
animate();


//Cell Control Panel
function clearCell(i, j){
    c.clearRect(cells[i][j].x, cells[i][j].y, cells[i][j].size, cells[i][j].size);
}
function updateCell(i, j){
    cells[i][j].update();
}


function movePointer(e) {
    let keyCode = e.keyCode;
    let dx = pointerValues[keyCode].x, dy = pointerValues[keyCode].y;
    
    clearCell(pointer.i, pointer.j);
    updateCell(pointer.i, pointer.j)

    pointer.move(dx, dy);
    pointer.update();

    console.log(pointer);
}


function mouseInRange(x, y, size) {
    let x1 = mouse.x, y1 = mouse.y;
    if(x1>=x && x1<x+size && y1>=y && y1<y+size) return true; else return false;
}


//Hover code
/*
let hoverX, hoverY, hoverSize, hoverI, hoverJ;


    let found = false;
    for(let i=0;i<gridHeight;i++){
        for(let j=0;j<gridWidth;j++){
            if(mouseInRange(cells[i][j].x, cells[i][j].y, cells[i][j].size)){
                cells[i][j].color = 'black';
                hoverX = cells[i][j].x;
                hoverY = cells[i][j].y;
                hoverSize = cells[i][j].size;
                hoverI = i; hoverJ = j;
                found = true; break;
            }
        }
        if(found) break;
    }
    
    c.clearRect(hoverX, hoverY, hoverSize, hoverSize);


    if(hoverI && hoverJ || (hoverI==0 || hoverJ==0))
    cells[hoverI][hoverJ].update();
*/