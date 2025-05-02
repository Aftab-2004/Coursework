import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

class Navbar extends Component {
    state = {
        location: "",
        isAdmin: false
    }

    componentDidMount() {
        this.setState({
            isAdmin: localStorage.getItem('isAdmin') === 'true'
        });
    }

    componentWillReceiveProps() {
        this.setState({
            location: this.props.history.location.pathname
        });
    }

    handleLogout = () => {
        localStorage.removeItem('isAdmin');
        window.location.assign('/');
    }

    render() {
        const { location, isAdmin } = this.state;
        const isBasicNav = location === "/" || location === "/vote" || location === "/login";

        return (
            <nav className="nav-wrapper blue darken-3">
                <div className="container">
                    <NavLink to="/" className="brand-logo">E-Voting DApp</NavLink>
                    {!isBasicNav && (
                        <ul className="right">
                            <li><NavLink to="/elections">Elections</NavLink></li>
                            {isAdmin && (
                                <>
                                    <li><NavLink to="/newelection">New Election</NavLink></li>
                                    <li><a href="#!" onClick={this.handleLogout}>Logout</a></li>
                                </>
                            )}
                        </ul>
                    )}
                </div>
            </nav>
        );
    }
}

export default withRouter(Navbar);