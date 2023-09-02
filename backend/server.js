//modules
import dotenv from 'dotenv';

//app
import app from './app.js';

//environment variables
dotenv.config({path: './config.env'});

const port = dotenv.config.PORT || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
