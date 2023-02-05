if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

// Dependencies:
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config');
initializePassport(
	passport,
	username => users.find(user => user.username === username),
	id => users.find(user => user.id === id)
);

// User data:
let users = [];
let learningSets = new Map();

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	cookie: {
		maxAge: 1000 * 60 * 60 *24 * 365
	},
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

//DEBUG CODE:
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

// Routing:
app.get('/', checkAuthenticated, (req, res) => {
	res.render('index.ejs', { name: req.user.username, sets: JSON.stringify(learningSets.get(req.user.id)) });
})

app.get('/:id/practice', checkAuthenticated, (req, res) => {
	res.render('practice.ejs', {questions: JSON.stringify(learningSets.get(req.user.id)[req.params.id].questions) });
})

app.get('/:id/edit', checkAuthenticated, (req, res) => {
	res.render('edit.ejs', {
		questions: JSON.stringify(learningSets.get(req.user.id)[req.params.id].questions),
		setId: req.params.id
	});
})

app.post('/deletequestion/:setid/:questionid', checkAuthenticated, (req, res) => {
	learningSets.get(req.user.id)[req.params.setid].questions.splice(req.params.questionid, 1);
	res.redirect('/' + req.params.setid + '/edit');
});

app.post('/addquestion/:setid/', checkAuthenticated, (req, res) => {
	learningSets.get(req.user.id)[req.params.setid].questions.push({
		question: req.body.question,
		answer: req.body.answer
	});
	res.redirect('/' + req.params.setid + '/edit');
});

app.post('/deleteset/:setid/', checkAuthenticated, (req, res) => {
	learningSets.get(req.user.id).splice(req.params.setid, 1);
	res.redirect('/');
});

app.post('/addset', checkAuthenticated, (req, res) => {
	learningSets.get(req.user.id).push({
		name: req.body.name,
		description: req.body.description,
		questions: [],
	})
	res.redirect('/');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
	res.render('login.ejs', { registrationRedirect : false });
});

app.get('/login/:registrationredirect', checkNotAuthenticated, (req, res) => {
	res.render('login.ejs', { registrationRedirect : req.params.registrationredirect });
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
	res.render('register.ejs', { registerError: null });
})

app.get('/register/:registerError', checkNotAuthenticated, (req, res) => {
	res.render('register.ejs', { registerError: req.params.registerError });
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
	try {
		for (const user of users) {
			if (user.username === req.body.username)
			{
				throw new Error('Username exists');
			}
		}

		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const userId = Date.now().toString();
		users.push({
			id: userId,
			username: req.body.username,
			password: hashedPassword
		})
		learningSets.set(userId, [])
		justRegistered = true;
		res.redirect('/login/regcomplete');
	}
	catch (error) {
		if (error.message === 'Username exists') {
			res.redirect('/register/duplicateuser');
		}
		else {
			res.redirect('/register/unknownerror');
		}
	}
});

app.delete('/logout', (req, res, next) => {
	req.logOut((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/login');
	});
});

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/login');
	}
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}
	else {
		next();
	}
}

app.listen(3000);