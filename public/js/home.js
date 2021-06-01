const socket = io()

const $activeRoomList = document.querySelector('#activeRoom')

socket.emit('activeRooms')

socket.on('activeRooms', (rooms) => {
    console.log(rooms)
    let options = ''
    for(let i=0; i<rooms.length; i++) {
        options += '<option value="' + rooms[i] + '" />';    
    }
    $activeRoomList.innerHTML = options;
})