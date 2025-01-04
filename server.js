const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const socketServer = http.createServer(app);


app.use(cors());


const io = new Server(socketServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
    }); 

const fs = require('fs');
const path = require('path');
const chatHistoryPath = path.join(__dirname, 'chat_history.json');

const getHistory = () => {
    try {
        if(fs.existsSync(chatHistoryPath)){
            const data = fs.readFileSync(chatHistoryPath , 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error(error);
        return [];
    }
};

const saveHistory = (history) => {
    try{
    fs.writeFileSync(chatHistoryPath, JSON.stringify(history), 'utf-8');
    }catch (error) {
        console.error(error);
    }
};

io.on('connection', (socket) => {
    console.log('a user connected ' + socket.id);

    socket.emit('chat_history', globalHistory);
    socket.on('send message', (message) => {
        globalHistory.push(message);
        saveHistory(globalHistory);
        io.emit('receive message', message);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


let globalHistory = getHistory();

const PORT = 4000;
socketServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


