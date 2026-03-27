import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, Filter, CheckCircle2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const dailyData = [
  { name: 'ม.1', present: 250, absent: 5, leave: 10, late: 8 },
  { name: 'ม.2', present: 240, absent: 8, leave: 5, late: 12 },
  { name: 'ม.3', present: 235, absent: 10, leave: 8, late: 5 },
  { name: 'ม.4', present: 220, absent: 15, leave: 12, late: 10 },
  { name: 'ม.5', present: 210, absent: 12, leave: 15, late: 8 },
  { name: 'ม.6', present: 200, absent: 20, leave: 10, late: 15 },
];

const trendData = [
  { date: '1 มี.ค.', present: 95 },
  { date: '2 มี.ค.', present: 94 },
  { date: '3 มี.ค.', present: 96 },
  { date: '4 มี.ค.', present: 92 },
  { date: '5 มี.ค.', present: 95 },
  { date: '8 มี.ค.', present: 97 },
  { date: '9 มี.ค.', present: 93 },
];

const pieColors = ['#6ee7b7', '#fda4af', '#d8b4fe', '#fcd34d'];

export default function Reports() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'term'>('daily');
  const [reportType, setReportType] = useState<'homeroom' | 'lineup'>('homeroom');
  const [toastMessage, setToastMessage] = useState('');

  const generateCSV = () => {
    // Add BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF';
    const typeName = reportType === 'homeroom' ? 'โฮมรูม' : 'เข้าแถว';
    const timeName = timeframe === 'daily' ? 'รายวัน' : timeframe === 'weekly' ? 'รายสัปดาห์' : timeframe === 'monthly' ? 'รายเดือน' : 'รายเทอม';
    
    let csv = BOM + `รายงานสรุปการเข้าเรียน (${typeName}) - แบบ${timeName}\n\n`;
    csv += 'ห้องเรียน,จำนวนนักเรียนทั้งหมด,มา,ขาด,ลา,มาสาย,ร้อยละการมาเรียน\n';

    const rooms = ['ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.2/2', 'ม.3/1', 'ม.3/2', 'ม.4/1', 'ม.4/2', 'ม.5/1', 'ม.5/2', 'ม.6/1', 'ม.6/2'];
    
    rooms.forEach(room => {
      const total = 40; // สมมติห้องละ 40 คน
      const multiplier = timeframe === 'daily' ? 1 : timeframe === 'weekly' ? 5 : timeframe === 'monthly' ? 20 : 100;
      const totalExpected = total * multiplier;
      
      const present = Math.floor(totalExpected * (0.85 + Math.random() * 0.1));
      const absent = Math.floor(totalExpected * 0.05 * Math.random());
      const leave = Math.floor(totalExpected * 0.05 * Math.random());
      const late = totalExpected - present - absent - leave;
      const percent = ((present / totalExpected) * 100).toFixed(2);
      
      csv += `${room},${totalExpected},${present},${absent},${leave},${late},${percent}%\n`;
    });

    return csv;
  };

  const handleExport = () => {
    setToastMessage('กำลังสร้างไฟล์รายงาน...');
    setTimeout(() => {
      const csvContent = generateCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `รายงาน${reportType === 'homeroom' ? 'โฮมรูม' : 'เข้าแถว'}_${timeframe}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage('ดาวน์โหลดไฟล์รายงานสำเร็จ!');
      setTimeout(() => setToastMessage(''), 3000);
    }, 1500);
  };

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
          <h1 className="text-lg font-bold text-indigo-900 leading-tight">รายงานสรุปการเข้าเรียน</h1>
          <p className="text-xs text-indigo-600">วิเคราะห์ข้อมูลการเข้าโฮมรูมและการเข้าแถว</p>
        </div>
        <div className="w-1/4 flex justify-end">
          <button onClick={handleExport} className="glass-button-primary px-4 py-2 rounded-xl font-medium flex items-center gap-2">
            <Download size={18} />
            <span className="hidden sm:inline">ส่งออก PDF/Excel</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 relative z-10">
        {toastMessage && (
          <div className="fixed top-24 right-6 z-50 p-4 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={20} />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex bg-white/50 p-1 rounded-xl border border-white/60 w-full md:w-auto">
            <button 
              onClick={() => setReportType('homeroom')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-medium transition-all ${reportType === 'homeroom' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-indigo-600 hover:bg-white/40'}`}
            >
              โฮมรูม
            </button>
            <button 
              onClick={() => setReportType('lineup')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-medium transition-all ${reportType === 'lineup' ? 'bg-amber-100 text-amber-700 shadow-sm' : 'text-indigo-600 hover:bg-white/40'}`}
            >
              การเข้าแถว
            </button>
          </div>

          <div className="flex bg-white/50 p-1 rounded-xl border border-white/60 w-full md:w-auto">
            <button 
              onClick={() => setTimeframe('daily')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeframe === 'daily' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-600 hover:bg-white/40'}`}
            >
              รายวัน
            </button>
            <button 
              onClick={() => setTimeframe('weekly')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeframe === 'weekly' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-600 hover:bg-white/40'}`}
            >
              รายสัปดาห์
            </button>
            <button 
              onClick={() => setTimeframe('monthly')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeframe === 'monthly' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-600 hover:bg-white/40'}`}
            >
              รายเดือน
            </button>
            <button 
              onClick={() => setTimeframe('term')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeframe === 'term' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-600 hover:bg-white/40'}`}
            >
              รายเทอม
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Summary Cards */}
          <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-medium text-indigo-600 mb-2">อัตราการมาเรียนเฉลี่ย</h3>
            <div className="text-5xl font-bold text-emerald-500 mb-2">94.5%</div>
            <p className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+1.2% จากช่วงก่อนหน้า</p>
          </div>
          <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-medium text-indigo-600 mb-2">ขาดเรียนสะสม</h3>
            <div className="text-5xl font-bold text-rose-500 mb-2">70</div>
            <p className="text-xs text-rose-600 bg-rose-100 px-2 py-1 rounded-full">คน/ครั้ง</p>
          </div>
          <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-medium text-indigo-600 mb-2">มาสายสะสม</h3>
            <div className="text-5xl font-bold text-amber-500 mb-2">58</div>
            <p className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">คน/ครั้ง</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-indigo-900 mb-6">สถิติแยกตามระดับชั้น</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(167, 139, 250, 0.2)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4f46e5', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4f46e5', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(167, 139, 250, 0.1)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="present" name="มา" stackId="a" fill="#6ee7b7" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="late" name="มาสาย" stackId="a" fill="#fcd34d" />
                  <Bar dataKey="leave" name="ลา" stackId="a" fill="#d8b4fe" />
                  <Bar dataKey="absent" name="ขาด" stackId="a" fill="#fda4af" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-indigo-900 mb-6">แนวโน้มการมาเรียน (%)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(167, 139, 250, 0.2)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#4f46e5', fontSize: 12 }} dy={10} />
                  <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fill: '#4f46e5', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="present" name="% มาเรียน" stroke="#6ee7b7" strokeWidth={4} dot={{ r: 4, fill: '#6ee7b7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
