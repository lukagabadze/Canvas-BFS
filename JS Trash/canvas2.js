//Selectors
canvas = document.querySelector('.canvas');
canvas.focus();
pointerImg = document.querySelector('.pointer');



//Variables
const pi = Math.PI;
const c = canvas.getContext('2d');
var grid = {
    'x':60,
    'y':20,
    'size':20,
}



//Event Listeners
window.addEventListener('resize', function() {
    //init();
})



var cells = [];
for(let i=0;i<grid.x;i++) {
    cells[i] = new Array(grid.y);
}
var pointer;

//Functions
function init() {
    resizeGrid();
    initCells();
    pointer = new Pointer(25, 1, grid.size);
    pointer.update();
}
init();

function update(){
    requestAnimationFrame(update)

}
update();


function resizeGrid() {
    let windowX = window.innerWidth;
    windowX -= windowX*0.1;
    grid.size = windowX/grid.x;
    let canvasX = windowX, canvasY = grid.y * grid.size;
    canvas.width = canvasX;
    canvas.height = canvasY;
}
function initCells() {
    cells = [];
    for(let i=0;i<grid.x;i++) {
        cells[i] = new Array(grid.y);
    }

    for(let i=0;i<grid.x;i++) {
        for(let j=0;j<grid.y;j++) {
            cells[i][j] = new Cell(i, j, grid.size);
            cells[i][j].update();
        }
    }
}


function Cell(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.update = function() {
        this.draw();
    }

    this.draw = function() {
        c.beginPath();
        c.rect(this.x*this.size, this.y*this.size, this.size, this.size);
        c.strokeStyle = 'black';
        c.stroke();
        c.closePath();
    }
}

function Pointer(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.update = function() {
        this.draw();
    }

    this.draw = function() {
        
    }
}


function drawGrid() {
    c.beginPath();
    let totalX = grid.x * grid.size;
    let totalY = grid.y * grid.size;
    c.lineWidth = totalX * 0.001;

    for(let i=grid.size; i<=totalX; i+=grid.size){
        c.moveTo(i, 0);
        c.lineTo(i, totalY);
        c.stroke();
    }

    for(let i=grid.size; i<=totalY; i+=grid.size){
        c.moveTo(0,i);
        c.lineTo(totalX, i);
        c.stroke();
    }
    c.closePath();
}