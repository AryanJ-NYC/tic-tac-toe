app = angular.module('ticTacToeApp', []);

app.controller('ticTacToeCtrl', function ($scope) {
    $scope.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    $scope.overallScore = {"X": 0, "O": 0};
    $scope.humanPlayer = '';
    $scope.computerPlayer = '';

    var NUM_TRIALS = 500,
        CIRCLE = 'O',
        X = 'X',
        DRAW = 'D',
        currentPlayer,
        firstPlayer,
        scoreBoard = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];


    $scope.choosePlayer = function (choice) {
        currentPlayer = choice;
        firstPlayer = choice;
        $scope.humanPlayer = choice;
        $scope.computerPlayer = ($scope.humanPlayer == CIRCLE) ? X : CIRCLE;
    };

    function toggleTurn () {
        currentPlayer = (currentPlayer == X) ? CIRCLE : X;
    }

    /**
     * Takes the true mod of a number; created due to JavaScript modulus "bug"
     * @param n {number}
     * @param m {number}
     * @returns {number} - remainder of n/m, takes sign of the divisor
     */
    function mod (n, m) {
        return ((n % m) + m) % m;
    }

    function getEmptySquares (board) {
        board = (typeof board !== 'undefined') ? board : $scope.board;
        var emptySquares = [];
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                if (board[i][j] == '') emptySquares.push([i, j]);
            }
        }
        return emptySquares;
    }

    function copyBoard () {
        var board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        for (var row = 0; row < $scope.board.length; ++row) {
            for (var col = 0; col < $scope.board.length; ++col) {
                board[row][col] = $scope.board[row][col];
            }
        }
        return board;
    }

    /**
     * Checks board for a winner
     * @return {Character} winner of board, null if no winner
     */
    function checkWin (player, board) {
        board = (typeof board !== 'undefined') ? board : $scope.board;
        if (getEmptySquares(board).length == 0) return DRAW;
        if (
            (board[0][0] == player && board[0][1] == player && board[0][2] == player) || // first row
            (board[1][0] == player && board[1][1] == player && board[1][2] == player) || // second row
            (board[2][0] == player && board[2][1] == player && board[2][2] == player) || // third row
            (board[0][0] == player && board[1][0] == player && board[2][0] == player) || // first column
            (board[0][1] == player && board[1][1] == player && board[2][1] == player) || // second column
            (board[0][2] == player && board[1][2] == player && board[2][2] == player) || // third column
            (board[0][0] == player && board[1][1] == player && board[2][2] == player) || // left-to-right diagonal
            (board[0][2] == player && board[1][1] == player && board[2][0] == player)    // right-to-left diagonal
        ) return player;
        else return null;
    }

    function AIMove (currentPlayer) {
        var board = copyBoard();
        var otherPlayer = (currentPlayer == X) ? CIRCLE : X;
        var emptySquares = getEmptySquares();
        for (var emptySquare = 0; emptySquare < emptySquares.length; ++emptySquare) {
            var row = emptySquares[emptySquare][0],
                col = emptySquares[emptySquare][1];
            board[row][col] = currentPlayer;
            if (checkWin(currentPlayer, board) != null) {
                $scope.writeToBoard(row, col);
                return;
            }
            board[row][col] = otherPlayer;
            if (checkWin(otherPlayer, board) != null) {
                $scope.writeToBoard(row, col);
                return;
            }
            board[row][col] = '';
        }
        var bestMove = getBestMove(currentPlayer);
        $scope.writeToBoard(bestMove[0], bestMove[1]);
    }

    function getBestMove (player) {
        var originalPlayer = player;
        for (var i = 0; i < NUM_TRIALS; ++i) {
            var board = copyBoard();
            do {
                var emptySquares = getEmptySquares(board);
                if (emptySquares.length > 0) {
                    var randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)],
                        randomRow = randomEmptySquare[0],
                        randomCol = randomEmptySquare[1],
                        playerToCheck = player;
                    board[randomRow][randomCol] = player;
                    player = (player == X) ? CIRCLE : X;
                } else break;
            } while (checkWin(playerToCheck, board) == null);
            var winner = checkWin(playerToCheck, board);
            if (winner != DRAW) {
                updateScore(board, originalPlayer, winner);
            }
        }
        emptySquares = getEmptySquares($scope.board);
        randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
        var bestMove = randomEmptySquare,
            maxScore = Number.NEGATIVE_INFINITY;
        for (var emptySquare = 0; emptySquare < emptySquares.length; ++emptySquare) {
            var row = emptySquares[emptySquare][0],
                col = emptySquares[emptySquare][1];
            if (scoreBoard[row][col] > maxScore) {
                maxScore = scoreBoard[row][col];
                bestMove = [row, col];
            }
        }
        return bestMove;
    }

    function updateScore (board, player, winner) {
        var otherPlayer = (player == X) ? CIRCLE : X;
        for (var row = 0; row < board.length; ++row) {
            for (var col = 0; col < board[row].length; ++col) {
                if (board[row][col] == player && winner == player) ++scoreBoard[row][col];
                else if (board[row][col] == player && winner == otherPlayer) --scoreBoard[row][col];
            }
        }
    }

    function resetScoreBoard () {
        scoreBoard = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
    }

    $scope.writeToBoard = function (row, col) {
        if ($scope.board[row][col] == '') {
            $scope.board[row][col] = currentPlayer;
            var winner = checkWin(currentPlayer);
            if (winner != null) {
                gameOver(winner);
            }
            toggleTurn();
            if (currentPlayer == $scope.computerPlayer) {
                AIMove(currentPlayer);
                resetScoreBoard();
            }
        }
    };

    function gameOver (winner) {
        //if ($scope.overallScore[winner] == null) $scope.overallScore[winner] = 0;
        ++$scope.overallScore[winner];
        $('#gameOver').modal('show');
    }

    $scope.newGame = function () {
        $scope.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        currentPlayer = (firstPlayer == X) ? CIRCLE : X;
        firstPlayer = currentPlayer;
        if (currentPlayer == $scope.computerPlayer) {
            AIMove(currentPlayer);
        }
    }
});
