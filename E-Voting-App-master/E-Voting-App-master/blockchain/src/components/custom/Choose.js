import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Choose extends Component {
    componentDidMount() {
        // Clear any existing admin status when choosing user type
        localStorage.removeItem('isAdmin');
    }

    render() {
        return (
            <div className="container">
                <div className="row" style={{ marginTop: '50px' }}>
                    <div className="col s12">
                        <h3 className="center-align">Choose User Type</h3>
                    </div>
                    <div className="col s12 m6">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">User</span>
                                <p>Vote in elections and view results</p>
                            </div>
                            <div className="card-action">
                                <Link to="/elections" className="btn waves-effect waves-light blue darken-2">
                                    Continue
                                    <i className="material-icons right">arrow_forward</i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col s12 m6">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">Admin</span>
                                <p>Create and manage elections</p>
                            </div>
                            <div className="card-action">
                                <Link to="/login" className="btn waves-effect waves-light blue darken-2">
                                    Continue
                                    <i className="material-icons right">arrow_forward</i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Choose;