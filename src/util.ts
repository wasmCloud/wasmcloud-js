import { JSONCodec } from 'nats.ws';

const jc = JSONCodec();

/**
 * uuidv4 returns a uuid string
 *
 * @returns {string}
 */
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * parseJwt takes a jwt token and parses it into a json object
 *
 * @param token - the jwt token
 * @returns {any} - the parsed jwt token with claims
 */
export function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

/**
 * jsonEncode taks a json object and encodes it into uint8array for nats
 *
 * @param data - the data to encode
 * @returns {Uint8Array}
 */
export function jsonEncode(data: any): Uint8Array {
  return jc.encode(data);
}

/**
 * jsonDecode decodes nats messages into json
 *
 * @param {Uint8Array} data - the nats encoded data
 * @returns {any}
 */
export function jsonDecode(data: Uint8Array) {
  return jc.decode(data);
}
