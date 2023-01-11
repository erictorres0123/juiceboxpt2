//grab our client with destructuring from the export in index.js
const {client, getAllUsers} = require('./index');

async function testDB() {
    try{
        //connect the client to the database, finally
        client.connect();

        //queries are promises, so we can await them
        const users = await getAllUsers();

        console.log(users);
    }catch(error){
        console.error(error);
    }finally{
        //make sure to close out the client connection
        client.end();
    }
}

testDB();

//calls a query taht dropsTables
async function dropTables(){
    try{
        await client.query(`
        DROP TABLE IF EXITSTS users;        
        `);
    }catch(error)
    {
       throw error; //pass the error to teh function that calls dropTables
    }
}

async function createTables(){
    try{
        await client.query(`
        `);
    }catch(error)
    {
        throw error; //pass the error up to the function that calls createTables.
    }
}


async function rebuildDB() {
    try{
        client.connect();

        await dropTables();
        await createTables();
    }catch(error) {
        console.error(error);
    }finally {
        client.end();
    }
}

rebuildDB();