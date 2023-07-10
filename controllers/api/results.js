const Result = require('../../models/result');

module.exports = {
    create,
};

async function create(req, res) {
    try {
        const result = await Result.create(req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json(err);
    }
}