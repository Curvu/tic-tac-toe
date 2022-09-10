const cells = document.querySelectorAll('.cell')
const playerScore = document.getElementById('player-score')
const botScore = document.getElementById('bot-score')

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
    
    return {getPoints, addPoint, playRound, reset, getPlay, checkWin}
}

const board = BoardState()

const player = new Player()
const bot = new Player()

const generatePlay = () => {
    return Math.floor(9 * Math.random())
}

const resetGame = () => {
    cells.forEach(cell => {cell.textContent = ''})
    board.reset()
    player.reset()
    bot.reset()
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
                // Reset things
                resetGame()
                return
            }

            // Bot play
            if (board.checkBoard()) { // If the board is not full...
                while (board.getBoard()[index]) index = generatePlay()
    
                bot.playRound(index)
                board.setBoard(index)
                cells[index].textContent = 'o'

                if (bot.checkWin()) {
                    bot.addPoint()
                    console.log('bot points: ', bot.getPoints())
                    botScore.textContent = bot.getPoints()

                    resetGame()
                    return
                }
            } else {
                console.log('draw')
            }
        }
    })
})