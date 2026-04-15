import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: true,
});

// ⭐ GLOBAL notification listeners
const notificationListeners = [];

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("newNotification", (data) => {
  console.log("🔥 GLOBAL notification received:", data);

  // notify all subscribers
  notificationListeners.forEach((cb) => cb(data));
});

// allow React components to subscribe
export const subscribeToNotifications = (callback) => {
  notificationListeners.push(callback);
};

export const unsubscribeFromNotifications = (callback) => {
  const index = notificationListeners.indexOf(callback);
  if (index > -1) notificationListeners.splice(index, 1);
};

export default socket;