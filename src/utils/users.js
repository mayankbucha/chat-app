const users = []
const activeRooms = []

const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()    

    // validate the data
    if(!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

const addToActiveRoom = (room) => {
    room = room.trim().toLowerCase() 
    const idx = activeRooms.findIndex((activerRoom) => activerRoom === room)
    if(idx === -1) {
        activeRooms.push(room)
    }
    return activeRooms
}

const removeFromActiveRoom = (room) => {
    const idx = activeRooms.findIndex((activerRoom) => activerRoom === room)
    if(idx !== -1) {
        activeRooms.splice(idx, 1)
        return activeRooms
    }
    return activeRooms
}

const getActiveRooms = () => {
    return activeRooms
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    addToActiveRoom,
    getActiveRooms,
    removeFromActiveRoom
}