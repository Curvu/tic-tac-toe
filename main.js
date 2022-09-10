const cells = document.querySelectorAll('.cell')

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
    const addPoints = () => this.points++
    
    const playRound = (p) => { this.plays[p] = 1 }
    const reset = () => { this.plays = [0, 0, 0, 0, 0, 0, 0, 0, 0] }
    const getPlay = () => this.plays

    
    return {getPoints, addPoints, playRound, reset, getPlay}
}

const board = BoardState()

const player = new Player()
const bot = new Player()

const generatePlay = () => {
    return Math.floor(9 * Math.random())
}

cells.forEach(cell => {
    cell.addEventListener('click', e => {
        let index = parseInt(e.currentTarget.id.replace('cell-', ''))
        if (board.getBoard()[index] === 0) {
            // Player play
            player.playRound(index)
            board.setBoard(index)
            cells[index].textContent = 'x'


            // Bot play
            if (board.checkBoard()) { // If the board is not full...
                while (board.getBoard()[index]) index = generatePlay()
    
                bot.playRound(index)
                board.setBoard(index)
                cells[index].textContent = 'o'
            }
        }
    })
})