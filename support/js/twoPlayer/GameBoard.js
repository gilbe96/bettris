// It will be in charge of representing the GameBoard model of the game
class GameBoard {
  constructor() {
    this.cols = 23;
    this.rows = 23;
    this.cell_side = 25;
    this.width_gameboard = this.cols * this.cell_side;
    this.high_gameboard = this.rows * this.cell_side;
    this.position = createVector(
      gameboard_margin,
      gameboard_margin + this.cell_side
    );

    // storedMinos is the variable that is responsible for representing the minos stored on the GameBoard
    this.storedMinos = [];
    for (let row = 0; row < this.rows; row++) {
      this.storedMinos[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.storedMinos[row].push("");
      }
    }
  }

  storeMino(tetrimino, num) {
    for (const pmino of tetrimino.gameBoardMap) {
      if (pmino.y < 0) {
        //Game Over
        clouseGame(num);
      }
      this.storedMinos[pmino.x][pmino.y] = tetrimino.name;
    }
    this.findHorizontalLinesToDelete();
  }

  findHorizontalLinesToDelete() {
    let cont = 0;
    let cont2 = 0;
    for (let row = this.rows - 1; row >= 0; row--) {
      let agregar = true;
      let there_is = true;
      while (there_is) {
        for (let col = 0; col < 10; col++) {
          if (!this.storedMinos[col][row]) {
            agregar = false;
            break;
          }
        }
        if (agregar) {
          this.DeleteHorizontalLines(row);
          document.getElementById("brokenRow").play();
          cont++;
        } else {
          there_is = false;
        }
      }
    }

    for (let row = this.rows - 1; row >= 0; row--) {
      let agregar = true;
      let there_is = true;
      while (there_is) {
        for (let col = 13; col < 23; col++) {
          if (!this.storedMinos[col][row]) {
            agregar = false;
            break;
          }
        }
        if (agregar) {
          this.DeleteHorizontalLines2(row);
          document.getElementById("brokenRow").play();
          cont2++;
        } else {
          there_is = false;
        }
      }
    }
    made_lines += cont == 1 ? cont : cont * 3;
    made_lines2 += cont2 == 1 ? cont2 : cont2 * 3;
    if (made_lines >= 10 || made_lines2 >= 10) {
      let beforeLevel = level;

      let level1 = int(made_lines / 10) + 1;
      let level2 = int(made_lines2 / 10) + 1;
      if (beforeLevel != level1 || beforeLevel != level2) {
        level = level1 > level2 ? level1 : level2;
        clearInterval();
        setInterval(() => {
          if (millis() - regulator_falled < 200) {
            return;
          }
          regulator_falled = millis();
          tetrimino.moveDown();
        }, speeds[level - 1]);
        setInterval(() => {
          if (millis() - regulator_falled2 < 200) {
            return;
          }
          regulator_falled2 = millis();
          tetrimino2.moveDown();
        }, speeds[level - 1]);
      }
    }
  }

  DeleteHorizontalLines(gotRow) {
    for (let row = gotRow; row >= 0; row--) {
      for (let col = 0; col < 10; col++) {
        if (row == 0) {
          this.storedMinos[col][row] = "";
          continue;
        }
        this.storedMinos[col][row] = this.storedMinos[col][row - 1];
      }
    }
  }
  DeleteHorizontalLines2(gotRow) {
    for (let row = gotRow; row >= 0; row--) {
      for (let col = 13; col < 23; col++) {
        if (row == 0) {
          this.storedMinos[col][row] = "";
          continue;
        }
        this.storedMinos[col][row] = this.storedMinos[col][row - 1];
      }
    }
  }

  coordinate(x, y) {
    return createVector(x, y).mult(this.cell_side).add(this.position);
  }

  // It will take care of the logical processing to paint the positions of the GameBoard
  paint() {
    push();
    noStroke();
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if ((col + row) % 2 == 0) {
          // if it is an even cell
          fill("black");
        } else {
          // if it is an odd cell
          fill("#003");
        }
        if (col == 10 || col == 11 || col == 12) {
          fill("black");
        }
        let c = this.coordinate(col, row);
        rect(c.x, c.y, this.cell_side);
      }
    }
    pop();
    this.paintStoredMinos();
  }

  paintStoredMinos() {
    push();
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        let nameMino = this.storedMinos[col][row];
        if (nameMino) {
          fill(tetriminosBase[nameMino].color); // to maintain the color of the tetriminos when they reach the end
          Tetrimino.paintMino(this.coordinate(col, row));
        }
      }
    }
  }
}
