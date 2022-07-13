import {
  Component,
  OnInit,
  Input,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { scan, Subscription } from 'rxjs';
import { SnakeService } from '../snake.service';

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css'],
})
export class SnakeGameComponent implements OnInit, OnDestroy {
  @Input() boardSize = 20;
  @Input() keyUp = 'ArrowUp';
  @Input() keyDown = 'ArrowDown';
  @Input() keyLeft = 'ArrowLeft';
  @Input() keyRight = 'ArrowRight';
  @Input() keyPause = ' ';
  @Input() keyRestart = 'Escape';

  score = 0;
  snake: number[][] = [];
  foods: number[][] = [];
  paused = false;
  gameOver = false;

  private direction: string = '';
  private tick?: number;
  private currentLevel = 1;
  private maxLevel = 10;
  private foodSubscription!: Subscription;
  private collisionSubscription!: Subscription;

  constructor(private snakeService: SnakeService) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): boolean {
    switch (event.key) {
      case this.keyUp:
      case this.keyDown:
      case this.keyLeft:
      case this.keyRight:
        if (this.validMove(event.key)) {
          this.direction = event.key;
        }
        return false;
      case this.keyPause:
        this.pauseTick(!this.paused);
        return false;
      case this.keyRestart:
        this.restart();
        return false;
    }
    return true;
  }

  ngOnInit(): void {
    this.foodSubscription = this.snakeService.foodTaken$.subscribe(() => {
      this.score++;
      if (this.score >= this.currentLevel * 10) {
        this.currentLevel++;
        this.increaseSpeed();
      }
      this.foods = this.snakeService.copyFoods();
    });
    this.collisionSubscription = this.snakeService.collision$.subscribe(() => {
      this.gameOver = true;
      this.stopTick();
    });
    this.restart();
  }

  ngOnDestroy(): void {
    this.foodSubscription.unsubscribe();
    this.collisionSubscription.unsubscribe();
    this.stopTick();
  }

  startTick() {
    if (this.tick !== undefined) return;

    const speed = Math.max(1, this.maxLevel - this.currentLevel) * 20;
    this.tick = window.setInterval(() => {
      switch (this.direction) {
        case this.keyUp:
          this.snakeService.moveUp();
          break;
        case this.keyDown:
          this.snakeService.moveDown();
          break;
        case this.keyLeft:
          this.snakeService.moveLeft();
          break;
        case this.keyRight:
          this.snakeService.moveRight();
          break;
      }
      this.snake = this.snakeService.copySnake();
    }, speed);
  }

  stopTick() {
    clearInterval(this.tick);
    this.tick = undefined;
  }

  pauseTick(pause: boolean) {
    this.paused = pause;
    this.paused ? this.stopTick() : this.startTick();
  }

  increaseSpeed() {
    this.stopTick();
    this.startTick();
  }

  restart() {
    this.stopTick();
    this.currentLevel = 1;
    this.direction = this.keyRight;
    this.paused = false;
    this.gameOver = false;
    this.score = 0;
    this.snakeService.restart(this.boardSize, 4);
    this.snake = this.snakeService.copySnake();
    this.foods = this.snakeService.copyFoods();
    this.startTick();
  }

  validMove(direction: string): boolean {
    if (this.gameOver || this.paused || direction === this.direction)
      return false;

    // The snake can't go backwards
    switch (this.direction) {
      case this.keyUp:
        return direction !== this.keyDown;
      case this.keyDown:
        return direction !== this.keyUp;
      case this.keyLeft:
        return direction !== this.keyRight;
      case this.keyRight:
        return direction !== this.keyLeft;
      default:
        return true;
    }
  }
}
