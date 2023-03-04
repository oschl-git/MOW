// References to HTML elements:
const practice1Button = document.querySelector('#practice-button-1');
const practice2Button = document.querySelector('#practice-button-2');
const practice3Button = document.querySelector('#practice-button-3');
const practice4Button = document.querySelector('#practice-button-4');

const beginContainer = document.querySelector('#begin-container');
const practiceSelectContainer = document.querySelector('#practice-select-container');
const practiceWriteContainer = document.querySelector('#practice-write-container');
const endContainer = document.querySelector('#end-container');

const selectQuestion = document.querySelector('#select-question');
const selectScore = document.querySelector('#select-score');
const selectCurrentQuestionCount = document.querySelector('#select-current-question-count');
const selectTotalQuestionCount = document.querySelector('#select-total-question-count');

const answerButton1 = document.querySelector('#answer-button-1');
const answerButton2 = document.querySelector('#answer-button-2');
const answerButton3 = document.querySelector('#answer-button-3');

const writeQuestion = document.querySelector('#write-question');
const writeScore = document.querySelector('#write-score');
const writeCurrentQuestionCount = document.querySelector('#write-current-question-count');
const writeTotalQuestionCount = document.querySelector('#write-total-question-count');

const answerForm = document.querySelector('#answer-form');
const answerTextField = document.querySelector('#answer-text-field');

const endScore = document.querySelector('#end-score');
const endTotalQuestionCount = document.querySelector('#end-total-question-count');


// Event listeners:
// Begin buttons:
practice1Button.addEventListener('click', () => {
	switchToView('practice-select');
	reverseQuestions = false;
	selectSetup();
});

practice2Button.addEventListener('click', () => {
	switchToView('practice-select');
	reverseQuestions = true;
	selectSetup();
});

practice3Button.addEventListener('click', () => {
	switchToView('practice-write');
	reverseQuestions = false;
	writeSetup();
});

practice4Button.addEventListener('click', () => {
	switchToView('practice-write');
	reverseQuestions = true;
	writeSetup();
});

// Practice answer buttons:
answerButton1.addEventListener('click', () => {
	handleAnswerButton(1);
});

answerButton2.addEventListener('click', () => {
	handleAnswerButton(2);
});

answerButton3.addEventListener('click', () => {
	handleAnswerButton(3);
});

// Text answer form:
answerForm.addEventListener('submit', (e) => {
	e.preventDefault();
	let formData = new FormData(answerForm)
	let answer = formData.get('answer');

	if (answer == '') return;
	
	answerTextField.value = '';
	handleAnswerForm(answer);
})


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


// Shuffles an array and returns it, doesn't affect provided array
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


// Select practice initial setup
function selectSetup() {
	score = 0;
	questionIndex = 0;
	selectTotalQuestionCount.textContent = shuffledQuestions.length;
	displaySelectQuestion(shuffledQuestions[questionIndex]);
}

// Reponds to pressing answer buttons
function handleAnswerButton(button) {
	const answerButtons = [answerButton1, answerButton2, answerButton3];
	
	if (!reverseQuestions) {
		if (answerButtons[button-1].textContent == shuffledQuestions[questionIndex].answer) score++;
	}
	else {
		if (answerButtons[button-1].textContent == shuffledQuestions[questionIndex].question) score++;
	}
	
	selectScore.textContent = score;

	if (questionIndex + 1 >= shuffledQuestions.length) endPractice();

	questionIndex++;
	selectCurrentQuestionCount.textContent = questionIndex + 1;
	displaySelectQuestion(shuffledQuestions[questionIndex]);
}


// Displays a single select question
function displaySelectQuestion(question) {
	selectQuestion.textContent = !reverseQuestions ? question.question : question.answer;
	let answerButtons = shuffleArray([answerButton1, answerButton2, answerButton3]);
	answerButtons[0].textContent = !reverseQuestions ? question.answer : question.question;
	answerButtons.shift();
	for (const button of answerButtons) {
		let answer;
		let fakeAnswerIsCorrect = false;
		
		do {
			let questionObject = 
					shuffledQuestions[Math.floor(Math.random() * shuffledQuestions.length)];
			answer = !reverseQuestions ? questionObject.answer : questionObject.question;
			
			if (!reverseQuestions) {
				fakeAnswerIsCorrect = (questionObject.answer == question.answer);
			}
			else {
				fakeAnswerIsCorrect = (questionObject.question == question.question);
			}
		} while (fakeAnswerIsCorrect && 
				answerButtons[0].textContent != answerButtons[1].textContent);
		
		button.textContent = answer;
	}
}


// Write practice initial setup
function writeSetup() {
	score = 0;
	questionIndex = 0;
	writeTotalQuestionCount.textContent = shuffledQuestions.length;
	displayWriteQuestion(shuffledQuestions[questionIndex]);
}


// Displays a single write question
function displayWriteQuestion(question) {
	writeQuestion.textContent = !reverseQuestions ? question.question : question.answer;
}


function handleAnswerForm(answer) {
	if (!reverseQuestions) {
		if (answer.toLowerCase() === shuffledQuestions[questionIndex].answer.toLowerCase()) score++;
	}
	else {
		if (answer.toLowerCase() === shuffledQuestions[questionIndex].question.toLowerCase()) 
			score++;
	}
		
	writeScore.textContent = score;

	if (questionIndex + 1 >= shuffledQuestions.length) endPractice();

	questionIndex++;
	writeCurrentQuestionCount.textContent = questionIndex + 1;
	displayWriteQuestion(shuffledQuestions[questionIndex]);
}


// Ends practice
function endPractice() {
	endScore.textContent = score;
	endTotalQuestionCount.textContent = shuffledQuestions.length;

	switchToView('end');
}