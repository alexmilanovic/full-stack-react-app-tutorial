var { Pool } = require('pg');

const CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/weather-db';
const SSL = process.env.NODE_ENV === 'production';
//serverName=localhost;databaseName=weather-db;user=postgres;password=melmic

//const pool = new Pool({
 //   user: 'postgres',
 //   host: 'localhost',
 //   database: 'weather-db',
 //   password: 'melmic',
 //   port: 5432,
 // })


class Database {
  constructor () {
    this._pool = new Pool({
    //  connectionString: CONNECTION_STRING,
    //  connectionString: pool,
    user: 'postgres',
    host: 'localhost',
    database: 'weather-db',
    password: 'melmic',
    port: 5432,
      ssl: SSL
    });

    this._pool.on('error', (err, client) => {
      console.error('Unexpected error on idle PostgreSQL client.', err);
      process.exit(-1);
    });

  }

  query (query, ...args) {
    this._pool.connect((err, client, done) => {
      if (err) throw err;
      const params = args.length === 2 ? args[0] : [];
      const callback = args.length === 1 ? args[0] : args[1];

      client.query(query, params, (err, res) => {
        done();
        if (err) {
          console.log(err.stack);
          return callback({ error: 'Database error.' }, null);
        }
        callback({}, res.rows);
      });
    });

  }

  end () {

    this._pool.end();
  }
}

module.exports = new Database();
