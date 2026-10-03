import express from 'express';
import 'dotenv/config';
const app = express();


app.listen(process.env.PORT || 3000, () => {
    console.log(`App is listening on PORT : ${process.env.PORT}`);
});

export {app};