import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'

class Navbar extends Component {
    state = {
        location: ""
    }

    static getDerivedStateFromProps(props) {
        return {
            location: props.history.location.pathname
        }
    }

    render() {
        const { location } = this.state;
        const isHomePage = location === "/" || location === "/choose" || location === "/vote" || location === "/login";

        return (
            <nav className="nav-wrapper black darken-2">
                <div className="container">
                    <NavLink to="/" className="brand-logo">
                        E-Election
                    </NavLink>
                    {!isHomePage && (
                        <ul className="right">
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/newelection">New Election</NavLink></li>
                            <li><NavLink to="/elections">Elections</NavLink></li>
                        </ul>
                    )}
                </div>
            </nav>
        )
    }
}

export default withRouter(Navbar) 