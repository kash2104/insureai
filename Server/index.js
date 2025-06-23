const express = require('express');
const authRoutes = require('./routes/auth');
const extractInsuranceRoutes = require('./routes/extractInsurance');
const { auth } = require('./middlewares/auth');

const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { connectQueue, summaryWorker, websearchWorker } = require('./config/queue');

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));



app.use('/api/v1', authRoutes);
app.use('/api/v1',auth, extractInsuranceRoutes);

async function startQueueAndWorkers(){
    try {
        await connectQueue();
        await summaryWorker();
        await websearchWorker();
    } catch (error) {
        console.error("Error starting queue and workers:", error);
        process.exit(1);
    }
}

startQueueAndWorkers();


app.get('/', (req, res) => {
    return res.json({
        success:true,
        message: "App is running successfully."
    })
})


app.listen(4000, () => {
    
    console.log("App is listening on port 4000.")
})