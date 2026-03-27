import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, Filter, Calendar, Download, CheckCircle2 } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  name: string;
  room: string;
  type: 'homeroom' | 'lineup';
  status: 'มา' | 'ขาด' | 'ลา' | 'มาสาย';
  note?: string;
}

const mockRecords: AttendanceRecord[] = [
  { id: '1', date: '2026-03-26', studentId: '67001', name: 'เด็กชาย สมชาย เรียนดี', room: 'ม.1/1', type: 'lineup', status: 'มาสาย', note: 'รถติด' },
  { id: '2', date: '2026-03-26', studentId: '67002', name: 'เด็กหญิง สมหญิง รักเรียน', room: 'ม.1/1', type: 'homeroom', status: 'ขาด', note: 'ป่วย' },
  { id: '3', date: '2026-03-25', studentId: '67003', name: 'เด็กชาย มานะ อดทน', room: 'ม.1/2', type: 'lineup', status: 'ลา', note: 'ลากิจ' },
  { id: '4', date: '2026-03-25', studentId: '67004', name: 'เด็กหญิง ปิติ ยินดี', room: 'ม.2/1', type: 'homeroom', status: 'มาสาย', note: '' },
  { id: '5', date: '2026-03-24', studentId: '67005', name: 'เด็กชาย ชูใจ ไชโย', room: 'ม.3/1', type: 'lineup', status: 'ขาด', note: 'ไม่ทราบสาเหตุ' },
];

export default function Search() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleExport = () => {
    setToastMessage('กำลังเตรียมข้อมูล Excel...');
    setTimeout(() => {
      setToastMessage('ดาวน์โหลดไฟล์ Excel สำเร็จ!');
      setTimeout(() => setToastMessage(''), 3000);
    }, 1500);
  };

  const filteredRecords = mockRecords.filter(record => {
    const matchSearch = record.name.includes(searchTerm) || record.studentId.includes(searchTerm);
    const matchRoom = filterRoom ? record.room === filterRoom : true;
    const matchStatus = filterStatus ? record.status === filterStatus : true;
    const matchDate = filterDate ? record.date === filterDate : true;
    return matchSearch && matchRoom && matchStatus && matchDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative pb-12">
      <nav className="glass-panel rounded-none border-t-0 border-l-0 border-r-0 sticky top-0 z-40 px-6 py-4 flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-indigo-900 leading-tight">ค้นหาและกรองข้อมูล</h1>
            <p className="text-xs text-indigo-600">ค้นหาประวัติการเข้าเรียนย้อนหลัง</p>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 relative z-10">
        {toastMessage && (
          <div className="fixed top-24 right-6 z-50 p-4 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={20} />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}
        <div className="glass-panel p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative md:col-span-2">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อ หรือ รหัสประจำตัว..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-indigo-900"
              />
            </div>
            <div>
              <select 
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-indigo-900 appearance-none"
              >
                <option value="">ทุกห้องเรียน</option>
                <option value="ม.1/1">ม.1/1</option>
                <option value="ม.1/2">ม.1/2</option>
                <option value="ม.2/1">ม.2/1</option>
                <option value="ม.3/1">ม.3/1</option>
              </select>
            </div>
            <div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-indigo-900 appearance-none"
              >
                <option value="">ทุกสถานะ</option>
                <option value="ขาด">เฉพาะ ขาดเรียน</option>
                <option value="มาสาย">เฉพาะ มาสาย</option>
                <option value="ลา">เฉพาะ ลา</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                <input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-indigo-900"
                />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end items-center">
              <button onClick={handleExport} className="glass-button-primary px-6 py-2.5 rounded-xl font-medium flex items-center gap-2">
                <Download size={18} />
                <span>ส่งออกข้อมูล (Excel)</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white/40 rounded-xl border border-white/60">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-indigo-50/80 text-indigo-900 border-b border-indigo-100">
                <tr>
                  <th className="p-4 font-semibold w-24">วันที่</th>
                  <th className="p-4 font-semibold w-24">ประเภท</th>
                  <th className="p-4 font-semibold w-24">รหัส</th>
                  <th className="p-4 font-semibold">ชื่อ - นามสกุล</th>
                  <th className="p-4 font-semibold w-24 text-center">ห้องเรียน</th>
                  <th className="p-4 font-semibold w-24 text-center">สถานะ</th>
                  <th className="p-4 font-semibold w-48">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-indigo-50/50 hover:bg-white/60 transition-colors">
                    <td className="p-4 text-indigo-600">{new Date(record.date).toLocaleDateString('th-TH')}</td>
                    <td className="p-4 text-indigo-500">{record.type === 'homeroom' ? 'โฮมรูม' : 'เข้าแถว'}</td>
                    <td className="p-4 text-indigo-500 font-mono text-xs">{record.studentId}</td>
                    <td className="p-4 font-medium text-indigo-900">{record.name}</td>
                    <td className="p-4 text-center text-indigo-700">{record.room}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === 'มาสาย' ? 'bg-amber-100 text-amber-700' :
                        record.status === 'ขาด' ? 'bg-rose-100 text-rose-700' :
                        record.status === 'ลา' ? 'bg-purple-100 text-purple-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-indigo-600 text-xs">{record.note || '-'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-indigo-400">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
