import UserModel from "../models/user.model.js";
import MessageModel from "../models/message.model.js";
import cloudinary from "../libs/cloudinary.js";
import { io, userSocketMap } from "../server.js";

/* --------------------------------------------------
   Get all users except the logged-in user (Sidebar)
--------------------------------------------------- */
export const getUsersForSidebar = async (req, res) => {
  try {
    // Logged-in user's ID (from auth middleware)
    const userId = req.user._id;
    const filteredUsers = await UserModel.find({
      _id: { $ne: userId },
    }).select("-password"); // exclude password for security
    // Object to store unseen message count for each user
    const unseenMessages = {};
    // Loop through each user to calculate unseen messages
    const promises = filteredUsers.map(async (user) => {
      const messages = await MessageModel.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      // If unseen messages exist, store the count
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    // Wait for all unseen message queries to complete
    await Promise.all(promises);
    // Send users list and unseen message counts to frontend
    res
      .status(200)
      .json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* --------------------------------------------------
   Get messages between logged-in user and selected user
--------------------------------------------------- */
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;
    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });
    // Mark all messages sent to me by selected user as seen
    await MessageModel.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/* --------------------------------------------------
   Mark a single message as seen (using message ID)
--------------------------------------------------- */
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await MessageModel.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* --------------------------------------------------
   Send a message to selected user
--------------------------------------------------- */
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await MessageModel.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.json({ success: true, newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
