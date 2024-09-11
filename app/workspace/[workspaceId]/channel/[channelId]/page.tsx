'use client';

import { Loader, TriangleAlert } from "lucide-react";

import {
  useChannelId,
  useGetChannel
} from "@/hooks";
import { ChannelHeader } from "./channel-header";
import { ChatInput } from "./chat-input";

const Channel = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

  if (channelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="test-sm text-muted-foreground">
          Channel not found
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader title={channel.name} />
      <div className="flex-1" />
      <ChatInput />
    </div>
  )
};

export default Channel;
