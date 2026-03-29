import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-base-100/50">
      <div className="text-center space-y-4">
        
        <div className="flex justify-center">
{/* bounce */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h2 className="text-xl font-bold">
          Welcome to EASY CHAT
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-fade">
        <img
        src="/signup.png"
        alt="welcome"
        className="w-72 md:w-96 mb-6 animate-premium"
      /></div>
        <p className="text-base-content/60">
          Select a chat or group to start messaging
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;