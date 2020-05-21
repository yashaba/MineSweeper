var heartymbol = '&#x2764;'
var smileDefault = '&#128512';
var smileLose = '&#129327';
var smileWin = '&#128526';
var flag = '&#128681'
var bomb = '&#128163'




////// random color 
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


/////random int generator

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/// not in use atm

function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


///// not in use atm
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}




//// food counter from chen


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

    // if (bombCount === 0) {
    //     document.querySelector(`[data-i="${rowIdx}"][data-j="${colIdx}"]`).innerText = "*"
    //     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    //         if (i < 0 || i > mat.length - 1) continue
    //         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
    //             if (j < 0 || j > mat[0].length - 1) continue
    //             if (i === rowIdx && j === colIdx) continue
    //             var cell = mat[i][j]
    //             if (cell.isBomb === true) return

    //             document.querySelector(`[data-i="${i}"][data-j="${j}"]`).innerText = countBombsAround(gBoard, cell.i, cell.j)
    //         }
    //     }

    // }

    return bombCount
}


//// life generator from game of life 
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