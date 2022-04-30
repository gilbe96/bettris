class Tetrimino {
  constructor(name = random(["Z", "S", "J", "L", "T", "O", "I"])) {
    // to start with a random figure
    this.name = name;
    let base = tetriminosBase[name];
    this.color = base.color;
    this.map = [];
    for (const pmino of base.map) {
      this.map.push(pmino.copy());
    }
    this.position = createVector(int(gameBoard.cols / 4), 0); // belongs to p5.js, I set initial position
  }

  // movements
  moveRight() {
    this.position.x++;

    if (this.wrongMove) {
      this.moveLeft();
    }
  }
  moveLeft() {
    this.position.x--;

    if (this.wrongMove) {
      this.moveRight();
    }
  }
  moveUp() {
    this.position.y--;
  }
  moveDown() {
    this.position.y++;
    if (this.wrongMove) {
      this.moveUp();
      if (tetrimino == this) {
        gameBoard.storeMino(this, 1);
        tetrimino = new Tetrimino();
      }
      return false;
    }
    return true;
  }
  setBackground() {
    this.position = this.spectrum.position;
    this.moveDown();
  }
  rotate() {
    for (const pmino of this.map) {
      pmino.set(pmino.y, -pmino.x);
    }
    if (this.wrongMove) {
      this.unrotate();
    }
  }
  unrotate() {
    for (const pmino of this.map) {
      pmino.set(-pmino.y, pmino.x);
    }
  }

  get wrongMove() {
    let getOutGameBoard = !this.onGameBoard;
    return getOutGameBoard || this.collisionWithStoredMinos;
  }

  get collisionWithStoredMinos() {
    for (const pmino of this.gameBoardMap) {
      if (gameBoard.storedMinos[pmino.x][pmino.y]) {
        return true;
      }
    }
    return false;
  }

  get onGameBoard() {
    for (const pmino of this.gameBoardMap) {
      if (pmino.x < 0) {
        // avoid left exit
        return false;
      }
      if (pmino.x >= 10) {
        // avoid right exit
        return false;
      }
      if (pmino.y >= gameBoard.rows) {
        // avoid down exit
        return false;
      }
    }
    return true;
  }

  get gameBoardMap() {
    let retorno = [];
    for (const pmino of this.map) {
      let copy = pmino.copy().add(this.position);
      retorno.push(copy);
    }
    return retorno;
  }

  get mapCanvas() {
    let retorno = [];
    for (const pmino of this.map) {
      let copy = pmino.copy().add(this.position);
      retorno.push(gameBoard.coordinate(copy.x, copy.y));
    }
    return retorno;
  }

  // this function is responsible for painting this object
  paint() {
    push();
    fill(this.color);
    for (const pmino of this.mapCanvas) {
      Tetrimino.paintMino(pmino);
    }
    pop();
    if (tetrimino == this) {
      this.paintSpectrum();
    }
  }

  // to create a shadow at the end to know where the tetrimino will end
  paintSpectrum() {
    this.spectrum = new Tetrimino(this.name);
    this.spectrum.position = this.position.copy();
    for (let i = 0; i < this.map.length; i++) {
      this.spectrum.map[i] = this.map[i].copy();
    }
    while (this.spectrum.moveDown());
    push();
    drawingContext.globalAlpha = 0.3; // var of p5.js
    this.spectrum.paint();
    pop();
  }

  static paintMino(pmino) {
    rect(pmino.x, pmino.y, gameBoard.cell_side);
    push();
    noStroke();
    fill(255, 255, 255, 100);
    beginShape();
    vertex(pmino.x, pmino.y);
    vertex(pmino.x + gameBoard.cell_side, pmino.y);
    vertex(pmino.x + gameBoard.cell_side, pmino.y + gameBoard.cell_side);
    endShape(CLOSE);
    fill(0, 0, 0, 80);
    beginShape();
    vertex(pmino.x, pmino.y);
    vertex(pmino.x, pmino.y + gameBoard.cell_side);
    vertex(pmino.x + gameBoard.cell_side, pmino.y + gameBoard.cell_side);
    endShape(CLOSE);
    pop();
  }
}

function createMappingBaseTetriminos() {
  // it is a global var
  tetriminosBase = {
    Z: {
      color: "red",
      map: [
        createVector(),
        createVector(-1, -1),
        createVector(0, -1),
        createVector(1, 0),
      ],
    },
    S: {
      color: "green",
      map: [
        createVector(),
        createVector(1, -1),
        createVector(0, -1),
        createVector(-1, 0),
      ],
    },
    J: {
      color: "orange",
      map: [
        createVector(),
        createVector(-1, 0),
        createVector(-1, -1),
        createVector(1, 0),
      ],
    },
    L: {
      color: "dodgerblue",
      map: [
        createVector(),
        createVector(-1, 0),
        createVector(1, -1),
        createVector(1, 0),
      ],
    },
    T: {
      color: "magenta",
      map: [
        createVector(),
        createVector(-1, 0),
        createVector(1, 0),
        createVector(0, -1),
      ],
    },
    O: {
      color: "yellow",
      map: [
        createVector(),
        createVector(0, -1),
        createVector(1, -1),
        createVector(1, 0),
      ],
    },
    I: {
      color: "cyan",
      map: [
        createVector(),
        createVector(-1, 0),
        createVector(1, 0),
        createVector(2, 0),
      ],
    },
  };
}
