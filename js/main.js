'use strict'

// var gBoard = creategBoard(4)
var gBoard
var timerOn = false
var setIntervalId
var bombsGenerated = false
var firstClick = true
var gameOn = false
var reveals = 0
var gBombCount

function startTimer() {
    timerOn = true
    var seconds = 0
    var Milseconds = 0
    setIntervalId = setInterval(function() {
        Milseconds += 50
        if (Milseconds === 1000) {
            Milseconds = 0
            seconds++
        }
        var timer = seconds + "." + Milseconds
        document.querySelector(".timer").innerText = timer
    }, 50)

}

function stopTime() {
    clearInterval(setIntervalId)
    timerOn = false
}


function creategBoard(length, numOfBombs) {
    gBoard = [];

    for (var i = 0; i < length; i++) {
        gBoard[i] = [''];
        for (var j = 0; j < length; j++) {
            gBoard[i][j] = { i: i, j: j, isBomb: false, isFlagged: false }
        }
    }

    generateBombs2(numOfBombs)

    console.log(gBoard);
    return gBoard
}



function renderBoard(board) {
    var strHTML = '';
    var idx = 0
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {

            strHTML += `<td class="cell" 
        data-i="${i}" data-j="${j}" onmousedown="cellClicked(this,event)" oncontextmenu="return false"
                  >  </td>`

        }
        strHTML += '</tr>'
    }
    var elTbody = document.querySelector('.board');
    elTbody.innerHTML = strHTML;
}


function cellClicked(elCell, ev) {
    if (gameOn === false) return
    if (timerOn === false) startTimer()
    var currI = +elCell.getAttribute('data-i')
    var currJ = +elCell.getAttribute('data-j')
    var currCell = gBoard[currI][currJ]

    if (ev.buttons === 2 && currCell.isFlagged === true) {
        currCell.isFlagged = false
        elCell.innerText = ''
        return
    }
    if (ev.buttons === 2) {
        currCell.isFlagged = true
        elCell.innerText = 'F'
        return
    }


    if (currCell.isFlagged === true) return
    if (currCell.isBomb === true && firstClick) {
        moveBomb(currCell)
        firstClick = false

    }
    if (currCell.isBomb === true) {
        alert('You lost!')
        revealAllBombs(gBoard)
        gameOn = false
        stopTime()

    } else {
        firstClick = false
        elCell.innerText = countBombsAround(gBoard, currI, currJ)
        reveals++
        console.log(reveals);
        // if (countBombsAround(gBoard, currI, currJ) === 0) {
        //     revealNegs(gBoard, currI, currJ, currCell)

        // }

        //debugger
        if (reveals === (gBoard.length * gBoard.length - gBombCount)) {
            console.log('Win');
        }
    }

}

function revealNegs(mat, rowIdx, colIdx, cell) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            cell = mat[i][j]
            document.querySelector(`[data-i="${i}"][data-j="${j}"]`).innerText = countBombsAround(gBoard, currI, currJ)

            // if (cell.isBomb === true) bombCount++
        }
    }

}

function moveBomb(currCell) {
    currCell.isBomb = false
    var randI = getRandomIntInclusive(0, gBoard.length)
    var randJ = getRandomIntInclusive(0, gBoard.length)
    var cell = gBoard[randI][randJ]
    if (cell.isBomb === false) {
        cell.isBomb = true
    } else { moveBomb() }

}

function generateBombs(numOfBombs, currCell) {
    //debugger
    var bombCount = numOfBombs

    // var currI = +elCell.getAttribute('data-i')
    // var currJ = +elCell.getAttribute('data-j')

    while (bombCount > 0) {
        var randI = getRandomIntInclusive(0, gBoard.length)
        var randJ = getRandomIntInclusive(0, gBoard.length)
        var cell = gBoard[randI][randJ]
        if ((cell.i === currCell.i) && (cell.j === currCell.j)) continue
        if (cell.isBomb === true) continue
        cell.isBomb = true
        bombCount--
    }

    bombsGenerated = true
}

function generateBombs2(numOfBombs) {
    // debugger
    gBombCount = numOfBombs

    // var currI = +elCell.getAttribute('data-i')
    // var currJ = +elCell.getAttribute('data-j')

    while (numOfBombs > 0) {
        var randI = getRandomIntInclusive(0, gBoard.length - 1)
        var randJ = getRandomIntInclusive(0, gBoard.length - 1)
        var cell = gBoard[randI][randJ]
            // if ((cell.i === currCell.i) && (cell.j === currCell.j)) continue
        if (cell.isBomb === true) continue
        cell.isBomb = true
        numOfBombs--
    }

    bombsGenerated = true
    return gBombCount
}

function play(nums, numOfBombs) {
    gBombCount = 0
    reveals = 0
    gBoard = []
    firstClick = true
    gameOn = true
    creategBoard(nums, numOfBombs)
    renderBoard(gBoard)
    stopTime()
}

function revealAllBombs(mat) {
    for (var i = 0; i < mat.length; i++) {

        for (var j = 0; j < mat.length; j++) {
            var currCell = mat[i][j]
            if (currCell.isBomb === true) {
                document.querySelector(`[data-i="${i}"][data-j="${j}"]`).innerText = 'B'
            }
        }
    }
}

function test() {
    console.log('trigger');
    return false

}