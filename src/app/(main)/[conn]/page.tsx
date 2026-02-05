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
    return `${(Math.random() * 10000).toFixed(0).padStart(4, "0")}-${(Math.random() * 10000).toFixed(0).padStart(4, "0")}`;
  }

  const [code, setCode] = useState<string>(generateCode());
  const lastConnectionString = localStorage.getItem(
    "__nx_last_connection_string__",
  );

  return (
    <div className="w-screen relative scrollbar-hidden overflow-scroll h-screen flex flex-col items-center pt-20 pb-10 p-5 bg-gray-900/20 text-white transition-all">
      <div className="w-full flex items-center justify-between fixed top-0 p-4 text-xl border-transparent transition-all border-b-gray-700/30 border backdrop-blur-xl bg-transparent">
        <div className="flex items-center gap-2">
          <div>
            NxServer <span className="text-sm text-gray-500">v1.0.0</span>
          </div>
          <div
            className={`${lastSegment === "configure" ? "hidden" : ""} p-1 bg-orange-600 rounded-full`}
          />
        </div>
        <div
          className={`text-base text-gray-400 ${!lastSegment ? "hidden" : ""}`}
        >
          Session {lastSegment == "configure" ? "Not Configured" : lastSegment}
        </div>
      </div>
      <div
        onClick={() => {
          const connectionString = localStorage.getItem(
            "__nx_connection_string__",
          );
          if (connectionString && connectionString.length)
            localStorage.setItem(
              "__nx_last_connection_string__",
              connectionString,
            );
          localStorage.removeItem("__nx_connection_string__");
          router.replace("/configure");
        }}
        className={`${lastSegment == "configure" ? "hidden" : ""} fixed bottom-6 right-6 py-2 px-5 flex z-50 justify-end bg-white/5 transition-all hover:bg-white/10 backdrop-blur-2xl shadow-lg shadow-black rounded-full cursor-pointer`}
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
          <div className="text-center text-gray-400 p-2 pb-5">
            Enter this code in the app, once you are done press &quot;Done&quot;
          </div>
          <div className="text-3xl font-bold border border-gray-500 px-20 py-16 rounded-4xl">
            {code}
          </div>
          {lastConnectionString && lastConnectionString.length ? (
            <div className="text-center p-4 pt-8">
              {lastConnectionString === code ? (
                <div>Using last session &quot;{lastConnectionString}&quot;</div>
              ) : (
                <>
                  Use last session{"   "}
                  <span
                    className="py-2 px-4 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                    onClick={() => setCode(lastConnectionString)}
                  >
                    {lastConnectionString}
                  </span>
                </>
              )}
            </div>
          ) : null}
          <div className="flex flex-row gap-12 p-4 justify-around">
            <div
              className="py-2 px-4 rounded-full bg-white/5 hover:bg-white/10 transition-all"
              onClick={() => setCode(generateCode())}
            >
              New Code
            </div>
            <div
              className="py-2 px-5 rounded-full font-bold bg-white/5 hover:bg-white/10 transition-all"
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
        <div className="w-full h-full py-10scrollbar-hiddenoverflow-scroll flex items-center justify-center">
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
            <div className="w-full h-full flex flex-col gap-4">
              {notifications?.map((notification) => (
                <div
                  key={notification._id}
                  className="flex justify-between gap-2 flex-row bg-[#ffffff03] p-1.5 rounded-2xl"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="font-bold px-3 pt-1">
                      {notification.title}
                    </div>
                    <div className="text-sm text-gray-300 border-gray-700/20 rounded-2xl bg-[#ffffff06] border px-2.5 py-1.5">
                      {notification.message}
                    </div>
                  </div>

                  <div className="text-xs flex flex-col gap-1 p-1 justify-end">
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
                    <div className="text-gray-500 text-xs">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
