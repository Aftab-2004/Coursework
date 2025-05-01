import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            loading: false,
            error: null
        }
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            error: null
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        
        if (!username || !password) {
            this.setState({ error: 'Please enter both username and password' });
            return;
        }

        this.setState({ loading: true, error: null });

        try {
            const response = await axios.post('http://localhost:8000/api/adminLogin', {
                username,
                password,
            });
            
            if (response.data.success) {
                window.location.assign("/newelection");
            } else {
                this.setState({ 
                    error: 'Incorrect username or password',
                    loading: false 
                });
            }
        } catch (error) {
            this.setState({ 
                error: 'Failed to login. Please try again.',
                loading: false 
            });
        }
    }

    render(){
        const { username, password, loading, error } = this.state;

        return(
            <div className="container" style={{ marginTop: '2rem' }}>
                <div className="row">
                    <div className="col s12 m6 offset-m3">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title center-align">
                                    <i className="material-icons medium blue-text">admin_panel_settings</i>
                                    <h4>Admin Login</h4>
                                </span>
                                
                                {error && (
                                    <div className="card-panel red lighten-4">
                                        <span className="red-text text-darken-4">{error}</span>
                                    </div>
                                )}

                                <form onSubmit={this.handleSubmit}>
                                    <div className="input-field">
                                        <i className="material-icons prefix">person</i>
                                        <input 
                                            type="text" 
                                            id="username" 
                                            value={username}
                                            onChange={this.handleInputChange}
                                            className="validate"
                                            required
                                        />
                                        <label htmlFor="username">Username</label>
                                    </div>

                                    <div className="input-field">
                                        <i className="material-icons prefix">lock</i>
                                        <input 
                                            type="password" 
                                            id="password" 
                                            value={password}
                                            onChange={this.handleInputChange}
                                            className="validate"
                                            required
                                        />
                                        <label htmlFor="password">Password</label>
                                    </div>

                                    <div className="center-align" style={{ marginTop: '2rem' }}>
                                        <button 
                                            className="btn waves-effect waves-light blue" 
                                            type="submit" 
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span>
                                                    <i className="material-icons left">hourglass_empty</i>
                                                    Logging in...
                                                </span>
                                            ) : (
                                                <span>
                                                    <i className="material-icons left">login</i>
                                                    Login
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="card-action center-align">
                                <Link to="/" className="blue-text">
                                    <i className="material-icons left">arrow_back</i>
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>      
        )
    }
}

export default Login;