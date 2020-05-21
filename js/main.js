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
var gSafeclicks = 3
var hintActivated = false
var gBulb
var gTimer = 0



function startTimer() {
    timerOn = true
    var seconds = 0
    var milseconds = 0
    setIntervalId = setInterval(function() {
        milseconds += 50
        gTimer += 50
        if (milseconds === 1000) {
            milseconds = 0
            seconds++
        }
        var timer = seconds + "." + milseconds


        document.querySelector(".timer").innerText = timer
    }, 50)
    return gTimer
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
            gBoard[i][j] = {
                i: i,
                j: j,
                isBomb: false,
                isFlagged: false,
                isRevealed: false,
                isRevealedByClue: false,
                wasHintedBefore: false
            }
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
    if (!gameOn) return
    if (!timerOn) startTimer()
    var currI = +elCell.getAttribute('data-i')
    var currJ = +elCell.getAttribute('data-j')
    var currCell = gBoard[currI][currJ]

    if (hintActivated) {
        activateClue(currCell, elCell, currI, currJ, gBoard)
        hintActivated = false
        return

    }

    if (ev.buttons === 2 && currCell.isFlagged) {
        currCell.isFlagged = false
        if (currCell.isRevealed || currCell.isRevealedByClue) {
            elCell.innerText = countBombsAround(gBoard, currI, currJ)
        } else elCell.innerText = ""
        return
    }

    if (ev.buttons === 2) {
        currCell.isFlagged = true
        elCell.innerHTML = flag
        return
    }

    if (currCell.isFlagged) return
    if (currCell.isBomb && firstClick) {
        moveBomb(currCell)
        firstClick = false

    }
    if (currCell.isBomb) {
        removeHeart()
        shakeCell(elCell)


    } else {
        firstClick = false
        var bombsAround = countBombsAround(gBoard, currI, currJ)
        currCell.isRevealed = true
        elCell.innerText = bombsAround
        elCell.style.backgroundColor = "gray"
        elCell.style.color = getRandomColor()
        if (bombsAround === 0) revealNegs(gBoard, currI, currJ)
        var wins = checkWin()
        if (wins === (gBoard.length * gBoard.length - gBombCount)) {
            console.log('Win');
            alert('You won!')
            revealAllBombs(gBoard)
            gameOn = false
            stopTime()
            renderSmiley(smileWin)
            changeBodyColor()

            if (localStorage.bestTime === "null") {
                localStorage.bestTime = gTimer
                document.getElementById("record").innerHTML = gTimer / 1000
            }
            if (Number(localStorage.bestTime) > gTimer) {
                localStorage.bestTime = gTimer
                document.getElementById("record").innerHTML = gTimer / 1000
            }
        }
    }
}

function activateClue(currCell, elCell, currI, currJ, gBoard) {
    firstClick = false
    currCell.innerText = countBombsAround(gBoard, currI, currJ)
    if (currCell.isBomb) elCell.innerHTML = bomb
    revealNegs2(gBoard, currI, currJ)
    gBulb.setAttribute('src', "img/lightbulbEmpty.png")

    setTimeout(function() {
        hideNegs(gBoard, currI, currJ)

    }, 1000)
}

function hideNegs(mat, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j]
            if (!cell.isRevealedByClue) continue
            var currCellDom = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            currCellDom.innerText = " "
            currCellDom.style.color = ""
            cell.isRevealed = false
            currCellDom.style.backgroundColor = "white"
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
            if (cell.isRevealed) continue
            var currCellDom = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            currCellDom.innerText = countBombsAround(gBoard, i, j)
            currCellDom.style.color = getRandomColor()
            cell.isRevealed = true
            currCellDom.style.backgroundColor = "gray"
        }
    }

}

function revealNegs2(mat, rowIdx, colIdx, cell) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j]
            if (cell.isRevealed) continue
            var currCellDom = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            currCellDom.innerText = countBombsAround(gBoard, i, j)
            currCellDom.style.color = getRandomColor()
            cell.isRevealedByClue = true
            currCellDom.style.backgroundColor = "gray"
            if (cell.isBomb) currCellDom.innerHTML = bomb
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
    gSafeclicks = 3
    gHearts = 3
    gBombCount = 0
    gBoard = []
    firstClick = true
    gameOn = true
    hintActivated = false
    gTimer = 0
    creategBoard(nums, numOfBombs)
    renderBoard(gBoard)
    stopTime()
    RenderHearts()
    RenderBulbs()
    renderSmiley(smileDefault)
    rendeRecord()
    playState = { nums: nums, numOfBombs: numOfBombs }
    document.querySelector(".safe-click").innerText = `SafeClick`
    console.log(playState);
}

function rendeRecord() {

    if (!localStorage.bestTime) {
        localStorage.bestTime = null;
        document.getElementById("record").innerHTML = "Record"
    } else {

        document.getElementById("record").innerHTML = localStorage.bestTime / 1000
    }

}

function revealAllBombs(mat) {
    for (var i = 0; i < mat.length; i++) {

        for (var j = 0; j < mat.length; j++) {
            var currCell = mat[i][j]
            if (currCell.isBomb === true) {
                var bombCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                bombCell.innerHTML = bomb
                bombCell.style.backgroundColor = "rgb(164, 23, 28)"
                shakeCell(bombCell)
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
    document.querySelector(".health").innerHTML = `
    <img src="img/heart.png">
    <img src="img/heart.png">
    <img src="img/heart.png">`
}

function RenderBulbs() {
    document.querySelector(".light").innerHTML = `
    <img onclick='bulbClicked(this)' src="img/lightbulbOff.png">
    <img onclick='bulbClicked(this)' src="img/lightbulbOff.png">
    <img onclick='bulbClicked(this)' src="img/lightbulbOff.png">`
}

function renderSmiley(Condition) {
    document.querySelector(".smiley").innerHTML = Condition

}

function smileyReplay() {
    play(playState.nums, playState.numOfBombs)

}