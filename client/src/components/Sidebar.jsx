// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import assets from "../assets/images/assets";
// import { AuthContext } from "../context/AuthContext";
// import { ChatContext } from "../context/ChatContext";
// const Sidebar = () => {
//   const [input, setInput] = useState(false);
//   const {
//     users,
//     selectedUser,
//     getUsers,
//     setSelectedUser,
//     unseenMessage,
//     setUnseenMessage,
//   } = useContext(ChatContext);
//   const navigate = useNavigate();
//   let { logout, onlineUsers } = useContext(AuthContext);

//   let filteredUsers = input
//     ? users.filter((user) =>
//         user.fullName.toLowerCase().includes(input.toLowerCase())
//       )
//     : users;

//   useEffect(() => {
//     getUsers();
//   }, [onlineUsers]);

//   return (
//     <div
//       className={`h-full p-5  overflow-y-auto text-white bg-zinc-50/20 ${
//         selectedUser ? "max-md:hidden" : ""
//       }`}
//     >
//       <div className="pb-5">
//         <div className="flex justify-between items-center">
//           <img src={assets.logo_icon} alt="logo" className="max-w-10" />

//           <div className="relative py-2 group">
//             <img
//               src={assets.menu_icon}
//               alt="menu"
//               className="h-5 w-5 cursor-pointer"
//             />

//             <div className="absolute top-full right-0 z-20 w-32 p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
//               <p
//                 onClick={() => navigate("/profile")}
//                 className="cursor-pointer text-sm hover:text-purple-400"
//               >
//                 Edit Profile
//               </p>

//               <hr className="my-2 border-zinc-500" />

//               <p
//                 onClick={() => logout()}
//                 className="cursor-pointer text-sm hover:text-red-400"
//               >
//                 Logout
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
//           <img src={assets.search_icon} alt="search" className="w-3" />
//           <input
//             type="text"
//             onChange={(e) => setInput(e.target.value)}
//             className="bg-transparent outline-none text-white text-xs placeholder:text-[#c8c8c8] flex-1"
//             placeholder="Search user..."
//           />
//         </div>
//       </div>

//       <div className="flex flex-col">
//         {filteredUsers.map((user, idx) => (
//           <div
//             key={idx}
//             onClick={() => {
//               setSelectedUser(user);
//               setUnseenMessage((prev) => ({ ...prev, [user._id]: 0 }));
//               }}
//             className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
//               selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
//             }`}
//           >
//             <img
//               src={user?.profilePic || assets.avatar_icon}
//               alt="profile"
//               className="w-9 aspect-square rounded-full"
//             />

//             <div className="flex flex-col leading-5">
//               <p>{user.fullName}</p>
//               {onlineUsers.includes(user._id) ? (
//                 <span className="text-green-400 text-xs">Online</span>
//               ) : (
//                 <span className="text-neutral-400 text-xs">Offline</span>
//               )}
//             </div>

//             {unseenMessage?.[user._id] > 0 && (
//               <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
//                 {unseenMessage[user._id]}
//               </p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/images/assets";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Sidebar = () => {
  const [input, setInput] = useState(""); // ✅ FIX
  const {
    users,
    selectedUser,
    getUsers,
    setSelectedUser,
    unseenMessage,
    setUnseenMessage,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((u) =>
        u.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`h-full p-5 overflow-y-auto text-white bg-zinc-50/20 ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* HEADER */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo_icon} className="max-w-10" />

          <div className="relative group">
            <img src={assets.menu_icon} className="w-5 cursor-pointer" />

            <div className="absolute right-0 top-full hidden group-hover:block bg-[#282142] p-4 w-32 rounded">
              <p onClick={() => navigate("/profile")} className="cursor-pointer">
                Edit Profile
              </p>
              <hr className="my-2" />
              <p onClick={logout} className="cursor-pointer text-red-400">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 p-3 mt-5">
          <img src={assets.search_icon} className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search user..."
            className="bg-transparent outline-none text-white text-xs flex-1"
          />
        </div>
      </div>

      {/* USERS */}
      {filteredUsers.map((user) => (
        <div
          key={user._id}
          onClick={() => {
            setSelectedUser(user);
            setUnseenMessage((prev) => ({ ...prev, [user._id]: 0 }));
          }}
          className={`relative flex gap-2 p-2 rounded cursor-pointer ${
            selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
          }`}
        >
          <img
            src={user.profilePic || assets.avatar_icon}
            className="w-9 rounded-full"
          />

          <div>
            <p>{user.fullName}</p>
            <span className="text-xs">
              {onlineUsers.includes(user._id) ? "Online" : "Offline"}
            </span>
          </div>

          {unseenMessage[user._id] > 0 && (
            <span className="absolute right-3 top-3 text-xs bg-violet-500 h-5 w-5 rounded-full flex items-center justify-center">
              {unseenMessage[user._id]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
