import React, { Component } from 'react';
import Web3 from 'web3';
import Election from '../../build/Election.json';

class VoteCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            account: '',
            election: null,
            candidates: [],
            loading: true
        };
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ id });
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    async loadWeb3() {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                window.web3 = new Web3(window.ethereum);
            } catch (error) {
                console.error("User denied account access");
            }
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    }

    async loadBlockchainData() {
        try {
            const web3 = window.web3;
            if (!web3) {
                throw new Error("Web3 not initialized");
            }

            const accounts = await web3.eth.getAccounts();
            this.setState({ account: accounts[0] });
    
            const networkId = await web3.eth.net.getId();
            const networkData = Election.networks[networkId];
    
            if (!networkData || !networkData.address) {
                throw new Error('Election contract not deployed to detected network.');
            }
    
            const election = new web3.eth.Contract(Election.abi, networkData.address);
            this.setState({ election });
    
            // Get all candidates using getCandidates function
            const allCandidates = await election.methods.getCandidates().call();
            
            // Filter candidates for this election
            const candidatesForThisElection = allCandidates.filter(
                candidate => candidate.election_id === this.state.id
            );
    
            this.setState({ 
                candidates: candidatesForThisElection, 
                loading: false 
            });
    
        } catch (err) {
            console.error("Error loading blockchain data:", err);
            alert("Failed to load blockchain data. Check console for details.");
            this.setState({ loading: false });
        }
    }

    resetVotes = async () => {
        try {
            this.setState({ loading: true });
            await this.state.election.methods.resetVotes().send({ from: this.state.account });
            await this.loadBlockchainData();
        } catch (err) {
            console.error("Error resetting votes:", err);
            alert("Failed to reset votes. Check console for details.");
            this.setState({ loading: false });
        }
    };

    render() {
        if (this.state.loading) {
            return (
                <div className="container">
                    <p>Loading...</p>
                </div>
            );
        }

        return (
            <div className="container">
                <ul className="collection">
                    <li className="collection-item avatar">
                        <p className="title">Candidates</p>
                    </li>
                    {this.state.candidates.map(candidate => (
                        <div className="contact" key={candidate.id}>
                            <li className="collection-item avatar">
                                <i className="material-icons circle blue darken-2">ballot</i>
                                <p><b>{candidate.name}</b></p>
                                <p>{candidate.details}</p>
                                <p className="secondary-content"><b>{candidate.voteCount}</b></p>
                            </li>
                        </div>
                    ))}
                </ul>

                <div className="center" style={{ marginTop: '20px' }}>
                    <button
                        className="btn red"
                        onClick={this.resetVotes}
                        disabled={this.state.loading}
                    >
                        {this.state.loading ? 'Processing...' : 'Reset All Votes'}
                    </button>
                </div>
            </div>
        );
    }
}

export default VoteCount; 