const dotenv = require('dotenv');
// Environment variable Initialization
dotenv.config();

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const dbConfig = require('./db/databaseHandler');
const app = express();
const PORT = process.env.PORT || 6000;

// Imported Routes
const education = require('./routes/education');
const work = require('./routes/work');
const skills = require('./routes/skills');
const certificate = require('./routes/certificate');
const project = require('./routes/project');
const message = require('./routes/message');;

// Cors Enabled
app.use(cors());
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.send("Application is up!");
})


// Routes
app.use('/api/v1/education', education);
app.use('/api/v1/work', work);
app.use('/api/v1/skills', skills);
app.use('/api/v1/certificate', certificate);
app.use('/api/v1/project', project);
app.use('/api/v1/send_message', message);



app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});