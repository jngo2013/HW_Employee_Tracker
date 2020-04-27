const inquirer = require('inquirer');
const mysql = require('mysql2');
// const trackerQ = require('./models/trackerQ');

const PORT = 3001;
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'trackerDB',
  
});
connection.connect(err => {
  if(err) throw err;
});

function promptEmploy(){
inquirer.prompt([
  {
    type: "list",
    name: "menu",
    message: "Would you like to add, view, or update employees?",
    choices: ["add", "view", "update", "exit"]
  }
]).then(response => {
  console.log(response);
  switch(response.menu) {
    case "add": add(); break;
    case "view": view(); break;
    case "update": update(); break;
    case "exit": exit(); break;
    default:break;
  }
});
function exit(){
  connection.end();
  console.log("goodbye");
}
function add(){
  inquirer.prompt([
    {
      type: "list",
      name: "add",
      message: "What would you like to add?",
      choices: ["department", "roles", "employees"]
    }
  ]).then(answer => {
    switch(answer.add) {
      case "employees": addEmploy(); break;
      case "roles": addRoles(); break;
      case "department": addDep(); break;
    }
  })
};
function addEmploy(){
  inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message:"first name of employee"
    },
    {
      type: "input",
      name: "lastName",
      message:"last name of employee"
    },
    {
      type: "list",
      name: "employRole",
      message:"what is employee's role",
      choices: ["student", "Engineer", "HR","Accountant"]
    },
    {
      type: "list",
      name: "manager",
      message:"who is the employee's manager",
      choices: ["test", "something"]
    }
  ]).then(answer =>{
    console.log(answer);
    const toAddEmploy = `INSERT INTO employee (firstName, lastName, roleId, managerId) VALUES(?, ?, ?, ?);`;
    connection.query(toAddEmploy, [answer.firstName, answer.lastName, 1 , 4],(err , choices) => {

      if (err) throw err;
      console.log(toAddEmploy);
      promptEmploy();
    })
  })
}
function addRoles(){
  inquirer.prompt([
    {
      type:"input",
      name:"roles",
      message:"What is the name of the role you are adding"
    },
    {
      type:"number",
      name:"salary",
      message:"What is the salary for this role"
    },
    {
      type:"number",
      name:"departId",
      message:"What is the Id for this role's department"
    }
  ]).then(answer => {
    console.log(answer);
    const toAddRole = `INSERT INTO roles (title, salary, departmentId) VALUES (?, ?, ?)`;
    connection.query(toAddRole, [answer.roles, answer.salary, 6, 4], err=>{
      if(err) throw err;
      console.log(toAddRole);
      promptEmploy();
    })
  })
}
function addDep(){
  inquirer.prompt([
    {
      type:"input",
      name:"nameDep",
      message:"Whe would you like to name your department"
    }
  ]).then(answer =>{
    console.log(answer);
    const toAddDep = `INSERT INTO department (names) VALUES (?);`;
    connection.query(toAddDep,answer.nameDep, err=>{
      if(err) throw err;
      console.log(toAddDep);
      promptEmploy();
    });
  })
}
function view(){
  inquirer.prompt([
    {
      type: "list",
      name: "view",
      message: "What would you like to view?",
      choices: ["department", "roles", "employees"]
    }
  ]).then(answer => {
    console.log(answer);
    viewPrompt = `SELECT * FROM ${answer.view};`;
    console.log(viewPrompt);
    connection.query(viewPrompt, err =>{
      if(err) throw err;
      console.log(viewPrompt);
    })
  })
  connection.end();
};
function update(){
  inquirer.prompt([
    {
      type: "list",
      name: "update",
      message: "Which employee would you like to update?",
      choices: ["role", "manager", "employee"]
    }
  ]).then(answer => {
    const employUpdate = "UPDATE employee (firstName, lastName, roleId, managerId) WHERE (?, ?, ?, ?);";
    connection.query(employUpdate,)
  })
};
};

promptEmploy();