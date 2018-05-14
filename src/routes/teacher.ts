/**Navpreet Kaur */

import { Router, Request, Response } from 'express';
import { Teacher, Lecture, Batch } from '../model';
import { Teachers, Subjects, Lectures, Batches } from '../db';
const route: Router = Router();

route.get('/', (req: Request, res: Response) => {
    Teachers.findAll({
        attributes: ['id', 'name']
    }).then((teachers: Teacher[]) => {
        res.status(200).send(teachers);
    }).catch((err: Error) => {
        res.status(500).send({
            error: 'Could not retrieve teachers.'
        });
    });
});



route.post('/', (req: Request, res: Response) => {
    if (!req.body.name) {
        res.send({
            error: 'Please enter the name in body'
        });
    } else {

        Subjects.findOne({
            where: {
                id: req.body.subjectId
            },
            attributes: ['id', 'name']
        }).then((subject: any) => {

            if (!subject) {
                res.status(404).send({
                    error: 'Could not find subject  '
                });
            } else {
                Teachers.create({
                    name: req.body.name
                }).then((teacher: any) => {
                    teacher.setSubject(subject, { save: false });
                    teacher.save();
                    res.send(teacher);
                }).catch((err: Error) => {
                    res.send({
                        error: 'Error while creating teacher'
                    });
                });
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not find subject'
            });
        });
    }
});

route.get('/:id', (req: Request, res: Response) => {

    Teachers.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((teacher: any) => {

        if (teacher === null) {
            return res.status(404).send({
                error: 'Error in finding teacher. Teacher doesnt exist..'
            });
        }
        else {
            res.send(teacher);
        }
    });
})
route.get('/:id/batches', (req: Request, res: Response) => {

    Lectures.findAll({
        where: {
            teacherId: parseInt(req.params.id)
        }

    }).then((lectures: Lecture[]) => {

        let temp: number[] = [];
        for (let identity of lectures) {
            temp.push(identity.batchId);
        }

        Batches.findAll({
            attributes: ['id', 'name'],
            where: {
                id: { $in: temp }
            }
        }).then((batches: Batch[]) => {
            res.status(200).send(batches);
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve batches.'
            });
        });
    })

})

route.put('/', (req: Request, res: Response) => {

    let teacherId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    } else if (!teacherId) {
        res.status(500).send({
            error: 'Could not find teacher because teacherId is not valid'
        })
    } else {
        Teachers.findOne({
            where: {
                id: teacherId
            },
            attributes: ['id', 'name','subjectId']
        }).then((teacher: any) => {

            if (!teacher) {
                res.status(404).send({
                    error: 'Could not find teacher'
                });
            } else {
                teacher.set('name', name);
                teacher.save();
                res.status(200).send(teacher);
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve teacher'
            });
        });
    }
});



export default route;

