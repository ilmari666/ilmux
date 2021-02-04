export class GameObject {
  static MIN_VELOCITY = 0;

  static MAX_VELOCITY = 5;

  constructor(conf) {
    if (conf.elementId) {
      this.element = document.getElementById(conf.elementId);
    }
    const {
      x, y, width, height,
    } = conf;
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.reference = {
      x,
      y,
      width,
      height,
    };
    this.dx = 0;
    this.dy = 0;
    this.trackingTarget = null;
    this.snap = false;
  }

  getRectangle() {
    return [this.x, this.y, this.x + this.width, this.y + this.height];
  }

  getPoints() {
    return {
      x1: this.x,
      x2: this.x + this.width,
      y1: this.y,
      y2: this.y + this.height,
    };
  }

  getDeltas() {
    return { dx: this.dx || 0, dy: this.dy || 0 };
  }

  setDeltas(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  move(delta) {
    if (this.trackingTarget) {
      let dy = this.trackingTarget.y - this.y;
      // only checks for vertical velocity
      if (!this.snap) {
        if (Math.abs(dy) > this.MAX_VELOCITY * delta) {
          dy = Math.min(this.MAX_VELOCITY * delta, dy);
          dy = Math.max(-this.MAX_VELOCITY * delta, dy);
        }
      }
      this.dy = dy;
    }
    this.x += this.dx;
    this.y += this.dy;
  }

  reset() { // eslint-disable-line class-methods-use-this
    throw new Error('GameObject.reset() not implemented');
  }

  update() {
    if (this.element) {
      this.element.style.left = `${Math.round(this.x)}px`;
      this.element.style.top = `${Math.round(this.y)}px`;

      //      console.log(`zip ${this.element.style.left}`);
    }
  }

  track(target, snap = false) {
    console.log('TRACK', target, snap);
    this.trackingTarget = target;
    this.snap = snap;
  }

  clearTracking() {
    this.trackingTarget = null;
    this.snap = false;
    this.dx = 0;
    this.dy = 0;
  }
}
