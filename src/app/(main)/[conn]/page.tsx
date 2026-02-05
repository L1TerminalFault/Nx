"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCircleNotch } from "react-icons/fa";
// import { io, Socket } from "socket.io-client";

type Notification = {
  _id: string;
  connectionString: string;
  title: string;
  message: string;
  time: string;
};

// const PORT = 30000;

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  useEffect(() => {
    // let socket: Socket;
    const connectionString = localStorage.getItem("__nx_connection_string__");
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
    } else if (connectionString) {
      return router.replace(`/${connectionString}`);
    } else {
      setNotConfigured(true);
      setLoading(false);
    }
  }, [lastSegment, router]);

  function generateCode() {
    return `${(Math.random() * 10000).toFixed(0)}-${(Math.random() * 10000).toFixed(0)}`;
  }

  const [code, setCode] = useState<string>(generateCode());

  return (
    <div className="w-screen relative //h-screen flex flex-col items-center p-5 bg-gray-900/20 text-white">
      <div
        onClick={() => {
          localStorage.removeItem("__nx_connection_string__");
          router.replace("/configure");
        }}
        className="absolute bottom-6 right-6 py-2 px-5 flex z-50 justify-end bg-white/15 backdrop-blur-2xl shadow-lg shadow-black rounded-full cursor-pointer"
      >
        RECONFIGURE
      </div>
      {loading ? (
        <div className="w-full h-[80%] flex items-center justify-center">
          <FaCircleNotch className="animate-spin text-4xl" />
        </div>
      ) : notConfigured ? (
        <div className="flex flex-col items-center p-5 pt-16">
          <div className="text-2xl p-4">Configure</div>
          <div className="text-center text-gray-400 p-2">
            Enter this code in the app, once you are done press &apos;Done&apos;
          </div>
          <div className="text-3xl font-bold border border-gray-500 px-20 py-16 rounded-4xl">
            {code}
          </div>
          <div className="flex flex-row gap-4 p-4 justify-around">
            <div
              className="py-2 px-4 rounded-full bg-white/10"
              onClick={() => setCode(generateCode())}
            >
              New Code
            </div>
            <div
              className="py-2 px-4 rounded-full bg-white/10"
              onClick={() => {
                localStorage.setItem("__nx_connection_string__", code);
                router.replace(`/${code}`);
              }}
            >
              Done
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-2xl w-full flex justify-center p-4">
            Notifications from session &apos;
            <span className="font-bold">{lastSegment}</span>&apos;
          </div>
          {error ? (
            <div className="p-4 text-xl w-full flex justify-center">
              {error}
            </div>
          ) : !notifications ? (
            <div className="p-4 text-xl w-full flex justify-center">
              Could not load notifications
            </div>
          ) : !notifications?.length ? (
            <div className="p-4 text-xl w-full flex justify-center">
              No notifications
            </div>
          ) : (
            <>
              {notifications?.map((notification) => (
                <div
                  key={notification._id}
                  className="flex flex-row bg-gray-900 px-6 py-2 rounded-2xl"
                >
                  <div className="flex flex-col gap-3">
                    <div className="text-xl font-bold">
                      {notification.title}
                    </div>
                    <div className="text-gray-300">{notification.message}</div>
                  </div>

                  <div className="flex flex-col gap-4 justify-end">
                    <div className="text-gray-400">
                      {new Date(parseInt(notification.time)).toLocaleString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(parseInt(notification.time)).toLocaleString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
