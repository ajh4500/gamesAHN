class Game {
  constructor() {
    this.board = new Board(6, 7)
    this.player1 = new HumanPlayer("Noe", "r")
    this.player2 = new HumanPlayer("Corey", "b")
    this.currentPlayer = this.player1
    this.status = 0
  }

  newGame() {
    this.board = new Board(6, 7);
    this.currentPlayer = this.player1;
    this.status = 0;
  }

  turn(col) {
    if (this.status !== 0) return null;

    if (this.board.placeMarker(col, this.currentPlayer.sym)) {
      const prevSym = this.currentPlayer.sym

      if (this.isGameOver()) {
        this.status = this.currentPlayer === this.player1 ? 1 : 2;
      } else if (this.isDraw()) {
        this.status = 3;
      } else {
        this.switchPlayer();
      }

      return prevSym
    } else {
      console.log("error in turn func")
    }
    return null
  }

  lastPlacement() {
    return this.board.lastPlacement;
  }

  isGameOver() {
    return this.board.checkWinner()
  }

  isDraw() {
    return this.board.isFull() && !this.isGameOver();
  }

  switchPlayer() {
    return this.currentPlayer = this.currentPlayer === this.player1 ?
      this.player2 : this.player1;
  }
}
