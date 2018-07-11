const {Client} = require('pg')
const keys = require('../config/keys')

//connecting to postgres
console.log(keys.postgres)
const postgresClient = new Client(keys.postgres)
postgresClient.connect((err)=>{
err ? console.log(`Postgres connection error: ${err}`) :
console.log('Postgres connected!')
})

const createUserTable = `CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL   
 );`

 postgresClient.query(createUserTable, (err,result)=>{
    if(err){
        console.log(err, 'while creating a table')
    }
    console.log(`Table ${result} successfully created`)
});