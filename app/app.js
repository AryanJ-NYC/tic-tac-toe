app = angular.module('ticTacToeApp', []);

app.controller('ticTacToeCtrl', function ($scope) {
    var CIRCLE = 'O',
        X = 'X',
        currentPlayer = CIRCLE;

    $scope.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    function toggleTurn() {
        currentPlayer = currentPlayer == X ? CIRCLE : X;
    }

    /**
     * Takes the true mod of a number; created due to JavaScript modulus "bug"
     * @param n {number}
     * @param m {number}
     * @returns {number} - remainder of n/m, takes sign of the divisor
     */
    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    function getEmptySquares() {
        var emptySquares = [];
        for (var i = 0; i < $scope.board.length; i++) {
            for (var j = 0; j < $scope.board[i].length; j++) {
                if ($scope.board[i][j] == '') emptySquares.push([i, j]);
            }
        }
        return emptySquares;
    }

    /**
     * Checks board for a winner
     * @return {Character} winner of board, null if no winner
     */
    function checkWin(row, col, player) {
        if (
            ($scope.board[row][(col+1)%3] == player && $scope.board[row][(col+2)%3] == player) ||
            ($scope.board[(row+1)%3][col] == player && $scope.board[(row+2)%3][col] == player) ||
            (row == col && $scope.board[(row+1)%3][(col+1)%3] == player && $scope.board[(row+2)%3][(col+2)%3] == player) ||
            (row+col == 2 && $scope.board[(row+1)%3][mod(col-1, 3)] == player && $scope.board[(row+2)%3][mod(col-2, 3)] == player)
        ) return player;
        else return null;
    }

    $scope.writeToBoard = function (row, col) {
        if ($scope.board[row][col] == '') {
            $scope.board[row][col] = currentPlayer;
            var winner = checkWin(row, col, currentPlayer);
            if (winner != null) {
                // TODO update score
                // TODO pop-up win modal with score
                // TODO empty board
            }
            toggleTurn();
        }
    };

    $scope.choosePlayer = function (choice) {
        currentPlayer = choice;
        player = choice;
    };
});
