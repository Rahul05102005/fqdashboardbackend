const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const { Faculty, Course, Metric, Feedback } = require('./models/index');

dotenv.config();

const seedData = async () => {
    try {
        // Ensure database connection is ready
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Check if data already exists
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Data already exists in the database. Skipping seed to prevent data loss.');
            console.log('To force seed, please clear the database manually or use the --force flag (not implemented).');
            process.exit(0);
        }

        // Clear existing data by dropping the database
        // This ensures all legacy indexes (like the ghost 'user_1' index) are removed
        if (mongoose.connection.db) {
            await mongoose.connection.db.dropDatabase();
            console.log('Database Dropped and Cleared...');
        } else {
            console.log('Connection established but DB handle missing. Deleting collections instead.');
            await User.deleteMany();
            await Faculty.deleteMany();
            await Course.deleteMany();
            await Metric.deleteMany();
            await Feedback.deleteMany();
        }


        // Create Users
        const users = await User.create([
            {
                name: 'Dr. Sarah Johnson',
                email: 'admin@university.edu',
                password: 'admin123',
                role: 'admin',
                department: 'Administration'
            },
            {
                name: 'Prof. Michael Chen',
                email: 'faculty@university.edu',
                password: 'faculty123',
                role: 'faculty',
                department: 'Computer Science'
            },
            {
                name: 'John Smith',
                email: 'student@university.edu',
                password: 'student123',
                role: 'student',
                department: 'Computer Science'
            }
        ]);

        console.log('Initial Users Created...');

        // Create Courses
        const courses = await Course.create([
            { code: 'CS101', name: 'Introduction to Computer Science', semester: 1, credits: 4, department: 'Computer Science' },
            { code: 'CS202', name: 'Data Structures & Algorithms', semester: 3, credits: 4, department: 'Computer Science' },
            { code: 'ME101', name: 'Thermodynamics', semester: 2, credits: 3, department: 'Mechanical Engineering' },
            { code: 'EE201', name: 'Circuit Theory', semester: 3, credits: 4, department: 'Electrical Engineering' },
            { code: 'MA101', name: 'Applied Mathematics', semester: 1, credits: 4, department: 'General Sciences' },
            { code: 'HUM101', name: 'Professional Ethics', semester: 4, credits: 2, department: 'Humanities' }
        ]);

        console.log('6 Courses Created...');

        // Create Users & Faculty Profiles for extra faculties
        const facultyData = [
            { name: 'Dr. Emily Watson', email: 'emily.watson@university.edu', department: 'Mechanical Engineering', designation: 'Associate Professor', courses: [courses[2]._id] },
            { name: 'Dr. Robert Miller', email: 'robert.miller@university.edu', department: 'Electrical Engineering', designation: 'Professor', courses: [courses[3]._id] },
            { name: 'Dr. Linda Garcia', email: 'linda.garcia@university.edu', department: 'Computer Science', designation: 'Assistant Professor', courses: [courses[1]._id] },
            { name: 'Prof. David Wilson', email: 'david.wilson@university.edu', department: 'General Sciences', designation: 'Professor', courses: [courses[4]._id] },
            { name: 'Dr. Susan Brown', email: 'susan.brown@university.edu', department: 'Humanities', designation: 'Associate Professor', courses: [courses[5]._id] },
            { name: 'Dr. James Taylor', email: 'james.taylor@university.edu', department: 'Computer Science', designation: 'Assistant Professor', courses: [courses[0]._id] },
            { name: 'Prof. Mary Anderson', email: 'mary.anderson@university.edu', department: 'Mechanical Engineering', designation: 'Professor', courses: [courses[2]._id] },
            { name: 'Dr. Richard Moore', email: 'richard.moore@university.edu', department: 'Electrical Engineering', designation: 'Associate Professor', courses: [courses[3]._id] },
            { name: 'Dr. Patricia White', email: 'patricia.white@university.edu', department: 'General Sciences', designation: 'Assistant Professor', courses: [courses[4]._id] }
        ];

        // Add the initial faculty user profile too
        const profMichael = await Faculty.create({
            userId: users[1]._id,
            name: users[1].name,
            email: users[1].email,
            department: users[1].department,
            designation: 'Professor',
            qualification: 'Ph.D. in Computer Science',
            experience: 15,
            specialization: ['Computer Science', 'Algorithms'],
            joiningDate: new Date('2015-08-15'),
            status: 'active',
            coursesAssigned: [courses[0]._id, courses[1]._id],
            averageRating: 4.8,
            totalFeedbacks: 25
        });

        for (const faculty of facultyData) {
            const user = await User.create({
                name: faculty.name,
                email: faculty.email,
                password: 'faculty123',
                role: 'faculty',
                department: faculty.department
            });

            const profile = await Faculty.create({
                userId: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                designation: faculty.designation,
                qualification: 'Ph.D. in ' + faculty.department,
                experience: Math.floor(Math.random() * 20) + 5,
                specialization: [faculty.department, 'Research'],
                joiningDate: new Date('2018-08-15'),
                status: 'active',
                coursesAssigned: faculty.courses,
                averageRating: (Math.random() * 2 + 3).toFixed(1),
                totalFeedbacks: Math.floor(Math.random() * 50) + 10
            });

            // Create multi-semester metrics for Prof Michael
            const semestersData = [
                { sem: 'Semester 1', year: '2023-24', score: 85 },
                { sem: 'Semester 2', year: '2023-24', score: 88 },
                { sem: 'Semester 3', year: '2024-25', score: 91 },
                { sem: 'Semester 4', year: '2024-25', score: 94 }
            ];

            for (const semData of semestersData) {
                await Metric.create({
                    facultyId: profile._id,
                    semester: semData.sem,
                    academicYear: semData.year,
                    teachingQualityScore: semData.score + Math.floor(Math.random() * 5),
                    researchContribution: semData.score - Math.floor(Math.random() * 10),
                    syllabusCompletion: 95 + Math.floor(Math.random() * 5),
                    attendanceCompliance: 92 + Math.floor(Math.random() * 6),
                    studentPassRate: 85 + Math.floor(Math.random() * 10),
                    innovativeTeaching: semData.score - 5,
                    overallScore: semData.score,
                    evaluatedBy: 'Dr. Sarah Johnson'
                });
            }

        }

        console.log('10 Faculty Members with Metrics seeded...');

        // Initial feedbacks for Prof Michael
        await Feedback.create([
            {
                facultyId: profMichael._id,
                courseId: courses[0]._id,
                studentId: users[2]._id,
                semester: 'Spring',
                academicYear: '2023-24',
                ratings: {
                    teachingEffectiveness: 5,
                    subjectKnowledge: 5,
                    communication: 4,
                    punctuality: 5,
                    courseContent: 4,
                    studentEngagement: 5,
                    assessmentFairness: 4,
                    overallSatisfaction: 5
                },
                comments: 'Excellent teaching style, very engaging lectures.',
                submittedAt: new Date('2024-03-15'),
                isAnonymous: false
            },
            {
                facultyId: profMichael._id,
                courseId: courses[1]._id,
                studentId: users[2]._id,
                semester: 'Spring',
                academicYear: '2023-24',
                ratings: {
                    teachingEffectiveness: 4,
                    subjectKnowledge: 5,
                    communication: 5,
                    punctuality: 4,
                    courseContent: 5,
                    studentEngagement: 4,
                    assessmentFairness: 5,
                    overallSatisfaction: 5
                },
                comments: 'Highly knowledgeable and supportive. The course content was very relevant.',
                submittedAt: new Date('2024-12-10'),
                isAnonymous: true
            }
        ]);


        console.log('Initial Feedback Created...');
        console.log('Data Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
