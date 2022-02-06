# Backgammon Web Terminal

Backgammon Web Terminal. Allows to play a game of Backgammon powered by https://github.com/foochu/bgweb-api.

Based on GNU Backgammon (https://www.gnu.org/software/gnubg) under GPL license.

## Run the application

```sh
npm i
npm start
```

## Playing the game

Type `new game` to start a new game.

Basic commands during play:

- `roll` = Roll the dice
- `move` = Make your move. Must include all moves for the turn. Examples:
  - `move 8/5 7/5` = Move chequer from points 8 & 7 to point 5
  - `move bar/24 24/20` = Enter from the bar. Also `b` works here.
  - `move bar/20` = Same as above but both dice combined
  - `move 1/off` = Bear off from point 1. Also `o` works here.
  - `move 24/23(2)` = Move 2 chequers from 24 to 23.
- `play` = Tell computer make their turn.
- `hint` = Show best moves for a given position and dice roll.
- `help` = Describe commands
