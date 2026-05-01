class View {
  constructor(el, game) {
    this.el = el;
    this.game = game;
    this.drawBoard(game.board)
    this.bindEvents();
    this.drawReset()
  }

  showTurn() {
    let div = document.querySelector("#showTurn") || document.createElement("div");
    div.id = "showTurn"
    div.innerHTML = "";
    
    let circle = document.createElement("div");
    circle.classList.add(this.game.currentPlayer.sym)
    circle.classList.add("turnColor")
    
    div.appendChild(circle)
    this.el.prepend(div);
  }

  drawReset(){
    let button = document.createElement("button");
    button.innerText = "Play Again?"
    button.addEventListener("click", () => {
    this.game.newGame();
    this.hideEndView();
    this.drawBoard();
    this.bindEvents();``
    })
    this.el.appendChild(button);
  }

  drawBoard(board = this.game.board) {
      this.showTurn();

    let html = "";
    html += "<table id='game_board' cellpadding='0'>"
    for(let row = 0; row < 6; row++) {
      html += "<tr>"
      for(let col = 0; col < 7; col++) {
        html += `<td class='empty col-${col}' data-col='${col}' data-row='${row}'></td>`
      }
      html += "</tr>"
    }
    html += "</table>"

    let div = document.querySelector("#gameBoard")
    if(!div) {
      div = document.createElement("div");
      div.id = "gameBoard";
      this.el.appendChild(div)
    }
    div.innerHTML = html
  }

  playGame = (e) => {
    if(e.target.tagName !== "TD") return
    let col = e.target.dataset.col
    let sym = this.game.turn(col)
    if(!sym) return
    if(this.game.status !== 0) {
      document.getElementById("game_board").className = "finished";
      this.el.removeEventListener('click', this.playGame)
    }
    this.dropDisc(sym);
    this.renderEndView();
    }
    
    dropDisc = (sym) => {
      let [row, column] = this.game.lastPlacement();
      let columns = document.querySelectorAll(`.col-${column}`)
      columns = [...columns]
      columns = columns.filter(el => {
        return el.dataset.row <= row
      })

      let disc = columns.pop();
      setTimeout(() => {
        disc.classList.remove("empty")
        disc.classList.add("coin")
        disc.classList.add(sym)
        this.swapHighlights();
      }, columns.length * 1)
      
      this.showTurn();
  }

  showCol = (e) => {
    if(e.target.tagName === "DIV") {
      this.removeHighlights()
    }
    if(e.target.tagName !== "TD") return
    this.removeHighlights()
    let col = ".col-" + e.target.dataset.col;
    let collection = document.querySelectorAll(col);
    collection.forEach(el => {
      if(this.game.currentPlayer.sym === "r") {
        el.classList.add("showPink");
      } else {
        el.classList.add("showGray");
      }
    })

  }

  removeHighlights() {
    document.querySelectorAll(".showPink").forEach(el => {
      el.classList.remove("showPink");
    })
    document.querySelectorAll(".showGray").forEach(el => {
      el.classList.remove("showGray");
    })
  }

  swapHighlights() {
    let pinks = document.querySelectorAll(".showPink")
    if(pinks.length > 0) {
      pinks.forEach(el => {
        el.classList.remove("showPink");
        el.classList.add("showGray")
      })
    } else {
      document.querySelectorAll(".showGray").forEach(el => {
        el.classList.remove("showGray");
        el.classList.add("showPink")
      })
    }
  }

  hideEndView() {
    document.querySelectorAll(".ingame").forEach(el => {
      el.style.display = "none";
    })
  }

  renderEndView() {
    if (this.game.status === 0) {
      this.hideEndView();
      return;
    }

    this.hideEndView();

    let resultId = this.game.status === 1 ? "won" : this.game.status === 2 ? "lost" : "draw";
    let result = document.getElementById(resultId);
    if (result) {
      result.style.display = "block";
    }
  }

  bindEvents() {
    this.el.addEventListener('click', this.playGame)
    this.el.addEventListener('mouseover', this.showCol)

  }

}
