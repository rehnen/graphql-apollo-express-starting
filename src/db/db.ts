import { Database } from 'sqlite3';

const db = new Database('db.sqlite3');

export const selectUserQuery = (email: string, password: string) => {
  const p = new Promise((res, rej) => {
    db.get(
      `SELECT * FROM user WHERE email = "${email}" AND password = "${password}"`,
      (err, row) => {
        if (err) {
          rej(err);
        }
        res(row);
      }
    );
  });
  return p;
};

export const startupSript = () => {
  const select = () => {
    db.all('SELECT * FROM user', (err, rows) => {
      console.log('select');
      console.log(err ?? 'no err');
      rows.forEach(console.log);
    });
  };
  const insert = (result: any, error: any) => {
    console.log('insert');
    if (error) {
      console.log(error);
      return;
    }
    db.run(
      'INSERT INTO user (name, email, password) VALUES("Marcus Rehn", "marcus.rehn@hotmail.com", "test")',
      select
    );
    console.log(result);
  };
  const create = () =>
    db.run('CREATE TABLE user (name text, email text, password text)', insert);
  const drop = () => db.run('DROP TABLE IF EXISTS user', create);

  drop();
};
