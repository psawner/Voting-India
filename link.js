console.log('generate links');

const age= 24;

const addnumbers= function (a,b){
    return a+b;
}
module.exports={
    age,
    addnumbers
}


/*console.log("ram");

var fs= require('fs');
var os= require('os');

var user= os.userInfo();
console.log(user);

fs.appendFile('greeting.text','hello sir'+ user.username, ()=>{
    console.log('file');
});
*/
/*
var _ = require('lodash');

const link = require('./link');
const age=link.age;
console.log(age);

const add=link.addnumbers(18,10);
console.log(add);

var data = ["person",1,2,3,4, 'link','age','name'];
var filter=_.uniq(data);
console.log(filter);

*/
/*
const jsonString = '{"name": "john", "age": 30, "city": "paris"}';
const jsonObject = JSON.parse(jsonString);
console.log(jsonObject.city);
*/