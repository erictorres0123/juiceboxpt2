const {Client} = require('pg'); //imports the pg module needed for using psql

//supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');

async function getAllUsers(){
    const {rows} = await client.query(
        `SELECT id, username
        FROM users;`
    );

    return rows;
}

module.exports = {
    client,
    getAllUsers,
}