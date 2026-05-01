import { StudentTable, type Student } from '../components/StudentTable';
import rawStudents from '../../../utils/data.json';

const StudentList = () => {
  const students: Student[] = rawStudents.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    avatar: s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    score: s.percentage,
    trend: s.percentage >= 75 ? 'up' : 'down',
    lastActive: 'Recently',
    // Extended fields
    rollNumber: s.rollNumber,
    gender: s.gender,
    dateOfBirth: s.dateOfBirth,
    class: s.class,
    section: s.section,
    division: s.division,
    attendance: s.attendance,
    subjects: s.subjects,
    totalMarks: s.totalMarks,
    percentage: s.percentage,
    grade: s.grade,
    parentName: s.parentName,
    parentPhone: s.parentPhone,
    address: s.address,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Student Management</h1>
          <p className="text-text-secondary mt-1">Manage your students and track their individual performance.</p>
        </div>
        <button className="bg-btn-bg text-btn-text px-6 py-3 rounded-xl font-bold hover:bg-btn-hover transition-all flex items-center justify-center">
          Add New Student
        </button>
      </div>

      <StudentTable students={students} />
    </div>
  );
};

export default StudentList;
