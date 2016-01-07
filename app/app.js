app = angular.module('ticTacToeApp', []);

app.controller('ticTacToeCtrl', function ($scope) {
    var CIRCLE = 'O',
        X = 'X',
        turn = CIRCLE;

    $scope.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    function toggleTurn() {
        turn = turn == X ? CIRCLE : X;
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

    $scope.writeToBoard = function (row, col) {
        if ($scope.board[row][col] == '') {
            $scope.board[row][col] = turn;
            toggleTurn();
        }
    };

    $scope.choosePlayer = function (choice) {
        turn = choice;
        player = choice;
    };
});
