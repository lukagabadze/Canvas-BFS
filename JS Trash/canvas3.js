//Selectors
canvas = document.querySelector('.canvas');
canvas.setAttribute("tabindex", 0);
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
var pointerValues = {
    37: {'x':-1, 'y':0},
    38: {'x':0, 'y':-1},
    39: {'x':1, 'y':0},
    40: {'x':0, 'y':1},
}


//Event Listeners
window.addEventListener('resize', function() {
    //init();
})
canvas.addEventListener('keydown', movePointer);


var cells = [];
for(let i=0;i<grid.x;i++) {
    cells[i] = new Array(grid.y);
}


//Functions
function init() {
    resizeGrid();
    initCells();
    createPointer();
}
init();

function update(){
    requestAnimationFrame(update)

}
update();


function Cell(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = 'white';

    this.update = function() {
        this.draw();
    }

    this.draw = function() {
        c.beginPath();
        c.rect(this.x*this.size, this.y*this.size, this.size, this.size);
        c.strokeStyle = 'black';
        c.stroke();
        //c.fillStyle=this.color; c.fill();  // <-- AM DEDAMOTYNULIS BRALI IYO
        c.closePath();
    }

    this.colorCell = function(color) {
        this.color = color;
        this.update();
    }
    this.resetCell = function(color) {
        this.color = 'white';
        this.update();
    }
}

function Pointer(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;

    this.update = function() {
        this.draw();
    }

    this.draw = function() {
        let posX = this.x * grid.size;
        let posY = this.y * grid.size;
        c.save();
        c.translate(posX + grid.size/2, posY + grid.size/2);
        c.rotate(this.angle);
        c.drawImage(pointerImg, -grid.size/2, -grid.size/2, grid.size, grid.size);
        c.restore();
    }

    this.clearPointer = function() {
        c.clearRect(this.x * grid.size, this.y * grid.size, grid.size, grid.size);
        cells[this.x][this.y].update();
        console.log(this.x, this.y, grid.size)
    }

    this.move = function(dx, dy) {
        if(this.x + dx >= 0 && this.x + dx < grid.x)
            this.x += dx;
        if(this.y + dy >= 0 && this.y + dy < grid.y)
            this.y += dy;
        if(dy==-1) this.angle = pi * 0;
        if(dx==1) this.angle = pi*0.5;
        if(dy==1) this.angle = pi;
        if(dx==-1) this.angle = pi*1.5;
        //console.log(dx, dy, this.angle/pi)
        this.update();
    }

}


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
            cells[i][j].draw();
        }
    }
}

function clearCell(i, j) {
    let posX = i * grid.size;
    let posY = j * grid.size;
    c.clearRect(posX, posY, grid.size, grid.size);
}
function updateCell(i, j) {
    cells[i][j].update();
}


function createPointer() {
    pointer = new Pointer(5, 7, pi);
    pointer.update();
}

function movePointer(e) {
    if(!pointerValues[e.keyCode] || typeof pointer == 'undefined') return;

    let dx = pointerValues[e.keyCode].x;
    let dy = pointerValues[e.keyCode].y;
    //pointer.clearPointer();
    clearCell(pointer.x, pointer.y);
    updateCell(pointer.x, pointer.y);
    pointer.move(dx, dy);
}


//Testing Zone Proced with caution
c.beginPath();
c.rect(200, 200, 500 ,100);
//c.lineWidth = 56;
c.stroke();


/* !!! USEFUL ROTATING WITH TRANSLATE AND SAVE RESTORE !!! FUCK YOU !!! */
/*c.save();
c.translate(200, 200)
c.rotate(pi*0.5)
c.drawImage(pointerImg, -100, -100, 200, 200);
c.restore();*/