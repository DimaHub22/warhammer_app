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
app.use(cors());
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

        // if (imageExtensions.includes(ext)) {
        //     // Изображения - кэш на 1 год
        //     res.set('Cache-Control', 'public, max-age=31536000, immutable');
        // } else if (mediaExtensions.includes(ext)) {
        //     // Медиа - кэш на 1 месяц
        //     res.set('Cache-Control', 'public, max-age=2592000');
        // } else if (docExtensions.includes(ext)) {
        //     // Документы - кэш на 1 неделю
        //     res.set('Cache-Control', 'public, max-age=604800');
        // } else {
        //     // Остальные файлы - кэш на 1 час
        //     res.set('Cache-Control', 'public, max-age=3600');
        // }

        // // Безопасность (CORS)
        // res.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
        //
        // // Дополнительные заголовки безопасности
        // res.set('X-Content-Type-Options', 'nosniff');
        // res.set('Cross-Origin-Resource-Policy', 'same-site');
        //
        // // Отключаем ETag для статики с хешами в именах
        // if (filePath.match(/\.[a-f0-9]{8}\./)) {
        //     res.removeHeader('ETag');
        // }
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