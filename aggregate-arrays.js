db.friends.aggregate([
    { $group: { _id: { age: '$age' }, allHobbies: { $push: '$hobbies' } } }
]).pretty();

// unwind (flattens the elem from arrays)
db.friends.aggregate([
    { $unwind: '$hobbies' },
    { $group: { _id: { age: '$age' }, allHobbies: { $addToSet: '$hobbies' } } }
]).pretty();