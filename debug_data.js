module.exports = { fillWithDebugData };

function fillWithDebugData(users, learningSets) {
	users.push({
		id: 1,
		username: 'babyboy',
		password: '$2b$10$OPhoykTomJLKisH4m1Z.Y.84O7QZhb04h5LBp.HOxE.AJBx877CXS', //baby
	})
	
	learningSets.set(1, [])
	learningSets.get(1).push({
		name: 'Periodic table elements',
		description: 'A set with elements from the periodic table.',
		questions: [],
	})
	learningSets.get(1).push({
		name: 'Czech literary authors',
		description: 'A set with Czech literary authors.',
		questions: [],
	})
	
	
	learningSets.get(1)[0].questions.push({
		question: 'Hydrogen',
		answer: 'H'
	});
	learningSets.get(1)[0].questions.push({
		question: 'Lithium',
		answer: 'Li'
	});
	learningSets.get(1)[0].questions.push({
		question: 'Potassium',
		answer: 'K'
	});
	learningSets.get(1)[0].questions.push({
		question: 'Scandium',
		answer: 'Sc'
	});
	learningSets.get(1)[0].questions.push({
		question: 'Phosphorus',
		answer: 'P'
	});
	learningSets.get(1)[0].questions.push({
		question: 'Platinum',
		answer: 'Pt'
	});
}