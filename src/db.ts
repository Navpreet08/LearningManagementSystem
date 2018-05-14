

import Sequelize from 'sequelize';
import { Batch, Course, Lecture, Student, Subject, Teacher, Student_Batch } from './model';

const db = new Sequelize('learningmanagementdb', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        min: 0,
        max: 5
    }
});

export const Courses = db.define<Course, any>('courses', {
    name: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: true
    }
});

export const Batches = db.define<Batch, any>('batches', {
    name: {
        type: Sequelize.STRING(60),
        allowNull: false
    }
});

export const Teachers = db.define<Teacher, any>('teachers', {
    name: {
        type: Sequelize.STRING(60),
        allowNull: false
    }
});

export const Students = db.define<Student, any>('students', {
    name: {
        type: Sequelize.STRING(60),
        allowNull: false
    }
});

export const Lectures = db.define<Lecture, any>('lectures', {
    name: {
        type: Sequelize.STRING(60),
        allowNull: false
    }
});

export const Subjects = db.define<Subject, any>('subjects', {
    name: {
        type: Sequelize.STRING(60),
        allowNull: false
    }
});

export const Student_Batches = db.define<Student_Batch, any>('student_batches', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
});

Batches.belongsTo(Courses);
Courses.hasMany(Batches);

Courses.hasMany(Subjects);
Subjects.belongsTo(Courses);

Teachers.belongsTo(Subjects);
Subjects.hasMany(Teachers);

Batches.hasMany(Lectures);
Lectures.belongsTo(Batches);
Lectures.belongsTo(Subjects);
Lectures.belongsTo(Teachers);

Batches.belongsToMany(Students, { through: { model: Student_Batches } })
Students.belongsToMany(Batches, { through: { model: Student_Batches } })

db.sync()
    .then(() => console.log('Database hase been synced'))
    .catch((err: Error) => console.error('Error creating database: ' + err))

