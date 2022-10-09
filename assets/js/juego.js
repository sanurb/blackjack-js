let deck = [];
const types = ["C", "D", "H", "S"]; // Clubs, Diamonds, Hearts, Spades
const specials = ["A", "J", "Q", "K"];

let pointsPlayer = 0,
	pointsComputer = 0;

// Referencias del HTML
const btnPedir = document.querySelector("#btnPedir");
const btnDetener = document.querySelector("#btnDetener");
const btnNuevo = document.querySelector("#btnNuevo");

const divCardsPlayer = document.querySelector("#jugador-cartas");
const divCardsComputer = document.querySelector("#computadora-cartas");

const pointsHTML = document.querySelectorAll("small");
const modalTXT = document.querySelector(".modal-body");
// Esta función crea un nuevo deck
const createDeck = () => {
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
	// console.log( deck );
	deck = shuffle(deck);
	console.log(deck);
	return deck;
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

createDeck();

// Esta función me permite extraer una carta del deck
const requestCard = () => {
	if (deck.length === 0) {
		throw "No hay cartas en el deck";
	}
	const card = deck.pop();
	return card;
};

const valueCard = (card) => {
	const value = card.substring(0, card.length - 1);
	return isNaN(value) ? (value === "A" ? 11 : 10) : value * 1;
};

const turnComputer = (pointsMinimum) => {
	do {
		const card = requestCard();

		pointsComputer = pointsComputer + valueCard(card);
		pointsHTML[0].innerText = pointsComputer;

		imgCard = generate_img(card);
		divCardsComputer.append(imgCard);
	} while (pointsComputer < pointsMinimum && pointsMinimum <= 21);

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
};

function generate_img(card) {
	const imgCard = document.createElement("img");
	imgCard.src = `assets/cartas/${card}.png`; //3H, JD
	imgCard.classList.add("carta");

	return imgCard;
}

// Eventos
btnPedir.addEventListener("click", () => {
	const card = requestCard();

	pointsPlayer = pointsPlayer + valueCard(card);
	pointsHTML[1].innerText = pointsPlayer;

	imgCard = generate_img(card);
	divCardsPlayer.append(imgCard);

	if (pointsPlayer > 21) {
		console.warn("Lo siento mucho, perdiste");
		btnPedir.disabled = true;
		btnDetener.disabled = true;
		turnComputer(pointsPlayer);
	} else if (pointsPlayer === 21) {
		console.warn("21, genial!");
		btnPedir.disabled = true;
		btnDetener.disabled = true;
		turnComputer(pointsPlayer);
	}
});

btnDetener.addEventListener("click", () => {
	btnPedir.disabled = true;
	btnDetener.disabled = true;

	turnComputer(pointsPlayer);
});

btnNuevo.addEventListener("click", () => {
	console.clear();
	deck = [];
	deck = createDeck();

	pointsPlayer = 0;
	pointsComputer = 0;

	pointsHTML[0].innerText = 0;
	pointsHTML[1].innerText = 0;
	pointsHTML[0].classList.remove("tachado");
	pointsHTML[1].classList.remove("tachado");

	divCardsComputer.innerHTML = "";
	divCardsPlayer.innerHTML = "";

	btnPedir.disabled = false;
	btnDetener.disabled = false;
});

const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

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
