import { collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const initializeMockData = async () => {
  try {
    // 1. Check if admin user exists
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    if (usersSnapshot.empty) {
      console.log('Initializing mock data...');
      
      // Create Admin User
      await setDoc(doc(db, 'users', 'admin_user_1'), {
        username: 'admin',
        password: 'password123', // In a real app, hash this!
        name: 'ผู้ดูแลระบบ',
        role: 'admin'
      });

      // Create Teacher User
      await setDoc(doc(db, 'users', 'teacher_user_1'), {
        username: 'teacher',
        password: 'password123',
        name: 'ครูสมศรี ใจดี',
        role: 'teacher',
        classroomId: 'class_m1_1' // Link to classroom ID
      });

      // 2. System Settings (Flexible Configuration)
      await setDoc(doc(db, 'settings', 'general'), {
        schoolName: 'โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ยะลา',
        department: 'กลุ่มบริหารงานทั่วไป งานระบบการดูแลช่วยเหลือนักเรียน'
      });

      // Storage Folder IDs (Requirement 4)
      await setDoc(doc(db, 'settings', 'storage'), {
        profiles_folder: 'student_profiles',
        attachments_folder: 'attendance_attachments',
        imports_folder: 'import_logs',
        exports_folder: 'export_reports'
      });

      // 3. Academic Years
      await setDoc(doc(db, 'academic_years', 'year_2567'), {
        year: '2567',
        isCurrent: true
      });

      // 4. Terms
      await setDoc(doc(db, 'terms', 'term_1_2567'), {
        term: '1',
        academicYearId: 'year_2567',
        isCurrent: true
      });

      // 5. Grade Levels (Using IDs to prevent orphan data)
      await setDoc(doc(db, 'grade_levels', 'grade_m1'), {
        name: 'มัธยมศึกษาปีที่ 1',
        order: 1
      });
      await setDoc(doc(db, 'grade_levels', 'grade_m2'), {
        name: 'มัธยมศึกษาปีที่ 2',
        order: 2
      });

      // 6. Classrooms (Linked to Grade Level ID)
      await setDoc(doc(db, 'classrooms', 'class_m1_1'), {
        name: 'ม.1/1',
        gradeLevelId: 'grade_m1',
        teacherId: 'teacher_user_1'
      });
      await setDoc(doc(db, 'classrooms', 'class_m1_2'), {
        name: 'ม.1/2',
        gradeLevelId: 'grade_m1',
        teacherId: null
      });

      // 7. Mock Students
      await setDoc(doc(db, 'students', 'student_1'), {
        studentId: '67001',
        firstName: 'สมชาย',
        lastName: 'เรียนดี',
        classroomId: 'class_m1_1',
        status: 'active'
      });
      await setDoc(doc(db, 'students', 'student_2'), {
        studentId: '67002',
        firstName: 'สมหญิง',
        lastName: 'รักเรียน',
        classroomId: 'class_m1_1',
        status: 'active'
      });

      console.log('Mock data initialized successfully!');
    } else {
      console.log('Database already has data. Skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
};
