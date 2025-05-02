import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class ElectionData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            final: [],
            id: null,
            isAdmin: localStorage.getItem('isAdmin') === 'true',
            loading: false,
            error: null,
            deletingElection: null
        };
    }

    componentDidMount(){
        this.fetchElections();
    }

    fetchElections = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/electionName');
            this.setState({
                final: response.data,
                error: null
            });
        } catch (err) {
            console.error('Error fetching elections:', err);
            this.setState({
                error: 'Failed to load elections. Please try again.'
            });
        }
    }

    handleInputChange = (e) => {
        var name = e.target.innerHTML;
        var index = 0;
        for(let i = 0; i < this.state.election_name.length; i++){
            if(name === this.state.election_name[i]){
                index = i;
                break;
            }
        }
        var id = this.state.election_id[index];
        this.setState({
            id : id
        })
    };

    handleDelete = async (electionId) => {
        if (!window.confirm('Are you sure you want to delete this election? This will also delete all candidates in this election. This action cannot be undone.')) {
            return;
        }

        this.setState({ 
            deletingElection: electionId,
            error: null 
        });

        try {
            await axios.delete(`http://localhost:8000/api/election/${electionId}`);
            
            // Remove the deleted election from state
            this.setState(prevState => ({
                final: prevState.final.filter(election => election.election_id !== electionId),
                deletingElection: null
            }));
        } catch (err) {
            console.error('Failed to delete election:', err);
            this.setState({ 
                error: 'Failed to delete election. Please try again.',
                deletingElection: null
            });
        }
    };

    render(){
        const { final, isAdmin, deletingElection, error } = this.state;
        
        return(
            <div className="container">
                {error && (
                    <div className="card-panel red lighten-4 red-text text-darken-4" style={{marginTop: '20px'}}>
                        {error}
                    </div>
                )}

                {isAdmin && (
                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Link to="/newelection" className="btn waves-effect waves-light blue">
                            CREATE NEW ELECTION
                            <i className="material-icons right">add</i>
                        </Link>
                    </div>
                )}
                
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Elections</span>
                        <div className="collection">
                            {final.map(election => (
                                <div key={election.election_id} className="collection-item">
                                    <div className="row" style={{ marginBottom: '0' }}>
                                        <div className="col s12 m6">
                                            <i className="material-icons left blue-text">ballot</i>
                                            <span className="title"><b>{election.election_name}</b></span>
                                            <p className="grey-text">Organizer: {election.election_organizer}</p>
                                        </div>
                                        <div className="col s12 m6 right-align">
                                            {isAdmin && (
                                                <>
                                                    <Link 
                                                        to={"/candidates/" + election.election_id}
                                                        className="btn orange darken-2"
                                                        style={{ marginRight: '10px' }}
                                                    >
                                                        MANAGE CANDIDATES
                                                    </Link>
                                                    <button 
                                                        className="btn red"
                                                        onClick={() => this.handleDelete(election.election_id)}
                                                        disabled={deletingElection === election.election_id}
                                                        style={{ marginRight: '10px' }}
                                                    >
                                                        {deletingElection === election.election_id ? 'DELETING...' : 'DELETE'}
                                                    </button>
                                                </>
                                            )}
                                            <Link 
                                                to={"/vote/" + election.election_id}
                                                className="btn green"
                                            >
                                                VOTE
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ElectionData;