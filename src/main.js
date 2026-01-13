import './style.css'
import Phaser from 'phaser'

//Start screen
class StartScene extends Phaser.Scene {
  constructor() {
    super('scene-start')
  }

  create() {
    this.add.rectangle(0, 0, 800, 600, 0x2d2d2d).setOrigin(0)

    this.add.text(400, 200, 'FIRE MATH', { 
        fontSize: '64px', 
        color: '#ff4400', 
        fontStyle: 'bold' 
    }).setOrigin(0.5)

    this.add.text(400, 270, 'Rapid Arithmetic', { 
        fontSize: '24px', 
        color: '#ffffff' 
    }).setOrigin(0.5)

    const playBtn = this.add.text(400, 400, 'PLAY', { 
        fontSize: '32px', 
        color: '#0aaae4', 
        backgroundColor: '#000',
        padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true }) // Adds hand cursor on hover

    playBtn.on('pointerdown', () => {
        this.scene.start('scene-game')
    })
    
    playBtn.on('pointerover', () => playBtn.setStyle({ fill: '#ff0' }))
    playBtn.on('pointerout', () => playBtn.setStyle({ fill: '#0aaae4' }))
  }
}

//Gameplay
class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game')
    this.score = 0
    this.currentAnswer = 0
    this.userAnswer = ""
    this.timeLeft = 10
  }

  create() {
    this.score = 0
    this.userAnswer = ""
    this.timeLeft = 10

    this.add.rectangle(0, 0, 800, 600, 0x87CEEB).setOrigin(0)
    
    this.add.rectangle(400, 300, 400, 400, 0x666666)
    this.fireSquare = this.add.rectangle(400, 300, 300, 300, 0xFF0000)

    this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '30px', color: '#fff' })
    this.timerText = this.add.text(780, 20, 'Time: 10', { fontSize: '30px', color: '#fff' }).setOrigin(1, 0)
    
    this.problemText = this.add.text(400, 260, '', { 
        fontSize: '48px', color: '#fff', fontStyle: 'bold' 
    }).setOrigin(0.5)

    this.inputText = this.add.text(400, 340, '?', { 
        fontSize: '30px', color: '#0aaae4', backgroundColor: '#000', padding: {x:10, y:5}
    }).setOrigin(0.5)

    //Input Handling
    this.input.keyboard.off('keydown') 
    this.input.keyboard.on('keydown', this.handleInput, this)

    //Timer event
    this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true
    })

    this.generateProblem()
  }

  updateTimer() {
    this.timeLeft--
    this.timerText.setText('Time: ' + this.timeLeft)

    if (this.timeLeft <= 0) {
        // LOSE CONDITION: Time runs out
        this.scene.start('scene-result', { score: this.score, won: false })
    }
  }

  generateProblem() {
    let n1 = Phaser.Math.Between(1, 100)
    let n2 = Phaser.Math.Between(1, 100)
    this.currentAnswer = n1 + n2
    this.userAnswer = ""
    this.problemText.setText(`${n1} + ${n2}`)
    this.inputText.setText("?")
    this.fireSquare.setVisible(true)
  }

  handleInput(event) {
    if (event.key >= '0' && event.key <= '9') {
        this.userAnswer += event.key
        this.inputText.setText(this.userAnswer)
    } else if (event.keyCode === 8) { //backspace
        this.userAnswer = this.userAnswer.slice(0, -1)
        this.inputText.setText(this.userAnswer)
    } else if (event.keyCode === 13) { //Enter
        this.checkAnswer()
    }
  }

  checkAnswer() {
    if (parseInt(this.userAnswer) === this.currentAnswer) {
        this.score += 10
        this.scoreText.setText('Score: ' + this.score)
        this.fireSquare.setVisible(false)
        
        //win condition
        if (this.score >= 100) {
            this.scene.start('scene-result', { score: this.score, won: true })
        } else {
            this.time.delayedCall(200, this.generateProblem, [], this)
        }
    } else {
        this.userAnswer = ""
        this.inputText.setText("Wrong")
    }
  }
}

//Result screen
class ResultScene extends Phaser.Scene {
  constructor() {
    super('scene-result')
  }

  init(data) {
    this.finalScore = data.score || 0
    this.hasWon = data.won || false
  }

  create() {
    this.add.rectangle(0, 0, 800, 600, 0x000000).setOrigin(0)

    const titleText = this.hasWon ? 'YOU WIN!' : 'TIME\'S UP'
    const color = this.hasWon ? '#00ff00' : '#ff0000'

    this.add.text(400, 200, titleText, { 
        fontSize: '64px', 
        color: color, 
        fontStyle: 'bold' 
    }).setOrigin(0.5)

    this.add.text(400, 300, `Final Score: ${this.finalScore}`, { 
        fontSize: '32px', 
        color: '#fff' 
    }).setOrigin(0.5)

    const restartBtn = this.add.text(400, 450, 'Main Menu', { 
        fontSize: '28px', 
        color: '#fff', 
        backgroundColor: '#333',
        padding: { x: 15, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })

    restartBtn.on('pointerdown', () => {
        this.scene.start('scene-start')
    })
  }
}


const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  canvas: document.getElementById('gameCanvas'),
  parent: 'gameContainer',
  scene: [StartScene, GameScene, ResultScene]
}

new Phaser.Game(config)