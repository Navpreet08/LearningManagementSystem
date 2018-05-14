"use strict";
/**Navpreet Kaur */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const route = express_1.Router();
route.get('/', (req, res) => {
    db_1.Students.findAll({
        attributes: ['id', 'name']
    }).then((students) => {
        res.status(200).send(students);
    }).catch((err) => {
        res.status(500).send({
            error: 'Could not retrieve students.'
        });
    });
});
route.post('/', (req, res) => {
    if (req.body.name) {
        db_1.Students.create({
            name: req.body.name
        }).then((student) => {
            res.send(student);
        }).catch((err) => {
            res.send({
                error: 'Error while adding student'
            });
        });
    }
    else {
        res.send({
            error: 'student name is null'
        });
    }
});
route.get('/:id', (req, res) => {
    db_1.Students.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((student) => {
        if (student === null) {
            return res.status(404).send({
                error: 'Error in finding student. Student doesnt exist..'
            });
        }
        else {
            res.send(student);
        }
    });
});
route.get('/:id/batches', (req, res) => {
    db_1.Student_Batches.findAll({
        where: {
            studentId: parseInt(req.params.id)
        }
    }).then((studentBatch) => {
        let temp = [];
        for (let identity of studentBatch) {
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
    let studentId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    }
    else if (!studentId) {
        res.status(500).send({
            error: 'Could not find student because studentId is not valid'
        });
    }
    else {
        db_1.Students.findOne({
            where: {
                id: studentId
            },
            attributes: ['id', 'name']
        }).then((student) => {
            if (!student) {
                res.status(404).send({
                    error: 'Could not find student'
                });
            }
            else {
                student.set('name', name);
                student.save();
                res.status(200).send(student);
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve student'
            });
        });
    }
});
exports.default = route;
