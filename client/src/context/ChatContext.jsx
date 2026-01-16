// import { createContext, useContext, useEffect, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import toast from "react-hot-toast";

// export const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const { axios, socket } = useContext(AuthContext);
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [unseenMessage, setUnseenMessage] = useState({});
//   // const [selectedUser, setSelectedUser] = useState({});
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Get users
//   const getUsers = async () => {
//     try {
//       const { data } = await axios.get("/api/messages/users");
//       if (data.success) {
//         setUsers(data.users);
//         setUnseenMessage(data.unseenMessage);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Get messages for selected user
//   const getMessages = async (userId) => {
//     try {
//       const { data } = await axios.get(`/api/messages/${userId}`);
//       if (data.success) {
//         setMessages(data.messages);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Send message
//   // const sendMessages = async (messageData) => {
//   //   try {
//   //     const { data } = await axios.post(
//   //       `/api/messages/send/${selectedUser._id}`,
//   //       messageData
//   //     );

//   //     if (data.success) {
//   //       setMessages((prevMessages) => [...prevMessages, data.newMessage]);
//   //     } else {
//   //       toast.error(data.message);
//   //     }
//   //   } catch (error) {
//   //     toast.error(error.message);
//   //   }
//   // };

//   const sendMessages = async (messageData) => {
//   if (!selectedUser || !selectedUser._id) {
//     toast.error("Select a user first");
//     return;
//   }

//   const { data } = await axios.post(
//     `/api/messages/send/${selectedUser._id}`,
//     messageData
//   );

//   if (data.success) {
//     setMessages((prev) => [...prev, data.newMessage]);
//   }
// };

//   // Subscribe to messages
//   const subscribeMessage = () => {
//     if (!socket) return;

//     socket.on("newMessage", (newMessage) => {
//       if (selectedUser && newMessage.senderId === selectedUser._id) {
//         newMessage.seen = true;
//         setMessages((prevMessage) => [...prevMessage, newMessage]);
//         axios.put(`/api/messages/mark/${newMessage._id}`);
//       } else {
//         setUnseenMessage((prevUnseenMessages) => ({
//           ...prevUnseenMessages,
//           [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
//             ? prevUnseenMessages[newMessage.senderId] + 1
//             : 1,
//         }));
//       }
//     });
//   };

//   const unsubscribeFromMessages = () => {
//     if (socket) socket.off("newMessage");
//   };

//   useEffect(() => {
//     subscribeMessage();
//     return () => unsubscribeFromMessages();
//   }, [socket, selectedUser]);

//   const value = {
//     messages,
//     users,
//     selectedUser,
//     getUsers,
//     setMessages,
//     getMessages,
//     sendMessages,
//     setSelectedUser,
//     unseenMessage,
//     setUnseenMessage,
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };

import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { axios, socket } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // ✅ FIX
  const [unseenMessage, setUnseenMessage] = useState({});

  // ---------------- GET USERS ----------------
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessage(data.unseenMessages || {}); // ✅ FIX naming
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- GET MESSAGES ----------------
  const getMessages = async (userId) => {
    if (!userId) return;
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const sendMessages = async (messageData) => {
    if (!selectedUser?._id) {
      toast.error("Select a user first");
      return;
    }

    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- SOCKET SUBSCRIBE ----------------
  const subscribeMessage = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessage((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeMessage();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessages,
        unseenMessage,
        setUnseenMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
