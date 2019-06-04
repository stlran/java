alert("点击确定即可开始游戏")
var view = {
  displayMessage: function (msg) {
    var messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = msg;
  },
  displayHit: function (location, index) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit" + (index + 1));
  },

  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  ships: [{ locations: ['0', '0', '0'], hits: ["", "", ""], direction: 0 },
  { locations: ['0', '0', '0'], hits: ["", "", ""], direction: 0 },
  { locations: ['0', '0', '0'], hits: ["", "", ""], direction: 0 }],
  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var direction = ship.direction;
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = 'hit';
        console.log(ship)
        console.log(this.isSunk(ship));
        //击中一部分跳出其它部分
        for (var i = 0; i < ship.locations.length; i++) {
          if (direction == 1) {
            //显示横着的没击中部分
            if (i != index) {
              view.displayHit(ship.locations[i], i);
            }
          } else {
            //显示竖的没击中的部分
            if (i != index) {
              view.displayHit(ship.locations[i], i + 3);
            }
          }
          // var cliclcolor = document.getElementById(ship.locations[i])
          // cliclcolor.style.backgroundColor = 'red'
        }
        //view.displayHit(guess);
        view.displayMessage('hit!');
        var BOM = document.getElementById(ship.locations[index]);

        // BOM.classList.remove("hit");
        // 变成爆炸图
        BOM.classList.add("boom");
        if (this.isSunk(ship)) {
          view.displayMessage('You sank my battleship!');

          this.shipsSunk++;
          for (var i = 0; i < ship.locations.length; i++) {
            var BOM = document.getElementById(ship.locations[i])
            // BOM.classList.remove("hit");
            BOM.classList.add("boom");

            // console.log(document.getElementById(ship.locations[i]));      
            var shipSunk = document.getElementById(ship.locations[i]);
            shipSunk.onclick = null;

          }
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage('You missed.');
    return false;
  },
  isSunk: function (ship) {
    var count = 0;
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] === "hit") {
        count++;
      }

    }

    if (count >= (this.shipLength * 0.666)) {
      return true;
    } else {
      return false;
    }
  },
  // isSunk: function(ship) {
  //     for (var i = 0; i<this.shipLength;i++) {
  //       if (ship.hits[i] !== "hit") {
  //        return false;
  //       }
  //     }
  //     return true;
  // },

  generateShipLocations: function () {
    var locations;
    var direction;
    for (var i = 0; i < this.numShips; i++) {
      do {
        var newShipLocations = this.generateShip();
        //获取生成的方向和位置
        direction = newShipLocations.slice(0, 1)[0]
        locations = newShipLocations.splice(1, 3);
      } while (this.collision(locations))
      this.ships[i].locations = locations;
      this.ships[i].direction = direction;
    }
  },
  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize)
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength))
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize)
    }
    // 随机产生的方向标识
    // 1代表横向，2代表竖向
    var newShipLocations = [];
    if (direction == 1) {
      newShipLocations.push(1);
    } else {
      newShipLocations.push(2);
    }
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i))
      } else {
        newShipLocations.push((row + i) + "" + col)
      }
    }
    return newShipLocations;
  },
  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
}

function parseGuess(guess) {
  var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  if (guess === null || guess.length !== 2) {
    alert('Oops, please enter a letter and a number on the board.')
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.")
    } else if (row < 0 || row >= model.boardSize ||
      column < 0 || column >= model.boardSize) {
      alert("Oops, that's off the board!")
    } else {
      return row + column;
    }
  }
  return null;
}
var controller = {
  guesses: 0,
  processGuess: function (event) {
    var location = event.target.id;
    console.log(location);
    if (location) {
      controller.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {

        view.displayMessage('You sank all my battleships, in' + controller.guesses + 'guesses');
        // 游戏结束
        alert("恭喜你击沉全部战舰，游戏结束");
      }
    }
  }
}
function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var shubiaodianji = document.getElementsByTagName('td');
  for (var i = 0; i < shubiaodianji.length; i++) {
    shubiaodianji[i].onclick = controller.processGuess;
  }
  console.log(model.ships);
  var guessInput = document.getElementById('guessInput');
  guessInput.onkeypress = handleKeypress;
  model.generateShipLocations()
}
function handleKeypress(e) {
  var fireButton = document.getElementById('fireButton');
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}
function getTargetId(event) {
  console.log(event.target.id)
}
function handleFireButton() {
  var guessInput = document.getElementById('guessInput')
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";

}
window.onload = init;