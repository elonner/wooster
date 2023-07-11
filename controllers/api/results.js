const Result = require('../../models/result');

module.exports = {
    create,
    latest
};

async function create(req, res) {
    try {
        const result = await Result.create(req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function latest(req, res) {
    try {
        const result = await Result.findOne({ user: req.params.userId }, null, { sort: { createdAt: -1 } });
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}