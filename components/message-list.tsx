import { useState } from 'react';
import {
  differenceInMinutes,
  format,
  isToday,
  isYesterday
} from 'date-fns';

import { GetMessageResponse } from "@/hooks/use-messages";
import { Message } from './message';
import { ChannelHero } from './channel-hero';
import { Id } from '@/convex/_generated/dataModel';
import { useCurrentMember, useWorkspaceId } from '@/hooks';

const TIME_THRESHOLD = 5;

type Props = {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessageResponse | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "EEEE, MMMM d");
};

export const MessageList = ({
  memberImage,
  memberName,
  channelName,
  channelCreationTime,
  data,
  variant = "channel",
  loadMore,
  isLoadingMore,
  canLoadMore,
}: Props) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const groupedMessages = data?.reduce((groups, message) => {
    const date = new Date(message._creationTime);
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].unshift(message);
    return groups;
  }, {} as Record<string, typeof data>);

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-grey-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-grey-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {
            messages.map((message, idx) => {
              const prevMessage = messages[idx - 1];
              const isCompact = prevMessage
                && prevMessage.user._id === message.user._id
                && differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime),
                ) < TIME_THRESHOLD;
              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={currentMember?._id === message.memberId}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton={variant === 'thread'}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                />
              )
            })
          }
        </div>
      ))}
      {variant === 'channel' && channelName && channelCreationTime && (
        <ChannelHero
          name={channelName}
          creationTime={channelCreationTime}
        />
      )}
    </div>
  )
};