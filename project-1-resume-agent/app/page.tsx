import ChatInterface from "./components/ChatInterface";

export default function Home() {
  return (
    <main className="h-[100dvh] w-full bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full flex justify-center">
        <ChatInterface />
      </div>
    </main>
  );
}
