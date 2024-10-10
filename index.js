const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')

const codex = require('./routers/codex')
const categories = require('./routers/categories')
const unit = require('./routers/units')
const addedUnits = require('./routers/addedUnits')
const addedArmy = require('./routers/addedArmy')


const PORT = process.env.PORT || 5000


const app = express()
app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/codex',codex)
app.use('/category',categories)
app.use('/unit', unit)
app.use('/addedUnits', addedUnits)
app.use('/addedArmy', addedArmy)


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