/* eslint-disable no-console */
import { connect, connection } from 'mongoose';

require('dotenv').config();

const initDB = () => {
  connect(
    `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.DBURI}`,
    { useNewUrlParser: true, useUnifiedTopology: true },
  );

  connection.once('open', () => {
    console.log('connected to database');
  });
};

export default initDB;
