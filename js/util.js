var heartymbol = '&#x2764;'
var smileDefault = '&#128512';
var smileLose = '&#129327';
var smileWin = '&#128526';
var flag = '&#128681'
var bomb = '&#128163'
    // var bombSound = new Audio('sound/bomb.WAV')
    // var clickSound = new Audio('sound/click.WAV')
    // var loseSound = new Audio('sound/lose.WAV')
    // var winSound = new Audio('sound/win.WAV')


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function changeColor(el) {
    el.style.color = getRandomColor()
    el.style.backgroundColor = getRandomColor()
}

function changeBodyColor() {
    document.querySelector("body").style.color = getRandomColor()
    document.querySelector("body").style.backgroundColor = getRandomColor()
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function countBombsAround(mat, rowIdx, colIdx) {
    var bombCount = 0;

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j]
            if (cell.isBomb === true) bombCount++
        }
    }

    return bombCount
}

function gBoardCreate(length) {
    var mat = [];
    var cell = {}
    for (var i = 0; i < length; i++) {
        mat[i] = [''];
        for (var j = 0; j < length; j++) {
            mat[i][j] = cell
        }
    }
    return mat
}

function shakeCell(elCell) {
    elCell.classList.add("anim")
    setTimeout(function() {
        elCell.classList.remove("anim")
    }, 600)
}

function safeClick(gBoard) {
    if (gSafeclicks < 1 || !gameOn) return
    var randI = getRandomIntInclusive(0, gBoard.length - 1)
    var randJ = getRandomIntInclusive(0, gBoard.length - 1)
    var cell = gBoard[randI][randJ]

    while (cell.isBomb) {
        randI = getRandomIntInclusive(0, gBoard.length - 1)
        randJ = getRandomIntInclusive(0, gBoard.length - 1)
        cell = gBoard[randI][randJ]
    }

    if (cell.isRevealed || cell.isRevealedByClue || cell.wasHintedBefore) {
        safeClick(gBoard)
        console.log("bug averted");
        return
    }

    cell.wasHintedBefore = true
    gSafeclicks--
    document.querySelector(`[data-i="${cell.i}"][data-j="${cell.j}"]`).innerHTML = `<img src='img/letterS.png'>`
    document.querySelector(".safe-click").innerText = `remaining:${gSafeclicks}`
    console.log(cell);

    setTimeout(function() {
        if (cell.isRevealed) return
        document.querySelector(`[data-i="${cell.i}"][data-j="${cell.j}"]`).innerText = ''
    }, 2000)
    return cell
}

function bulbClicked(elBulb) {
    //debugger
    gBulb = elBulb
    if (elBulb.getAttribute('src') === "img/lightbulbEmpty.png") return
    if (firstClick) return
    if (hintActivated) {
        hintActivated = false
        var images = document.querySelectorAll('.light img')
        for (var i = 0; i < 3; i++) {
            if (images[i].getAttribute('src') === "img/lightbulbEmpty.png") continue
            images[i].setAttribute('src', "img/lightbulbOff.png")
        }
        return
    }
    hintActivated = true
    elBulb.setAttribute('src', "img/lightbulbOn.png")
}

function setRecordStorage() {
    document.querySelector(".record").innerHTML = localStorage.getItem('Best time:');

}