import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/configure");
  // (
  //   <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
  //     <div>Root Page</div>
  //   </div>
  // );
}
