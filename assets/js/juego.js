(() => {
	"use strict";

	let deck = [];
	const types = ["C", "D", "H", "S"]; // Clubs, Diamonds, Hearts, Spades
	const specials = ["A", "J", "Q", "K"];

	let pointsPlayers = []

	// Referencias del HTML
	const btnPedir = document.querySelector("#btnPedir"),
		btnDetener = document.querySelector("#btnDetener"),
		btnNuevo = document.querySelector("#btnNuevo");

	const divCardsPlayers = document.querySelectorAll(".cards-container"),
		pointsHTML = document.querySelectorAll("small");

	const modalTXT = document.querySelector(".modal-body");
	const openModalButtons = document.querySelectorAll("[data-modal-target]");
	const closeModalButtons = document.querySelectorAll("[data-close-button]");
	const overlay = document.getElementById("overlay");

	const initGame = ( numPlayers = 2 ) => {
		deck = createDeck();
		pointsPlayers = [];
		for ( let i = 0; i< numPlayers; i++){
			pointsPlayers.push(0);
		}

		pointsHTML.forEach( elem => {elem.innerText = 0; elem.classList.remove("tachado");});
		divCardsPlayers.forEach( elem => elem.innerHTML = '');

		btnPedir.disabled = false;
		btnDetener.disabled = false;
	}

	// Esta función crea un nuevo deck
	const createDeck = () => {
		deck = [];
		for (let i = 2; i <= 10; i++) {
			for (let type of types) {
				deck.push(i + type);
			}
		}

		for (let type of types) {
			for (let esp of specials) {
				deck.push(esp + type);
			}
		}

		return shuffle(deck);
	};

	// Fisher–Yates shuffle
	function shuffle(array) {
		let currentIndex = array.length,
			randomIndex;

		// Aunque quedan elementos por barajar.
		while (currentIndex != 0) {
			// Elige un elemento restante.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// Y cambiarlo por el elemento actual.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex],
			];
		}

		return array;
	}

	// Esta función me permite extraer una carta del deck
	const requestCard = () => {
		if (deck.length === 0) {
			throw "No hay cartas en el deck";
		}
		return deck.pop();
	};

	const valueCard = (card) => {
		const value = card.substring(0, card.length - 1);
		return isNaN(value) ? (value === "A" ? 11 : 10) : value * 1;
	};

	// turn: 1 -> Primer Jugador y 0 sera la computadora
	const accumulatePoints = ( card, turn ) => {

		pointsPlayers[turn] = pointsPlayers[turn] + valueCard(card);
		pointsHTML[turn].innerText = pointsPlayers[turn];
		return pointsPlayers[turn];
	}

	function generate_img(card, turn) {
		const imgCard = document.createElement("img");
		imgCard.src = `assets/cartas/${card}.png`; //3H, JD
		imgCard.classList.add("carta");
		divCardsPlayers[turn].append( imgCard );
	}


	const turnComputer = (pointsMinimum) => {
		let pointsComputer = 0;
		do {
			const card = requestCard();
			pointsComputer = accumulatePoints(card, 0);
			generate_img(card, 0);
		} while ( (pointsComputer < pointsMinimum) && ( pointsMinimum <= 21 ) );

		determineWinner()
	};

	const determineWinner = () => {

		const [ pointsComputer, pointsMinimum ] = pointsPlayers;

		setTimeout(() => {
			if (pointsComputer === pointsMinimum) {
				modalTXT.innerHTML = `<p style="color: var(--text-color-light);
            font-size: 1.5rem;text-transform: uppercase;font-weight: 800;">
            Nadie Gana 🤝
            </p>`;
				openModal(modal);
			} else if (pointsMinimum > 21) {
				pointsHTML[1].classList.add("tachado");
				modalTXT.innerHTML = `<p style="color: var(--first-color-alt);
            font-size: 1.5rem;text-transform: uppercase;font-weight: 800;">
            Computadora gana 🤖
            </p>`;
				openModal(modal);
			} else if (pointsComputer > 21) {
				pointsHTML[0].classList.add("tachado");
				modalTXT.innerHTML = `<p style="color: var(--second-color);
            font-size: 1.5rem;text-transform: uppercase;font-weight: 800;">
            🎉 Jugador gana! 🧍
            </p>`;
				openModal(modal);
			} else {
				pointsHTML[1].classList.add("tachado");
				modalTXT.innerHTML = `<p style="color: var(--first-color-alt);
            font-size: 1.5rem;text-transform: uppercase;font-weight: 800;">
            Computadora gana 🤖
            </p>`;
				openModal(modal);
			}
		}, 100);
	}

	// Eventos
	btnPedir.addEventListener("click", () => {
		const card = requestCard();
		const pointsPlayer = accumulatePoints( card, 1);

		generate_img( card, 1);

		if ( pointsPlayers > 21 ) {
			console.warn("Lo siento mucho, perdiste");
			btnPedir.disabled = true;
			btnDetener.disabled = true;
			turnComputer( pointsPlayers );
		} else if ( pointsPlayers === 21 ) {
			console.warn("21, genial!");
			btnPedir.disabled = true;
			btnDetener.disabled = true;
			turnComputer( pointsPlayers );
		}
	});

	btnDetener.addEventListener("click", () => {
		btnPedir.disabled = true;
		btnDetener.disabled = true;

		turnComputer( pointsPlayers[1] );
	});

	btnNuevo.addEventListener("click", () => {
		initGame();
	});

	// Eventos para las ventanas modales
	openModalButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const modal = document.querySelector(button.dataset.modalTarget);
			openModal(modal);
		});
	});

	overlay.addEventListener("click", () => {
		const modals = document.querySelectorAll(".modal.active");
		modals.forEach((modal) => {
			closeModal(modal);
		});
	});

	closeModalButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const modal = button.closest(".modal");
			closeModal(modal);
		});
	});

	function openModal(modal) {
		if (modal == null) return;
		modal.classList.add("active");
		overlay.classList.add("active");
	}

	function closeModal(modal) {
		if (modal == null) return;
		modal.classList.remove("active");
		overlay.classList.remove("active");
	}
	// Hacemos publico initGame que ahora se identifica como newGame
	return {
		newGame: initGame
	};
})();
