import React, { Component } from 'react';
import axios from 'axios';

class NewElection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            election_name: '',
            election_organizer: '',
            election_password: '',
            error: null,
            success: null
        };
    }

    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
            error: null
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { election_name, election_organizer, election_password } = this.state;
        
        this.setState({ loading: true });
        
        axios.post('http://localhost:8000/api/electionName', {
            election_name: election_name,
            election_organizer: election_organizer,
            election_password: election_password
        })
        .then(response => { 
            this.setState({ success: 'Election created successfully!' });
            setTimeout(() => window.location.assign('/'), 1500);
        })
        .catch(err => {
            console.error(err);
            this.setState({ 
                error: 'Failed to create election. Please try again.',
                loading: false
            });
        });
    }

    render() {
        const { error, success, loading } = this.state;
        return (
            <div className="container">
                <div className="card">
                    <div className="card-content">
                        <h4>Create New Election</h4>
                        {error && <div className="red-text">{error}</div>}
                        {success && <div className="green-text">{success}</div>}
                        <form onSubmit={this.handleSubmit}>
                            <div className="input-field">
                                <input
                                    type="text"
                                    id="election_name"
                                    name="election_name"
                                    onChange={this.handleInputChange}
                                    required
                                />
                                <label htmlFor="election_name">Election Name</label>
                            </div>
                            <div className="input-field">
                                <input
                                    type="text"
                                    id="election_organizer"
                                    name="election_organizer"
                                    onChange={this.handleInputChange}
                                    required
                                />
                                <label htmlFor="election_organizer">Election Organizer</label>
                            </div>
                            <div className="input-field">
                                <input
                                    type="password"
                                    id="election_password"
                                    name="election_password"
                                    onChange={this.handleInputChange}
                                    required
                                />
                                <label htmlFor="election_password">Election Password</label>
                            </div>
                            <button 
                                className="btn waves-effect waves-light" 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Election'}
                                <i className="material-icons right">send</i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewElection;