import { matter } from "../globals.js";
import BodyType from "../enums/BodyType.js";
import Circle from "./Circle.js";
import { oneInXChance } from "../../lib/Random.js";
import GameEntity from "./GameEntity.js";

export default class YellowBird extends Circle {
  static SPRITE_MEASUREMENTS = [{ x: 668, y: 879, width: 58, height: 54 }];
  static RADIUS = 20;

  constructor(x, y) {
    super(x, y, YellowBird.RADIUS, {
      label: BodyType.Bird,
      density: 0.008,
      restitution: 0.8,
      collisionFilter: {
        group: -1,
      },
    });

    this.sprites = GameEntity.generateSprites(YellowBird.SPRITE_MEASUREMENTS);
    this.renderOffset = { x: -29, y: -27 };

    this.isWaiting = true;
    this.isJumping = false;
    this.abilityUsed = false; // Track if the bird's special ability has been used
  }

  update(dt) {
    super.update(dt);

    if (this.isWaiting) {
      this.randomlyJump();
    }
  }

  randomlyJump() {
    if (!this.isJumping && oneInXChance(1000)) {
      this.jump();
    }

    if (this.isOnGround()) {
      this.isJumping = false;
    }
  }

  jump() {
    this.isJumping = true;

    // Apply an upward force to make the bird jump while waiting
    matter.Body.applyForce(this.body, this.body.position, {
      x: 0.0,
      y: -0.2,
    });
  }

  /**
   * Yellow Bird's special ability: accelerate towards the fortress.
   * Applies a strong horizontal force to the right when activated.
   * Can only be used once per bird and only while in flight.
   */
  useAbility() {
    // Don't activate if already used or if bird is still waiting in queue
    if (this.abilityUsed || this.isWaiting) {
      return;
    }

    this.abilityUsed = true;

    // Apply a strong horizontal force to accelerate towards the fortress.
    // The fortress is located on the right side of the screen, so we
    // apply a positive x force. No vertical force to maintain trajectory.
    matter.Body.applyForce(this.body, this.body.position, {
      x: 1.0,
      y: 0.0,
    });
  }
}
