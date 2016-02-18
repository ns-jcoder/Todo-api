//db.js
// server.js will use this file to fetch data from DB

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'devlopment';
var sequelize;

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/dev-todo-api.sqlite'
	});

}
var db = {};
// loads sequelise model from diff files
db.todo = sequelize.import(__dirname + '/models/todos.js');
db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;