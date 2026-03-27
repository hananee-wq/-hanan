import React from 'react';

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <img 
        src="https://img2.imgbiz.com/imgbiz/logo-design.png" 
        alt="School Logo" 
        className="w-[150px] h-auto mb-4 drop-shadow-md"
        referrerPolicy="no-referrer"
      />
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-1 drop-shadow-sm">
        ระบบบันทึก Home Room และการเข้าแถวของนักเรียน
      </h1>
      <h2 className="text-lg md:text-xl font-medium text-indigo-800 mb-1">
        กลุ่มบริหารงานทั่วไป งานระบบการดูแลช่วยเหลือนักเรียน
      </h2>
      <h3 className="text-md md:text-lg font-normal text-indigo-700">
        โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ยะลา
      </h3>
    </header>
  );
}
