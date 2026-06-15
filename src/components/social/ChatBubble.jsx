// src/components/social/ChatBubble.jsx
export default function ChatBubble({ msg, currentUserId }) {
  const isSender = msg.sender.id === currentUserId;

  return (
    <div className={`flex w-full my-2 ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-xs px-4 py-2 rounded-2xl shadow-md
          ${isSender 
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
          }
        `}
      >
        <p className="text-sm">{msg.text}</p>

        <p className="text-[10px] opacity-70 mt-1 text-right">
          {new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
