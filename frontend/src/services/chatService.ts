import axiosInstance from "./connect";
import type { ChatMessage, ChatRoom, PaginatedResponse } from "../types";
import { extractResults } from "../utils/pagination";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/";

export async function getOrCreateListingRoom(listingId: number): Promise<ChatRoom> {
    const res = await axiosInstance.post<ChatRoom>(`/chat/listings/${listingId}/room/`);
    return res.data;
}

export async function getChatRooms(): Promise<ChatRoom[]> {
    const res = await axiosInstance.get<ChatRoom[] | PaginatedResponse<ChatRoom>>("/chat/rooms/");
    return extractResults(res.data);
}

export async function getChatMessages(roomId: number): Promise<ChatMessage[]> {
    const res = await axiosInstance.get<ChatMessage[] | PaginatedResponse<ChatMessage>>(
        `/chat/rooms/${roomId}/messages/`
    );
    return extractResults(res.data);
}

export function createChatSocket(roomId: number, token: string): WebSocket {
    const apiBase = new URL(API_URL, window.location.origin);
    const wsProtocol = apiBase.protocol === "https:" ? "wss:" : "ws:";
    const socketUrl = `${wsProtocol}//${apiBase.host}/ws/chat/${roomId}/?token=${encodeURIComponent(token)}`;
    return new WebSocket(socketUrl);
}
