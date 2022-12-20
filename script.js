// TODO Solve global player variables!!!
    // * SOLUTION: create a players module IIFE with a creator factory function and 2 public player objects 
// let player1;
// let player2;
const players = (function() {
    let player1;
    let player2;
    const playerFactory = function(name, symbol, hasTheTurn) {
            
            return {
                name,
                symbol,
                hasTheTurn,
            }
        };
    return {
        player1,
        player2,
        playerFactory
    }
})()

const gameboard = (function() {
    let stateOfGameboard = ['','', '', '', '', '', '', '', ''];
    const gameboardTable = document.querySelector('.gameboard');
    
    const render = function(arr = stateOfGameboard) {
        arr.forEach((symbol, index) => {
            gameboardTable.querySelector(`#game-square-${index + 1}`).textContent = symbol;
        })
    }
    const playerMarksSpot = function(elementValue, elementDatasetID = '', symbolOfPlayer = '') {
        stateOfGameboard.splice(elementDatasetID, 1, symbolOfPlayer);
        render();
    }
    const init = function() {
        render();
        }
    init()
    // * Public methods
    return {
        stateOfGameboard,
        playerMarksSpot,
        render,
    }
})()

const flowControl = (function() {
    const gameInterface = document.querySelector('.wrapper');
    // * Getting player data and calling create player function
    const getPlayerData = function() {
        if (players.player1 || players.player2) return;
        const player1NameInput = gameInterface.querySelector('#player-1-name').value;
        const player2NameInput = gameInterface.querySelector('#player-2-name').value;
        
        if (player1NameInput === '' || player2NameInput === '') {
            gameInterface.querySelectorAll('label').forEach(e => e.style.color = 'red');
            return;
        }
        generatePlayerObjects(player1NameInput, player2NameInput)
    }

    // * Creating players
    const generatePlayerObjects = function(player1Name, player2Name) {
        if (players.player1 && players.player2) return;
        players.player1 = players.playerFactory(player1Name, 'X', true);
        players.player2 = players.playerFactory(player2Name, 'O', false);
    }

    // * Taking turns
    const playersTakingTurns = function(e) {
        if (players.player1 === undefined) {
            alert('Please initiate the game!');
            return;
        }

        const currentTargetValue = e.target.textContent;
        const currentTargetDatasetID = e.target.dataset.id;
        const currentPlayerSymbol = players.player1.hasTheTurn ? players.player1.symbol : players.player2.symbol;
        
        if (e.target.textContent !== '') {
            return;
        }
        gameboard.playerMarksSpot(currentTargetValue, currentTargetDatasetID, currentPlayerSymbol);

        players.player1.hasTheTurn = (!players.player1.hasTheTurn);
        players.player2.hasTheTurn = (!players.player2.hasTheTurn);

        checkGameStatus()
    }

    // * Checking for win || draw
    const checkGameStatus = function() {        
        
        function getRows(stateOfGameboard) {
            let valuesOfGameboard= [];
            // * Get Rows
            for (let i = 0; i < stateOfGameboard.length; i += 3) {
                valuesOfGameboard.push(stateOfGameboard.slice(i, i + 3));
            } // * Get Columns
            for (let i = 0; i < 3; i++) {
                valuesOfGameboard.push([stateOfGameboard[i], stateOfGameboard[i + 3], stateOfGameboard[i + 6]]);
            } // * Get diagonals
            for (let i = 0; i < 3; i += 2) {
                if (i === 0) valuesOfGameboard.push([stateOfGameboard[i], stateOfGameboard[i + 4], stateOfGameboard[i + 8]]);
                if (i === 2) valuesOfGameboard.push([stateOfGameboard[i], stateOfGameboard[i + 2], stateOfGameboard[i + 4]]);
            }
            return [...valuesOfGameboard]
        }

       function checkIfSomeoneWon(rowsOfGameboard) {
            const winningArray = rowsOfGameboard.map(valueArr => {
                return valueArr.every(e => {
                    if (e === 'X' && !valueArr.includes('O')) return true;
                    if (e === 'O' && !valueArr.includes('X')) return true;
                    return false;
                });
            });
            
            const winnerIndex = winningArray.findIndex(e => e === true);
            if (!gameboard.stateOfGameboard.some(value => value === '')) {
                gameEndAndRestart('draw', true);
            }
            if (winnerIndex === -1) return;

            const winnerSymbol = rowsOfGameboard[winnerIndex][0];
            gameEndAndRestart(winnerSymbol);
        }

        const rowsOfGameboard = getRows(gameboard.stateOfGameboard);
        checkIfSomeoneWon(rowsOfGameboard);
    }

    function gameEndAndRestart(symbol, isDraw = false) {
        gameInterface.querySelector('.gameboard').removeEventListener('click', playersTakingTurns);

        const gameEndCard = document.querySelector('.game-end--wrapper'); 
        const gameEndCardH1 = gameEndCard.querySelector('h1');
        const gameEndRestartBtn = gameEndCard.querySelector('.restart-game--btn');
        const gameEndRestartWithNewNamesBtn = gameEndCard.querySelector('.restart-game-newNames--btn');
        
        gameEndCard.classList.remove('hidden--wrapper');
        
        function restart() {
            gameboard.stateOfGameboard.fill('');
            gameboard.render();
            gameEndCard.classList.add('hidden--wrapper');
            gameInterface.querySelector('.gameboard').addEventListener('click', playersTakingTurns)
            
            if (symbol === 'draw') {
            } else if (symbol === 'O') {
                players.player2.hasTheTurn = false;
                players.player1.hasTheTurn = true;
            } else if (symbol === 'X' ) {
                players.player2.hasTheTurn = true;
                players.player1.hasTheTurn = false;
            }
            getPlayerData();
        }

        function restartAndResetNames() {
            gameboard.stateOfGameboard.fill('');
            gameboard.render();
            gameEndCard.classList.add('hidden--wrapper');
            
            delete players.player1;
            delete players.player2;
            gameInterface.querySelector('#player-1-name').value = '';
            gameInterface.querySelector('#player-2-name').value = '';
            init();
        }
        
        gameEndRestartBtn.addEventListener('click', restart, {once: true,});
        gameEndRestartWithNewNamesBtn.addEventListener('click', restartAndResetNames, {once: true,});
        if (isDraw) {
            gameEndCardH1.textContent = 'You have reached a draw. You can restart the game!';
            return;
        }
        const winnerPlayer = players.player1.symbol === `${symbol}` ? players.player1 : players.player2;
        gameEndCardH1.textContent = `The winner is ${winnerPlayer.name}! Congrats!`;
    }
    
    // ! Event handlers
    function eventListeners() {
        gameInterface.querySelector('#start-game-button').addEventListener('click', getPlayerData);
        gameInterface.querySelector('.gameboard').addEventListener('click', playersTakingTurns)
    }
    // ! Init
    function init() {
        eventListeners()
    }
    init()
})()