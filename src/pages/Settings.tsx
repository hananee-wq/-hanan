import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, ShieldAlert, Folder, Calendar, 
  Layers, Plus, Trash2, Edit2, Save, X, Lock
} from 'lucide-react';
import { collection, getDocs, doc, setDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('academic');
  
  // Data States
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [gradeLevels, setGradeLevels] = useState<any[]>([]);
  const [storageSettings, setStorageSettings] = useState<any>({});
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, targetId: string, collection: string, name: string } | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [currentUser, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Academic Years
      const yearsSnapshot = await getDocs(collection(db, 'academic_years'));
      setAcademicYears(yearsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      // Fetch Grade Levels
      const gradesSnapshot = await getDocs(collection(db, 'grade_levels'));
      setGradeLevels(gradesSnapshot.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.order - b.order));

      // Fetch Storage Settings
      const storageDoc = await getDoc(doc(db, 'settings', 'storage'));
      if (storageDoc.exists()) {
        setStorageSettings(storageDoc.data());
      }
    } catch (error) {
      console.error("Error fetching settings data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    setDeleteError('');

    try {
      // 1. Verify Admin Password
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', currentUser?.username), where('password', '==', adminPassword));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setDeleteError('รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง');
        return;
      }

      // 2. Check for child records (Orphan protection)
      if (deleteModal.collection === 'grade_levels') {
        const classQ = query(collection(db, 'classrooms'), where('gradeLevelId', '==', deleteModal.targetId));
        const classSnapshot = await getDocs(classQ);
        if (!classSnapshot.empty) {
          setDeleteError(`ไม่สามารถลบได้ เนื่องจากมีห้องเรียนผูกอยู่กับระดับชั้นนี้ ${classSnapshot.size} ห้อง`);
          return;
        }
      }

      // 3. Delete the record
      await deleteDoc(doc(db, deleteModal.collection, deleteModal.targetId));
      
      // 4. Refresh data
      setDeleteModal(null);
      setAdminPassword('');
      fetchData();
      
    } catch (error) {
      console.error("Error deleting record:", error);
      setDeleteError('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleSaveStorage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'storage'), storageSettings);
      alert('บันทึกการตั้งค่าแฟ้มจัดเก็บสำเร็จ');
    } catch (error) {
      console.error("Error saving storage settings:", error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden pb-12">
      {/* Decorative background */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
      
      {/* Top Navigation */}
      <nav className="glass-panel rounded-none border-t-0 border-l-0 border-r-0 sticky top-0 z-50 px-6 py-4 flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src="https://img2.imgbiz.com/imgbiz/logo-design.png" alt="Logo" className="h-10 w-auto drop-shadow-sm" referrerPolicy="no-referrer" />
          <div>
            <h1 className="text-lg font-bold text-indigo-900 leading-tight">ตั้งค่าระบบ</h1>
            <p className="text-xs text-indigo-600">ยืดหยุ่นและรองรับการใช้งานระยะยาว</p>
          </div>
        </div>
        <button onClick={() => navigate('/dashboard')} className="glass-button px-4 py-2 rounded-xl text-indigo-700 font-medium text-sm">
          กลับหน้าหลัก
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('academic')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'academic' ? 'bg-indigo-500 text-white shadow-md' : 'glass-panel text-indigo-700 hover:bg-white/60'}`}
            >
              <Calendar size={20} />
              <span className="font-medium">ปีการศึกษา</span>
            </button>
            <button 
              onClick={() => setActiveTab('grades')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'grades' ? 'bg-indigo-500 text-white shadow-md' : 'glass-panel text-indigo-700 hover:bg-white/60'}`}
            >
              <Layers size={20} />
              <span className="font-medium">โครงสร้างระดับชั้น</span>
            </button>
            <button 
              onClick={() => setActiveTab('storage')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'storage' ? 'bg-indigo-500 text-white shadow-md' : 'glass-panel text-indigo-700 hover:bg-white/60'}`}
            >
              <Folder size={20} />
              <span className="font-medium">แฟ้มจัดเก็บข้อมูล</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 glass-panel p-6 min-h-[500px]">
            
            {/* Tab: Academic Years */}
            {activeTab === 'academic' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                    <Calendar className="text-indigo-500" />
                    จัดการปีการศึกษา
                  </h2>
                  <button className="glass-button-primary px-3 py-2 rounded-lg text-sm flex items-center gap-1">
                    <Plus size={16} /> เพิ่มปีการศึกษา
                  </button>
                </div>
                <div className="bg-white/50 rounded-xl overflow-hidden border border-white/60">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-indigo-50/50 text-indigo-900 border-b border-indigo-100">
                      <tr>
                        <th className="p-4 font-semibold">ปีการศึกษา</th>
                        <th className="p-4 font-semibold">สถานะ</th>
                        <th className="p-4 font-semibold text-right">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {academicYears.map(year => (
                        <tr key={year.id} className="border-b border-indigo-50/50 hover:bg-white/40">
                          <td className="p-4 font-medium text-indigo-900">{year.year}</td>
                          <td className="p-4">
                            {year.isCurrent ? 
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">ปีปัจจุบัน</span> : 
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">อดีต</span>
                            }
                          </td>
                          <td className="p-4 flex justify-end gap-2">
                            <button className="p-1.5 text-indigo-500 hover:bg-indigo-100 rounded-md"><Edit2 size={16} /></button>
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, targetId: year.id, collection: 'academic_years', name: `ปีการศึกษา ${year.year}` })}
                              className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-md"
                            ><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Grade Levels */}
            {activeTab === 'grades' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                    <Layers className="text-indigo-500" />
                    โครงสร้างระดับชั้น (อ้างอิงด้วย ID)
                  </h2>
                  <button className="glass-button-primary px-3 py-2 rounded-lg text-sm flex items-center gap-1">
                    <Plus size={16} /> เพิ่มระดับชั้น
                  </button>
                </div>
                <p className="text-sm text-indigo-600 mb-4">
                  * การใช้ ID เป็นตัวอ้างอิง (เช่น grade_m1) ช่วยให้สามารถเปลี่ยนชื่อระดับชั้นได้ในอนาคตโดยไม่กระทบกับข้อมูลนักเรียนเก่า
                </p>
                <div className="bg-white/50 rounded-xl overflow-hidden border border-white/60">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-indigo-50/50 text-indigo-900 border-b border-indigo-100">
                      <tr>
                        <th className="p-4 font-semibold">ลำดับ</th>
                        <th className="p-4 font-semibold">รหัสอ้างอิง (ID)</th>
                        <th className="p-4 font-semibold">ชื่อระดับชั้น</th>
                        <th className="p-4 font-semibold text-right">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradeLevels.map(grade => (
                        <tr key={grade.id} className="border-b border-indigo-50/50 hover:bg-white/40">
                          <td className="p-4 text-indigo-600">{grade.order}</td>
                          <td className="p-4 font-mono text-xs text-indigo-500">{grade.id}</td>
                          <td className="p-4 font-medium text-indigo-900">{grade.name}</td>
                          <td className="p-4 flex justify-end gap-2">
                            <button className="p-1.5 text-indigo-500 hover:bg-indigo-100 rounded-md"><Edit2 size={16} /></button>
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, targetId: grade.id, collection: 'grade_levels', name: grade.name })}
                              className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-md"
                            ><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Storage */}
            {activeTab === 'storage' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                    <Folder className="text-indigo-500" />
                    ตั้งค่าแฟ้มจัดเก็บข้อมูล (Storage Folders)
                  </h2>
                </div>
                <p className="text-sm text-indigo-600 mb-6">
                  กำหนดชื่อโฟลเดอร์ในฐานข้อมูลสำหรับจัดเก็บไฟล์ประเภทต่างๆ เพื่อความยืดหยุ่นในการย้ายหรือเปลี่ยนโครงสร้างในอนาคต
                </p>
                
                <form onSubmit={handleSaveStorage} className="space-y-4 max-w-lg">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-indigo-900">โฟลเดอร์รูปโปรไฟล์นักเรียน (Images)</label>
                    <input 
                      type="text" 
                      value={storageSettings.profiles_folder || ''}
                      onChange={e => setStorageSettings({...storageSettings, profiles_folder: e.target.value})}
                      className="glass-input w-full px-4 py-2 text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-indigo-900">โฟลเดอร์เอกสารแนบการลา (PDF, Images)</label>
                    <input 
                      type="text" 
                      value={storageSettings.attachments_folder || ''}
                      onChange={e => setStorageSettings({...storageSettings, attachments_folder: e.target.value})}
                      className="glass-input w-full px-4 py-2 text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-indigo-900">โฟลเดอร์เก็บไฟล์นำเข้า (Excel)</label>
                    <input 
                      type="text" 
                      value={storageSettings.imports_folder || ''}
                      onChange={e => setStorageSettings({...storageSettings, imports_folder: e.target.value})}
                      className="glass-input w-full px-4 py-2 text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-indigo-900">โฟลเดอร์เก็บไฟล์รายงาน (PDF, Excel)</label>
                    <input 
                      type="text" 
                      value={storageSettings.exports_folder || ''}
                      onChange={e => setStorageSettings({...storageSettings, exports_folder: e.target.value})}
                      className="glass-input w-full px-4 py-2 text-sm" 
                    />
                  </div>
                  
                  <button type="submit" className="glass-button-primary px-6 py-2 rounded-xl font-medium flex items-center gap-2 mt-4">
                    <Save size={18} /> บันทึกการตั้งค่า
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-indigo-900/40 backdrop-blur-sm">
          <div className="glass-panel p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 text-rose-600">
                <ShieldAlert size={24} />
                <h3 className="text-lg font-bold">ยืนยันการลบข้อมูล</h3>
              </div>
              <button onClick={() => setDeleteModal(null)} className="text-indigo-400 hover:text-indigo-600">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-indigo-900 mb-4">
              คุณกำลังจะลบ <strong>{deleteModal.name}</strong>
              <br/><span className="text-sm text-rose-500 mt-1 block">การกระทำนี้ไม่สามารถย้อนกลับได้ และระบบจะตรวจสอบข้อมูลที่เกี่ยวข้องเพื่อป้องกันข้อมูลกำพร้า</span>
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-rose-100 text-rose-700 rounded-lg text-sm border border-rose-200">
                {deleteError}
              </div>
            )}

            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium text-indigo-900 flex items-center gap-2">
                <Lock size={16} className="text-indigo-500" />
                รหัสผ่านผู้ดูแลระบบ (เพื่อยืนยัน)
              </label>
              <input 
                type="password" 
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="glass-input w-full px-4 py-2"
                placeholder="ระบุรหัสผ่านของคุณ"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-lg text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleDeleteConfirm}
                disabled={!adminPassword}
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium transition-colors disabled:opacity-50"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
