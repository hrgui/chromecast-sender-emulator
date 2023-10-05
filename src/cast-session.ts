import type { EventType } from "chromecast-caf-receiver/cast.framework.events";
import {
  createSenderId,
  createSessionId,
  createLoadEventMessage,
  createGetMediaStatusEventMessage,
  LoadEventMessage,
  createIdentifyEventMessage,
  IdentifyEventMessage,
} from "./cast-events";
import type { MediaInformation } from "chromecast-caf-receiver/cast.framework.messages";
import deepmerge from "deepmerge";

export class CastSession {
  senderId = createSenderId();
  sessionId = createSessionId();
  requestId = 889570260;

  getNextRequestId() {
    this.requestId += 1;
    return this.requestId;
  }

  createLoadEventMessage(loadEventMessage: Partial<LoadEventMessage> = {}) {
    const loadMessageStructure: LoadEventMessage = {
      type: "LOAD" as EventType,
      requestId: this.getNextRequestId(),
      sessionId: this.sessionId,
      media: {} as MediaInformation,
    };

    return createLoadEventMessage(deepmerge(loadMessageStructure, loadEventMessage), this.senderId);
  }

  createGetMediaStatusEventMessage() {
    return createGetMediaStatusEventMessage(this.getNextRequestId(), this.senderId);
  }

  createIdentifyEventMessage(identifyMessage: Partial<IdentifyEventMessage> = {}) {
    const sampleIdentifyMessage = {
      applicationId: "628AC8D3",
      applicationName: "CAFV1",
      closedCaption: {},
      deviceCapabilities: {
        bluetooth_supported: true,
        display_supported: true,
        touch_input_supported: true,
        focus_state_supported: true,
        hi_res_audio_supported: false,
      },
      launchingSenderId: this.senderId,
      messagesVersion: "1.0",
      sessionId: this.sessionId,
      type: "ready",
      version: "1.30.113131",
    };

    return createIdentifyEventMessage(deepmerge(sampleIdentifyMessage, identifyMessage));
  }
}
