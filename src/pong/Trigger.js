import { GameObject } from './GameObject';

export class Trigger extends GameObject {
  constructor(conf) {
    super(conf);
    this.hitList = [];
  }

  hitTest(object) {
    const {
      x1, x2, y1, y2,
    } = object.getPoints();

    // test if any corner of an object is inside the hit area
    if (this.isPointInside(x1, y1) // top left
      || this.isPointInside(x2, y1) // top right
      || this.isPointInside(x1, y2) // bottom left
      || this.isPointInside(x2, y2) // bottom right
      || this.isPointInside((x1 + x2) / 2, (y1 + y2) / 2)) { // center
      return true;
    }
    return false;
  }

  isPointInside(x, y) {
    const {
      x1, x2, y1, y2,
    } = this.getPoints();

    return (x >= x1 && x <= x2 && y >= y1 && y <= y2);
  }

  addHitTest(target, onCollision) {
    this.hitList.push({ target, onCollision });
  }

  update() {
    if (this.element) {
      this.element.style.top = `${Math.round(this.y)}px`;
      this.element.style.left = `${Math.round(this.x)}px`;
    }
    this.hitList.forEach((item) => {
      if (this.hitTest(item.target)) {
        item.onCollision();
      }
    });
    if (this.onUpdate) {
      this.onUpdate();
    }
  }
}
