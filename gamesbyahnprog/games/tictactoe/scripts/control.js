/*
 * object to contain all items accessable to all control functions
 */
var globals = {};

function startMasterGame() {
    $('.cell').removeClass('occupied').empty();
    var aiPlayer = new AI("master");
    globals.game = new Game(aiPlayer);

    aiPlayer.plays(globals.game);
    globals.game.start();
}

startMasterGame();

/*
 * click on cell (onclick div.cell) behavior and control
 * if an empty cell is clicked when the game is running and its the human player's trun
 * get the indecies of the clickd cell, craete the next game state, upadet the UI, and
 * advance the game to the new created state
 */
 $(".cell").each(function() {
     var $this = $(this);
     $this.click(function() {
         if(globals.game && globals.game.status === "running" && globals.game.currentState.turn === "X" && !$this.hasClass('occupied')) {
             var indx = parseInt($this.data("indx"), 10);

             var next = new State(globals.game.currentState);
             next.board[indx] = "X";

             ui.insertAt(indx, "X");

             next.advanceTurn();

             globals.game.advanceTo(next);

         }
     })
 });

$(".restart-button").click(function() {
    window.location.reload();
});
