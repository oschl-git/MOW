// References to HTML elements:
const practice1Button = document.querySelector('#practice-button-1');
const practice2Button = document.querySelector('#practice-button-2');
const practice3Button = document.querySelector('#practice-button-3');
const practice4Button = document.querySelector('#practice-button-4');

const beginContainer = document.querySelector('#begin-container');
const practiceSelectContainer = document.querySelector('#practice-select-container');
const practiceWriteContainer = document.querySelector('#practice-write-container');
const endContainer = document.querySelector('#end-container');

const answerButton1 = document.querySelector('#answer-button-1');
const answerButton2 = document.querySelector('#answer-button-2');
const answerButton3 = document.querySelector('#answer-button-3');

const selectQuestion = document.querySelector('#select-question');


// Event listeners:
// Begin buttons:
practice1Button.addEventListener('click', (e) => {
	switchToView('practice-select');
	reverseQuestions = false;
	selectSetup();
});

practice2Button.addEventListener('click', (e) => {
	switchToView('practice-select');
	reverseQuestions = true;
	selectSetup();
});

practice3Button.addEventListener('click', (e) => {
	switchToView('practice-write');
	reverseQuestions = false;
});

practice4Button.addEventListener('click', (e) => {
	switchToView('practice-write');
	reverseQuestions = true;
});

// Practice answer buttons:
answerButton1.addEventListener('click', (e) => {
	handleAnswerButton(1);
});

answerButton2.addEventListener('click', (e) => {
	handleAnswerButton(2);
});

answerButton3.addEventListener('click', (e) => {
	handleAnswerButton(3);
});


// General variables:
let reverseQuestions = false;
let score = 0;
let shuffledQuestions = shuffleArray(questions);
let questionIndex = 0;


// Code to run on load:
switchToView('begin');


// Switches to the provided view (string), hides all other views
function switchToView(newView) {
	let views = new Map();
	views.set('begin', beginContainer);
	views.set('practice-select', practiceSelectContainer);
	views.set('practice-write', practiceWriteContainer);
	views.set('end', endContainer);

	for (const item of views.values()) {
		item.style.display = 'none';
	}
	views.get(newView).style.display = 'flex';
}


function shuffleArray(array) {
	let newArray = [...array];
	for (var i = newArray.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = newArray[i];
		newArray[i] = newArray[j];
		newArray[j] = temp;
	}
	return newArray;
}

// Select practice:
function selectSetup() {
	score = 0;
	questionIndex = 0;
	displaySelectQuestion(shuffledQuestions[questionIndex]);
	questionIndex++;
}

function handleAnswerButton(button) {
	displaySelectQuestion(shuffledQuestions[questionIndex]);
	questionIndex++;
}

function displaySelectQuestion(question) {
	selectQuestion.textContent = question.question;
	let answerButtons = shuffleArray([answerButton1, answerButton2, answerButton3]);
	answerButtons[0].textContent = question.answer;
	answerButtons.shift();
	for (const button of answerButtons) {
		let answer;
		do {
			answer = shuffledQuestions[Math.floor(Math.random() * shuffledQuestions.length)].answer;
		} while (answer == question.answer);
		button.textContent = answer;
	}
}