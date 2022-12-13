// TODO Solve global player variables!!!
let player1;
let player2;
const players = function(name, symbol, hasTheTurn) {
    
    return {
        name,
        symbol,
        hasTheTurn,
    }
};

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

    const eventListeners = function() {
    }

    const init = function() {
        render();
        eventListeners();
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
        if (player1 || player2) return;
        const player1NameInput = gameInterface.querySelector('#player-1-name').value;
        const player2NameInput = gameInterface.querySelector('#player-2-name').value;
        
        if (player1NameInput === '' || player2NameInput === '') {
            console.log('No/missing data');
            return;
        }
        generatedPlayers(player1NameInput, player2NameInput)
    }

    // * Creating players
    const generatedPlayers = function(player1Name, player2Name) {
        if (player1 || player2) return;
        player1 = players(player1Name, 'X', true);
        player2 = players(player2Name, 'O', false);
        
        console.log({player1, player2});
    }

    // * Taking turns
    const playersTakingTurns = function(e) {
        if (player1 === undefined) {
            alert('Please initiate the game!');
            return;
        }
        const currentTargetValue = e.target.textContent;
        const currentTargetDatasetID = e.target.dataset.id;
        const currentPlayerSymbol = player1.hasTheTurn ? player1.symbol : player2.symbol;
        
        if (e.target.textContent !== '') {
            console.log('There is already something!');
            return;
        }
        gameboard.playerMarksSpot(currentTargetValue, currentTargetDatasetID, currentPlayerSymbol)

        player1.hasTheTurn = (!player1.hasTheTurn)
        player2.hasTheTurn = (!player2.hasTheTurn)
    }

    // * Checking for win || draw

    // * Announcing winner & restarting option

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
    return {
        generatedPlayers,
        player1,
        player2
    }
})()

const trefortosFeladatGyak = (function() {
    function trefortFeladat(range) {
        const grinchlehetségesSzámai = getPrimes(range);
        const cindyLehetségesSzámai = getArrayOfNumbersInRAnge(range)

        const arr = []
        grinchlehetségesSzámai.map(szám => {
            const számSzor100 = szám * 100;
            for (let i = 0; i < cindyLehetségesSzámai.length; i++) {
                arr.push(számSzor100 + cindyLehetségesSzámai[i]);
            }
        })
        const arr2 = arr.map(num => Math.sqrt(num))
        return arr2;
    }

    function getPrimes(maxNum) {
        let primesInRange = [];
        for (let i = 1; i <= maxNum; i++) {
            if (isPrime(i)) primesInRange.push(i);
        }
        return primesInRange;
    }

    function isPrime(num) {
        if (isNaN(num) || !isFinite(num) || num % 1 || num <= 1) return false;
        if (num % 2 === 0 && num !== 2) return false;
        if (num % 3 == 0) return false;

        for (let i = 5; i <= Math.sqrt(num); i += 6) {
            if (num % i === 0) return false;
            if (num % (i + 2) == 0) return false; 
        }
        return true;
    }

    function getArrayOfNumbersInRAnge(maxNum) {
        let numArr = []
        for(let i = 1; i <= maxNum; i++) {
            numArr.push(i)
        }
        return numArr;
    }
    return {
        trefortFeladat,
    }
})()
console.log(trefortosFeladatGyak.trefortFeladat(40))