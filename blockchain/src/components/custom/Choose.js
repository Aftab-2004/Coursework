import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Choose extends Component {
    constructor(props) {
        super(props);
        this.state = {
            final: []
        };
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/electionName')
            .then(response => {
                if (response.data.success) {
                    this.setState({
                        final: response.data.data
                    });
                }
        })
            .catch(error => {
                console.error('Error fetching elections:', error);
            });
    }

    render() {
        const electionList = Array.isArray(this.state.final) ? this.state.final.map(election => {
            return (
                <div className="contact" key={election.election_id}>
                    <li className="collection-item avatar">
                        <i className="material-icons circle blue darken-2">ballot</i>
                        <Link to={"/vote/" + election.election_id} className="title">{election.election_name}</Link>
                    </li>
                </div>
            );
        }) : null;

        return (
            <div className="container">
                <ul className="collection">
                    <li className="collection-item avatar">
                        <h3>Elections</h3>
                    </li>
                        {electionList}
                </ul>
            </div>
        );
    }
}

export default Choose;