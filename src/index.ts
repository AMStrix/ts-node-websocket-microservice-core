import WebSocket from "ws";
import notifiers from "./notifiers";

export type Send = (message: Message) => void;
export type Receive = (message: Message) => void;

export interface Message {
  type: string;
  payload: any;
}

const parse = (data: WebSocket.Data) => {
  try {
    return JSON.parse(data.toString());
  } catch (e) {
    console.log(
      `unable to parse incoming message, it was probably not JSON, data: ${data}`
    );
    return {};
  }
};

const wss = new WebSocket.Server({ port: 5050 });

wss.on("connection", function connection(ws) {
  const send: Send = message => {
    ws.send(JSON.stringify(message));
  };
  notifiers.forEach(n => n.registerSend(send));
  ws.on("message", message => {
    notifiers.forEach(n => n.receive(parse(message)));
  });
});
