const cors = require("cors");
const express = require("express");
const mongoClient = require("mongodb").MongoClient;

const conString = "mongodb://127.0.0.1:27017";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/jobs", (req, res) => {
    mongoClient.connect(conString)
        .then(clientObject => {
            var database = clientObject.db("jobsync");
            database.collection("jobs")
                .find({})
                .toArray()
                .then(documents => {
                    res.send(documents);
                });
        });
});

app.get("/jobs/:id", (req, res) => {

    var id = parseInt(req.params.id);

    mongoClient.connect(conString)
        .then(clientObject => {
            var database = clientObject.db("jobsync");
            database.collection("jobs")
                .findOne({ job_id: id })
                .then(document => {
                    res.send(document);
                });
        });
});

app.post("/createjob", (req, res) => {
    var job = {
        job_id: parseInt(req.body.job_id),
        title: req.body.title,
        description: req.body.description,
        skillsRequired: req.body.skillsRequired.split(","),
        employer: req.body.employer,
        location: req.body.location,
        jobType: req.body.jobType,
        salaryRange: parseInt(req.body.salaryRange),
        applicantsCount: parseInt(req.body.applicantsCount)
    };
    mongoClient.connect(conString)
        .then(clientObject => {
            var database = clientObject.db("jobsync");
            database.collection("jobs")
                .insertOne(job)
                .then(() => {
                    console.log("Job inserted");
                    res.end();
                });
        });
});

app.put("/editjob/:id", (req, res) => {

    var id = parseInt(req.params.id);

    var job = {
        job_id: parseInt(req.body.job_id),
        title: req.body.title,
        description: req.body.description,
        skillsRequired: req.body.skillsRequired.split(","),
        employer: req.body.employer,
        location: req.body.location,
        jobType: req.body.jobType,
        salaryRange: parseInt(req.body.salaryRange),
        applicantsCount: parseInt(req.body.applicantsCount)
    };
    mongoClient.connect(conString)
        .then(clientObject => {
            var database = clientObject.db("jobsync");
            database.collection("jobs")
                .updateOne({ job_id: id }, { $set: job })
                .then(() => {
                    console.log("Job updated");
                    res.end();
                });
        });
});

app.delete("/deletejob/:id", (req, res) => {

    var id = parseInt(req.params.id);

    mongoClient.connect(conString)
        .then(clientObject => {
            var database = clientObject.db("jobsync");
            database.collection("jobs")
                .deleteOne({ job_id: id })
                .then(() => {
                    console.log("Job Deleted");
                    res.send();
                });
        });
});

app.listen(4000);
console.log("Server Started at http://127.0.0.1:4000");