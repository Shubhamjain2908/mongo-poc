conn = new Mongo();
db = conn.getDB("credit");

for (let i = 0; i < 1000000; i++) {
    db.ratings.insertOne({
        "person_id": i + 1,
        "score": Math.random() * 100,
        "age": Math.floor(Math.random() * 70) + 18
    })
}
// 22.6912159,75.8506695    - Suparshwanth
// 22.6938894,75.8479528    - Annapurna police station
// 22.6953756,75.8364984    - Unique hospital
// 22.6935544,75.8363911    - Axis bank
// 22.6935544,75.8363911    - Urban rasoi
// 22.6939621,75.8266356    - Dominos