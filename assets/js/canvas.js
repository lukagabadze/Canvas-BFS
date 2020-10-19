//Selectors
canvas = document.querySelector('.canvas');
canvas.setAttribute("tabindex", 0);
canvas.focus();
startPointerImg = document.querySelector('.pointer');


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
var startPoint, endPoint;

//Functions
function init() {
    resizeGrid();
    initCells();
    drawGrid();
    createPointers();
}
init();

function update(){
    requestAnimationFrame(update)

}
update();

function Pointer(image, x, y, angle) {
    this.image = image;
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
        c.drawImage(this.image, -grid.size/2, -grid.size/2, grid.size, grid.size);
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
    grid.size = Math.floor(windowX/grid.x);
    grid.size += 1;
    
    let canvasX = grid.x * grid.size;
    let canvasY = grid.y * grid.size;

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
            cells[i][j] = {
                'x': i*grid.size,
                'y': j*grid.size,
            }
        }
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


function createPointers() {
    let startingX=4, startingY=6;
    pointer = new Pointer(startPointerImg, startingX, startingY, 0);
    pointer.update();
}


function clearCell(i, j) {
    let posX = i * grid.size;
    let posY = j * grid.size;
    c.clearRect(posX+1, posY+1, grid.size-2, grid.size-2);
}

function colorCell(i, j, color) {
    c.beginPath();
    c.rect(i*grid.size+1, j*grid.size+1, grid.size-2, grid.size-2);
    c.fillStyle = color;
    c.fill();
    c.closePath();
}


function movePointer(e) {
    if(!pointerValues[e.keyCode] || typeof pointer == 'undefined') return;

    let dx = pointerValues[e.keyCode].x;
    let dy = pointerValues[e.keyCode].y;
    clearCell(pointer.x, pointer.y);
    pointer.move(dx, dy);

    console.log(e);
}





//Testing Zone Proced with caution
/* c.rect(200,200,300,100)
c.stroke();
c.fillStyle='black';
c.fill();
c.clearRect(200,200,300,100);
c.rect(200,200,300,100);
c.fillStyle = 'green';
c.fill();
//c.clearRect(201,201,298,98); */
//c.drawImage(startPointerImg, 200, 200, grid.size, grid.size);


/* !!! USEFUL ROTATING WITH TRANSLATE AND SAVE RESTORE !!! FUCK YOU !!! */
/*c.save();
c.translate(200, 200)
c.rotate(pi*0.5)
c.drawImage(pointerImg, -100, -100, 200, 200);
c.restore();*/