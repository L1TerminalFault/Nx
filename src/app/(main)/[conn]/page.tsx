"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

type Notification = {
  _id: string;
  connectionString: string;
  message: string;
  time: string;
};

// const PORT = 30000;

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  useEffect(() => {
    // let socket: Socket;
    const connectionString = localStorage.getItem("__nx_connection_string__");
    alert(connectionString);
    if (connectionString && lastSegment === connectionString) {
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const messagesFetched = await (
            await fetch(
              `/api/notifications/getNotifications?connectionString=${connectionString}`,
            )
          ).json();
          setNotifications(messagesFetched.messages);

          // socket = io(`${window.location.origin.toString()}:${PORT}`);
          // alert(window.location.origin.toString());
          // socket.on("message", (notif: Notification) => {
          //   alert("socket event 'messae' dropped");
          //   setNotifications((prev: Notification[]): Notification[] => [
          //     ...prev,
          //     notif,
          //   ]);
          // });
        } catch (err) {
          console.error("Error: ", err);
          setError("Couldn't fetch notifications");
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setNotConfigured(true);
      setLoading(false);
    }
  }, [lastSegment]);

  function generateCode() {
    return `${(Math.random() * 10000).toFixed(0)}-${(Math.random() * 10000).toFixed(0)}`;
  }

  const [code, setCode] = useState<string>(generateCode());
  const router = useRouter();

  return (
    <div>
      {loading ? (
        <div>Loading</div>
      ) : notConfigured ? (
        <div className="flex flex-col items-center p-5 pt-16">
          <div className="text-xl">Configure</div>
          <div>
            Enter this code in the app, once you are done hit &apos;Done&apos;
          </div>
          <div className="text-3xl font-bold my-4 border border-gray-500 p-20 rounded-3xl">
            {code}
          </div>
          <div
            className="p-3 bg-gray-800"
            onClick={() => {
              localStorage.setItem("__nx_connection_string__", code);
              router.replace(`/${code}`);
            }}
          >
            Done
          </div>
          <div onClick={() => setCode(generateCode())}>Regenerate</div>
        </div>
      ) : (
        <>
          <div className="text-xl">Notifications</div>
          {error ? (
            <div>{error}</div>
          ) : !notifications ? (
            <div>Could not load notifications</div>
          ) : !notifications?.length ? (
            <div>No notifications</div>
          ) : (
            <>
              <div
                onClick={() => {
                  localStorage.removeItem("__nx_connection_string__");
                  router.replace("/configure");
                }}
                className="p-3 flex justify-end"
              >
                RESET
              </div>
              {notifications?.map((notification) => (
                <div
                  key={notification.connectionString}
                  className="flex flex-col bg-gray-900 px-6 py-2 m-1 rounded-2xl"
                >
                  <div className="text-2xl">
                    {new Date(parseInt(notification.time)).toLocaleString()}
                  </div>
                  <div className="text-gray-300">{notification.message}</div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
