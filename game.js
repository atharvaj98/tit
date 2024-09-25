// game.js

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    for (let i = 0; i < 200; i++) {
        const div = document.createElement('div');
        grid.appendChild(div);
    }
    
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const width = 10;
    let timerId;
    let score = 0;
    let gameActive = false;

    // Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    // Randomly select a Tetromino
    let currentPosition = 4;
    let currentRotation = 0;
    let current = lTetromino[currentRotation];

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = 'red';
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            // Start a new tetromino
            currentPosition = 4;
            current = lTetromino[currentRotation];
            draw();
            addScore();
        }
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === lTetromino.length) {
            currentRotation = 0;
        }
        current = lTetromino[currentRotation];
        draw();
    }

    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keyup', control);

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // Start/Pause Game
    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = 'Resume Game';
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            startButton.textContent = 'Pause Game';
        }
    });
});
