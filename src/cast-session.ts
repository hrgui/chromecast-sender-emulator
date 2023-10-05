import type { EventType } from "chromecast-caf-receiver/cast.framework.events";
import {
  createSenderId,
  createSessionId,
  createLoadEventMessage,
  createMediaActionMessage,
  createGetMediaStatusEventMessage,
  createCustomMessage,
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
  mediaSessionId = 0;

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

    this.mediaSessionId += 1;

    return createLoadEventMessage(deepmerge(loadMessageStructure, loadEventMessage), this.senderId);
  }

  createPauseMessage() {
    return createMediaActionMessage({
      mediaAction: "PAUSE",
      mediaSessionId: this.mediaSessionId,
      requestId: this.getNextRequestId(),
      senderId: this.senderId,
    });
  }

  createPlayMessage() {
    return createMediaActionMessage({
      mediaAction: "PLAY",
      mediaSessionId: this.mediaSessionId,
      requestId: this.getNextRequestId(),
      senderId: this.senderId,
    });
  }

  createStopMessage() {
    return createMediaActionMessage({
      mediaAction: "STOP",
      mediaSessionId: this.mediaSessionId,
      requestId: this.getNextRequestId(),
      senderId: this.senderId,
    });
  }

  createSeekMessage(seconds: number) {
    return createMediaActionMessage({
      mediaAction: "SEEK",
      mediaSessionId: this.mediaSessionId,
      requestId: this.getNextRequestId(),
      senderId: this.senderId,
      other: {
        currentTime: seconds,
      },
    });
  }

  createClosedCaptionsOnMessage(overrides = {}) {
    return createMediaActionMessage({
      mediaAction: "EDIT_TRACKS_INFO",
      mediaSessionId: this.mediaSessionId,
      requestId: this.getNextRequestId(),
      senderId: this.senderId,
      other: {
        enableTextTracks: true,
        ...overrides,
      },
    });
  }

  createClosedCaptionsOffMessage(overrides = {}) {
    return createMediaActionMessage({
      mediaAction: "EDIT_TRACKS_INFO",
      mediaSessionId: this.mediaSessionId,
      requestId: this.getNextRequestId(),
      senderId: this.senderId,
      other: {
        activeTrackIds: [],
        ...overrides,
      },
    });
  }

  createGetMediaStatusEventMessage() {
    return createGetMediaStatusEventMessage(this.getNextRequestId(), this.senderId);
  }

  createCustomMessage(data: { [name: string]: any }, namespace: string) {
    return createCustomMessage(data, namespace, this.senderId);
  }

  createIdentifyEventMessage(identifyMessage: Partial<IdentifyEventMessage> = {}) {
    const sampleIdentifyMessage = {
      applicationId: "628AC8D3",
      applicationName: "CAFV1",
      closedCaption: {},
      deviceCapabilities: {
        bluetooth_supported: true,
        display_supported: true,
        touch_input_supported: false,
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
