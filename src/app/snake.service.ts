import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class SnakeService {
  private boardSize = 0;
  private snake: number[][] = [];
  private foods: number[][] = [];
  private foodTakenSourche = new Subject<number>();
  private collisionSourche = new BehaviorSubject<boolean>(false);

  private readonly directionUp = 1;
  private readonly directionDown = -1;
  private readonly directionLeft = 2;
  private readonly directionRight = -2;

  public foodTaken$ = this.foodTakenSourche.asObservable();
  public collision$ = this.collisionSourche.asObservable();

  constructor(private utilsService: UtilsService) {}

  restart(boardSize: number, snakeSize = 4) {
    this.boardSize = boardSize;
    this.resetSnake(snakeSize);
    this.resetFoods();
  }

  resetSnake(snakeSize = 4) {
    this.snake = [];
    const xPos = Math.max(0, Math.floor(this.boardSize / 2 - snakeSize / 2));
    const yPos = Math.floor(this.boardSize / 2);
    for (let i = 0; i < snakeSize; i++) {
      this.snake.push([xPos + i, yPos]);
    }
  }

  resetFoods() {
    this.foods = [];
    this.addFood();
  }

  moveUp() {
    return this.move(this.directionUp);
  }

  moveLeft() {
    return this.move(this.directionLeft);
  }

  moveDown() {
    return this.move(this.directionDown);
  }

  moveRight() {
    return this.move(this.directionRight);
  }

  move(direction: number): boolean {
    let posX = 0;
    let posY = 0;
    const lastTile = this.snake[this.snake.length - 1];
    switch (direction) {
      case this.directionUp:
        posX = lastTile[0];
        posY = lastTile[1] - 1;
        if (posY < 0) {
          posY = this.boardSize - 1;
        }
        break;
      case this.directionDown:
        posX = lastTile[0];
        posY = lastTile[1] + 1;
        if (posY > this.boardSize - 1) {
          posY = 0;
        }
        break;
      case this.directionLeft:
        posX = lastTile[0] - 1;
        posY = lastTile[1];
        if (posX < 0) {
          posX = this.boardSize - 1;
        }
        break;
      case this.directionRight:
        posX = lastTile[0] + 1;
        posY = lastTile[1];
        if (posX > this.boardSize - 1) {
          posX = 0;
        }
        break;
    }

    if (this.positionTaken(posX, posY)) {
      this.collisionSourche.next(true);
      return false;
    } else {
      this.snake.push([posX, posY]);
      if (this.foodInPosition(posX, posY)) {
        this.removeFood(posX, posY);
        this.addFood();
        this.foodTakenSourche.next(1);
      } else {
        this.snake.shift();
      }
    }

    return true;
  }

  positionTaken(xPos: number, yPos: number): boolean {
    const taken = this.snake.find((item) => {
      return item[0] === xPos && item[1] === yPos;
    });
    return taken !== undefined;
  }

  copySnake() {
    return this.snake.slice();
  }

  copyFoods() {
    return this.foods.slice();
  }

  emptyPositions(): number[][] {
    const reserved = [...this.snake, ...this.foods];
    const emptyPos = [];
    let exists;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        exists = reserved.find((item) => {
          return item[0] === i && item[1] === j;
        });
        if (exists === undefined) {
          emptyPos.push([i, j]);
        }
      }
    }
    return emptyPos;
  }

  addFood(): number[] {
    const emptyPos = this.emptyPositions();
    if (emptyPos.length <= 0) return [];

    const random = this.utilsService.randomInt(0, emptyPos.length - 1);
    const newFood = emptyPos[random];
    this.foods.push(newFood);
    return newFood;
  }

  foodInPosition(xPos: number, yPos: number) {
    const foodExists = this.foods.find((item) => {
      return item[0] === xPos && item[1] === yPos;
    });

    return foodExists !== undefined;
  }

  removeFood(xPos: number, yPos: number) {
    this.foods = this.foods.filter((item) => {
      return item[0] !== xPos || item[1] !== yPos;
    });
  }
}
