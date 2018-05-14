"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Course {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Course = Course;
class Batch {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Batch = Batch;
class Lecture {
    constructor(id, name, subjectId, batchId, teacherId) {
        this.id = id;
        this.name = name;
        this.subjectId = subjectId;
        this.batchId = batchId;
        this.teacherId = teacherId;
    }
}
exports.Lecture = Lecture;
class Student {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Student = Student;
class Teacher {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Teacher = Teacher;
class Subject {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Subject = Subject;
class Student_Batch {
    constructor(id, studentId, batchId) {
        this.id = id;
        this.studentId = studentId;
        this.batchId = batchId;
    }
}
exports.Student_Batch = Student_Batch;
