import { Database } from './database';
const db = new Database();
db.migrate()
  .then(() => db.close())
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
