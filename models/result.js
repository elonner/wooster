const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoresSchema = new Schema({
    'Low Brow': Number,
    'Coincidental': Number,
    'Critique': Number,
    'Witty': Number,
    'Alternative': Number,
});

const resultSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true},
    testVersion: {type: Number, required: true},
    isPublic: {type: Boolean, required: true},
    answers: {type: [Number], required: true},
    funName: String,
    code: String,
    scores: scoresSchema,
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

module.exports = mongoose.model('Result', resultSchema);