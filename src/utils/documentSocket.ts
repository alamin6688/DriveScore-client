"use client";

import { io, type Socket } from "socket.io-client";

const getDocumentSocketUrl = () => {
  const explicitUrl = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (explicitUrl) return explicitUrl;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) return undefined;

  return apiUrl.replace(/\/api\/v\d+\/?$/, "").replace(/\/$/, "");
};

export const createDocumentSocket = (): Socket | null => {
  const socketUrl = getDocumentSocketUrl();
  if (!socketUrl) return null;

  return io(socketUrl, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    autoConnect: true,
  });
};
