import type { ToolCallEventType } from './adapters/agui/types/events';

export type ChatMessageStatus = 'pending' | 'streaming' | 'complete' | 'stop' | 'error';
export type AttachmentType = 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'ppt' | 'txt';
export type ChatComment = 'good' | 'bad' | '';

// 基础内容接口
export interface ChatBaseContent<T extends string, D> {
  type: T;
  data: D;
  status?: ChatMessageStatus;
  id?: string;
  strategy?: 'merge' | 'append';
  ext?: Record<string, any>;
}

// 内容类型定义
export type TextContent = ChatBaseContent<'text', string>;
export type MarkdownContent = ChatBaseContent<'markdown', string>;
export type ImageContent = ChatBaseContent<'image', { name?: string; url?: string; width?: number; height?: number }>;
export type ThinkingContent = ChatBaseContent<'thinking', { text?: string; title?: string }>;
export type SearchContent = ChatBaseContent<'search', { title?: string; references?: { title: string; icon?: string; type?: string; url?: string; content?: string; site?: string; date?: string }[] }>;
export type SuggestionContent = ChatBaseContent<'suggestion', { title: string; prompt?: string }[]>;
export type AttachmentContent = ChatBaseContent<'attachment', { fileType: AttachmentType; size?: number; name?: string; url?: string; isReference?: boolean; width?: number; height?: number; extension?: string; metadata?: Record<string, any> }[]>;
export type ToolCallContent = ChatBaseContent<'toolcall', { toolCallId: string; toolCallName: string; eventType?: ToolCallEventType; parentMessageId?: string; args?: string; chunk?: string; result?: string }>;
export type ActivityContent<T = Record<string, any>> = ChatBaseContent<'activity', { activityType: string; messageId?: string; content: T; deltaInfo?: { fromIndex: number; toIndex: number } }>;

// 聚合内容类型
export type AIMessageContent = TextContent | MarkdownContent | ImageContent | ThinkingContent | SearchContent | SuggestionContent | ReasoningContent | ToolCallContent | ActivityContent;
export type ReasoningContent = ChatBaseContent<'reasoning', AIMessageContent[]>;
export type UserMessageContent = TextContent | AttachmentContent;

// 消息类型定义
export interface ChatBaseMessage {
  id: string;
  status?: ChatMessageStatus;
  datetime?: string;
  ext?: any;
}

export interface UserMessage extends ChatBaseMessage {
  role: 'user';
  content: UserMessageContent[];
}

export interface AIMessage extends ChatBaseMessage {
  role: 'assistant';
  content?: AIMessageContent[];
  history?: AIMessageContent[][];
  comment?: ChatComment;
}

export interface SystemMessage extends ChatBaseMessage {
  role: 'system';
  content: TextContent[];
}

export type ChatMessagesData = UserMessage | AIMessage | SystemMessage;