//basic-sqlite-database.js

var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({
	force: true // Causes ReCreation of the database
}).then(function() {
	console.log('Everything is synced');

/*
	Chaining logic
	After method 1 finishes 2nd method is chained to it hence
	2nd method is also executed.
*/

	Todo.create({
		description: "Walk the dog",
		completed: false
	}).then(function(todo) {
		return Todo.create({
			description: "Clean office"
		});
	}).then(function() {
//		return Todo.findById(1)
		return Todo.findAll({
			where: {
				description: {
					$like: '%dog%'
				}
			}
		});
	}).then(function(todos) {
		if (todos) {
			todos.forEach(function (todo){
			console.log(todo.toJSON());
		});
		} else {
			console.log('No Todo found');
		}
	}).catch(function(e) {
		console.log(e);
	});
});