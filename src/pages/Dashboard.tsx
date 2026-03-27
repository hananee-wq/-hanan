import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Modality } from '@google/genai';
import { 
  Users, UserCheck, UserX, Clock, 
  LogOut, Search, Filter, Download, 
  Bell, ChevronDown, Activity, Calendar,
  Volume2, Settings, FileText, Sun, Moon, CheckCircle2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Mock Data
const statsData = [
  { title: 'นักเรียนทั้งหมด', value: '1,250', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100/50' },
  { title: 'มา', value: '1,150', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-100/50' },
  { title: 'ขาด', value: '45', icon: UserX, color: 'text-rose-500', bg: 'bg-rose-100/50' },
  { title: 'ลา', value: '30', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-100/50' },
  { title: 'มาสาย', value: '25', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100/50' },
];

const weeklyData = [
  { name: 'จันทร์', present: 1150, absent: 30, leave: 50, late: 20 },
  { name: 'อังคาร', present: 1190, absent: 40, leave: 10, late: 10 },
  { name: 'พุธ', present: 1210, absent: 25, leave: 5, late: 10 },
  { name: 'พฤหัสฯ', present: 1180, absent: 45, leave: 15, late: 10 },
  { name: 'ศุกร์', present: 1150, absent: 60, leave: 20, late: 20 },
];

const pieData = [
  { name: 'มา', value: 1150, color: '#6ee7b7' }, // Brighter Pastel Green
  { name: 'ขาด', value: 45, color: '#fda4af' },  // Brighter Pastel Pink
  { name: 'ลา', value: 30, color: '#d8b4fe' },   // Brighter Pastel Purple
  { name: 'มาสาย', value: 25, color: '#fcd34d' },  // Brighter Pastel Yellow
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [toastMessage, setToastMessage] = useState('');

  const handleExport = () => {
    setToastMessage('กำลังเตรียมไฟล์รายงาน...');
    setTimeout(() => {
      setToastMessage('ดาวน์โหลดรายงานสำเร็จ!');
      setTimeout(() => setToastMessage(''), 3000);
    }, 1500);
  };

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: 'ยินดีต้อนรับเข้าสู่ระบบบันทึกโฮมรูมและการเข้าแถวของนักเรียน โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ยะลา' }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="fixed bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Top Navigation */}
      <nav className="glass-panel rounded-none border-t-0 border-l-0 border-r-0 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="w-1/4 flex items-center gap-2">
          <button 
            onClick={handleSpeak}
            className={`p-2 rounded-full transition-all ${isSpeaking ? 'bg-indigo-200 text-indigo-700 animate-pulse' : 'hover:bg-indigo-100 text-indigo-600'}`}
            title="อ่านข้อความต้อนรับ"
          >
            <Volume2 size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <img src="https://img2.imgbiz.com/imgbiz/logo-design.png" alt="Logo" className="h-12 w-auto drop-shadow-sm mb-1" referrerPolicy="no-referrer" />
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-indigo-900 leading-tight">ระบบบันทึก Home Room และการเข้าแถว</h1>
            <p className="text-xs text-indigo-600">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ยะลา</p>
          </div>
        </div>
        
        <div className="w-1/4 flex items-center justify-end gap-4">
          <button className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600 relative transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors"
              title="ตั้งค่าระบบ"
            >
              <Settings size={20} />
            </button>
          )}
          <div className="flex items-center gap-3 pl-4 border-l border-indigo-200">
            <div className="hidden md:block text-sm text-right">
              <p className="font-semibold text-indigo-900">{currentUser?.name || 'ผู้ใช้งาน'}</p>
              <p className="text-xs text-indigo-500">{currentUser?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ครูประจำชั้น'}</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-rose-100 text-rose-500 rounded-full transition-colors ml-2" title="ออกจากระบบ">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {toastMessage && (
          <div className="fixed top-24 right-6 z-50 p-4 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={20} />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
              <Activity className="text-indigo-500" />
              ภาพรวมระบบ (Dashboard)
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-indigo-600/80">ข้อมูลสถิติประจำวันที่</p>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="glass-input px-3 py-1 rounded-lg text-sm text-indigo-900 border-indigo-100 bg-white/50"
              />
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button className="glass-button flex-1 md:flex-none px-4 py-2 rounded-xl text-indigo-700 font-medium flex items-center justify-center gap-2">
              <Calendar size={18} />
              <span>วันนี้</span>
              <ChevronDown size={16} />
            </button>
            <button onClick={handleExport} className="glass-button-primary flex-1 md:flex-none px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2">
              <Download size={18} />
              <span>ออกรายงาน</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="glass-panel p-4 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform duration-300">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner mb-2`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
              <p className="text-xs font-medium text-indigo-600/80 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-indigo-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Bar Chart */}
          <div className="glass-panel p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-indigo-900">สถิติการเข้าเรียนรายสัปดาห์</h3>
              <button className="p-2 hover:bg-indigo-100 rounded-full text-indigo-500 transition-colors">
                <Filter size={18} />
              </button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(167, 139, 250, 0.2)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4f46e5', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4f46e5', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(167, 139, 250, 0.1)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="present" name="มา" stackId="a" fill="#6ee7b7" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="late" name="มาสาย" stackId="a" fill="#fcd34d" />
                  <Bar dataKey="leave" name="ลา" stackId="a" fill="#d8b4fe" />
                  <Bar dataKey="absent" name="ขาด" stackId="a" fill="#fda4af" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-indigo-900 mb-6 text-center">สัดส่วนการเข้าเรียนวันนี้</h3>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-indigo-900">92%</span>
                <span className="text-xs text-indigo-500">มา</span>
              </div>
            </div>
            
            <div className="flex justify-center flex-wrap gap-4 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-medium text-indigo-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-indigo-900">เมนูด่วน (Quick Actions)</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/attendance', { state: { type: 'lineup', defaultTab: 'morning' } })}
                className="glass-button p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-indigo-700 hover:text-indigo-900"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Sun size={24} className="text-amber-600" />
                </div>
                <span className="font-medium text-sm text-center">บันทึกการเข้าแถว</span>
              </button>
              <button 
                onClick={() => navigate('/attendance', { state: { type: 'homeroom', defaultTab: 'morning' } })}
                className="glass-button p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-indigo-700 hover:text-indigo-900"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Sun size={24} className="text-indigo-600" />
                </div>
                <span className="font-medium text-sm text-center">บันทึกโฮมรูม</span>
              </button>
              <button 
                onClick={() => navigate('/students')}
                className="glass-button p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-indigo-700 hover:text-indigo-900"
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users size={24} className="text-purple-600" />
                </div>
                <span className="font-medium text-sm text-center">จัดการนักเรียน</span>
              </button>
              <button 
                onClick={() => navigate('/search')}
                className="glass-button p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-indigo-700 hover:text-indigo-900"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Search size={24} className="text-blue-600" />
                </div>
                <span className="font-medium text-sm text-center">ค้นหาข้อมูล</span>
              </button>
              <button 
                onClick={() => navigate('/reports')}
                className="glass-button p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-indigo-700 hover:text-indigo-900"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Download size={24} className="text-emerald-600" />
                </div>
                <span className="font-medium text-sm text-center">รายงานสรุป</span>
              </button>
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-indigo-900">แจ้งเตือนล่าสุด</h3>
              <button className="text-sm text-indigo-500 hover:text-indigo-700 font-medium">ดูทั้งหมด</button>
            </div>
            <div className="space-y-4">
              {[
                { text: 'ด.ช. สมชาย ใจดี ขาดเรียนติดต่อกัน 3 วัน', time: '10 นาทีที่แล้ว', type: 'danger' },
                { text: 'ม.3/2 ยังไม่ได้บันทึกโฮมรูมวันนี้', time: '1 ชั่วโมงที่แล้ว', type: 'warning' },
                { text: 'นำเข้ารายชื่อนักเรียน ม.1 สำเร็จ', time: '2 ชั่วโมงที่แล้ว', type: 'success' },
                { text: 'ด.ญ. สมหญิง รักเรียน มาสาย 5 ครั้งในเดือนนี้', time: 'เมื่อวาน', type: 'warning' },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/40 hover:bg-white/60 transition-colors">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    alert.type === 'danger' ? 'bg-rose-500' : 
                    alert.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-indigo-900">{alert.text}</p>
                    <p className="text-xs text-indigo-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
