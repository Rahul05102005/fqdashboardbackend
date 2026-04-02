const mongoose = require('mongoose');

// Course Model
const courseSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    semester: { type: Number, required: true },
    credits: { type: Number, required: true },
    department: { type: String, required: true },
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

// Faculty Model
const facultySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: Number, required: true },
    specialization: [{ type: String }],
    joiningDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
    avatar: { type: String },
    coursesAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    averageRating: { type: Number, default: 0 },
    totalFeedbacks: { type: Number, default: 0 },
}, { timestamps: true });

const Faculty = mongoose.model('Faculty', facultySchema);

// Metric Model
const metricSchema = new mongoose.Schema({
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    semester: { type: String, required: true },
    academicYear: { type: String, required: true },
    teachingQualityScore: { type: Number, required: true },
    researchContribution: { type: Number, required: true },
    syllabusCompletion: { type: Number, required: true },
    attendanceCompliance: { type: Number, required: true },
    studentPassRate: { type: Number, required: true },
    innovativeTeaching: { type: Number, required: true },
    overallScore: { type: Number, required: true },
    evaluatedAt: { type: Date, default: Date.now },
    evaluatedBy: { type: String }, // Admin name or ID
}, { timestamps: true });

const Metric = mongoose.model('Metric', metricSchema);

// Feedback Model
const feedbackSchema = new mongoose.Schema({
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    semester: { type: String, required: true },
    academicYear: { type: String, required: true },
    ratings: {
        teachingEffectiveness: { type: Number, required: true },
        subjectKnowledge: { type: Number, required: true },
        communication: { type: Number, required: true },
        punctuality: { type: Number, required: true },
        courseContent: { type: Number, required: true },
        studentEngagement: { type: Number, required: true },
        assessmentFairness: { type: Number, required: true },
        overallSatisfaction: { type: Number, required: true },
    },
    comments: { type: String },
    submittedAt: { type: Date, default: Date.now },
    isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = { Course, Faculty, Metric, Feedback };
