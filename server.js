const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

// initialise app varibale with express
const app = express();

// connect db
connectDB();

// init middleware for body parser; allows to get data in req.body
app.use(express.json({ extended: false }));

// must be removed prior heroku build process:
// app.get('/', (req, res) => res.send('API running'));

// define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// serve static assets in production
if (process.env.NODE_ENV === 'production') {
	// set static folder
	app.use(express.static('client/build'));
	// serve index.html file
	app.get('*', (req, res) => {
		// current directory, go into client folder, into build folder, load index.html
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

// looks for an env variable called PORT;
const PORT = process.env.PORT || 5000;

// listen on a port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
