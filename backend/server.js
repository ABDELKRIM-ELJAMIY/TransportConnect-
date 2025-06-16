const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');


dotenv.config();


connectDB();


const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.send('TransportConnect API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
