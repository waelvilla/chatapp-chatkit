import React from 'react'



class Login extends React.Component {

    constructor(){
        super()
        this.state={
            username:''
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    handleSubmit(e){
        e.preventDefault()
        this.props.setUser(this.state.username)
        this.setState({
            username: ''
        })
    }
    handleChange(e){
        this.setState({
            username: e.target.value
        })
    }

    render(){
        return(
            <div className="login">
                
                <h1> Login </h1>
                <form className="login-form" onSubmit={this.handleSubmit} >
                    Username: <input type="text" onChange={this.handleChange} />
                    <br/>
                    Password: <input type="password" />
                    <br />
                    <input type="submit" label="submit" />
                </form>
            </div>
        )
    }
}
export default Login