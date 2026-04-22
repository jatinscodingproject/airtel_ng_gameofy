const express = require('express');
const app = express();
const path = require('path')
const pageRoutes = require("./routes/pages");
require('dotenv').config()
const sequelize = require('./config/db');
    

const PORT = process.env.PORT

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", pageRoutes);

app.set('trust proxy', true);

const callbackRoutes = require('./routes/routes.callback');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', callbackRoutes);
// app.use('/api', videoRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        // console.log('Database connected');
        await sequelize.sync();
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

require('./cron/smscron')

connectDB();

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});

app.use(express.static("public"));


