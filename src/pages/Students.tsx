import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Upload, Edit2, Trash2, Search as SearchIcon, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Student {
  id: string;
  studentId: string;
  name: string;
  room: string;
  number: number;
}

const initialStudents: Student[] = [
  { id: '1', studentId: '67001', name: 'เด็กชาย สมชาย เรียนดี', room: 'ม.1/1', number: 1 },
  { id: '2', studentId: '67002', name: 'เด็กหญิง สมหญิง รักเรียน', room: 'ม.1/1', number: 2 },
  { id: '3', studentId: '67003', name: 'เด็กชาย มานะ อดทน', room: 'ม.1/2', number: 1 },
  { id: '4', studentId: '67004', name: 'เด็กหญิง ปิติ ยินดี', room: 'ม.2/1', number: 1 },
  { id: '5', studentId: '67005', name: 'เด็กชาย ชูใจ ไชโย', room: 'ม.3/1', number: 1 },
];

export default function Students() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [toastMessage, setToastMessage] = useState('');
  const [importRoom, setImportRoom] = useState('ม.1/1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = () => {
    if (!formData.studentId || !formData.name || !formData.room || !formData.number) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...formData } as Student : s));
      showToast('อัปเดตข้อมูลสำเร็จ');
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        studentId: formData.studentId,
        name: formData.name,
        room: formData.room,
        number: Number(formData.number)
      };
      setStudents([...students, newStudent]);
      showToast('เพิ่มนักเรียนสำเร็จ');
    }
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({});
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบนักเรียนคนนี้?')) {
      setStudents(students.filter(s => s.id !== id));
      showToast('ลบข้อมูลสำเร็จ');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file processing
      showToast(`กำลังนำเข้าข้อมูลจากไฟล์ ${file.name}...`);
      setTimeout(() => {
        const newMockStudents: Student[] = [
          { id: Date.now().toString() + '1', studentId: Math.floor(10000 + Math.random() * 90000).toString(), name: 'ด.ช. นำเข้า ทดสอบ1', room: importRoom, number: 10 },
          { id: Date.now().toString() + '2', studentId: Math.floor(10000 + Math.random() * 90000).toString(), name: 'ด.ญ. นำเข้า ทดสอบ2', room: importRoom, number: 11 },
          { id: Date.now().toString() + '3', studentId: Math.floor(10000 + Math.random() * 90000).toString(), name: 'ด.ช. นำเข้า ทดสอบ3', room: importRoom, number: 12 },
        ];
        setStudents(prev => [...prev, ...newMockStudents]);
        showToast(`นำเข้าข้อมูลนักเรียนห้อง ${importRoom} สำเร็จจำนวน 3 คน`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1500);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || 
    s.studentId.includes(searchTerm) || 
    s.room.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative pb-12">
      <nav className="glass-panel rounded-none border-t-0 border-l-0 border-r-0 sticky top-0 z-40 px-6 py-4 flex items-center justify-between mb-8">
        <div className="w-1/4 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <img src="https://img2.imgbiz.com/imgbiz/logo-design.png" alt="Logo" className="h-10 w-auto drop-shadow-sm mb-1" referrerPolicy="no-referrer" />
          <h1 className="text-lg font-bold text-indigo-900 leading-tight">จัดการข้อมูลนักเรียน</h1>
          <p className="text-xs text-indigo-600">เพิ่ม แก้ไข ลบ หรือนำเข้าข้อมูล</p>
        </div>
        <div className="w-1/4"></div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 relative z-10">
        {toastMessage && (
          <div className="fixed top-24 right-6 z-50 p-4 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={20} />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        <div className="glass-panel p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อ, รหัสประจำตัว, ห้องเรียน..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-indigo-900"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto items-center">
              <select 
                value={importRoom}
                onChange={(e) => setImportRoom(e.target.value)}
                className="glass-input px-3 py-2.5 rounded-xl text-indigo-900 text-sm bg-white/50"
              >
                <option value="ม.1/1">ม.1/1</option>
                <option value="ม.1/2">ม.1/2</option>
                <option value="ม.2/1">ม.2/1</option>
                <option value="ม.3/1">ม.3/1</option>
              </select>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/plain, *.*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="glass-button flex-1 md:flex-none px-4 py-2.5 rounded-xl text-indigo-700 font-medium flex items-center justify-center gap-2"
              >
                <Upload size={18} />
                <span>นำเข้าไฟล์</span>
              </button>
              <button 
                onClick={() => { setEditingStudent(null); setFormData({}); setIsModalOpen(true); }}
                className="glass-button-primary flex-1 md:flex-none px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                <span>เพิ่มนักเรียน</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white/40 rounded-xl border border-white/60">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-indigo-50/80 text-indigo-900 border-b border-indigo-100">
                <tr>
                  <th className="p-4 font-semibold w-24">รหัส</th>
                  <th className="p-4 font-semibold">ชื่อ - นามสกุล</th>
                  <th className="p-4 font-semibold w-24 text-center">ห้องเรียน</th>
                  <th className="p-4 font-semibold w-20 text-center">เลขที่</th>
                  <th className="p-4 font-semibold w-32 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-indigo-50/50 hover:bg-white/60 transition-colors">
                    <td className="p-4 text-indigo-500 font-mono text-xs">{student.studentId}</td>
                    <td className="p-4 font-medium text-indigo-900">{student.name}</td>
                    <td className="p-4 text-center text-indigo-700">{student.room}</td>
                    <td className="p-4 text-center text-indigo-600">{student.number}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(student)} className="p-1.5 text-amber-500 hover:bg-amber-100 rounded-lg transition-colors" title="แก้ไข">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(student.id)} className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors" title="ลบ">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-indigo-400">ไม่พบข้อมูลนักเรียน</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-900/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-indigo-50 flex justify-between items-center bg-indigo-50/50">
              <h3 className="text-lg font-bold text-indigo-900">
                {editingStudent ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-indigo-400 hover:text-indigo-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-900 mb-1">รหัสประจำตัว</label>
                <input 
                  type="text" 
                  value={formData.studentId || ''}
                  onChange={e => setFormData({...formData, studentId: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="เช่น 67001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-900 mb-1">ชื่อ - นามสกุล</label>
                <input 
                  type="text" 
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="เช่น เด็กชาย สมชาย เรียนดี"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-900 mb-1">ห้องเรียน</label>
                  <input 
                    type="text" 
                    value={formData.room || ''}
                    onChange={e => setFormData({...formData, room: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="เช่น ม.1/1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-900 mb-1">เลขที่</label>
                  <input 
                    type="number" 
                    value={formData.number || ''}
                    onChange={e => setFormData({...formData, number: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="เช่น 1"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
