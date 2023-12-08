import cards, { shuffle } from './cards.js';
import Player from './player.js';

export default class Cribbage {
    constructor(cards) {
        this.player = new Player('player');
        this.player1 = new Player('player-1');
        this.player2 = new Player('player-2');
        this.crib = new Player('crib');
        this.discardPile = new Player('discard-pile');
        this.cards = shuffle(cards);
        this.round = 0;
        this.players = [this.player, this.player1, this.player2];
        this.dealer = this.player;
        this.currentPlayerId = this.dealer.id;
        this.starterCard = undefined;
        this.currentScoringCards = [];
    }

    deal() {
        for (let i = 0; i < 5; i++) {
            for (let player of this.players) {
                player.cards.push(this.cards.shift());
            }
        }

        this.crib.cards.push(this.cards.shift());

        this.displayCards(this.addCardToCrib);
    }

    displayCards(onclick) {
        for (let player of this.players) {
            this.currentPlayerId === player.id ? 
                player.displayCards(onclick.bind(this), this.discardPile.cards) :
                player.displayCards(undefined, this.discardPile.cards);
        }
        this.crib.displayCards();
        this.discardPile.displayCards(undefined, undefined, true);
    }

    addCardToCrib(e) {
        let clickedDataset = e.target.dataset;
        let player = this.players.find(p => p.id === clickedDataset.player);
        let cardIndex = player.cards.findIndex(c => c.str === clickedDataset.str);
        let removedCard = player.cards.splice(cardIndex, 1);

        this.crib.cards.push(removedCard[0]);

        this.nextPlayer();

        if (this.currentPlayerId !== this.dealer.id) {
            this.displayCards(this.addCardToCrib);
        } else {
            this.playPortion();
        }
    }

    playCard(e) {
        let clickedDataset = e.target.dataset;
        let player = this.players.find(p => p.id === clickedDataset.player);
        let card = player.cards.find(c => c.str === clickedDataset.str);

        if (!this.starterCard) {
            this.starterCard = this.cards.shift();

            this.discardPile.cards.push(this.starterCard);
        }

        this.discardPile.cards.push(card);

        this.currentScoringCards.push(card);

        this.nextPlayer();

        this.playPortion();
    }

    playPortion() {
        console.log('starting play portion', this.currentScoringCards);

        // check score
        let currentScore = this.currentScoringCards.reduce((a,c) => a + c.value, 0);
        let currentPlayerIndex = this.players.findIndex(p => p.id === this.currentPlayerId) - 1;
        currentPlayerIndex = currentPlayerIndex === -1 ? 0 : currentPlayerIndex;

        if (currentScore > 31) {
            this.players.at(currentPlayerIndex - 1).points += 1;

            this.currentScoringCards = [];

            this.displayCards(this.playCard);

            return;
        }

        this.players[currentPlayerIndex].points += this.checkDoublesAndMore(this.currentScoringCards)

        if (currentScore === 31) {
            this.players[currentPlayerIndex].points += 2;

            this.currentScoringCards = [];
        } 

        for (let p of this.players) {
            console.log(`${p.id}: ${p.points}`);
        }

        this.displayCards(this.playCard);
    }

    checkDoublesAndMore(cards) {
        let lastCard = cards.findLast(card => card);
        let sameCardCount = cards.reduceRight((a,c) => a += c.name === lastCard.name ? 1 : 0, 0);
        let points = 0;

        switch (sameCardCount) {
            case 0:
            case 1:
                return 0;
            case 2:
                return 2;
            case 3:
                return 6;
            case 4:
                return 12;
            default: 
                return 0;
        }
    }

    checkForRuns(cards) {
        let sequence = ['a', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
    }

    nextPlayer() {
        let currentPlayerIndex = this.players.findIndex(p => p.id === this.currentPlayerId);
        let nextId = currentPlayerIndex === this.players.length - 1 ? 0 : currentPlayerIndex + 1;

        this.currentPlayerId = this.players[nextId].id;
    }
}