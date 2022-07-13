import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-score',
  templateUrl: './game-score.component.html',
  styleUrls: ['./game-score.component.css'],
})
export class GameScoreComponent implements OnInit {
  @Input() score = 0;

  constructor() {}

  ngOnInit(): void {}
}
