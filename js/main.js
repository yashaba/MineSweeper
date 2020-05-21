'use strict'

var gBoard
var timerOn = false
var setIntervalId // interval for the timer
var bombsGenerated = false
var firstClick = true
var gameOn = false
var reveals // The win condition
var gBombCount
var gHearts
var playState //for the smiley replay to know what state to replay

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
            gBoard[i][j] = { i: i, j: j, isBomb: false, isFlagged: false, isRevealed: false }
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
        elCell.innerHTML = flag
        return
    }

    if (currCell.isFlagged === true) return
    if (currCell.isBomb === true && firstClick) {
        moveBomb(currCell)
        firstClick = false
    }
    if (currCell.isBomb === true) {
        removeHeart()


    } else {
        firstClick = false
        var bombsAround = countBombsAround(gBoard, currI, currJ)
        currCell.isRevealed = true
        elCell.innerText = bombsAround
        elCell.style.backgroundColor = "gray"
        if (bombsAround === 0) revealNegs(gBoard, currI, currJ)
        var wins = checkWin()
        if (wins === (gBoard.length * gBoard.length - gBombCount)) {
            console.log('Win');
            alert('You won!')
            revealAllBombs(gBoard)
            gameOn = false
            stopTime()
            renderSmiley(smileWin)
        }
    }
}

function revealNegs(mat, rowIdx, colIdx, cell) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j]
            var currCellDom = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            currCellDom.innerText = countBombsAround(gBoard, i, j)
            cell.isRevealed = true
            currCellDom.style.backgroundColor = "gray"
                // var currI = +elCell.getAttribute('data-i')
                // var currJ = +elCell.getAttribute('data-j')
                // var currCell = gBoard[currI][currJ]
                // if (cell.isBomb === true) bombCount++
        }
    }

}

function checkWin() {
    reveals = 0
    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (cell.isRevealed === true) {
                reveals++
            }
        }
    }
    console.log('reveals ', reveals);
    return reveals
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

    var bombCount = numOfBombs

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
    gBombCount = numOfBombs

    while (numOfBombs > 0) {
        var randI = getRandomIntInclusive(0, gBoard.length - 1)
        var randJ = getRandomIntInclusive(0, gBoard.length - 1)
        var cell = gBoard[randI][randJ]
        if (cell.isBomb === true) continue
        cell.isBomb = true
        numOfBombs--
    }
    bombsGenerated = true
    return gBombCount
}

function play(nums, numOfBombs) {
    gHearts = 3
    gBombCount = 0
    gBoard = []
    firstClick = true
    gameOn = true
    creategBoard(nums, numOfBombs)
    renderBoard(gBoard)
    stopTime()
    RenderHearts()
    renderSmiley(smileDefault)
    playState = { nums: nums, numOfBombs: numOfBombs }
    console.log(playState);
}

function revealAllBombs(mat) {
    for (var i = 0; i < mat.length; i++) {

        for (var j = 0; j < mat.length; j++) {
            var currCell = mat[i][j]
            if (currCell.isBomb === true) {
                var bombCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                bombCell.innerHTML = bomb
                bombCell.style.backgroundColor = "rgb(164, 23, 28)"
            }
        }
    }
}

function test() {
    console.log('trigger');
    return false

}

function removeHeart() {
    var heart = document.querySelector(".health").lastElementChild
    heart.parentNode.removeChild(heart)
    gHearts--
    if (!gHearts) {
        alert('You lost!')
        revealAllBombs(gBoard)
        gameOn = false
        stopTime()
        renderSmiley(smileLose)
    }
}

function RenderHearts() {
    document.querySelector(".health").innerHTML = `<img src="img/heart.png">
    <img src="img/heart.png">
    <img src="img/heart.png">`
}

function renderSmiley(Condition) {
    document.querySelector(".smiley").innerHTML = Condition

}

function smileyReplay() {
    play(playState.nums, playState.numOfBombs)

}