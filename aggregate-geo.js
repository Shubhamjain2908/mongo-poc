// creating index
db.transformedPersons.createIndex({ location: "2dsphere" });

db.transformedPersons.aggregate([
    {
        $geoNear: {
            near: {
                type: 'Point',
                coordinates: [34.1689, 4.6625]
            },
            maxDistance: 10000,
            query: { age: { $gt: 30 } },
            distanceField: 'distance'
        }
    }
]).pretty();