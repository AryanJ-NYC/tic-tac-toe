app = angular.module('ticTacToeApp', []);

app.controller('ticTacToeCtrl', function ($scope) {
    var CIRCLE = 'O',
        X = 'X';

    turn = CIRCLE;

    $scope.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    function toggleTurn() {
        turn = turn == X ? CIRCLE : X;
    }


});
