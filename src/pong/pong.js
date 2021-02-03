import './css/pong.css';
import * as Screen from './screen';

export class Pong {
  static PADDLE_MAX_SPEED = 25;

  static BALL_MAX_VELOCITY = 80;

  static BALL_MIN_VELOCITY = 25;

  constructor() {
    this.turn = Math.round(Math.random());
    this.ball = {
      x: 50,
      y: 50,
      element: document.getElementById('ball'),
      ...Pong.getDeltas(this.turn),
    };
    this.paddles = [
      {
        element: document.getElementById('paddle0'),
        y: 50,
        score: 0,
      },
      {
        element: document.getElementById('paddle1'),
        y: 50,
        score: 0,
      },
    ];
    this.drawScore();
    window.requestAnimationFrame((currentTime) => this.updateGame(currentTime));
  }

  static getDeltas(turn) {
    const velocity = Pong.BALL_MIN_VELOCITY
      + Math.random() * (Pong.BALL_MAX_VELOCITY
      - Pong.BALL_MIN_VELOCITY);

    const newAngle = Math.PI * 3 / 4
      + Math.random() * Math.PI / 2
      + turn * Math.PI;

    return {
      dx: Math.cos(newAngle) * velocity,
      dy: Math.sin(newAngle) * velocity,
    };
  }

  drawScore() {
    const scoreBoard = document.getElementById('score');
    scoreBoard.innerHTML = `${this.paddles[0].score} : ${this.paddles[1].score}`;
  }

  newRound() {
    this.ball = {
      ...this.ball,
      ...Pong.getDeltas(this.turn),
    };
    this.drawScore();
    this.paddles[0].y = 50;
    this.paddles[1].y = 50;
    this.ball.y = 50;
  }

  ballAtBorder() {
    const activePaddle = this.paddles[this.turn];
    this.turn = Math.abs(this.turn - 1);

    if (Math.abs(activePaddle.y - this.ball.y) > 3) {
      this.paddles[this.turn].score++;
      this.newRound();
    } else {
      this.ball = {
        ...this.ball,
        ...Pong.getDeltas(this.turn),
      };
    }
  }

  updateGame(time) {
    if (!this.lastUpdated) {
      this.lastUpdated = time;
    }
    let delta = (time - this.lastUpdated) / 1000;
    if (delta > 0.5) {
      delta = 0.5; // we cap the delta in case there has been a long break between delays
    }
    this.lastUpdated = time;

    this.ball.x += this.ball.dx * delta;
    this.ball.y += this.ball.dy * delta;

    const activePaddle = this.paddles[this.turn];

    if (this.ball.dx < 0) {
      if (this.ball.x < 0) {
        this.ballAtBorder();
      }
    } else if (this.ball.x > 100) {
      this.ballAtBorder();
    }

    if (this.ball.dy < 0) {
      if (this.ball.y < 0) {
        this.ball.dy *= -1;
      }
    } else if (this.ball.y > 98) {
      this.ball.dy *= -1;
    }

    let dy = this.ball.y - activePaddle.y;
    // cap speed
    if (Math.abs(dy) > Pong.PADDLE_MAX_SPEED * delta) {
      dy = Math.min(Pong.PADDLE_MAX_SPEED * delta, dy);
      dy = Math.max(-Pong.PADDLE_MAX_SPEED * delta, dy);
    }
    activePaddle.y += dy;

    activePaddle.element.style.top = `${activePaddle.y}%`;

    this.ball.element.style.top = `calc(${this.ball.y}% - 1rem)`;
    this.ball.element.style.left = `${this.ball.x}%`;
    window.requestAnimationFrame((currentTime) => this.updateGame(currentTime));
  }
}
