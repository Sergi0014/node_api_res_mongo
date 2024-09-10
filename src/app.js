const express = require('express');
const {config} = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
config()

const bookRoutes = require('./routes/book.routes');
//usamos express para los middleware
const app = express();

//parseador de body
app.use(bodyParser.json());

//conectaremos la base de datos:
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME, })
const db = mongoose.connection;
// middleware pora conectar la rutas
app.use('/books', bookRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`servidor iniciado en el puerto ${port}`);

})