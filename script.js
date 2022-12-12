const players = function(name, symbol) {
    
    return {
        name,
        symbol,
    }
};

const gameboard = (function() {
    let stateOfGameboard = ['x','o', '', 'x', 'o', 'o', '', 'x', ''];
    
    
    const render = () => {
        const gameboard = document.querySelector('.gameboard');
        stateOfGameboard.forEach((symbol, index) => {
            gameboard.querySelector(`#game-square-${index + 1}`).textContent = symbol;
        })
    }
    const init = function() {
        render()
    }
    init()
    // * Public methods
    return {
    }
})()

const flowControl = (function() {

})()
