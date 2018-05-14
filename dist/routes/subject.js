"use strict";
/**Navpreet Kaur */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const route = express_1.Router();
route.get('/', (req, res) => {
    db_1.Subjects.findAll({
        attributes: ['id', 'name']
    }).then((subjects) => {
        res.status(200).send(subjects);
    }).catch((err) => {
        res.status(500).send({
            error: 'Could not retrieve subjects.'
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
                db_1.Subjects.create({
                    name: req.body.name
                }).then((subject) => {
                    subject.setCourse(course, { save: false });
                    subject.save();
                    res.send(subject);
                }).catch((err) => {
                    res.send({
                        error: 'Error while creating subject'
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
    db_1.Subjects.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((subject) => {
        if (subject === null) {
            return res.status(404).send({
                error: 'Error in finding subject. Subject doesnt exist..'
            });
        }
        else {
            res.send(subject);
        }
    });
});
route.get('/:id/teachers', (req, res) => {
    let subjectId = parseInt(req.params.id);
    if (!subjectId) {
        res.status(500).send({
            error: ' subjectId is not valid'
        });
    }
    else {
        db_1.Teachers.findAll({
            where: {
                subjectId: subjectId
            },
            attributes: ['id', 'name']
        }).then((teachers) => {
            if (teachers === null) {
                return res.status(404).send({
                    error: 'Error in finding teachers. teachers doesnt exist.'
                });
            }
            else {
                res.send(teachers);
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve teachers'
            });
        });
    }
});
route.put('/', (req, res) => {
    let subjectId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    }
    else if (!subjectId) {
        res.status(500).send({
            error: 'Could not find subject because subjectId is not valid'
        });
    }
    else {
        db_1.Subjects.findOne({
            where: {
                id: subjectId
            },
            attributes: ['id', 'name', 'courseId']
        }).then((subject) => {
            if (!subject) {
                res.status(404).send({
                    error: 'Could not find subject'
                });
            }
            else {
                subject.set('name', name);
                subject.save();
                res.status(200).send(subject);
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve subject'
            });
        });
    }
});
exports.default = route;
