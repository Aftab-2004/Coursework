import React, { Component } from 'react'
import axios from 'axios'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            'username': null,
            'password': null,
            'error': null
        }
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            error: null
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        
        axios.post('http://localhost:8000/api/adminLogin', {
            username: username,
            password: password,
        })
        .then(response => { 
            if(response.data) {
                localStorage.setItem('isAdmin', 'true');
                window.location.assign("/elections")
            } else {
                this.setState({ error: 'Incorrect Username or Password' });
            }
        })
        .catch(err => {
            console.error(err);
            this.setState({ error: 'An error occurred. Please try again.' });
        });
    }

    render() {
        const { error } = this.state;
        return (
            <div className="container">
                <div className="card">
                    <div className="card-content">
                        <h4>Admin Login</h4>
                        {error && <div className="red-text">{error}</div>}
                        <form onSubmit={this.handleSubmit}>
                            <div className="input-field">
                                <input type="text" id="username" onChange={this.handleInputChange} required />
                                <label htmlFor="username">Username</label>
                            </div>
                            <div className="input-field">
                                <input type="password" id="password" onChange={this.handleInputChange} required />
                                <label htmlFor="password">Password</label>
                            </div>
                            <button className="btn waves-effect waves-light" type="submit">
                                Login
                                <i className="material-icons right">send</i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;