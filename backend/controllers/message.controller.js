import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Find or create the conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }

    // Create and save the new message
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content: message,
    });

    await newMessage.save();

    // Add the message to the conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    res.status(201).send(newMessage);
  } catch (err) {
    console.log("Error in sendMessage controller: " + err.message);
    res.status(500).send({ error: "Internal server error: " + err.message });
  }
};