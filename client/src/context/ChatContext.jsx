import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { axios, socket } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [unseenMessage, setUnseenMessage] = useState({})
  const [slectedUser, setSelectedUser] = useState({});
  

  // get users
  let getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessage(data.unseenMessage);
      }
    } catch (error) {
      toast.error(error.messages);
    }
  };
  // get msg for selected user
  let getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.messages);
    }
  };
  // sendmessages 
  let sendMessages = async(messageData)=>{
    try {
      let {data} = await axios.post(`/api/messages/send/${slectedUser._id}` ,messageData)

      if(data.success){
        setMessages((prevMessages)=>[...prevMessages , data.newMessage])
      }else{
        toast.error(data.messages)

      }
    } catch (error) {
      toast.error(error.messages)
    }
  }

  // subscribe message
  let subscribeMessage = async()=>{
   if(!socket)return

   socket.on("newMessage" , (newMessage)=>{
    if(slectedUser && newMessage.senderId === slectedUser._id){
      newMessage.seen = true
      setMessages((prevMessage)=>[...prevMessage , newMessage])
      axios.put(`/api/messages/mark/${newMessage._id}`)
    }
    else{
      setUnseenMessage((prevUnseenMessages)=>({
        ...prevUnseenMessages , [newMessage.senderId]
      }))
    }
   })
  }






  const value = {
    selectedChat,
    setSelectedChat,
    messages,
    setMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
