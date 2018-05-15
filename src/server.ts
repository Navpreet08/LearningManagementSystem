
import express from 'express';
import path from 'path';
import apiRoute from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(function  (req,  res,  next) {
    res.header("Access-Control-Allow-Origin",  "*");
    res.setHeader('Access-Control-Allow-Methods',  'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers",  "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.use('/', express.static(path.join(__dirname, 'public')));



app.use('/', apiRoute);

app.listen(8000, () => console.log('Server started at http://localhost:8000'));

