(function () {
    var board = ["E", "E", "E", "E", "E", "E", "E", "E", "E"];
    var turn = "X";
    var ended = false;

    function renderResult(result) {
        $(".ingame").stop(true, true).hide();

        if (result === "draw") {
            $("#draw").text("It's a Draw").show();
        } else if (result === "X-won") {
            $("#won").text("Player 1 won !").show();
        } else if (result === "O-won") {
            $("#lost").text("Player 2 won !").show();
        }
    }

    function result() {
        var wins = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (var i = 0; i < wins.length; i += 1) {
            var line = wins[i];
            if (board[line[0]] !== "E" && board[line[0]] === board[line[1]] && board[line[1]] === board[line[2]]) {
                return board[line[0]] + "-won";
            }
        }

        return board.indexOf("E") === -1 ? "draw" : "";
    }

    function insertAt(index, symbol) {
        var cell = $('.cell[data-indx="' + index + '"]');
        cell.html(symbol);
        cell.css({ color: symbol === "X" ? "green" : "blue" });
        cell.addClass("occupied");
    }

    $(".cell").click(function () {
        if (ended || $(this).hasClass("occupied")) return;

        var index = parseInt($(this).data("indx"), 10);
        board[index] = turn;
        insertAt(index, turn);

        var currentResult = result();
        if (currentResult) {
            ended = true;
            renderResult(currentResult);
            return;
        }

        turn = turn === "X" ? "O" : "X";
    });

    $(".restart-button").click(function () {
        window.location.reload();
    });
})();
