"use strict";
/**Navpreet Kaur */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const route = express_1.Router();
route.get('/', (req, res) => {
    db_1.Lectures.findAll({
        attributes: ['id', 'name']
    }).then((lectures) => {
        res.status(200).send(lectures);
    }).catch((err) => {
        res.status(500).send({
            error: 'Could not retrieve lectures.'
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
        db_1.Batches.findOne({
            where: {
                id: req.body.batchId
            },
            attributes: ['id', 'name']
        }).then((batches) => {
            if (!batches) {
                res.status(404).send({
                    error: 'Could not find batches  '
                });
            }
            else {
                db_1.Teachers.findOne({
                    where: {
                        id: req.body.teacherId
                    },
                    attributes: ['id', 'name', 'subjectId']
                }).then((teacher) => {
                    if (!teacher) {
                        res.status(404).send({
                            error: 'Could not find teacher  '
                        });
                    }
                    else {
                        db_1.Subjects.findOne({
                            where: {
                                id: teacher.subjectId
                            },
                            attributes: ['id', 'name']
                        }).then((subject) => {
                            if (subject === null) {
                                return res.status(404).send({
                                    error: 'Error in finding subject. Subject doesnt exist..'
                                });
                            }
                            else {
                                db_1.Lectures.create({
                                    name: req.body.name
                                }).then((lecture) => {
                                    lecture.setBatch(batches, { save: false });
                                    lecture.setSubject(subject, { save: false });
                                    lecture.setTeacher(teacher, { save: false });
                                    lecture.save();
                                    res.send(lecture);
                                }).catch((err) => {
                                    res.send({
                                        error: 'Error while creating lecture'
                                    });
                                });
                            }
                        });
                    }
                }).catch((err) => {
                    res.status(500).send({
                        error: 'Could not find teacher'
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
    db_1.Lectures.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((lecture) => {
        if (lecture === null) {
            return res.status(404).send({
                error: 'Error in finding lecture. Lecture doesnt exist..'
            });
        }
        else {
            res.send(lecture);
        }
    });
});
route.delete('/:lectureId', (req, res) => {
    let lectureId = parseInt(req.params.lectureId);
    if (!lectureId) {
        return res.status(404).send({
            error: 'lecture id not valid.'
        });
    }
    else {
        db_1.Lectures.findOne({
            where: {
                id: lectureId
            },
            attributes: ['id', 'name']
        }).then((lecture) => {
            if (lecture === null) {
                return res.status(404).send({
                    error: 'Error in finding lecture. Lecture doesnt exist..'
                });
            }
            else {
                db_1.Lectures.destroy({
                    where: {
                        id: lectureId
                    }
                });
                res.status(200).send(lecture);
            }
        });
    }
});
route.put('/', (req, res) => {
    let lectureId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    }
    else if (!lectureId) {
        res.status(500).send({
            error: 'Could not find lecture because lectureId is not valid'
        });
    }
    else {
        db_1.Lectures.findOne({
            where: {
                id: lectureId
            },
            attributes: ['id', 'name', 'batchId', 'subjectId', 'teacherId']
        }).then((lecture) => {
            if (!lecture) {
                res.status(404).send({
                    error: 'Could not find lecture'
                });
            }
            else {
                lecture.set('name', name);
                lecture.save();
                res.status(200).send(lecture);
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve lecture'
            });
        });
    }
});
exports.default = route;
