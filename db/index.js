const pool = require("./connection");

class DB {
  constructor() {}

  async query(sql, args = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
  }

  //query to view all employees
  findAllEmployees() {
    return this.query(`SELECT * FROM employee`);
  }
  //query to view all roles
  findAllRoles() {
    return this.query(
      `SELECT r.title AS title, r.salary, d.department_name FROM roles r JOIN department d ON r.department_id = d.department_id`
    );
  }
  //query to view all departments
  findAllDepartments() {
    return this.query(`SELECT * FROM department`);
  }
  //query to add a department
  inputDepartment(department_name) {
    return this.query(`INSERT INTO department(department_name) VALUES ($1)`, [
      department_name,
    ]);
  }
  //query to add a role
  inputRole(title, salary, department_id) {
    return this.query(
      `INSERT INTO roles(title, salary, department_id) VALUES ($1, $2, $3)`,
      [title, salary, department_id]
    );
  }
  //query to add employee
  inputEmployee(first_name, last_name, title) {
    return this.query(
      `INSERT INTO employees (first_name, last_name, title) VALUES ($1, $2, $3)`,
      [first_name, last_name, title]
    );
  }
  //query to update a department
  changeDepartment(department_name, department_id) {
    return this.query(
      `UPDATE department SET department_name = $1 WHERE department_id = $2`,
      [department_name, department_id]
    );
  }
  //query to update a role
  changeRole(title, salary, role_id) {
    return this.query(
      `UPDATE roles SET title = $1, salary = $2 WHERE role_id = $3`,
      [title, salary, role_id]
    );
  }
  //query to update an employee's role
  changeEmployee(role_id, employee_id) {
    return this.query(
      `UPDATE employee SET role_id = $1 WHERE employee_id = $2`,
      [role_id, employee_id]
    );
  }
  //query to remove a department
  removeDepartment(department_id) {
    return this.query(`DELETE FROM department WHERE department_id = $1`, [
      department_id,
    ]);
  }
  //query to remove a role
  removeRole(role_id) {
    return this.query(`DELETE FROM roles WHERE role_id = $1`, [role_id]);
  }
  //query to remove an employee
  removeEmployee(employee_id) {
    return this.query(`DELETE FROM employee WHERE employee_id = $1`, [
      employee_id,
    ]);
  }
  //query to view all employees except a certain employee
  selectExcept(employee_id) {
    return this.query(`SELECT * FROM employee WHERE employee_id != $1`, [
      employee_id,
    ]);
  }

  // BONUS- Create a query to Remove an employee with the given id

  // BONUS- Create a query to Update the given employee's manager

  // BONUS- Create a query to Remove a role from the db

  // BONUS- Create a query to Find all departments, join with employees and roles and sum up utilized department budget

  // BONUS- Create a query to Remove a department

  // BONUS- Create a query to Find all employees in a given department, join with roles to display role titles

  // BONUS- Create a query to Find all employees by manager, join with departments and roles to display titles and department names
}

module.exports = new DB();
