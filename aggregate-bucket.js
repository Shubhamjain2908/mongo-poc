// $bucket: output your data in buckets from which we can calculate some statistics
db.persons.aggregate([
    {
        $bucket: {
            groupBy: '$dob.age',
            boundaries: [18, 30, 40, 50, 60, 120],
            output: {
                numPersons: { $sum: 1 },
                averageAge: { $avg: '$dob.age' }
            }
        }
    }
]).pretty();

// bucketAuto: automatically creates the buckets
db.persons.aggregate([
    {
        $bucketAuto: {
            groupBy: '$dob.age',
            buckets: 5,
            output: {
                numPersons: { $sum: 1 },
                averageAge: { $avg: '$dob.age' }
            }
        }
    }
]).pretty();