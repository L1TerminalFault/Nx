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
const POLLING_INTERVAL = 15000;

function generateCode() {
  return `${(Math.random() * 10000).toFixed(0).padStart(4, "0")}-${(Math.random() * 10000).toFixed(0).padStart(4, "0")}`;
}

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  const [refreshing, setRefreshing] = useState(false);
  const [code, setCode] = useState<string>(generateCode());
  const [connectionString, setConnectionString] = useState<string | null>(
    localStorage?.getItem("__nx_connection_string__") || null,
  );
  const [lastConnectionString, setLastConnectionString] = useState<
    string | null
  >(localStorage?.getItem("__nx_last_connection_string__") || null);

  useEffect(() => {
    setConnectionString(
      localStorage?.getItem("__nx_connection_string__") || null,
    );
    setLastConnectionString(
      localStorage?.getItem("__nx_last_connection_string__") || null,
    );
  }, []);

  const refresh = async () => {
    if (refreshing || loading) return;
    setRefreshing(true);
    try {
      const messagesFetched = await (
        await fetch(
          `/api/notifications/getNotifications?connectionString=${connectionString}`,
        )
      ).json();
      if (messagesFetched.messages) setNotifications(messagesFetched.messages);
    } catch {
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const poll = async () => {
      try {
        const messagesFetched = await (
          await fetch(
            `/api/notifications/getNotifications?connectionString=${connectionString}`,
          )
        ).json();
        if (messagesFetched.messages)
          setNotifications(messagesFetched.messages);
      } catch {}
    };

    const timer = setInterval(() => {
      if (refreshing || loading) return;
      poll();
    }, POLLING_INTERVAL);

    return () => clearInterval(timer);
  }, [connectionString, refreshing, loading]);

  useEffect(() => {
    // let socket: Socket;
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
  }, [connectionString, router, lastSegment]);

  return (
    <div className="min-h-screen bg-gray-900/10">
      <div className="w-full scrollbar-hidden overflow-scroll h-full py-16 flex flex-col items-center p-3 text-white transition-all">
        <div className="w-full flex items-center justify-between fixed top-0 p-4 text-xl border-transparent transition-all border-b-gray-700/30 border backdrop-blur-xl bg-transparent">
          <div className="flex items-center gap-2">
            <div>
              NxServer <span className="text-sm text-gray-500">v1.0.0</span>
            </div>
            <div
              className={`${lastSegment === "configure" ? "hidden" : ""} p-1 bg-orange-600 rounded-full`}
            ></div>
          </div>
          <div
            className={`text-base text-gray-400 ${!lastSegment ? "hidden" : ""}`}
          >
            Session{" "}
            {lastSegment == "configure" ? "Not Configured" : lastSegment}
          </div>
        </div>
        <div className="w-full p-2 flex justify-end">
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
            className={`${lastSegment == "configure" ? "hidden" : ""} py-1.5 px-3 flex justify-end bg-white/10 transition-all hover:bg-white/15 rounded-full cursor-pointer text-sm`}
          >
            Reconfigure
          </div>
          <div
            onClick={refresh}
            className={`${lastSegment === "configure" ? "hidden" : ""} fixed flex items-center gap-1.5 z-20 backdrop-blur-xl bottom-5 right-5 text-sm rounded-full shadow-lg shadow-black/30 bg-white/10 hover:bg-white/15 transition-all py-1.5 px-4 cursor-pointer`}
          >
            <FaCircleNotch
              className={`${refreshing ? "animate-spin" : ""} text-sm`}
            />
            <div>Refresh</div>
          </div>
        </div>
        {/* <div className="w-full h-screen"> */}
        {loading ? (
          <div className="w-full h-full p-10 flex-1 flex items-center justify-center">
            <FaCircleNotch className="animate-spin text-4xl" />
          </div>
        ) : notConfigured ? (
          <div className="flex flex-col items-center p-5 pt-16">
            <div className="text-2xl p-4">Configure</div>
            <div className="text-center text-gray-400 p-2 pb-5">
              Enter this code in the app, once you are done press
              &quot;Done&quot;
            </div>
            <div className="text-3xl font-bold border border-gray-500 px-20 py-16 rounded-4xl">
              {code}
            </div>
            {lastConnectionString && lastConnectionString.length ? (
              <div className="text-center p-4 pt-8">
                {lastConnectionString === code ? (
                  <div>Using last session</div>
                ) : (
                  <>
                    Use last session{"   "}
                    <span
                      className="py-2 px-4 rounded-full bg-white/10 hover:bg-white/15 transition-all"
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
                className="py-2 px-4 rounded-full bg-white/10 hover:bg-white/15 transition-all"
                onClick={() => setCode(generateCode())}
              >
                New Code
              </div>
              <div
                className="py-2 px-5 rounded-full font-bold bg-white/10 hover:bg-white/15 transition-all"
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
          <div className="w-full h-full flex items-center justify-center">
            {error ? (
              <div className="p-4 text-xl w-full h-full flex justify-center">
                {error}
              </div>
            ) : !notifications ? (
              <div className="p-4 text-xl w-full h-full flex justify-center">
                Could not load notifications
              </div>
            ) : !notifications?.length ? (
              <div className="p-4 text-xl w-full h-full flex justify-center">
                No notifications
              </div>
            ) : (
              <div className="w-full h-full flex flex-col gap-4 py-2 scrollbar-hidden">
                {notifications?.map((notification) => (
                  <div
                    key={notification._id}
                    className={`${Math.abs(Date.now() - parseInt(notification.time)) <= 60000 ? "bg-white/10 border border-gray-700/40" : "bg-[#ffffff0f]"} flex justify-between gap-2 flex-row  p-1.5 rounded-2xl`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="font-bold px-3 pt-1">
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-300 border-gray-700/30 rounded-2xl bg-[#ffffff0f] border px-2.5 py-1.5">
                        {notification.message}
                      </div>
                    </div>

                    <div className="text-xs flex flex-col gap-1 p-1 justify-end text-nowrap">
                      <div className="text-gray-400">
                        {Math.abs(Date.now() - parseInt(notification.time)) <=
                        60000 ? (
                          <span className="text-white font-bold">Just now</span>
                        ) : (
                          new Date(parseInt(notification.time)).toLocaleString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )
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
        {/* </div> */}
      </div>
    </div>
  );
}
