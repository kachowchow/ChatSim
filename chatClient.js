//connect to server and retain the socket
//connect to same host that served the document

//const socket = io('http://' + window.document.location.host)
//by default connects to same server that served the page
let socket
let counter = 0

function handleKeyDown(event) {
  const ENTER_KEY = 13 //keycode for enter key
  if (event.keyCode === ENTER_KEY) {
    sendMessage()
    return false //don't propogate event
  }
}
let globalUser
let userArray = []
let index = 0

function setUsername() {
  let username = document.getElementById('msgBox').value.trim()
  globalUser = document.getElementById('msgBox').value.trim()
  if (username === '') return

  var regex = /^[a-zA-Z0-9]+$/
  let validUser = false

  if (/^[a-zA-Z]$/.test(username.charAt(0)) && regex.test(username))
    validUser = true

  if (validUser) {
    socket = io()
    socket.emit('setUsername', username)
    let connection = username + ' joined the chat room'
    socket.emit('clientSays', connection)

    socket.on('serverSays', function (message) {
      let msgDiv = document.createElement('div')

      msgDiv.id = "messageDiv"
      msgDiv.textContent = message

      if(message.startsWith(username + ': '))
        msgDiv.classList.add("client");

      userLength = username.length + 2
      
      if(message.includes(': ', userLength))
        msgDiv.classList.add("private")


      if (counter == 0){
        document.getElementById('connection').appendChild(msgDiv)
        counter++
      }
      else 
       document.getElementById('messages').appendChild(msgDiv)
    })

    let button = document.getElementById("connect_button")
    let parentElement = button.parentNode

    parentElement.removeChild(button)
  }

  document.getElementById('msgBox').value = ''
}

function sendMessage() {
  let clientMessage = document.getElementById('msgBox').value.trim()
  let message = globalUser + ": " + clientMessage

  if (clientMessage === '') return // Do nothing if the input box is empty
  socket.emit('clientSays', message)
  document.getElementById('msgBox').value = ''
}

function clearMessages(){
  document.getElementById("messages").innerHTML = ''
}

//Add event listeners
document.addEventListener('DOMContentLoaded', function () {
  //This function is called after the browser has loaded the web page

  //add listener to buttons
  document.getElementById('send_button').addEventListener('click', sendMessage)
  document.getElementById('connect_button').addEventListener('click', setUsername)
  document.getElementById('clear_button').addEventListener('click', clearMessages)

  //add keyboard handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  //document.addEventListener('keyup', handleKeyUp)
})
