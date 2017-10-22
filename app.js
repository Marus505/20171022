var Couchbase = require("couchbase");
var Express = require("express");
var BodyParser = require("body-parser");
var UUID = require("uuid");
var Cors = require("cors");

var app = Express();
var N1qlQuery = Couchbase.N1qlQuery;

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true}));
app.use(Cors());

var cluster = new Couchbase.Cluster("couchbase://localhost:8091");
var bucket = cluster.openBucket("default", "");

app.get("/consoles", (request, response) => {
    var statement = "SELECT `" + bucket._name + "`.*, META().id FROM `" + bucket._name + "` WHERE type = 'console'";
    var query = N1qlQuery.fromString(statement);
    query.consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    bucket.query(query, (error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.post("/console", (request, response) => {
    if(!request.body.title) {        
        return response.status(401).send({ "message": "A `title` is required." });
    }

    var id = UUID.v4();
    request.body.type = "console";
    bucket.insert(id, request.body, (error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.post("/game", (request, response) => {
    if(!request.body.title) {
        return response.status(401).send({ "message": "A `title` is required." });
    } else if(!request.body.cid) {
        return response.status(401).send({ "message": "A `cid` is required." });
    }

    var id = UUID.v4();
    request.body.type = "game";
    bucket.insert(id, request.body, (error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/games", (request, response) => {
    var statement = "SELECT game.title AS game_title, console.title AS console_title FROM `" + bucket._name + "` AS game JOIN `" + bucket._name + "` AS console ON KEYS game.cid WHERE game.type = 'game'";
    var query = N1qlQuery.fromString(statement);
    query.consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    bucket.query(query, (error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/game/:id", (request, response) => {
    if (!request.params.id) {
        return response.status(401).send({ "message": "An `id` is required."});
    }
    var statement = "SELECT game.title AS game_title, console.title AS console_title FROM `" + bucket._name + "` AS game JOIN `" + bucket._name + "` AS console ON KEYS game.cid WHERE game.type = 'game' AND META(game).id = $id";
    var query = N1qlQuery.fromString(statement);
    bucket.query(query, { "id": request.params.id }, (error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

var server = app.listen(3000, () => {
    console.log("Listening on port " + server.address().port + "...");
});