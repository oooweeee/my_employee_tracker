const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const pool = require("./db/connection");

init();
 
// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "City of Pawnee" }).render();

 
  console.log(logoText);


  loadMainPrompts();
}
//main prompt
function loadMainPrompts() {
  prompt([
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'option',
        choices: ['Add', 'View', 'Update', 'Delete', 'Exit' ]    
    }

  ]).then((res) => {
    // TODO- Create a switch statement to call the appropriate function depending on what the user chose
   
    switch (res.option) {
        case 'Add': 
            addPrompt();
            break;
        case 'View':
            viewPrompt();
            break;
        case 'Update':
            updatePrompt();
            break;
        case 'Delete':
            deletePrompt();
            break;
        case 'Exit':
            quit();
            break;
        default:
            console.log("Invalid Option");
        }
    })
  };
  //prompt to select which area to add
  function addPrompt(){
    prompt([
        {
            type:'list',
            message:'What do you want to add to?',
            name:'add',
            choices: ['Department', 'Role', 'Employee']
        }
    ]).then((res) => {
        switch (res.add) {
            case 'Department':
                addDepartment();
                break;
            case 'Role':
                addRole();
                break;
            case 'Employee':
                addEmployee();
                break;
            default:
                console.log("Invalid Option");
        }
    })
  };
  //prompt to select which area to view
  function viewPrompt() {
    prompt([
        {
        type:'list',
        message: 'What would you like to do?',
        name: 'view',
        choices: ['View all employees', 'View all roles', 'View all departments', 'View all employees except chosen ID']
        }
    ]).then((res) => {
        switch(res.view) {
        case 'View all employees':
            viewAllEmployees();
            break;
        case 'View all roles':
            viewAllRoles();
            break;
        case 'View all departments':
            viewAllDepartments();
            break;
        case 'View all employees except chosen ID':
            viewAllExcept();
            break;
        default:
            console.log("Invalid option");
        }
    })
  };
  //prompt to select which area to update
  function updatePrompt() {
    prompt ([
        {
        type: 'list',
        message: 'What do you want to update?',
        name: 'update',
        choices: ['Update employee', 'Update role', 'Update department']
        }
    ]).then(res => {
        switch (res.update) {
            case 'Update employee':
                updateEmployee();
                break;
            case 'Update role':
                updateRole();
                break;
            case 'Update department':
                updateDepartment()
                break;
            default:
                console.log("Invalid Option");

        }
    })
  };
  //prompt to ask user what they want to delete
function deletePrompt() {
  prompt([
    {
        type: 'list',
        message: 'What do you want to delete?',
        name: 'delete',
        choices: ['Employee', 'Role', 'Department']    
    }

  ]).then((res) => {    
    switch (res.delete) {
        case 'Employee': 
            deleteEmployee();
            break;
        case 'Role':
            deleteRole();
            break;
        case 'Department':
            deleteDepartment();
            break;
            default:
            console.log("Invalid Option");
        }
    })
  };

