//Se va a encargar de representar el modelo del GameBoard de juego
class GameBoard {
  constructor() {
    this.cols = 10;
    this.rows = 23;
    this.cell_side = 25;
    this.width_gameboard = this.cols * this.cell_side;
    this.high_gameboard = this.rows * this.cell_side;
    this.position = createVector(
      gameboard_margin,
      gameboard_margin + this.cell_side
    );
    //storedMinos es la variable que se encarga de representar los minos almacenados en el GameBoard
    this.storedMinos = [];
    for (let row = 0; row < this.rows; row++) {
      this.storedMinos[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.storedMinos[row].push("");
      }
    }
  }

  set storeMino(tetrimino) {
    for (const pmino of tetrimino.gameBoardMap) {
      if (pmino.y < 0) {
        //Game Over
        clouseGame();
      }
      this.storedMinos[pmino.x][pmino.y] = tetrimino.name;
    }
    this.findHorizontalLinesToDelete();
  }

  findHorizontalLinesToDelete() {
    let cont = 0;
    for (let row = this.rows - 1; row >= 0; row--) {
      let agregar = true;
      let there_is = true;
      while (there_is) {
        for (let col = 0; col < this.cols; col++) {
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
    made_lines += cont == 1 ? cont : cont * 3;
    if (made_lines >= 10) {
      let beforeLevel = level;
      level = int(made_lines / 10) + 1;
      if (beforeLevel != level) {
        clearInterval();
        setInterval(() => {
          if (millis() - regulator_falled < 200) {
            return;
          }
          regulator_falled = millis();
          tetrimino.moveDown();
        }, speeds[level - 1]);
      }
    }
  }

  DeleteHorizontalLines(gotRow) {
    for (let row = gotRow; row >= 0; row--) {
      for (let col = 0; col < this.cols; col++) {
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

  // Se encargara del procesamiento logico para paint las positiones del GameBoard
  paint() {
    push();
    noStroke();
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if ((col + row) % 2 == 0) {
          //si es una celda par
          fill("black");
        } else {
          // si es una celda impar
          fill("#003");
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
          fill(tetriminosBase[nameMino].color); //para mantener el color de los tetriminos cuando llegan al final
          Tetrimino.paintMino(this.coordinate(col, row));
        }
      }
    }
  }
}
