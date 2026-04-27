/*
 * ui object encloses all UI related methods and attributes
 */
var ui = {};

//holds the state of the intial controls visibility
ui.intialControlsVisible = true;

//holds the setInterval handle for the robot flickering
ui.robotFlickeringHandle = 0;

//holds the current visible view
ui.currentView = "";

/*
 * starts the flickering effect of the robot image
 */
ui.startRobotFlickering = function() {
    ui.stopRobotFlickering();
    ui.robotFlickeringHandle = setInterval(function() {
        $("#robot").toggleClass('robot');
    }, 500);
};

/*
 * stops the flickering effect on the robot image
 */
ui.stopRobotFlickering = function() {
    clearInterval(ui.robotFlickeringHandle);
};

ui.showEndActions = function() {
    $('.end-actions').fadeIn("fast").css("display", "flex");
};

ui.hideEndActions = function() {
    $('.end-actions').hide();
};

    if(ui.intialControlsVisible) {
        //if the game is just starting
        ui.intialControlsVisible = false;

        $('.intial').fadeOut({
            duration : "slow",
            done : function() {
                _switch(turn);
            }
        });
    }
    else {
        //if the game is in an intermediate state
        $(ui.currentView).fadeOut({
            duration: "fast",
            done: function() {
                _switch(turn);
            }
        });
    }
};

/*
 * places X or O in the specifed place in the board
 * @param i [Number] : row number (0-indexed)
 * @param j [Number] : column number (0-indexed)
 * @param symbol [String]: X or O
 */
ui.insertAt = function(indx, symbol) {
    var board = $('.cell');
    var targetCell = $(board[indx]);

    if(!targetCell.hasClass('occupied')) {
        targetCell.html(symbol);
        targetCell.css({
            color : symbol == "X" ? "green" : "red"
        });
        targetCell.addClass('occupied');
    }
}
