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
