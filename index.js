const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const compression = require('compression');
const path = require('path');

const codex = require('./routers/codex')
const categories = require('./routers/categories')
const unit = require('./routers/units')
const addedUnits = require('./routers/addedUnits')
const addedArmy = require('./routers/addedArmy')
const keyWords = require('./routers/keyWorlds')
const model = require('./routers/models')
const squad = require('./routers/squad')


const PORT = process.env.PORT || 5000


const app = express()
// Настройка CORS с конкретными origin
const corsOptions = {
    origin: [
        'http://89.117.145.43',
        'http://89.117.145.43:8080',
        'http://localhost:4200', // для разработки
        'http://localhost:8080' // для разработки
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(compression()); // Включает gzip для всех ответов
app.use('/uploads', express.static('uploads',{
    setHeaders: (res, filePath) => {
        // Оптимальные заголовки кэширования для разных типов файлов
        const ext = path.extname(filePath).toLowerCase();
        const imageExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg'];


        if (imageExtensions.includes(ext)) {
            // Изображения - кэш на 1 год
            res.set('Cache-Control', 'public, max-age=604800, immutable');
        }

        // Заголовки безопасности
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');

        if (filePath.match(/\.[a-f0-9]{8,}\./i)) {
            res.removeHeader('ETag');
        }
    }
}))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.disable('x-powered-by');

app.use('/codex',codex)
app.use('/category',categories)
app.use('/unit', unit)
app.use('/addedUnits', addedUnits)
app.use('/addedArmy', addedArmy)
app.use('/keyWord', keyWords)
app.use('/model', model)
app.use('/squad',squad)


const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            dbName: process.env.dbName
        })
            .then(() => console.log('Mongo DB'))
            .catch(error => console.log(error))

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    }catch (e) {

    }

};

start()