import { ref } from 'vue';
import { useStore } from 'vuex';

export function useRoomCreation() {
  const store = useStore();
  const newRoomName = ref('');
  const newRoomDescription = ref('');
  const errorMessage = ref('');
  const successMessage = ref('');

  // Create a new room using Vuex action
  const createRoom = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    if (!newRoomName.value) {
      errorMessage.value = 'Room name is required';
      return;
    }
    try {
      await store.dispatch('chat/createRoom', {
        name: newRoomName.value,
        description: newRoomDescription.value,
      });
      successMessage.value = 'Room created successfully!';
      // Clear form fields
      newRoomName.value = '';
      newRoomDescription.value = '';
      // Optionally refresh room list after creation
      await store.dispatch('chat/fetchChatRooms');
    } catch (error) {
      errorMessage.value =
        error.response?.data?.message || 'Error creating chat room';
    }
  };

  return {
    newRoomName,
    newRoomDescription,
    errorMessage,
    successMessage,
    createRoom,
  };
}
