import { Server } from 'socket.io';

export const users = {};

export const io = (http) => {
    const socketServer = new Server(http, {
        path: "/notifications",
        serveClient: false,
        pingInterval: 25000,
        pingTimeout: 60000,
        cookie: false,
        cors: {
            origin: "*", // adjust to your frontend origin in production
            methods: ["GET", "POST"]
        }
    });

    const count = () => console.log('Users Online: ' + Object.keys(users).length);

    socketServer.on('connection', socket => {
        let currentUser;

        socket.on('setuser', user => {
            users[user] = socket;
            currentUser = user;
            count();
        });

        socket.on('disconnect', () => {
            if (currentUser) delete users[currentUser];
            count();
        });
    });

    return socketServer;
};
