import Cribbage from './Cribbage.js';
import cards, { cardBack, shuffle } from './cards.js';

let shuffled = shuffle(cards);
console.log('shuffled', shuffled);

let game = new Cribbage(shuffled);

game.deal();


