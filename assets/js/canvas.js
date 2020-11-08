//Selectors
canvas = document.querySelector('.canvas');
canvas.setAttribute("tabindex", 0);
canvas.focus();

startPointerImg = document.querySelector('.pointer');
destinationImg = document.querySelector('.destination');

var canvasPos = canvas.getBoundingClientRect();

const selectButton = document.querySelector('.select');
const wallButton = document.querySelector('.wall');
const removeButton = document.querySelector('.remove');
const startButton = document.querySelector('.start');
const stopButton = document.querySelector('.stop');
const resetButton = document.querySelector('.reset');






















//fuck me
var functionVar;



//Variables
const pi = Math.PI;
const c = canvas.getContext('2d');
var grid = {
    'x':60,
    'y':20,
    'size':20,
    'color': 'white',
    'time': 5,
    'successTime': 30,
}
var wallColor = 'black';
var prevWall = {
    'i': 0,
    'j': 0,
}
var pointerValues = {
    37: {'x':-1, 'y':0},
    38: {'x':0, 'y':-1},
    39: {'x':1, 'y':0},
    40: {'x':0, 'y':1},
}
var mouse = {
    'x': 0,
    'y': 0,
    'realX': 0,
    'realY': 0,
};
var mouseDown = {
    'down': 0,
    'x': 0,
    'y': 0,
}
var canvasOffset = {
    'x': 0,
    'y': canvasPos.top,
}

var State = 'select'; //   1) Select    2) Wall   3) Remove



















document.onmousemove = function() {
    //console.log(canvasOffset.x, canvasOffset.y, mouse.x, mouse.y, mouse.realX, mouse.realY);
    //console.log(innerWidth)
}
















//Event Listeners
window.addEventListener('resize', function() {
    init();
})
canvas.addEventListener('keydown', arrowPointer);

window.onmousemove = function(e) {
    mouse.realX = e.pageX;
    mouse.realY = e.pageY;
    if(mouseOffScreen()){
        pointer.hold = false;
        mouseDown.down = false;
        clearAllPrev();
        //console.log('outo')
    }
}


canvas.onmousemove = function(e) {
    mouse.realX = e.clientX;
    mouse.realY = e.clientY;
    mouse.x = e.clientX - canvasOffset.x;
    mouse.y = e.clientY - canvasOffset.y;
    
    if(State == 'select')
        movePointer();
    
    if(State == 'wall')
        wallInit();

    if(State == 'remove')
        removeCell();
    
}
canvas.onmousedown = function(e) {
    mouseDown.down = true;
    mouseDown.x = e.clientX - canvasOffset.x;
    mouseDown.y = e.clientY - canvasOffset.y;
    checkPointers();
    if(State == 'wall')
        wallInit();
    if(State == 'remove')
        removeCell();
}
canvas.onmouseup = function(e) {
    mouseDown.down = false;
    pointer.hold = false;
    destination.hold = false;
}

//Buttons
selectButton.onclick = function() {
    if(State != 'start')
        State = 'select';
}
wallButton.onclick = function() {
    if(State != 'start')
        State = 'wall';
}

removeButton.onclick = function() {
    if(State != 'start'){
        State='remove';
    }
}

startButton.onclick = function() {
    startButton.style.display = 'none';
    stopButton.style.display = 'inline';
    
    State = 'start';

    BFS();
}
stopButton.onclick = function() {
    stopButton.style.display = 'none';
    startButton.style.display = 'inline';

    State = 'select';

    resetGrid();
    clearInterval(functionVar);
}

resetButton.onclick = function() {
    if(State=='start') return;

    for(let i=0;i<grid.x;i++){
        for(let j=0;j<grid.y;j++){
            cellMap[i][j]='0';
            cells[i][j].color = grid.color;
            colorCell(i, j, grid.color)
        }
    }
}



































var cells = [];
var cellMap = [];
for(let i=0;i<grid.x;i++) {
    cells[i] = new Array(grid.y);
    cellMap[i] = new Array(grid.y);
    for(let j=0;j<grid.y;j++) {
        cellMap[i][j] = '0';
    }
}
var startPoint, endPoint;


//Functions
function init() {
    resizeGrid();
    initCells();
    drawGrid();
    resetGrid();
    createPointers();
}
init();

function update(){
    requestAnimationFrame(update)

    //Updating Pointer and Destination
    clearCell(pointer.i, pointer.j, grid.color);
    pointer.update();
    clearCell(destination.i, destination.j, grid.color);
    destination.update();

}
update();






























