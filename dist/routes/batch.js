"use strict";
/**Navpreet Kaur */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const route = express_1.Router();
route.get('/', (req, res) => {
    db_1.Batches.findAll({
        attributes: ['id', 'name']
    }).then((batches) => {
        res.status(200).send(batches);
    }).catch((err) => {
        res.status(500).send({
            error: 'Could not retrieve batches.'
        });
    });
});
route.post('/', (req, res) => {
    if (!req.body.name) {
        res.send({
            error: 'Please enter the name in body'
        });
    }
    else {
        db_1.Courses.findOne({
            where: {
                id: req.body.courseId
            },
            attributes: ['id', 'name']
        }).then((course) => {
            if (!course) {
                res.status(404).send({
                    error: 'Could not find course  '
                });
            }
            else {
                db_1.Batches.create({
                    name: req.body.name
                }).then((batch) => {
                    batch.setCourse(course, { save: false });
                    batch.save();
                    res.send(batch);
                }).catch((err) => {
                    res.send({
                        error: 'Error while creating batch'
                    });
                });
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not find course'
            });
        });
    }
});
route.get('/:id', (req, res) => {
    db_1.Batches.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((batch) => {
        if (batch === null) {
            return res.status(404).send({
                error: 'Error in finding batch. Batch doesnt exist..'
            });
        }
        else {
            res.send(batch);
        }
    });
});
route.post('/students', (req, res) => {
    let studentId = parseInt(req.body.studentId);
    let batchId = parseInt(req.body.batchId);
    if (!studentId || !batchId) {
        return res.status(404).send({
            error: 'Error in finding batch and student id'
        });
    }
    else {
        db_1.Batches.findOne({
            where: {
                id: batchId
            },
        }).then((batch) => {
            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batch. '
                });
            }
            else {
                db_1.Students.findOne({
                    where: {
                        id: studentId
                    },
                }).then((student) => {
                    if (student === null) {
                        return res.status(404).send({
                            error: 'Error in finding student...'
                        });
                    }
                    else {
                        db_1.Student_Batches.create({
                            studentId: studentId,
                            batchId: batchId
                        })
                            .then((studentBatch) => {
                            res.send(studentBatch);
                        }).catch((err) => {
                            res.send({
                                error: 'Error while creating studentBatch'
                            });
                        });
                    }
                });
            }
        });
    }
});
route.put('/', (req, res) => {
    let batchId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    }
    else if (!batchId) {
        res.status(500).send({
            error: 'Could not find batch because batchId is not valid'
        });
    }
    else {
        db_1.Batches.findOne({
            where: {
                id: batchId
            },
            attributes: ['id', 'name', 'courseId']
        }).then((batch) => {
            if (!batch) {
                res.status(404).send({
                    error: 'Could not find batch with id: ' + batchId
                });
            }
            else {
                batch.set('name', name);
                batch.save();
                res.status(200).send(batch);
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve batch'
            });
        });
    }
});
exports.default = route;
