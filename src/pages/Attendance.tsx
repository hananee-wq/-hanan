import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Mock students for demonstration
const mockStudents = [
  { id: 'student_1', studentId: '67001', name: 'เด็กชาย สมชาย เรียนดี', number: 1 },
  { id: 'student_2', studentId: '67002', name: 'เด็กหญิง สมหญิง รักเรียน', number: 2 },
  { id: 'student_3', studentId: '67003', name: 'เด็กชาย มานะ อดทน', number: 3 },
  { id: 'student_4', studentId: '67004', name: 'เด็กหญิง ปิติ ยินดี', number: 4 },
  { id: 'student_5', studentId: '67005', name: 'เด็กชาย ชูใจ ไชโย', number: 5 },
];

const mockRooms = [
  'ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.2/2', 'ม.3/1', 'ม.3/2',
  'ม.4/1', 'ม.4/2', 'ม.5/1', 'ม.5/2', 'ม.6/1', 'ม.6/2'
];

type AttendanceStatus = 'มา' | 'ขาด' | 'ลา' | 'มาสาย' | '';

export default function Attendance() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const type = location.state?.type || 'lineup';
  const [period, setPeriod] = useState<'morning' | 'evening'>(location.state?.defaultTab || 'morning');
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRoom, setSelectedRoom] = useState(mockRooms[0]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setNotes(prev => ({ ...prev, [studentId]: note }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving to database
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const markAllAs = (status: AttendanceStatus) => {
    const newAttendance: Record<string, AttendanceStatus> = {};
    mockStudents.forEach(s => {
      newAttendance[s.id] = status;
    });
    setAttendance(newAttendance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden pb-12">
      {/* Decorative background */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
      
      {/* Top Navigation */}
      <nav className="glass-panel rounded-none border-t-0 border-l-0 border-r-0 sticky top-0 z-50 px-6 py-4 flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-indigo-900 leading-tight">
              {type === 'homeroom' ? 'บันทึกโฮมรูม (ช่วงเช้า)' : 'บันทึกการเข้าแถว'}
            </h1>
            <p className="text-xs text-indigo-600">ชั้น {selectedRoom}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-sm text-right">
            <p className="font-semibold text-indigo-900">{currentUser?.name}</p>
            <p className="text-xs text-indigo-500">ครูประจำชั้น</p>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="glass-panel p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white/40 p-4 rounded-xl border border-white/60">
            <div className="flex-1">
              <label className="block text-sm font-medium text-indigo-900 mb-1.5 ml-1">วันที่</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-lg text-indigo-900 bg-white/50 border-white/60 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-indigo-900 mb-1.5 ml-1">ห้องเรียน</label>
              <select 
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-lg text-indigo-900 bg-white/50 border-white/60 focus:ring-indigo-500 appearance-none"
              >
                {mockRooms.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            {type === 'lineup' ? (
              <div className="flex bg-white/50 p-1 rounded-xl border border-white/60 w-full md:w-auto">
                <button 
                  onClick={() => setPeriod('morning')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${period === 'morning' ? 'bg-amber-100 text-amber-700 shadow-sm' : 'text-indigo-600 hover:bg-white/40'}`}
                >
                  <Sun size={18} />
                  ช่วงเช้า
                </button>
                <button 
                  onClick={() => setPeriod('evening')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${period === 'evening' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-indigo-600 hover:bg-white/40'}`}
                >
                  <Moon size={18} />
                  ช่วงเย็น
                </button>
              </div>
            ) : (
              <div className="flex bg-white/50 p-1 rounded-xl border border-white/60 w-full md:w-auto">
                <div className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-amber-100 text-amber-700 shadow-sm">
                  <Sun size={18} />
                  ช่วงเช้า
                </div>
              </div>
            )}
            
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => markAllAs('มา')} className="flex-1 md:flex-none px-4 py-2 bg-emerald-100/80 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-medium transition-colors border border-emerald-200">
                มาทั้งหมด
              </button>
            </div>
          </div>

          {saveSuccess && (
            <div className="mb-6 p-4 bg-emerald-100/80 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
              <CheckCircle2 size={20} />
              <span className="font-medium">บันทึกข้อมูลสำเร็จ!</span>
            </div>
          )}

          <div className="overflow-x-auto bg-white/40 rounded-xl border border-white/60">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-indigo-50/80 text-indigo-900 border-b border-indigo-100">
                <tr>
                  <th className="p-4 font-semibold w-16 text-center">เลขที่</th>
                  <th className="p-4 font-semibold w-24">รหัส</th>
                  <th className="p-4 font-semibold">ชื่อ - นามสกุล</th>
                  <th className="p-4 font-semibold text-center w-20">มา</th>
                  <th className="p-4 font-semibold text-center w-20">ขาด</th>
                  <th className="p-4 font-semibold text-center w-20">ลา</th>
                  <th className="p-4 font-semibold text-center w-20">มาสาย</th>
                  <th className="p-4 font-semibold w-48">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {mockStudents.map((student) => (
                  <tr key={student.id} className="border-b border-indigo-50/50 hover:bg-white/60 transition-colors">
                    <td className="p-4 text-center text-indigo-600 font-medium">{student.number}</td>
                    <td className="p-4 text-indigo-500 font-mono text-xs">{student.studentId}</td>
                    <td className="p-4 font-medium text-indigo-900">{student.name}</td>
                    
                    <td className="p-4 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name={`status-${student.id}`} 
                          checked={attendance[student.id] === 'มา'}
                          onChange={() => handleStatusChange(student.id, 'มา')}
                          className="w-5 h-5 text-emerald-500 border-gray-300 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                        />
                      </label>
                    </td>
                    <td className="p-4 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name={`status-${student.id}`} 
                          checked={attendance[student.id] === 'ขาด'}
                          onChange={() => handleStatusChange(student.id, 'ขาด')}
                          className="w-5 h-5 text-rose-500 border-gray-300 focus:ring-rose-500 cursor-pointer accent-rose-500"
                        />
                      </label>
                    </td>
                    <td className="p-4 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name={`status-${student.id}`} 
                          checked={attendance[student.id] === 'ลา'}
                          onChange={() => handleStatusChange(student.id, 'ลา')}
                          className="w-5 h-5 text-purple-500 border-gray-300 focus:ring-purple-500 cursor-pointer accent-purple-500"
                        />
                      </label>
                    </td>
                    <td className="p-4 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name={`status-${student.id}`} 
                          checked={attendance[student.id] === 'มาสาย'}
                          onChange={() => handleStatusChange(student.id, 'มาสาย')}
                          className="w-5 h-5 text-amber-500 border-gray-300 focus:ring-amber-500 cursor-pointer accent-amber-500"
                        />
                      </label>
                    </td>
                    <td className="p-4">
                      <input 
                        type="text" 
                        value={notes[student.id] || ''}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        placeholder="ระบุสาเหตุ..."
                        className="glass-input w-full px-3 py-1.5 text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="glass-button-primary px-8 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={20} />
              )}
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
