import { GameObject } from './GameObject';

export class Ball extends GameObject {
  static MAX_VELOCITY = 20;

  static MIN_VELOCITY = 5;

  constructor(conf) {
    super(conf);
    this.element = document.getElementById('ball');
  }

  reset() {
    this.clearTracking();
    this.dx = 0;
    this.dy = 0;
  }
}
