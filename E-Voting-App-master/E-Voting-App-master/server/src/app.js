const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const expressValidator = require('express-validator');
const electionName = require('./models/electionName');
const admin = require('./models/admin');
const candidate = require('./models/candidate');
const md5 = require('md5');
require('./db/mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.get('/', function(req, res) {
    res.json('Works!');
});

app.get('/api/electionName', function(req, res) {
    var electionNames = []
    var electionOrganizers = []
    var electionIds = []
    var final = []
    electionName.find({}).then(eachOne => {
        for (i = 0; i < eachOne.length; i++){
            electionNames[i] = eachOne[i].election_name ;
            electionOrganizers[i] = eachOne[i].election_organizer;
            electionIds[i] = eachOne[i].election_id;
            final.push({
                'election_id': eachOne[i].election_id,
                'election_organizer': eachOne[i].election_organizer,
                'election_name': eachOne[i].election_name
            })
        }
        res.send(final);
    })
    .catch(error => {
        console.error('Error fetching elections:', error);
        res.status(500).json({ error: 'Failed to fetch elections' });
    });
})

app.post('/api/electionName', async function(req, res) {
    try {
        const election = await electionName.create({
            election_id: Math.floor(Math.random() * 100000), // Increased range to avoid collisions
            election_name: req.body.election_name,
            election_organizer: req.body.election_organizer,
            election_password: md5(req.body.election_password),
        });
        res.json(election);
    } catch (error) {
        console.error('Error creating election:', error);
        res.status(500).json({ error: 'Failed to create election' });
    }
});

// Delete election and its candidates
app.delete('/api/election/:id', async function(req, res) {
    try {
        // First delete all candidates for this election
        await candidate.deleteMany({ election_id: req.params.id });
        
        // Then delete the election
        const result = await electionName.findOneAndDelete({ election_id: req.params.id });
        
        if (!result) {
            return res.status(404).json({ error: 'Election not found' });
        }
        
        res.json({ message: 'Election and its candidates deleted successfully' });
    } catch (error) {
        console.error('Error deleting election:', error);
        res.status(500).json({ error: 'Failed to delete election' });
    }
});

app.post('/api/adminLogin', async function(req, res) {
    try {
        const election = await admin.findOne({
            username: req.body.username,
            password: md5(req.body.password),
        });
        res.send(election !== null);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// New Candidate Routes
app.post('/api/candidate', async function(req, res) {
    try {
        const newCandidate = await candidate.create({
            candidate_id: Math.floor(Math.random() * 10000),
            election_id: req.body.election_id,
            name: req.body.name,
            details: req.body.details,
            voteCount: 0
        });
        res.json(newCandidate);
    } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ error: 'Failed to create candidate' });
    }
});

app.get('/api/candidates/:electionId', async function(req, res) {
    try {
        const candidates = await candidate.find({ election_id: req.params.electionId });
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
});

app.delete('/api/candidate/:id', async function(req, res) {
    try {
        const result = await candidate.findOneAndDelete({ candidate_id: req.params.id });
        if (!result) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json({ message: 'Candidate removed successfully' });
    } catch (error) {
        console.error('Error removing candidate:', error);
        res.status(500).json({ error: 'Failed to remove candidate' });
    }
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log("Server is up on port " + port);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});