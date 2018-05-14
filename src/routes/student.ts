/**Navpreet Kaur */

import  { Router,  Request,  Response }  from  'express';
import { Student, Student_Batch, Batch } from '../model';
import { Students, Student_Batches, Batches } from '../db';
const  route:  Router  =  Router();

route.get('/', (req: Request, res: Response) => {
    Students.findAll({
        attributes: ['id', 'name']
    }).then((students: Student[]) => {
        res.status(200).send(students);
    }).catch((err: Error) => {
        res.status(500).send({
            error: 'Could not retrieve students.'
        });
    });
});



route.post('/', (req: Request, res: Response) => {

    if (req.body.name) {
        Students.create({
            name: req.body.name

        }).then((student: Student) => {
            res.send(
                student
            );
        }).catch((err: Error) => {
            res.send({
                error: 'Error while adding student'
            });
        });
    } else {
        res.send({
            error: 'student name is null'
        });
    }


});


route.get('/:id', (req: Request, res: Response) => {

    Students.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        attributes: ['id', 'name']
    }).then((student: any) => {

        if (student === null) {
            return res.status(404).send({
                error: 'Error in finding student. Student doesnt exist..'
            });
        }
        else {
            res.send(student);
        }
    });
})

route.get('/:id/batches', (req: Request, res: Response) => {

    Student_Batches.findAll({
        where: {
            studentId: parseInt(req.params.id)
        }

    }).then((studentBatch: Student_Batch[]) => {

        let temp: number[] = [];
        for (let identity of studentBatch) {
            temp.push(identity.batchId);
        }

        Batches.findAll({
            attributes: ['id', 'name'],
            where: {
                id:{ $in: temp}
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

    let studentId = parseInt(req.body.id);
    let name = req.body.name;
    if (!name) {
        res.send({
            error: 'Please enter the name in body'
        });
    } else if (!studentId) {
        res.status(500).send({
            error: 'Could not find student because studentId is not valid'
        })
    } else {
        Students.findOne({
            where: {
                id: studentId
            },
            attributes: ['id', 'name']
        }).then((student: any) => {

            if (!student) {
                res.status(404).send({
                    error: 'Could not find student'
                });
            } else {
                student.set('name', name);
                student.save();
                res.status(200).send(student);
            }
        }).catch((err: Error) => {
            res.status(500).send({
                error: 'Could not retrieve student'
            });
        });
    }
});
export  default  route;

