import React from 'react'

class SendMessageForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            message:''
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }
    handleChange(e){
        this.setState({
            message:e.target.value,
        })
    }
    handleSubmit(e){
        e.preventDefault()
        this.props.sendMessage(this.state.message)
        this.setState({
            message:'',
        })
    }

    render(){

        return(
            <form className="send-message-form" onSubmit={this.handleSubmit}>
                <input
                disabled={this.props.disabled}
                onChange={this.handleChange}
                value={this.state.message}
                placeholder="type  your message and press Enter"
                type="text"
                />
            </form>
        )
    }
}


export default SendMessageForm