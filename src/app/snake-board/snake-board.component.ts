import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-snake-board',
  templateUrl: './snake-board.component.html',
  styleUrls: ['./snake-board.component.css'],
})
export class SnakeBoardComponent implements OnInit {
  @Input() boardSize: number = 20;
  @Input() snake: number[][] = [];
  @Input() foods: number[][] = [];

  constructor() {}

  ngOnInit(): void {}

  applyTilePositionStyle(position: number[]) {
    return {
      left: `calc(var(--tile-size) * ${position[0]})`,
      top: `calc(var(--tile-size) * ${position[1]})`,
    };
  }
}
