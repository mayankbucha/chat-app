// @ts-ignore
import {socketio} from 'socket.io';
const socket: any = socketio.io()

const $activeRoomList: Element = document.querySelector('#activeRoom')

socket.emit('activeRooms')

socket.on('activeRooms', (rooms: string[]) => {
    console.log(rooms)
    let options: string = '';
    for(let i=0; i<rooms.length; i++) {
        options += '<option value="' + rooms[i] + '" />';    
    }
    $activeRoomList.innerHTML = options;
})