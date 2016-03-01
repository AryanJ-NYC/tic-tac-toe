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
        WIN_WEIGHT = 1,
        LOSS_WEIGHT = 1,
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

    /**
     * Function run after user chooses O or X
     * @param {Character} choice
     */
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

    /**
     * @param board
     * @returns {Array} - an array of [row, column] values that are empty in board.
     */
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

    /**
     * Returns a copy of the current tic-tac-toe board
     * @returns {*[]}
     */
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
     * @param player - last player to move
     * @param board - the board to be checked
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

    /**
     * The logic behind the computer's next move.  Wins or blocks, if possible.  If not, runs getBestMove.
     * @param currentPlayer - the computer player's value (X or O)
     *
     */
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

    /**
     * Runs a monte carlo simulation on NUM_TRIALS to find the move that results in the most wins
     * @param player - the computer player's value (X or O)
     * @returns {*} - a [row, column] value of the computer's best move
     */
    function getBestMove (player) {
        var originalPlayer = player;
        for (var i = 0; i < NUM_TRIALS; ++i) {
            var board = copyBoard();
            do {
            // randomly pick a square, move then alternate to other player to create randomly-played board to score
            // board is scored once a winner is established (O, X or draw)
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

    /**
     * Goes through a board and adds a point for each move where the player and winner match, detracts a point if not
     * @param board - board to score against
     * @param player - player to score against
     * @param winner - winner of the board
     */
    function updateScore (board, player, winner) {
        var otherPlayer = (player == X) ? CIRCLE : X;
        for (var row = 0; row < board.length; ++row) {
            for (var col = 0; col < board[row].length; ++col) {
                if (board[row][col] == player && winner == player)
                    scoreBoard[row][col] += WIN_WEIGHT;
                else if (board[row][col] == player && winner == otherPlayer)
                    scoreBoard[row][col] -= LOSS_WEIGHT;
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

    /**
     * Writes to the current tic-tac-toe board
     * @param row - row where next move should be written
     * @param col - column where next move should be written
     */
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
