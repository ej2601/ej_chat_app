import {ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export function useRoomList() {
  const router = useRouter();
  const store = useStore();
  console.log(store.getters["auth/getUserAvatar"]);
  // Get chat rooms from Vuex
  const chatRooms = computed(() => store.getters['chat/getChatRooms'] || []);

  // Define a reactive search query.
  const searchQuery = ref('');

  // Computed property to filter rooms based on the search query.
  // It checks if the room's name or the creator's name/username includes the query (case-insensitive).
  const filteredRooms = computed(() => {
    if (!searchQuery.value) {
      return chatRooms.value;
    }
    const query = searchQuery.value.toLowerCase();
    return chatRooms.value.filter(room => {
      const roomName = room.name?.toLowerCase() || '';
      const creatorName = room.createdBy?.name?.toLowerCase() ||
                          room.createdBy?.username?.toLowerCase() || '';
      return roomName.includes(query) || creatorName.includes(query);
    });
  });

  // Fetch chat rooms using Vuex action
  const fetchRooms = async () => {
    try {
      await store.dispatch('chat/fetchChatRooms');
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  // Join a room by navigating to the chat interface.
  const joinRoom = (roomId) => {
    // Convert roomId to a string if necessary.
    router.push({ path: '/chat', query: { roomId: roomId.toString() } });
  };

  onMounted(() => {
    if (!store.getters['auth/isAuthenticated']) {
      router.push('/login');
    } else {
      fetchRooms();
    }
  });

  return {
    chatRooms,
    filteredRooms,
    searchQuery,
    fetchRooms,
    joinRoom,
  };
}
