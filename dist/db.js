"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const db = new sequelize_1.default('learningmanagementdb', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        min: 0,
        max: 5
    }
});
exports.Courses = db.define('courses', {
    name: {
        type: sequelize_1.default.STRING(60),
        allowNull: false,
        unique: true
    }
});
exports.Batches = db.define('batches', {
    name: {
        type: sequelize_1.default.STRING(60),
        allowNull: false
    }
});
exports.Teachers = db.define('teachers', {
    name: {
        type: sequelize_1.default.STRING(60),
        allowNull: false
    }
});
exports.Students = db.define('students', {
    name: {
        type: sequelize_1.default.STRING(60),
        allowNull: false
    }
});
exports.Lectures = db.define('lectures', {
    name: {
        type: sequelize_1.default.STRING(60),
        allowNull: false
    }
});
exports.Subjects = db.define('subjects', {
    name: {
        type: sequelize_1.default.STRING(60),
        allowNull: false
    }
});
exports.Student_Batches = db.define('student_batches', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
});
exports.Batches.belongsTo(exports.Courses);
exports.Courses.hasMany(exports.Batches);
exports.Courses.hasMany(exports.Subjects);
exports.Subjects.belongsTo(exports.Courses);
exports.Teachers.belongsTo(exports.Subjects);
exports.Subjects.hasMany(exports.Teachers);
exports.Batches.hasMany(exports.Lectures);
exports.Lectures.belongsTo(exports.Batches);
exports.Lectures.belongsTo(exports.Subjects);
exports.Lectures.belongsTo(exports.Teachers);
exports.Batches.belongsToMany(exports.Students, { through: { model: exports.Student_Batches } });
exports.Students.belongsToMany(exports.Batches, { through: { model: exports.Student_Batches } });
db.sync()
    .then(() => console.log('Database hase been synced'))
    .catch((err) => console.error('Error creating database: ' + err));
