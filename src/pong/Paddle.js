import { Trigger } from './Trigger';
import { Ball } from './Ball';

export class Paddle extends Trigger {
  constructor(conf) {
    super(conf);
    const { id } = conf;
    this.id = id;
    this.element = document.getElementById(`paddle${id}`);
  }

  reset() {
    this.dx = 0;
    this.dy = 0;
  }

  getId() {
    return this.id;
  }

  getOpponent() {
    return Math.abs(this.id - 1);
  }

  release(ball) {
    // shoot at direction
    const velocity = Ball.MIN_VELOCITY
        + Math.random() * (Ball.MAX_VELOCITY
        - Ball.MIN_VELOCITY);

    const newAngle = Math.PI * 3 / 4
        + Math.random() * Math.PI / 2
        + this.getOpponent() * Math.PI; // if player 1, rotate by 180 degrees

    ball.setDeltas(
      Math.cos(newAngle) * velocity,
      Math.sin(newAngle) * velocity,
    );
  }
}
