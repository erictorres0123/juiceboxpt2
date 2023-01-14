const {Client} = require('pg'); //imports the pg module needed for using psql

//supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');

async function getAllUsers(){
    const {rows} = await client.query(
        `SELECT id, name, location, active, username
        FROM users;`
    );

    return rows;
}

async function createUser({
    username,
    password,
    name,
    location})
{
    try
    {
        const {rows: [user] } = await client.query(`
            INSERT INTO users(username, password, name, location) 
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `,[username, password, name, location]);
        return user;
    }catch(error)
    {
        throw error;
    }
}

async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ user ] } = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return user;
    } catch (error) {
      throw error;
    }
  }


  //posts functions
  async function createPost({
    authorId,
    title,
    content
  }){
    try{
        const {rows: [post] } = await client.query(`
            INSERT INTO posts("authorId", title, content) 
            VALUES ($1, $2, $3)
            RETURNING *;
        `,[authorId, title, content]);
        return post;
    }catch(error){
        throw error;
    }
  }

 async function updatePost(id, fields = {
    title,
    content,
    active
  }){
    
    const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
    return;
    }

    try {
    const { rows: [ post ] } = await client.query(`
        UPDATE posts
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
    `, Object.values(fields));

    return post;

    }catch(error)
    {
        throw error;
    }
  }

  async function getAllPosts()
  {
    const {rows} = await client.query(
      `SELECT id, active, "authorId", title, content
      FROM posts;`
  );

  return rows;
  }

async function getPostsByUser (userId) {
  try {
    const {rows} = await client.query(`
    SELECT * FROM posts
    WHERE "authorId" = ${ userId }
    `)

    return rows;
  } catch (error) {
    throw error;
  }

}

async function getUserById (userId) {
  try {
      const {rows: [user]} = await client.query(`
      SELECT id, username, name, location, active
      FROM users
      WHERE id = ${ userId }
      `)
    if (!user) {
      return null;
    }

    delete rows.password;
    rows.posts = await getPostsByUser(userId); 

    return user;
 } catch (error) {
  throw error;
 }
}

async function createTags (tagList) {
if (tagList.length === 0) {
  
  return;
}

const insertValues = tagList.map(
  (_, index) => `${index + 1}`).join('), (');


  const selectValues = tagList.map(
    (_, index) => `${index + 1}`).join(', ');

  try {
    const {rows: [tags]} = await client.query(`
    INSERT INTO tags (name)
    VALUES ($1), ($2), ($3)
    ON CONFLICT (tags) DO NOTHING
    `)
    const {rows} = await client.query (`
    SELECT * FROM tags
    WHERE name 
    IN ($1, $2, $3);
    `)
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
    getUserById,
    getAllPosts,
    updatePost,
    createPost,
}