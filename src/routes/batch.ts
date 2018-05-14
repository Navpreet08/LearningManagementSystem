/**Navpreet Kaur */

import { Router, Request, Response } from 'express';
import { Batch, Course, Student_Batch } from '../model';
import { Batches, Courses, Students, Student_Batches } from '../db';
const route: Router = Router();

route.get('/', (req: Request, res: Response) => {
    Batches.findAll({
        attributes: ['id', 'name']
    }).then((batches: Batch[]) => {
        res.status(200).send(batches);
    }).catch((err: Error) => {
        res.status(500).send({
            error: 'Could not retrieve batches.'
        });
    });
});



route.post('/', (req: Request, res: Response) => {
    if (!req.body.name) {
        res.send({
            error: 'Please enter the name in body'
        });
    } else {

        Courses.findOne({
            where: {
                id: req.body.courseId
            },
            attributes: ['id', 'name']
        }).then((course: any) => {

            if (!course) {
                res.status(404).send({
                    error: 'Could not find course  '
                });
            } else {
                Batches.create({
                    name: req.body.name
                }).then((batch: any) => {
                    batch.setCourse(course, { save: false });
                    batch.save();
                    res.send(batch);
                }).catch((err: Error) => {
                    res.send({
                        error: 'Error while creating batch'
                    });
                });
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not find course'
            });
        });
    }
});




route.get('/:id', (req: Request, res: Response) => {

    Batches.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((batch: any) => {

        if (batch === null) {
            return res.status(404).send({
                error: 'Error in finding batch. Batch doesnt exist..'
            });
        }
        else {
            res.send(batch);
        }
    });
})

route.post('/students', (req: Request, res: Response) => {

    let studentId = parseInt(req.body.studentId);
    let batchId = parseInt(req.body.batchId);

    if (!studentId || !batchId) {
        return res.status(404).send({
            error: 'Error in finding batch and student id'
        });
    } else {
        Batches.findOne({
            where: {
                id: batchId
            },

        }).then((batch: any) => {

            if (batch === null) {
                return res.status(404).send({
                    error: 'Error in finding batch. '
                });
            }
            else {
                Students.findOne({
                    where: {
                        id: studentId
                    },

                }).then((student: any) => {

                    if (student === null) {
                        return res.status(404).send({
                            error: 'Error in finding student...'
                        });
                    }
                    else {
                        Student_Batches.create(
                            {
                                studentId: studentId,
                                batchId: batchId
                            }
                        )
                            .then((studentBatch: Student_Batch) => {

                                res.send(studentBatch);
                            }).catch((err: Error) => {
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

route.put('/', (req: Request, res: Response) => {

    let batchId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    } else if (!batchId) {
        res.status(500).send({
            error: 'Could not find batch because batchId is not valid'
        })
    } else {
        Batches.findOne({
            where: {
                id: batchId
            },
            attributes: ['id', 'name', 'courseId']
        }).then((batch: any) => {

            if (!batch) {
                res.status(404).send({
                    error: 'Could not find batch with id: ' + batchId
                });
            } else {
                batch.set('name', name);
                batch.save();
                res.status(200).send(batch);
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve batch'
            });
        });
    }
});





export default route;

