import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameScoreComponent } from './game-score/game-score.component';
import { SnakeGameComponent } from './snake-game/snake-game.component';
import { SnakeBoardComponent } from './snake-board/snake-board.component';
import { GameMenuComponent } from './game-menu/game-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    GameScoreComponent,
    SnakeGameComponent,
    SnakeBoardComponent,
    GameMenuComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
