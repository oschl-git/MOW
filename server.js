if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

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

const users = [];
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

app.get('/', checkAtuhenticated, (req, res) => {
	res.render('index.ejs', { name: req.user.username });
})

app.get('/login', checkNotAtuhenticated, (req, res) => {
	res.render('login.ejs', { justRegistered : justRegistered });
	justRegistered = false;
})

app.post('/login', checkNotAtuhenticated, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

app.get('/register', checkNotAtuhenticated, (req, res) => {
	res.render('register.ejs', { registerFailMessage: registerFailMessage });
	registerFailMessage = '';
})

app.post('/register', checkNotAtuhenticated, async (req, res) => {
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

function checkAtuhenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/login');
	}
}

function checkNotAtuhenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}
	else {
		next();
	}
}

app.listen(3000);