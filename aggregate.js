db.persons.aggregate([
    { $match: { gender: 'female' } },
    { $group: { _id: { state: '$location.state' }, totalPersons: { $sum: 1 } } },
    { $sort: { totalPersons: -1 } }
]).pretty()


// Capitalize the first & last name
db.persons.aggregate([
    {
        $project: {
            _id: 0,
            gender: 1,
            fullName: {
                $concat: [
                    { $toUpper: { $substrCP: ['$name.first', 0, 1] } },
                    {
                        $substrCP: [
                            '$name.first',
                            1,
                            {
                                $subtract: [
                                    {
                                        $strLenCP: '$name.first'
                                    },
                                    1
                                ]
                            }]
                    },
                    ' ',
                    { $toUpper: { $substrCP: ['$name.last', 0, 1] } },
                    {
                        $substrCP: [
                            '$name.last',
                            1,
                            {
                                $subtract: [
                                    {
                                        $strLenCP: '$name.last'
                                    },
                                    1
                                ]
                            }]
                    },
                ]
            }
        }
    }
])

// Turning the location into geoJSON object & formating birthdate
db.persons.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            email: 1,
            birthdate: {
                $toDate: '$dob.date'
            },
            age: '$dob.age',
            location: {
                type: 'Point', coordinates: [
                    {
                        $convert: {
                            input: '$location.coordinates.longitude',
                            to: 'double',
                            onError: 0.00,
                            onNull: 0.00
                        }
                    },
                    {
                        $convert: {
                            input: '$location.coordinates.latitude',
                            to: 'double',
                            onError: 0.00,
                            onNull: 0.00
                        }
                    }
                ]
            }
        }
    },
    {
        $project: {
            gender: 1,
            email: 1,
            location: 1,
            birthdate: 1,
            age: 1,
            fullName: {
                $concat: [
                    { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
                    {
                        $substrCP: [
                            "$name.first",
                            1,
                            {
                                $subtract: [
                                    {
                                        $strLenCP: "$name.first"
                                    },
                                    1
                                ]
                            }]
                    },
                    " ",
                    { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
                    {
                        $substrCP: [
                            "$name.last",
                            1,
                            {
                                $subtract: [
                                    {
                                        $strLenCP: "$name.last"
                                    },
                                    1
                                ]
                            }]
                    },
                ]
            }
        }
    },
    {
        $group: {
            _id: { birthYear: { $isoWeekYear: '$birthdate' } }, numPersons: { $sum: 1 }
        }
    },
    {
        $sort: { numPersons: -1 }
    }
]).pretty()

// additional stages
db.persons.aggregate([
    {
        $project: {
            _id: 0,
            name: { $concat: ["$name.first", " ", "$name.last"] },
            birthdate: { $toDate: '$dob.date' }
        }
    },
    { $sort: { birthdate: 1 } },
    { $skip: 10 },
    { $limit: 10 }
]).pretty();

// writing pipeline result into another collections
db.persons.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            email: 1,
            birthdate: {
                $toDate: '$dob.date'
            },
            age: '$dob.age',
            location: {
                type: 'Point', coordinates: [
                    {
                        $convert: {
                            input: '$location.coordinates.longitude',
                            to: 'double',
                            onError: 0.00,
                            onNull: 0.00
                        }
                    },
                    {
                        $convert: {
                            input: '$location.coordinates.latitude',
                            to: 'double',
                            onError: 0.00,
                            onNull: 0.00
                        }
                    }
                ]
            }
        }
    },
    {
        $project: {
            gender: 1,
            email: 1,
            location: 1,
            birthdate: 1,
            age: 1,
            fullName: {
                $concat: [
                    { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
                    {
                        $substrCP: [
                            "$name.first", 1, {
                                $subtract: [{ $strLenCP: "$name.first" }, 1]
                            }]
                    },
                    " ",
                    { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
                    {
                        $substrCP: [
                            "$name.last", 1, {
                                $subtract: [{ $strLenCP: "$name.last" }, 1]
                            }]
                    },
                ]
            }
        }
    },
    { $out: 'transformedPersons' }
]).pretty()