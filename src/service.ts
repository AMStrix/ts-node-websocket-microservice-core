import WebSocket from "ws";
import { initializeNotifiers, Notifier } from "./notifiers";
import { getIpFromRequest, authenticateRequest } from "./util";

const log = console.log;

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
      `unable to parse message, it was probably not JSON, data: ${data}`
    );
    return {};
  }
};

let wss: null | WebSocket.Server = null;
let notifiers = [] as Notifier[];

export function start() {
  if (wss) return;
  wss = new WebSocket.Server({ port: 5050 });
  const send: Send = message =>
    wss &&
    wss.clients.forEach(ws => {
      try {
        ws.send(JSON.stringify(message));
      } catch (e) {
        log(`Send error: ${e}`);
      }
    });

  notifiers = initializeNotifiers();
  notifiers.forEach(n => n.registerSend(send));

  wss.on("connection", function connection(ws, req) {
    log(`${getIpFromRequest(req)} connected`);
    const isAuth = authenticateRequest(req);
    if (!isAuth) {
      log(`Connection ${getIpFromRequest(req)} rejected, unauthorized.`);
      ws.send(JSON.stringify({ type: "auth", payload: "rejected" }));
      ws.terminate();
      return;
    }

    ws.on("message", message => {
      notifiers.forEach(n => n.receive(parse(message)));
    });
    ws.on("close", () => {
      log(`${getIpFromRequest(req)} closed.`);
    });
  });
}

export function exit() {
  notifiers.forEach(n => n.destroy());
  wss && wss.close();
  wss = null;
}
