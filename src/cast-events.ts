import { LoadEvent } from "chromecast-caf-receiver/cast.framework.events";
import { randomUUID } from "crypto";

// export const SENDER_ID = `7f8b100d-a1fe-e60b-5a35-6feaa22976df.2:sender-l4koe754cbxf`;
// export const SESSION_ID = "46fd154e-f03d-4d58-986d-4998c43639a7";

export type IdentifyEventMessage = {
  applicationId: string;
  applicationName: string;
  closedCaption: any;
  deviceCapabilities: {
    bluetooth_supported?: boolean;
    display_supported?: boolean;
    touch_input_supported?: boolean;
    focus_state_supported?: boolean;
    hi_res_audio_supported?: boolean;
  };
  launchingSenderId: string;
  messagesVersion: string;
  sessionId: string;
  type: string;
  version: string;
};

export function createSenderId() {
  return `${randomUUID()}.2:sender-test`;
}

export function createSessionId() {
  return randomUUID();
}

// export const sampleIdentifyMessage = {
//   applicationId: "628AC8D3",
//   applicationName: "CAFV1",
//   closedCaption: {},
//   deviceCapabilities: {
//     bluetooth_supported: true,
//     display_supported: true,
//     touch_input_supported: true,
//     focus_state_supported: true,
//     hi_res_audio_supported: false,
//   },
//   launchingSenderId: SENDER_ID,
//   messagesVersion: "1.0",
//   sessionId: SESSION_ID,
//   type: "ready",
//   version: "1.30.113131",
// };

// export const getStatusMessage = { type: "GET_STATUS", requestId: 889570261 };

export function createGetMediaStatusEventMessage(requestId: number, senderId: string) {
  return {
    data: JSON.stringify({ type: "GET_STATUS", requestId }),
    namespace: "urn:x-cast:com.google.cast.media",
    senderId,
  };
}

// export const sampleLoadMessage: LoadEvent & {
//   requestId?: number;
//   sessionId?: string;
//   autoplay?: boolean;
// } = {
//   type: "LOAD" as EventType,
//   requestId: 889570262,
//   sessionId: SESSION_ID,
//   media: {
//     contentId: "bbb",
//     streamType: "BUFFERED" as StreamType,
//     contentType: "video/mp4",
//     metadata: {
//       type: 0,
//       metadataType: 0,
//       title: "Big Buck Bunny",
//       images: [
//         {
//           url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
//         },
//       ],
//     },
//   },
//   autoplay: true,
// };

export type LoadEventMessage = LoadEvent & {
  requestId?: number;
  sessionId?: string;
  autoplay?: boolean;
};

export function createLoadEventMessage(loadEventMessage: LoadEventMessage, senderId: string) {
  return {
    data: JSON.stringify(loadEventMessage),
    namespace: "urn:x-cast:com.google.cast.media",
    senderId: senderId,
  };
}

export function createMediaActionMessage({
  mediaAction,
  mediaSessionId,
  requestId,
  senderId,
  other,
}: {
  mediaAction: string;
  mediaSessionId: string | number;
  requestId: string | number;
  senderId: string;
  other?: any;
}) {
  return {
    data: JSON.stringify({
      requestId,
      type: mediaAction,
      mediaSessionId,
      ...other,
    }),
    namespace: "urn:x-cast:com.google.cast.media",
    senderId: senderId,
  };
}

export function createCustomMessage(
  data: { [name: string]: any },
  namespace: string,
  senderId: string
) {
  return {
    data: JSON.stringify(data),
    namespace,
    senderId,
  };
}

export function createIdentifyEventMessage(identifyMessage: IdentifyEventMessage) {
  return {
    data: JSON.stringify(identifyMessage),
    namespace: "urn:x-cast:com.google.cast.system",
    senderId: "SystemSender",
  };
}
