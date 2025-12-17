// ===== VARIABLES =====
const inputsDiv = document.getElementById("inputs");
const prizesList = document.getElementById("prizes-list");
const winnersDiv = document.getElementById("winners");

const addInputBtn = document.getElementById("add-input");
const addPrizeBtn = document.getElementById("add-prize");
const drawBtn = document.getElementById("draw");
const restartBtn = document.getElementById("restart");
const newBtn = document.getElementById("new");
const modeBtn = document.getElementById("mode-btn");

const winnersCountInput = document.getElementById("winners-count");

// true = Normal (no repeat), false = Repeat
let normalMode = true;


// ===== THE ONE WHO CREATE MULTIPLE NAME IN INPUT =====
function createNameRow() {
	const row = document.createElement("div");
	row.className = "input-row";

	const nameInput = document.createElement("input");
	nameInput.className = "name-input";
	nameInput.placeholder = "name";

	const chanceInput = document.createElement("input");
	chanceInput.type = "number";
	chanceInput.className = "chance-input";
	chanceInput.value = 1;
	chanceInput.min = 1;

	const removeBtn = document.createElement("button");
	removeBtn.textContent = "Remove";
	removeBtn.className = "remove-btn";
	removeBtn.onclick = () => row.remove();

	row.appendChild(nameInput);
	row.appendChild(chanceInput);
	row.appendChild(removeBtn);

	return row;
}


// ===== THE ONE WHO CREATE MULTIPLE INPUT FOR PRIZE INPUT =====
function createPrizeRow() {
	const row = document.createElement("div");
	row.className = "prize-row";

	const prizeInput = document.createElement("input");
	prizeInput.className = "prize-desc";
	prizeInput.placeholder = "Prize";

	const countInput = document.createElement("input");
	countInput.type = "number";
	countInput.className = "prize-count";
	countInput.value = 1;
	countInput.min = 1;

	const removeBtn = document.createElement("button");
	removeBtn.textContent = "Remove";
	removeBtn.onclick = () => row.remove();

	row.appendChild(prizeInput);
	row.appendChild(countInput);
	row.appendChild(removeBtn);

	return row;
}


// ===== BUTTONS FOR NAME, PRIZE, MODE =====
addInputBtn.onclick = () => inputsDiv.appendChild(createNameRow());
addPrizeBtn.onclick = () => prizesList.appendChild(createPrizeRow());

modeBtn.onclick = function () {
	normalMode = !normalMode;
	modeBtn.textContent = normalMode ? "Mode: Normal" : "Mode: Repeat";
};


// ===== INITIAL =====
inputsDiv.appendChild(createNameRow());
prizesList.appendChild(createPrizeRow());


// ===== DRAW =====
drawBtn.onclick = function () {
	winnersDiv.innerHTML = "";

	let people = [];

	const rows = document.querySelectorAll(".input-row");
	rows.forEach(row => {
		const name = row.children[0].value.trim();
		const chance = parseInt(row.children[1].value);

		if (name && chance > 0) {
			for (let i = 0; i < chance; i++) {
				people.push({ name, row });
			}
		}
	});

	if (people.length === 0) {
		winnersDiv.textContent = "No valid names";
		return;
	}

	const prizeRows = document.querySelectorAll(".prize-row");
	const winnersPerPrize = parseInt(winnersCountInput.value);

	prizeRows.forEach(prizeRow => {
		const prizeName = prizeRow.children[0].value.trim();
		const prizeCount = parseInt(prizeRow.children[1].value);

		if (!prizeName || prizeCount <= 0) return;

		const title = document.createElement("div");
		title.style.fontWeight = "bold";
		title.textContent = prizeName;
		winnersDiv.appendChild(title);

		for (let i = 0; i < prizeCount * winnersPerPrize; i++) {
			if (people.length === 0) break;

			const index = Math.floor(Math.random() * people.length);
			const picked = people.splice(index, 1)[0];

			const win = document.createElement("div");
			win.className = "winner";
			win.textContent = picked.name;
			winnersDiv.appendChild(win);

			// NORMAL MODE → remove winner permanently
			if (normalMode) {
				picked.row.remove();
				people = people.filter(p => p.name !== picked.name);
			}
		}
	});

	// lock buttons
	addInputBtn.disabled = true;
	addPrizeBtn.disabled = true;
	drawBtn.disabled = true;

	restartBtn.style.display = "inline-block";
	newBtn.style.display = "inline-block";
};


// ===== RESTART (CLEAR WINNERS ONLY) =====
restartBtn.onclick = function () {
	winnersDiv.innerHTML = "";

	addInputBtn.disabled = false;
	addPrizeBtn.disabled = false;
	drawBtn.disabled = false;

	restartBtn.style.display = "none";
	newBtn.style.display = "none";
};


// ===== NEW (FULL RESET) =====
newBtn.onclick = function () {
	inputsDiv.innerHTML = "";
	prizesList.innerHTML = "";
	winnersDiv.innerHTML = "";

	inputsDiv.appendChild(createNameRow());
	prizesList.appendChild(createPrizeRow());

	addInputBtn.disabled = false;
	addPrizeBtn.disabled = false;
	drawBtn.disabled = false;

	restartBtn.style.display = "none";
	newBtn.style.display = "none";
};
