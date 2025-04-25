import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import Sequelize from 'sequelize';
import configFile from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize(configFile.development);
const db = {};

const modelFiles = fs.readdirSync(__dirname).filter(file =>
  file.indexOf('.') !== 0 &&
  file !== 'index.js' &&
  file.endsWith('.js')
);

for (const file of modelFiles) {
  const modelImport = await import(pathToFileURL(path.join(__dirname, file)).href);
  const model = modelImport.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