function createPointers() {
    let startingX=22, startingY=8;
    pointer = new Pointer(startPointerImg, startingX, startingY, 0);
    pointer.update();
    
    let destX = 34, destY = 6;
    destination = new Pointer(destinationImg, destX, destY, 0);
    destination.update();
}

function Pointer(image, i, j, angle) {
    this.image = image;
    this.i = i;
    this.j = j;
    this.x = i*grid.size;
    this.y = j*grid.size;
    this.angle = angle;
    this.hold = false;

    this.update = function() {
        clearCell(this.i, this.j)

        this.i = (this.x - (this.x % grid.size)) / grid.size;
        this.j = (this.y - (this.y % grid.size)) / grid.size;
        this.i = Math.min(this.i, grid.x-1);
        this.j = Math.min(this.j, grid.y-1);

        cellMap[i][j] = '0';

        clearCell(this.i, this.j);

        this.draw();
    }

    this.draw = function() {
        posX =  this.i*grid.size;
        posY =  this.j*grid.size;

        c.save();
        c.translate(posX + grid.size/2, posY + grid.size/2);
        c.rotate(this.angle);
        c.drawImage(this.image, -grid.size/2, -grid.size/2, grid.size, grid.size);
        c.restore();
    }

    this.clearPointer = function() {
        clearCell(this.i, this.j);
    }


    this.followMouse = function() {
        if(mouseDown.down == false) return;
        this.x =  mouse.x;
        this.y =  mouse.y;

        //console.log(this.x, this.y);

        this.clearPointer();
        this.update();
    }

    this.move = function(dx, dy) {
        if(this.i + dx >= 0 && this.i + dx < grid.x)
            this.x += dx*grid.size;
        if(this.j + dy >= 0 && this.j + dy < grid.y)
            this.y += dy*grid.size;
        if(dy==-1) this.angle = pi * 0;
        if(dx==1) this.angle = pi*0.5;
        if(dy==1) this.angle = pi;
        if(dx==-1) this.angle = pi*1.5;

        this.update();
    }

}
function checkPointers() {
    let x1 = pointer.i * grid.size, y1 = pointer.j * grid.size, s = grid.size;
    let x2 = mouseDown.x, y2 = mouseDown.y;
    if(x2>x1 && x2<x1+s && y2>y1 && y2<y1+s){
        //console.log('hello');
        pointer.hold = true;
    }
    x1 = destination.i * grid.size; y1 = destination.j * grid.size; s = grid.size;
    x2 = mouseDown.x; y2 = mouseDown.y;
    if(x2>x1 && x2<x1+s && y2>y1 && y2<y1+s){
        destination.hold = true;
    }
}


































function mouseOffScreen() {
    //console.log(mouse.realX, mouse.realY, canvasOffset, canvas.width, canvas.height)
    //WHAT THE FUCK IS THIS SOMEBODY SHOOT ME
    if(mouse.realX < canvasOffset.x || mouse.realY < canvasOffset.y || mouse.realX > canvas.width + canvasOffset.x || mouse.realY > canvas.height + canvasOffset.y){
        return true;
    }else{
        return false;
    }
}

