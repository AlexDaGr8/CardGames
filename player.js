import { cardBack, createCard } from './cards.js';

export default class Player {
    constructor(id) {
        this.id = id;
        this.cards = [];
        this.points = 0;
        this.isDealer = false;
        this.elem = document.getElementById(this.id);
        this.nameHeader = document.createElement('h4');
        this.nameHeader.innerText = this.headerName;

        this.elem.appendChild(this.nameHeader);
    }

    get headerName () {
        let splitName = this.id.split('-');

        for (let i in splitName) {
            splitName[i] = splitName[i][0].toUpperCase() + splitName[i].substring(1);
        }

        return splitName.join(' ');
    }

    displayCards(onclick, hideArr = [], showOnlyTop = false) {
        if (this.cards.length <= 0) return;

        let cards = this.elem.querySelectorAll('.card');

        this.elem.classList.remove('current');

        if (onclick) {
            this.elem.classList.add('current');
        }

        for (let c of cards) {
            c.remove();
        }

        this.nameHeader.innerText = `${this.headerName} - ${this.points}`;

        if (showOnlyTop) {
            let headers = this.elem.querySelectorAll('h5');

            for (let h of headers) {
                h.remove();
            }

            let discard = document.createElement('h5');
            discard.innerText = 'Last played';
            this.elem.appendChild(discard);

            let starter = document.createElement('h5');
            starter.innerText = 'Starter card';
            this.elem.appendChild(starter);

            let cardElem = createCard(this.cards.at(-1));

            cardElem.setAttribute('data-player', this.id);

            this.elem.appendChild(cardElem);

            let starterCard = createCard(this.cards.at(0));

            starterCard.setAttribute('data-player', this.id);

            this.elem.appendChild(starterCard);

            return;
        }

        for (let card of this.cards) {
            let cardElem = createCard(card);

            if (hideArr.findIndex(ha => ha.str === card.str) > -1) {
                cardElem.classList.add('hide');
            }

            cardElem.addEventListener('click', onclick);

            cardElem.setAttribute('data-player', this.id);

            this.elem.appendChild(cardElem);
        }
    }
}