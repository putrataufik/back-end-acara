import express from 'express';
import bodyParser from 'body-parser';
import router from "./routes/api";
import db from './utils/database';

async function init(){
    try {
        const result = await db();
        console.log('Database Status: ',result);
        const app = express();
        app.use(bodyParser.json());
        
        const PORT = 3000;
        
        app.use('/api',router)
        
        app.listen(PORT,() => {
            console.log(`Server is running on http:localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

init();