import React, { Component } from 'react'
import Chatkit from '@pusher/chatkit'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import Roomlist from './RoomList'
import NewRoomForm from './NewRoomForm'
import OnlineUsers from './OnlineUsers'
import Login from './Login'
import {tokenUrl, instanceLocator} from '../config'

class App extends Component {

  constructor(props){
    super(props)
    this.state={
      messages:[],
      joinedRooms:[],
      joinableRooms:[],
      roomId: null,
      onlineUsers:[],
      userId:'',
    }
    this.handleSendMessage=this.handleSendMessage.bind(this)
    this.subscribeToRoom=this.subscribeToRoom.bind(this)
    this.getRooms=this.getRooms.bind(this)
    this.handleCreateRoom=this.handleCreateRoom.bind(this)
    this.handleSetUser=this.handleSetUser.bind(this)
  }

  componentDidMount(){
    console.log("--- componentDidMount() ---");
    console.log("userid: ",this.state.userId)
    const chatManager=new Chatkit.ChatManager({
      instanceLocator,
      userId: this.state.userId,
      tokenProvider: new Chatkit.TokenProvider({
        url:tokenUrl
      })
    })
    chatManager.connect()
    .then(currentUser => {
      this.currentUser=currentUser
      this.getRooms()
      
    })
    .catch(err => console.log('err on connecting: ', err))

  }

  getRooms(){
    this.currentUser.getJoinableRooms()
    .then(joinableRooms =>{
      this.setState({
        joinableRooms,
        joinedRooms: this.currentUser.rooms
      })
    })
    .catch(err => console.log('err on joinableRooms: ',err))
  }

  subscribeToRoom(roomId){
    this.setState({messages:[]})
    this.currentUser.subscribeToRoom({
      roomId:roomId,
      messageLimit: 20,

      hooks: {
        onNewMessage: message => {
          this.setState({
            messages: [...this.state.messages,message]
          })
        }
      }
    })
    .then(room => {
      this.setState({
        roomId:room.id
      })
      this.getRooms()
    })
    .catch(err => console.log('err on subscribing to room: ',err)
    )
  }

  handleSendMessage(text){
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId,
      
    })
  }

  handleCreateRoom(roomName){
    this.currentUser.createRoom({
      name: roomName
    })
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log('err in creating room: ', err)
    )
  }

  handleSetUser(userId){
    this.setState({
      userId
    })
  }

  render() {
    console.log("---render---")
    
    if(this.state.userId===""){
      console.log("userId: ",this.state.userId);
      return(
        <Login setUser={this.handleSetUser} />
      )
    }
    
     else{
      console.log("user id: ", this.state.userId);
      
      return (
        <div className="app">
          <Roomlist 
            roomId={this.state.roomId}
            subscribeToRoom={this.subscribeToRoom}
            rooms={[... this.state.joinableRooms,...this.state.joinedRooms]} />
          <MessageList roomId={this.state.roomId} messages={this.state.messages}/>
          <SendMessageForm disabled={!this.state.roomId} sendMessage={this.handleSendMessage}/>
          <NewRoomForm createRoom={this.handleCreateRoom} />
          <OnlineUsers onlineUsers={this.state.onlineUsers} />
        </div>
      )
     }
    
  }
}

export default App
