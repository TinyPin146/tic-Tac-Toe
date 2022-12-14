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
    
    const render = () => {
        stateOfGameboard.forEach((symbol, index) => {
            gameboardTable.querySelector(`#game-square-${index + 1}`).textContent = symbol;
        })
    }
    const playerMarksSpot = function(elementValue, elementDatasetID, symbolOfPlayer) {
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
            console.log('No/missing data');
            return;
        }
        generatePlayerObjects(player1NameInput, player2NameInput)
    }

    // * Creating players
    const generatePlayerObjects = function(player1Name, player2Name) {
        if (players.player1 || players.player2) return;
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
            console.log('There is already something!');
            return;
        }
        gameboard.playerMarksSpot(currentTargetValue, currentTargetDatasetID, currentPlayerSymbol);

        players.player1.hasTheTurn = (!players.player1.hasTheTurn);
        players.player2.hasTheTurn = (!players.player2.hasTheTurn);

        checkGameStatus()
    }

    // * Checking for win || draw
    const checkGameStatus = function() {        
        if (!gameboard.stateOfGameboard.some(value => value === '')) {
            console.log('the game is a draw');
            return;
        }
        const rowsOfGameboard = getRows(gameboard.stateOfGameboard)
        checkIfSomeoneWon(rowsOfGameboard)

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
            console.log(winningArray);
            
            const winnerIndex = winningArray.findIndex(e => e === true);
            if (winnerIndex === -1) return;

            const winnerSymbol = rowsOfGameboard[winnerIndex][0];
            gameEndAndRestart(winnerSymbol);
        }
    }

    // * Announcing winner & restarting option
    function gameEndAndRestart(symbol) {
        console.log(`The winner is ${symbol}`);

    }
    // ! Event handlers
    function evenListeners() {
        gameInterface.querySelector('#start-game-button').addEventListener('click', getPlayerData);
        gameInterface.querySelector('.gameboard').addEventListener('click', playersTakingTurns)
    }
    // ! Init
    function init() {
        evenListeners()
    }
    init()
})()