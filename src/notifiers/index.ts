import Clock from "./clock";
import { Send, Message } from "..";

export interface Notifier {
  registerSend(send: Send): void;
  receive(message: Message): void;
}

export default [new Clock()] as Notifier[];
