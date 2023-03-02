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


	learningSets.get(1)[1].questions.push({
		question: 'Karel Čapek',
		answer: 'Válka s Mloky'
	});
	learningSets.get(1)[1].questions.push({
		question: 'Karel Havlíček Borovský',
		answer: 'Křest svatého Vladimíra'
	});
	learningSets.get(1)[1].questions.push({
		question: 'Jan Neruda',
		answer: 'Povídky Malostranské'
	});
	learningSets.get(1)[1].questions.push({
		question: 'Franz Kafka',
		answer: 'Proces'
	});
	learningSets.get(1)[1].questions.push({
		question: 'Jiří Wolker',
		answer: 'Těžká hodina'
	});
	learningSets.get(1)[1].questions.push({
		question: 'Otokar Březina',
		answer: 'Tajemné dálky'
	});
	learningSets.get(1)[1].questions.push({
		question: 'Božena Němcová',
		answer: 'Babička'
	});
	learningSets.get(1)[1].questions.push({
		question: 'Alois Jirásek',
		answer: 'Temno'
	});
	learningSets.get(1)[1].questions.push({
		question: 'Václav Havel',
		answer: 'Audience'
	});
	learningSets.get(1)[1].questions.push({
		question: 'Alois Jirásek',
		answer: 'Temno'
	});
}