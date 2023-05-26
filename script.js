let numBox = document.getElementsByClassName("number-box")[0];
let display = document.getElementsByClassName("display")[0];
let playersContainer = document.getElementsByClassName("players")[0];
let resultContainer = document.getElementsByClassName("result")[0];
let timerContainer = document.getElementsByClassName("timer")[0];

let playerPoints = {};
let playerNumbers = [];
let botNumbers = [];
let timerSeconds = 30;
let timerInterval;

// Create buttons for numbers 1 to 100
for (let i = 1; i <= 100; i++) {
  let numButton = document.createElement("button");
  numButton.textContent = i;
  numButton.addEventListener("click", function () {
    if (playerNumbers.length < 1 && timerSeconds === 0) {
      let selectedNumber = i;
      updateDisplay(selectedNumber);
      playerNumbers.push(selectedNumber);
      numButton.disabled = true;
      playBots();
    }
  });
  numBox.appendChild(numButton);
}

function initializePlayerPoints() {
  playerPoints = {
    player1: 0,
    bot1: 0,
    bot2: 0,
    bot3: 0,
    bot4: 0,
  };
}

function updatePlayerPoints(playerName, points) {
  playerPoints[playerName] += points;
  if (playerPoints[playerName] < -10) {
    playerPoints[playerName] = -10;
  }
}

function displayPlayerPoints() {
  for (let playerName in playerPoints) {
    let points = playerPoints[playerName];
    let playerElement = document.getElementById(playerName);
    playerElement.querySelector(".points").textContent = "Points: " + points;
  }
}

function updateDisplay(value) {
  display.textContent = "Your Number: " + value;
}

function playBots() {
  let numPlayers = 5;

  for (let i = 0; i < numPlayers - 1; i++) {
    let botNumber = Math.floor(Math.random() * 100) + 1;
    botNumbers.push(botNumber);
    playersContainer.appendChild(
      createPlayerElement("Bot " + (i + 1), botNumber, false)
    );
  }

  if (playerNumbers.length + botNumbers.length === numPlayers) {
    calculateResults();
  }
}

function createPlayerElement(name, number, isPlayer) {
  let playerElement = document.createElement("div");
  playerElement.classList.add("player");

  let nameElement = document.createElement("span");
  nameElement.classList.add("name");
  nameElement.textContent = name;
  playerElement.appendChild(nameElement);

  if (isPlayer) {
    let numberElement = document.createElement("span");
    numberElement.classList.add("number");
    numberElement.textContent = number;
    playerElement.appendChild(numberElement);
  }

  return playerElement;
}

function calculateResults() {
  let allNumbers = playerNumbers.concat(botNumbers);
  let sum = allNumbers.reduce((a, b) => a + b, 0);
  let average = sum / allNumbers.length;

  let closestNumber = botNumbers[0];
  let closestDifference = Math.abs(average - botNumbers[0]);

  for (let i = 1; i < botNumbers.length; i++) {
    let difference = Math.abs(average - botNumbers[i]);
    if (difference < closestDifference) {
      closestNumber = botNumbers[i];
      closestDifference = difference;
    }
  }

  resultContainer.innerHTML = `
    <h2>Results</h2>
    <p>Average: ${average.toFixed(2)}</p>
    <p>Closest Number: ${closestNumber}</p>`;

  for (let i = 0; i < botNumbers.length; i++) {
    resultContainer.innerHTML += `<p>Bot ${i + 1} Number: ${botNumbers[i]}</p>`;
  }

  let winningPlayer = "You";
  let winningDifference = Math.abs(average - playerNumbers[0]);

  for (let i = 0; i < botNumbers.length; i++) {
    let difference = Math.abs(average - botNumbers[i]);
    if (difference < winningDifference) {
      winningPlayer = "Bot " + (i + 1);
      winningDifference = difference;
    }
  }

  resultContainer.innerHTML += `<p>Winner: ${winningPlayer}</p>`;

  for (let playerName in playerPoints) {
    if (playerName === winningPlayer) {
      updatePlayerPoints(playerName, 0);
    } else {
      updatePlayerPoints(playerName, -1);
    }
  }

  displayPlayerPoints();
  handleGameOver();
}

function handleGameOver() {
    let outPlayers = Object.keys(playerPoints).filter(
      (playerName) => playerPoints[playerName] === -10
    );
  
    if (outPlayers.length > 0) {
      resultContainer.innerHTML = `
        <h2>Game Over!</h2>
        <p>Player ${outPlayers[0]} has reached -10 points.</p>`;
  
      clearInterval(timerInterval);
      numBox.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
      });
    } else {
      resultContainer.innerHTML = "<h2>Get Ready for the Next Round!</h2>";
    }
  }

function handleTimerEnd() {
  clearInterval(timerInterval);
  timerContainer.textContent = "Time Up! Please choose your number.";
  numButton.disabled = false;
  calculateResults();
  setTimeout(handleGameOver, 2000);
}

function startTimer() {
  timerSeconds = 30;
  timerContainer.textContent = formatTime(timerSeconds);

  timerInterval = setInterval(() => {
    timerSeconds--;
    timerContainer.textContent = formatTime(timerSeconds);

    if (timerSeconds === 0) {
      handleTimerEnd();
    }
  }, 1000);
}

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function startGame() {
    initializePlayerPoints();
    playerNumbers = [];
    botNumbers = [];
    resultContainer.innerHTML = "";
    startTimer();
    
    // Enable number buttons
    numBox.querySelectorAll("button").forEach((button) => {
      button.disabled = false;
    });
  }
  

startGame();
