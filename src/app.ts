import "dotenv/config";
import express, { Request, Response, json } from "express";
import cors from "cors";
import { router } from './routes';
import dbConnect from "./config/mongo";
import sequelize from "./config/mysql";
import { Server } from "socket.io";
import { createServer } from "http";
import redis, { Redis } from "ioredis";

const PORT = process.env.PORT || 3001;

const urlRedis = process.env.URL_REDIS;
const portRedis = parseInt(<string>process.env.PORT_REDIS) || 3000;
const passwordRedis = process.env.PASSWORD_REDIS;

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const httpServer = createServer(app);
const io = new Server(httpServer);

//Server Socket.io
io.on("connection", (socket) => {

    const redisClient = new Redis({
        host: urlRedis,
        port: portRedis,
        password: passwordRedis
    });

    redisClient.subscribe("lavado-chanel", (err, count) => {
        if(err){
            console.error("Failed to subscribe: %s", err.message);
        }else{
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`
              );
        }
    });

    redisClient.on("message", (channel, message) => {

        console.log(`Received ${message} from ${channel}`);
        
        socket.emit(
            'onChangeStructure',
            message
        );
    });

    socket.on('disconnect', function () {
        console.log('socket disconnected : ' + socket.id)
    });

    io.emit(
        'messageConection',
        'Mensaje para todos, se conecto un nuevo socket ' + socket.id
    );

    /*
    setInterval(() => {
        io.emit('random', Math.floor(Math.random() * 100))
    }, 3000);

    setInterval(() => {

        let idEstructura = Math.floor(Math.random() * 100);
        let estado       = Math.floor(Math.random() * 10);
        let user         = Math.floor(Math.random() * 50);

        io.emit('updateEstructuras', [{idEstructura, estado, user}]);
    }, 5000);

    socket.on('mensajeCliente', (message) => {
        console.log("Hola recibi el mensaje " + message + " desde el socket " + socket.id);

        socket.broadcast.emit('mensajeEmitido', message);
    });
    */

});

//Conection to database mongo
// dbConnect().then(() => console.log("Conection Mongo succesfull!"));

//Conection to MySQL
sequelize.authenticate().then( () => { console.log("Conextion MySQL successfull!")});

httpServer.listen(PORT, () => console.log(`API Corriendo por el puerto ${PORT}`));