const cells = document.querySelectorAll('.cell')
const playerScore = document.getElementById('player-score')
const botScore = document.getElementById('bot-score')
const historyCont = document.getElementById('history')
const clearBtn = document.querySelector('.button')

let history = JSON.parse(localStorage.getItem('history')) || []

let BoardState = function() {
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    const getBoard = () => this.board
    const checkBoard = () => this.board.filter(cell => cell === 1).length === 9 ? false : true /* Check if the board is full or not */
    const setBoard = (p) => { this.board[p] = 1 }
    const reset = () => { this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0] }

    return {getBoard, checkBoard, setBoard, reset}
}

const Player = function() {
    this.points = 0
    this.plays = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    
    const getPoints = () => this.points
    const addPoint = () => this.points++
    const resetPoints = () => {
        this.points = 0;
    }
    
    const playRound = (p) => { this.plays[p] = 1 }
    const reset = () => { this.plays = [0, 0, 0, 0, 0, 0, 0, 0, 0] }
    const getPlay = () => this.plays

    const checkWin = () => {
        if(this.plays[0] === 1 && this.plays[1] === 1 && this.plays[2] === 1) return true
        if(this.plays[3] === 1 && this.plays[4] === 1 && this.plays[5] === 1) return true
        if(this.plays[6] === 1 && this.plays[7] === 1 && this.plays[8] === 1) return true
        if(this.plays[0] === 1 && this.plays[3] === 1 && this.plays[6] === 1) return true
        if(this.plays[1] === 1 && this.plays[4] === 1 && this.plays[7] === 1) return true
        if(this.plays[2] === 1 && this.plays[5] === 1 && this.plays[8] === 1) return true
        if(this.plays[0] === 1 && this.plays[4] === 1 && this.plays[8] === 1) return true
        if(this.plays[2] === 1 && this.plays[4] === 1 && this.plays[6] === 1) return true
        return false
    }
    
    const winGame = () => this.points === 5

    return {getPoints, addPoint, resetPoints, playRound, reset, getPlay, checkWin, winGame}
}

const board = BoardState()

const player = new Player()
const bot = new Player()

const generatePlay = () => Math.floor(9 * Math.random())

const resetGame = () => {
    cells.forEach(cell => {cell.textContent = ''})
    board.reset()
    player.reset()
    bot.reset()
}

const totalReset = () => {
    player.resetPoints()
    playerScore.textContent = player.getPoints()
    bot.resetPoints()
    botScore.textContent = bot.getPoints()
}

const addHistory = (game) => {
    history.push(game)
    localStorage.setItem('history', JSON.stringify(history))
    renderHistory()
}

const renderHistory = () => {
    historyCont.innerHTML = ''
    history.forEach(element => {
        historyCont.innerHTML += `<li>${element}</li>`
        console.log(element)
    })
}

cells.forEach(cell => {
    cell.addEventListener('click', e => {
        let index = parseInt(e.currentTarget.id.replace('cell-', ''))
        if (board.getBoard()[index] === 0) {
            // Player play
            player.playRound(index)
            board.setBoard(index)
            cells[index].textContent = 'x'

            if (player.checkWin()) {
                player.addPoint()
                console.log('player points: ', player.getPoints())
                playerScore.textContent = player.getPoints()

                
                if(player.winGame()) {
                    addHistory('Win')
                    totalReset()
                }
                resetGame()
                return
            }

            if (board.checkBoard()) { // If the board is not full...
                // Bot play
                while (board.getBoard()[index]) index = generatePlay() // generate a unplayed position
    
                bot.playRound(index)
                board.setBoard(index)
                cells[index].textContent = 'o'

                if (bot.checkWin()) {
                    bot.addPoint()
                    console.log('bot points: ', bot.getPoints())
                    botScore.textContent = bot.getPoints()

                    if(bot.winGame()) {
                        addHistory('Loose')
                        totalReset()
                    }
                    resetGame()
                    return
                }
            } else {
                resetGame()
                return
            }
        }
    })
})

// Game History

window.addEventListener('DOMContentLoaded', () => {
    renderHistory()
})

clearBtn.addEventListener('click', () => {
    history = []
    localStorage.setItem('history', JSON.stringify(history))
    renderHistory()
})