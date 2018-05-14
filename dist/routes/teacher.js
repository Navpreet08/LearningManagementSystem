"use strict";
/**Navpreet Kaur */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const route = express_1.Router();
route.get('/', (req, res) => {
    db_1.Teachers.findAll({
        attributes: ['id', 'name']
    }).then((teachers) => {
        res.status(200).send(teachers);
    }).catch((err) => {
        res.status(500).send({
            error: 'Could not retrieve teachers.'
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
        db_1.Subjects.findOne({
            where: {
                id: req.body.subjectId
            },
            attributes: ['id', 'name']
        }).then((subject) => {
            if (!subject) {
                res.status(404).send({
                    error: 'Could not find subject  '
                });
            }
            else {
                db_1.Teachers.create({
                    name: req.body.name
                }).then((teacher) => {
                    teacher.setSubject(subject, { save: false });
                    teacher.save();
                    res.send(teacher);
                }).catch((err) => {
                    res.send({
                        error: 'Error while creating teacher'
                    });
                });
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not find subject'
            });
        });
    }
});
route.get('/:id', (req, res) => {
    db_1.Teachers.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((teacher) => {
        if (teacher === null) {
            return res.status(404).send({
                error: 'Error in finding teacher. Teacher doesnt exist..'
            });
        }
        else {
            res.send(teacher);
        }
    });
});
route.get('/:id/batches', (req, res) => {
    db_1.Lectures.findAll({
        where: {
            teacherId: parseInt(req.params.id)
        }
    }).then((lectures) => {
        let temp = [];
        for (let identity of lectures) {
            temp.push(identity.batchId);
        }
        db_1.Batches.findAll({
            attributes: ['id', 'name'],
            where: {
                id: { $in: temp }
            }
        }).then((batches) => {
            res.status(200).send(batches);
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve batches.'
            });
        });
    });
});
route.put('/', (req, res) => {
    let teacherId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    }
    else if (!teacherId) {
        res.status(500).send({
            error: 'Could not find teacher because teacherId is not valid'
        });
    }
    else {
        db_1.Teachers.findOne({
            where: {
                id: teacherId
            },
            attributes: ['id', 'name', 'subjectId']
        }).then((teacher) => {
            if (!teacher) {
                res.status(404).send({
                    error: 'Could not find teacher'
                });
            }
            else {
                teacher.set('name', name);
                teacher.save();
                res.status(200).send(teacher);
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve teacher'
            });
        });
    }
});
exports.default = route;
