(function (w) {

    'use strict';

    // 0 -> empty cell
    // <number> -> number of mines in the adjacent cell
    // -1 -> bomb cell

    var levels = {
        'easy': {
            'boardSize': [5, 5],
            'numMines': 4
        },
        'beginner': {
            'boardSize': [10, 7],
            'numMines': 10
        },
        'intermediate': {
            'boardSize': [16, 16],
            'numMines': 30
        },
        'expert': {
            'boardSize': [20, 20],
            'numMines': 99
        }
    };

    var root = document.getElementById('root');

    function getValueById(identifier) {
        return document.getElementById(identifier).value;
    }

    function getRandomNumber(max) {
        return Math.floor((Math.random() * 1000) + 1) % max;
    }

    function getSetVariables() {
        var elm = getValueById('select');
        document.getElementById('mineCount').innerText = ' Number of mines present ' + levels[elm].numMines;
        return {
            rows: levels[elm].boardSize[0],
            cols: levels[elm].boardSize[1],
            mines: levels[elm].numMines
        }
    }

    function loadGame() {
        if (root.hasChildNodes()) {
            root.removeChild(document.getElementsByTagName('table')[0]);
        }
        var variables = getSetVariables();
        var newBoard = new Game(variables.rows, variables.cols, variables.mines);
        newBoard.createBoard();
        newBoard.plantMines();
        newBoard.bombChecker(document.getElementsByTagName('td'));
        newBoard.calculateDistance();
    }

    function Game(rowSize, colSize, mineCount) {
        this.rowSize = rowSize;
        this.colSize = colSize;
        this.mineCount = mineCount;
        this.cellData = [];
        this.minePos = [];
    }

    Game.prototype.createBoard = function createBoard() {
        let table = document.createElement('table');

        for (let i = 0; i < this.rowSize; i++) {
            let tr = document.createElement('tr');
            this.cellData[i] = [];
            for (let j = 0; j < this.colSize; j++) {
                let td = document.createElement('td');
                // keeping all the cells empty as of now
                this.cellData[i][j] = 0;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        root.appendChild(table);
    };

    Game.prototype.displayAllMineCells = function displayAllMineCells(tds) {
        var that = this;
        tds.map(function (td) {
            td.classList.add('clicked');
            var x = td.parentNode.rowIndex;
            var y = td.cellIndex;
            td.innerText = that.cellData[x][y];
            if (td.innerText < 0) {
                td.classList.remove('clicked');
                td.classList.add('mine-cell');
            }
        });
    };

    Game.prototype.bombChecker = function createCellClicks(tds) {
        var that = this;
        tds = Array.from(tds);
        tds.map(function (td) {
            td.addEventListener('click', function () {
                var x = td.parentNode.rowIndex;
                var y = td.cellIndex;
                if (!that.cellData[x][y]) {
                    that.cellData[x][y] = 0;
                }
                td.innerText = that.cellData[x][y] ? that.cellData[x][y] : 0;
                td.classList.add('clicked');
                if (td.innerText < 0) {
                    that.displayAllMineCells(tds);
                    alert("Game over");
                } else {
                    var clickedCells = document.getElementsByClassName('clicked').length;
                    var allTD = document.getElementsByTagName('td').length;
                    if (allTD - clickedCells === that.mineCount) {
                        alert('you win');
                        that.displayAllMineCells(tds);
                    }
                }
            });
        });
    };

    Game.prototype.plantMines = function plantMines() {
        var x, y;
        var counter = 0;
        while (counter++ < this.mineCount) {
            x = getRandomNumber(this.rowSize);
            y = getRandomNumber(this.colSize);
            // below small check to avoid overlapping of common numbers,
            // generated by random function
            if (this.cellData[x][y] !== -1) {
                this.cellData[x][y] = -1;
                this.minePos.push({x: x, y: y});
            } else {
                counter--;
            }
        }
    };

    Game.prototype.calculateDistance = function calculateDistance() {
        for (var i = 0; i < this.minePos.length; i++) {
            var x = this.minePos[i].x;
            var y = this.minePos[i].y;

            // traverse upper left
            if (x > 0 && y > 0 && this.cellData[x - 1][y - 1] !== -1) {
                this.cellData[x - 1][y - 1] += 1;
            }

            // traverse up
            if (x > 0 && this.cellData[x - 1][y] !== -1) {
                this.cellData[x - 1][y] += 1;
            }

            // traverse upper right
            if (x > 0 && y < this.colSize - 1 && this.cellData[x - 1][y + 1] !== -1) {
                this.cellData[x - 1][y + 1] += 1;
            }

            // traverse left
            if (y > 0 && this.cellData[x][y - 1] !== -1) {
                this.cellData[x][y - 1] += 1;
            }

            // traverse right
            if (y < this.colSize - 1 && this.cellData[x][y + 1] !== -1) {
                this.cellData[x][y + 1] += 1;
            }

            // traverse lower left
            if (x < this.rowSize - 1 && y > 0 && this.cellData[x + 1][y - 1] !== -1) {
                this.cellData[x + 1][y - 1] += 1;
            }

            // traverse down
            if (x < this.rowSize - 1 && this.cellData[x + 1][y] !== -1) {
                this.cellData[x + 1][y] += 1;
            }

            // traverse lower right
            if (x < this.rowSize - 1 && y < this.colSize - 1 && this.cellData[x + 1][y + 1] !== -1) {
                this.cellData[x + 1][y + 1] += 1;
            }
        }
    };

    function createStandardConfigurations() {
        // standard level configurations
        var select = document.getElementsByTagName('select')[0];
        var keys = Object.keys(levels);
        for (var i = 0; i < keys.length; i++) {
            var opt = document.createElement('option');
            opt.setAttribute('value', keys[i]);
            opt.setAttribute('data-row-size', levels[keys[i]][0]);
            opt.setAttribute('data-col-size', levels[keys[i]][1]);
            opt.innerText = keys[i] + "    " + levels[keys[i]].boardSize[0] + 'X' + levels[keys[i]].boardSize[1];
            select.appendChild(opt);
        }
    }

    // w-> window
    createStandardConfigurations();
    w.loadGame = loadGame;
    w.getSetVariables = getSetVariables;
})(window);