// list all employees in a table
const viewAllEmployees = async ()=> {
    let { rows } = await db.findAllEmployees();
    console.log('\n');
    console.table(rows);
    loadMainPrompts();
};
// list all employees except selected
const viewAllExcept = async () => {
    const exempt = await fetchEmployees();
    let {allExceptId} = await prompt([
        {
            type: 'list',
            name: 'allExceptId',
            message: 'What employee do you want to exempt?',
            choices: exempt
        }
    ])
    let { rows } = await db.selectExcept(allExceptId);
    console.log('\n');
    console.table(rows);
    loadMainPrompts();
}
//function to view all roles
const viewAllRoles = async ()=> {
    let { rows } = await db.findAllRoles();
    console.log('\n');
    console.table(rows);
    loadMainPrompts();
};
// function to view all departments
const viewAllDepartments = async ()=> {
    let { rows } = await db.findAllDepartments();
    console.log('\n');
    console.table(rows);
    loadMainPrompts();
};
  const addDepartment = async () => {
    let {newDepartment} = await prompt([
        {
            name: 'newDepartment',
            message: 'What is the department called?'            
        }
    ])
let { rows } = await db.inputDepartment(newDepartment);
console.log("Department added");
loadMainPrompts();
};
//add role function
  const addRole = async () => {    
        const departments = await fetchDepartments();
    let {newRole, newSalary, department} = await prompt ([
        {
            name: 'newRole',
            message: 'What is the role called?'
        },
        {
            name: 'newSalary',
            message: 'How much does this role make?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'What department is this role in?',
            choices: departments
        }           
    ]);
    const departmentId = await fetchDepartmentId(department);
    let { rows } = await db.inputRole(newRole, newSalary, departmentId);
    console.log("Role added");
    loadMainPrompts();
};
//add employee function
  const addEmployee = async () => {
    const roles = await fetchRoles(); 
    
    let {newEmployee} = await prompt ([

        {
            name: 'newFirst',
            message: 'What is the new employees first name?'
        },
        {
            name: 'newLast',
            message: 'What is the new employees last name?'
        },
        {
            type: 'list',
            name: 'newEmpRole',
            message: 'What role is the new employee in?',
            choices: roles
        }
    ])
    let { rows } = await db.inputEmployee(newEmployee);
    console.log("Employee added");
};
// update department prompt
const updateDepartment = async () => {
    const departments = await fetchDepartments();
    let {updatedDepartment, department} = await prompt ([
        {
            type: 'list',
            name: 'department',
            message: 'What department do you want to update?',
            choices: departments
        },
        {
            name: 'updatedDepartment',
            message: 'What do you want to change this department name to?'
        }
    ]);
    const departmentId = await fetchDepartmentId(department);
    let { rows } = await db.changeDepartment(updatedDepartment, departmentId);
    console.log("Department Updated");
    loadMainPrompts();
};
//update role function
const updateRole = async () => {
    try {
        const roles = await fetchRoles(); 
        console.log(roles);       
        // Prompt user to select a role
        const { roleId } = await prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Select a role to update:',
                choices: roles
            }
        ]);
        // Prompt for updated role name and salary
        const {updatedRole, salary} = await prompt([
            {
                name: 'updatedRole',
                message: 'Enter the updated role name:'
            },
            {
                name: 'salary',
                message: 'Enter the updated salary:'
            }
        ]);
        // Call the changeRole function to update the role
       const departmentId = await fetchDepartmentId(roles);
       let { rows } = await db.changeRole(updatedRole, salary, roleId);     
       console.log(updatedRole);
       console.log(departmentId);
        console.log("Role updated successfully.");
        loadMainPrompts();
    } catch (error) {
        console.error('Error updating role:', error);
    }
};
// update an employee function
const updateEmployee = async () => {
    const employees = await fetchEmployees();
    const roles = await fetchRoles();  
    let { Employee, role } = await prompt ([
        {
            type:'list',
            name: 'Employee',
            message: 'What employee do you want to change the role of?',
            choices: employees
        },
        {   
            type: 'list',
            name: 'role',
            message: 'What role will this employee be in?',
            choices: roles
        }        
    ]);   
    let { rows } = await db.changeEmployee(role, Employee);
        console.log("Employee Updated");
        loadMainPrompts();
};
// delete a department role
const deleteDepartment = async () => {
        const departments = await fetchDepartments();
        let { department } = await prompt ([
            {
                type: 'list',
                name: 'department',
                message: 'What department do you want to delete?',
                choices: departments
            }
        ])
        let { rows } = await db.removeDepartment(department);
        console.log("Department Deleted");
        loadMainPrompts();
};
// delete a role function
const deleteRole = async () => {
    const roles = await fetchRoles();
    let {role} = await prompt ([
        {
            type: 'list',
            name: 'role',
            message: 'What role do you want to delete?',
            choices: roles
        }       
    ]);
    let { rows } = await db.removeRole(role);
    console.log(`Role deleted`);
    loadMainPrompts();
};
//delete individual employee
const deleteEmployee = async () => {
    const employees = await fetchEmployees();
    let {employee} = await prompt ([
        {
            type: 'list',
            name: 'employees',
            message: 'What employee do you want to delete?',
            choices: employees
        }        
    ]);
    let { rows } = await db.removeEmployee(employee);
    console.log(`Employee deleted`);
    loadMainPrompts();    
};
// get all department and id function and maps them all
  function fetchDepartments() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT department_name, department_id FROM department', (error, results) => {
        if (error) {
          reject(error);
        } else {
            if (results.rows.length > 0) {
          resolve(results.rows.map(({department_name, department_id}) => ({
            name: department_name,
            value: department_id
          })));
        }
    }
    });
});
};
//get an individual id for a department
async function fetchDepartmentId() {
    return new Promise ((resolve, reject) => {
    pool.query('SELECT department_id FROM department', (error, results) => {
        if (error) {
            reject(error);
        } else { 
            if(results.rows.length > 0) {
                resolve(results.rows[0].department_id);
            }            
        }
    });
    });  
};
//gets all roles and id and maps over them
function fetchRoles() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM roles', (error, results) => {
        if (error) {
          reject(error);
        } else {
            if (results.rows.length > 0) {
          resolve(results.rows.map(({title, role_id}) => ({
            name: title,
            value: role_id
          })));
        }
        }
      });
    });
};

//get an individual id for a role
function fetchRoleId() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT role_id FROM roles', (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.rows.length > 0) {
                    resolve(results.rows[0].role_id);
                }
            }
        });
    });
};
//get all employees and id and maps over them
function fetchEmployees() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT first_name, last_name, employee_id FROM employee', (error, results) => {
          if (error) {
            reject(error);
          } else {
              if (results.rows.length > 0) {
            resolve(results.rows.map(({first_name, last_name, employee_id}) => ({
                name: `${first_name} ${last_name}`,
                value: employee_id
            })));
          }
          }
        });
      });
}
//get individual employee id
function fetchEmployeeId() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT employee_id FROM employee', (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.rows.length > 0) {
                    resolve(results.rows[0].employee_id);
                }
            }
        });
    });
};
//fetch and individiual manager id from employee
function fetchManagerId() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT manager_id FROM employee', (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.rows.length > 0) {
                    resolve(results.rows[0].manager_id);
                }
            }
        });
    });
}
// BONUS- Create a function to View all employees that belong to a department

// BONUS- Create a function to View all employees that report to a specific manager

// BONUS- Create a function to Delete an employee



// BONUS- Create a function to Update an employee's manager










// BONUS- Create a function to Delete a department

// BONUS- Create a function to View all departments and show their total utilized department budget



// Exit the application
function quit() {
  console.log("Goodbye!");
  process.exit();
}
