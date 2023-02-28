// References to HTML elements:
let practice1Button = document.querySelector('#practice-button-1');
let practice2Button = document.querySelector('#practice-button-2');
let practice3Button = document.querySelector('#practice-button-3');
let practice4Button = document.querySelector('#practice-button-4');

let beginContainer = document.querySelector('#begin-container');
let practiceSelectContainer = document.querySelector('#practice-select-container');
let practiceWriteContainer = document.querySelector('#practice-write-container');
let endContainer = document.querySelector('#end-container');


// Event listeners:
practice1Button.addEventListener('click', (e) => {
	switchToView('practice-select');
	reversedQuestions = false;
});

practice2Button.addEventListener('click', (e) => {
	switchToView('practice-select');
	reversedQuestions = true;
});

practice3Button.addEventListener('click', (e) => {
	switchToView('practice-write');
	reversedQuestions = false;
});

practice4Button.addEventListener('click', (e) => {
	switchToView('practice-write');
	reversedQuestions = true;
});


// General variables:
let reversedQuestions = false;


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
