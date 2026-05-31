import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";

import Loading from "../../Loading";
import { getChatRooms } from "../../../services/chatService";
import { showError } from "../../../utils/toastMessages";
import type { ChatRoom } from "../../../types";

const ChatInbox = () => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getChatRooms();
                setRooms(data);
            } catch {
                showError("Failed to load messages");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-3 mb-6 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 via-emerald-50 to-cyan-50 px-4 py-4 shadow-sm">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-white flex items-center justify-center">
                    <FaComments />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Messages</h1>
                    <p className="text-cyan-700">Your conversations with guests and hosts</p>
                </div>
            </div>

            {rooms.length === 0 ? (
                <div className="border border-dashed border-cyan-200 rounded-2xl p-10 text-center bg-gradient-to-b from-white to-cyan-50/60">
                    <h2 className="text-lg font-semibold text-slate-900">No conversations yet</h2>
                    <p className="text-slate-600 mt-2">
                        Start a chat from a listing page when you have a question for a host.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-cyan-100 border border-cyan-100 rounded-2xl bg-white overflow-hidden shadow-sm">
                    {rooms.map((room) => {
                        const coverImage = room.listing.images?.[0]?.image;
                        return (
                            <Link
                                key={room.id}
                                to={`/messages/${room.id}`}
                                className="flex gap-4 p-4 hover:bg-gradient-to-r hover:from-cyan-50/70 hover:to-emerald-50/70 transition-colors"
                            >
                                <div className="h-20 w-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                    {coverImage ? (
                                        <img
                                            src={coverImage}
                                            alt={room.listing.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : null}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-900 truncate">
                                                {room.other_user?.username || room.name}
                                            </p>
                                            <p className="text-sm text-cyan-700 truncate">
                                                {room.listing.title}
                                            </p>
                                        </div>
                                        <span className="text-xs text-slate-500 shrink-0">
                                            {new Date(room.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-3 truncate">
                                        {room.last_message?.content || "No messages yet"}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChatInbox;