function resizeGrid() {
  
    var canvasPos = canvas.getBoundingClientRect();

    let windowX = window.innerWidth;
    windowX -= windowX*0.1;
    grid.size = Math.floor(windowX/grid.x);
    grid.size += 1;

    canvasOffset.x = (window.innerWidth - (grid.size*grid.x))/2;


    canvasOffset.y = canvasPos.top;

    let canvasX = grid.x * grid.size;
    let canvasY = grid.y * grid.size;

    canvas.width = canvasX;
    canvas.height = canvasY;

    //canvasOffset.x = (window.innerWidth - (grid.size*grid.x))/2;
    //canvasOffset.x = canvasPos.left;
    //canvasOffset.y = canvasPos.top;

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
                'color': grid.color,
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




function clearCell(i, j) {
    let posX = i * grid.size;
    let posY = j * grid.size;
    c.clearRect(posX+1, posY+1, grid.size-2, grid.size-2);
}

function colorCell(i, j, color) {
    clearCell(i, j);
    c.beginPath();
    c.rect(i*grid.size+1, j*grid.size+1, grid.size-2, grid.size-2);
    c.fillStyle = color;
    c.fill();
    c.closePath();
}


function wallInit() {
    if(mouseOffScreen()) return;

    let wallI = PosToInd(mouse.x), wallJ = PosToInd(mouse.y);

    if((wallI == pointer.i && wallJ == pointer.j) || (wallI == destination.i && wallJ == destination.j)) return;

    if(mouseDown.down == false){
        colorCell(prevWall.i, prevWall.j, cells[prevWall.i][prevWall.j].color);
    } else {
        cells[wallI][wallJ].color = wallColor;
        cellMap[wallI][wallJ] = 'X';
    }

    colorCell(wallI, wallJ, wallColor);
    prevWall.i = wallI;
    prevWall.j = wallJ;
}
function removeCell() {
    if(mouseOffScreen()) return;

    let removeI = PosToInd(mouse.x), removeJ = PosToInd(mouse.y);

    if(mouseDown.down == true){
        cells[removeI][removeJ].color = grid.color;
        cellMap[removeI][removeJ] = '0';
        clearCell(removeI, removeJ);
    }
}



function movePointer() {
    if(mouseDown.down==false) return;

    if(pointer.hold == true && !pointerCollision(mouse.x, mouse.y, destination)){
        let oldI = pointer.i, oldJ = pointer.j;
        pointer.x = mouse.x;
        pointer.y = mouse.y;
        pointer.clearPointer();
        pointer.update();
        colorCell(oldI, oldJ, cells[oldI][oldJ].color);
    }
    if(destination.hold == true && !pointerCollision(mouse.x, mouse.y, pointer)){
        let oldI = destination.i, oldJ = destination.j;
        destination.x = mouse.x;
        destination.y = mouse.y;
        destination.clearPointer();
        destination.update();
        colorCell(oldI, oldJ, cells[oldI][oldJ].color);
    }
}
function pointerCollision(x, y, a) {
    //console.log((x - (x%grid.size))/grid.size, (y - (y%grid.size))/grid.size, a.i, a.j);
    if((PosToInd(x)==a.i) && (PosToInd(y)==a.j)){
        return true;
    }else{
        return false;
    }
}


function clearAllPrev() {
    if(cellMap[prevWall.i][prevWall.j] != 'X')
        clearCell(prevWall.i, prevWall.j, grid.color);
    //console.log(prevWall, cellMap[prevWall.i][prevWall.j])
}


function PosToInd(a) {
    return (a - (a%grid.size))/grid.size;
}


//Testing Zone Proced with caution



var test = setInterval(test, 1000);

function test() {

}

//TRAAASHHHHH
function arrowPointer(e) {
    if(!pointerValues[e.keyCode] || typeof pointer == 'undefined') return;

    let dx = pointerValues[e.keyCode].x;
    let dy = pointerValues[e.keyCode].y;
    clearCell(pointer.i, pointer.j);
    pointer.move(dx, dy);
}


var queue = [];
var queueInd = 0;
var visited = [];
function BFS() {
    queue = [];
    visited = [];
    queueInd = -1;
    queue.push({'i':pointer.i, 'j':pointer.j, 'prev':0, });
    visited = [];
    for(let i=0;i<grid.x;i++){
        visited[i] = new Array(grid.y);
        for(let j=0;j<grid.y;j++) {
            visited[i][j] = 0;
        }
    }

    functionVar = setInterval(bfsTick, grid.time);
}

function bfsTick() {
    queueInd+=1;
    let cell = queue[queueInd];
    
    //console.log(cell)

    if(typeof cell == 'undefined'){
        //FAILURE
        alert('make it possible u dumb piece of shit!');
        clearInterval(functionVar);
        return;
    }
    
    colorCell(cell.i, cell.j, 'green');

    if(cell.i == destination.i && cell.j == destination.j){
        //SUCCESS
        clearInterval(functionVar);
        
        functionVar = setInterval(drawPathBFS, grid.successTime)
    }

    //Check all 4 Directions
    if(cell.i + 1 < grid.x){}
        bfsChecker(cell.i + 1, cell.j);
    if(cell.i - 1 >= 0)
        bfsChecker(cell.i - 1, cell.j);
    if(cell.j + 1 < grid.y)
        bfsChecker(cell.i, cell.j + 1);
    if(cell.j - 1 >= 0)
        bfsChecker(cell.i, cell.j - 1);
}
function bfsChecker(i, j){
    if(cellMap[i][j]!='X' && !visited[i][j]){
        queue.push({'i': i, 'j': j, 'prev': queueInd});
        visited[i][j] = 1;
    }
}


function drawPathBFS() {
    queueInd = queue[queueInd].prev;

    //console.log(queue[queueInd])

    let i = queue[queueInd].i, j = queue[queueInd].j;

    if(i==pointer.i && j==pointer.j){
        clearInterval(functionVar);
    }

    colorCell(i, j, 'blue')
}

function resetGrid() {
    //console.log('fuck me')
    for(let i=0;i<grid.x;i++) {
        for(let j=0;j<grid.y;j++) {
            colorCell(i, j, cells[i][j].color)
        }
    }
}