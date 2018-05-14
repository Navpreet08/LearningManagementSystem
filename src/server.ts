
import express from 'express';
import path from 'path';
import apiRoute from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/', express.static(path.join(__dirname, 'public')));



app.use('/', apiRoute);

app.listen(8000, () => console.log('Server started at http://localhost:8000'));

