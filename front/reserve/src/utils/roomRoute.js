export const getActiveRoomPath = (activeRoom) => {
  if (!activeRoom) return null;
  const { id, status } = activeRoom;
  switch (status) {
    case "RESERVED":
      return `/reserve/${id}`;
    case "IN_USE":
      return `/checkin/${id}`;
    case "AWAY":
      return `/away/${id}`;
    default:
      return null;
  }
};
