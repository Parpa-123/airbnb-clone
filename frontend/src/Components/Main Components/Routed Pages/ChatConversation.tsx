import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

import Loading from "../../Loading";
import { createChatSocket, getChatMessages, getChatRooms } from "../../../services/chatService";
import { showError } from "../../../utils/toastMessages";
import type { ChatMessage, ChatRoom } from "../../../types";

interface SocketMessage {
    message: string;
    username: string;
}

const ChatConversation = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const parsedRoomId = Number(roomId);
    const [room, setRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(true);
    const socketRef = useRef<WebSocket | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!parsedRoomId) return;

        (async () => {
            try {
                const [rooms, history] = await Promise.all([
                    getChatRooms(),
                    getChatMessages(parsedRoomId),
                ]);
                setRoom(rooms.find((item) => item.id === parsedRoomId) || null);
                setMessages(history);
            } catch {
                showError("Failed to load conversation");
            } finally {
                setLoading(false);
            }
        })();
    }, [parsedRoomId]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!parsedRoomId || !token) return;

        const socket = createChatSocket(parsedRoomId, token);
        socketRef.current = socket;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data) as SocketMessage;
            setMessages((current) => [
                ...current,
                {
                    id: Date.now(),
                    user: {
                        email: "",
                        username: data.username,
                    },
                    content: data.message,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ]);
        };

        socket.onerror = () => showError("Chat connection failed");

        return () => {
            socket.close();
        };
    }, [parsedRoomId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const message = draft.trim();
        if (!message || socketRef.current?.readyState !== WebSocket.OPEN) return;

        socketRef.current.send(JSON.stringify({ message }));
        setDraft("");
    };

    if (loading) return <Loading />;

    if (!room) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-12 text-center">
                <h1 className="text-xl font-semibold text-gray-900">Conversation not found</h1>
                <Link to="/messages" className="inline-block mt-4 text-brand font-medium hover:text-brand-hover">
                    Back to messages
                </Link>
            </div>
        );
    }

    const currentUsername = room.other_user
        ? room.host.username === room.other_user.username
            ? room.guest.username
            : room.host.username
        : "";

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 min-h-[calc(100vh-96px)] flex flex-col">
            <div className="flex items-center gap-4 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 via-emerald-50 to-cyan-50 px-4 py-3 shadow-sm">
                <Link
                    to="/messages"
                    className="h-10 w-10 rounded-full border border-cyan-200 bg-white text-cyan-700 flex items-center justify-center hover:bg-cyan-50 transition-colors"
                    aria-label="Back to messages"
                >
                    <FaArrowLeft />
                </Link>
                <div className="min-w-0">
                    <h1 className="text-xl font-semibold text-slate-900 truncate">
                        {room.other_user?.username || room.name}
                    </h1>
                    <p className="text-sm text-cyan-700 truncate">{room.listing.title}</p>
                </div>
            </div>

            <div
                className="mt-4 flex-1 rounded-2xl border border-cyan-100 bg-gradient-to-b from-cyan-50/70 via-white to-emerald-50/60 p-4 sm:p-5 space-y-3 overflow-y-auto"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(8, 145, 178, 0.08) 1px, transparent 0)", backgroundSize: "18px 18px" }}
            >
                {messages.length === 0 ? (
                    <div className="text-center text-slate-600 py-12">
                        Send the first message about this listing.
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwnMessage = message.user.username === currentUsername;
                        return (
                            <div
                                key={`${message.id}-${message.created_at}`}
                                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${isOwnMessage
                                        ? "rounded-br-md bg-gradient-to-br from-emerald-300 via-emerald-200 to-cyan-100 border border-emerald-300/60 text-slate-900"
                                        : "rounded-bl-md bg-white border border-cyan-100 text-slate-900"
                                        }`}
                                >
                                    <p className={`text-xs font-semibold mb-1 ${isOwnMessage ? "text-emerald-800" : "text-cyan-700"}`}>
                                        {message.user.username}
                                    </p>
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                    <p className={`mt-1 text-[11px] ${isOwnMessage ? "text-emerald-700/80" : "text-slate-500"}`}>
                                        {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-4 rounded-2xl border border-cyan-100 bg-white/95 shadow-sm px-3 py-3 flex gap-3"
            >
                <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Write a message"
                    className="flex-1 rounded-full border border-cyan-200 bg-cyan-50/40 px-5 py-3 outline-none focus:border-emerald-400 focus:bg-white transition-colors"
                />
                <button
                    type="submit"
                    className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-white flex items-center justify-center disabled:from-gray-300 disabled:to-gray-300 transition-all"
                    disabled={!draft.trim()}
                    aria-label="Send message"
                >
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
};

export default ChatConversation;
