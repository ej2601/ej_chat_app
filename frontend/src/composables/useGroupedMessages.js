import { computed } from "vue";

export function useGroupedMessages(messages) {
  // Group messages by date (using locale date string)
  const groupedMessages = computed(() => {
    const groups = {};
    // Clone and sort messages by timestamp ascending
    const sortedMessages = [...messages.value].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    sortedMessages.forEach((msg) => {
      const dateKey = new Date(msg.timestamp).toLocaleDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  });

  // Helper: return label for a date key (Today, Yesterday, or formatted date)
  const getDateLabel = (dateKey) => {
    const date = new Date(dateKey);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
    const isYesterday =
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return { groupedMessages, getDateLabel };
}
