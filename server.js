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


let justRegistered = false;
let registerFailMessage = '';

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
	res.render('practice.ejs', { questions: JSON.stringify(learningSets.get(req.user.id)[req.params.id].questions) });
})

app.get('/:id/edit', checkAuthenticated, (req, res) => {
	res.render('edit.ejs', { questions: JSON.stringify(learningSets.get(req.user.id)[req.params.id].questions) });
})

app.get('/login', checkNotAuthenticated, (req, res) => {
	res.render('login.ejs', { justRegistered : justRegistered });
	justRegistered = false;
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
	res.render('register.ejs', { registerFailMessage: registerFailMessage });
	registerFailMessage = '';
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
		users.push({
			id: Date.now().toString(),
			username: req.body.username,
			password: hashedPassword
		})
		justRegistered = true;
		res.redirect('/login');
	}
	catch (error) {
		if (error.message === 'Username exists') {
			registerFailMessage = 'A user with this username already exists. Choose a different one.';
		}
		else {
			registerFailMessage = 'Something went wrong. Please try again.';
		}
		res.redirect('/register');
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