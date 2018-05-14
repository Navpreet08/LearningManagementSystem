/**Navpreet Kaur */

import { Router, Request, Response } from 'express';
import { Course, Batch, Lecture, Student_Batch, Student, Teacher } from '../model';
import { Courses, Batches, Lectures, Student_Batches, Students, Teachers } from '../db';

const route: Router = Router();

route.get('/', (req: Request, res: Response) => {
    Courses.findAll({
        attributes: ['id', 'name']
    }).then((courses: Course[]) => {
        res.status(200).send(courses);
    }).catch((err: Error) => {
        res.status(500).send({
            error: 'Could not retrieve courses.'
        });
    });
});

route.post('/', (req: Request, res: Response) => {

    if (req.body.name) {
        Courses.create({
            name: req.body.name

        }).then((course: Course) => {
            res.send(
                course
            );
        }).catch((err: Error) => {
            res.send({
                error: 'Error while adding course'
            });
        });
    } else {
        res.send({
            error: 'Course name is null'
        });
    }


});

route.get('/:id', (req: Request, res: Response) => {

    Courses.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((course: any) => {

        if (course === null) {
            return res.status(404).send({
                error: 'Error in finding course. Course doesnt exist..'
            });
        }
        else {
            res.send(course);
        }
    });
})

route.get('/:id/batches', (req: Request, res: Response) => {

    let courseId = parseInt(req.params.id);

    if (!courseId) {
        res.status(500).send({
            error: ' courseId is not valid'
        })
    } else {
        Batches.findAll({
            where: {
                courseId: courseId
            },
            attributes: ['id', 'name']
        }).then((batches: Batch[]) => {

            if (batches === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                res.send(batches);
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve batches'
            });
        });
    }
});

route.get('/:id/batches/:batchId', (req: Request, res: Response) => {

    let courseId = parseInt(req.params.id);
    let batchId = parseInt(req.params.batchId);

    if (!courseId && !batchId) {
        res.status(500).send({
            error: ' courseId or batchid is not valid'
        })
    } else {
        Batches.findOne({
            where: {
                courseId: courseId,
                id: batchId
            },
            attributes: ['id', 'name']
        }).then((batch: any) => {

            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                res.send(batch);
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve batches'
            });
        });
    }
});

route.get('/:id/batches/:batchId/lectures', (req: Request, res: Response) => {

    let courseId = parseInt(req.params.id);
    let batchId = parseInt(req.params.batchId);

    if (!courseId && !batchId) {
        res.status(500).send({
            error: ' courseId or batchid is not valid'
        })
    } else {
        Batches.findOne({
            where: {
                courseId: courseId,
                id: batchId
            },
            attributes: ['id', 'name']
        }).then((batch: any) => {

            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                Lectures.findAll({
                    attributes: ['id', 'name', 'batchId', 'subjectId', 'teacherId'],
                    where: {
                        batchId: batch.id
                    }
                }).then((lectures: Lecture[]) => {
                    res.status(200).send(lectures);
                }).catch((err: Error) => {
                    res.status(500).send({
                        error: 'Could not retrieve lectures.'
                    });
                });
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve batches'
            });
        });
    }
});

route.get('/:id/batches/:batchId/lectures/:lectureId', (req: Request, res: Response) => {

    let courseId = parseInt(req.params.id);
    let batchId = parseInt(req.params.batchId);
    let lectureId = parseInt(req.params.lectureId);

    if (!courseId && !batchId) {
        res.status(500).send({
            error: ' courseId or batchid is not valid'
        })
    } else {
        Batches.findOne({
            where: {
                courseId: courseId,
                id: batchId
            },
            attributes: ['id', 'name']
        }).then((batch: any) => {

            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                Lectures.findOne({
                    attributes: ['id', 'name', 'batchId', 'subjectId', 'teacherId'],
                    where: {
                        batchId: batch.id,
                        id: lectureId
                    }
                }).then((lecture: any) => {
                    res.status(200).send(lecture);
                }).catch((err: Error) => {
                    res.status(500).send({
                        error: 'Could not retrieve lectures.'
                    });
                });
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve batches'
            });
        });
    }
});

route.get('/:id/batches/:batchId/students', (req: Request, res: Response) => {

    let courseId = parseInt(req.params.id);
    let batchId = parseInt(req.params.batchId);

    if (!courseId && !batchId) {
        res.status(500).send({
            error: ' courseId or batchid is not valid'
        })
    } else {
        Batches.findOne({
            where: {
                courseId: courseId,
                id: batchId
            },
            attributes: ['id', 'name']
        }).then((batch: any) => {

            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                Student_Batches.findAll({
                    attributes: ['id', 'batchId', 'studentId'],
                    where: {
                        batchId: batch.id
                    }
                }).then((studentBatch: Student_Batch[]) => {

                    let temp: number[] = [];
                    for (let identity of studentBatch) {
                        temp.push(identity.studentId);
                    }

                    Students.findAll({
                        attributes: ['id', 'name'],
                        where: {
                            id: { $in: temp }
                        }
                    }).then((students: Student[]) => {
                        res.status(200).send(students);
                    }).catch((err: Error) => {
                        res.status(500).send({
                            error: 'Could not retrieve students.'
                        });
                    });
                })
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve batches'
            });
        });
    }
});

route.get('/:id/batches/:batchId/teachers', (req: Request, res: Response) => {

    let courseId = parseInt(req.params.id);
    let batchId = parseInt(req.params.batchId);

    if (!courseId && !batchId) {
        res.status(500).send({
            error: ' courseId or batchid is not valid'
        })
    } else {
        Batches.findOne({
            where: {
                courseId: courseId,
                id: batchId
            },
            attributes: ['id', 'name']
        }).then((batch: any) => {

            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batches. batches doesnt exist.'
                });
            }
            else {
                Lectures.findAll({
                    attributes: ['id', 'name', 'batchId', 'subjectId', 'teacherId'],
                    where: {
                        batchId: batch.id
                    }
                }).then((lectures: Lecture[]) => {
                    let temp: number[] = [];
                    for (let identity of lectures) {
                        temp.push(identity.teacherId);
                    }

                    Teachers.findAll({
                        attributes: ['id', 'name'],
                        where: {
                            id: { $in: temp }
                        }
                    }).then((teachers: Teacher[]) => {
                        res.status(200).send(teachers);
                    }).catch((err: Error) => {
                        res.status(500).send({
                            error: 'Could not retrieve teachers.'
                        });
                    });
                }
                ).catch((err: Error) => {
                    res.status(500).send({
                        error: 'Could not retrieve batches'
                    });
                });
            }
        });


    }
})


route.put('/', (req: Request, res: Response) => {

    let courseId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    } else if (!courseId) {
        res.status(500).send({
            error: 'Could not find batch because courseId is not valid'
        })
    } else {
        Courses.findOne({
            where: {
                id: courseId
            },
            attributes: ['id', 'name',]
        }).then((course: any) => {

            if (!course) {
                res.status(404).send({
                    error: 'Could not find course'
                });
            } else {
                course.set('name', name);
                course.save();
                res.status(200).send(course);
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve course'
            });
        });
    }
});







export default route;

