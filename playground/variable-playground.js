//variable-playground.js
var person = {
	name: "Poi",
	age:25
};
function updatePerson (obj) {
	obj.age = 50;
}
console.log(person);
updatePerson(person);
console.log(person);


var grades = [15,88];

function addGrades (grades) {
	grades.push(55);
}

addGrades(grades);
console.log(grades);