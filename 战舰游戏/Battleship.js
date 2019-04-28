window.onload = function () {
  var view = {
    displayMessage: function (msg) {
      var messageArea = document.getElementById("messageArea")
      messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
      var cell = document.getElementById(location);
      cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
      var cell = document.getElementById(location);
      cell.setAttribute("class", "miss")
    }
  };
  //view.displayMiss("00");
  //view.displayHit("34");
  //view.displayMiss("55");
  //view.displayHit("12");
  //view.displayMiss("25");
  //view.displayHit("26");
  //view.displayMessage("welcome Battleship game!")测试结果
  var model = {
    boardSize: 7,//游戏板网络大小
    numShips: 3,//战舰数
    shipLength: 3,//每艘战舰所占的单元格
    shipsSunk: 0,//战舰被击沉的数量
    ships: [{ locations: ["06", "16", "26"], hits: ["", "", ""] },
               { locations: ["24", "34", "44"], hits: ["", "", ""] },
               { locations: ["10", "11", "12"], hits: ["", "", ""] }],//战舰所处位置以及被击中部位
    fire: function(guess) {
      for (var i = 0; i< this.numShips; i++) {
        var ship = this.ships[i];
        var locations = ship.locations;
        var index = locations.indexOf(guess);
        if (index >=0) {
          ship.hits[index] = "hit";
          view.displayHit(guess);
          view.displayMessage("HIT!");//玩家猜到了战舰位置
          if (this.isSunk(ship)) {
            view.displayMessage("You sank my battleship!")//告诉玩家击沉了一艘战舰
            this.shipsSunk++;
          }
          return true;
        }
      }
      view.displayMiss(guess);
      view.displayMessage("You missed.")//无猜中
      return false;
    },
    isSunk: function(ship) {
      for (var i = 0; i < this.shipLength; i++) {
        if (ship.hits[i] !=="hit") {
          return false;
        }
      }
      return true;
    }
  };
  //model.fire("53");测试结果
  //model.fire("06");
  //model.fire("16");
  //model.fire("26");
  //model.fire("34");
  //model.fire("24");
  //model.fire("44");
  //model.fire("12");
  //model.fire("11");
  //model.fire("10")
  function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G",];
    if (guess === null || guess.length !== 2) {
      alert("Oops, please enter a letter and a number on the board.");
    } else {
      firstChar = guess.charAt(0);
      var row = alphabet.indexOf(firstChar);
      var column = guess.charAt(1);
      if (isNaN(row) || isNaN(column)) {
        alert("Oops, htat isn't on the board.");
      }else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
        alert("Oops, that's off the board!")
      } else {
        return row + column;
      }
    }
    return null;
  }
  //console.log(parseGuess("A0"));调用代码
  //console.log(parseGuess("B6"));
  //console.log(parseGuess("G3"));
  //console.log(parseGuess("H0"));
  //console.log(parseGuess("A7"));
  var controller = {
    guesses: 0,

    processGuess: function(guess) {
      var location = parseGuess(guess);
      if (location) {
        this.guesses++;
        var hit = model.fire(location);
        if (hit && model.shipsSunk === model.numShips) {
          view.displayMessage("You sank all my battleships, in " + this.guesses + "guesses");
        }
      }
    }
  };
  controller.processGuess("A0");
  controller.processGuess("A6");
  controller.processGuess("B6");
  controller.processGuess("C6");
  controller.processGuess("C4");
  controller.processGuess("D4");
  controller.processGuess("E4");
  controller.processGuess("B0");
  controller.processGuess("B1");
  controller.processGuess("B2");
  function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButtom;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
  }
  function handleFireButtom() {
    var guessInput = document.getElementById("guessInput")
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value="";
  }
  window.onload = init;
}
