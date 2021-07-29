const path = require('path')
const http = require('http')
const express = require('express')
import { LocationCords, User } from './utils/data-structure';
const socketio = require('socket.io')
const Filter = require('bad-words')
import { generateMessage, generateLocationMessage } from './utils/messages';
import { addUser, removeUser, getUser, getUsersInRoom, addToActiveRoom, removeFromActiveRoom, getActiveRooms } from './utils/users';

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket: any) => {
    console.log('New Websocket connection')

    socket.emit('activeRooms', getActiveRooms());

    socket.on('join', ({username, room}: {username: string, room: string}, callback: (error?: string) => void) => {
        const { error, user } = addUser({id: socket.id, username, room})

        if(error) {
            return callback(error)
        }
        socket.join(user.room)
        io.emit('activeRooms', addToActiveRoom(user.room))
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        
        callback()
    })

    socket.on('sendMessage', (message: string, callback: (args?: string) => void) => {
        const user: User = getUser(socket.id)
        const filter = new Filter()
        
        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        
        if(user) {
            const users = getUsersInRoom(user.room)
            if(users.length == 0) {
                io.emit('activeRooms', removeFromActiveRoom(user.room))
            }
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation', (location: LocationCords, callback: () => void) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://www.google.com/maps?q=${location.lat},${location.long}`))
        callback()
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})