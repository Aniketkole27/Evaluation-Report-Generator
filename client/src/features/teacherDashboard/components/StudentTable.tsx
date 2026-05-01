import { useState } from 'react';
import { Mail, Phone, MoreHorizontal, TrendingUp, TrendingDown, Eye, ChevronLeft, ChevronRight, X, MapPin, User, BookOpen, Calendar, Users } from 'lucide-react';

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  score: number;
  trend: string;
  lastActive: string;
  // Extended fields from data.json
  rollNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  class?: string;
  section?: string;
  division?: string;
  attendance?: number;
  subjects?: Record<string, number>;
  totalMarks?: number;
  percentage?: number;
  grade?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
}

interface StudentTableProps {
  students: Student[];
}

const PAGE_SIZE = 5;

const gradeColor = (grade: string) => {
  if (grade === 'A+') return 'bg-green-500/15 text-green-500 border-green-500/30';
  if (grade === 'A')  return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
  if (grade === 'B+') return 'bg-indigo-500/15 text-indigo-500 border-indigo-500/30';
  if (grade === 'B')  return 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30';
  return 'bg-red-500/15 text-red-500 border-red-500/30';
};

const scoreBarColor = (marks: number) =>
  marks >= 85 ? 'bg-green-500' : marks >= 70 ? 'bg-blue-500' : marks >= 50 ? 'bg-yellow-500' : 'bg-red-500';

export const StudentTable = ({ students }: StudentTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const totalPages = Math.ceil(students.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginated = students.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <>
      <div className="bg-bg-secondary rounded-2xl border border-border-subtle overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-primary/30 text-xs font-bold text-text-secondary uppercase tracking-wider">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-center">Avg. Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {paginated.map((student) => (
                <tr key={student.id} className="hover:bg-bg-primary/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-btn-bg/10 text-btn-bg flex items-center justify-center font-bold text-sm border border-btn-bg/20">
                        {student.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{student.name}</p>
                        <p className="text-xs text-text-secondary">{student.rollNumber ?? `Last active ${student.lastActive}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-text-secondary">
                        <Mail size={12} className="mr-1.5" />
                        {student.email}
                      </div>
                      <div className="flex items-center text-xs text-text-secondary">
                        <Phone size={12} className="mr-1.5" />
                        {student.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-text-primary">{student.score}%</span>
                        {student.trend === 'up' ? (
                          <TrendingUp size={14} className="text-green-500" />
                        ) : (
                          <TrendingDown size={14} className="text-red-500" />
                        )}
                      </div>
                      <div className="w-24 h-1.5 bg-border-subtle rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${student.score > 80 ? 'bg-green-500' : student.score > 60 ? 'bg-blue-500' : 'bg-red-500'}`}
                          style={{ width: `${student.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      student.score > 80 ? 'bg-green-500/10 text-green-500' :
                      student.score > 60 ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {student.score > 80 ? 'Excellent' : student.score > 60 ? 'Good' : 'Needs Review'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 text-text-secondary hover:text-btn-bg hover:bg-btn-bg/10 rounded-lg transition-colors"
                        title="View full profile"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-border-subtle rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-bg-primary/20 border-t border-border-subtle flex items-center justify-between">
          <p className="text-xs text-text-secondary font-medium">
            Showing {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, students.length)} of {students.length} students
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-1.5 border border-border-subtle rounded-lg text-xs font-bold text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} className="mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    page === currentPage
                      ? 'bg-btn-bg text-btn-text shadow-sm'
                      : 'text-text-secondary hover:bg-bg-secondary border border-border-subtle'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-1.5 border border-border-subtle rounded-lg text-xs font-bold text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setSelectedStudent(null)}
          />
          <div className="relative w-full max-w-2xl bg-bg-secondary border border-border-strong rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-bg-primary/40 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-2xl bg-btn-bg/10 text-btn-bg flex items-center justify-center font-black text-lg border border-btn-bg/20">
                  {selectedStudent.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-black text-text-primary">{selectedStudent.name}</h2>
                  <p className="text-sm text-text-secondary font-medium">{selectedStudent.rollNumber} · Class {selectedStudent.class}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {selectedStudent.grade && (
                  <span className={`px-3 py-1 rounded-full text-sm font-black border ${gradeColor(selectedStudent.grade)}`}>
                    Grade {selectedStudent.grade}
                  </span>
                )}
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-6 space-y-6">

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <User size={14} />, label: 'Gender', value: selectedStudent.gender },
                  { icon: <Calendar size={14} />, label: 'Date of Birth', value: selectedStudent.dateOfBirth },
                  { icon: <BookOpen size={14} />, label: 'Division', value: selectedStudent.division },
                  { icon: <BookOpen size={14} />, label: 'Section', value: `Section ${selectedStudent.section}` },
                  { icon: <Mail size={14} />, label: 'Email', value: selectedStudent.email },
                  { icon: <Phone size={14} />, label: 'Phone', value: selectedStudent.phone },
                ].map(({ icon, label, value }) => value && (
                  <div key={label} className="bg-bg-primary/50 rounded-2xl p-4 border border-border-subtle">
                    <div className="flex items-center space-x-2 text-text-secondary mb-1">
                      {icon}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-sm font-bold text-text-primary">{value}</p>
                  </div>
                ))}
              </div>

              {/* Attendance & Performance */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-bg-primary/50 rounded-2xl p-4 border border-border-subtle text-center">
                  <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Attendance</p>
                  <p className={`text-2xl font-black ${(selectedStudent.attendance ?? 0) >= 85 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedStudent.attendance}%
                  </p>
                </div>
                <div className="bg-bg-primary/50 rounded-2xl p-4 border border-border-subtle text-center">
                  <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Total Marks</p>
                  <p className="text-2xl font-black text-text-primary">{selectedStudent.totalMarks}</p>
                </div>
                <div className="bg-bg-primary/50 rounded-2xl p-4 border border-border-subtle text-center">
                  <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Percentage</p>
                  <p className="text-2xl font-black text-btn-bg">{selectedStudent.percentage}%</p>
                </div>
              </div>

              {/* Subject-wise Marks */}
              {selectedStudent.subjects && Object.keys(selectedStudent.subjects).length > 0 && (
                <div className="bg-bg-primary/50 rounded-2xl p-5 border border-border-subtle">
                  <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest mb-4">Subject-wise Marks</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedStudent.subjects).map(([subject, marks]) => (
                      <div key={subject}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-text-primary">{subject}</span>
                          <span className="text-xs font-black text-text-primary">{marks}/100</span>
                        </div>
                        <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${scoreBarColor(marks)}`}
                            style={{ width: `${marks}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parent & Address */}
              <div className="grid grid-cols-1 gap-4">
                {selectedStudent.parentName && (
                  <div className="bg-bg-primary/50 rounded-2xl p-4 border border-border-subtle flex items-start space-x-3">
                    <div className="p-2 bg-btn-bg/10 rounded-xl text-btn-bg flex-shrink-0">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">Parent / Guardian</p>
                      <p className="text-sm font-bold text-text-primary">{selectedStudent.parentName}</p>
                      <p className="text-xs text-text-secondary">{selectedStudent.parentPhone}</p>
                    </div>
                  </div>
                )}
                {selectedStudent.address && (
                  <div className="bg-bg-primary/50 rounded-2xl p-4 border border-border-subtle flex items-start space-x-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 flex-shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">Address</p>
                      <p className="text-sm font-bold text-text-primary">{selectedStudent.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border-subtle bg-bg-primary/30 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2.5 bg-btn-bg text-btn-text rounded-xl font-bold hover:bg-btn-hover transition-all text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

