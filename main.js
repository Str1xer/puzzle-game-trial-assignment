class Block {
    color = "red";

    constructor(color) { this.color=color; }

    getColor() {
        return this.color;
    }
}

class Swapper {
    firstCell;
    secondCell;
    countClick = 0;

    constructor () {this.firstCell = null, this.secondCell = null};

    moveBlocks() {
        if (Math.abs(this.firstCell.column - this.secondCell.column) + Math.abs(this.firstCell.row - this.secondCell.row) == 1) {
            this.secondCell.placeBlock(this.firstCell.removeBlock());
        }
        this.firstCell.blur();
        this.secondCell.blur();
    }

    click(cell) {
        if (this.countClick == 0 && cell.state == "occupied") {
            this.firstCell = cell;
            cell.focus();
            this.countClick++;
        } else if (this.countClick == 1 && cell.state == "free") {
            this.secondCell = cell;
            this.moveBlocks();
            if (checkWin())
                finish();
            this.countClick = 0;
        }
    }
}

class Cell {
    htmlElement = null;
    state = "free";
    block = null;
    row = null;
    column = null;

    constructor(elem, state, id, block = null) {
        this.htmlElement = elem;
        this.state = state;
        if (state == "blocked") {
            this.htmlElement.classList.add("blocked");
        }
        if (state == "occupied") {
            this.htmlElement.classList.add(block?.getColor());
        }
        this.htmlElement.onclick = (e) => moveSelect(this);
        this.block = block
        this.row = Math.floor(id/5);
        this.column = id%5;
    }
    
    placeBlock(block) {
        if (this.state == "free") {
            this.block = block;
            this.state = "occupied"
            this.htmlElement.classList.add(block.getColor());
        }
    }

    removeBlock() {
        this.htmlElement.classList.remove(this.block.getColor());
        let popBlock = this.block;
        this.block = null;
        this.state = "free";
        
        return popBlock;
    }

    focus() {
        this.htmlElement.classList.add("selected");
    }

    blur() {
        this.htmlElement.classList.remove("selected");
    }

}

var numberOfRows = 5;
var numberOfColumns = 5;
var cells = [];
var colors = ["red", "yellow", "green"];
var swapper = new Swapper();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function finish() {
	document.getElementById('finish').style.visibility = "visible";
}

function closeModal() {
    document.getElementById('finish').style.visibility = "collapse";
}

function checkWin() {
    for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < numberOfRows; j++) {
            if (cells[j*numberOfColumns + i*2].state != "occupied")
                return false;
            if (cells[j*numberOfColumns + i*2].block.getColor() != colors[i]) {
                return false;
            }
        }
    }
    return true;
}

function moveSelect(cell) {
    swapper.click(cell);
}

// Generating Header
for (let i = 0; i<colors.length; i++) {
    var elem = document.createElement('div');
    elem.classList.add("cell");
    elem.classList.add(colors[i]);
    document.getElementById('header').appendChild(elem);
    if (i!=colors.length-1) {
        elem = document.createElement('div');
        elem.classList.add("cell");
        document.getElementById('header').appendChild(elem);
    }
}

// Generation field with cells
function generateField() {
    var blocks = [];

    colors.forEach(color => {
        for (let i =0; i < 5; i++)
            blocks.push(new Block(color));
    })

    for (let i = 0; i < 25; i++) {
        var elem = document.createElement('div');
        elem.classList.add("cell");
        elem.id = i;
        // field.push(elem);
        if ((i%5)%2 == 1 && Math.floor(i/5)%2==0)
            cells.push(new Cell(elem, "blocked", i));
        else if ((i%5)%2 == 0) {
            var index = getRandomInt(blocks.length);
            cells.push(new Cell(elem, "occupied", i, blocks[index]));
            blocks.splice(index, 1);
        } else 
            cells.push(new Cell(elem, "free", i));
        document.getElementById('field').appendChild(elem);
    }

    delete(blocks);

    if (checkWin())
        generateField();
}

function clearField() {
    cells = [];
    document.getElementById("field").innerHTML = "";
}

function restart() {
    swapper = new Swapper();
    clearField();
    generateField();
}

document.getElementById("restart").onclick = () => {restart()};
document.getElementById("new_game").onclick = () => {restart(); closeModal()};

restart();
