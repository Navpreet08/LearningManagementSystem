import { Router, Request, Response } from 'express';
import course from './course';
import student from './student';
import subject from './subject';
import teacher from './teacher';
import batches from './batch';
import lectures from './lecture';
const route: Router = Router();


route.use('/courses', course);
route.use('/students', student);
route.use('/subjects', subject);
route.use('/teachers', teacher);
route.use('/batches', batches);
route.use('/lectures', lectures);


export default route