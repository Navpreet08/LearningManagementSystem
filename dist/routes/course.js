"use strict";
/**Navpreet Kaur */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const route = express_1.Router();
route.get('/', (req, res) => {
    db_1.Courses.findAll({
        attributes: ['id', 'name']
    }).then((courses) => {
        res.status(200).send(courses);
    }).catch((err) => {
        res.status(500).send({
            error: 'Could not retrieve courses.'
        });
    });
});
route.post('/', (req, res) => {
    if (req.body.name) {
        db_1.Courses.create({
            name: req.body.name
        }).then((course) => {
            res.send(course);
        }).catch((err) => {
            res.send({
                error: 'Error while adding course'
            });
        });
    }
    else {
        res.send({
            error: 'Course name is null'
        });
    }
});
route.get('/:id', (req, res) => {
    db_1.Courses.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((course) => {
        if (course === null) {
            return res.status(404).send({
                error: 'Error in finding course. Course doesnt exist..'
            });
        }
        else {
            res.send(course);
        }
    });
});
route.get('/:id/batches', (req, res) => {
    let courseId = parseInt(req.params.id);
    if (!courseId) {
        res.status(500).send({
            error: ' courseId is not valid'
        });
    }
    else {
        db_1.Batches.findAll({
            where: {
                courseId: courseId
            },
            attributes: ['id', 'name']
        }).then((batches) => {
            if (batches === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                res.send(batches);
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve batches'
            });
        });
    }
});
route.get('/:id/batches/:batchId', (req, res) => {
    let courseId = parseInt(req.params.id);
    let batchId = parseInt(req.params.batchId);
    if (!courseId && !batchId) {
        res.status(500).send({
            error: ' courseId or batchid is not valid'
        });
    }
    else {
        db_1.Batches.findOne({
            where: {
                courseId: courseId,
                id: batchId
            },
            attributes: ['id', 'name']
        }).then((batch) => {
            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                res.send(batch);
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve batches'
            });
        });
    }
});
route.get('/:id/batches/:batchId/lectures', (req, res) => {
    let courseId = parseInt(req.params.id);
    let batchId = parseInt(req.params.batchId);
    if (!courseId && !batchId) {
        res.status(500).send({
            error: ' courseId or batchid is not valid'
        });
    }
    else {
        db_1.Batches.findOne({
            where: {
                courseId: courseId,
                id: batchId
            },
            attributes: ['id', 'name']
        }).then((batch) => {
            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                db_1.Lectures.findAll({
                    include: [{
                            model: db_1.Subjects,
                            attributes: ['id', 'name']
                        }, {
                            model: db_1.Teachers,
                            attributes: ['id', 'name', 'subjectId']
                        }
                    ],
                    attributes: ['id', 'name', 'batchId', 'subjectId', 'teacherId'],
                    where: {
                        batchId: batch.id
                    }
                }).then((lectures) => {
                    res.status(200).send(lectures);
                }).catch((err) => {
                    res.status(500).send({
                        error: 'Could not retrieve lectures.'
                    });
                });
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve batches'
            });
        });
    }
});
route.get('/:id/batches/:batchId/lectures/:lectureId', (req, res) => {
    let courseId = parseInt(req.params.id);
    let batchId = parseInt(req.params.batchId);
    let lectureId = parseInt(req.params.lectureId);
    if (!courseId && !batchId) {
        res.status(500).send({
            error: ' courseId or batchid is not valid'
        });
    }
    else {
        db_1.Batches.findOne({
            where: {
                courseId: courseId,
                id: batchId
            },
            attributes: ['id', 'name']
        }).then((batch) => {
            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                db_1.Lectures.findOne({
                    attributes: ['id', 'name', 'batchId', 'subjectId', 'teacherId'],
                    where: {
                        batchId: batch.id,
                        id: lectureId
                    }
                }).then((lecture) => {
                    res.status(200).send(lecture);
                }).catch((err) => {
                    res.status(500).send({
                        error: 'Could not retrieve lectures.'
                    });
                });
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve batches'
            });
        });
    }
});
route.get('/:id/batches/:batchId/students', (req, res) => {
    let courseId = parseInt(req.params.id);
    let batchId = parseInt(req.params.batchId);
    if (!courseId && !batchId) {
        res.status(500).send({
            error: ' courseId or batchid is not valid'
        });
    }
    else {
        db_1.Batches.findOne({
            where: {
                courseId: courseId,
                id: batchId
            },
            attributes: ['id', 'name']
        }).then((batch) => {
            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                db_1.Student_Batches.findAll({
                    attributes: ['id', 'batchId', 'studentId'],
                    where: {
                        batchId: batch.id
                    }
                }).then((studentBatch) => {
                    let temp = [];
                    for (let identity of studentBatch) {
                        temp.push(identity.studentId);
                    }
                    db_1.Students.findAll({
                        attributes: ['id', 'name'],
                        where: {
                            id: { $in: temp }
                        }
                    }).then((students) => {
                        res.status(200).send(students);
                    }).catch((err) => {
                        res.status(500).send({
                            error: 'Could not retrieve students.'
                        });
                    });
                });
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve batches'
            });
        });
    }
});
route.get('/:id/batches/:batchId/teachers', (req, res) => {
    let courseId = parseInt(req.params.id);
    let batchId = parseInt(req.params.batchId);
    if (!courseId && !batchId) {
        res.status(500).send({
            error: ' courseId or batchid is not valid'
        });
    }
    else {
        db_1.Batches.findOne({
            where: {
                courseId: courseId,
                id: batchId
            },
            attributes: ['id', 'name']
        }).then((batch) => {
            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                db_1.Lectures.findAll({
                    attributes: ['id', 'name', 'batchId', 'subjectId', 'teacherId'],
                    where: {
                        batchId: batch.id
                    }
                }).then((lectures) => {
                    let temp = [];
                    for (let identity of lectures) {
                        temp.push(identity.teacherId);
                    }
                    db_1.Teachers.findAll({
                        attributes: ['id', 'name'],
                        where: {
                            id: { $in: temp }
                        }
                    }).then((teachers) => {
                        res.status(200).send(teachers);
                    }).catch((err) => {
                        res.status(500).send({
                            error: 'Could not retrieve teachers.'
                        });
                    });
                }).catch((err) => {
                    res.status(500).send({
                        error: 'Could not retrieve batches'
                    });
                });
            }
        });
    }
});
route.put('/', (req, res) => {
    let courseId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    }
    else if (!courseId) {
        res.status(500).send({
            error: 'Could not find batch because courseId is not valid'
        });
    }
    else {
        db_1.Courses.findOne({
            where: {
                id: courseId
            },
            attributes: ['id', 'name',]
        }).then((course) => {
            if (!course) {
                res.status(404).send({
                    error: 'Could not find course'
                });
            }
            else {
                course.set('name', name);
                course.save();
                res.status(200).send(course);
            }
        }).catch((err) => {
            res.status(500).send({
                error: 'Could not retrieve course'
            });
        });
    }
});
exports.default = route;
