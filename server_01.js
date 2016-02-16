//server.js
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
		id:1, // 
		description: 'Meet mom for lunch',
		completed: false
	},
	{
		id:2,
		description: 'Go to Market',
		completed: false
	},
	{
		id:3,
		description:'diff 3rd todos item Changed',
		completed: true
	}
	];

app.get('/',function (req,res){
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos',function (req, res){
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id',function (req, res){
	//res.send('Asking for todo with id of '+req.params.id);
	var matchedTodo;
	var todoId = parseInt(req.params.id,10);
	//Iterate the array and send it back
	// else send 404 using res.status(404).send();

	todos.forEach(function (currentArrElt){
		if(todoId === currentArrElt.id){
			matchedTodo = currentArrElt;
		}
	});

	if(matchedTodo)
	{
		res.json(matchedTodo);
	}
	else
	{
		res.status(404).send();
	}
	//res.json(todos);
});




app.listen(PORT, function(){
 console.log('express listening on port '+ PORT);
});