import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import assets, { userDummyData } from "../assets/images/assets";
import { AuthContext } from "../context/AuthContext";
const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
 let {logout} = useContext(AuthContext)
  return (
    <div
      className={`h-full p-5  overflow-y-auto text-white bg-zinc-50/20 ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo_icon} alt="logo" className="max-w-10" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="h-5 w-5 cursor-pointer"
            />

            <div className="absolute top-full right-0 z-20 w-32 p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm hover:text-purple-400"
              >
                Edit Profile
              </p>

              <hr className="my-2 border-zinc-500" />

              <p onClick={()=>logout()} className="cursor-pointer text-sm hover:text-red-400">
                Logout
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            className="bg-transparent outline-none text-white text-xs placeholder:text-[#c8c8c8] flex-1"
            placeholder="Search user..."
          />
        </div>
      </div>

      <div className="flex flex-col">
        {userDummyData.map((user, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedUser(user)}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="profile"
              className="w-9 aspect-square rounded-full"
            />

            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {idx < 3 ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>

            {idx > 2 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {idx}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
