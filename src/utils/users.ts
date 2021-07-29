import {User} from './data-structure';

const users: User[] = [];
const activeRooms: string[] = []

export const addUser = ({id, username, room}: {id: string, username: string, room: string}) => {
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
    const user: User = { id, username, room}
    users.push(user)
    return { user }
}

export const removeUser = (id: string) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

export const getUser = (id: string) => {
    return users.find((user) => user.id === id)
}

export const getUsersInRoom = (room: string) => {
    return users.filter((user) => user.room === room)
}

export const addToActiveRoom = (room: string) => {
    room = room.trim().toLowerCase() 
    const idx: number = activeRooms.findIndex((activerRoom) => activerRoom === room)
    if(idx === -1) {
        activeRooms.push(room)
    }
    return activeRooms
}

export const removeFromActiveRoom = (room: string) => {
    const idx: number = activeRooms.findIndex((activerRoom) => activerRoom === room)
    if(idx !== -1) {
        activeRooms.splice(idx, 1)
        return activeRooms
    }
    return activeRooms
}

export const getActiveRooms = () => {
    return activeRooms
}