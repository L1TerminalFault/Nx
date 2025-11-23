"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Notification = {
  _id: string;
  userId: string;
  message: string;
  time: string;
};

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const PORT = 30000;

  useEffect(() => {
    let socket: Socket;

    (async () => {
      setLoading(true);
      const messagesFetched = await (
        await fetch("/api/getNotifications")
      ).json();
      setNotifications(messagesFetched);

      socket = io(`${window.location.origin}:${PORT}`);
      socket.on("message", (notif: Notification) =>
        setNotifications((prev: Notification[]): Notification[] => [
          ...prev,
          notif,
        ]),
      );

      setLoading(false);
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
      ) : !notifications ? (
        <div>Could not load notifications</div>
      ) : !notifications?.length ? (
        <div>No notifications</div>
      ) : (
        notifications?.map((notification) => (
          <div key={null}>{notification.message}</div>
        ))
      )}
    </div>
  );
}
