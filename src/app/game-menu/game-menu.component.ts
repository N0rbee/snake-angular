import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css'],
})
export class GameMenuComponent implements OnInit {
  @Input() paused = false;
  @Input() gameOver = false;

  @Output() pauseEvent = new EventEmitter<boolean>();
  @Output() newGameEvent = new EventEmitter<boolean>();

  constructor() {}

  pauseGame(pause: boolean) {
    this.pauseEvent.emit(pause);
  }

  startNewGame() {
    this.newGameEvent.emit(true);
  }

  ngOnInit(): void {}
}
