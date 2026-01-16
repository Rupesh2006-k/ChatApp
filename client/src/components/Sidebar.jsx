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
            className="w-10 h-10 rounded-full"
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
