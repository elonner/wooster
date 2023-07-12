const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const survey = require('../survey.json')

const resultSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    testVersion: { type: Number, required: true },
    isPublic: { type: Boolean, required: true },
    answers: { type: [Number], required: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

// [low brow,  coincidental, critique, witty, alternative]
resultSchema.virtual('scores').get(function () {
    const secOneTot = [0, 0, 0, 0, 0];
    const secTwoTot = [0, 0, 0, 0, 0];
    const secThreeTot = [0, 0, 0, 0, 0];
    survey.sectionOne.forEach(q => {
        const ratings = getValues(q.rating);  
        let scalar = 0;
        switch (this.answers[q.index]) {
            case 1:     // hate
                scalar = -1.5;
                break;
            case 2:     // dislike
                scalar = -1;
                break;
            case 3:     // like
                scalar = 1;
                break;
            case 4:     // love
                scalar = 1.5;
                break;
            default:
                break;
        }
        ratings.forEach((r, i) => {
            secOneTot[i] += r * scalar;
        });
    });
    survey.sectionTwo.forEach(q => {
        const ratings = getValues(q.rating);
        const scalar = this.answers[q.index] > 5 ?
            (this.answers[q.index] - 5) / 2
            :
            (this.answers[q.index] - 6) / 2;
        ratings.forEach((r, i) => {
            secTwoTot[i] += r * scalar;
        });
    });
    survey.sectionThree.forEach(q => {
        getValues(q.responses[this.answers[q.index]].rating).forEach((r, i) => {
            secThreeTot[i] += r;
        });
    });
    const totalResult = sumResults([secOneTot, secTwoTot, secThreeTot]);
    return {
        'Low Brow': totalResult[0],
        'Coincidental': totalResult[1],
        'Critique': totalResult[2],
        'Witty': totalResult[3],
        'Alternative': totalResult[4]
    };
});

resultSchema.virtual('code').get(function () {
    const codes = {
        'Low Brow': 'A',
        'Coincidental': 'B',
        'Critique': 'C',
        'Witty': 'D',
        'Alternative': 'E'
    };
    const sorted = Object.entries(this.scores).sort((a, b) => b[1] - a[1]);
    let code = '';
    if (sorted[0][1] >= 2*sorted[1][1]) {
        code = codes[sorted[0][0]]
    } else if (sorted[0][1] >= 1.5*sorted[2][1] && sorted[1][1] > 1.5*sorted[2][1]) {
        code = codes[sorted[0][0]] + codes[sorted[1][0]];
    } else {
        code = codes[sorted[0][0]] + codes[sorted[1][0]] + codes[sorted[2][0]];
    }
    return code;
});

resultSchema.virtual('funName').get(function () {
    return;
});

function sumResults(secTots) {
    const total = [0, 0, 0, 0, 0];
    secTots.forEach(t => {
        const normalized = normalizeData(t);
        normalized.forEach((n, i) => {
            total[i] += n;
        }); 
    });
    const sum = total.reduce((acc, curr) => acc + curr, 0); 
    const sumResults = total.map(n => n / sum);
    return sumResults;
}

function normalizeData(secTot) {
    const min = Math.min(...secTot);
    secTot = secTot.map(n => n - min);
    const sum = secTot.reduce((acc, curr) => acc + curr, 0); 
    if (sum > 0) secTot = secTot.map(n => n / sum);
    return secTot;
}

// returns array of score object values FROM survey.json!! ensuring correct order
function getValues(obj) {
    const vals = [];
    vals.push(obj['LowBrow']);
    vals.push(obj['Coincidental']);
    vals.push(obj['Critique']);
    vals.push(obj['Witty']);
    vals.push(obj['Alternative']);
    return vals;
}

module.exports = mongoose.model('Result', resultSchema);