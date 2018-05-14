export class Course {
    constructor(public id: number, public name: string) { }
}
export class Batch {
    constructor(public id: number, public name: string) { }
}
export class Lecture {
    constructor(public id: number, public name: string, public subjectId: number, public batchId: number, public teacherId: number) { }
}
export class Student {
    constructor(public id: number, public name: string) { }
}
export class Teacher {
    constructor(public id: number, public name: string) { }
}
export class Subject {
    constructor(public id: number, public name: string) { }
}

export class Student_Batch {
    constructor(public id: number, public studentId: number, public batchId: number) { }
}
