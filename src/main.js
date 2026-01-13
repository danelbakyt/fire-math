import './style.css'
import Phaser from 'phaser'

class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game')
    this.score = 0
    this.currentAnswer = 0
    this.userAnswer = ""
  }

  preload() {
    //this.load.image()
  }

  create() {
    this.add.rectangle(0, 0, 800, 600, 0x87CEEB).setOrigin(0)
    
    this.add.rectangle(400, 300, 400, 400, 0x666666)
    this.fireSquare = this.add.rectangle(400, 300, 300, 300, 0xFF0000)

    this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '30px', color: '#fff' })
    
    this.problemText = this.add.text(400, 260, '', { 
        fontSize: '48px', color: '#fff', fontStyle: 'bold' 
    }).setOrigin(0.5)

    this.inputText = this.add.text(400, 340, '?', { 
        fontSize: '32px', color: '#0aaae4', backgroundColor: '#000' 
    }).setOrigin(0.5)

    this.input.keyboard.on('keydown', this.handleInput, this)

    this.generateProblem()
  }

  update() {
    //Later
  }

  generateProblem() {
    let n1 = Phaser.Math.Between(1, 100)
    let n2 = Phaser.Math.Between(1, 100)
    this.currentAnswer = n1 + n2
    this.userAnswer = ""
    this.problemText.setText(`${n1} + ${n2}`)
    this.inputText.setText("Type numbers")
    this.fireSquare.setVisible(true)
  }

  handleInput(event) {
    if (event.key >= '0' && event.key <= '9') {
        this.userAnswer += event.key
    } else if (event.keyCode === 8) { //Backspace
        this.userAnswer = this.userAnswer.slice(0, -1)
    } else if (event.keyCode === 13) { //Enter
        this.checkAnswer()
    }
    this.inputText.setText(this.userAnswer)
  }

  checkAnswer() {
    if (parseInt(this.userAnswer) === this.currentAnswer) {
        this.score += 10
        this.scoreText.setText('Score: ' + this.score)
        this.fireSquare.setVisible(false)
        
        this.time.delayedCall(500, this.generateProblem, [], this)
    } else {
        this.userAnswer = ""
        this.inputText.setText("Wrong")
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  canvas: gameCanvas,
  parent: 'gameContainer',
  scene: GameScene
}

new Phaser.Game(config)