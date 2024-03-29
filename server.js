if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const port = 3000;

// Dependencies:
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const fs = require('fs');
const path = require('path');

const initializePassport = require('./passport-config');
initializePassport(
	passport,
	username => {
		let users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
		return users.find(user => user.username === username)
	},
	id => {
		let users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
		return users.find(user => user.id === id)
	}
);

// User data:
let usersPath = path.join(__dirname, 'user_data', 'users.json');
let learningSetsPath = path.join(__dirname, 'user_data', 'learning_sets.json');

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Routing:
app.get('/', checkAuthenticated, (req, res) => {
	let learningSetsObj = JSON.parse(fs.readFileSync(learningSetsPath, 'utf-8'));
	let learningSets = new Map(Object.entries(learningSetsObj));

	res.render('index.ejs', {name: req.user.username, sets: JSON.stringify(learningSets.get(req.user.id)) });
})

app.get('/:id/practice', checkAuthenticated, (req, res) => {
	let learningSetsObj = JSON.parse(fs.readFileSync(learningSetsPath, 'utf-8'));
	let learningSets = new Map(Object.entries(learningSetsObj));

	res.render('practice.ejs', {
		questions: JSON.stringify(learningSets.get(req.user.id)[req.params.id].questions),
		setName: learningSets.get(req.user.id)[req.params.id].name
	});
})

app.get('/:id/edit', checkAuthenticated, (req, res) => {
	let learningSetsObj = JSON.parse(fs.readFileSync(learningSetsPath, 'utf-8'));
	let learningSets = new Map(Object.entries(learningSetsObj));
	
	res.render('edit.ejs', {
		questions: JSON.stringify(learningSets.get(req.user.id)[req.params.id].questions),
		setId: req.params.id,
		setName: learningSets.get(req.user.id)[req.params.id].name
	});
})

app.post('/deletequestion/:setid/:questionid', checkAuthenticated, (req, res) => {
	let learningSetsObj = JSON.parse(fs.readFileSync(learningSetsPath, 'utf-8'));
	let learningSets = new Map(Object.entries(learningSetsObj));

	learningSets.get(req.user.id)[req.params.setid].questions.splice(req.params.questionid, 1);
	
	learningSetsObj = Object.fromEntries(learningSets);
	fs.writeFileSync(learningSetsPath, JSON.stringify(learningSetsObj, null, '\t'), 'utf8');

	res.redirect('/' + req.params.setid + '/edit');
});

app.post('/addquestion/:setid/', checkAuthenticated, (req, res) => {
	let learningSetsObj = JSON.parse(fs.readFileSync(learningSetsPath, 'utf-8'));
	let learningSets = new Map(Object.entries(learningSetsObj));

	learningSets.get(req.user.id)[req.params.setid].questions.push({
		question: req.body.question,
		answer: req.body.answer
	});

	learningSetsObj = Object.fromEntries(learningSets);
	fs.writeFileSync(learningSetsPath, JSON.stringify(learningSetsObj, null, '\t'), 'utf8');

	res.redirect('/' + req.params.setid + '/edit');
});

app.post('/deleteset/:setid/', checkAuthenticated, (req, res) => {
	let learningSetsObj = JSON.parse(fs.readFileSync(learningSetsPath, 'utf-8'));
	let learningSets = new Map(Object.entries(learningSetsObj));

	learningSets.get(req.user.id).splice(req.params.setid, 1);

	learningSetsObj = Object.fromEntries(learningSets);
	fs.writeFileSync(learningSetsPath, JSON.stringify(learningSetsObj, null, '\t'), 'utf8');
	
	res.redirect('/');
});

app.post('/addset', checkAuthenticated, (req, res) => {
	let learningSetsObj = JSON.parse(fs.readFileSync(learningSetsPath, 'utf-8'));
	let learningSets = new Map(Object.entries(learningSetsObj));

	learningSets.get(req.user.id).push({
		name: req.body.name,
		description: req.body.description,
		questions: [],
	})

	learningSetsObj = Object.fromEntries(learningSets);
	fs.writeFileSync(learningSetsPath, JSON.stringify(learningSetsObj, null, '\t'), 'utf8');

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
		let learningSetsObj = JSON.parse(fs.readFileSync(learningSetsPath, 'utf-8'));
		let learningSets = new Map(Object.entries(learningSetsObj));
		let users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

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

		learningSetsObj = Object.fromEntries(learningSets);
		fs.writeFileSync(learningSetsPath, JSON.stringify(learningSetsObj, null, '\t'), 'utf8');
		
		fs.writeFileSync(usersPath, JSON.stringify(users, null, '\t'), 'utf8');

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