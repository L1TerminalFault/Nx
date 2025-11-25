"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Notification = {
  _id: string;
  userId: string;
  message: string;
  time: string;
};

const PORT = 30000;

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let socket: Socket;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const messagesFetched = await (
          await fetch("/api/notifications/getNotifications")
        ).json();
        setNotifications(messagesFetched.messages);

        socket = io(`${window.location.origin()}:${PORT}`);
        alert(window.location.origin.toString());
        socket.on("message", (notif: Notification) => {
          alert("socket event 'messae' dropped");
          setNotifications((prev: Notification[]): Notification[] => [
            ...prev,
            notif,
          ]);
        });
      } catch (err) {
        console.error("Error: ", err);
        setError("Couldn't fetch notifications");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="text-xl">Notifications Page</div>
      {loading ? (
        <div>Loading</div>
      ) : error ? (
        <div>{error}</div>
      ) : !notifications ? (
        <div>Could not load notifications</div>
      ) : !notifications?.length ? (
        <div>No notifications</div>
      ) : (
        notifications?.map((notification) => (
          <div
            key={notification.userId}
            className="flex flex-col bg-gray-900 px-6 py-2 m-1 rounded-2xl"
          >
            <div className="text-2xl">
              {new Date(parseInt(notification.time)).toLocaleString()}
            </div>
            <div className="text-gray-300">{notification.message}</div>
          </div>
        ))
      )}
    </div>
  );
}
