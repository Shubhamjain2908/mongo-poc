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