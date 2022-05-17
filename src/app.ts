require('dotenv').config();
import express from 'express';
import config from 'config';
import connectToDb from './utils/connectToDb';
import log from "./utils/logger";

import router from './routes';

const app = express();
const port = config.get("port");
app.use(express.json());
app.use(router);


app.listen(port, () => {
		log.info(`App started at http://localhost:${port}`);
		connectToDb();
});

console.log(`hello TS Express!! ${port}`);