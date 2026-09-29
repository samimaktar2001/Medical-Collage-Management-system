import { Database } from './database';
import { seed } from './seed';
const db = new Database();
db.migrate()
  .then(() => seed(db))
  .then(() => db.close())
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
