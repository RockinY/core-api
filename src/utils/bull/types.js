// @flow
import type {
  DBThread,
  DBReaction,
  DBChannel,
  DBMessage,
  DBUser,
  DBCommunity,
  DBNotificationsJoin,
  FileUpload
} from '../../flowTypes'

export type Job<JobData> = {|
  id: string,
  data: JobData,
  remove: () => Promise<void>,
|};

type JobOptions = {|
  jobId?: number | string,
  delay?: number,
  removeOnComplete?: boolean,
  removeOnFail?: boolean,
|};

interface BullQueue<JobData> {
  add: (data: JobData, options?: JobOptions) => Promise<any>;
  process: (
    cb: (job: Job<JobData>, done: Function) => void | Promise<any>
  ) => void;
  getJob: (id: string) => Promise<Job<JobData> | null>;
}

export type MentionNotificationJobData = {
  messageId?: string, // This is only set if it's a message mention notification
  threadId: string, // This is always set, no matter if it's a message or thread mention notification
  senderId: string,
  username: ?string,
  type: 'message' | 'thread',
};

export type ChannelNotificationJobData = {
  channel: DBChannel,
  userId: string,
};

export type ThreadNotificationJobData = { thread: DBThread };

export type CommunityNotificationJobData = {
  communityId: string,
  userId: string,
};

export type UserThreadLastSeenJobData = {
  threadId: string,
  userId: string,
  timestamp: number | Date,
};

export type ReactionNotificationJobData = {
  reaction: DBReaction,
  userId: string,
};

export type PrivateChannelRequestJobData = {
  userId: string,
  channel: DBChannel,
};

export type PrivateChannelRequestApprovedJobData = {
  userId: string,
  channelId: string,
  communityId: string,
  moderatorId: string,
};

export type PrivateCommunityRequestJobData = {
  userId: string,
  communityId: string,
};

export type PrivateCommunityRequestApprovedJobData = {
  userId: string,
  communityId: string,
  moderatorId: string,
};

export type PrivateChannelInviteNotificationJobData = {
  recipient: { email: string, firstName?: ?string, lastName?: ?string },
  channelId: string,
  senderId: string,
  customMessage?: ?string,
};

export type CommunityInviteNotificationJobData = {
  recipient: { email: string, firstName?: ?string, lastName?: ?string },
  communityId: string,
  senderId: string,
  customMessage?: ?string,
};

export type DirectMessageNotificationJobData = {
  message: DBMessage,
  userId: string,
};

export type MessageNotificationJobData = { message: DBMessage };

type Attachment = {
  attachmentType: string,
  data: string,
};

type File = FileUpload;

type PublishingThreadType = {
  channelId: string,
  communityId: string,
  type: 'SLATE' | 'DRAFTJS',
  content: {
    title: string,
    body?: string,
  },
  attachments?: ?Array<Attachment>,
  filesToUpload?: ?Array<File>,
};

export type PushNotificationsJobData = {
  // This gets passed a join of the userNotification and the notification record
  notification: DBNotificationsJoin,
};

export type Queues = {
  // athena
  sendThreadNotificationQueue: BullQueue<ThreadNotificationJobData>,
  sendCommunityNotificationQueue: BullQueue<CommunityNotificationJobData>,
  trackUserThreadLastSeenQueue: BullQueue<UserThreadLastSeenJobData>,
  sendReactionNotificationQueue: BullQueue<ReactionNotificationJobData>,
  sendPrivateChannelRequestQueue: BullQueue<PrivateChannelRequestJobData>,
  sendPrivateChannelRequestApprovedQueue: BullQueue<
    PrivateChannelRequestApprovedJobData
  >,
  sendPrivateCommunityRequestQueue: BullQueue<PrivateCommunityRequestJobData>,
  sendPrivateCommunityRequestApprovedQueue: BullQueue<
    PrivateCommunityRequestApprovedJobData
  >,
  sendPrivateChannelInviteNotificationQueue: BullQueue<
    PrivateChannelInviteNotificationJobData
  >,
  sendCommunityInviteNotificationQueue: BullQueue<
    CommunityInviteNotificationJobData
  >,
  sendChannelNotificationQueue: BullQueue<ChannelNotificationJobData>,
  sendDirectMessageNotificationQueue: BullQueue<
    DirectMessageNotificationJobData
  >,
  sendMessageNotificationQueue: BullQueue<MessageNotificationJobData>,
  sendMentionNotificationQueue: BullQueue<MentionNotificationJobData>,
  sendNotificationAsPushQueue: BullQueue<PushNotificationsJobData>
};
