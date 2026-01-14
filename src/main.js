import './style.css'
import Phaser from 'phaser'

//Start screen
class StartScene extends Phaser.Scene {
  constructor() {
    super('scene-start')
  }

  preload() {
      this.load.audio('bg-music', '/assets/bg.mp3');
  }

  create() {
    if (!this.sound.get('bg-music')) {
        const music = this.sound.add('bg-music', { 
            volume: 0.4, 
            loop: true 
        });
        music.play();
    }

    this.add.rectangle(0, 0, 800, 600, 0xFFFFFF).setOrigin(0)

    this.add.text(400, 220, 'FIRE MATH', { 
        fontSize: '64px', 
        color: '#FFD93D', 
        fontStyle: 'bold' 
    }).setOrigin(0.5)

    this.add.text(400, 320, 'How to play: Enter number-answer and press enter', { 
    fontSize: '18px', 
    color: '#000000',
    }).setOrigin(0.5);

    // Add this below your "How to play" text and above the Play button
    this.add.text(400, 350, 'Bonus: +2 seconds for every correct answer!', { 
        fontSize: '18px', 
        color: '#33B864',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    const playBtn = this.add.text(400, 410, 'PLAY', { 
        fontSize: '32px', 
        color: '#FF8C42', 
        backgroundColor: '#000',
        padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({useHandCursor: true })

    playBtn.on('pointerdown', () => {
        this.scene.start('scene-game')
    })
    
    playBtn.on('pointerover', () => playBtn.setStyle({ fill: '#ff0' }))
    playBtn.on('pointerout', () => playBtn.setStyle({ fill: '#FF8C42' }))
  }
}

//Gameplay
class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game')
    this.score = 0
    this.currentAnswer = 0
    this.userAnswer = ""
    this.timeLeft = 20
  }

  preload() {
    this.load.image('flare', '/assets/fire.png');
  }

  create() {
      this.score = 0;
      this.userAnswer = "";
      this.timeLeft = 20;

      this.bg = this.add.rectangle(0, 0, 800, 600, 0x33B864).setOrigin(0);
      
      this.add.rectangle(400, 85, 608, 28, 0x000000); 
      this.add.rectangle(400, 85, 600, 20, 0x333333).setAlpha(0.5);
      this.barFill = this.add.rectangle(100, 85, 0, 20, 0x00ff00).setOrigin(0, 0.5);
      this.fireMarker = this.add.sprite(100, 85, 'flare').setScale(0.08);

      this.scoreText = this.add.text(20, 20, 'Score: 0', {fontSize: '30px', color: '#000'});
      this.timerText = this.add.text(780, 20, 'Time: 20', { fontSize: '30px', color: '#000'}).setOrigin(1, 0);
      
      //Window frame
      this.add.rectangle(400, 350, 400, 400, 0xD83A2D);
      this.fireSquare = this.add.rectangle(400, 350, 300, 300, 0xFFD93D);

      this.levelText = this.add.text(400, 220, '', {fontSize: '20px', color: '#000'}).setOrigin(0.5);
      this.problemText = this.add.text(400, 300, '', {fontSize: '48px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
      this.inputText = this.add.text(400, 380, '?', {fontSize: '30px', color: '#FF8C42', backgroundColor: '#000', padding: {x:10, y:5} }).setOrigin(0.5);

      this.input.keyboard.off('keydown');
      this.input.keyboard.on('keydown', this.handleInput, this);
      this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });
      
      this.generateProblem();
  }

  updateTimer() {
      this.timeLeft--;
      this.timerText.setText('Time: ' + this.timeLeft);

      let timePassed = 20 - this.timeLeft;
      let progress = Phaser.Math.Clamp(timePassed / 20, 0, 1);

      this.barFill.width = 600 * progress;
      this.fireMarker.x = 100 + (600 * progress);

      let colorObj = Phaser.Display.Color.Interpolate.ColorWithColor(
          { r: 216, g: 58, b: 45 },
          { r: 51, g: 184, b: 100 },
          20,
          this.timeLeft
      );
      
      let colorBg = Phaser.Display.Color.GetColor(colorObj.r, colorObj.g, colorObj.b);
      this.bg.setFillStyle(colorBg);
      this.barFill.setFillStyle(colorBg);

      if (this.timeLeft < 5 && this.timeLeft > 0) {
          this.cameras.main.shake(100, 0.005);
      }

      if (this.timeLeft <= 0) {
          this.scene.start('scene-result', { score: this.score, won: false });
      }
  }

  generateProblem() {
    let n1, n2, operator;
    this.fireSquare.setVisible(true)

    //Difficulty levels
    if (this.score < 30) {
        this.levelText.setText("Level 1: Addition")
        n1 = Phaser.Math.Between(1, 10)
        n2 = Phaser.Math.Between(1, 10)
        this.currentAnswer = n1 + n2
        operator = "+"
    } 
    else if (this.score < 60) {
        this.levelText.setText("Level 2: Subtraction")
        n1 = Phaser.Math.Between(10, 20)
        n2 = Phaser.Math.Between(1, 9)
        this.currentAnswer = n1 - n2
        operator = "-"
    } 
    else {
        this.levelText.setText("Level 3: Multiplication")
        n1 = Phaser.Math.Between(2, 9)
        n2 = Phaser.Math.Between(2, 9)
        this.currentAnswer = n1 * n2
        operator = "x"
    }

    this.userAnswer = ""
    this.problemText.setText(`${n1} ${operator} ${n2}`)
    this.inputText.setText("?")
  }

  handleInput(event) {
    if (event.key >= '0' && event.key <= '9') {
        this.userAnswer += event.key
        this.inputText.setText(this.userAnswer)
    } else if (event.keyCode === 8) { //Backspace
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
        
        //Bonus time
        this.timeLeft += 2
        this.timerText.setText('Time: ' + this.timeLeft)

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
    this.add.rectangle(0, 0, 800, 600, 0xFFFFFF).setOrigin(0)

    const titleText = this.hasWon ? 'YOU WIN!' : 'TIME\'S UP'
    const color = this.hasWon ? '#00ff00' : '#ff0000'

    this.add.text(400, 200, titleText, { 
        fontSize: '64px', 
        color: color, 
        fontStyle: 'bold' 
    }).setOrigin(0.5)

    this.add.text(400, 300, `Final Score: ${this.finalScore}`, { 
        fontSize: '32px', 
        color: '#000' 
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