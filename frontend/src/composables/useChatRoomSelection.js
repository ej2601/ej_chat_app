import { useRoomList } from './useRoomList';
import { useRoomCreation } from './useRoomCreation';

export function useChatRoomSelection() {
  const roomList = useRoomList();
  const roomCreation = useRoomCreation();

  return {
    ...roomList,
    ...roomCreation,
  };
}
