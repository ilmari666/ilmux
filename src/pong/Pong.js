import './css/pong.css';
import * as Screen from './Screen';
import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { Trigger } from './Trigger';

const BALL = 2;

export class Pong {
  constructor() {
    this.turn = Math.round(Math.random()); // next to act
    const screenSize = Screen.getSize();
    const rem = Screen.getREMinPX();
    // initialize gameobjects only with relative sizes and locations
    const paddle0 = new Paddle({
      id: 0, x: 0, y: 0.5, width: rem / screenSize.width, height: (4 * rem) / screenSize.height,
    });
    const paddle1 = new Paddle({
      id: 1,
      x: 1 - rem / screenSize.width,
      y: 0.5,
      width: rem / screenSize.width,
      height: (4 * rem) / screenSize.height,
    });
    const ball = new Ball({
      x: 0.5, y: 0.5, width: rem / screenSize.width, height: rem / screenSize.height,
    });
    const ceiling = new Trigger({
      x: -1, y: -1, width: 3, height: 1,
    });
    const floor = new Trigger({
      x: -1, y: 1, width: 3, height: 1,
    });
    const goal0 = new Trigger({
      x: -1, y: 0, width: 1, height: 1,
    });
    const goal1 = new Trigger({
      x: 1, y: 0, width: 1, height: 1,
    });

    this.gameObjects = [paddle0, paddle1, ball, ceiling, floor, goal0, goal1];

    this.scaleObjects();

    ceiling.addHitTest(ball,
      () => {
        const { dx, dy } = ball.getDeltas();
        if (dy <= 0) {
          ball.setDeltas(dx, dy * -1);
        }
      });
    ceiling.addHitTest(paddle0,
      () => {
        paddle0.y = 0;
      });
    ceiling.addHitTest(paddle1,
      () => {
        paddle1.y = 0;
      });
    floor.addHitTest(ball,
      () => {
        const { dx, dy } = ball.getDeltas();
        if (dy <= 0) {
          ball.setDeltas(dx, dy * -1);
        }
        ball.setDeltas(dx, dy * -1);
      });
    floor.addHitTest(paddle0,
      () => {
        const { height } = Screen.getSize();
        paddle0.y = height - 4 * Screen.getREMinPX();
        paddle0.update();
      });
    floor.addHitTest(paddle1,
      () => {
        const { height } = Screen.getSize();
        paddle1.y = height - 4 * Screen.getREMinPX();
        paddle1.update();
      });
    goal0.addHitTest(ball,
      () => {
        if (this.turn === 0) {
          this.score[1]++;
          this.newRound();
        }
      });
    goal1.addHitTest(ball,
      () => {
        if (this.turn === 1) {
          this.score[0]++;
          this.newRound();
        }
      });
    paddle0.addHitTest(ball, () => {
      if (this.turn === 0) {
        this.turn = 1;
        paddle0.release(ball);
        paddle0.clearTracking();
        paddle1.track(ball);
      }
    });

    paddle1.addHitTest(ball, () => {
      if (this.turn === 1) {
        this.turn = 0;
        paddle1.release(ball);
        paddle1.clearTracking();
        paddle0.track(ball);
      }
    });

    this.score = [0, 0];
    this.drawScore();
    this.gameObjects[this.turn].release(ball);
    this.turn = this.gameObjects[this.turn].getOpponent();
    this.gameObjects[this.turn].track(ball);
    window.requestAnimationFrame((currentTime) => this.updateGame(currentTime));
  }

  scaleObjects() {
    const { width, height } = Screen.getSize();
    this.gameObjects.forEach((gameObject) => {
      const ref = gameObject.reference;
      gameObject.setPosition(ref.x * width, ref.y * height);
      gameObject.setSize(ref.width * width, ref.height * height);
    });
  }

  drawScore() {
    const scoreBoard = document.getElementById('score');
    scoreBoard.innerHTML = `${this.score[0]} : ${this.score[1]}`;
  }

  newRound() {
    const activePaddle = this.gameObjects[this.turn];
    const opposingPaddle = this.gameObjects[activePaddle.getOpponent()];
    activePaddle.clearTracking();
    opposingPaddle.track(this.gameObjects[BALL]);
    this.turn = opposingPaddle.getId();

    this.drawScore();
  }

  updateGame(time) {
    if (!this.lastUpdated) {
      this.lastUpdated = time;
    }
    let delta = (time - this.lastUpdated) / 1000;
    // to thwart side effects we cap delta in case there has been a long gap between updates
    if (delta > 0.5) {
      delta = 0.5;
    }
    this.lastUpdated = time;
    this.gameObjects.forEach(((obj) => {
      obj.move(delta);
      obj.update();
    }));

    window.requestAnimationFrame((currentTime) => this.updateGame(currentTime));
  }
}
