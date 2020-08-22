db.friends.aggregate([
    { $group: { _id: { age: '$age' }, allHobbies: { $push: '$hobbies' } } }
]).pretty();

// unwind (flattens the elem from arrays)
db.friends.aggregate([
    { $unwind: '$hobbies' },
    { $group: { _id: { age: '$age' }, allHobbies: { $addToSet: '$hobbies' } } }
]).pretty();

// using projection with the arrays
db.friends.aggregate([
    {
        $project: {
            _id: 0,
            examScore: {
                $slice: ['$examScores', 1]
            }
        }
    }
]).pretty();

// length of the arrays
db.friends.aggregate([
    {
        $project: {
            _id: 0,
            numScores: {
                $size: '$examScores'
            }
        }
    }
]).pretty();

// $filter (input: array which needs to be filtered) // all elrm in sc > 60
db.friends.aggregate([
    {
        $project: {
            _id: 0,
            examScores: {
                $filter: {
                    input: '$examScores',
                    as: 'sc',
                    cond: { $gt: ['$$sc.score', 60] }
                }
            }
        }
    }
]).pretty();

// get highest elem from array
db.friends.aggregate([
    { $unwind: '$examScores' },
    { $project: { _id: 0, name: 1, age: 1, score: "$examScores.score" } },
    { $sort: { score: -1 } }
]).pretty();