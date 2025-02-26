const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')

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
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

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