//server.js
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

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

// POST /todos
app.post('/todos', function (req, res){
	var body = req.body;
	//add id field
	//add the elt to todos array
	body.id =  todoNextId++;
	todos.push(body);

	//console.log('Description ',body.description);
	res.json(body);
});



app.listen(PORT, function(){
 console.log('express listening on port '+ PORT);
});