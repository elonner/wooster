const Result = require("../../models/result");

module.exports = {
  create,
  latest,
  average,
  detail,
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
    const result = await Result.findOne({ user: req.params.userId }, null, {
      sort: { createdAt: -1 },
    });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

async function detail(req, res) {
  try {
    const result = await Result.findOne({ _id: req.params.id });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

async function average(req, res) {
  try {
    const results = await Result.find({});
    const scoreArr = results.map((r) => r.scores);
    const totScores = [0, 0, 0, 0, 0];
    scoreArr.forEach((scoreSet) => {
      getValues(scoreSet).forEach((s, i) => {
        totScores[i] += s;
      });
    });
    const sum = totScores.reduce((acc, curr) => acc + curr, 0);
    const averageScores = totScores.map((n) => n / sum);
    const average = {
      "Low Brow": averageScores[0],
      Coincidental: averageScores[1],
      Critique: averageScores[2],
      Witty: averageScores[3],
      Alternative: averageScores[4],
    };
    res.json(average);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

// ===================== HELPERS =============================

function getValues(obj) {
  const vals = [];
  vals.push(obj["Low Brow"]);
  vals.push(obj["Coincidental"]);
  vals.push(obj["Critique"]);
  vals.push(obj["Witty"]);
  vals.push(obj["Alternative"]);
  return vals;
}
