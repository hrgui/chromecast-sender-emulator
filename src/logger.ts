export function log(message?: any, ...optionalParams: any[]) {
  console.log("chromecast-sender-emulator:", message, ...optionalParams);
}

export function warn(message?: any, ...optionalParams: any[]) {
  console.warn("chromecast-sender-emulator:", message, ...optionalParams);
}

export function error(message?: any, ...optionalParams: any[]) {
  console.error("chromecast-sender-emulator:", message, ...optionalParams);
}
