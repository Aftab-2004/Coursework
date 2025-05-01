import React, { Component } from 'react';
import Web3 from 'web3';
import Election from '../../build/Election.json'
import { Link } from 'react-router-dom'

class Vote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            account: '',
            election: null,
            candCount: 0,
            candidates: [],
            loading: true,
            selectedId: null,
            error: null,
            voted: false
        }
    }

    async componentWillMount() {
        try {
            await this.loadWeb3()
            await this.loadBlockchainData()
        } catch (error) {
            this.setState({ 
                error: 'Failed to connect to blockchain. Please make sure MetaMask is installed and connected.',
                loading: false 
            });
        }
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
            throw new Error('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Election.networks[networkId]
        
        if(networkData) {
            const election = new web3.eth.Contract(Election.abi, networkData.address)
            this.setState({ election })
            const candCount = await election.methods.candidatesCount().call()
            this.setState({ candCount })
            
            const candidates = [];
            for (var i = 1; i <= candCount; i++) {
                const candidate = await election.methods.candidates(i).call()
                if(candidate.election_id === this.state.id){
                    candidates.push(candidate);
                }
            }
            
            this.setState({
                candidates,
                loading: false
            });
        } else {
            throw new Error('Election contract not deployed to detected network.')
        }
    }

    handleVote = async (id) => {
        try {
            this.setState({ loading: true, selectedId: id });
            await this.state.election.methods.vote(id).send({ from: this.state.account });
            this.setState({ 
                loading: false,
                voted: true
            });
            setTimeout(() => {
                window.location.assign("/");
            }, 2000);
        } catch (error) {
            this.setState({ 
                loading: false,
                error: 'Failed to cast vote. Please try again.'
            });
        }
    }

    componentDidMount(){
        let id = this.props.match.params.id;
        this.setState({ id });
    }

    render(){
        const { candidates, loading, error, voted } = this.state;

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
                        <p className="grey-text">Loading candidates...</p>
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

        if (voted) {
            return (
                <div className="container">
                    <div className="card-panel green lighten-4" style={{ marginTop: '2rem' }}>
                        <span className="green-text text-darken-4">
                            <i className="material-icons left">check_circle</i>
                            Vote cast successfully! Redirecting...
                        </span>
                    </div>
                </div>
            );
        }

        const candidateList = candidates.map(candidate => (
            <div className="col s12 m6 l4" key={candidate.id}>
                <div className="card hoverable">
                    <div className="card-content">
                        <span className="card-title">
                            <i className="material-icons left blue-text">person</i>
                            {candidate.name}
                        </span>
                        <p className="grey-text">{candidate.details}</p>
                    </div>
                    <div className="card-action">
                        <button 
                            onClick={() => this.handleVote(candidate.id)}
                            className="waves-effect waves-light btn blue"
                            disabled={this.state.loading}
                        >
                            <i className="material-icons right">how_to_vote</i>
                            Vote
                        </button>
                    </div>
                </div>
            </div>
        ));

        return(
            <div className="container" style={{ marginTop: '2rem' }}>
                <div className="row">
                    <div className="col s12">
                        <h4 className="header">
                            <i className="material-icons medium blue-text">how_to_vote</i>
                            Cast Your Vote
                        </h4>
                        <p className="grey-text">Select a candidate to cast your vote</p>
                    </div>
                </div>
                <div className="row">
                    {candidateList}
                </div>
            </div>
        );
    }
}

export default Vote;