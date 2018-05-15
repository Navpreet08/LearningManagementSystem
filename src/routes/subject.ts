/**Navpreet Kaur */

import {Router, Request, Response} from 'express';
import { Subject, Teacher } from '../model';
import { Subjects, Courses, Teachers } from '../db';
const route: Router = Router();

route.get('/', (req: Request, res: Response) => {
    Subjects.findAll({
        attributes: ['id', 'name'],
        include :[{
            model : Courses,
            attributes: ['id','name']
        }]
    }).then((subjects: Subject[]) => {
        res.status(200).send(subjects);
    }).catch((err: Error) => {
        res.status(500).send({
            error: 'Could not retrieve subjects.'
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
                Subjects.create({
                    name: req.body.name
                }).then((subject: any) => {
                    subject.setCourse(course, {save: false});
                    subject.save();
                    res.send(subject);
                }).catch((err: Error) => {
                    res.send({
                        error: 'Error while creating subject'
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

    Subjects.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((subject: any) => {

        if (subject === null) {
            return res.status(404).send({
                error: 'Error in finding subject. Subject doesnt exist..'
            });
        }
        else{
            res.send(subject);
        }
    });
})


route.get('/:id/teachers', (req: Request, res: Response) => {

    let subjectId = parseInt(req.params.id);

    if (!subjectId) {
        res.status(500).send({
            error: ' subjectId is not valid'
        })
    } else {
        Teachers.findAll({
            where: {
                subjectId: subjectId
            },
            attributes: ['id', 'name']
        }).then((teachers: Teacher[]) => {

            if (teachers === null) {
                return res.status(404).send({
                    error: 'Error in finding teachers. teachers doesnt exist.'             
                   });
            }
            else {
                res.send(teachers);
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve teachers'
            });
        });
    }
});

route.put('/', (req: Request, res: Response) => {

    let subjectId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    } else if (!subjectId) {
        res.status(500).send({
            error: 'Could not find subject because subjectId is not valid'
        })
    } else {
        Subjects.findOne({
            where: {
                id: subjectId
            },
            attributes: ['id', 'name','courseId']
        }).then((subject: any) => {

            if (!subject) {
                res.status(404).send({
                    error: 'Could not find subject'
                });
            } else {
                subject.set('name', name);
                subject.save();
                res.status(200).send(subject);
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve subject'
            });
        });
    }
});

export default route; 
 
