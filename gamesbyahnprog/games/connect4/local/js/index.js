let game = new Game();
let el = document.querySelector("#board");
new View(el, game);

let restartButton = document.querySelector(".restart-button");
if (restartButton) {
  restartButton.addEventListener("click", () => {
    window.location.reload();
  });
}
