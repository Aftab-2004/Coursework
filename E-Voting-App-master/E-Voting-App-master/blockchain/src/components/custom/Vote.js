import React, { Component } from 'react';
import Web3 from 'web3';
import Election from '../../build/Election.json';
import axios from 'axios';

class Vote extends Component {
    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }
    
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            this.setState({ error: 'Non-Ethereum browser detected. You should consider trying MetaMask!' })
        }
    }

    async loadBlockchainData() {
        try {
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            this.setState({ account: accounts[0] });
            
            const networkId = await web3.eth.net.getId();
            const networkData = Election.networks[networkId];
            
            if(networkData) {
                const election = new web3.eth.Contract(Election.abi, networkData.address);
                this.setState({ election });
                
                // Get election ID from URL
                const election_id = parseInt(this.props.match.params.id, 10);
                
                // Fetch candidates from database
                const dbResponse = await axios.get(`http://localhost:8000/api/candidates/${election_id}`);
                const dbCandidates = dbResponse.data;
                
                // Get blockchain candidates
                const blockchainCandidates = await election.methods.getCandidates().call();
                
                // Merge data (prefer blockchain data for vote counts, but only show candidates that exist in DB)
                const mergedCandidates = dbCandidates.map(dbCandidate => {
                    const blockchainCandidate = blockchainCandidates.find(
                        bc => bc.name === dbCandidate.name && parseInt(bc.election_id) === election_id
                    );
                    return {
                        ...dbCandidate,
                        voteCount: blockchainCandidate ? blockchainCandidate.voteCount : 0,
                        id: blockchainCandidate ? blockchainCandidate.id : null
                    };
                });

                this.setState({ 
                    candidates: mergedCandidates,
                    loading: false 
                });
            } else {
                this.setState({ 
                    error: 'Election contract not deployed to detected network.',
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.setState({ 
                error: 'Failed to load candidates. Please check your connection.',
                loading: false
            });
        }
    }

    handleVote = async (candidateId) => {
        try {
            this.setState({ voting: candidateId, error: null });
            await this.state.election.methods.vote(candidateId)
                .send({ from: this.state.account });
            
            this.setState({ 
                success: 'Vote cast successfully!',
                voting: null
            });
            
            // Refresh the candidates list to show updated vote count
            await this.loadBlockchainData();
        } catch (error) {
            console.error('Error voting:', error);
            this.setState({ 
                error: 'Failed to cast vote. Please try again.',
                voting: null
            });
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            election: null,
            candidates: [],
            loading: true,
            error: null,
            success: null,
            voting: null
        }
    }

    render() {
        const { loading, error, success, voting, candidates } = this.state;
        
        return (
            <div className="container">
                <h4>Cast Your Vote</h4>
                
                {loading && (
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                )}

                {error && <div className="card-panel red lighten-4">{error}</div>}
                {success && <div className="card-panel green lighten-4">{success}</div>}

                {!loading && !error && candidates.length === 0 && (
                    <div className="card-panel yellow lighten-4">
                        No candidates available for this election yet.
                    </div>
                )}

                {!loading && !error && candidates.length > 0 && (
                    <div className="row">
                        {candidates.map((candidate) => (
                            <div key={candidate.candidate_id} className="col s12 m6 l4">
                                <div className="card">
                                    <div className="card-content">
                                        <span className="card-title">{candidate.name}</span>
                                        <p>{candidate.details}</p>
                                        <p>Votes: {candidate.voteCount}</p>
                                    </div>
                                    <div className="card-action">
                                        <button 
                                            className="btn waves-effect waves-light"
                                            onClick={() => this.handleVote(candidate.id)}
                                            disabled={voting !== null || candidate.id === null}
                                        >
                                            {voting === candidate.id ? 'Voting...' : 'Vote'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }
}

export default Vote;