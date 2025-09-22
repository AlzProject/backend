import express from 'express';
import pino from 'pino-http'

const app = express();
const PORT = process.env.PORT || 3000;
const logger = pino().logger

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
   logger.info(`Server is running on http://localhost:${PORT}`); 
});