import { FieldValue } from "firebase/firestore";

export default interface ChatMessageDoc {
  message: string;
  sender_id: string;
  sender_name: string;
  timestamp: FieldValue;
  type: "activity" | "conversation" | "proposal"
  sender:  "patient" | "doctor"
}


