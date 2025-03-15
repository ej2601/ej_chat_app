// src/composables/useMessageInteraction.js
import { ref } from "vue";

export function useMessageInteraction(socket) {
  // Track which message (by its _id) is currently hovered.
  const hoveredMessageId = ref(null);

  // Optionally, track which message is being replied to
  const replyTarget = ref(null);

  // Set the currently hovered message.
  const setHoveredMessageId = (id) => {
    hoveredMessageId.value = id;
  };

  // Clear the hovered message.
  const clearHoveredMessageId = () => {
    hoveredMessageId.value = null;
  };

  // Set a message as the reply target (e.g., open a reply input)
  const setReplyTarget = (message) => {
    replyTarget.value = {
      _id: message._id,
      sender: message.sender,
      message: message.message,
    };
  };

  // Clear the reply target
  const clearReplyTarget = () => {
    replyTarget.value = null;
  };  

  // Function to handle replying to a message.
  const replyToMessage = (message) => {
    // For now, we just log the reply action.
    console.log("Reply to message:", message, "hell");
    // You could trigger a reply input to appear here.
    // For demonstration, set this message as the reply target
    setReplyTarget(message);
  };

  // Function to handle reacting to a message.
  const reactToMessage = (message, emoji, roomId, username) => {
    console.log("React to message:", message, emoji, socket, roomId, username);

    // Here you could emit a socket event or update local state.
    // Emit the reaction event via Socket.IO
    socket.emit("messageReaction", {
      messageId: message._id,
      roomId,
      user: username,
      emoji,
    });
  };

  return {
    hoveredMessageId,
    replyTarget,
    setHoveredMessageId,
    clearHoveredMessageId,
    replyToMessage,
    reactToMessage,
    setReplyTarget,
    clearReplyTarget,
  };
}
