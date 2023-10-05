import WebSocket from "ws";
import { log } from "./logger";
import { CastSession } from "./cast-session";
import { IdentifyEventMessage, LoadEventMessage } from "./cast-events";

/**
 * Configuration for WebSocket server
 */
const serverConfig = {
  port: 8008,
  path: "/v2/ipc",
};

const makeDeferred = () => {
  const deferred: any = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

export class CastSenderEmulator {
  options: any;
  /**
   * WebSocker server instance.
   */
  webSocketServer: WebSocket.Server | null = null;
  activeWebSocket?: WebSocket | null = null;
  _waiting = makeDeferred();
  onConnection: any = null;
  castSession = new CastSession();

  constructor(options = {}) {
    this.options = options;
    /**
     * Event handlers for WebSocket server
     */
    this._webSocketMessageHandler = this._webSocketMessageHandler.bind(this);
    this._webSocketConnectionHandler = this._webSocketConnectionHandler.bind(this);
  }

  /**
   * Startup the emulator
   */
  async start(onConnection: any) {
    this.onConnection = onConnection;
    return new Promise<void>((resolve, reject) => {
      this.webSocketServer = new WebSocket.Server(
        {
          port: serverConfig.port,
          path: serverConfig.path,
        },
        () => {
          this.webSocketServer?.on("connection", (s) => {
            this._webSocketConnectionHandler(s);
            resolve();
            // this.
          });
          if (!this.options.silent) {
            log(`Established a websocket server at port ${serverConfig.port}`);
            log("Ready for Chromecast receiver connections..");
          }
        }
      );
    });
  }

  /**
   * Stop handling events from WebSocket server
   */
  stop() {
    this.webSocketServer?.removeAllListeners("message");
    this.webSocketServer?.removeAllListeners("connection");
  }

  /**
   * Close the WebSocket server
   */
  close() {
    return new Promise<void>((resolve, reject) => {
      this.webSocketServer?.close(() => {
        if (!this.options.silent) {
          log("Chromecast Device Emulator is closed.");
        }
        resolve();
      });
    });
  }

  /**
   * Handle incoming WebSocket connections
   */
  _webSocketConnectionHandler(ws: WebSocket) {
    if (!this.options.silent) log("There is a cast client just connected.");
    /**
     * Listen to message events on each socket connection
     */
    ws.on("message", this._webSocketMessageHandler);
    // (this as any).ws = ws;
    // this.onConnection?.(ws);
    this.activeWebSocket = ws;
  }

  async send(ws: WebSocket | null | undefined, x: { [name: string]: any }) {
    return new Promise((resolve, reject) => {
      if (!ws) {
        return reject("No active websocket");
      }

      if (ws.readyState === WebSocket.OPEN) {
        log(JSON.stringify(x));
        ws.send(JSON.stringify(x), (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(x);
          }
        });
      }
    });
  }

  identify(identifyMessage: Partial<IdentifyEventMessage> = {}) {
    return this.send(
      this.activeWebSocket,
      this.castSession.createIdentifyEventMessage(identifyMessage)
    );
  }

  load(loadEventMessage: Partial<LoadEventMessage> = {}) {
    return this.send(
      this.activeWebSocket,
      this.castSession.createLoadEventMessage(loadEventMessage)
    );
  }

  /**
   * Handle incoming WebSocket messages
   */
  _webSocketMessageHandler(message: Buffer) {
    log("<<", message.toString());
  }
}
