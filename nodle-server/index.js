const express = require('express');
const cors = require('cors');
const users = require('./routes');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/', users);

const server = () => {
  app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
}
server();
