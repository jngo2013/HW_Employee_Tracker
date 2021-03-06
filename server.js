const inquirer = require('inquirer');
const mysql = require('mysql2');

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
      choices: ["department", "roles", "employee"]
    }
  ]).then(answer => {
    switch(answer.add) {
      case "employee": addEmploy(); break;
      case "roles": addRoles(); break;
      case "department": addDep(); break;
      default:break;
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
      type: "number",
      name: "employRole",
      message:"what is employee's role Id",
    },
    {
      type: "number",
      name: "manager",
      message:"what is the manager's Id",
    }
  ]).then(answer =>{
    console.log(answer);
    const toAddEmploy = `INSERT INTO employee (firstName, lastName, roleId, managerId) VALUES(?, ?, ?, ?);`;
    connection.query(toAddEmploy, [answer.firstName, answer.lastName,answer.employRole, answer.manager ],(err , choices) => {

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
      choices: ["department", "roles", "employee"]
    }
  ]).then(answer => {
    switch(answer.view){
      case "department": viewDepart(); break;
      case "roles": viewRoles(); break;
      case "employee": viewEmployee(); break;
      default:break;

    }
  })
};
function viewDepart(){
  const toViewDepart = "SELECT * FROM department;";
  connection.query(toViewDepart,(err, department) => {
    if (err) throw err;
    console.log(department);
    promptEmploy();
    return department.map(department => department);
  })
};
function viewRoles(){
  const toViewRoles = "SELECT * FROM roles;";
  connection.query(toViewRoles,(err, roles) => {
    if (err) throw err;
    console.log(roles);
    promptEmploy();
    return roles.map(roles => roles);
  })
};
function viewEmployee(){
  const toViewEmployee = "SELECT * FROM employee;";
  connection.query(toViewEmployee,(err, employee) => {
    if (err) throw err;
    console.log(employee);
    promptEmploy();
    return employee.map(employee => employee);
  })
};


function update(){
  const allEmploy = `SELECT * FROM employee;`;
  
    connection.query(allEmploy, (err, res) => {
      console.log(allEmploy);
      if (err) throw err;

      const allEmployArr = res.map((employee) => {
        return {
          value: employee.id,
          name: `${employee.firstName} ${employee.lastName}`
        }
      })
      inquirer.prompt([
        {
          type: "rawlist",
          name: "update",
          message: "Which employee would you like to update?",
          choices: allEmployArr
        },
        {
          type: "number",
          name: "employRole",
          message:"what is employee's role Id",
        },
        ]).then(answer => {
            const employUpdate = `UPDATE employee SET roleId ='${answer.employRole}' WHERE id='${answer.update}';`;
            connection.query(employUpdate,[{roleId : answer.employRole}, {id: answer.id}], err => {
              if (err) throw err;
              console.log(answer)
              promptEmploy();
            })
        })
        
    })
  }
};


promptEmploy();