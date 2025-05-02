const mongoose = require('mongoose')

const candidate = mongoose.model('candidates', {
    candidate_id: {
        type: Number,
        required: true
    },
    election_id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    voteCount: {
        type: Number,
        default: 0
    }
});

module.exports = candidate; 