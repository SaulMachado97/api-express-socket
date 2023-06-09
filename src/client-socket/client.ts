import io from "socket.io-client";

class Client {

    private socket

    constructor() {
        this.socket = io()

        this.socket.on('message', function (message: any) {
            console.log(message)
            document.body.innerHTML = message
        })

        this.socket.on('random', function (message: any) {
            console.log(message)
            document.body.innerHTML += 'Winning number is ' + message + '<br/>'
        })

        this.socket.on('random', function (message: any) {
            console.log(message)
            document.body.innerHTML += 'Winning number is ' + message + '<br/>'
        })

        this.socket.on('updateEstructuras', function (message: any) {
            console.log(message)
        })
        
    }
}

const client = new Client()