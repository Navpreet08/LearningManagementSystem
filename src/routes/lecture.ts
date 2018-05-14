/**Navpreet Kaur */

import { Router, Request, Response } from 'express';
import { Lecture, Batch, Teacher } from '../model';
import { Lectures, Batches, Subjects, Teachers } from '../db';
const route: Router = Router();

route.get('/', (req: Request, res: Response) => {
    Lectures.findAll({
        attributes: ['id', 'name']
    }).then((lectures: Lecture[]) => {
        res.status(200).send(lectures);
    }).catch((err: Error) => {
        res.status(500).send({
            error: 'Could not retrieve lectures.'
        });
    });
});




route.post('/', (req: Request, res: Response) => {
    if (!req.body.name) {
        res.send({
            error: 'Please enter the name in body'
        });
    } else {

        Batches.findOne({
            where: {
                id: req.body.batchId
            },
            attributes: ['id', 'name']
        }).then((batches: any) => {

            if (!batches) {
                res.status(404).send({
                    error: 'Could not find batches  '
                });
            } else {

                Teachers.findOne({
                    where: {
                        id: req.body.teacherId
                    },
                    attributes: ['id', 'name', 'subjectId']
                }).then((teacher: any) => {

                    if (!teacher) {
                        res.status(404).send({
                            error: 'Could not find teacher  '
                        });
                    } else {

                        Subjects.findOne({
                            where: {
                                id: teacher.subjectId
                            },
                            attributes: ['id', 'name']
                        }).then((subject: any) => {
                    
                            if (subject === null) {
                                return res.status(404).send({
                                    error: 'Error in finding subject. Subject doesnt exist..'
                                });
                            }
                            else{
                                Lectures.create({
                                    name: req.body.name
                                }).then((lecture: any) => {
                                    lecture.setBatch(batches, { save: false });
                                    lecture.setSubject(subject, { save: false });
                                    lecture.setTeacher(teacher, { save: false });
                                    lecture.save();
                                    res.send(lecture);
                                }).catch((err: Error) => {
                                    res.send({
                                        error: 'Error while creating lecture'
                                    });
                                });     
                            }
                        });
                    }
                }).catch((err: Error) => {
                    res.status(500).send({
                        error: 'Could not find teacher'
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

    Lectures.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((lecture: any) => {

        if (lecture === null) {
            return res.status(404).send({
                error: 'Error in finding lecture. Lecture doesnt exist..'
            });
        }
        else {
            res.send(lecture);
        }
    });
})


route.delete('/:lectureId', (req, res) => {

    let lectureId = parseInt(req.params.lectureId);

    if(!lectureId){
        return res.status(404).send({
            error: 'lecture id not valid.'
        });
    }else{
        Lectures.findOne({
            where: {
                id: lectureId
            },
            attributes: ['id', 'name']
        }).then((lecture: any) => {
    
            if (lecture === null) {
                return res.status(404).send({
                    error: 'Error in finding lecture. Lecture doesnt exist..'
                });
            }
            else {
                Lectures.destroy({
                    where: {
                        id: lectureId
                    }
                })
                res.status(200).send(lecture)
            }
        });
    }

  
     
       
    
});


route.put('/', (req: Request, res: Response) => {

    let lectureId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    } else if (!lectureId) {
        res.status(500).send({
            error: 'Could not find lecture because lectureId is not valid'
        })
    } else {
        Lectures.findOne({
            where: {
                id: lectureId
            },
            attributes: ['id', 'name', 'batchId','subjectId','teacherId']
        }).then((lecture: any) => {

            if (!lecture) {
                res.status(404).send({
                    error: 'Could not find lecture'
                });
            } else {
                lecture.set('name', name);
                lecture.save();
                res.status(200).send(lecture);
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve lecture'
            });
        });
    }
});





export default route;

