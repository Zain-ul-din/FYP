export default interface ChatMessageDoc {
  message: string;
  sender_id: string;
  sender_name: string;
  timeStamp: string;
  type: "activity" | "conversation" | "proposal"
  sender:  "patient" | "doctor"
}

