export interface User {
    id: string,
    username: string,
    room: string
}

export interface LocationCords {
    lat: number,
    long: number
}

export interface Message {
    createdAt: number,
    username: string,
    url?: string,
    text?: string
}