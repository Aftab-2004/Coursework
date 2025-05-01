import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Choose extends Component {
    constructor(props) {
        super(props);
        this.state = {
            final: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/electionName')
            .then(response => {
                if (response.data.success) {
                    this.setState({
                        final: response.data.data,
                        loading: false
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching elections:', error);
                this.setState({
                    error: 'Failed to load elections. Please try again later.',
                    loading: false
                });
            });
    }

    render() {
        const { final, loading, error } = this.state;

        if (loading) {
            return (
                <div className="container">
                    <div className="center-align" style={{ marginTop: '2rem' }}>
                        <div className="preloader-wrapper big active">
                            <div className="spinner-layer spinner-blue-only">
                                <div className="circle-clipper left">
                                    <div className="circle"></div>
                                </div>
                                <div className="gap-patch">
                                    <div className="circle"></div>
                                </div>
                                <div className="circle-clipper right">
                                    <div className="circle"></div>
                                </div>
                            </div>
                        </div>
                        <p className="grey-text">Loading elections...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="container">
                    <div className="card-panel red lighten-4" style={{ marginTop: '2rem' }}>
                        <span className="red-text text-darken-4">{error}</span>
                    </div>
                </div>
            );
        }

        const electionList = Array.isArray(final) ? final.map(election => (
            <div className="col s12 m6 l4" key={election.election_id}>
                <div className="card hoverable">
                    <div className="card-content">
                        <span className="card-title">
                            <i className="material-icons left blue-text">ballot</i>
                            {election.election_name}
                        </span>
                        <p className="grey-text">
                            <i className="material-icons tiny">person</i>
                            Organized by: {election.election_organizer}
                        </p>
                    </div>
                    <div className="card-action">
                        <Link 
                            to={"/vote/" + election.election_id}
                            className="waves-effect waves-light btn blue"
                        >
                            <i className="material-icons right">arrow_forward</i>
                            Vote Now
                        </Link>
                    </div>
                </div>
            </div>
        )) : null;

        return (
            <div className="container" style={{ marginTop: '2rem' }}>
                <div className="row">
                    <div className="col s12">
                        <h4 className="header">
                            <i className="material-icons medium blue-text">how_to_vote</i>
                            Active Elections
                        </h4>
                        <p className="grey-text">Select an election to cast your vote</p>
                    </div>
                </div>
                <div className="row">
                    {electionList}
                </div>
            </div>
        );
    }
}

export default Choose;