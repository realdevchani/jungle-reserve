import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectWebSocket = (onRoomUpdate) => {
  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(`${process.env.REACT_APP_BACKEND_URL}/ws/rooms`),
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient.subscribe("/topic/rooms", (message) => {
        const rooms = JSON.parse(message.body);
        onRoomUpdate(rooms);
      });

      stompClient.subscribe("/user/queue/notification", (message) => {
        const notification = JSON.parse(message.body);
        showBrowserNotification(notification);
      });
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame.headers["message"]);
    },
  });

  stompClient.activate();
  return stompClient;
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

const showBrowserNotification = (notification) => {
  if (Notification.permission === "granted") {
    new Notification(notification.title || "연습실 알림", {
      body: notification.message,
      icon: "/favicon.ico",
    });
  }
};

export const requestNotificationPermission = async () => {
  if ("Notification" in window && Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
};
