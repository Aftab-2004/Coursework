import React, { Component } from 'react';
import Web3 from 'web3';
import Election from '../../build/Election.json';

class NewCandidate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            election: null,
            candidate_name: '',
            candidate_details: '',
            loading: false,
            isAdmin: false
        };
    }

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockChain();
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

    async loadBlockChain() {
        try {
            const web3 = window.web3;
            if (!web3) {
                throw new Error("Web3 not initialized");
            }

            const accounts = await web3.eth.getAccounts();
            this.setState({ account: accounts[0] });
            
            const networkId = await web3.eth.net.getId();
            const networkData = Election.networks[networkId];
            
            if (networkData) {
                const election = new web3.eth.Contract(Election.abi, networkData.address);
                this.setState({ election });
                
                // Check if current account is admin
                const adminAddress = await election.methods.admin().call();
                const isAdmin = accounts[0].toLowerCase() === adminAddress.toLowerCase();
                this.setState({ isAdmin });
                
                if (!isAdmin) {
                    alert("Warning: Current account is not the admin. You won't be able to add candidates.");
                }
            } else {
                window.alert('Election contract not deployed to detected network.');
            }
        } catch (error) {
            console.error('Error loading blockchain data:', error);
            window.alert('Failed to load blockchain data. Check console for details.');
        }
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { election, candidate_name, candidate_details, account } = this.state;
        
        try {
            this.setState({ loading: true });
            await election.methods.addCandidate(
                candidate_name,
                candidate_details,
                this.props.match.params.id
            ).send({ from: account });
            
            this.setState({ loading: false });
            window.location.assign("/elections");
        } catch (error) {
            console.error('Error adding candidate:', error);
            this.setState({ loading: false });
            window.alert('Error adding candidate. Check console for details.');
        }
    };

    render() {
        if (this.state.loading) {
            return <div className="container">Processing...</div>;
        }

        return (
            <div className="container">
                {!this.state.isAdmin && (
                    <div className="card-panel red lighten-4" style={{marginTop: '20px'}}>
                        <span className="red-text text-darken-4">
                            Warning: Current account is not the admin. Switch to admin account to add candidates.
                        </span>
                    </div>
                )}
                <form onSubmit={this.handleSubmit}>
                    <div className="input-field">
                        <input type="text" id="candidate_name" name="candidate_name" onChange={this.handleInputChange} required/>
                        <label htmlFor="candidate_name">Candidate Name</label>
                    </div>
                    <div className="input-field">
                        <input type="text" id="candidate_details" name="candidate_details" onChange={this.handleInputChange} required/>
                        <label htmlFor="candidate_details">Candidate Details</label>
                    </div>
                    <button 
                        className="btn blue darken-2" 
                        type="submit" 
                        name="action"
                        disabled={this.state.loading || !this.state.isAdmin}
                    >
                        {this.state.loading ? 'Adding...' : 'Submit'}
                        <i className="material-icons right">send</i>
                    </button>
                </form>
            </div>
        );
    }
}

export default NewCandidate; 