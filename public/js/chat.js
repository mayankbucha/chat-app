const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $mesageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationbutton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages') 

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML  
const locationTemplate = document.querySelector('#location-template').innerHTML  
const sidebarTeplate = document.querySelector('#sidebar-template').innerHTML

// Array to store message in session storage.
let messages = []

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the last message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    
    // Visible height
    const VisibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled
    const scrollOffset = $messages.scrollTop + VisibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const localMessages = sessionStorage.getItem("Message")
    if(message.text === "Welcome!" && localMessages) {
        messages = JSON.parse(localMessages)
        renderLocalMessages(JSON.parse(localMessages))
        return;
    }
    else {
        messages.push(message)
        sessionStorage.setItem("Message", JSON.stringify(messages))
    }
    Mustache.parse(messageTemplate)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
        timestamp: message.createdAt
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

const renderLocalMessages= (messagesArray) => {
    messagesArray.forEach((message) => {
        if(message.url) {
            Mustache.parse(locationTemplate)
            const html = Mustache.render(locationTemplate, {
                username: message.username,
                url: message.url,
                createdAt: moment(message.createdAt).format('h:mm a'),
                timestamp: message.createdAt
            })
            $messages.insertAdjacentHTML('beforeend', html)
        }
        else {
            Mustache.parse(messageTemplate)
            const html = Mustache.render(messageTemplate, {
                username: message.username,
                message: message.text,
                createdAt: moment(message.createdAt).format('h:mm a'),
                timestamp: message.createdAt
            })
            $messages.insertAdjacentHTML('beforeend', html)
        }
    })
    // Srolling to the end of page
    $messages.scrollTop = $messages.scrollHeight
}

socket.on('locationMessage', (message) => {
    console.log(message)
    messages.push(message)
    sessionStorage.setItem("Message", JSON.stringify(messages))
    Mustache.parse(locationTemplate)
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a'),
        timestamp: message.createdAt
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room ,users}) => {
    const html = Mustache.render(sidebarTeplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $mesageFormInput.value = ''
        $mesageFormInput.focus()

        if(error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

// Delete message
$messages.addEventListener('click', (e) => {
    if(e.target && e.target.className == "message__options") {
        const timestamp = e.target.getAttribute('data-timestamp')
        messages = messages.filter((message) => message.createdAt != timestamp)
        sessionStorage.setItem("Messages", JSON.stringify(messages))
        $messages.innerHTML = ''
        renderLocalMessages(messages)
    }
})


$sendLocationbutton.addEventListener('click', (e) => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
    $sendLocationbutton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, () => {
            $sendLocationbutton.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})