import { Message } from "@/models/Message";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptMessage?: boolean;
  messages?:Array<Message>
}
