//grab our client with destructuring from the export in index.js
const {client, getAllUsers} = require('./index');

async function testDB() {
    try{
        console.log('Starting to test database...');
        
        //queries are promises, so we can await them
        const users = await getAllUsers();
        console.log('getAllUsers: ', users);

        
        console.log('Finished database tests!');

    }catch(error){
        console.error('Error testing database!');
        throw error;
    }
}

//calls a query that dropsTables
async function dropTables(){
    try{
        console.log('Starting to drop tables...');
        await client.query(`
        DROP TABLE IF EXISTS users;        
        `);
        console.log('Finished dropping tables!');
    }catch(error)
    {
        console.error('Error dropping tables!');
       throw error; //pass the error to the function that calls dropTables
    }
}

async function createTables(){
    try{
        console.log('Starting to build tables...');

        await client.query(`   
        CREATE TABLE users (
            id  SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
        `);
        console.log('Finished building tables!')
    }catch(error) {
        console.error('Error building tables!')
        throw error; //pass the error up to the function that calls createTables.
    }
}


async function rebuildDB() {
    try{
        client.connect();

        await dropTables();
        await createTables();
    }catch(error) {
        throw error;
    }
}

rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end());