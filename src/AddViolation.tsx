import { useState, useEffect, useRef } from "react";
import axios from "axios";
import GradientSidebar from "./components/Sidebar";
import { useReactToPrint } from "react-to-print";


interface InternetUser {
  id: string;
  username: string;
  name: string;
  position: string;
  deputyMinistry: string;
  directorate: string;
  user_signature: string;
  directorate_signature: string;
  violations: string;
  comment: string;
}

export default function AddViolation() {
  const [users, setUsers] = useState<InternetUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<InternetUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<InternetUser | null>(null);
  const printRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get<InternetUser[]>("http://localhost:3000/internet_users");
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  
    const handlePrint = useReactToPrint({
          contentRef: printRef,
          documentTitle: 'Internet User Report',
        });




  return (
    <div className="min-h-screen flex bg-white">
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r 
            border-gray-200 bg-white z-20" id = "no-print">
        <GradientSidebar />
      </div>
      <main className="flex-1 px-4 sm:px-6 py-10 bg-white ml-64">
        <div   id = "printable-content" ref = {printRef} >
        {/* Logos Row */}
        <div className="flex items-center justify-between mb-1">
          <img src="/moph.jpeg" alt="Logo Left" className="w-30" />
                  <h1 className="text-center font-bold" style={{ fontFamily: 'BNazanin, sans-serif' }}>
                    وزارت صحت عامه
                  </h1>
                  <h1 className="text-center font-bold" style={{ fontFamily: 'BNazanin, sans-serif' }}>
                    امارت اسلامی افغانستان
                  </h1>
          <img src="/emirate.png" alt="Logo Right" className="w-30" />
        </div>
                  <h1 className="text-center" style={{ fontFamily: 'BNazanin, sans-serif' }}>
                    معینیت امور مالی و اداری
                  </h1>
                  <h1 className="text-center mb-5" style={{ fontFamily: 'BNazanin, sans-serif' }}>
                    ریاست تکنالوژی معلوماتی
                  </h1>
        {/* Title */}
        <h1 className="text-center text-xl font-bold text-black mb-3 font-mono" 
        style={{ fontFamily: 'BNazanin, sans-serif' }}>
          فورم تخطی استفاده کنندگان انترنت وزارت صحت عامه
        </h1>
        {/* Form */}
        <form dir="rtl" className="w-full " style={{ fontFamily: 'BNazanin, sans-serif' }}>
          {/* Search Box */}
          <div className="mb-4 max-w-lg relative">
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
              نام یوزر:
            </label>
            <input
              id="username"
              type="text"
              placeholder="جستجو یوزر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-blue-300 rounded bg-white text-sm"
            />
            {searchTerm && (
              <ul className="absolute top-full mt-1 right-0 left-0 bg-white border 
              border-gray-300 rounded shadow max-h-48 overflow-y-auto z-50">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      setSearchTerm(user.username);
                      setFilteredUsers([]);
                    }}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                  >
                    {user.id} / {user.username}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Table */}
          {selectedUser && (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-md text-sm 
              bg-white table-auto border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 border border-gray-300 text-center">نام</th>
                    <th className="px-3 py-2 border border-gray-300 text-center">وظیفه</th>
                    <th className="px-3 py-2 border border-gray-300 text-center">معینیت</th>
                    <th className="px-3 py-2 border border-gray-300 text-center">ریاست</th>
                    <th className="px-3 py-2 border border-gray-300 text-center">تعداد تخلفات</th>
                    <th className="px-3 py-2 border border-gray-300 text-center">توضیحات تخلف</th>
                    <th className="px-3 py-2 border border-gray-300 text-center">امضای کارمند</th>
                    <th className="px-3 py-2 border border-gray-300 text-center">امضای ریاست</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border border-gray-300 text-center break-all 
                    max-w-[10ch]">{selectedUser.name}</td>
                    <td className="px-3 py-2 border border-gray-300 text-center break-all 
                    max-w-[10ch]">{selectedUser.position}</td>
                    <td className="px-3 py-2 border border-gray-300 text-center break-all 
                    max-w-[10ch]">{selectedUser.deputyMinistry}</td>
                    <td className="px-3 py-2 border border-gray-300 text-center break-all 
                    max-w-[10ch]">{selectedUser.directorate}</td>
                    <td className="px-3 py-2 border border-gray-300 text-center break-all 
                    max-w-[10ch]">{selectedUser.violations}</td>
                    <td className="px-3 py-2 border border-gray-300 text-center break-all 
                    max-w-[10ch]">{selectedUser.comment}</td>
                    <td className="px-3 py-2 border border-gray-300 text-center break-all 
                    max-w-[10ch]"></td>
                    <td className="px-3 py-2 border border-gray-300 text-center break-all 
                    max-w-[10ch]"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Submit Button */}
          {selectedUser && (
            <div className="flex justify-end mt-6">
             <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-2 bg-blue-600 text-white rounded 
              hover:bg-blue-500 transition-all print:hidden"
            >
              چاپ
            </button>
            </div>
          )}
        </form>
        {/* Footer Notes */}
        <div className="mt-0 space-y-4 text-right text-sm sm:text-base" dir="rtl">
          <p className="text-gray-700 text-center" style={{ fontFamily: 'BNazanin, sans-serif' }}>
            کاربران انترنت در وزارت صحت عامه در صورتیکه دو مرتبه از انترنت استفاده نادرست نمایند یوزر شان برای همیشه مسدود می‌گردد!
          </p>
          <p className="text-gray-700 text-center font-bold" style={{ fontFamily: 'BNazanin, sans-serif' }}>
            برای همیشه مسدود می‌گردد
            </p>
          <p className="text-gray-700 text-center font-bold" style={{ fontFamily: 'BNazanin, sans-serif' }}>
            امضا رییس تکنالوژی معلوماتی
            </p>
        </div>
        </div>
      </main>
</div>

  );

}
