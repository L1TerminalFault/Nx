"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const PORT = 30000;

  useEffect(() => {
    const socket = io(`${window.location.origin}:${PORT}`);

    socket.on("message", (notif) =>
      setNotifications((prev) => [...prev, notif]),
    );
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const messagesFetched = await (
        await fetch("/api/getNotifications")
      ).json();
      setNotifications(messagesFetched);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="text-xl">Notifications Page</div>
      {loading
        ? null
        : notifications.map((notification) => (
            <div key={null}>{notification.message}</div>
          ))}
    </div>
  );
}
