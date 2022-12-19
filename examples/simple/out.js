"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../../node_modules/@msgpack/msgpack/dist/utils/int.js
  var require_int = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/utils/int.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getUint64 = exports.getInt64 = exports.setInt64 = exports.setUint64 = exports.UINT32_MAX = void 0;
      exports.UINT32_MAX = 4294967295;
      function setUint64(view, offset, value) {
        const high = value / 4294967296;
        const low = value;
        view.setUint32(offset, high);
        view.setUint32(offset + 4, low);
      }
      exports.setUint64 = setUint64;
      function setInt64(view, offset, value) {
        const high = Math.floor(value / 4294967296);
        const low = value;
        view.setUint32(offset, high);
        view.setUint32(offset + 4, low);
      }
      exports.setInt64 = setInt64;
      function getInt64(view, offset) {
        const high = view.getInt32(offset);
        const low = view.getUint32(offset + 4);
        return high * 4294967296 + low;
      }
      exports.getInt64 = getInt64;
      function getUint64(view, offset) {
        const high = view.getUint32(offset);
        const low = view.getUint32(offset + 4);
        return high * 4294967296 + low;
      }
      exports.getUint64 = getUint64;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/utils/utf8.js
  var require_utf8 = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/utils/utf8.js"(exports) {
      "use strict";
      var _a;
      var _b;
      var _c;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.utf8DecodeTD = exports.TEXT_DECODER_THRESHOLD = exports.utf8DecodeJs = exports.utf8EncodeTE = exports.TEXT_ENCODER_THRESHOLD = exports.utf8EncodeJs = exports.utf8Count = void 0;
      var int_1 = require_int();
      var TEXT_ENCODING_AVAILABLE = (typeof process === "undefined" || ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a["TEXT_ENCODING"]) !== "never") && typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined";
      function utf8Count(str) {
        const strLength = str.length;
        let byteLength = 0;
        let pos = 0;
        while (pos < strLength) {
          let value = str.charCodeAt(pos++);
          if ((value & 4294967168) === 0) {
            byteLength++;
            continue;
          } else if ((value & 4294965248) === 0) {
            byteLength += 2;
          } else {
            if (value >= 55296 && value <= 56319) {
              if (pos < strLength) {
                const extra = str.charCodeAt(pos);
                if ((extra & 64512) === 56320) {
                  ++pos;
                  value = ((value & 1023) << 10) + (extra & 1023) + 65536;
                }
              }
            }
            if ((value & 4294901760) === 0) {
              byteLength += 3;
            } else {
              byteLength += 4;
            }
          }
        }
        return byteLength;
      }
      exports.utf8Count = utf8Count;
      function utf8EncodeJs(str, output, outputOffset) {
        const strLength = str.length;
        let offset = outputOffset;
        let pos = 0;
        while (pos < strLength) {
          let value = str.charCodeAt(pos++);
          if ((value & 4294967168) === 0) {
            output[offset++] = value;
            continue;
          } else if ((value & 4294965248) === 0) {
            output[offset++] = value >> 6 & 31 | 192;
          } else {
            if (value >= 55296 && value <= 56319) {
              if (pos < strLength) {
                const extra = str.charCodeAt(pos);
                if ((extra & 64512) === 56320) {
                  ++pos;
                  value = ((value & 1023) << 10) + (extra & 1023) + 65536;
                }
              }
            }
            if ((value & 4294901760) === 0) {
              output[offset++] = value >> 12 & 15 | 224;
              output[offset++] = value >> 6 & 63 | 128;
            } else {
              output[offset++] = value >> 18 & 7 | 240;
              output[offset++] = value >> 12 & 63 | 128;
              output[offset++] = value >> 6 & 63 | 128;
            }
          }
          output[offset++] = value & 63 | 128;
        }
      }
      exports.utf8EncodeJs = utf8EncodeJs;
      var sharedTextEncoder = TEXT_ENCODING_AVAILABLE ? new TextEncoder() : void 0;
      exports.TEXT_ENCODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE ? int_1.UINT32_MAX : typeof process !== "undefined" && ((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b["TEXT_ENCODING"]) !== "force" ? 200 : 0;
      function utf8EncodeTEencode(str, output, outputOffset) {
        output.set(sharedTextEncoder.encode(str), outputOffset);
      }
      function utf8EncodeTEencodeInto(str, output, outputOffset) {
        sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
      }
      exports.utf8EncodeTE = (sharedTextEncoder === null || sharedTextEncoder === void 0 ? void 0 : sharedTextEncoder.encodeInto) ? utf8EncodeTEencodeInto : utf8EncodeTEencode;
      var CHUNK_SIZE = 4096;
      function utf8DecodeJs(bytes, inputOffset, byteLength) {
        let offset = inputOffset;
        const end = offset + byteLength;
        const units = [];
        let result = "";
        while (offset < end) {
          const byte1 = bytes[offset++];
          if ((byte1 & 128) === 0) {
            units.push(byte1);
          } else if ((byte1 & 224) === 192) {
            const byte2 = bytes[offset++] & 63;
            units.push((byte1 & 31) << 6 | byte2);
          } else if ((byte1 & 240) === 224) {
            const byte2 = bytes[offset++] & 63;
            const byte3 = bytes[offset++] & 63;
            units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
          } else if ((byte1 & 248) === 240) {
            const byte2 = bytes[offset++] & 63;
            const byte3 = bytes[offset++] & 63;
            const byte4 = bytes[offset++] & 63;
            let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
            if (unit > 65535) {
              unit -= 65536;
              units.push(unit >>> 10 & 1023 | 55296);
              unit = 56320 | unit & 1023;
            }
            units.push(unit);
          } else {
            units.push(byte1);
          }
          if (units.length >= CHUNK_SIZE) {
            result += String.fromCharCode(...units);
            units.length = 0;
          }
        }
        if (units.length > 0) {
          result += String.fromCharCode(...units);
        }
        return result;
      }
      exports.utf8DecodeJs = utf8DecodeJs;
      var sharedTextDecoder = TEXT_ENCODING_AVAILABLE ? new TextDecoder() : null;
      exports.TEXT_DECODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE ? int_1.UINT32_MAX : typeof process !== "undefined" && ((_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c["TEXT_DECODER"]) !== "force" ? 200 : 0;
      function utf8DecodeTD(bytes, inputOffset, byteLength) {
        const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
        return sharedTextDecoder.decode(stringBytes);
      }
      exports.utf8DecodeTD = utf8DecodeTD;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/ExtData.js
  var require_ExtData = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/ExtData.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ExtData = void 0;
      var ExtData = class {
        constructor(type, data) {
          this.type = type;
          this.data = data;
        }
      };
      exports.ExtData = ExtData;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/DecodeError.js
  var require_DecodeError = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/DecodeError.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DecodeError = void 0;
      var DecodeError = class extends Error {
        constructor(message) {
          super(message);
          const proto = Object.create(DecodeError.prototype);
          Object.setPrototypeOf(this, proto);
          Object.defineProperty(this, "name", {
            configurable: true,
            enumerable: false,
            value: DecodeError.name
          });
        }
      };
      exports.DecodeError = DecodeError;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/timestamp.js
  var require_timestamp = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/timestamp.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.timestampExtension = exports.decodeTimestampExtension = exports.decodeTimestampToTimeSpec = exports.encodeTimestampExtension = exports.encodeDateToTimeSpec = exports.encodeTimeSpecToTimestamp = exports.EXT_TIMESTAMP = void 0;
      var DecodeError_1 = require_DecodeError();
      var int_1 = require_int();
      exports.EXT_TIMESTAMP = -1;
      var TIMESTAMP32_MAX_SEC = 4294967296 - 1;
      var TIMESTAMP64_MAX_SEC = 17179869184 - 1;
      function encodeTimeSpecToTimestamp({ sec, nsec }) {
        if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
          if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
            const rv = new Uint8Array(4);
            const view = new DataView(rv.buffer);
            view.setUint32(0, sec);
            return rv;
          } else {
            const secHigh = sec / 4294967296;
            const secLow = sec & 4294967295;
            const rv = new Uint8Array(8);
            const view = new DataView(rv.buffer);
            view.setUint32(0, nsec << 2 | secHigh & 3);
            view.setUint32(4, secLow);
            return rv;
          }
        } else {
          const rv = new Uint8Array(12);
          const view = new DataView(rv.buffer);
          view.setUint32(0, nsec);
          (0, int_1.setInt64)(view, 4, sec);
          return rv;
        }
      }
      exports.encodeTimeSpecToTimestamp = encodeTimeSpecToTimestamp;
      function encodeDateToTimeSpec(date) {
        const msec = date.getTime();
        const sec = Math.floor(msec / 1e3);
        const nsec = (msec - sec * 1e3) * 1e6;
        const nsecInSec = Math.floor(nsec / 1e9);
        return {
          sec: sec + nsecInSec,
          nsec: nsec - nsecInSec * 1e9
        };
      }
      exports.encodeDateToTimeSpec = encodeDateToTimeSpec;
      function encodeTimestampExtension(object) {
        if (object instanceof Date) {
          const timeSpec = encodeDateToTimeSpec(object);
          return encodeTimeSpecToTimestamp(timeSpec);
        } else {
          return null;
        }
      }
      exports.encodeTimestampExtension = encodeTimestampExtension;
      function decodeTimestampToTimeSpec(data) {
        const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
        switch (data.byteLength) {
          case 4: {
            const sec = view.getUint32(0);
            const nsec = 0;
            return { sec, nsec };
          }
          case 8: {
            const nsec30AndSecHigh2 = view.getUint32(0);
            const secLow32 = view.getUint32(4);
            const sec = (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32;
            const nsec = nsec30AndSecHigh2 >>> 2;
            return { sec, nsec };
          }
          case 12: {
            const sec = (0, int_1.getInt64)(view, 4);
            const nsec = view.getUint32(0);
            return { sec, nsec };
          }
          default:
            throw new DecodeError_1.DecodeError(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${data.length}`);
        }
      }
      exports.decodeTimestampToTimeSpec = decodeTimestampToTimeSpec;
      function decodeTimestampExtension(data) {
        const timeSpec = decodeTimestampToTimeSpec(data);
        return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
      }
      exports.decodeTimestampExtension = decodeTimestampExtension;
      exports.timestampExtension = {
        type: exports.EXT_TIMESTAMP,
        encode: encodeTimestampExtension,
        decode: decodeTimestampExtension
      };
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/ExtensionCodec.js
  var require_ExtensionCodec = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/ExtensionCodec.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ExtensionCodec = void 0;
      var ExtData_1 = require_ExtData();
      var timestamp_1 = require_timestamp();
      var ExtensionCodec = class {
        constructor() {
          this.builtInEncoders = [];
          this.builtInDecoders = [];
          this.encoders = [];
          this.decoders = [];
          this.register(timestamp_1.timestampExtension);
        }
        register({ type, encode, decode }) {
          if (type >= 0) {
            this.encoders[type] = encode;
            this.decoders[type] = decode;
          } else {
            const index = 1 + type;
            this.builtInEncoders[index] = encode;
            this.builtInDecoders[index] = decode;
          }
        }
        tryToEncode(object, context) {
          for (let i = 0; i < this.builtInEncoders.length; i++) {
            const encodeExt = this.builtInEncoders[i];
            if (encodeExt != null) {
              const data = encodeExt(object, context);
              if (data != null) {
                const type = -1 - i;
                return new ExtData_1.ExtData(type, data);
              }
            }
          }
          for (let i = 0; i < this.encoders.length; i++) {
            const encodeExt = this.encoders[i];
            if (encodeExt != null) {
              const data = encodeExt(object, context);
              if (data != null) {
                const type = i;
                return new ExtData_1.ExtData(type, data);
              }
            }
          }
          if (object instanceof ExtData_1.ExtData) {
            return object;
          }
          return null;
        }
        decode(data, type, context) {
          const decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
          if (decodeExt) {
            return decodeExt(data, type, context);
          } else {
            return new ExtData_1.ExtData(type, data);
          }
        }
      };
      exports.ExtensionCodec = ExtensionCodec;
      ExtensionCodec.defaultCodec = new ExtensionCodec();
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/utils/typedArrays.js
  var require_typedArrays = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/utils/typedArrays.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createDataView = exports.ensureUint8Array = void 0;
      function ensureUint8Array(buffer) {
        if (buffer instanceof Uint8Array) {
          return buffer;
        } else if (ArrayBuffer.isView(buffer)) {
          return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        } else if (buffer instanceof ArrayBuffer) {
          return new Uint8Array(buffer);
        } else {
          return Uint8Array.from(buffer);
        }
      }
      exports.ensureUint8Array = ensureUint8Array;
      function createDataView(buffer) {
        if (buffer instanceof ArrayBuffer) {
          return new DataView(buffer);
        }
        const bufferView = ensureUint8Array(buffer);
        return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
      }
      exports.createDataView = createDataView;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/Encoder.js
  var require_Encoder = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/Encoder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Encoder = exports.DEFAULT_INITIAL_BUFFER_SIZE = exports.DEFAULT_MAX_DEPTH = void 0;
      var utf8_1 = require_utf8();
      var ExtensionCodec_1 = require_ExtensionCodec();
      var int_1 = require_int();
      var typedArrays_1 = require_typedArrays();
      exports.DEFAULT_MAX_DEPTH = 100;
      exports.DEFAULT_INITIAL_BUFFER_SIZE = 2048;
      var Encoder = class {
        constructor(extensionCodec = ExtensionCodec_1.ExtensionCodec.defaultCodec, context = void 0, maxDepth = exports.DEFAULT_MAX_DEPTH, initialBufferSize = exports.DEFAULT_INITIAL_BUFFER_SIZE, sortKeys = false, forceFloat32 = false, ignoreUndefined = false, forceIntegerToFloat = false) {
          this.extensionCodec = extensionCodec;
          this.context = context;
          this.maxDepth = maxDepth;
          this.initialBufferSize = initialBufferSize;
          this.sortKeys = sortKeys;
          this.forceFloat32 = forceFloat32;
          this.ignoreUndefined = ignoreUndefined;
          this.forceIntegerToFloat = forceIntegerToFloat;
          this.pos = 0;
          this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
          this.bytes = new Uint8Array(this.view.buffer);
        }
        reinitializeState() {
          this.pos = 0;
        }
        encodeSharedRef(object) {
          this.reinitializeState();
          this.doEncode(object, 1);
          return this.bytes.subarray(0, this.pos);
        }
        encode(object) {
          this.reinitializeState();
          this.doEncode(object, 1);
          return this.bytes.slice(0, this.pos);
        }
        doEncode(object, depth) {
          if (depth > this.maxDepth) {
            throw new Error(`Too deep objects in depth ${depth}`);
          }
          if (object == null) {
            this.encodeNil();
          } else if (typeof object === "boolean") {
            this.encodeBoolean(object);
          } else if (typeof object === "number") {
            this.encodeNumber(object);
          } else if (typeof object === "string") {
            this.encodeString(object);
          } else {
            this.encodeObject(object, depth);
          }
        }
        ensureBufferSizeToWrite(sizeToWrite) {
          const requiredSize = this.pos + sizeToWrite;
          if (this.view.byteLength < requiredSize) {
            this.resizeBuffer(requiredSize * 2);
          }
        }
        resizeBuffer(newSize) {
          const newBuffer = new ArrayBuffer(newSize);
          const newBytes = new Uint8Array(newBuffer);
          const newView = new DataView(newBuffer);
          newBytes.set(this.bytes);
          this.view = newView;
          this.bytes = newBytes;
        }
        encodeNil() {
          this.writeU8(192);
        }
        encodeBoolean(object) {
          if (object === false) {
            this.writeU8(194);
          } else {
            this.writeU8(195);
          }
        }
        encodeNumber(object) {
          if (Number.isSafeInteger(object) && !this.forceIntegerToFloat) {
            if (object >= 0) {
              if (object < 128) {
                this.writeU8(object);
              } else if (object < 256) {
                this.writeU8(204);
                this.writeU8(object);
              } else if (object < 65536) {
                this.writeU8(205);
                this.writeU16(object);
              } else if (object < 4294967296) {
                this.writeU8(206);
                this.writeU32(object);
              } else {
                this.writeU8(207);
                this.writeU64(object);
              }
            } else {
              if (object >= -32) {
                this.writeU8(224 | object + 32);
              } else if (object >= -128) {
                this.writeU8(208);
                this.writeI8(object);
              } else if (object >= -32768) {
                this.writeU8(209);
                this.writeI16(object);
              } else if (object >= -2147483648) {
                this.writeU8(210);
                this.writeI32(object);
              } else {
                this.writeU8(211);
                this.writeI64(object);
              }
            }
          } else {
            if (this.forceFloat32) {
              this.writeU8(202);
              this.writeF32(object);
            } else {
              this.writeU8(203);
              this.writeF64(object);
            }
          }
        }
        writeStringHeader(byteLength) {
          if (byteLength < 32) {
            this.writeU8(160 + byteLength);
          } else if (byteLength < 256) {
            this.writeU8(217);
            this.writeU8(byteLength);
          } else if (byteLength < 65536) {
            this.writeU8(218);
            this.writeU16(byteLength);
          } else if (byteLength < 4294967296) {
            this.writeU8(219);
            this.writeU32(byteLength);
          } else {
            throw new Error(`Too long string: ${byteLength} bytes in UTF-8`);
          }
        }
        encodeString(object) {
          const maxHeaderSize = 1 + 4;
          const strLength = object.length;
          if (strLength > utf8_1.TEXT_ENCODER_THRESHOLD) {
            const byteLength = (0, utf8_1.utf8Count)(object);
            this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
            this.writeStringHeader(byteLength);
            (0, utf8_1.utf8EncodeTE)(object, this.bytes, this.pos);
            this.pos += byteLength;
          } else {
            const byteLength = (0, utf8_1.utf8Count)(object);
            this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
            this.writeStringHeader(byteLength);
            (0, utf8_1.utf8EncodeJs)(object, this.bytes, this.pos);
            this.pos += byteLength;
          }
        }
        encodeObject(object, depth) {
          const ext = this.extensionCodec.tryToEncode(object, this.context);
          if (ext != null) {
            this.encodeExtension(ext);
          } else if (Array.isArray(object)) {
            this.encodeArray(object, depth);
          } else if (ArrayBuffer.isView(object)) {
            this.encodeBinary(object);
          } else if (typeof object === "object") {
            this.encodeMap(object, depth);
          } else {
            throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
          }
        }
        encodeBinary(object) {
          const size = object.byteLength;
          if (size < 256) {
            this.writeU8(196);
            this.writeU8(size);
          } else if (size < 65536) {
            this.writeU8(197);
            this.writeU16(size);
          } else if (size < 4294967296) {
            this.writeU8(198);
            this.writeU32(size);
          } else {
            throw new Error(`Too large binary: ${size}`);
          }
          const bytes = (0, typedArrays_1.ensureUint8Array)(object);
          this.writeU8a(bytes);
        }
        encodeArray(object, depth) {
          const size = object.length;
          if (size < 16) {
            this.writeU8(144 + size);
          } else if (size < 65536) {
            this.writeU8(220);
            this.writeU16(size);
          } else if (size < 4294967296) {
            this.writeU8(221);
            this.writeU32(size);
          } else {
            throw new Error(`Too large array: ${size}`);
          }
          for (const item of object) {
            this.doEncode(item, depth + 1);
          }
        }
        countWithoutUndefined(object, keys) {
          let count = 0;
          for (const key of keys) {
            if (object[key] !== void 0) {
              count++;
            }
          }
          return count;
        }
        encodeMap(object, depth) {
          const keys = Object.keys(object);
          if (this.sortKeys) {
            keys.sort();
          }
          const size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
          if (size < 16) {
            this.writeU8(128 + size);
          } else if (size < 65536) {
            this.writeU8(222);
            this.writeU16(size);
          } else if (size < 4294967296) {
            this.writeU8(223);
            this.writeU32(size);
          } else {
            throw new Error(`Too large map object: ${size}`);
          }
          for (const key of keys) {
            const value = object[key];
            if (!(this.ignoreUndefined && value === void 0)) {
              this.encodeString(key);
              this.doEncode(value, depth + 1);
            }
          }
        }
        encodeExtension(ext) {
          const size = ext.data.length;
          if (size === 1) {
            this.writeU8(212);
          } else if (size === 2) {
            this.writeU8(213);
          } else if (size === 4) {
            this.writeU8(214);
          } else if (size === 8) {
            this.writeU8(215);
          } else if (size === 16) {
            this.writeU8(216);
          } else if (size < 256) {
            this.writeU8(199);
            this.writeU8(size);
          } else if (size < 65536) {
            this.writeU8(200);
            this.writeU16(size);
          } else if (size < 4294967296) {
            this.writeU8(201);
            this.writeU32(size);
          } else {
            throw new Error(`Too large extension object: ${size}`);
          }
          this.writeI8(ext.type);
          this.writeU8a(ext.data);
        }
        writeU8(value) {
          this.ensureBufferSizeToWrite(1);
          this.view.setUint8(this.pos, value);
          this.pos++;
        }
        writeU8a(values) {
          const size = values.length;
          this.ensureBufferSizeToWrite(size);
          this.bytes.set(values, this.pos);
          this.pos += size;
        }
        writeI8(value) {
          this.ensureBufferSizeToWrite(1);
          this.view.setInt8(this.pos, value);
          this.pos++;
        }
        writeU16(value) {
          this.ensureBufferSizeToWrite(2);
          this.view.setUint16(this.pos, value);
          this.pos += 2;
        }
        writeI16(value) {
          this.ensureBufferSizeToWrite(2);
          this.view.setInt16(this.pos, value);
          this.pos += 2;
        }
        writeU32(value) {
          this.ensureBufferSizeToWrite(4);
          this.view.setUint32(this.pos, value);
          this.pos += 4;
        }
        writeI32(value) {
          this.ensureBufferSizeToWrite(4);
          this.view.setInt32(this.pos, value);
          this.pos += 4;
        }
        writeF32(value) {
          this.ensureBufferSizeToWrite(4);
          this.view.setFloat32(this.pos, value);
          this.pos += 4;
        }
        writeF64(value) {
          this.ensureBufferSizeToWrite(8);
          this.view.setFloat64(this.pos, value);
          this.pos += 8;
        }
        writeU64(value) {
          this.ensureBufferSizeToWrite(8);
          (0, int_1.setUint64)(this.view, this.pos, value);
          this.pos += 8;
        }
        writeI64(value) {
          this.ensureBufferSizeToWrite(8);
          (0, int_1.setInt64)(this.view, this.pos, value);
          this.pos += 8;
        }
      };
      exports.Encoder = Encoder;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/encode.js
  var require_encode = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/encode.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.encode = void 0;
      var Encoder_1 = require_Encoder();
      var defaultEncodeOptions = {};
      function encode(value, options = defaultEncodeOptions) {
        const encoder = new Encoder_1.Encoder(options.extensionCodec, options.context, options.maxDepth, options.initialBufferSize, options.sortKeys, options.forceFloat32, options.ignoreUndefined, options.forceIntegerToFloat);
        return encoder.encodeSharedRef(value);
      }
      exports.encode = encode;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/utils/prettyByte.js
  var require_prettyByte = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/utils/prettyByte.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.prettyByte = void 0;
      function prettyByte(byte) {
        return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
      }
      exports.prettyByte = prettyByte;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/CachedKeyDecoder.js
  var require_CachedKeyDecoder = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/CachedKeyDecoder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CachedKeyDecoder = void 0;
      var utf8_1 = require_utf8();
      var DEFAULT_MAX_KEY_LENGTH = 16;
      var DEFAULT_MAX_LENGTH_PER_KEY = 16;
      var CachedKeyDecoder = class {
        constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
          this.maxKeyLength = maxKeyLength;
          this.maxLengthPerKey = maxLengthPerKey;
          this.hit = 0;
          this.miss = 0;
          this.caches = [];
          for (let i = 0; i < this.maxKeyLength; i++) {
            this.caches.push([]);
          }
        }
        canBeCached(byteLength) {
          return byteLength > 0 && byteLength <= this.maxKeyLength;
        }
        find(bytes, inputOffset, byteLength) {
          const records = this.caches[byteLength - 1];
          FIND_CHUNK:
            for (const record of records) {
              const recordBytes = record.bytes;
              for (let j = 0; j < byteLength; j++) {
                if (recordBytes[j] !== bytes[inputOffset + j]) {
                  continue FIND_CHUNK;
                }
              }
              return record.str;
            }
          return null;
        }
        store(bytes, value) {
          const records = this.caches[bytes.length - 1];
          const record = { bytes, str: value };
          if (records.length >= this.maxLengthPerKey) {
            records[Math.random() * records.length | 0] = record;
          } else {
            records.push(record);
          }
        }
        decode(bytes, inputOffset, byteLength) {
          const cachedValue = this.find(bytes, inputOffset, byteLength);
          if (cachedValue != null) {
            this.hit++;
            return cachedValue;
          }
          this.miss++;
          const str = (0, utf8_1.utf8DecodeJs)(bytes, inputOffset, byteLength);
          const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
          this.store(slicedCopyOfBytes, str);
          return str;
        }
      };
      exports.CachedKeyDecoder = CachedKeyDecoder;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/Decoder.js
  var require_Decoder = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/Decoder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Decoder = exports.DataViewIndexOutOfBoundsError = void 0;
      var prettyByte_1 = require_prettyByte();
      var ExtensionCodec_1 = require_ExtensionCodec();
      var int_1 = require_int();
      var utf8_1 = require_utf8();
      var typedArrays_1 = require_typedArrays();
      var CachedKeyDecoder_1 = require_CachedKeyDecoder();
      var DecodeError_1 = require_DecodeError();
      var isValidMapKeyType = (key) => {
        const keyType = typeof key;
        return keyType === "string" || keyType === "number";
      };
      var HEAD_BYTE_REQUIRED = -1;
      var EMPTY_VIEW = new DataView(new ArrayBuffer(0));
      var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
      exports.DataViewIndexOutOfBoundsError = (() => {
        try {
          EMPTY_VIEW.getInt8(0);
        } catch (e) {
          return e.constructor;
        }
        throw new Error("never reached");
      })();
      var MORE_DATA = new exports.DataViewIndexOutOfBoundsError("Insufficient data");
      var sharedCachedKeyDecoder = new CachedKeyDecoder_1.CachedKeyDecoder();
      var Decoder = class {
        constructor(extensionCodec = ExtensionCodec_1.ExtensionCodec.defaultCodec, context = void 0, maxStrLength = int_1.UINT32_MAX, maxBinLength = int_1.UINT32_MAX, maxArrayLength = int_1.UINT32_MAX, maxMapLength = int_1.UINT32_MAX, maxExtLength = int_1.UINT32_MAX, keyDecoder = sharedCachedKeyDecoder) {
          this.extensionCodec = extensionCodec;
          this.context = context;
          this.maxStrLength = maxStrLength;
          this.maxBinLength = maxBinLength;
          this.maxArrayLength = maxArrayLength;
          this.maxMapLength = maxMapLength;
          this.maxExtLength = maxExtLength;
          this.keyDecoder = keyDecoder;
          this.totalPos = 0;
          this.pos = 0;
          this.view = EMPTY_VIEW;
          this.bytes = EMPTY_BYTES;
          this.headByte = HEAD_BYTE_REQUIRED;
          this.stack = [];
        }
        reinitializeState() {
          this.totalPos = 0;
          this.headByte = HEAD_BYTE_REQUIRED;
          this.stack.length = 0;
        }
        setBuffer(buffer) {
          this.bytes = (0, typedArrays_1.ensureUint8Array)(buffer);
          this.view = (0, typedArrays_1.createDataView)(this.bytes);
          this.pos = 0;
        }
        appendBuffer(buffer) {
          if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
            this.setBuffer(buffer);
          } else {
            const remainingData = this.bytes.subarray(this.pos);
            const newData = (0, typedArrays_1.ensureUint8Array)(buffer);
            const newBuffer = new Uint8Array(remainingData.length + newData.length);
            newBuffer.set(remainingData);
            newBuffer.set(newData, remainingData.length);
            this.setBuffer(newBuffer);
          }
        }
        hasRemaining(size) {
          return this.view.byteLength - this.pos >= size;
        }
        createExtraByteError(posToShow) {
          const { view, pos } = this;
          return new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
        }
        decode(buffer) {
          this.reinitializeState();
          this.setBuffer(buffer);
          const object = this.doDecodeSync();
          if (this.hasRemaining(1)) {
            throw this.createExtraByteError(this.pos);
          }
          return object;
        }
        *decodeMulti(buffer) {
          this.reinitializeState();
          this.setBuffer(buffer);
          while (this.hasRemaining(1)) {
            yield this.doDecodeSync();
          }
        }
        async decodeAsync(stream) {
          let decoded = false;
          let object;
          for await (const buffer of stream) {
            if (decoded) {
              throw this.createExtraByteError(this.totalPos);
            }
            this.appendBuffer(buffer);
            try {
              object = this.doDecodeSync();
              decoded = true;
            } catch (e) {
              if (!(e instanceof exports.DataViewIndexOutOfBoundsError)) {
                throw e;
              }
            }
            this.totalPos += this.pos;
          }
          if (decoded) {
            if (this.hasRemaining(1)) {
              throw this.createExtraByteError(this.totalPos);
            }
            return object;
          }
          const { headByte, pos, totalPos } = this;
          throw new RangeError(`Insufficient data in parsing ${(0, prettyByte_1.prettyByte)(headByte)} at ${totalPos} (${pos} in the current buffer)`);
        }
        decodeArrayStream(stream) {
          return this.decodeMultiAsync(stream, true);
        }
        decodeStream(stream) {
          return this.decodeMultiAsync(stream, false);
        }
        async *decodeMultiAsync(stream, isArray) {
          let isArrayHeaderRequired = isArray;
          let arrayItemsLeft = -1;
          for await (const buffer of stream) {
            if (isArray && arrayItemsLeft === 0) {
              throw this.createExtraByteError(this.totalPos);
            }
            this.appendBuffer(buffer);
            if (isArrayHeaderRequired) {
              arrayItemsLeft = this.readArraySize();
              isArrayHeaderRequired = false;
              this.complete();
            }
            try {
              while (true) {
                yield this.doDecodeSync();
                if (--arrayItemsLeft === 0) {
                  break;
                }
              }
            } catch (e) {
              if (!(e instanceof exports.DataViewIndexOutOfBoundsError)) {
                throw e;
              }
            }
            this.totalPos += this.pos;
          }
        }
        doDecodeSync() {
          DECODE:
            while (true) {
              const headByte = this.readHeadByte();
              let object;
              if (headByte >= 224) {
                object = headByte - 256;
              } else if (headByte < 192) {
                if (headByte < 128) {
                  object = headByte;
                } else if (headByte < 144) {
                  const size = headByte - 128;
                  if (size !== 0) {
                    this.pushMapState(size);
                    this.complete();
                    continue DECODE;
                  } else {
                    object = {};
                  }
                } else if (headByte < 160) {
                  const size = headByte - 144;
                  if (size !== 0) {
                    this.pushArrayState(size);
                    this.complete();
                    continue DECODE;
                  } else {
                    object = [];
                  }
                } else {
                  const byteLength = headByte - 160;
                  object = this.decodeUtf8String(byteLength, 0);
                }
              } else if (headByte === 192) {
                object = null;
              } else if (headByte === 194) {
                object = false;
              } else if (headByte === 195) {
                object = true;
              } else if (headByte === 202) {
                object = this.readF32();
              } else if (headByte === 203) {
                object = this.readF64();
              } else if (headByte === 204) {
                object = this.readU8();
              } else if (headByte === 205) {
                object = this.readU16();
              } else if (headByte === 206) {
                object = this.readU32();
              } else if (headByte === 207) {
                object = this.readU64();
              } else if (headByte === 208) {
                object = this.readI8();
              } else if (headByte === 209) {
                object = this.readI16();
              } else if (headByte === 210) {
                object = this.readI32();
              } else if (headByte === 211) {
                object = this.readI64();
              } else if (headByte === 217) {
                const byteLength = this.lookU8();
                object = this.decodeUtf8String(byteLength, 1);
              } else if (headByte === 218) {
                const byteLength = this.lookU16();
                object = this.decodeUtf8String(byteLength, 2);
              } else if (headByte === 219) {
                const byteLength = this.lookU32();
                object = this.decodeUtf8String(byteLength, 4);
              } else if (headByte === 220) {
                const size = this.readU16();
                if (size !== 0) {
                  this.pushArrayState(size);
                  this.complete();
                  continue DECODE;
                } else {
                  object = [];
                }
              } else if (headByte === 221) {
                const size = this.readU32();
                if (size !== 0) {
                  this.pushArrayState(size);
                  this.complete();
                  continue DECODE;
                } else {
                  object = [];
                }
              } else if (headByte === 222) {
                const size = this.readU16();
                if (size !== 0) {
                  this.pushMapState(size);
                  this.complete();
                  continue DECODE;
                } else {
                  object = {};
                }
              } else if (headByte === 223) {
                const size = this.readU32();
                if (size !== 0) {
                  this.pushMapState(size);
                  this.complete();
                  continue DECODE;
                } else {
                  object = {};
                }
              } else if (headByte === 196) {
                const size = this.lookU8();
                object = this.decodeBinary(size, 1);
              } else if (headByte === 197) {
                const size = this.lookU16();
                object = this.decodeBinary(size, 2);
              } else if (headByte === 198) {
                const size = this.lookU32();
                object = this.decodeBinary(size, 4);
              } else if (headByte === 212) {
                object = this.decodeExtension(1, 0);
              } else if (headByte === 213) {
                object = this.decodeExtension(2, 0);
              } else if (headByte === 214) {
                object = this.decodeExtension(4, 0);
              } else if (headByte === 215) {
                object = this.decodeExtension(8, 0);
              } else if (headByte === 216) {
                object = this.decodeExtension(16, 0);
              } else if (headByte === 199) {
                const size = this.lookU8();
                object = this.decodeExtension(size, 1);
              } else if (headByte === 200) {
                const size = this.lookU16();
                object = this.decodeExtension(size, 2);
              } else if (headByte === 201) {
                const size = this.lookU32();
                object = this.decodeExtension(size, 4);
              } else {
                throw new DecodeError_1.DecodeError(`Unrecognized type byte: ${(0, prettyByte_1.prettyByte)(headByte)}`);
              }
              this.complete();
              const stack = this.stack;
              while (stack.length > 0) {
                const state = stack[stack.length - 1];
                if (state.type === 0) {
                  state.array[state.position] = object;
                  state.position++;
                  if (state.position === state.size) {
                    stack.pop();
                    object = state.array;
                  } else {
                    continue DECODE;
                  }
                } else if (state.type === 1) {
                  if (!isValidMapKeyType(object)) {
                    throw new DecodeError_1.DecodeError("The type of key must be string or number but " + typeof object);
                  }
                  if (object === "__proto__") {
                    throw new DecodeError_1.DecodeError("The key __proto__ is not allowed");
                  }
                  state.key = object;
                  state.type = 2;
                  continue DECODE;
                } else {
                  state.map[state.key] = object;
                  state.readCount++;
                  if (state.readCount === state.size) {
                    stack.pop();
                    object = state.map;
                  } else {
                    state.key = null;
                    state.type = 1;
                    continue DECODE;
                  }
                }
              }
              return object;
            }
        }
        readHeadByte() {
          if (this.headByte === HEAD_BYTE_REQUIRED) {
            this.headByte = this.readU8();
          }
          return this.headByte;
        }
        complete() {
          this.headByte = HEAD_BYTE_REQUIRED;
        }
        readArraySize() {
          const headByte = this.readHeadByte();
          switch (headByte) {
            case 220:
              return this.readU16();
            case 221:
              return this.readU32();
            default: {
              if (headByte < 160) {
                return headByte - 144;
              } else {
                throw new DecodeError_1.DecodeError(`Unrecognized array type byte: ${(0, prettyByte_1.prettyByte)(headByte)}`);
              }
            }
          }
        }
        pushMapState(size) {
          if (size > this.maxMapLength) {
            throw new DecodeError_1.DecodeError(`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
          }
          this.stack.push({
            type: 1,
            size,
            key: null,
            readCount: 0,
            map: {}
          });
        }
        pushArrayState(size) {
          if (size > this.maxArrayLength) {
            throw new DecodeError_1.DecodeError(`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
          }
          this.stack.push({
            type: 0,
            size,
            array: new Array(size),
            position: 0
          });
        }
        decodeUtf8String(byteLength, headerOffset) {
          var _a;
          if (byteLength > this.maxStrLength) {
            throw new DecodeError_1.DecodeError(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
          }
          if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
            throw MORE_DATA;
          }
          const offset = this.pos + headerOffset;
          let object;
          if (this.stateIsMapKey() && ((_a = this.keyDecoder) === null || _a === void 0 ? void 0 : _a.canBeCached(byteLength))) {
            object = this.keyDecoder.decode(this.bytes, offset, byteLength);
          } else if (byteLength > utf8_1.TEXT_DECODER_THRESHOLD) {
            object = (0, utf8_1.utf8DecodeTD)(this.bytes, offset, byteLength);
          } else {
            object = (0, utf8_1.utf8DecodeJs)(this.bytes, offset, byteLength);
          }
          this.pos += headerOffset + byteLength;
          return object;
        }
        stateIsMapKey() {
          if (this.stack.length > 0) {
            const state = this.stack[this.stack.length - 1];
            return state.type === 1;
          }
          return false;
        }
        decodeBinary(byteLength, headOffset) {
          if (byteLength > this.maxBinLength) {
            throw new DecodeError_1.DecodeError(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
          }
          if (!this.hasRemaining(byteLength + headOffset)) {
            throw MORE_DATA;
          }
          const offset = this.pos + headOffset;
          const object = this.bytes.subarray(offset, offset + byteLength);
          this.pos += headOffset + byteLength;
          return object;
        }
        decodeExtension(size, headOffset) {
          if (size > this.maxExtLength) {
            throw new DecodeError_1.DecodeError(`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
          }
          const extType = this.view.getInt8(this.pos + headOffset);
          const data = this.decodeBinary(size, headOffset + 1);
          return this.extensionCodec.decode(data, extType, this.context);
        }
        lookU8() {
          return this.view.getUint8(this.pos);
        }
        lookU16() {
          return this.view.getUint16(this.pos);
        }
        lookU32() {
          return this.view.getUint32(this.pos);
        }
        readU8() {
          const value = this.view.getUint8(this.pos);
          this.pos++;
          return value;
        }
        readI8() {
          const value = this.view.getInt8(this.pos);
          this.pos++;
          return value;
        }
        readU16() {
          const value = this.view.getUint16(this.pos);
          this.pos += 2;
          return value;
        }
        readI16() {
          const value = this.view.getInt16(this.pos);
          this.pos += 2;
          return value;
        }
        readU32() {
          const value = this.view.getUint32(this.pos);
          this.pos += 4;
          return value;
        }
        readI32() {
          const value = this.view.getInt32(this.pos);
          this.pos += 4;
          return value;
        }
        readU64() {
          const value = (0, int_1.getUint64)(this.view, this.pos);
          this.pos += 8;
          return value;
        }
        readI64() {
          const value = (0, int_1.getInt64)(this.view, this.pos);
          this.pos += 8;
          return value;
        }
        readF32() {
          const value = this.view.getFloat32(this.pos);
          this.pos += 4;
          return value;
        }
        readF64() {
          const value = this.view.getFloat64(this.pos);
          this.pos += 8;
          return value;
        }
      };
      exports.Decoder = Decoder;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/decode.js
  var require_decode = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/decode.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.decodeMulti = exports.decode = exports.defaultDecodeOptions = void 0;
      var Decoder_1 = require_Decoder();
      exports.defaultDecodeOptions = {};
      function decode(buffer, options = exports.defaultDecodeOptions) {
        const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
        return decoder.decode(buffer);
      }
      exports.decode = decode;
      function decodeMulti(buffer, options = exports.defaultDecodeOptions) {
        const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
        return decoder.decodeMulti(buffer);
      }
      exports.decodeMulti = decodeMulti;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/utils/stream.js
  var require_stream = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/utils/stream.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ensureAsyncIterable = exports.asyncIterableFromStream = exports.isAsyncIterable = void 0;
      function isAsyncIterable(object) {
        return object[Symbol.asyncIterator] != null;
      }
      exports.isAsyncIterable = isAsyncIterable;
      function assertNonNull(value) {
        if (value == null) {
          throw new Error("Assertion Failure: value must not be null nor undefined");
        }
      }
      async function* asyncIterableFromStream(stream) {
        const reader = stream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              return;
            }
            assertNonNull(value);
            yield value;
          }
        } finally {
          reader.releaseLock();
        }
      }
      exports.asyncIterableFromStream = asyncIterableFromStream;
      function ensureAsyncIterable(streamLike) {
        if (isAsyncIterable(streamLike)) {
          return streamLike;
        } else {
          return asyncIterableFromStream(streamLike);
        }
      }
      exports.ensureAsyncIterable = ensureAsyncIterable;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/decodeAsync.js
  var require_decodeAsync = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/decodeAsync.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.decodeStream = exports.decodeMultiStream = exports.decodeArrayStream = exports.decodeAsync = void 0;
      var Decoder_1 = require_Decoder();
      var stream_1 = require_stream();
      var decode_1 = require_decode();
      async function decodeAsync(streamLike, options = decode_1.defaultDecodeOptions) {
        const stream = (0, stream_1.ensureAsyncIterable)(streamLike);
        const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
        return decoder.decodeAsync(stream);
      }
      exports.decodeAsync = decodeAsync;
      function decodeArrayStream(streamLike, options = decode_1.defaultDecodeOptions) {
        const stream = (0, stream_1.ensureAsyncIterable)(streamLike);
        const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
        return decoder.decodeArrayStream(stream);
      }
      exports.decodeArrayStream = decodeArrayStream;
      function decodeMultiStream(streamLike, options = decode_1.defaultDecodeOptions) {
        const stream = (0, stream_1.ensureAsyncIterable)(streamLike);
        const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
        return decoder.decodeStream(stream);
      }
      exports.decodeMultiStream = decodeMultiStream;
      function decodeStream(streamLike, options = decode_1.defaultDecodeOptions) {
        return decodeMultiStream(streamLike, options);
      }
      exports.decodeStream = decodeStream;
    }
  });

  // ../../node_modules/@msgpack/msgpack/dist/index.js
  var require_dist = __commonJS({
    "../../node_modules/@msgpack/msgpack/dist/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.decodeTimestampExtension = exports.encodeTimestampExtension = exports.decodeTimestampToTimeSpec = exports.encodeTimeSpecToTimestamp = exports.encodeDateToTimeSpec = exports.EXT_TIMESTAMP = exports.ExtData = exports.ExtensionCodec = exports.Encoder = exports.DataViewIndexOutOfBoundsError = exports.DecodeError = exports.Decoder = exports.decodeStream = exports.decodeMultiStream = exports.decodeArrayStream = exports.decodeAsync = exports.decodeMulti = exports.decode = exports.encode = void 0;
      var encode_1 = require_encode();
      Object.defineProperty(exports, "encode", { enumerable: true, get: function() {
        return encode_1.encode;
      } });
      var decode_1 = require_decode();
      Object.defineProperty(exports, "decode", { enumerable: true, get: function() {
        return decode_1.decode;
      } });
      Object.defineProperty(exports, "decodeMulti", { enumerable: true, get: function() {
        return decode_1.decodeMulti;
      } });
      var decodeAsync_1 = require_decodeAsync();
      Object.defineProperty(exports, "decodeAsync", { enumerable: true, get: function() {
        return decodeAsync_1.decodeAsync;
      } });
      Object.defineProperty(exports, "decodeArrayStream", { enumerable: true, get: function() {
        return decodeAsync_1.decodeArrayStream;
      } });
      Object.defineProperty(exports, "decodeMultiStream", { enumerable: true, get: function() {
        return decodeAsync_1.decodeMultiStream;
      } });
      Object.defineProperty(exports, "decodeStream", { enumerable: true, get: function() {
        return decodeAsync_1.decodeStream;
      } });
      var Decoder_1 = require_Decoder();
      Object.defineProperty(exports, "Decoder", { enumerable: true, get: function() {
        return Decoder_1.Decoder;
      } });
      Object.defineProperty(exports, "DataViewIndexOutOfBoundsError", { enumerable: true, get: function() {
        return Decoder_1.DataViewIndexOutOfBoundsError;
      } });
      var DecodeError_1 = require_DecodeError();
      Object.defineProperty(exports, "DecodeError", { enumerable: true, get: function() {
        return DecodeError_1.DecodeError;
      } });
      var Encoder_1 = require_Encoder();
      Object.defineProperty(exports, "Encoder", { enumerable: true, get: function() {
        return Encoder_1.Encoder;
      } });
      var ExtensionCodec_1 = require_ExtensionCodec();
      Object.defineProperty(exports, "ExtensionCodec", { enumerable: true, get: function() {
        return ExtensionCodec_1.ExtensionCodec;
      } });
      var ExtData_1 = require_ExtData();
      Object.defineProperty(exports, "ExtData", { enumerable: true, get: function() {
        return ExtData_1.ExtData;
      } });
      var timestamp_1 = require_timestamp();
      Object.defineProperty(exports, "EXT_TIMESTAMP", { enumerable: true, get: function() {
        return timestamp_1.EXT_TIMESTAMP;
      } });
      Object.defineProperty(exports, "encodeDateToTimeSpec", { enumerable: true, get: function() {
        return timestamp_1.encodeDateToTimeSpec;
      } });
      Object.defineProperty(exports, "encodeTimeSpecToTimestamp", { enumerable: true, get: function() {
        return timestamp_1.encodeTimeSpecToTimestamp;
      } });
      Object.defineProperty(exports, "decodeTimestampToTimeSpec", { enumerable: true, get: function() {
        return timestamp_1.decodeTimestampToTimeSpec;
      } });
      Object.defineProperty(exports, "encodeTimestampExtension", { enumerable: true, get: function() {
        return timestamp_1.encodeTimestampExtension;
      } });
      Object.defineProperty(exports, "decodeTimestampExtension", { enumerable: true, get: function() {
        return timestamp_1.decodeTimestampExtension;
      } });
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/types.js
  var require_types = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/types.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.JsHeaders = exports.ReplayPolicy = exports.AckPolicy = exports.DeliverPolicy = exports.StorageType = exports.DiscardPolicy = exports.RetentionPolicy = exports.AdvisoryKind = exports.DEFAULT_MAX_PING_OUT = exports.DEFAULT_PING_INTERVAL = exports.DEFAULT_JITTER_TLS = exports.DEFAULT_JITTER = exports.DEFAULT_MAX_RECONNECT_ATTEMPTS = exports.DEFAULT_RECONNECT_TIME_WAIT = exports.DEFAULT_HOST = exports.DEFAULT_PORT = exports.DebugEvents = exports.Events = exports.Empty = void 0;
      exports.Empty = new Uint8Array(0);
      var Events;
      (function(Events2) {
        Events2["Disconnect"] = "disconnect";
        Events2["Reconnect"] = "reconnect";
        Events2["Update"] = "update";
        Events2["LDM"] = "ldm";
        Events2["Error"] = "error";
      })(Events = exports.Events || (exports.Events = {}));
      var DebugEvents;
      (function(DebugEvents2) {
        DebugEvents2["Reconnecting"] = "reconnecting";
        DebugEvents2["PingTimer"] = "pingTimer";
        DebugEvents2["StaleConnection"] = "staleConnection";
      })(DebugEvents = exports.DebugEvents || (exports.DebugEvents = {}));
      exports.DEFAULT_PORT = 4222;
      exports.DEFAULT_HOST = "127.0.0.1";
      exports.DEFAULT_RECONNECT_TIME_WAIT = 2 * 1e3;
      exports.DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;
      exports.DEFAULT_JITTER = 100;
      exports.DEFAULT_JITTER_TLS = 1e3;
      exports.DEFAULT_PING_INTERVAL = 2 * 60 * 1e3;
      exports.DEFAULT_MAX_PING_OUT = 2;
      var AdvisoryKind;
      (function(AdvisoryKind2) {
        AdvisoryKind2["API"] = "api_audit";
        AdvisoryKind2["StreamAction"] = "stream_action";
        AdvisoryKind2["ConsumerAction"] = "consumer_action";
        AdvisoryKind2["SnapshotCreate"] = "snapshot_create";
        AdvisoryKind2["SnapshotComplete"] = "snapshot_complete";
        AdvisoryKind2["RestoreCreate"] = "restore_create";
        AdvisoryKind2["RestoreComplete"] = "restore_complete";
        AdvisoryKind2["MaxDeliver"] = "max_deliver";
        AdvisoryKind2["Terminated"] = "terminated";
        AdvisoryKind2["Ack"] = "consumer_ack";
        AdvisoryKind2["StreamLeaderElected"] = "stream_leader_elected";
        AdvisoryKind2["StreamQuorumLost"] = "stream_quorum_lost";
        AdvisoryKind2["ConsumerLeaderElected"] = "consumer_leader_elected";
        AdvisoryKind2["ConsumerQuorumLost"] = "consumer_quorum_lost";
      })(AdvisoryKind = exports.AdvisoryKind || (exports.AdvisoryKind = {}));
      var RetentionPolicy;
      (function(RetentionPolicy2) {
        RetentionPolicy2["Limits"] = "limits";
        RetentionPolicy2["Interest"] = "interest";
        RetentionPolicy2["Workqueue"] = "workqueue";
      })(RetentionPolicy = exports.RetentionPolicy || (exports.RetentionPolicy = {}));
      var DiscardPolicy;
      (function(DiscardPolicy2) {
        DiscardPolicy2["Old"] = "old";
        DiscardPolicy2["New"] = "new";
      })(DiscardPolicy = exports.DiscardPolicy || (exports.DiscardPolicy = {}));
      var StorageType;
      (function(StorageType2) {
        StorageType2["File"] = "file";
        StorageType2["Memory"] = "memory";
      })(StorageType = exports.StorageType || (exports.StorageType = {}));
      var DeliverPolicy;
      (function(DeliverPolicy2) {
        DeliverPolicy2["All"] = "all";
        DeliverPolicy2["Last"] = "last";
        DeliverPolicy2["New"] = "new";
        DeliverPolicy2["StartSequence"] = "by_start_sequence";
        DeliverPolicy2["StartTime"] = "by_start_time";
      })(DeliverPolicy = exports.DeliverPolicy || (exports.DeliverPolicy = {}));
      var AckPolicy;
      (function(AckPolicy2) {
        AckPolicy2["None"] = "none";
        AckPolicy2["All"] = "all";
        AckPolicy2["Explicit"] = "explicit";
        AckPolicy2["NotSet"] = "";
      })(AckPolicy = exports.AckPolicy || (exports.AckPolicy = {}));
      var ReplayPolicy;
      (function(ReplayPolicy2) {
        ReplayPolicy2["Instant"] = "instant";
        ReplayPolicy2["Original"] = "original";
      })(ReplayPolicy = exports.ReplayPolicy || (exports.ReplayPolicy = {}));
      var JsHeaders;
      (function(JsHeaders2) {
        JsHeaders2["StreamSourceHdr"] = "Nats-Stream-Source";
        JsHeaders2["LastConsumerSeqHdr"] = "Nats-Last-Consumer";
        JsHeaders2["LastStreamSeqHdr"] = "Nats-Last-Stream";
      })(JsHeaders = exports.JsHeaders || (exports.JsHeaders = {}));
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/encoders.js
  var require_encoders = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/encoders.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fastDecoder = exports.fastEncoder = exports.TD = exports.TE = void 0;
      var types_1 = require_types();
      exports.TE = new TextEncoder();
      exports.TD = new TextDecoder();
      function fastEncoder(...a) {
        let len = 0;
        for (let i = 0; i < a.length; i++) {
          len += a[i] ? a[i].length : 0;
        }
        if (len === 0) {
          return types_1.Empty;
        }
        const buf = new Uint8Array(len);
        let c = 0;
        for (let i = 0; i < a.length; i++) {
          const s = a[i];
          if (s) {
            for (let j = 0; j < s.length; j++) {
              buf[c] = s.charCodeAt(j);
              c++;
            }
          }
        }
        return buf;
      }
      exports.fastEncoder = fastEncoder;
      function fastDecoder(a) {
        if (!a || a.length === 0) {
          return "";
        }
        return String.fromCharCode(...a);
      }
      exports.fastDecoder = fastDecoder;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/databuffer.js
  var require_databuffer = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/databuffer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DataBuffer = void 0;
      var encoders_1 = require_encoders();
      var DataBuffer = class {
        constructor() {
          this.buffers = [];
          this.byteLength = 0;
        }
        static concat(...bufs) {
          let max = 0;
          for (let i = 0; i < bufs.length; i++) {
            max += bufs[i].length;
          }
          const out = new Uint8Array(max);
          let index = 0;
          for (let i = 0; i < bufs.length; i++) {
            out.set(bufs[i], index);
            index += bufs[i].length;
          }
          return out;
        }
        static fromAscii(m) {
          if (!m) {
            m = "";
          }
          return encoders_1.TE.encode(m);
        }
        static toAscii(a) {
          return encoders_1.TD.decode(a);
        }
        reset() {
          this.buffers.length = 0;
          this.byteLength = 0;
        }
        pack() {
          if (this.buffers.length > 1) {
            const v = new Uint8Array(this.byteLength);
            let index = 0;
            for (let i = 0; i < this.buffers.length; i++) {
              v.set(this.buffers[i], index);
              index += this.buffers[i].length;
            }
            this.buffers.length = 0;
            this.buffers.push(v);
          }
        }
        drain(n) {
          if (this.buffers.length) {
            this.pack();
            const v = this.buffers.pop();
            if (v) {
              const max = this.byteLength;
              if (n === void 0 || n > max) {
                n = max;
              }
              const d = v.subarray(0, n);
              if (max > n) {
                this.buffers.push(v.subarray(n));
              }
              this.byteLength = max - n;
              return d;
            }
          }
          return new Uint8Array(0);
        }
        fill(a, ...bufs) {
          if (a) {
            this.buffers.push(a);
            this.byteLength += a.length;
          }
          for (let i = 0; i < bufs.length; i++) {
            if (bufs[i] && bufs[i].length) {
              this.buffers.push(bufs[i]);
              this.byteLength += bufs[i].length;
            }
          }
        }
        peek() {
          if (this.buffers.length) {
            this.pack();
            return this.buffers[0];
          }
          return new Uint8Array(0);
        }
        size() {
          return this.byteLength;
        }
        length() {
          return this.buffers.length;
        }
      };
      exports.DataBuffer = DataBuffer;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/error.js
  var require_error = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/error.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NatsError = exports.isNatsError = exports.Messages = exports.ErrorCode = void 0;
      var ErrorCode;
      (function(ErrorCode2) {
        ErrorCode2["ApiError"] = "BAD API";
        ErrorCode2["BadAuthentication"] = "BAD_AUTHENTICATION";
        ErrorCode2["BadCreds"] = "BAD_CREDS";
        ErrorCode2["BadHeader"] = "BAD_HEADER";
        ErrorCode2["BadJson"] = "BAD_JSON";
        ErrorCode2["BadPayload"] = "BAD_PAYLOAD";
        ErrorCode2["BadSubject"] = "BAD_SUBJECT";
        ErrorCode2["Cancelled"] = "CANCELLED";
        ErrorCode2["ConnectionClosed"] = "CONNECTION_CLOSED";
        ErrorCode2["ConnectionDraining"] = "CONNECTION_DRAINING";
        ErrorCode2["ConnectionRefused"] = "CONNECTION_REFUSED";
        ErrorCode2["ConnectionTimeout"] = "CONNECTION_TIMEOUT";
        ErrorCode2["Disconnect"] = "DISCONNECT";
        ErrorCode2["InvalidOption"] = "INVALID_OPTION";
        ErrorCode2["InvalidPayload"] = "INVALID_PAYLOAD";
        ErrorCode2["MaxPayloadExceeded"] = "MAX_PAYLOAD_EXCEEDED";
        ErrorCode2["NoResponders"] = "503";
        ErrorCode2["NotFunction"] = "NOT_FUNC";
        ErrorCode2["RequestError"] = "REQUEST_ERROR";
        ErrorCode2["ServerOptionNotAvailable"] = "SERVER_OPT_NA";
        ErrorCode2["SubClosed"] = "SUB_CLOSED";
        ErrorCode2["SubDraining"] = "SUB_DRAINING";
        ErrorCode2["Timeout"] = "TIMEOUT";
        ErrorCode2["Tls"] = "TLS";
        ErrorCode2["Unknown"] = "UNKNOWN_ERROR";
        ErrorCode2["WssRequired"] = "WSS_REQUIRED";
        ErrorCode2["JetStreamInvalidAck"] = "JESTREAM_INVALID_ACK";
        ErrorCode2["JetStream404NoMessages"] = "404";
        ErrorCode2["JetStream408RequestTimeout"] = "408";
        ErrorCode2["JetStream409MaxAckPendingExceeded"] = "409";
        ErrorCode2["JetStreamNotEnabled"] = "503";
        ErrorCode2["AuthorizationViolation"] = "AUTHORIZATION_VIOLATION";
        ErrorCode2["AuthenticationExpired"] = "AUTHENTICATION_EXPIRED";
        ErrorCode2["ProtocolError"] = "NATS_PROTOCOL_ERR";
        ErrorCode2["PermissionsViolation"] = "PERMISSIONS_VIOLATION";
      })(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
      var Messages = class {
        constructor() {
          this.messages = /* @__PURE__ */ new Map();
          this.messages.set(ErrorCode.InvalidPayload, "Invalid payload type - payloads can be 'binary', 'string', or 'json'");
          this.messages.set(ErrorCode.BadJson, "Bad JSON");
          this.messages.set(ErrorCode.WssRequired, "TLS is required, therefore a secure websocket connection is also required");
        }
        static getMessage(s) {
          return messages.getMessage(s);
        }
        getMessage(s) {
          return this.messages.get(s) || s;
        }
      };
      exports.Messages = Messages;
      var messages = new Messages();
      function isNatsError(err) {
        return typeof err.code === "string";
      }
      exports.isNatsError = isNatsError;
      var NatsError = class extends Error {
        constructor(message, code, chainedError) {
          super(message);
          this.name = "NatsError";
          this.message = message;
          this.code = code;
          this.chainedError = chainedError;
        }
        static errorForCode(code, chainedError) {
          const m = Messages.getMessage(code);
          return new NatsError(m, code, chainedError);
        }
        isAuthError() {
          return this.code === ErrorCode.AuthenticationExpired || this.code === ErrorCode.AuthorizationViolation;
        }
        isPermissionError() {
          return this.code === ErrorCode.PermissionsViolation;
        }
        isProtocolError() {
          return this.code === ErrorCode.ProtocolError;
        }
      };
      exports.NatsError = NatsError;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/util.js
  var require_util = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/util.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Perf = exports.shuffle = exports.deferred = exports.delay = exports.timeout = exports.render = exports.extend = exports.extractProtocolMessage = exports.protoLen = exports.isUint8Array = exports.LF = exports.CR = exports.CRLF = exports.CR_LF_LEN = exports.CR_LF = void 0;
      var databuffer_1 = require_databuffer();
      var error_1 = require_error();
      var encoders_1 = require_encoders();
      exports.CR_LF = "\r\n";
      exports.CR_LF_LEN = exports.CR_LF.length;
      exports.CRLF = databuffer_1.DataBuffer.fromAscii(exports.CR_LF);
      exports.CR = new Uint8Array(exports.CRLF)[0];
      exports.LF = new Uint8Array(exports.CRLF)[1];
      function isUint8Array(a) {
        return a instanceof Uint8Array;
      }
      exports.isUint8Array = isUint8Array;
      function protoLen(ba) {
        for (let i = 0; i < ba.length; i++) {
          const n = i + 1;
          if (ba.byteLength > n && ba[i] === exports.CR && ba[n] === exports.LF) {
            return n + 1;
          }
        }
        return -1;
      }
      exports.protoLen = protoLen;
      function extractProtocolMessage(a) {
        const len = protoLen(a);
        if (len) {
          const ba = new Uint8Array(a);
          const out = ba.slice(0, len);
          return encoders_1.TD.decode(out);
        }
        return "";
      }
      exports.extractProtocolMessage = extractProtocolMessage;
      function extend(a, ...b) {
        for (let i = 0; i < b.length; i++) {
          const o = b[i];
          Object.keys(o).forEach(function(k) {
            a[k] = o[k];
          });
        }
        return a;
      }
      exports.extend = extend;
      function render(frame) {
        const cr = "\u240D";
        const lf = "\u240A";
        return encoders_1.TD.decode(frame).replace(/\n/g, lf).replace(/\r/g, cr);
      }
      exports.render = render;
      function timeout(ms) {
        let methods;
        let timer;
        const p = new Promise((_resolve, reject) => {
          const cancel = () => {
            if (timer) {
              clearTimeout(timer);
            }
          };
          methods = { cancel };
          timer = setTimeout(() => {
            reject(error_1.NatsError.errorForCode(error_1.ErrorCode.Timeout));
          }, ms);
        });
        return Object.assign(p, methods);
      }
      exports.timeout = timeout;
      function delay(ms = 0) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      exports.delay = delay;
      function deferred() {
        let methods = {};
        const p = new Promise((resolve, reject) => {
          methods = { resolve, reject };
        });
        return Object.assign(p, methods);
      }
      exports.deferred = deferred;
      function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }
      exports.shuffle = shuffle;
      var Perf = class {
        constructor() {
          this.timers = /* @__PURE__ */ new Map();
          this.measures = /* @__PURE__ */ new Map();
        }
        mark(key) {
          this.timers.set(key, Date.now());
        }
        measure(key, startKey, endKey) {
          const s = this.timers.get(startKey);
          if (s === void 0) {
            throw new Error(`${startKey} is not defined`);
          }
          const e = this.timers.get(endKey);
          if (e === void 0) {
            throw new Error(`${endKey} is not defined`);
          }
          this.measures.set(key, e - s);
        }
        getEntries() {
          const values = [];
          this.measures.forEach((v, k) => {
            values.push({ name: k, duration: v });
          });
          return values;
        }
      };
      exports.Perf = Perf;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/transport.js
  var require_transport = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/transport.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.newTransport = exports.getUrlParseFn = exports.defaultPort = exports.setTransportFactory = void 0;
      var types_1 = require_types();
      var transportConfig;
      function setTransportFactory(config) {
        transportConfig = config;
      }
      exports.setTransportFactory = setTransportFactory;
      function defaultPort() {
        return transportConfig !== void 0 && transportConfig.defaultPort !== void 0 ? transportConfig.defaultPort : types_1.DEFAULT_PORT;
      }
      exports.defaultPort = defaultPort;
      function getUrlParseFn() {
        return transportConfig !== void 0 && transportConfig.urlParseFn ? transportConfig.urlParseFn : void 0;
      }
      exports.getUrlParseFn = getUrlParseFn;
      function newTransport() {
        if (!transportConfig || typeof transportConfig.factory !== "function") {
          throw new Error("transport fn is not set");
        }
        return transportConfig.factory();
      }
      exports.newTransport = newTransport;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/nuid.js
  var require_nuid = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/nuid.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.nuid = exports.Nuid = void 0;
      var digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var base = 36;
      var preLen = 12;
      var seqLen = 10;
      var maxSeq = 3656158440062976;
      var minInc = 33;
      var maxInc = 333;
      var totalLen = preLen + seqLen;
      var cryptoObj = initCrypto();
      function initCrypto() {
        let cryptoObj2 = null;
        if (typeof globalThis !== "undefined") {
          if ("crypto" in globalThis && globalThis.crypto.getRandomValues) {
            cryptoObj2 = globalThis.crypto;
          }
        }
        if (!cryptoObj2) {
          cryptoObj2 = {
            getRandomValues: function(array) {
              for (let i = 0; i < array.length; i++) {
                array[i] = Math.floor(Math.random() * 255);
              }
            }
          };
        }
        return cryptoObj2;
      }
      var Nuid = class {
        constructor() {
          this.buf = new Uint8Array(totalLen);
          this.init();
        }
        init() {
          this.setPre();
          this.initSeqAndInc();
          this.fillSeq();
        }
        initSeqAndInc() {
          this.seq = Math.floor(Math.random() * maxSeq);
          this.inc = Math.floor(Math.random() * (maxInc - minInc) + minInc);
        }
        setPre() {
          const cbuf = new Uint8Array(preLen);
          cryptoObj.getRandomValues(cbuf);
          for (let i = 0; i < preLen; i++) {
            const di = cbuf[i] % base;
            this.buf[i] = digits.charCodeAt(di);
          }
        }
        fillSeq() {
          let n = this.seq;
          for (let i = totalLen - 1; i >= preLen; i--) {
            this.buf[i] = digits.charCodeAt(n % base);
            n = Math.floor(n / base);
          }
        }
        next() {
          this.seq += this.inc;
          if (this.seq > maxSeq) {
            this.setPre();
            this.initSeqAndInc();
          }
          this.fillSeq();
          return String.fromCharCode.apply(String, this.buf);
        }
        reset() {
          this.init();
        }
      };
      exports.Nuid = Nuid;
      exports.nuid = new Nuid();
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/ipparser.js
  var require_ipparser = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/ipparser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parseIP = exports.isIP = exports.ipV4 = void 0;
      var IPv4LEN = 4;
      var IPv6LEN = 16;
      var ASCII0 = 48;
      var ASCII9 = 57;
      var ASCIIA = 65;
      var ASCIIF = 70;
      var ASCIIa = 97;
      var ASCIIf = 102;
      var big = 16777215;
      function ipV4(a, b, c, d) {
        const ip = new Uint8Array(IPv6LEN);
        const prefix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255];
        prefix.forEach((v, idx) => {
          ip[idx] = v;
        });
        ip[12] = a;
        ip[13] = b;
        ip[14] = c;
        ip[15] = d;
        return ip;
      }
      exports.ipV4 = ipV4;
      function isIP(h) {
        return parseIP(h) !== void 0;
      }
      exports.isIP = isIP;
      function parseIP(h) {
        for (let i = 0; i < h.length; i++) {
          switch (h[i]) {
            case ".":
              return parseIPv4(h);
            case ":":
              return parseIPv6(h);
          }
        }
        return;
      }
      exports.parseIP = parseIP;
      function parseIPv4(s) {
        const ip = new Uint8Array(IPv4LEN);
        for (let i = 0; i < IPv4LEN; i++) {
          if (s.length === 0) {
            return void 0;
          }
          if (i > 0) {
            if (s[0] !== ".") {
              return void 0;
            }
            s = s.substring(1);
          }
          const { n, c, ok } = dtoi(s);
          if (!ok || n > 255) {
            return void 0;
          }
          s = s.substring(c);
          ip[i] = n;
        }
        return ipV4(ip[0], ip[1], ip[2], ip[3]);
      }
      function parseIPv6(s) {
        const ip = new Uint8Array(IPv6LEN);
        let ellipsis = -1;
        if (s.length >= 2 && s[0] === ":" && s[1] === ":") {
          ellipsis = 0;
          s = s.substring(2);
          if (s.length === 0) {
            return ip;
          }
        }
        let i = 0;
        while (i < IPv6LEN) {
          const { n, c, ok } = xtoi(s);
          if (!ok || n > 65535) {
            return void 0;
          }
          if (c < s.length && s[c] === ".") {
            if (ellipsis < 0 && i != IPv6LEN - IPv4LEN) {
              return void 0;
            }
            if (i + IPv4LEN > IPv6LEN) {
              return void 0;
            }
            const ip4 = parseIPv4(s);
            if (ip4 === void 0) {
              return void 0;
            }
            ip[i] = ip4[12];
            ip[i + 1] = ip4[13];
            ip[i + 2] = ip4[14];
            ip[i + 3] = ip4[15];
            s = "";
            i += IPv4LEN;
            break;
          }
          ip[i] = n >> 8;
          ip[i + 1] = n;
          i += 2;
          s = s.substring(c);
          if (s.length === 0) {
            break;
          }
          if (s[0] !== ":" || s.length == 1) {
            return void 0;
          }
          s = s.substring(1);
          if (s[0] === ":") {
            if (ellipsis >= 0) {
              return void 0;
            }
            ellipsis = i;
            s = s.substring(1);
            if (s.length === 0) {
              break;
            }
          }
        }
        if (s.length !== 0) {
          return void 0;
        }
        if (i < IPv6LEN) {
          if (ellipsis < 0) {
            return void 0;
          }
          const n = IPv6LEN - i;
          for (let j = i - 1; j >= ellipsis; j--) {
            ip[j + n] = ip[j];
          }
          for (let j = ellipsis + n - 1; j >= ellipsis; j--) {
            ip[j] = 0;
          }
        } else if (ellipsis >= 0) {
          return void 0;
        }
        return ip;
      }
      function dtoi(s) {
        let i = 0;
        let n = 0;
        for (i = 0; i < s.length && ASCII0 <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCII9; i++) {
          n = n * 10 + (s.charCodeAt(i) - ASCII0);
          if (n >= big) {
            return { n: big, c: i, ok: false };
          }
        }
        if (i === 0) {
          return { n: 0, c: 0, ok: false };
        }
        return { n, c: i, ok: true };
      }
      function xtoi(s) {
        let n = 0;
        let i = 0;
        for (i = 0; i < s.length; i++) {
          if (ASCII0 <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCII9) {
            n *= 16;
            n += s.charCodeAt(i) - ASCII0;
          } else if (ASCIIa <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCIIf) {
            n *= 16;
            n += s.charCodeAt(i) - ASCIIa + 10;
          } else if (ASCIIA <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCIIF) {
            n *= 16;
            n += s.charCodeAt(i) - ASCIIA + 10;
          } else {
            break;
          }
          if (n >= big) {
            return { n: 0, c: i, ok: false };
          }
        }
        if (i === 0) {
          return { n: 0, c: i, ok: false };
        }
        return { n, c: i, ok: true };
      }
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/servers.js
  var require_servers = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/servers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Servers = exports.ServerImpl = void 0;
      var types_1 = require_types();
      var transport_1 = require_transport();
      var util_1 = require_util();
      var ipparser_1 = require_ipparser();
      var ServerImpl = class {
        constructor(u, gossiped = false) {
          this.src = u;
          this.tlsName = "";
          if (u.match(/^(.*:\/\/)(.*)/m)) {
            u = u.replace(/^(.*:\/\/)(.*)/gm, "$2");
          }
          const url = new URL(`http://${u}`);
          if (!url.port) {
            url.port = `${types_1.DEFAULT_PORT}`;
          }
          this.listen = url.host;
          this.hostname = url.hostname;
          this.port = parseInt(url.port, 10);
          this.didConnect = false;
          this.reconnects = 0;
          this.lastConnect = 0;
          this.gossiped = gossiped;
        }
        toString() {
          return this.listen;
        }
      };
      exports.ServerImpl = ServerImpl;
      var Servers = class {
        constructor(randomize, listens = []) {
          this.firstSelect = true;
          this.servers = [];
          this.tlsName = "";
          const urlParseFn = transport_1.getUrlParseFn();
          if (listens) {
            listens.forEach((hp) => {
              hp = urlParseFn ? urlParseFn(hp) : hp;
              this.servers.push(new ServerImpl(hp));
            });
            if (randomize) {
              this.servers = util_1.shuffle(this.servers);
            }
          }
          if (this.servers.length === 0) {
            this.addServer(`${types_1.DEFAULT_HOST}:${transport_1.defaultPort()}`, false);
          }
          this.currentServer = this.servers[0];
        }
        updateTLSName() {
          const cs = this.getCurrentServer();
          if (!ipparser_1.isIP(cs.hostname)) {
            this.tlsName = cs.hostname;
            this.servers.forEach((s) => {
              if (s.gossiped) {
                s.tlsName = this.tlsName;
              }
            });
          }
        }
        getCurrentServer() {
          return this.currentServer;
        }
        addServer(u, implicit = false) {
          const urlParseFn = transport_1.getUrlParseFn();
          u = urlParseFn ? urlParseFn(u) : u;
          const s = new ServerImpl(u, implicit);
          if (ipparser_1.isIP(s.hostname)) {
            s.tlsName = this.tlsName;
          }
          this.servers.push(s);
        }
        selectServer() {
          if (this.firstSelect) {
            this.firstSelect = false;
            return this.currentServer;
          }
          const t = this.servers.shift();
          if (t) {
            this.servers.push(t);
            this.currentServer = t;
          }
          return t;
        }
        removeCurrentServer() {
          this.removeServer(this.currentServer);
        }
        removeServer(server) {
          if (server) {
            const index = this.servers.indexOf(server);
            this.servers.splice(index, 1);
          }
        }
        length() {
          return this.servers.length;
        }
        next() {
          return this.servers.length ? this.servers[0] : void 0;
        }
        getServers() {
          return this.servers;
        }
        update(info) {
          const added = [];
          let deleted = [];
          const urlParseFn = transport_1.getUrlParseFn();
          const discovered = /* @__PURE__ */ new Map();
          if (info.connect_urls && info.connect_urls.length > 0) {
            info.connect_urls.forEach((hp) => {
              hp = urlParseFn ? urlParseFn(hp) : hp;
              const s = new ServerImpl(hp, true);
              discovered.set(hp, s);
            });
          }
          const toDelete = [];
          this.servers.forEach((s, index) => {
            const u = s.listen;
            if (s.gossiped && this.currentServer.listen !== u && discovered.get(u) === void 0) {
              toDelete.push(index);
            }
            discovered.delete(u);
          });
          toDelete.reverse();
          toDelete.forEach((index) => {
            const removed = this.servers.splice(index, 1);
            deleted = deleted.concat(removed[0].listen);
          });
          discovered.forEach((v, k) => {
            this.servers.push(v);
            added.push(k);
          });
          return { added, deleted };
        }
      };
      exports.Servers = Servers;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/queued_iterator.js
  var require_queued_iterator = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/queued_iterator.js"(exports) {
      "use strict";
      var __await = exports && exports.__await || function(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
      };
      var __asyncGenerator = exports && exports.__asyncGenerator || function(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i;
        function verb(n) {
          if (g[n])
            i[n] = function(v) {
              return new Promise(function(a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
              });
            };
        }
        function resume(n, v) {
          try {
            step(g[n](v));
          } catch (e) {
            settle(q[0][3], e);
          }
        }
        function step(r) {
          r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
        }
        function fulfill(value) {
          resume("next", value);
        }
        function reject(value) {
          resume("throw", value);
        }
        function settle(f, v) {
          if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]);
        }
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.QueuedIteratorImpl = void 0;
      var util_1 = require_util();
      var error_1 = require_error();
      var QueuedIteratorImpl = class {
        constructor() {
          this.inflight = 0;
          this.processed = 0;
          this.received = 0;
          this.noIterator = false;
          this.done = false;
          this.signal = util_1.deferred();
          this.yields = [];
          this.iterClosed = util_1.deferred();
        }
        [Symbol.asyncIterator]() {
          return this.iterate();
        }
        push(v) {
          if (this.done) {
            return;
          }
          this.yields.push(v);
          this.signal.resolve();
        }
        iterate() {
          return __asyncGenerator(this, arguments, function* iterate_1() {
            if (this.noIterator) {
              throw new error_1.NatsError("unsupported iterator", error_1.ErrorCode.ApiError);
            }
            while (true) {
              if (this.yields.length === 0) {
                yield __await(this.signal);
              }
              if (this.err) {
                throw this.err;
              }
              const yields = this.yields;
              this.inflight = yields.length;
              this.yields = [];
              for (let i = 0; i < yields.length; i++) {
                this.processed++;
                yield yield __await(yields[i]);
                if (this.dispatchedFn && yields[i]) {
                  this.dispatchedFn(yields[i]);
                }
                this.inflight--;
              }
              if (this.done) {
                break;
              } else if (this.yields.length === 0) {
                yields.length = 0;
                this.yields = yields;
                this.signal = util_1.deferred();
              }
            }
          });
        }
        stop(err) {
          this.err = err;
          this.done = true;
          this.signal.resolve();
          this.iterClosed.resolve();
        }
        getProcessed() {
          return this.noIterator ? this.received : this.processed;
        }
        getPending() {
          return this.yields.length + this.inflight;
        }
        getReceived() {
          return this.received;
        }
      };
      exports.QueuedIteratorImpl = QueuedIteratorImpl;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/subscription.js
  var require_subscription = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/subscription.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SubscriptionImpl = void 0;
      var queued_iterator_1 = require_queued_iterator();
      var util_1 = require_util();
      var error_1 = require_error();
      var SubscriptionImpl = class extends queued_iterator_1.QueuedIteratorImpl {
        constructor(protocol, subject, opts = {}) {
          super();
          util_1.extend(this, opts);
          this.protocol = protocol;
          this.subject = subject;
          this.draining = false;
          this.noIterator = typeof opts.callback === "function";
          this.closed = util_1.deferred();
          if (opts.timeout) {
            this.timer = util_1.timeout(opts.timeout);
            this.timer.then(() => {
              this.timer = void 0;
            }).catch((err) => {
              this.stop(err);
              if (this.noIterator) {
                this.callback(err, {});
              }
            });
          }
        }
        setDispatchedFn(cb) {
          if (this.noIterator) {
            const uc = this.callback;
            this.callback = (err, msg) => {
              uc(err, msg);
              cb(msg);
            };
          } else {
            this.dispatchedFn = cb;
          }
        }
        callback(err, msg) {
          this.cancelTimeout();
          err ? this.stop(err) : this.push(msg);
        }
        close() {
          if (!this.isClosed()) {
            this.cancelTimeout();
            this.stop();
            if (this.cleanupFn) {
              try {
                this.cleanupFn(this, this.info);
              } catch (_err) {
              }
            }
            this.closed.resolve();
          }
        }
        unsubscribe(max) {
          this.protocol.unsubscribe(this, max);
        }
        cancelTimeout() {
          if (this.timer) {
            this.timer.cancel();
            this.timer = void 0;
          }
        }
        drain() {
          if (this.protocol.isClosed()) {
            throw error_1.NatsError.errorForCode(error_1.ErrorCode.ConnectionClosed);
          }
          if (this.isClosed()) {
            throw error_1.NatsError.errorForCode(error_1.ErrorCode.SubClosed);
          }
          if (!this.drained) {
            this.protocol.unsub(this);
            this.drained = this.protocol.flush(util_1.deferred());
            this.drained.then(() => {
              this.protocol.subscriptions.cancel(this);
            });
          }
          return this.drained;
        }
        isDraining() {
          return this.draining;
        }
        isClosed() {
          return this.done;
        }
        getSubject() {
          return this.subject;
        }
        getMax() {
          return this.max;
        }
        getID() {
          return this.sid;
        }
      };
      exports.SubscriptionImpl = SubscriptionImpl;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/subscriptions.js
  var require_subscriptions = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/subscriptions.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Subscriptions = void 0;
      var Subscriptions = class {
        constructor() {
          this.sidCounter = 0;
          this.subs = /* @__PURE__ */ new Map();
        }
        size() {
          return this.subs.size;
        }
        add(s) {
          this.sidCounter++;
          s.sid = this.sidCounter;
          this.subs.set(s.sid, s);
          return s;
        }
        setMux(s) {
          this.mux = s;
          return s;
        }
        getMux() {
          return this.mux;
        }
        get(sid) {
          return this.subs.get(sid);
        }
        all() {
          const buf = [];
          for (const s of this.subs.values()) {
            buf.push(s);
          }
          return buf;
        }
        cancel(s) {
          if (s) {
            s.close();
            this.subs.delete(s.sid);
          }
        }
        handleError(err) {
          let handled = false;
          if (err) {
            const re = /^'Permissions Violation for Subscription to "(\S+)"'/i;
            const ma = re.exec(err.message);
            if (ma) {
              const subj = ma[1];
              this.subs.forEach((sub) => {
                if (subj == sub.subject) {
                  sub.callback(err, {});
                  sub.close();
                  handled = sub !== this.mux;
                }
              });
            }
          }
          return handled;
        }
        close() {
          this.subs.forEach((sub) => {
            sub.close();
          });
        }
      };
      exports.Subscriptions = Subscriptions;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/headers.js
  var require_headers = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/headers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MsgHdrsImpl = exports.Match = exports.headers = exports.canonicalMIMEHeaderKey = void 0;
      var error_1 = require_error();
      var encoders_1 = require_encoders();
      function canonicalMIMEHeaderKey(k) {
        const a = 97;
        const A = 65;
        const Z = 90;
        const z = 122;
        const dash = 45;
        const colon = 58;
        const start = 33;
        const end = 126;
        const toLower = a - A;
        let upper = true;
        const buf = new Array(k.length);
        for (let i = 0; i < k.length; i++) {
          let c = k.charCodeAt(i);
          if (c === colon || c < start || c > end) {
            throw new error_1.NatsError(`'${k[i]}' is not a valid character for a header key`, error_1.ErrorCode.BadHeader);
          }
          if (upper && a <= c && c <= z) {
            c -= toLower;
          } else if (!upper && A <= c && c <= Z) {
            c += toLower;
          }
          buf[i] = c;
          upper = c == dash;
        }
        return String.fromCharCode(...buf);
      }
      exports.canonicalMIMEHeaderKey = canonicalMIMEHeaderKey;
      function headers() {
        return new MsgHdrsImpl();
      }
      exports.headers = headers;
      var HEADER = "NATS/1.0";
      var Match;
      (function(Match2) {
        Match2[Match2["Exact"] = 0] = "Exact";
        Match2[Match2["CanonicalMIME"] = 1] = "CanonicalMIME";
        Match2[Match2["IgnoreCase"] = 2] = "IgnoreCase";
      })(Match = exports.Match || (exports.Match = {}));
      var MsgHdrsImpl = class {
        constructor() {
          this.code = 0;
          this.headers = /* @__PURE__ */ new Map();
          this.description = "";
        }
        [Symbol.iterator]() {
          return this.headers.entries();
        }
        size() {
          return this.headers.size;
        }
        equals(mh) {
          if (mh && this.headers.size === mh.headers.size && this.code === mh.code) {
            for (const [k, v] of this.headers) {
              const a = mh.values(k);
              if (v.length !== a.length) {
                return false;
              }
              const vv = [...v].sort();
              const aa = [...a].sort();
              for (let i = 0; i < vv.length; i++) {
                if (vv[i] !== aa[i]) {
                  return false;
                }
              }
            }
            return true;
          }
          return false;
        }
        static decode(a) {
          const mh = new MsgHdrsImpl();
          const s = encoders_1.TD.decode(a);
          const lines = s.split("\r\n");
          const h = lines[0];
          if (h !== HEADER) {
            let str = h.replace(HEADER, "");
            mh.code = parseInt(str, 10);
            const scode = mh.code.toString();
            str = str.replace(scode, "");
            mh.description = str.trim();
          }
          if (lines.length >= 1) {
            lines.slice(1).map((s2) => {
              if (s2) {
                const idx = s2.indexOf(":");
                if (idx > -1) {
                  const k = s2.slice(0, idx);
                  const v = s2.slice(idx + 1).trim();
                  mh.append(k, v);
                }
              }
            });
          }
          return mh;
        }
        toString() {
          if (this.headers.size === 0) {
            return "";
          }
          let s = HEADER;
          for (const [k, v] of this.headers) {
            for (let i = 0; i < v.length; i++) {
              s = `${s}\r
${k}: ${v[i]}`;
            }
          }
          return `${s}\r
\r
`;
        }
        encode() {
          return encoders_1.TE.encode(this.toString());
        }
        static validHeaderValue(k) {
          const inv = /[\r\n]/;
          if (inv.test(k)) {
            throw new error_1.NatsError("invalid header value - \\r and \\n are not allowed.", error_1.ErrorCode.BadHeader);
          }
          return k.trim();
        }
        keys() {
          const keys = [];
          for (const sk of this.headers.keys()) {
            keys.push(sk);
          }
          return keys;
        }
        findKeys(k, match = Match.Exact) {
          const keys = this.keys();
          switch (match) {
            case Match.Exact:
              return keys.filter((v) => {
                return v === k;
              });
            case Match.CanonicalMIME:
              k = canonicalMIMEHeaderKey(k);
              return keys.filter((v) => {
                return v === k;
              });
            default: {
              const lci = k.toLowerCase();
              return keys.filter((v) => {
                return lci === v.toLowerCase();
              });
            }
          }
        }
        get(k, match = Match.Exact) {
          const keys = this.findKeys(k, match);
          if (keys.length) {
            const v = this.headers.get(keys[0]);
            if (v) {
              return Array.isArray(v) ? v[0] : v;
            }
          }
          return "";
        }
        has(k, match = Match.Exact) {
          return this.findKeys(k, match).length > 0;
        }
        set(k, v, match = Match.Exact) {
          this.delete(k, match);
          this.append(k, v, match);
        }
        append(k, v, match = Match.Exact) {
          const ck = canonicalMIMEHeaderKey(k);
          if (match === Match.CanonicalMIME) {
            k = ck;
          }
          const keys = this.findKeys(k, match);
          k = keys.length > 0 ? keys[0] : k;
          const value = MsgHdrsImpl.validHeaderValue(v);
          let a = this.headers.get(k);
          if (!a) {
            a = [];
            this.headers.set(k, a);
          }
          a.push(value);
        }
        values(k, match = Match.Exact) {
          const buf = [];
          const keys = this.findKeys(k, match);
          keys.forEach((v) => {
            const values = this.headers.get(v);
            if (values) {
              buf.push(...values);
            }
          });
          return buf;
        }
        delete(k, match = Match.Exact) {
          const keys = this.findKeys(k, match);
          keys.forEach((v) => {
            this.headers.delete(v);
          });
        }
        get hasError() {
          return this.code >= 300;
        }
        get status() {
          return `${this.code} ${this.description}`.trim();
        }
      };
      exports.MsgHdrsImpl = MsgHdrsImpl;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/msg.js
  var require_msg = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/msg.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MsgImpl = exports.isRequestError = void 0;
      var types_1 = require_types();
      var headers_1 = require_headers();
      var encoders_1 = require_encoders();
      var error_1 = require_error();
      function isRequestError(msg) {
        if (msg && msg.headers) {
          const headers = msg.headers;
          if (headers.hasError) {
            if (headers.code === 503) {
              return error_1.NatsError.errorForCode(error_1.ErrorCode.NoResponders);
            } else {
              let desc = headers.description;
              if (desc === "") {
                desc = error_1.ErrorCode.RequestError;
              }
              desc = desc.toLowerCase();
              return new error_1.NatsError(desc, headers.status);
            }
          }
        }
        return null;
      }
      exports.isRequestError = isRequestError;
      var MsgImpl = class {
        constructor(msg, data, publisher) {
          this._msg = msg;
          this._rdata = data;
          this.publisher = publisher;
        }
        get subject() {
          if (this._subject) {
            return this._subject;
          }
          this._subject = encoders_1.TD.decode(this._msg.subject);
          return this._subject;
        }
        get reply() {
          if (this._reply) {
            return this._reply;
          }
          this._reply = encoders_1.TD.decode(this._msg.reply);
          return this._reply;
        }
        get sid() {
          return this._msg.sid;
        }
        get headers() {
          if (this._msg.hdr > -1 && !this._headers) {
            const buf = this._rdata.subarray(0, this._msg.hdr);
            this._headers = headers_1.MsgHdrsImpl.decode(buf);
          }
          return this._headers;
        }
        get data() {
          if (!this._rdata) {
            return new Uint8Array(0);
          }
          return this._msg.hdr > -1 ? this._rdata.subarray(this._msg.hdr) : this._rdata;
        }
        respond(data = types_1.Empty, opts) {
          if (this.reply) {
            this.publisher.publish(this.reply, data, opts);
            return true;
          }
          return false;
        }
      };
      exports.MsgImpl = MsgImpl;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/muxsubscription.js
  var require_muxsubscription = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/muxsubscription.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MuxSubscription = void 0;
      var error_1 = require_error();
      var protocol_1 = require_protocol();
      var msg_1 = require_msg();
      var MuxSubscription = class {
        constructor() {
          this.reqs = /* @__PURE__ */ new Map();
        }
        size() {
          return this.reqs.size;
        }
        init(prefix) {
          this.baseInbox = `${protocol_1.createInbox(prefix)}.`;
          return this.baseInbox;
        }
        add(r) {
          if (!isNaN(r.received)) {
            r.received = 0;
          }
          this.reqs.set(r.token, r);
        }
        get(token) {
          return this.reqs.get(token);
        }
        cancel(r) {
          this.reqs.delete(r.token);
        }
        getToken(m) {
          const s = m.subject || "";
          if (s.indexOf(this.baseInbox) === 0) {
            return s.substring(this.baseInbox.length);
          }
          return null;
        }
        dispatcher() {
          return (err, m) => {
            const token = this.getToken(m);
            if (token) {
              const r = this.get(token);
              if (r) {
                if (err === null && m.headers) {
                  err = msg_1.isRequestError(m);
                }
                r.resolver(err, m);
              }
            }
          };
        }
        close() {
          const err = error_1.NatsError.errorForCode(error_1.ErrorCode.Timeout);
          this.reqs.forEach((req) => {
            req.resolver(err, {});
          });
        }
      };
      exports.MuxSubscription = MuxSubscription;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/heartbeats.js
  var require_heartbeats = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/heartbeats.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Heartbeat = void 0;
      var util_1 = require_util();
      var types_1 = require_types();
      var Heartbeat = class {
        constructor(ph, interval, maxOut) {
          this.ph = ph;
          this.interval = interval;
          this.maxOut = maxOut;
          this.pendings = [];
        }
        start() {
          this.cancel();
          this._schedule();
        }
        cancel(stale) {
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = void 0;
          }
          this._reset();
          if (stale) {
            this.ph.disconnect();
          }
        }
        _schedule() {
          this.timer = setTimeout(() => {
            this.ph.dispatchStatus({ type: types_1.DebugEvents.PingTimer, data: `${this.pendings.length + 1}` });
            if (this.pendings.length === this.maxOut) {
              this.cancel(true);
              return;
            }
            const ping = util_1.deferred();
            this.ph.flush(ping).then(() => {
              this._reset();
            }).catch(() => {
              this.cancel();
            });
            this.pendings.push(ping);
            this._schedule();
          }, this.interval);
        }
        _reset() {
          this.pendings = this.pendings.filter((p) => {
            const d = p;
            d.resolve();
            return false;
          });
        }
      };
      exports.Heartbeat = Heartbeat;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/denobuffer.js
  var require_denobuffer = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/denobuffer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.writeAll = exports.readAll = exports.DenoBuffer = exports.append = exports.concat = exports.MAX_SIZE = exports.assert = exports.AssertionError = void 0;
      var encoders_1 = require_encoders();
      var AssertionError = class extends Error {
        constructor(msg) {
          super(msg);
          this.name = "AssertionError";
        }
      };
      exports.AssertionError = AssertionError;
      function assert(cond, msg = "Assertion failed.") {
        if (!cond) {
          throw new AssertionError(msg);
        }
      }
      exports.assert = assert;
      var MIN_READ = 32 * 1024;
      exports.MAX_SIZE = Math.pow(2, 32) - 2;
      function copy(src, dst, off = 0) {
        const r = dst.byteLength - off;
        if (src.byteLength > r) {
          src = src.subarray(0, r);
        }
        dst.set(src, off);
        return src.byteLength;
      }
      function concat(origin, b) {
        if (origin === void 0 && b === void 0) {
          return new Uint8Array(0);
        }
        if (origin === void 0) {
          return b;
        }
        if (b === void 0) {
          return origin;
        }
        const output = new Uint8Array(origin.length + b.length);
        output.set(origin, 0);
        output.set(b, origin.length);
        return output;
      }
      exports.concat = concat;
      function append(origin, b) {
        return concat(origin, Uint8Array.of(b));
      }
      exports.append = append;
      var DenoBuffer = class {
        constructor(ab) {
          this._off = 0;
          if (ab == null) {
            this._buf = new Uint8Array(0);
            return;
          }
          this._buf = new Uint8Array(ab);
        }
        bytes(options = { copy: true }) {
          if (options.copy === false)
            return this._buf.subarray(this._off);
          return this._buf.slice(this._off);
        }
        empty() {
          return this._buf.byteLength <= this._off;
        }
        get length() {
          return this._buf.byteLength - this._off;
        }
        get capacity() {
          return this._buf.buffer.byteLength;
        }
        truncate(n) {
          if (n === 0) {
            this.reset();
            return;
          }
          if (n < 0 || n > this.length) {
            throw Error("bytes.Buffer: truncation out of range");
          }
          this._reslice(this._off + n);
        }
        reset() {
          this._reslice(0);
          this._off = 0;
        }
        _tryGrowByReslice(n) {
          const l = this._buf.byteLength;
          if (n <= this.capacity - l) {
            this._reslice(l + n);
            return l;
          }
          return -1;
        }
        _reslice(len) {
          assert(len <= this._buf.buffer.byteLength);
          this._buf = new Uint8Array(this._buf.buffer, 0, len);
        }
        readByte() {
          const a = new Uint8Array(1);
          if (this.read(a)) {
            return a[0];
          }
          return null;
        }
        read(p) {
          if (this.empty()) {
            this.reset();
            if (p.byteLength === 0) {
              return 0;
            }
            return null;
          }
          const nread = copy(this._buf.subarray(this._off), p);
          this._off += nread;
          return nread;
        }
        writeByte(n) {
          return this.write(Uint8Array.of(n));
        }
        writeString(s) {
          return this.write(encoders_1.TE.encode(s));
        }
        write(p) {
          const m = this._grow(p.byteLength);
          return copy(p, this._buf, m);
        }
        _grow(n) {
          const m = this.length;
          if (m === 0 && this._off !== 0) {
            this.reset();
          }
          const i = this._tryGrowByReslice(n);
          if (i >= 0) {
            return i;
          }
          const c = this.capacity;
          if (n <= Math.floor(c / 2) - m) {
            copy(this._buf.subarray(this._off), this._buf);
          } else if (c + n > exports.MAX_SIZE) {
            throw new Error("The buffer cannot be grown beyond the maximum size.");
          } else {
            const buf = new Uint8Array(Math.min(2 * c + n, exports.MAX_SIZE));
            copy(this._buf.subarray(this._off), buf);
            this._buf = buf;
          }
          this._off = 0;
          this._reslice(Math.min(m + n, exports.MAX_SIZE));
          return m;
        }
        grow(n) {
          if (n < 0) {
            throw Error("Buffer._grow: negative count");
          }
          const m = this._grow(n);
          this._reslice(m);
        }
        readFrom(r) {
          let n = 0;
          const tmp = new Uint8Array(MIN_READ);
          while (true) {
            const shouldGrow = this.capacity - this.length < MIN_READ;
            const buf = shouldGrow ? tmp : new Uint8Array(this._buf.buffer, this.length);
            const nread = r.read(buf);
            if (nread === null) {
              return n;
            }
            if (shouldGrow)
              this.write(buf.subarray(0, nread));
            else
              this._reslice(this.length + nread);
            n += nread;
          }
        }
      };
      exports.DenoBuffer = DenoBuffer;
      function readAll(r) {
        const buf = new DenoBuffer();
        buf.readFrom(r);
        return buf.bytes();
      }
      exports.readAll = readAll;
      function writeAll(w, arr) {
        let nwritten = 0;
        while (nwritten < arr.length) {
          nwritten += w.write(arr.subarray(nwritten));
        }
      }
      exports.writeAll = writeAll;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/parser.js
  var require_parser = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/parser.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.State = exports.Parser = exports.describe = exports.Kind = void 0;
      var denobuffer_1 = require_denobuffer();
      var encoders_1 = require_encoders();
      var Kind;
      (function(Kind2) {
        Kind2[Kind2["OK"] = 0] = "OK";
        Kind2[Kind2["ERR"] = 1] = "ERR";
        Kind2[Kind2["MSG"] = 2] = "MSG";
        Kind2[Kind2["INFO"] = 3] = "INFO";
        Kind2[Kind2["PING"] = 4] = "PING";
        Kind2[Kind2["PONG"] = 5] = "PONG";
      })(Kind = exports.Kind || (exports.Kind = {}));
      function describe(e) {
        let ks;
        let data = "";
        switch (e.kind) {
          case Kind.MSG:
            ks = "MSG";
            break;
          case Kind.OK:
            ks = "OK";
            break;
          case Kind.ERR:
            ks = "ERR";
            data = encoders_1.TD.decode(e.data);
            break;
          case Kind.PING:
            ks = "PING";
            break;
          case Kind.PONG:
            ks = "PONG";
            break;
          case Kind.INFO:
            ks = "INFO";
            data = encoders_1.TD.decode(e.data);
        }
        return `${ks}: ${data}`;
      }
      exports.describe = describe;
      function newMsgArg() {
        const ma = {};
        ma.sid = -1;
        ma.hdr = -1;
        ma.size = -1;
        return ma;
      }
      var ASCII_0 = 48;
      var ASCII_9 = 57;
      var Parser = class {
        constructor(dispatcher) {
          this.dispatcher = dispatcher;
          this.state = State.OP_START;
          this.as = 0;
          this.drop = 0;
          this.hdr = 0;
        }
        parse(buf) {
          if (typeof module !== "undefined" && module.exports) {
            buf.subarray = buf.slice;
          }
          let i;
          for (i = 0; i < buf.length; i++) {
            const b = buf[i];
            switch (this.state) {
              case State.OP_START:
                switch (b) {
                  case cc.M:
                  case cc.m:
                    this.state = State.OP_M;
                    this.hdr = -1;
                    this.ma = newMsgArg();
                    break;
                  case cc.H:
                  case cc.h:
                    this.state = State.OP_H;
                    this.hdr = 0;
                    this.ma = newMsgArg();
                    break;
                  case cc.P:
                  case cc.p:
                    this.state = State.OP_P;
                    break;
                  case cc.PLUS:
                    this.state = State.OP_PLUS;
                    break;
                  case cc.MINUS:
                    this.state = State.OP_MINUS;
                    break;
                  case cc.I:
                  case cc.i:
                    this.state = State.OP_I;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_H:
                switch (b) {
                  case cc.M:
                  case cc.m:
                    this.state = State.OP_M;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_M:
                switch (b) {
                  case cc.S:
                  case cc.s:
                    this.state = State.OP_MS;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_MS:
                switch (b) {
                  case cc.G:
                  case cc.g:
                    this.state = State.OP_MSG;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_MSG:
                switch (b) {
                  case cc.SPACE:
                  case cc.TAB:
                    this.state = State.OP_MSG_SPC;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_MSG_SPC:
                switch (b) {
                  case cc.SPACE:
                  case cc.TAB:
                    continue;
                  default:
                    this.state = State.MSG_ARG;
                    this.as = i;
                }
                break;
              case State.MSG_ARG:
                switch (b) {
                  case cc.CR:
                    this.drop = 1;
                    break;
                  case cc.NL: {
                    const arg = this.argBuf ? this.argBuf.bytes() : buf.subarray(this.as, i - this.drop);
                    this.processMsgArgs(arg);
                    this.drop = 0;
                    this.as = i + 1;
                    this.state = State.MSG_PAYLOAD;
                    i = this.as + this.ma.size - 1;
                    break;
                  }
                  default:
                    if (this.argBuf) {
                      this.argBuf.writeByte(b);
                    }
                }
                break;
              case State.MSG_PAYLOAD:
                if (this.msgBuf) {
                  if (this.msgBuf.length >= this.ma.size) {
                    const data = this.msgBuf.bytes({ copy: false });
                    this.dispatcher.push({ kind: Kind.MSG, msg: this.ma, data });
                    this.argBuf = void 0;
                    this.msgBuf = void 0;
                    this.state = State.MSG_END;
                  } else {
                    let toCopy = this.ma.size - this.msgBuf.length;
                    const avail = buf.length - i;
                    if (avail < toCopy) {
                      toCopy = avail;
                    }
                    if (toCopy > 0) {
                      this.msgBuf.write(buf.subarray(i, i + toCopy));
                      i = i + toCopy - 1;
                    } else {
                      this.msgBuf.writeByte(b);
                    }
                  }
                } else if (i - this.as >= this.ma.size) {
                  this.dispatcher.push({ kind: Kind.MSG, msg: this.ma, data: buf.subarray(this.as, i) });
                  this.argBuf = void 0;
                  this.msgBuf = void 0;
                  this.state = State.MSG_END;
                }
                break;
              case State.MSG_END:
                switch (b) {
                  case cc.NL:
                    this.drop = 0;
                    this.as = i + 1;
                    this.state = State.OP_START;
                    break;
                  default:
                    continue;
                }
                break;
              case State.OP_PLUS:
                switch (b) {
                  case cc.O:
                  case cc.o:
                    this.state = State.OP_PLUS_O;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_PLUS_O:
                switch (b) {
                  case cc.K:
                  case cc.k:
                    this.state = State.OP_PLUS_OK;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_PLUS_OK:
                switch (b) {
                  case cc.NL:
                    this.dispatcher.push({ kind: Kind.OK });
                    this.drop = 0;
                    this.state = State.OP_START;
                    break;
                }
                break;
              case State.OP_MINUS:
                switch (b) {
                  case cc.E:
                  case cc.e:
                    this.state = State.OP_MINUS_E;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_MINUS_E:
                switch (b) {
                  case cc.R:
                  case cc.r:
                    this.state = State.OP_MINUS_ER;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_MINUS_ER:
                switch (b) {
                  case cc.R:
                  case cc.r:
                    this.state = State.OP_MINUS_ERR;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_MINUS_ERR:
                switch (b) {
                  case cc.SPACE:
                  case cc.TAB:
                    this.state = State.OP_MINUS_ERR_SPC;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_MINUS_ERR_SPC:
                switch (b) {
                  case cc.SPACE:
                  case cc.TAB:
                    continue;
                  default:
                    this.state = State.MINUS_ERR_ARG;
                    this.as = i;
                }
                break;
              case State.MINUS_ERR_ARG:
                switch (b) {
                  case cc.CR:
                    this.drop = 1;
                    break;
                  case cc.NL: {
                    let arg;
                    if (this.argBuf) {
                      arg = this.argBuf.bytes();
                      this.argBuf = void 0;
                    } else {
                      arg = buf.subarray(this.as, i - this.drop);
                    }
                    this.dispatcher.push({ kind: Kind.ERR, data: arg });
                    this.drop = 0;
                    this.as = i + 1;
                    this.state = State.OP_START;
                    break;
                  }
                  default:
                    if (this.argBuf) {
                      this.argBuf.write(Uint8Array.of(b));
                    }
                }
                break;
              case State.OP_P:
                switch (b) {
                  case cc.I:
                  case cc.i:
                    this.state = State.OP_PI;
                    break;
                  case cc.O:
                  case cc.o:
                    this.state = State.OP_PO;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_PO:
                switch (b) {
                  case cc.N:
                  case cc.n:
                    this.state = State.OP_PON;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_PON:
                switch (b) {
                  case cc.G:
                  case cc.g:
                    this.state = State.OP_PONG;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_PONG:
                switch (b) {
                  case cc.NL:
                    this.dispatcher.push({ kind: Kind.PONG });
                    this.drop = 0;
                    this.state = State.OP_START;
                    break;
                }
                break;
              case State.OP_PI:
                switch (b) {
                  case cc.N:
                  case cc.n:
                    this.state = State.OP_PIN;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_PIN:
                switch (b) {
                  case cc.G:
                  case cc.g:
                    this.state = State.OP_PING;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_PING:
                switch (b) {
                  case cc.NL:
                    this.dispatcher.push({ kind: Kind.PING });
                    this.drop = 0;
                    this.state = State.OP_START;
                    break;
                }
                break;
              case State.OP_I:
                switch (b) {
                  case cc.N:
                  case cc.n:
                    this.state = State.OP_IN;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_IN:
                switch (b) {
                  case cc.F:
                  case cc.f:
                    this.state = State.OP_INF;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_INF:
                switch (b) {
                  case cc.O:
                  case cc.o:
                    this.state = State.OP_INFO;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_INFO:
                switch (b) {
                  case cc.SPACE:
                  case cc.TAB:
                    this.state = State.OP_INFO_SPC;
                    break;
                  default:
                    throw this.fail(buf.subarray(i));
                }
                break;
              case State.OP_INFO_SPC:
                switch (b) {
                  case cc.SPACE:
                  case cc.TAB:
                    continue;
                  default:
                    this.state = State.INFO_ARG;
                    this.as = i;
                }
                break;
              case State.INFO_ARG:
                switch (b) {
                  case cc.CR:
                    this.drop = 1;
                    break;
                  case cc.NL: {
                    let arg;
                    if (this.argBuf) {
                      arg = this.argBuf.bytes();
                      this.argBuf = void 0;
                    } else {
                      arg = buf.subarray(this.as, i - this.drop);
                    }
                    this.dispatcher.push({ kind: Kind.INFO, data: arg });
                    this.drop = 0;
                    this.as = i + 1;
                    this.state = State.OP_START;
                    break;
                  }
                  default:
                    if (this.argBuf) {
                      this.argBuf.writeByte(b);
                    }
                }
                break;
              default:
                throw this.fail(buf.subarray(i));
            }
          }
          if ((this.state === State.MSG_ARG || this.state === State.MINUS_ERR_ARG || this.state === State.INFO_ARG) && !this.argBuf) {
            this.argBuf = new denobuffer_1.DenoBuffer(buf.subarray(this.as, i - this.drop));
          }
          if (this.state === State.MSG_PAYLOAD && !this.msgBuf) {
            if (!this.argBuf) {
              this.cloneMsgArg();
            }
            this.msgBuf = new denobuffer_1.DenoBuffer(buf.subarray(this.as));
          }
        }
        cloneMsgArg() {
          const s = this.ma.subject.length;
          const r = this.ma.reply ? this.ma.reply.length : 0;
          const buf = new Uint8Array(s + r);
          buf.set(this.ma.subject);
          if (this.ma.reply) {
            buf.set(this.ma.reply, s);
          }
          this.argBuf = new denobuffer_1.DenoBuffer(buf);
          this.ma.subject = buf.subarray(0, s);
          if (this.ma.reply) {
            this.ma.reply = buf.subarray(s);
          }
        }
        processMsgArgs(arg) {
          if (this.hdr >= 0) {
            return this.processHeaderMsgArgs(arg);
          }
          const args = [];
          let start = -1;
          for (let i = 0; i < arg.length; i++) {
            const b = arg[i];
            switch (b) {
              case cc.SPACE:
              case cc.TAB:
              case cc.CR:
              case cc.NL:
                if (start >= 0) {
                  args.push(arg.subarray(start, i));
                  start = -1;
                }
                break;
              default:
                if (start < 0) {
                  start = i;
                }
            }
          }
          if (start >= 0) {
            args.push(arg.subarray(start));
          }
          switch (args.length) {
            case 3:
              this.ma.subject = args[0];
              this.ma.sid = this.protoParseInt(args[1]);
              this.ma.reply = void 0;
              this.ma.size = this.protoParseInt(args[2]);
              break;
            case 4:
              this.ma.subject = args[0];
              this.ma.sid = this.protoParseInt(args[1]);
              this.ma.reply = args[2];
              this.ma.size = this.protoParseInt(args[3]);
              break;
            default:
              throw this.fail(arg, "processMsgArgs Parse Error");
          }
          if (this.ma.sid < 0) {
            throw this.fail(arg, "processMsgArgs Bad or Missing Sid Error");
          }
          if (this.ma.size < 0) {
            throw this.fail(arg, "processMsgArgs Bad or Missing Size Error");
          }
        }
        fail(data, label = "") {
          if (!label) {
            label = `parse error [${this.state}]`;
          } else {
            label = `${label} [${this.state}]`;
          }
          return new Error(`${label}: ${encoders_1.TD.decode(data)}`);
        }
        processHeaderMsgArgs(arg) {
          const args = [];
          let start = -1;
          for (let i = 0; i < arg.length; i++) {
            const b = arg[i];
            switch (b) {
              case cc.SPACE:
              case cc.TAB:
              case cc.CR:
              case cc.NL:
                if (start >= 0) {
                  args.push(arg.subarray(start, i));
                  start = -1;
                }
                break;
              default:
                if (start < 0) {
                  start = i;
                }
            }
          }
          if (start >= 0) {
            args.push(arg.subarray(start));
          }
          switch (args.length) {
            case 4:
              this.ma.subject = args[0];
              this.ma.sid = this.protoParseInt(args[1]);
              this.ma.reply = void 0;
              this.ma.hdr = this.protoParseInt(args[2]);
              this.ma.size = this.protoParseInt(args[3]);
              break;
            case 5:
              this.ma.subject = args[0];
              this.ma.sid = this.protoParseInt(args[1]);
              this.ma.reply = args[2];
              this.ma.hdr = this.protoParseInt(args[3]);
              this.ma.size = this.protoParseInt(args[4]);
              break;
            default:
              throw this.fail(arg, "processHeaderMsgArgs Parse Error");
          }
          if (this.ma.sid < 0) {
            throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Sid Error");
          }
          if (this.ma.hdr < 0 || this.ma.hdr > this.ma.size) {
            throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Header Size Error");
          }
          if (this.ma.size < 0) {
            throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Size Error");
          }
        }
        protoParseInt(a) {
          if (a.length === 0) {
            return -1;
          }
          let n = 0;
          for (let i = 0; i < a.length; i++) {
            if (a[i] < ASCII_0 || a[i] > ASCII_9) {
              return -1;
            }
            n = n * 10 + (a[i] - ASCII_0);
          }
          return n;
        }
      };
      exports.Parser = Parser;
      var State;
      (function(State2) {
        State2[State2["OP_START"] = 0] = "OP_START";
        State2[State2["OP_PLUS"] = 1] = "OP_PLUS";
        State2[State2["OP_PLUS_O"] = 2] = "OP_PLUS_O";
        State2[State2["OP_PLUS_OK"] = 3] = "OP_PLUS_OK";
        State2[State2["OP_MINUS"] = 4] = "OP_MINUS";
        State2[State2["OP_MINUS_E"] = 5] = "OP_MINUS_E";
        State2[State2["OP_MINUS_ER"] = 6] = "OP_MINUS_ER";
        State2[State2["OP_MINUS_ERR"] = 7] = "OP_MINUS_ERR";
        State2[State2["OP_MINUS_ERR_SPC"] = 8] = "OP_MINUS_ERR_SPC";
        State2[State2["MINUS_ERR_ARG"] = 9] = "MINUS_ERR_ARG";
        State2[State2["OP_M"] = 10] = "OP_M";
        State2[State2["OP_MS"] = 11] = "OP_MS";
        State2[State2["OP_MSG"] = 12] = "OP_MSG";
        State2[State2["OP_MSG_SPC"] = 13] = "OP_MSG_SPC";
        State2[State2["MSG_ARG"] = 14] = "MSG_ARG";
        State2[State2["MSG_PAYLOAD"] = 15] = "MSG_PAYLOAD";
        State2[State2["MSG_END"] = 16] = "MSG_END";
        State2[State2["OP_H"] = 17] = "OP_H";
        State2[State2["OP_P"] = 18] = "OP_P";
        State2[State2["OP_PI"] = 19] = "OP_PI";
        State2[State2["OP_PIN"] = 20] = "OP_PIN";
        State2[State2["OP_PING"] = 21] = "OP_PING";
        State2[State2["OP_PO"] = 22] = "OP_PO";
        State2[State2["OP_PON"] = 23] = "OP_PON";
        State2[State2["OP_PONG"] = 24] = "OP_PONG";
        State2[State2["OP_I"] = 25] = "OP_I";
        State2[State2["OP_IN"] = 26] = "OP_IN";
        State2[State2["OP_INF"] = 27] = "OP_INF";
        State2[State2["OP_INFO"] = 28] = "OP_INFO";
        State2[State2["OP_INFO_SPC"] = 29] = "OP_INFO_SPC";
        State2[State2["INFO_ARG"] = 30] = "INFO_ARG";
      })(State = exports.State || (exports.State = {}));
      var cc;
      (function(cc2) {
        cc2[cc2["CR"] = "\r".charCodeAt(0)] = "CR";
        cc2[cc2["E"] = "E".charCodeAt(0)] = "E";
        cc2[cc2["e"] = "e".charCodeAt(0)] = "e";
        cc2[cc2["F"] = "F".charCodeAt(0)] = "F";
        cc2[cc2["f"] = "f".charCodeAt(0)] = "f";
        cc2[cc2["G"] = "G".charCodeAt(0)] = "G";
        cc2[cc2["g"] = "g".charCodeAt(0)] = "g";
        cc2[cc2["H"] = "H".charCodeAt(0)] = "H";
        cc2[cc2["h"] = "h".charCodeAt(0)] = "h";
        cc2[cc2["I"] = "I".charCodeAt(0)] = "I";
        cc2[cc2["i"] = "i".charCodeAt(0)] = "i";
        cc2[cc2["K"] = "K".charCodeAt(0)] = "K";
        cc2[cc2["k"] = "k".charCodeAt(0)] = "k";
        cc2[cc2["M"] = "M".charCodeAt(0)] = "M";
        cc2[cc2["m"] = "m".charCodeAt(0)] = "m";
        cc2[cc2["MINUS"] = "-".charCodeAt(0)] = "MINUS";
        cc2[cc2["N"] = "N".charCodeAt(0)] = "N";
        cc2[cc2["n"] = "n".charCodeAt(0)] = "n";
        cc2[cc2["NL"] = "\n".charCodeAt(0)] = "NL";
        cc2[cc2["O"] = "O".charCodeAt(0)] = "O";
        cc2[cc2["o"] = "o".charCodeAt(0)] = "o";
        cc2[cc2["P"] = "P".charCodeAt(0)] = "P";
        cc2[cc2["p"] = "p".charCodeAt(0)] = "p";
        cc2[cc2["PLUS"] = "+".charCodeAt(0)] = "PLUS";
        cc2[cc2["R"] = "R".charCodeAt(0)] = "R";
        cc2[cc2["r"] = "r".charCodeAt(0)] = "r";
        cc2[cc2["S"] = "S".charCodeAt(0)] = "S";
        cc2[cc2["s"] = "s".charCodeAt(0)] = "s";
        cc2[cc2["SPACE"] = " ".charCodeAt(0)] = "SPACE";
        cc2[cc2["TAB"] = "	".charCodeAt(0)] = "TAB";
      })(cc || (cc = {}));
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/protocol.js
  var require_protocol = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/protocol.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __asyncValues = exports && exports.__asyncValues || function(o) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i);
        function verb(n) {
          i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
              v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
          };
        }
        function settle(resolve, reject, d, v) {
          Promise.resolve(v).then(function(v2) {
            resolve({ value: v2, done: d });
          }, reject);
        }
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ProtocolHandler = exports.Connect = exports.createInbox = exports.INFO = void 0;
      var types_1 = require_types();
      var transport_1 = require_transport();
      var error_1 = require_error();
      var util_1 = require_util();
      var nuid_1 = require_nuid();
      var databuffer_1 = require_databuffer();
      var servers_1 = require_servers();
      var queued_iterator_1 = require_queued_iterator();
      var subscription_1 = require_subscription();
      var subscriptions_1 = require_subscriptions();
      var muxsubscription_1 = require_muxsubscription();
      var heartbeats_1 = require_heartbeats();
      var parser_1 = require_parser();
      var msg_1 = require_msg();
      var encoders_1 = require_encoders();
      var FLUSH_THRESHOLD = 1024 * 32;
      exports.INFO = /^INFO\s+([^\r\n]+)\r\n/i;
      function createInbox(prefix = "") {
        prefix = prefix || "_INBOX";
        if (typeof prefix !== "string") {
          throw new Error("prefix must be a string");
        }
        return `${prefix}.${nuid_1.nuid.next()}`;
      }
      exports.createInbox = createInbox;
      var PONG_CMD = encoders_1.fastEncoder("PONG\r\n");
      var PING_CMD = encoders_1.fastEncoder("PING\r\n");
      var Connect = class {
        constructor(transport, opts, nonce) {
          this.protocol = 1;
          this.version = transport.version;
          this.lang = transport.lang;
          this.echo = opts.noEcho ? false : void 0;
          this.verbose = opts.verbose;
          this.pedantic = opts.pedantic;
          this.tls_required = opts.tls ? true : void 0;
          this.name = opts.name;
          const creds = (opts && opts.authenticator ? opts.authenticator(nonce) : {}) || {};
          util_1.extend(this, creds);
        }
      };
      exports.Connect = Connect;
      var ProtocolHandler = class {
        constructor(options, publisher) {
          this._closed = false;
          this.connected = false;
          this.connectedOnce = false;
          this.infoReceived = false;
          this.noMorePublishing = false;
          this.abortReconnect = false;
          this.listeners = [];
          this.pendingLimit = FLUSH_THRESHOLD;
          this.outMsgs = 0;
          this.inMsgs = 0;
          this.outBytes = 0;
          this.inBytes = 0;
          this.options = options;
          this.publisher = publisher;
          this.subscriptions = new subscriptions_1.Subscriptions();
          this.muxSubscriptions = new muxsubscription_1.MuxSubscription();
          this.outbound = new databuffer_1.DataBuffer();
          this.pongs = [];
          this.pendingLimit = options.pendingLimit || this.pendingLimit;
          this.servers = new servers_1.Servers(
            !options.noRandomize,
            options.servers
          );
          this.closed = util_1.deferred();
          this.parser = new parser_1.Parser(this);
          this.heartbeats = new heartbeats_1.Heartbeat(this, this.options.pingInterval || types_1.DEFAULT_PING_INTERVAL, this.options.maxPingOut || types_1.DEFAULT_MAX_PING_OUT);
        }
        resetOutbound() {
          this.outbound.reset();
          const pongs = this.pongs;
          this.pongs = [];
          pongs.forEach((p) => {
            p.reject(error_1.NatsError.errorForCode(error_1.ErrorCode.Disconnect));
          });
          this.parser = new parser_1.Parser(this);
          this.infoReceived = false;
        }
        dispatchStatus(status) {
          this.listeners.forEach((q) => {
            q.push(status);
          });
        }
        status() {
          const iter = new queued_iterator_1.QueuedIteratorImpl();
          this.listeners.push(iter);
          return iter;
        }
        prepare() {
          this.info = void 0;
          this.resetOutbound();
          const pong = util_1.deferred();
          this.pongs.unshift(pong);
          this.connectError = (err) => {
            pong.reject(err);
          };
          this.transport = transport_1.newTransport();
          this.transport.closed().then((_err) => __awaiter(this, void 0, void 0, function* () {
            this.connected = false;
            if (!this.isClosed()) {
              yield this.disconnected(this.transport.closeError);
              return;
            }
          }));
          return pong;
        }
        disconnect() {
          this.dispatchStatus({ type: types_1.DebugEvents.StaleConnection, data: "" });
          this.transport.disconnect();
        }
        disconnected(_err) {
          return __awaiter(this, void 0, void 0, function* () {
            this.dispatchStatus({
              type: types_1.Events.Disconnect,
              data: this.servers.getCurrentServer().toString()
            });
            if (this.options.reconnect) {
              yield this.dialLoop().then(() => {
                this.dispatchStatus({
                  type: types_1.Events.Reconnect,
                  data: this.servers.getCurrentServer().toString()
                });
              }).catch((err) => {
                this._close(err);
              });
            } else {
              yield this._close();
            }
          });
        }
        dial(srv) {
          return __awaiter(this, void 0, void 0, function* () {
            const pong = this.prepare();
            let timer;
            try {
              timer = util_1.timeout(this.options.timeout || 2e4);
              const cp = this.transport.connect(srv, this.options);
              yield Promise.race([cp, timer]);
              (() => __awaiter(this, void 0, void 0, function* () {
                var e_1, _a;
                try {
                  try {
                    for (var _b = __asyncValues(this.transport), _c; _c = yield _b.next(), !_c.done; ) {
                      const b = _c.value;
                      this.parser.parse(b);
                    }
                  } catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                  } finally {
                    try {
                      if (_c && !_c.done && (_a = _b.return))
                        yield _a.call(_b);
                    } finally {
                      if (e_1)
                        throw e_1.error;
                    }
                  }
                } catch (err) {
                  console.log("reader closed", err);
                }
              }))().then();
            } catch (err) {
              pong.reject(err);
            }
            try {
              yield Promise.race([timer, pong]);
              if (timer) {
                timer.cancel();
              }
              this.connected = true;
              this.connectError = void 0;
              this.sendSubscriptions();
              this.connectedOnce = true;
              this.server.didConnect = true;
              this.server.reconnects = 0;
              this.flushPending();
              this.heartbeats.start();
            } catch (err) {
              if (timer) {
                timer.cancel();
              }
              yield this.transport.close(err);
              throw err;
            }
          });
        }
        dialLoop() {
          return __awaiter(this, void 0, void 0, function* () {
            let lastError;
            while (true) {
              const wait = this.options.reconnectDelayHandler ? this.options.reconnectDelayHandler() : types_1.DEFAULT_RECONNECT_TIME_WAIT;
              let maxWait = wait;
              const srv = this.selectServer();
              if (!srv || this.abortReconnect) {
                throw lastError || error_1.NatsError.errorForCode(error_1.ErrorCode.ConnectionRefused);
              }
              const now = Date.now();
              if (srv.lastConnect === 0 || srv.lastConnect + wait <= now) {
                srv.lastConnect = Date.now();
                try {
                  this.dispatchStatus({ type: types_1.DebugEvents.Reconnecting, data: srv.toString() });
                  yield this.dial(srv);
                  break;
                } catch (err) {
                  lastError = err;
                  if (!this.connectedOnce) {
                    if (this.options.waitOnFirstConnect) {
                      continue;
                    }
                    this.servers.removeCurrentServer();
                  }
                  srv.reconnects++;
                  const mra = this.options.maxReconnectAttempts || 0;
                  if (mra !== -1 && srv.reconnects >= mra) {
                    this.servers.removeCurrentServer();
                  }
                }
              } else {
                maxWait = Math.min(maxWait, srv.lastConnect + wait - now);
                yield util_1.delay(maxWait);
              }
            }
          });
        }
        static connect(options, publisher) {
          return __awaiter(this, void 0, void 0, function* () {
            const h = new ProtocolHandler(options, publisher);
            yield h.dialLoop();
            return h;
          });
        }
        static toError(s) {
          const t = s ? s.toLowerCase() : "";
          if (t.indexOf("permissions violation") !== -1) {
            return new error_1.NatsError(s, error_1.ErrorCode.PermissionsViolation);
          } else if (t.indexOf("authorization violation") !== -1) {
            return new error_1.NatsError(s, error_1.ErrorCode.AuthorizationViolation);
          } else if (t.indexOf("user authentication expired") !== -1) {
            return new error_1.NatsError(s, error_1.ErrorCode.AuthenticationExpired);
          } else {
            return new error_1.NatsError(s, error_1.ErrorCode.ProtocolError);
          }
        }
        processMsg(msg, data) {
          this.inMsgs++;
          this.inBytes += data.length;
          if (!this.subscriptions.sidCounter) {
            return;
          }
          const sub = this.subscriptions.get(msg.sid);
          if (!sub) {
            return;
          }
          sub.received += 1;
          if (sub.callback) {
            sub.callback(null, new msg_1.MsgImpl(msg, data, this));
          }
          if (sub.max !== void 0 && sub.received >= sub.max) {
            sub.unsubscribe();
          }
        }
        processError(m) {
          return __awaiter(this, void 0, void 0, function* () {
            const s = encoders_1.fastDecoder(m);
            const err = ProtocolHandler.toError(s);
            const handled = this.subscriptions.handleError(err);
            if (!handled) {
              this.dispatchStatus({ type: types_1.Events.Error, data: err.code });
            }
            yield this.handleError(err);
          });
        }
        handleError(err) {
          return __awaiter(this, void 0, void 0, function* () {
            if (err.isAuthError()) {
              this.handleAuthError(err);
            }
            if (err.isPermissionError() || err.isProtocolError()) {
              yield this._close(err);
            }
            this.lastError = err;
          });
        }
        handleAuthError(err) {
          if (this.lastError && err.code === this.lastError.code) {
            this.abortReconnect = true;
          }
          if (this.connectError) {
            this.connectError(err);
          } else {
            this.disconnect();
          }
        }
        processPing() {
          this.transport.send(PONG_CMD);
        }
        processPong() {
          const cb = this.pongs.shift();
          if (cb) {
            cb.resolve();
          }
        }
        processInfo(m) {
          const info = JSON.parse(encoders_1.fastDecoder(m));
          this.info = info;
          const updates = this.options && this.options.ignoreClusterUpdates ? void 0 : this.servers.update(info);
          if (!this.infoReceived) {
            this.infoReceived = true;
            if (this.transport.isEncrypted()) {
              this.servers.updateTLSName();
            }
            const { version, lang } = this.transport;
            try {
              const c = new Connect({ version, lang }, this.options, info.nonce);
              if (info.headers) {
                c.headers = true;
                c.no_responders = true;
              }
              const cs = JSON.stringify(c);
              this.transport.send(encoders_1.fastEncoder(`CONNECT ${cs}${util_1.CR_LF}`));
              this.transport.send(PING_CMD);
            } catch (err) {
              this._close(error_1.NatsError.errorForCode(error_1.ErrorCode.BadAuthentication, err));
            }
          }
          if (updates) {
            this.dispatchStatus({ type: types_1.Events.Update, data: updates });
          }
          const ldm = info.ldm !== void 0 ? info.ldm : false;
          if (ldm) {
            this.dispatchStatus({
              type: types_1.Events.LDM,
              data: this.servers.getCurrentServer().toString()
            });
          }
        }
        push(e) {
          switch (e.kind) {
            case parser_1.Kind.MSG: {
              const { msg, data } = e;
              this.processMsg(msg, data);
              break;
            }
            case parser_1.Kind.OK:
              break;
            case parser_1.Kind.ERR:
              this.processError(e.data);
              break;
            case parser_1.Kind.PING:
              this.processPing();
              break;
            case parser_1.Kind.PONG:
              this.processPong();
              break;
            case parser_1.Kind.INFO:
              this.processInfo(e.data);
              break;
          }
        }
        sendCommand(cmd, ...payloads) {
          const len = this.outbound.length();
          let buf;
          if (typeof cmd === "string") {
            buf = encoders_1.fastEncoder(cmd);
          } else {
            buf = cmd;
          }
          this.outbound.fill(buf, ...payloads);
          if (len === 0) {
            setTimeout(() => {
              this.flushPending();
            });
          } else if (this.outbound.size() >= this.pendingLimit) {
            this.flushPending();
          }
        }
        publish(subject, data, options) {
          if (this.isClosed()) {
            throw error_1.NatsError.errorForCode(error_1.ErrorCode.ConnectionClosed);
          }
          if (this.noMorePublishing) {
            throw error_1.NatsError.errorForCode(error_1.ErrorCode.ConnectionDraining);
          }
          let len = data.length;
          options = options || {};
          options.reply = options.reply || "";
          let headers = types_1.Empty;
          let hlen = 0;
          if (options.headers) {
            if (this.info && !this.info.headers) {
              throw new error_1.NatsError("headers", error_1.ErrorCode.ServerOptionNotAvailable);
            }
            const hdrs = options.headers;
            headers = hdrs.encode();
            hlen = headers.length;
            len = data.length + hlen;
          }
          if (this.info && len > this.info.max_payload) {
            throw error_1.NatsError.errorForCode(error_1.ErrorCode.MaxPayloadExceeded);
          }
          this.outBytes += len;
          this.outMsgs++;
          let proto;
          if (options.headers) {
            if (options.reply) {
              proto = `HPUB ${subject} ${options.reply} ${hlen} ${len}${util_1.CR_LF}`;
            } else {
              proto = `HPUB ${subject} ${hlen} ${len}\r
`;
            }
            this.sendCommand(proto, headers, data, util_1.CRLF);
          } else {
            if (options.reply) {
              proto = `PUB ${subject} ${options.reply} ${len}\r
`;
            } else {
              proto = `PUB ${subject} ${len}\r
`;
            }
            this.sendCommand(proto, data, util_1.CRLF);
          }
        }
        request(r) {
          this.initMux();
          this.muxSubscriptions.add(r);
          return r;
        }
        subscribe(s) {
          this.subscriptions.add(s);
          if (s.queue) {
            this.sendCommand(`SUB ${s.subject} ${s.queue} ${s.sid}\r
`);
          } else {
            this.sendCommand(`SUB ${s.subject} ${s.sid}\r
`);
          }
          if (s.max) {
            this.unsubscribe(s, s.max);
          }
          return s;
        }
        unsubscribe(s, max) {
          this.unsub(s, max);
          if (s.max === void 0 || s.received >= s.max) {
            this.subscriptions.cancel(s);
          }
        }
        unsub(s, max) {
          if (!s || this.isClosed()) {
            return;
          }
          if (max) {
            this.sendCommand(`UNSUB ${s.sid} ${max}${util_1.CR_LF}`);
          } else {
            this.sendCommand(`UNSUB ${s.sid}${util_1.CR_LF}`);
          }
          s.max = max;
        }
        flush(p) {
          if (!p) {
            p = util_1.deferred();
          }
          this.pongs.push(p);
          this.sendCommand(PING_CMD);
          return p;
        }
        sendSubscriptions() {
          const cmds = [];
          this.subscriptions.all().forEach((s) => {
            const sub = s;
            if (sub.queue) {
              cmds.push(`SUB ${sub.subject} ${sub.queue} ${sub.sid}${util_1.CR_LF}`);
            } else {
              cmds.push(`SUB ${sub.subject} ${sub.sid}${util_1.CR_LF}`);
            }
          });
          if (cmds.length) {
            this.transport.send(encoders_1.fastEncoder(cmds.join("")));
          }
        }
        _close(err) {
          return __awaiter(this, void 0, void 0, function* () {
            if (this._closed) {
              return;
            }
            this.heartbeats.cancel();
            if (this.connectError) {
              this.connectError(err);
              this.connectError = void 0;
            }
            this.muxSubscriptions.close();
            this.subscriptions.close();
            this.listeners.forEach((l) => {
              l.stop();
            });
            this._closed = true;
            yield this.transport.close(err);
            yield this.closed.resolve(err);
          });
        }
        close() {
          return this._close();
        }
        isClosed() {
          return this._closed;
        }
        drain() {
          const subs = this.subscriptions.all();
          const promises = [];
          subs.forEach((sub) => {
            promises.push(sub.drain());
          });
          return Promise.all(promises).then(() => __awaiter(this, void 0, void 0, function* () {
            this.noMorePublishing = true;
            yield this.flush();
            return this.close();
          })).catch(() => {
          });
        }
        flushPending() {
          if (!this.infoReceived || !this.connected) {
            return;
          }
          if (this.outbound.size()) {
            const d = this.outbound.drain();
            this.transport.send(d);
          }
        }
        initMux() {
          const mux = this.subscriptions.getMux();
          if (!mux) {
            const inbox = this.muxSubscriptions.init(this.options.inboxPrefix);
            const sub = new subscription_1.SubscriptionImpl(this, `${inbox}*`);
            sub.callback = this.muxSubscriptions.dispatcher();
            this.subscriptions.setMux(sub);
            this.subscribe(sub);
          }
        }
        selectServer() {
          const server = this.servers.selectServer();
          if (server === void 0) {
            return void 0;
          }
          this.server = server;
          return this.server;
        }
        getServer() {
          return this.server;
        }
      };
      exports.ProtocolHandler = ProtocolHandler;
    }
  });

  // (disabled):crypto
  var require_crypto = __commonJS({
    "(disabled):crypto"() {
    }
  });

  // ../../node_modules/tweetnacl/nacl-fast.js
  var require_nacl_fast = __commonJS({
    "../../node_modules/tweetnacl/nacl-fast.js"(exports, module) {
      (function(nacl) {
        "use strict";
        var gf = function(init) {
          var i, r = new Float64Array(16);
          if (init)
            for (i = 0; i < init.length; i++)
              r[i] = init[i];
          return r;
        };
        var randombytes = function() {
          throw new Error("no PRNG");
        };
        var _0 = new Uint8Array(16);
        var _9 = new Uint8Array(32);
        _9[0] = 9;
        var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), D2 = gf([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), X = gf([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), Y = gf([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), I = gf([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
        function ts64(x, i, h, l) {
          x[i] = h >> 24 & 255;
          x[i + 1] = h >> 16 & 255;
          x[i + 2] = h >> 8 & 255;
          x[i + 3] = h & 255;
          x[i + 4] = l >> 24 & 255;
          x[i + 5] = l >> 16 & 255;
          x[i + 6] = l >> 8 & 255;
          x[i + 7] = l & 255;
        }
        function vn(x, xi, y, yi, n) {
          var i, d = 0;
          for (i = 0; i < n; i++)
            d |= x[xi + i] ^ y[yi + i];
          return (1 & d - 1 >>> 8) - 1;
        }
        function crypto_verify_16(x, xi, y, yi) {
          return vn(x, xi, y, yi, 16);
        }
        function crypto_verify_32(x, xi, y, yi) {
          return vn(x, xi, y, yi, 32);
        }
        function core_salsa20(o, p, k, c) {
          var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
          var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
          for (var i = 0; i < 20; i += 2) {
            u = x0 + x12 | 0;
            x4 ^= u << 7 | u >>> 32 - 7;
            u = x4 + x0 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x4 | 0;
            x12 ^= u << 13 | u >>> 32 - 13;
            u = x12 + x8 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x1 | 0;
            x9 ^= u << 7 | u >>> 32 - 7;
            u = x9 + x5 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x9 | 0;
            x1 ^= u << 13 | u >>> 32 - 13;
            u = x1 + x13 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x6 | 0;
            x14 ^= u << 7 | u >>> 32 - 7;
            u = x14 + x10 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x14 | 0;
            x6 ^= u << 13 | u >>> 32 - 13;
            u = x6 + x2 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x11 | 0;
            x3 ^= u << 7 | u >>> 32 - 7;
            u = x3 + x15 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x3 | 0;
            x11 ^= u << 13 | u >>> 32 - 13;
            u = x11 + x7 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
            u = x0 + x3 | 0;
            x1 ^= u << 7 | u >>> 32 - 7;
            u = x1 + x0 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x1 | 0;
            x3 ^= u << 13 | u >>> 32 - 13;
            u = x3 + x2 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x4 | 0;
            x6 ^= u << 7 | u >>> 32 - 7;
            u = x6 + x5 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x6 | 0;
            x4 ^= u << 13 | u >>> 32 - 13;
            u = x4 + x7 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x9 | 0;
            x11 ^= u << 7 | u >>> 32 - 7;
            u = x11 + x10 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x11 | 0;
            x9 ^= u << 13 | u >>> 32 - 13;
            u = x9 + x8 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x14 | 0;
            x12 ^= u << 7 | u >>> 32 - 7;
            u = x12 + x15 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x12 | 0;
            x14 ^= u << 13 | u >>> 32 - 13;
            u = x14 + x13 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
          }
          x0 = x0 + j0 | 0;
          x1 = x1 + j1 | 0;
          x2 = x2 + j2 | 0;
          x3 = x3 + j3 | 0;
          x4 = x4 + j4 | 0;
          x5 = x5 + j5 | 0;
          x6 = x6 + j6 | 0;
          x7 = x7 + j7 | 0;
          x8 = x8 + j8 | 0;
          x9 = x9 + j9 | 0;
          x10 = x10 + j10 | 0;
          x11 = x11 + j11 | 0;
          x12 = x12 + j12 | 0;
          x13 = x13 + j13 | 0;
          x14 = x14 + j14 | 0;
          x15 = x15 + j15 | 0;
          o[0] = x0 >>> 0 & 255;
          o[1] = x0 >>> 8 & 255;
          o[2] = x0 >>> 16 & 255;
          o[3] = x0 >>> 24 & 255;
          o[4] = x1 >>> 0 & 255;
          o[5] = x1 >>> 8 & 255;
          o[6] = x1 >>> 16 & 255;
          o[7] = x1 >>> 24 & 255;
          o[8] = x2 >>> 0 & 255;
          o[9] = x2 >>> 8 & 255;
          o[10] = x2 >>> 16 & 255;
          o[11] = x2 >>> 24 & 255;
          o[12] = x3 >>> 0 & 255;
          o[13] = x3 >>> 8 & 255;
          o[14] = x3 >>> 16 & 255;
          o[15] = x3 >>> 24 & 255;
          o[16] = x4 >>> 0 & 255;
          o[17] = x4 >>> 8 & 255;
          o[18] = x4 >>> 16 & 255;
          o[19] = x4 >>> 24 & 255;
          o[20] = x5 >>> 0 & 255;
          o[21] = x5 >>> 8 & 255;
          o[22] = x5 >>> 16 & 255;
          o[23] = x5 >>> 24 & 255;
          o[24] = x6 >>> 0 & 255;
          o[25] = x6 >>> 8 & 255;
          o[26] = x6 >>> 16 & 255;
          o[27] = x6 >>> 24 & 255;
          o[28] = x7 >>> 0 & 255;
          o[29] = x7 >>> 8 & 255;
          o[30] = x7 >>> 16 & 255;
          o[31] = x7 >>> 24 & 255;
          o[32] = x8 >>> 0 & 255;
          o[33] = x8 >>> 8 & 255;
          o[34] = x8 >>> 16 & 255;
          o[35] = x8 >>> 24 & 255;
          o[36] = x9 >>> 0 & 255;
          o[37] = x9 >>> 8 & 255;
          o[38] = x9 >>> 16 & 255;
          o[39] = x9 >>> 24 & 255;
          o[40] = x10 >>> 0 & 255;
          o[41] = x10 >>> 8 & 255;
          o[42] = x10 >>> 16 & 255;
          o[43] = x10 >>> 24 & 255;
          o[44] = x11 >>> 0 & 255;
          o[45] = x11 >>> 8 & 255;
          o[46] = x11 >>> 16 & 255;
          o[47] = x11 >>> 24 & 255;
          o[48] = x12 >>> 0 & 255;
          o[49] = x12 >>> 8 & 255;
          o[50] = x12 >>> 16 & 255;
          o[51] = x12 >>> 24 & 255;
          o[52] = x13 >>> 0 & 255;
          o[53] = x13 >>> 8 & 255;
          o[54] = x13 >>> 16 & 255;
          o[55] = x13 >>> 24 & 255;
          o[56] = x14 >>> 0 & 255;
          o[57] = x14 >>> 8 & 255;
          o[58] = x14 >>> 16 & 255;
          o[59] = x14 >>> 24 & 255;
          o[60] = x15 >>> 0 & 255;
          o[61] = x15 >>> 8 & 255;
          o[62] = x15 >>> 16 & 255;
          o[63] = x15 >>> 24 & 255;
        }
        function core_hsalsa20(o, p, k, c) {
          var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
          var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
          for (var i = 0; i < 20; i += 2) {
            u = x0 + x12 | 0;
            x4 ^= u << 7 | u >>> 32 - 7;
            u = x4 + x0 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x4 | 0;
            x12 ^= u << 13 | u >>> 32 - 13;
            u = x12 + x8 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x1 | 0;
            x9 ^= u << 7 | u >>> 32 - 7;
            u = x9 + x5 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x9 | 0;
            x1 ^= u << 13 | u >>> 32 - 13;
            u = x1 + x13 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x6 | 0;
            x14 ^= u << 7 | u >>> 32 - 7;
            u = x14 + x10 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x14 | 0;
            x6 ^= u << 13 | u >>> 32 - 13;
            u = x6 + x2 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x11 | 0;
            x3 ^= u << 7 | u >>> 32 - 7;
            u = x3 + x15 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x3 | 0;
            x11 ^= u << 13 | u >>> 32 - 13;
            u = x11 + x7 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
            u = x0 + x3 | 0;
            x1 ^= u << 7 | u >>> 32 - 7;
            u = x1 + x0 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x1 | 0;
            x3 ^= u << 13 | u >>> 32 - 13;
            u = x3 + x2 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x4 | 0;
            x6 ^= u << 7 | u >>> 32 - 7;
            u = x6 + x5 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x6 | 0;
            x4 ^= u << 13 | u >>> 32 - 13;
            u = x4 + x7 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x9 | 0;
            x11 ^= u << 7 | u >>> 32 - 7;
            u = x11 + x10 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x11 | 0;
            x9 ^= u << 13 | u >>> 32 - 13;
            u = x9 + x8 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x14 | 0;
            x12 ^= u << 7 | u >>> 32 - 7;
            u = x12 + x15 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x12 | 0;
            x14 ^= u << 13 | u >>> 32 - 13;
            u = x14 + x13 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
          }
          o[0] = x0 >>> 0 & 255;
          o[1] = x0 >>> 8 & 255;
          o[2] = x0 >>> 16 & 255;
          o[3] = x0 >>> 24 & 255;
          o[4] = x5 >>> 0 & 255;
          o[5] = x5 >>> 8 & 255;
          o[6] = x5 >>> 16 & 255;
          o[7] = x5 >>> 24 & 255;
          o[8] = x10 >>> 0 & 255;
          o[9] = x10 >>> 8 & 255;
          o[10] = x10 >>> 16 & 255;
          o[11] = x10 >>> 24 & 255;
          o[12] = x15 >>> 0 & 255;
          o[13] = x15 >>> 8 & 255;
          o[14] = x15 >>> 16 & 255;
          o[15] = x15 >>> 24 & 255;
          o[16] = x6 >>> 0 & 255;
          o[17] = x6 >>> 8 & 255;
          o[18] = x6 >>> 16 & 255;
          o[19] = x6 >>> 24 & 255;
          o[20] = x7 >>> 0 & 255;
          o[21] = x7 >>> 8 & 255;
          o[22] = x7 >>> 16 & 255;
          o[23] = x7 >>> 24 & 255;
          o[24] = x8 >>> 0 & 255;
          o[25] = x8 >>> 8 & 255;
          o[26] = x8 >>> 16 & 255;
          o[27] = x8 >>> 24 & 255;
          o[28] = x9 >>> 0 & 255;
          o[29] = x9 >>> 8 & 255;
          o[30] = x9 >>> 16 & 255;
          o[31] = x9 >>> 24 & 255;
        }
        function crypto_core_salsa20(out, inp, k, c) {
          core_salsa20(out, inp, k, c);
        }
        function crypto_core_hsalsa20(out, inp, k, c) {
          core_hsalsa20(out, inp, k, c);
        }
        var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
        function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
          var z = new Uint8Array(16), x = new Uint8Array(64);
          var u, i;
          for (i = 0; i < 16; i++)
            z[i] = 0;
          for (i = 0; i < 8; i++)
            z[i] = n[i];
          while (b >= 64) {
            crypto_core_salsa20(x, z, k, sigma);
            for (i = 0; i < 64; i++)
              c[cpos + i] = m[mpos + i] ^ x[i];
            u = 1;
            for (i = 8; i < 16; i++) {
              u = u + (z[i] & 255) | 0;
              z[i] = u & 255;
              u >>>= 8;
            }
            b -= 64;
            cpos += 64;
            mpos += 64;
          }
          if (b > 0) {
            crypto_core_salsa20(x, z, k, sigma);
            for (i = 0; i < b; i++)
              c[cpos + i] = m[mpos + i] ^ x[i];
          }
          return 0;
        }
        function crypto_stream_salsa20(c, cpos, b, n, k) {
          var z = new Uint8Array(16), x = new Uint8Array(64);
          var u, i;
          for (i = 0; i < 16; i++)
            z[i] = 0;
          for (i = 0; i < 8; i++)
            z[i] = n[i];
          while (b >= 64) {
            crypto_core_salsa20(x, z, k, sigma);
            for (i = 0; i < 64; i++)
              c[cpos + i] = x[i];
            u = 1;
            for (i = 8; i < 16; i++) {
              u = u + (z[i] & 255) | 0;
              z[i] = u & 255;
              u >>>= 8;
            }
            b -= 64;
            cpos += 64;
          }
          if (b > 0) {
            crypto_core_salsa20(x, z, k, sigma);
            for (i = 0; i < b; i++)
              c[cpos + i] = x[i];
          }
          return 0;
        }
        function crypto_stream(c, cpos, d, n, k) {
          var s = new Uint8Array(32);
          crypto_core_hsalsa20(s, n, k, sigma);
          var sn = new Uint8Array(8);
          for (var i = 0; i < 8; i++)
            sn[i] = n[i + 16];
          return crypto_stream_salsa20(c, cpos, d, sn, s);
        }
        function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
          var s = new Uint8Array(32);
          crypto_core_hsalsa20(s, n, k, sigma);
          var sn = new Uint8Array(8);
          for (var i = 0; i < 8; i++)
            sn[i] = n[i + 16];
          return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
        }
        var poly1305 = function(key) {
          this.buffer = new Uint8Array(16);
          this.r = new Uint16Array(10);
          this.h = new Uint16Array(10);
          this.pad = new Uint16Array(8);
          this.leftover = 0;
          this.fin = 0;
          var t0, t1, t2, t3, t4, t5, t6, t7;
          t0 = key[0] & 255 | (key[1] & 255) << 8;
          this.r[0] = t0 & 8191;
          t1 = key[2] & 255 | (key[3] & 255) << 8;
          this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
          t2 = key[4] & 255 | (key[5] & 255) << 8;
          this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
          t3 = key[6] & 255 | (key[7] & 255) << 8;
          this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
          t4 = key[8] & 255 | (key[9] & 255) << 8;
          this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
          this.r[5] = t4 >>> 1 & 8190;
          t5 = key[10] & 255 | (key[11] & 255) << 8;
          this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
          t6 = key[12] & 255 | (key[13] & 255) << 8;
          this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
          t7 = key[14] & 255 | (key[15] & 255) << 8;
          this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
          this.r[9] = t7 >>> 5 & 127;
          this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
          this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
          this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
          this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
          this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
          this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
          this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
          this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
        };
        poly1305.prototype.blocks = function(m, mpos, bytes) {
          var hibit = this.fin ? 0 : 1 << 11;
          var t0, t1, t2, t3, t4, t5, t6, t7, c;
          var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
          var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
          var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
          while (bytes >= 16) {
            t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
            h0 += t0 & 8191;
            t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
            h1 += (t0 >>> 13 | t1 << 3) & 8191;
            t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
            h2 += (t1 >>> 10 | t2 << 6) & 8191;
            t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
            h3 += (t2 >>> 7 | t3 << 9) & 8191;
            t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
            h4 += (t3 >>> 4 | t4 << 12) & 8191;
            h5 += t4 >>> 1 & 8191;
            t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
            h6 += (t4 >>> 14 | t5 << 2) & 8191;
            t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
            h7 += (t5 >>> 11 | t6 << 5) & 8191;
            t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
            h8 += (t6 >>> 8 | t7 << 8) & 8191;
            h9 += t7 >>> 5 | hibit;
            c = 0;
            d0 = c;
            d0 += h0 * r0;
            d0 += h1 * (5 * r9);
            d0 += h2 * (5 * r8);
            d0 += h3 * (5 * r7);
            d0 += h4 * (5 * r6);
            c = d0 >>> 13;
            d0 &= 8191;
            d0 += h5 * (5 * r5);
            d0 += h6 * (5 * r4);
            d0 += h7 * (5 * r3);
            d0 += h8 * (5 * r2);
            d0 += h9 * (5 * r1);
            c += d0 >>> 13;
            d0 &= 8191;
            d1 = c;
            d1 += h0 * r1;
            d1 += h1 * r0;
            d1 += h2 * (5 * r9);
            d1 += h3 * (5 * r8);
            d1 += h4 * (5 * r7);
            c = d1 >>> 13;
            d1 &= 8191;
            d1 += h5 * (5 * r6);
            d1 += h6 * (5 * r5);
            d1 += h7 * (5 * r4);
            d1 += h8 * (5 * r3);
            d1 += h9 * (5 * r2);
            c += d1 >>> 13;
            d1 &= 8191;
            d2 = c;
            d2 += h0 * r2;
            d2 += h1 * r1;
            d2 += h2 * r0;
            d2 += h3 * (5 * r9);
            d2 += h4 * (5 * r8);
            c = d2 >>> 13;
            d2 &= 8191;
            d2 += h5 * (5 * r7);
            d2 += h6 * (5 * r6);
            d2 += h7 * (5 * r5);
            d2 += h8 * (5 * r4);
            d2 += h9 * (5 * r3);
            c += d2 >>> 13;
            d2 &= 8191;
            d3 = c;
            d3 += h0 * r3;
            d3 += h1 * r2;
            d3 += h2 * r1;
            d3 += h3 * r0;
            d3 += h4 * (5 * r9);
            c = d3 >>> 13;
            d3 &= 8191;
            d3 += h5 * (5 * r8);
            d3 += h6 * (5 * r7);
            d3 += h7 * (5 * r6);
            d3 += h8 * (5 * r5);
            d3 += h9 * (5 * r4);
            c += d3 >>> 13;
            d3 &= 8191;
            d4 = c;
            d4 += h0 * r4;
            d4 += h1 * r3;
            d4 += h2 * r2;
            d4 += h3 * r1;
            d4 += h4 * r0;
            c = d4 >>> 13;
            d4 &= 8191;
            d4 += h5 * (5 * r9);
            d4 += h6 * (5 * r8);
            d4 += h7 * (5 * r7);
            d4 += h8 * (5 * r6);
            d4 += h9 * (5 * r5);
            c += d4 >>> 13;
            d4 &= 8191;
            d5 = c;
            d5 += h0 * r5;
            d5 += h1 * r4;
            d5 += h2 * r3;
            d5 += h3 * r2;
            d5 += h4 * r1;
            c = d5 >>> 13;
            d5 &= 8191;
            d5 += h5 * r0;
            d5 += h6 * (5 * r9);
            d5 += h7 * (5 * r8);
            d5 += h8 * (5 * r7);
            d5 += h9 * (5 * r6);
            c += d5 >>> 13;
            d5 &= 8191;
            d6 = c;
            d6 += h0 * r6;
            d6 += h1 * r5;
            d6 += h2 * r4;
            d6 += h3 * r3;
            d6 += h4 * r2;
            c = d6 >>> 13;
            d6 &= 8191;
            d6 += h5 * r1;
            d6 += h6 * r0;
            d6 += h7 * (5 * r9);
            d6 += h8 * (5 * r8);
            d6 += h9 * (5 * r7);
            c += d6 >>> 13;
            d6 &= 8191;
            d7 = c;
            d7 += h0 * r7;
            d7 += h1 * r6;
            d7 += h2 * r5;
            d7 += h3 * r4;
            d7 += h4 * r3;
            c = d7 >>> 13;
            d7 &= 8191;
            d7 += h5 * r2;
            d7 += h6 * r1;
            d7 += h7 * r0;
            d7 += h8 * (5 * r9);
            d7 += h9 * (5 * r8);
            c += d7 >>> 13;
            d7 &= 8191;
            d8 = c;
            d8 += h0 * r8;
            d8 += h1 * r7;
            d8 += h2 * r6;
            d8 += h3 * r5;
            d8 += h4 * r4;
            c = d8 >>> 13;
            d8 &= 8191;
            d8 += h5 * r3;
            d8 += h6 * r2;
            d8 += h7 * r1;
            d8 += h8 * r0;
            d8 += h9 * (5 * r9);
            c += d8 >>> 13;
            d8 &= 8191;
            d9 = c;
            d9 += h0 * r9;
            d9 += h1 * r8;
            d9 += h2 * r7;
            d9 += h3 * r6;
            d9 += h4 * r5;
            c = d9 >>> 13;
            d9 &= 8191;
            d9 += h5 * r4;
            d9 += h6 * r3;
            d9 += h7 * r2;
            d9 += h8 * r1;
            d9 += h9 * r0;
            c += d9 >>> 13;
            d9 &= 8191;
            c = (c << 2) + c | 0;
            c = c + d0 | 0;
            d0 = c & 8191;
            c = c >>> 13;
            d1 += c;
            h0 = d0;
            h1 = d1;
            h2 = d2;
            h3 = d3;
            h4 = d4;
            h5 = d5;
            h6 = d6;
            h7 = d7;
            h8 = d8;
            h9 = d9;
            mpos += 16;
            bytes -= 16;
          }
          this.h[0] = h0;
          this.h[1] = h1;
          this.h[2] = h2;
          this.h[3] = h3;
          this.h[4] = h4;
          this.h[5] = h5;
          this.h[6] = h6;
          this.h[7] = h7;
          this.h[8] = h8;
          this.h[9] = h9;
        };
        poly1305.prototype.finish = function(mac, macpos) {
          var g = new Uint16Array(10);
          var c, mask, f, i;
          if (this.leftover) {
            i = this.leftover;
            this.buffer[i++] = 1;
            for (; i < 16; i++)
              this.buffer[i] = 0;
            this.fin = 1;
            this.blocks(this.buffer, 0, 16);
          }
          c = this.h[1] >>> 13;
          this.h[1] &= 8191;
          for (i = 2; i < 10; i++) {
            this.h[i] += c;
            c = this.h[i] >>> 13;
            this.h[i] &= 8191;
          }
          this.h[0] += c * 5;
          c = this.h[0] >>> 13;
          this.h[0] &= 8191;
          this.h[1] += c;
          c = this.h[1] >>> 13;
          this.h[1] &= 8191;
          this.h[2] += c;
          g[0] = this.h[0] + 5;
          c = g[0] >>> 13;
          g[0] &= 8191;
          for (i = 1; i < 10; i++) {
            g[i] = this.h[i] + c;
            c = g[i] >>> 13;
            g[i] &= 8191;
          }
          g[9] -= 1 << 13;
          mask = (c ^ 1) - 1;
          for (i = 0; i < 10; i++)
            g[i] &= mask;
          mask = ~mask;
          for (i = 0; i < 10; i++)
            this.h[i] = this.h[i] & mask | g[i];
          this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
          this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
          this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
          this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
          this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
          this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
          this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
          this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
          f = this.h[0] + this.pad[0];
          this.h[0] = f & 65535;
          for (i = 1; i < 8; i++) {
            f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
            this.h[i] = f & 65535;
          }
          mac[macpos + 0] = this.h[0] >>> 0 & 255;
          mac[macpos + 1] = this.h[0] >>> 8 & 255;
          mac[macpos + 2] = this.h[1] >>> 0 & 255;
          mac[macpos + 3] = this.h[1] >>> 8 & 255;
          mac[macpos + 4] = this.h[2] >>> 0 & 255;
          mac[macpos + 5] = this.h[2] >>> 8 & 255;
          mac[macpos + 6] = this.h[3] >>> 0 & 255;
          mac[macpos + 7] = this.h[3] >>> 8 & 255;
          mac[macpos + 8] = this.h[4] >>> 0 & 255;
          mac[macpos + 9] = this.h[4] >>> 8 & 255;
          mac[macpos + 10] = this.h[5] >>> 0 & 255;
          mac[macpos + 11] = this.h[5] >>> 8 & 255;
          mac[macpos + 12] = this.h[6] >>> 0 & 255;
          mac[macpos + 13] = this.h[6] >>> 8 & 255;
          mac[macpos + 14] = this.h[7] >>> 0 & 255;
          mac[macpos + 15] = this.h[7] >>> 8 & 255;
        };
        poly1305.prototype.update = function(m, mpos, bytes) {
          var i, want;
          if (this.leftover) {
            want = 16 - this.leftover;
            if (want > bytes)
              want = bytes;
            for (i = 0; i < want; i++)
              this.buffer[this.leftover + i] = m[mpos + i];
            bytes -= want;
            mpos += want;
            this.leftover += want;
            if (this.leftover < 16)
              return;
            this.blocks(this.buffer, 0, 16);
            this.leftover = 0;
          }
          if (bytes >= 16) {
            want = bytes - bytes % 16;
            this.blocks(m, mpos, want);
            mpos += want;
            bytes -= want;
          }
          if (bytes) {
            for (i = 0; i < bytes; i++)
              this.buffer[this.leftover + i] = m[mpos + i];
            this.leftover += bytes;
          }
        };
        function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
          var s = new poly1305(k);
          s.update(m, mpos, n);
          s.finish(out, outpos);
          return 0;
        }
        function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
          var x = new Uint8Array(16);
          crypto_onetimeauth(x, 0, m, mpos, n, k);
          return crypto_verify_16(h, hpos, x, 0);
        }
        function crypto_secretbox(c, m, d, n, k) {
          var i;
          if (d < 32)
            return -1;
          crypto_stream_xor(c, 0, m, 0, d, n, k);
          crypto_onetimeauth(c, 16, c, 32, d - 32, c);
          for (i = 0; i < 16; i++)
            c[i] = 0;
          return 0;
        }
        function crypto_secretbox_open(m, c, d, n, k) {
          var i;
          var x = new Uint8Array(32);
          if (d < 32)
            return -1;
          crypto_stream(x, 0, 32, n, k);
          if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0)
            return -1;
          crypto_stream_xor(m, 0, c, 0, d, n, k);
          for (i = 0; i < 32; i++)
            m[i] = 0;
          return 0;
        }
        function set25519(r, a) {
          var i;
          for (i = 0; i < 16; i++)
            r[i] = a[i] | 0;
        }
        function car25519(o) {
          var i, v, c = 1;
          for (i = 0; i < 16; i++) {
            v = o[i] + c + 65535;
            c = Math.floor(v / 65536);
            o[i] = v - c * 65536;
          }
          o[0] += c - 1 + 37 * (c - 1);
        }
        function sel25519(p, q, b) {
          var t, c = ~(b - 1);
          for (var i = 0; i < 16; i++) {
            t = c & (p[i] ^ q[i]);
            p[i] ^= t;
            q[i] ^= t;
          }
        }
        function pack25519(o, n) {
          var i, j, b;
          var m = gf(), t = gf();
          for (i = 0; i < 16; i++)
            t[i] = n[i];
          car25519(t);
          car25519(t);
          car25519(t);
          for (j = 0; j < 2; j++) {
            m[0] = t[0] - 65517;
            for (i = 1; i < 15; i++) {
              m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
              m[i - 1] &= 65535;
            }
            m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
            b = m[15] >> 16 & 1;
            m[14] &= 65535;
            sel25519(t, m, 1 - b);
          }
          for (i = 0; i < 16; i++) {
            o[2 * i] = t[i] & 255;
            o[2 * i + 1] = t[i] >> 8;
          }
        }
        function neq25519(a, b) {
          var c = new Uint8Array(32), d = new Uint8Array(32);
          pack25519(c, a);
          pack25519(d, b);
          return crypto_verify_32(c, 0, d, 0);
        }
        function par25519(a) {
          var d = new Uint8Array(32);
          pack25519(d, a);
          return d[0] & 1;
        }
        function unpack25519(o, n) {
          var i;
          for (i = 0; i < 16; i++)
            o[i] = n[2 * i] + (n[2 * i + 1] << 8);
          o[15] &= 32767;
        }
        function A(o, a, b) {
          for (var i = 0; i < 16; i++)
            o[i] = a[i] + b[i];
        }
        function Z(o, a, b) {
          for (var i = 0; i < 16; i++)
            o[i] = a[i] - b[i];
        }
        function M(o, a, b) {
          var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
          v = a[0];
          t0 += v * b0;
          t1 += v * b1;
          t2 += v * b2;
          t3 += v * b3;
          t4 += v * b4;
          t5 += v * b5;
          t6 += v * b6;
          t7 += v * b7;
          t8 += v * b8;
          t9 += v * b9;
          t10 += v * b10;
          t11 += v * b11;
          t12 += v * b12;
          t13 += v * b13;
          t14 += v * b14;
          t15 += v * b15;
          v = a[1];
          t1 += v * b0;
          t2 += v * b1;
          t3 += v * b2;
          t4 += v * b3;
          t5 += v * b4;
          t6 += v * b5;
          t7 += v * b6;
          t8 += v * b7;
          t9 += v * b8;
          t10 += v * b9;
          t11 += v * b10;
          t12 += v * b11;
          t13 += v * b12;
          t14 += v * b13;
          t15 += v * b14;
          t16 += v * b15;
          v = a[2];
          t2 += v * b0;
          t3 += v * b1;
          t4 += v * b2;
          t5 += v * b3;
          t6 += v * b4;
          t7 += v * b5;
          t8 += v * b6;
          t9 += v * b7;
          t10 += v * b8;
          t11 += v * b9;
          t12 += v * b10;
          t13 += v * b11;
          t14 += v * b12;
          t15 += v * b13;
          t16 += v * b14;
          t17 += v * b15;
          v = a[3];
          t3 += v * b0;
          t4 += v * b1;
          t5 += v * b2;
          t6 += v * b3;
          t7 += v * b4;
          t8 += v * b5;
          t9 += v * b6;
          t10 += v * b7;
          t11 += v * b8;
          t12 += v * b9;
          t13 += v * b10;
          t14 += v * b11;
          t15 += v * b12;
          t16 += v * b13;
          t17 += v * b14;
          t18 += v * b15;
          v = a[4];
          t4 += v * b0;
          t5 += v * b1;
          t6 += v * b2;
          t7 += v * b3;
          t8 += v * b4;
          t9 += v * b5;
          t10 += v * b6;
          t11 += v * b7;
          t12 += v * b8;
          t13 += v * b9;
          t14 += v * b10;
          t15 += v * b11;
          t16 += v * b12;
          t17 += v * b13;
          t18 += v * b14;
          t19 += v * b15;
          v = a[5];
          t5 += v * b0;
          t6 += v * b1;
          t7 += v * b2;
          t8 += v * b3;
          t9 += v * b4;
          t10 += v * b5;
          t11 += v * b6;
          t12 += v * b7;
          t13 += v * b8;
          t14 += v * b9;
          t15 += v * b10;
          t16 += v * b11;
          t17 += v * b12;
          t18 += v * b13;
          t19 += v * b14;
          t20 += v * b15;
          v = a[6];
          t6 += v * b0;
          t7 += v * b1;
          t8 += v * b2;
          t9 += v * b3;
          t10 += v * b4;
          t11 += v * b5;
          t12 += v * b6;
          t13 += v * b7;
          t14 += v * b8;
          t15 += v * b9;
          t16 += v * b10;
          t17 += v * b11;
          t18 += v * b12;
          t19 += v * b13;
          t20 += v * b14;
          t21 += v * b15;
          v = a[7];
          t7 += v * b0;
          t8 += v * b1;
          t9 += v * b2;
          t10 += v * b3;
          t11 += v * b4;
          t12 += v * b5;
          t13 += v * b6;
          t14 += v * b7;
          t15 += v * b8;
          t16 += v * b9;
          t17 += v * b10;
          t18 += v * b11;
          t19 += v * b12;
          t20 += v * b13;
          t21 += v * b14;
          t22 += v * b15;
          v = a[8];
          t8 += v * b0;
          t9 += v * b1;
          t10 += v * b2;
          t11 += v * b3;
          t12 += v * b4;
          t13 += v * b5;
          t14 += v * b6;
          t15 += v * b7;
          t16 += v * b8;
          t17 += v * b9;
          t18 += v * b10;
          t19 += v * b11;
          t20 += v * b12;
          t21 += v * b13;
          t22 += v * b14;
          t23 += v * b15;
          v = a[9];
          t9 += v * b0;
          t10 += v * b1;
          t11 += v * b2;
          t12 += v * b3;
          t13 += v * b4;
          t14 += v * b5;
          t15 += v * b6;
          t16 += v * b7;
          t17 += v * b8;
          t18 += v * b9;
          t19 += v * b10;
          t20 += v * b11;
          t21 += v * b12;
          t22 += v * b13;
          t23 += v * b14;
          t24 += v * b15;
          v = a[10];
          t10 += v * b0;
          t11 += v * b1;
          t12 += v * b2;
          t13 += v * b3;
          t14 += v * b4;
          t15 += v * b5;
          t16 += v * b6;
          t17 += v * b7;
          t18 += v * b8;
          t19 += v * b9;
          t20 += v * b10;
          t21 += v * b11;
          t22 += v * b12;
          t23 += v * b13;
          t24 += v * b14;
          t25 += v * b15;
          v = a[11];
          t11 += v * b0;
          t12 += v * b1;
          t13 += v * b2;
          t14 += v * b3;
          t15 += v * b4;
          t16 += v * b5;
          t17 += v * b6;
          t18 += v * b7;
          t19 += v * b8;
          t20 += v * b9;
          t21 += v * b10;
          t22 += v * b11;
          t23 += v * b12;
          t24 += v * b13;
          t25 += v * b14;
          t26 += v * b15;
          v = a[12];
          t12 += v * b0;
          t13 += v * b1;
          t14 += v * b2;
          t15 += v * b3;
          t16 += v * b4;
          t17 += v * b5;
          t18 += v * b6;
          t19 += v * b7;
          t20 += v * b8;
          t21 += v * b9;
          t22 += v * b10;
          t23 += v * b11;
          t24 += v * b12;
          t25 += v * b13;
          t26 += v * b14;
          t27 += v * b15;
          v = a[13];
          t13 += v * b0;
          t14 += v * b1;
          t15 += v * b2;
          t16 += v * b3;
          t17 += v * b4;
          t18 += v * b5;
          t19 += v * b6;
          t20 += v * b7;
          t21 += v * b8;
          t22 += v * b9;
          t23 += v * b10;
          t24 += v * b11;
          t25 += v * b12;
          t26 += v * b13;
          t27 += v * b14;
          t28 += v * b15;
          v = a[14];
          t14 += v * b0;
          t15 += v * b1;
          t16 += v * b2;
          t17 += v * b3;
          t18 += v * b4;
          t19 += v * b5;
          t20 += v * b6;
          t21 += v * b7;
          t22 += v * b8;
          t23 += v * b9;
          t24 += v * b10;
          t25 += v * b11;
          t26 += v * b12;
          t27 += v * b13;
          t28 += v * b14;
          t29 += v * b15;
          v = a[15];
          t15 += v * b0;
          t16 += v * b1;
          t17 += v * b2;
          t18 += v * b3;
          t19 += v * b4;
          t20 += v * b5;
          t21 += v * b6;
          t22 += v * b7;
          t23 += v * b8;
          t24 += v * b9;
          t25 += v * b10;
          t26 += v * b11;
          t27 += v * b12;
          t28 += v * b13;
          t29 += v * b14;
          t30 += v * b15;
          t0 += 38 * t16;
          t1 += 38 * t17;
          t2 += 38 * t18;
          t3 += 38 * t19;
          t4 += 38 * t20;
          t5 += 38 * t21;
          t6 += 38 * t22;
          t7 += 38 * t23;
          t8 += 38 * t24;
          t9 += 38 * t25;
          t10 += 38 * t26;
          t11 += 38 * t27;
          t12 += 38 * t28;
          t13 += 38 * t29;
          t14 += 38 * t30;
          c = 1;
          v = t0 + c + 65535;
          c = Math.floor(v / 65536);
          t0 = v - c * 65536;
          v = t1 + c + 65535;
          c = Math.floor(v / 65536);
          t1 = v - c * 65536;
          v = t2 + c + 65535;
          c = Math.floor(v / 65536);
          t2 = v - c * 65536;
          v = t3 + c + 65535;
          c = Math.floor(v / 65536);
          t3 = v - c * 65536;
          v = t4 + c + 65535;
          c = Math.floor(v / 65536);
          t4 = v - c * 65536;
          v = t5 + c + 65535;
          c = Math.floor(v / 65536);
          t5 = v - c * 65536;
          v = t6 + c + 65535;
          c = Math.floor(v / 65536);
          t6 = v - c * 65536;
          v = t7 + c + 65535;
          c = Math.floor(v / 65536);
          t7 = v - c * 65536;
          v = t8 + c + 65535;
          c = Math.floor(v / 65536);
          t8 = v - c * 65536;
          v = t9 + c + 65535;
          c = Math.floor(v / 65536);
          t9 = v - c * 65536;
          v = t10 + c + 65535;
          c = Math.floor(v / 65536);
          t10 = v - c * 65536;
          v = t11 + c + 65535;
          c = Math.floor(v / 65536);
          t11 = v - c * 65536;
          v = t12 + c + 65535;
          c = Math.floor(v / 65536);
          t12 = v - c * 65536;
          v = t13 + c + 65535;
          c = Math.floor(v / 65536);
          t13 = v - c * 65536;
          v = t14 + c + 65535;
          c = Math.floor(v / 65536);
          t14 = v - c * 65536;
          v = t15 + c + 65535;
          c = Math.floor(v / 65536);
          t15 = v - c * 65536;
          t0 += c - 1 + 37 * (c - 1);
          c = 1;
          v = t0 + c + 65535;
          c = Math.floor(v / 65536);
          t0 = v - c * 65536;
          v = t1 + c + 65535;
          c = Math.floor(v / 65536);
          t1 = v - c * 65536;
          v = t2 + c + 65535;
          c = Math.floor(v / 65536);
          t2 = v - c * 65536;
          v = t3 + c + 65535;
          c = Math.floor(v / 65536);
          t3 = v - c * 65536;
          v = t4 + c + 65535;
          c = Math.floor(v / 65536);
          t4 = v - c * 65536;
          v = t5 + c + 65535;
          c = Math.floor(v / 65536);
          t5 = v - c * 65536;
          v = t6 + c + 65535;
          c = Math.floor(v / 65536);
          t6 = v - c * 65536;
          v = t7 + c + 65535;
          c = Math.floor(v / 65536);
          t7 = v - c * 65536;
          v = t8 + c + 65535;
          c = Math.floor(v / 65536);
          t8 = v - c * 65536;
          v = t9 + c + 65535;
          c = Math.floor(v / 65536);
          t9 = v - c * 65536;
          v = t10 + c + 65535;
          c = Math.floor(v / 65536);
          t10 = v - c * 65536;
          v = t11 + c + 65535;
          c = Math.floor(v / 65536);
          t11 = v - c * 65536;
          v = t12 + c + 65535;
          c = Math.floor(v / 65536);
          t12 = v - c * 65536;
          v = t13 + c + 65535;
          c = Math.floor(v / 65536);
          t13 = v - c * 65536;
          v = t14 + c + 65535;
          c = Math.floor(v / 65536);
          t14 = v - c * 65536;
          v = t15 + c + 65535;
          c = Math.floor(v / 65536);
          t15 = v - c * 65536;
          t0 += c - 1 + 37 * (c - 1);
          o[0] = t0;
          o[1] = t1;
          o[2] = t2;
          o[3] = t3;
          o[4] = t4;
          o[5] = t5;
          o[6] = t6;
          o[7] = t7;
          o[8] = t8;
          o[9] = t9;
          o[10] = t10;
          o[11] = t11;
          o[12] = t12;
          o[13] = t13;
          o[14] = t14;
          o[15] = t15;
        }
        function S(o, a) {
          M(o, a, a);
        }
        function inv25519(o, i) {
          var c = gf();
          var a;
          for (a = 0; a < 16; a++)
            c[a] = i[a];
          for (a = 253; a >= 0; a--) {
            S(c, c);
            if (a !== 2 && a !== 4)
              M(c, c, i);
          }
          for (a = 0; a < 16; a++)
            o[a] = c[a];
        }
        function pow2523(o, i) {
          var c = gf();
          var a;
          for (a = 0; a < 16; a++)
            c[a] = i[a];
          for (a = 250; a >= 0; a--) {
            S(c, c);
            if (a !== 1)
              M(c, c, i);
          }
          for (a = 0; a < 16; a++)
            o[a] = c[a];
        }
        function crypto_scalarmult(q, n, p) {
          var z = new Uint8Array(32);
          var x = new Float64Array(80), r, i;
          var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
          for (i = 0; i < 31; i++)
            z[i] = n[i];
          z[31] = n[31] & 127 | 64;
          z[0] &= 248;
          unpack25519(x, p);
          for (i = 0; i < 16; i++) {
            b[i] = x[i];
            d[i] = a[i] = c[i] = 0;
          }
          a[0] = d[0] = 1;
          for (i = 254; i >= 0; --i) {
            r = z[i >>> 3] >>> (i & 7) & 1;
            sel25519(a, b, r);
            sel25519(c, d, r);
            A(e, a, c);
            Z(a, a, c);
            A(c, b, d);
            Z(b, b, d);
            S(d, e);
            S(f, a);
            M(a, c, a);
            M(c, b, e);
            A(e, a, c);
            Z(a, a, c);
            S(b, a);
            Z(c, d, f);
            M(a, c, _121665);
            A(a, a, d);
            M(c, c, a);
            M(a, d, f);
            M(d, b, x);
            S(b, e);
            sel25519(a, b, r);
            sel25519(c, d, r);
          }
          for (i = 0; i < 16; i++) {
            x[i + 16] = a[i];
            x[i + 32] = c[i];
            x[i + 48] = b[i];
            x[i + 64] = d[i];
          }
          var x32 = x.subarray(32);
          var x16 = x.subarray(16);
          inv25519(x32, x32);
          M(x16, x16, x32);
          pack25519(q, x16);
          return 0;
        }
        function crypto_scalarmult_base(q, n) {
          return crypto_scalarmult(q, n, _9);
        }
        function crypto_box_keypair(y, x) {
          randombytes(x, 32);
          return crypto_scalarmult_base(y, x);
        }
        function crypto_box_beforenm(k, y, x) {
          var s = new Uint8Array(32);
          crypto_scalarmult(s, x, y);
          return crypto_core_hsalsa20(k, _0, s, sigma);
        }
        var crypto_box_afternm = crypto_secretbox;
        var crypto_box_open_afternm = crypto_secretbox_open;
        function crypto_box(c, m, d, n, y, x) {
          var k = new Uint8Array(32);
          crypto_box_beforenm(k, y, x);
          return crypto_box_afternm(c, m, d, n, k);
        }
        function crypto_box_open(m, c, d, n, y, x) {
          var k = new Uint8Array(32);
          crypto_box_beforenm(k, y, x);
          return crypto_box_open_afternm(m, c, d, n, k);
        }
        var K = [
          1116352408,
          3609767458,
          1899447441,
          602891725,
          3049323471,
          3964484399,
          3921009573,
          2173295548,
          961987163,
          4081628472,
          1508970993,
          3053834265,
          2453635748,
          2937671579,
          2870763221,
          3664609560,
          3624381080,
          2734883394,
          310598401,
          1164996542,
          607225278,
          1323610764,
          1426881987,
          3590304994,
          1925078388,
          4068182383,
          2162078206,
          991336113,
          2614888103,
          633803317,
          3248222580,
          3479774868,
          3835390401,
          2666613458,
          4022224774,
          944711139,
          264347078,
          2341262773,
          604807628,
          2007800933,
          770255983,
          1495990901,
          1249150122,
          1856431235,
          1555081692,
          3175218132,
          1996064986,
          2198950837,
          2554220882,
          3999719339,
          2821834349,
          766784016,
          2952996808,
          2566594879,
          3210313671,
          3203337956,
          3336571891,
          1034457026,
          3584528711,
          2466948901,
          113926993,
          3758326383,
          338241895,
          168717936,
          666307205,
          1188179964,
          773529912,
          1546045734,
          1294757372,
          1522805485,
          1396182291,
          2643833823,
          1695183700,
          2343527390,
          1986661051,
          1014477480,
          2177026350,
          1206759142,
          2456956037,
          344077627,
          2730485921,
          1290863460,
          2820302411,
          3158454273,
          3259730800,
          3505952657,
          3345764771,
          106217008,
          3516065817,
          3606008344,
          3600352804,
          1432725776,
          4094571909,
          1467031594,
          275423344,
          851169720,
          430227734,
          3100823752,
          506948616,
          1363258195,
          659060556,
          3750685593,
          883997877,
          3785050280,
          958139571,
          3318307427,
          1322822218,
          3812723403,
          1537002063,
          2003034995,
          1747873779,
          3602036899,
          1955562222,
          1575990012,
          2024104815,
          1125592928,
          2227730452,
          2716904306,
          2361852424,
          442776044,
          2428436474,
          593698344,
          2756734187,
          3733110249,
          3204031479,
          2999351573,
          3329325298,
          3815920427,
          3391569614,
          3928383900,
          3515267271,
          566280711,
          3940187606,
          3454069534,
          4118630271,
          4000239992,
          116418474,
          1914138554,
          174292421,
          2731055270,
          289380356,
          3203993006,
          460393269,
          320620315,
          685471733,
          587496836,
          852142971,
          1086792851,
          1017036298,
          365543100,
          1126000580,
          2618297676,
          1288033470,
          3409855158,
          1501505948,
          4234509866,
          1607167915,
          987167468,
          1816402316,
          1246189591
        ];
        function crypto_hashblocks_hl(hh, hl, m, n) {
          var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
          var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
          var pos = 0;
          while (n >= 128) {
            for (i = 0; i < 16; i++) {
              j = 8 * i + pos;
              wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
              wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
            }
            for (i = 0; i < 80; i++) {
              bh0 = ah0;
              bh1 = ah1;
              bh2 = ah2;
              bh3 = ah3;
              bh4 = ah4;
              bh5 = ah5;
              bh6 = ah6;
              bh7 = ah7;
              bl0 = al0;
              bl1 = al1;
              bl2 = al2;
              bl3 = al3;
              bl4 = al4;
              bl5 = al5;
              bl6 = al6;
              bl7 = al7;
              h = ah7;
              l = al7;
              a = l & 65535;
              b = l >>> 16;
              c = h & 65535;
              d = h >>> 16;
              h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
              l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = ah4 & ah5 ^ ~ah4 & ah6;
              l = al4 & al5 ^ ~al4 & al6;
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = K[i * 2];
              l = K[i * 2 + 1];
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = wh[i % 16];
              l = wl[i % 16];
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              th = c & 65535 | d << 16;
              tl = a & 65535 | b << 16;
              h = th;
              l = tl;
              a = l & 65535;
              b = l >>> 16;
              c = h & 65535;
              d = h >>> 16;
              h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
              l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
              l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              bh7 = c & 65535 | d << 16;
              bl7 = a & 65535 | b << 16;
              h = bh3;
              l = bl3;
              a = l & 65535;
              b = l >>> 16;
              c = h & 65535;
              d = h >>> 16;
              h = th;
              l = tl;
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              bh3 = c & 65535 | d << 16;
              bl3 = a & 65535 | b << 16;
              ah1 = bh0;
              ah2 = bh1;
              ah3 = bh2;
              ah4 = bh3;
              ah5 = bh4;
              ah6 = bh5;
              ah7 = bh6;
              ah0 = bh7;
              al1 = bl0;
              al2 = bl1;
              al3 = bl2;
              al4 = bl3;
              al5 = bl4;
              al6 = bl5;
              al7 = bl6;
              al0 = bl7;
              if (i % 16 === 15) {
                for (j = 0; j < 16; j++) {
                  h = wh[j];
                  l = wl[j];
                  a = l & 65535;
                  b = l >>> 16;
                  c = h & 65535;
                  d = h >>> 16;
                  h = wh[(j + 9) % 16];
                  l = wl[(j + 9) % 16];
                  a += l & 65535;
                  b += l >>> 16;
                  c += h & 65535;
                  d += h >>> 16;
                  th = wh[(j + 1) % 16];
                  tl = wl[(j + 1) % 16];
                  h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
                  l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
                  a += l & 65535;
                  b += l >>> 16;
                  c += h & 65535;
                  d += h >>> 16;
                  th = wh[(j + 14) % 16];
                  tl = wl[(j + 14) % 16];
                  h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
                  l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
                  a += l & 65535;
                  b += l >>> 16;
                  c += h & 65535;
                  d += h >>> 16;
                  b += a >>> 16;
                  c += b >>> 16;
                  d += c >>> 16;
                  wh[j] = c & 65535 | d << 16;
                  wl[j] = a & 65535 | b << 16;
                }
              }
            }
            h = ah0;
            l = al0;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[0];
            l = hl[0];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[0] = ah0 = c & 65535 | d << 16;
            hl[0] = al0 = a & 65535 | b << 16;
            h = ah1;
            l = al1;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[1];
            l = hl[1];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[1] = ah1 = c & 65535 | d << 16;
            hl[1] = al1 = a & 65535 | b << 16;
            h = ah2;
            l = al2;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[2];
            l = hl[2];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[2] = ah2 = c & 65535 | d << 16;
            hl[2] = al2 = a & 65535 | b << 16;
            h = ah3;
            l = al3;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[3];
            l = hl[3];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[3] = ah3 = c & 65535 | d << 16;
            hl[3] = al3 = a & 65535 | b << 16;
            h = ah4;
            l = al4;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[4];
            l = hl[4];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[4] = ah4 = c & 65535 | d << 16;
            hl[4] = al4 = a & 65535 | b << 16;
            h = ah5;
            l = al5;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[5];
            l = hl[5];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[5] = ah5 = c & 65535 | d << 16;
            hl[5] = al5 = a & 65535 | b << 16;
            h = ah6;
            l = al6;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[6];
            l = hl[6];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[6] = ah6 = c & 65535 | d << 16;
            hl[6] = al6 = a & 65535 | b << 16;
            h = ah7;
            l = al7;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[7];
            l = hl[7];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[7] = ah7 = c & 65535 | d << 16;
            hl[7] = al7 = a & 65535 | b << 16;
            pos += 128;
            n -= 128;
          }
          return n;
        }
        function crypto_hash(out, m, n) {
          var hh = new Int32Array(8), hl = new Int32Array(8), x = new Uint8Array(256), i, b = n;
          hh[0] = 1779033703;
          hh[1] = 3144134277;
          hh[2] = 1013904242;
          hh[3] = 2773480762;
          hh[4] = 1359893119;
          hh[5] = 2600822924;
          hh[6] = 528734635;
          hh[7] = 1541459225;
          hl[0] = 4089235720;
          hl[1] = 2227873595;
          hl[2] = 4271175723;
          hl[3] = 1595750129;
          hl[4] = 2917565137;
          hl[5] = 725511199;
          hl[6] = 4215389547;
          hl[7] = 327033209;
          crypto_hashblocks_hl(hh, hl, m, n);
          n %= 128;
          for (i = 0; i < n; i++)
            x[i] = m[b - n + i];
          x[n] = 128;
          n = 256 - 128 * (n < 112 ? 1 : 0);
          x[n - 9] = 0;
          ts64(x, n - 8, b / 536870912 | 0, b << 3);
          crypto_hashblocks_hl(hh, hl, x, n);
          for (i = 0; i < 8; i++)
            ts64(out, 8 * i, hh[i], hl[i]);
          return 0;
        }
        function add(p, q) {
          var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
          Z(a, p[1], p[0]);
          Z(t, q[1], q[0]);
          M(a, a, t);
          A(b, p[0], p[1]);
          A(t, q[0], q[1]);
          M(b, b, t);
          M(c, p[3], q[3]);
          M(c, c, D2);
          M(d, p[2], q[2]);
          A(d, d, d);
          Z(e, b, a);
          Z(f, d, c);
          A(g, d, c);
          A(h, b, a);
          M(p[0], e, f);
          M(p[1], h, g);
          M(p[2], g, f);
          M(p[3], e, h);
        }
        function cswap(p, q, b) {
          var i;
          for (i = 0; i < 4; i++) {
            sel25519(p[i], q[i], b);
          }
        }
        function pack(r, p) {
          var tx = gf(), ty = gf(), zi = gf();
          inv25519(zi, p[2]);
          M(tx, p[0], zi);
          M(ty, p[1], zi);
          pack25519(r, ty);
          r[31] ^= par25519(tx) << 7;
        }
        function scalarmult(p, q, s) {
          var b, i;
          set25519(p[0], gf0);
          set25519(p[1], gf1);
          set25519(p[2], gf1);
          set25519(p[3], gf0);
          for (i = 255; i >= 0; --i) {
            b = s[i / 8 | 0] >> (i & 7) & 1;
            cswap(p, q, b);
            add(q, p);
            add(p, p);
            cswap(p, q, b);
          }
        }
        function scalarbase(p, s) {
          var q = [gf(), gf(), gf(), gf()];
          set25519(q[0], X);
          set25519(q[1], Y);
          set25519(q[2], gf1);
          M(q[3], X, Y);
          scalarmult(p, q, s);
        }
        function crypto_sign_keypair(pk, sk, seeded) {
          var d = new Uint8Array(64);
          var p = [gf(), gf(), gf(), gf()];
          var i;
          if (!seeded)
            randombytes(sk, 32);
          crypto_hash(d, sk, 32);
          d[0] &= 248;
          d[31] &= 127;
          d[31] |= 64;
          scalarbase(p, d);
          pack(pk, p);
          for (i = 0; i < 32; i++)
            sk[i + 32] = pk[i];
          return 0;
        }
        var L = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
        function modL(r, x) {
          var carry, i, j, k;
          for (i = 63; i >= 32; --i) {
            carry = 0;
            for (j = i - 32, k = i - 12; j < k; ++j) {
              x[j] += carry - 16 * x[i] * L[j - (i - 32)];
              carry = Math.floor((x[j] + 128) / 256);
              x[j] -= carry * 256;
            }
            x[j] += carry;
            x[i] = 0;
          }
          carry = 0;
          for (j = 0; j < 32; j++) {
            x[j] += carry - (x[31] >> 4) * L[j];
            carry = x[j] >> 8;
            x[j] &= 255;
          }
          for (j = 0; j < 32; j++)
            x[j] -= carry * L[j];
          for (i = 0; i < 32; i++) {
            x[i + 1] += x[i] >> 8;
            r[i] = x[i] & 255;
          }
        }
        function reduce(r) {
          var x = new Float64Array(64), i;
          for (i = 0; i < 64; i++)
            x[i] = r[i];
          for (i = 0; i < 64; i++)
            r[i] = 0;
          modL(r, x);
        }
        function crypto_sign(sm, m, n, sk) {
          var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
          var i, j, x = new Float64Array(64);
          var p = [gf(), gf(), gf(), gf()];
          crypto_hash(d, sk, 32);
          d[0] &= 248;
          d[31] &= 127;
          d[31] |= 64;
          var smlen = n + 64;
          for (i = 0; i < n; i++)
            sm[64 + i] = m[i];
          for (i = 0; i < 32; i++)
            sm[32 + i] = d[32 + i];
          crypto_hash(r, sm.subarray(32), n + 32);
          reduce(r);
          scalarbase(p, r);
          pack(sm, p);
          for (i = 32; i < 64; i++)
            sm[i] = sk[i];
          crypto_hash(h, sm, n + 64);
          reduce(h);
          for (i = 0; i < 64; i++)
            x[i] = 0;
          for (i = 0; i < 32; i++)
            x[i] = r[i];
          for (i = 0; i < 32; i++) {
            for (j = 0; j < 32; j++) {
              x[i + j] += h[i] * d[j];
            }
          }
          modL(sm.subarray(32), x);
          return smlen;
        }
        function unpackneg(r, p) {
          var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
          set25519(r[2], gf1);
          unpack25519(r[1], p);
          S(num, r[1]);
          M(den, num, D);
          Z(num, num, r[2]);
          A(den, r[2], den);
          S(den2, den);
          S(den4, den2);
          M(den6, den4, den2);
          M(t, den6, num);
          M(t, t, den);
          pow2523(t, t);
          M(t, t, num);
          M(t, t, den);
          M(t, t, den);
          M(r[0], t, den);
          S(chk, r[0]);
          M(chk, chk, den);
          if (neq25519(chk, num))
            M(r[0], r[0], I);
          S(chk, r[0]);
          M(chk, chk, den);
          if (neq25519(chk, num))
            return -1;
          if (par25519(r[0]) === p[31] >> 7)
            Z(r[0], gf0, r[0]);
          M(r[3], r[0], r[1]);
          return 0;
        }
        function crypto_sign_open(m, sm, n, pk) {
          var i;
          var t = new Uint8Array(32), h = new Uint8Array(64);
          var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
          if (n < 64)
            return -1;
          if (unpackneg(q, pk))
            return -1;
          for (i = 0; i < n; i++)
            m[i] = sm[i];
          for (i = 0; i < 32; i++)
            m[i + 32] = pk[i];
          crypto_hash(h, m, n);
          reduce(h);
          scalarmult(p, q, h);
          scalarbase(q, sm.subarray(32));
          add(p, q);
          pack(t, p);
          n -= 64;
          if (crypto_verify_32(sm, 0, t, 0)) {
            for (i = 0; i < n; i++)
              m[i] = 0;
            return -1;
          }
          for (i = 0; i < n; i++)
            m[i] = sm[i + 64];
          return n;
        }
        var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
        nacl.lowlevel = {
          crypto_core_hsalsa20,
          crypto_stream_xor,
          crypto_stream,
          crypto_stream_salsa20_xor,
          crypto_stream_salsa20,
          crypto_onetimeauth,
          crypto_onetimeauth_verify,
          crypto_verify_16,
          crypto_verify_32,
          crypto_secretbox,
          crypto_secretbox_open,
          crypto_scalarmult,
          crypto_scalarmult_base,
          crypto_box_beforenm,
          crypto_box_afternm,
          crypto_box,
          crypto_box_open,
          crypto_box_keypair,
          crypto_hash,
          crypto_sign,
          crypto_sign_keypair,
          crypto_sign_open,
          crypto_secretbox_KEYBYTES,
          crypto_secretbox_NONCEBYTES,
          crypto_secretbox_ZEROBYTES,
          crypto_secretbox_BOXZEROBYTES,
          crypto_scalarmult_BYTES,
          crypto_scalarmult_SCALARBYTES,
          crypto_box_PUBLICKEYBYTES,
          crypto_box_SECRETKEYBYTES,
          crypto_box_BEFORENMBYTES,
          crypto_box_NONCEBYTES,
          crypto_box_ZEROBYTES,
          crypto_box_BOXZEROBYTES,
          crypto_sign_BYTES,
          crypto_sign_PUBLICKEYBYTES,
          crypto_sign_SECRETKEYBYTES,
          crypto_sign_SEEDBYTES,
          crypto_hash_BYTES,
          gf,
          D,
          L,
          pack25519,
          unpack25519,
          M,
          A,
          S,
          Z,
          pow2523,
          add,
          set25519,
          modL,
          scalarmult,
          scalarbase
        };
        function checkLengths(k, n) {
          if (k.length !== crypto_secretbox_KEYBYTES)
            throw new Error("bad key size");
          if (n.length !== crypto_secretbox_NONCEBYTES)
            throw new Error("bad nonce size");
        }
        function checkBoxLengths(pk, sk) {
          if (pk.length !== crypto_box_PUBLICKEYBYTES)
            throw new Error("bad public key size");
          if (sk.length !== crypto_box_SECRETKEYBYTES)
            throw new Error("bad secret key size");
        }
        function checkArrayTypes() {
          for (var i = 0; i < arguments.length; i++) {
            if (!(arguments[i] instanceof Uint8Array))
              throw new TypeError("unexpected type, use Uint8Array");
          }
        }
        function cleanup(arr) {
          for (var i = 0; i < arr.length; i++)
            arr[i] = 0;
        }
        nacl.randomBytes = function(n) {
          var b = new Uint8Array(n);
          randombytes(b, n);
          return b;
        };
        nacl.secretbox = function(msg, nonce, key) {
          checkArrayTypes(msg, nonce, key);
          checkLengths(key, nonce);
          var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
          var c = new Uint8Array(m.length);
          for (var i = 0; i < msg.length; i++)
            m[i + crypto_secretbox_ZEROBYTES] = msg[i];
          crypto_secretbox(c, m, m.length, nonce, key);
          return c.subarray(crypto_secretbox_BOXZEROBYTES);
        };
        nacl.secretbox.open = function(box, nonce, key) {
          checkArrayTypes(box, nonce, key);
          checkLengths(key, nonce);
          var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
          var m = new Uint8Array(c.length);
          for (var i = 0; i < box.length; i++)
            c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
          if (c.length < 32)
            return null;
          if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0)
            return null;
          return m.subarray(crypto_secretbox_ZEROBYTES);
        };
        nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
        nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
        nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
        nacl.scalarMult = function(n, p) {
          checkArrayTypes(n, p);
          if (n.length !== crypto_scalarmult_SCALARBYTES)
            throw new Error("bad n size");
          if (p.length !== crypto_scalarmult_BYTES)
            throw new Error("bad p size");
          var q = new Uint8Array(crypto_scalarmult_BYTES);
          crypto_scalarmult(q, n, p);
          return q;
        };
        nacl.scalarMult.base = function(n) {
          checkArrayTypes(n);
          if (n.length !== crypto_scalarmult_SCALARBYTES)
            throw new Error("bad n size");
          var q = new Uint8Array(crypto_scalarmult_BYTES);
          crypto_scalarmult_base(q, n);
          return q;
        };
        nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
        nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
        nacl.box = function(msg, nonce, publicKey, secretKey) {
          var k = nacl.box.before(publicKey, secretKey);
          return nacl.secretbox(msg, nonce, k);
        };
        nacl.box.before = function(publicKey, secretKey) {
          checkArrayTypes(publicKey, secretKey);
          checkBoxLengths(publicKey, secretKey);
          var k = new Uint8Array(crypto_box_BEFORENMBYTES);
          crypto_box_beforenm(k, publicKey, secretKey);
          return k;
        };
        nacl.box.after = nacl.secretbox;
        nacl.box.open = function(msg, nonce, publicKey, secretKey) {
          var k = nacl.box.before(publicKey, secretKey);
          return nacl.secretbox.open(msg, nonce, k);
        };
        nacl.box.open.after = nacl.secretbox.open;
        nacl.box.keyPair = function() {
          var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
          var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
          crypto_box_keypair(pk, sk);
          return { publicKey: pk, secretKey: sk };
        };
        nacl.box.keyPair.fromSecretKey = function(secretKey) {
          checkArrayTypes(secretKey);
          if (secretKey.length !== crypto_box_SECRETKEYBYTES)
            throw new Error("bad secret key size");
          var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
          crypto_scalarmult_base(pk, secretKey);
          return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
        };
        nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
        nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
        nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
        nacl.box.nonceLength = crypto_box_NONCEBYTES;
        nacl.box.overheadLength = nacl.secretbox.overheadLength;
        nacl.sign = function(msg, secretKey) {
          checkArrayTypes(msg, secretKey);
          if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
            throw new Error("bad secret key size");
          var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
          crypto_sign(signedMsg, msg, msg.length, secretKey);
          return signedMsg;
        };
        nacl.sign.open = function(signedMsg, publicKey) {
          checkArrayTypes(signedMsg, publicKey);
          if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
            throw new Error("bad public key size");
          var tmp = new Uint8Array(signedMsg.length);
          var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
          if (mlen < 0)
            return null;
          var m = new Uint8Array(mlen);
          for (var i = 0; i < m.length; i++)
            m[i] = tmp[i];
          return m;
        };
        nacl.sign.detached = function(msg, secretKey) {
          var signedMsg = nacl.sign(msg, secretKey);
          var sig = new Uint8Array(crypto_sign_BYTES);
          for (var i = 0; i < sig.length; i++)
            sig[i] = signedMsg[i];
          return sig;
        };
        nacl.sign.detached.verify = function(msg, sig, publicKey) {
          checkArrayTypes(msg, sig, publicKey);
          if (sig.length !== crypto_sign_BYTES)
            throw new Error("bad signature size");
          if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
            throw new Error("bad public key size");
          var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
          var m = new Uint8Array(crypto_sign_BYTES + msg.length);
          var i;
          for (i = 0; i < crypto_sign_BYTES; i++)
            sm[i] = sig[i];
          for (i = 0; i < msg.length; i++)
            sm[i + crypto_sign_BYTES] = msg[i];
          return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
        };
        nacl.sign.keyPair = function() {
          var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
          var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
          crypto_sign_keypair(pk, sk);
          return { publicKey: pk, secretKey: sk };
        };
        nacl.sign.keyPair.fromSecretKey = function(secretKey) {
          checkArrayTypes(secretKey);
          if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
            throw new Error("bad secret key size");
          var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
          for (var i = 0; i < pk.length; i++)
            pk[i] = secretKey[32 + i];
          return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
        };
        nacl.sign.keyPair.fromSeed = function(seed) {
          checkArrayTypes(seed);
          if (seed.length !== crypto_sign_SEEDBYTES)
            throw new Error("bad seed size");
          var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
          var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
          for (var i = 0; i < 32; i++)
            sk[i] = seed[i];
          crypto_sign_keypair(pk, sk, true);
          return { publicKey: pk, secretKey: sk };
        };
        nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
        nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
        nacl.sign.seedLength = crypto_sign_SEEDBYTES;
        nacl.sign.signatureLength = crypto_sign_BYTES;
        nacl.hash = function(msg) {
          checkArrayTypes(msg);
          var h = new Uint8Array(crypto_hash_BYTES);
          crypto_hash(h, msg, msg.length);
          return h;
        };
        nacl.hash.hashLength = crypto_hash_BYTES;
        nacl.verify = function(x, y) {
          checkArrayTypes(x, y);
          if (x.length === 0 || y.length === 0)
            return false;
          if (x.length !== y.length)
            return false;
          return vn(x, 0, y, 0, x.length) === 0 ? true : false;
        };
        nacl.setPRNG = function(fn) {
          randombytes = fn;
        };
        (function() {
          var crypto = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
          if (crypto && crypto.getRandomValues) {
            var QUOTA = 65536;
            nacl.setPRNG(function(x, n) {
              var i, v = new Uint8Array(n);
              for (i = 0; i < n; i += QUOTA) {
                crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
              }
              for (i = 0; i < n; i++)
                x[i] = v[i];
              cleanup(v);
            });
          } else if (typeof __require !== "undefined") {
            crypto = require_crypto();
            if (crypto && crypto.randomBytes) {
              nacl.setPRNG(function(x, n) {
                var i, v = crypto.randomBytes(n);
                for (i = 0; i < n; i++)
                  x[i] = v[i];
                cleanup(v);
              });
            }
          }
        })();
      })(typeof module !== "undefined" && module.exports ? module.exports : self.nacl = self.nacl || {});
    }
  });

  // ../../node_modules/util/support/isBufferBrowser.js
  var require_isBufferBrowser = __commonJS({
    "../../node_modules/util/support/isBufferBrowser.js"(exports, module) {
      module.exports = function isBuffer(arg) {
        return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
      };
    }
  });

  // ../../node_modules/inherits/inherits_browser.js
  var require_inherits_browser = __commonJS({
    "../../node_modules/inherits/inherits_browser.js"(exports, module) {
      if (typeof Object.create === "function") {
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        };
      } else {
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        };
      }
    }
  });

  // ../../node_modules/util/util.js
  var require_util2 = __commonJS({
    "../../node_modules/util/util.js"(exports) {
      var formatRegExp = /%[sdj%]/g;
      exports.format = function(f) {
        if (!isString(f)) {
          var objects = [];
          for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
          }
          return objects.join(" ");
        }
        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function(x2) {
          if (x2 === "%%")
            return "%";
          if (i >= len)
            return x2;
          switch (x2) {
            case "%s":
              return String(args[i++]);
            case "%d":
              return Number(args[i++]);
            case "%j":
              try {
                return JSON.stringify(args[i++]);
              } catch (_) {
                return "[Circular]";
              }
            default:
              return x2;
          }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
          if (isNull(x) || !isObject(x)) {
            str += " " + x;
          } else {
            str += " " + inspect(x);
          }
        }
        return str;
      };
      exports.deprecate = function(fn, msg) {
        if (isUndefined(global.process)) {
          return function() {
            return exports.deprecate(fn, msg).apply(this, arguments);
          };
        }
        if (process.noDeprecation === true) {
          return fn;
        }
        var warned = false;
        function deprecated() {
          if (!warned) {
            if (process.throwDeprecation) {
              throw new Error(msg);
            } else if (process.traceDeprecation) {
              console.trace(msg);
            } else {
              console.error(msg);
            }
            warned = true;
          }
          return fn.apply(this, arguments);
        }
        return deprecated;
      };
      var debugs = {};
      var debugEnviron;
      exports.debuglog = function(set) {
        if (isUndefined(debugEnviron))
          debugEnviron = process.env.NODE_DEBUG || "";
        set = set.toUpperCase();
        if (!debugs[set]) {
          if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
            var pid = process.pid;
            debugs[set] = function() {
              var msg = exports.format.apply(exports, arguments);
              console.error("%s %d: %s", set, pid, msg);
            };
          } else {
            debugs[set] = function() {
            };
          }
        }
        return debugs[set];
      };
      function inspect(obj, opts) {
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        };
        if (arguments.length >= 3)
          ctx.depth = arguments[2];
        if (arguments.length >= 4)
          ctx.colors = arguments[3];
        if (isBoolean(opts)) {
          ctx.showHidden = opts;
        } else if (opts) {
          exports._extend(ctx, opts);
        }
        if (isUndefined(ctx.showHidden))
          ctx.showHidden = false;
        if (isUndefined(ctx.depth))
          ctx.depth = 2;
        if (isUndefined(ctx.colors))
          ctx.colors = false;
        if (isUndefined(ctx.customInspect))
          ctx.customInspect = true;
        if (ctx.colors)
          ctx.stylize = stylizeWithColor;
        return formatValue(ctx, obj, ctx.depth);
      }
      exports.inspect = inspect;
      inspect.colors = {
        "bold": [1, 22],
        "italic": [3, 23],
        "underline": [4, 24],
        "inverse": [7, 27],
        "white": [37, 39],
        "grey": [90, 39],
        "black": [30, 39],
        "blue": [34, 39],
        "cyan": [36, 39],
        "green": [32, 39],
        "magenta": [35, 39],
        "red": [31, 39],
        "yellow": [33, 39]
      };
      inspect.styles = {
        "special": "cyan",
        "number": "yellow",
        "boolean": "yellow",
        "undefined": "grey",
        "null": "bold",
        "string": "green",
        "date": "magenta",
        "regexp": "red"
      };
      function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];
        if (style) {
          return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
        } else {
          return str;
        }
      }
      function stylizeNoColor(str, styleType) {
        return str;
      }
      function arrayToHash(array) {
        var hash = {};
        array.forEach(function(val, idx) {
          hash[val] = true;
        });
        return hash;
      }
      function formatValue(ctx, value, recurseTimes) {
        if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx);
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes);
          }
          return ret;
        }
        var primitive = formatPrimitive(ctx, value);
        if (primitive) {
          return primitive;
        }
        var keys = Object.keys(value);
        var visibleKeys = arrayToHash(keys);
        if (ctx.showHidden) {
          keys = Object.getOwnPropertyNames(value);
        }
        if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
          return formatError(value);
        }
        if (keys.length === 0) {
          if (isFunction(value)) {
            var name = value.name ? ": " + value.name : "";
            return ctx.stylize("[Function" + name + "]", "special");
          }
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          }
          if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), "date");
          }
          if (isError(value)) {
            return formatError(value);
          }
        }
        var base = "", array = false, braces = ["{", "}"];
        if (isArray(value)) {
          array = true;
          braces = ["[", "]"];
        }
        if (isFunction(value)) {
          var n = value.name ? ": " + value.name : "";
          base = " [Function" + n + "]";
        }
        if (isRegExp(value)) {
          base = " " + RegExp.prototype.toString.call(value);
        }
        if (isDate(value)) {
          base = " " + Date.prototype.toUTCString.call(value);
        }
        if (isError(value)) {
          base = " " + formatError(value);
        }
        if (keys.length === 0 && (!array || value.length == 0)) {
          return braces[0] + base + braces[1];
        }
        if (recurseTimes < 0) {
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          } else {
            return ctx.stylize("[Object]", "special");
          }
        }
        ctx.seen.push(value);
        var output;
        if (array) {
          output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
        } else {
          output = keys.map(function(key) {
            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
          });
        }
        ctx.seen.pop();
        return reduceToSingleString(output, base, braces);
      }
      function formatPrimitive(ctx, value) {
        if (isUndefined(value))
          return ctx.stylize("undefined", "undefined");
        if (isString(value)) {
          var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return ctx.stylize(simple, "string");
        }
        if (isNumber(value))
          return ctx.stylize("" + value, "number");
        if (isBoolean(value))
          return ctx.stylize("" + value, "boolean");
        if (isNull(value))
          return ctx.stylize("null", "null");
      }
      function formatError(value) {
        return "[" + Error.prototype.toString.call(value) + "]";
      }
      function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];
        for (var i = 0, l = value.length; i < l; ++i) {
          if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              String(i),
              true
            ));
          } else {
            output.push("");
          }
        }
        keys.forEach(function(key) {
          if (!key.match(/^\d+$/)) {
            output.push(formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              key,
              true
            ));
          }
        });
        return output;
      }
      function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
        if (desc.get) {
          if (desc.set) {
            str = ctx.stylize("[Getter/Setter]", "special");
          } else {
            str = ctx.stylize("[Getter]", "special");
          }
        } else {
          if (desc.set) {
            str = ctx.stylize("[Setter]", "special");
          }
        }
        if (!hasOwnProperty(visibleKeys, key)) {
          name = "[" + key + "]";
        }
        if (!str) {
          if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
              str = formatValue(ctx, desc.value, null);
            } else {
              str = formatValue(ctx, desc.value, recurseTimes - 1);
            }
            if (str.indexOf("\n") > -1) {
              if (array) {
                str = str.split("\n").map(function(line) {
                  return "  " + line;
                }).join("\n").substr(2);
              } else {
                str = "\n" + str.split("\n").map(function(line) {
                  return "   " + line;
                }).join("\n");
              }
            }
          } else {
            str = ctx.stylize("[Circular]", "special");
          }
        }
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) {
            return str;
          }
          name = JSON.stringify("" + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = ctx.stylize(name, "name");
          } else {
            name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
            name = ctx.stylize(name, "string");
          }
        }
        return name + ": " + str;
      }
      function reduceToSingleString(output, base, braces) {
        var numLinesEst = 0;
        var length = output.reduce(function(prev, cur) {
          numLinesEst++;
          if (cur.indexOf("\n") >= 0)
            numLinesEst++;
          return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
        }, 0);
        if (length > 60) {
          return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
        }
        return braces[0] + base + " " + output.join(", ") + " " + braces[1];
      }
      function isArray(ar) {
        return Array.isArray(ar);
      }
      exports.isArray = isArray;
      function isBoolean(arg) {
        return typeof arg === "boolean";
      }
      exports.isBoolean = isBoolean;
      function isNull(arg) {
        return arg === null;
      }
      exports.isNull = isNull;
      function isNullOrUndefined(arg) {
        return arg == null;
      }
      exports.isNullOrUndefined = isNullOrUndefined;
      function isNumber(arg) {
        return typeof arg === "number";
      }
      exports.isNumber = isNumber;
      function isString(arg) {
        return typeof arg === "string";
      }
      exports.isString = isString;
      function isSymbol(arg) {
        return typeof arg === "symbol";
      }
      exports.isSymbol = isSymbol;
      function isUndefined(arg) {
        return arg === void 0;
      }
      exports.isUndefined = isUndefined;
      function isRegExp(re) {
        return isObject(re) && objectToString(re) === "[object RegExp]";
      }
      exports.isRegExp = isRegExp;
      function isObject(arg) {
        return typeof arg === "object" && arg !== null;
      }
      exports.isObject = isObject;
      function isDate(d) {
        return isObject(d) && objectToString(d) === "[object Date]";
      }
      exports.isDate = isDate;
      function isError(e) {
        return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
      }
      exports.isError = isError;
      function isFunction(arg) {
        return typeof arg === "function";
      }
      exports.isFunction = isFunction;
      function isPrimitive(arg) {
        return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
      }
      exports.isPrimitive = isPrimitive;
      exports.isBuffer = require_isBufferBrowser();
      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }
      function pad(n) {
        return n < 10 ? "0" + n.toString(10) : n.toString(10);
      }
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      function timestamp() {
        var d = new Date();
        var time = [
          pad(d.getHours()),
          pad(d.getMinutes()),
          pad(d.getSeconds())
        ].join(":");
        return [d.getDate(), months[d.getMonth()], time].join(" ");
      }
      exports.log = function() {
        console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
      };
      exports.inherits = require_inherits_browser();
      exports._extend = function(origin, add) {
        if (!add || !isObject(add))
          return origin;
        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
          origin[keys[i]] = add[keys[i]];
        }
        return origin;
      };
      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }
    }
  });

  // ../../node_modules/nkeys.js/lib/helper.js
  var require_helper = __commonJS({
    "../../node_modules/nkeys.js/lib/helper.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getEd25519Helper = exports.setEd25519Helper = void 0;
      var helper;
      function setEd25519Helper(lib) {
        helper = lib;
      }
      exports.setEd25519Helper = setEd25519Helper;
      function getEd25519Helper() {
        return helper;
      }
      exports.getEd25519Helper = getEd25519Helper;
    }
  });

  // ../../node_modules/nkeys.js/lib/crc16.js
  var require_crc16 = __commonJS({
    "../../node_modules/nkeys.js/lib/crc16.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.crc16 = void 0;
      var crc16tab = new Uint16Array([
        0,
        4129,
        8258,
        12387,
        16516,
        20645,
        24774,
        28903,
        33032,
        37161,
        41290,
        45419,
        49548,
        53677,
        57806,
        61935,
        4657,
        528,
        12915,
        8786,
        21173,
        17044,
        29431,
        25302,
        37689,
        33560,
        45947,
        41818,
        54205,
        50076,
        62463,
        58334,
        9314,
        13379,
        1056,
        5121,
        25830,
        29895,
        17572,
        21637,
        42346,
        46411,
        34088,
        38153,
        58862,
        62927,
        50604,
        54669,
        13907,
        9842,
        5649,
        1584,
        30423,
        26358,
        22165,
        18100,
        46939,
        42874,
        38681,
        34616,
        63455,
        59390,
        55197,
        51132,
        18628,
        22757,
        26758,
        30887,
        2112,
        6241,
        10242,
        14371,
        51660,
        55789,
        59790,
        63919,
        35144,
        39273,
        43274,
        47403,
        23285,
        19156,
        31415,
        27286,
        6769,
        2640,
        14899,
        10770,
        56317,
        52188,
        64447,
        60318,
        39801,
        35672,
        47931,
        43802,
        27814,
        31879,
        19684,
        23749,
        11298,
        15363,
        3168,
        7233,
        60846,
        64911,
        52716,
        56781,
        44330,
        48395,
        36200,
        40265,
        32407,
        28342,
        24277,
        20212,
        15891,
        11826,
        7761,
        3696,
        65439,
        61374,
        57309,
        53244,
        48923,
        44858,
        40793,
        36728,
        37256,
        33193,
        45514,
        41451,
        53516,
        49453,
        61774,
        57711,
        4224,
        161,
        12482,
        8419,
        20484,
        16421,
        28742,
        24679,
        33721,
        37784,
        41979,
        46042,
        49981,
        54044,
        58239,
        62302,
        689,
        4752,
        8947,
        13010,
        16949,
        21012,
        25207,
        29270,
        46570,
        42443,
        38312,
        34185,
        62830,
        58703,
        54572,
        50445,
        13538,
        9411,
        5280,
        1153,
        29798,
        25671,
        21540,
        17413,
        42971,
        47098,
        34713,
        38840,
        59231,
        63358,
        50973,
        55100,
        9939,
        14066,
        1681,
        5808,
        26199,
        30326,
        17941,
        22068,
        55628,
        51565,
        63758,
        59695,
        39368,
        35305,
        47498,
        43435,
        22596,
        18533,
        30726,
        26663,
        6336,
        2273,
        14466,
        10403,
        52093,
        56156,
        60223,
        64286,
        35833,
        39896,
        43963,
        48026,
        19061,
        23124,
        27191,
        31254,
        2801,
        6864,
        10931,
        14994,
        64814,
        60687,
        56684,
        52557,
        48554,
        44427,
        40424,
        36297,
        31782,
        27655,
        23652,
        19525,
        15522,
        11395,
        7392,
        3265,
        61215,
        65342,
        53085,
        57212,
        44955,
        49082,
        36825,
        40952,
        28183,
        32310,
        20053,
        24180,
        11923,
        16050,
        3793,
        7920
      ]);
      var crc16 = class {
        static checksum(data) {
          let crc = 0;
          for (let i = 0; i < data.byteLength; i++) {
            let b = data[i];
            crc = crc << 8 & 65535 ^ crc16tab[(crc >> 8 ^ b) & 255];
          }
          return crc;
        }
        static validate(data, expected) {
          let ba = crc16.checksum(data);
          return ba == expected;
        }
      };
      exports.crc16 = crc16;
    }
  });

  // ../../node_modules/nkeys.js/lib/base32.js
  var require_base32 = __commonJS({
    "../../node_modules/nkeys.js/lib/base32.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.base32 = void 0;
      var b32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      var base32 = class {
        static encode(src) {
          let bits = 0;
          let value = 0;
          let a = new Uint8Array(src);
          let buf = new Uint8Array(src.byteLength * 2);
          let j = 0;
          for (let i = 0; i < a.byteLength; i++) {
            value = value << 8 | a[i];
            bits += 8;
            while (bits >= 5) {
              let index = value >>> bits - 5 & 31;
              buf[j++] = b32Alphabet.charAt(index).charCodeAt(0);
              bits -= 5;
            }
          }
          if (bits > 0) {
            let index = value << 5 - bits & 31;
            buf[j++] = b32Alphabet.charAt(index).charCodeAt(0);
          }
          return buf.slice(0, j);
        }
        static decode(src) {
          let bits = 0;
          let byte = 0;
          let j = 0;
          let a = new Uint8Array(src);
          let out = new Uint8Array(a.byteLength * 5 / 8 | 0);
          for (let i = 0; i < a.byteLength; i++) {
            let v = String.fromCharCode(a[i]);
            let vv = b32Alphabet.indexOf(v);
            if (vv === -1) {
              throw new Error("Illegal Base32 character: " + a[i]);
            }
            byte = byte << 5 | vv;
            bits += 5;
            if (bits >= 8) {
              out[j++] = byte >>> bits - 8 & 255;
              bits -= 8;
            }
          }
          return out.slice(0, j);
        }
      };
      exports.base32 = base32;
    }
  });

  // ../../node_modules/nkeys.js/lib/codec.js
  var require_codec = __commonJS({
    "../../node_modules/nkeys.js/lib/codec.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Codec = void 0;
      var crc16_1 = require_crc16();
      var nkeys_1 = require_nkeys();
      var base32_1 = require_base32();
      var Codec = class {
        static encode(prefix, src) {
          if (!src || !(src instanceof Uint8Array)) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.SerializationError);
          }
          if (!nkeys_1.Prefixes.isValidPrefix(prefix)) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidPrefixByte);
          }
          return Codec._encode(false, prefix, src);
        }
        static encodeSeed(role, src) {
          if (!src) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ApiError);
          }
          if (!nkeys_1.Prefixes.isValidPublicPrefix(role)) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidPrefixByte);
          }
          if (src.byteLength !== 32) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidSeedLen);
          }
          return Codec._encode(true, role, src);
        }
        static decode(expected, src) {
          if (!nkeys_1.Prefixes.isValidPrefix(expected)) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidPrefixByte);
          }
          const raw = Codec._decode(src);
          if (raw[0] !== expected) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidPrefixByte);
          }
          return raw.slice(1);
        }
        static decodeSeed(src) {
          const raw = Codec._decode(src);
          const prefix = Codec._decodePrefix(raw);
          if (prefix[0] != nkeys_1.Prefix.Seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidSeed);
          }
          if (!nkeys_1.Prefixes.isValidPublicPrefix(prefix[1])) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidPrefixByte);
          }
          return { buf: raw.slice(2), prefix: prefix[1] };
        }
        static _encode(seed, role, payload) {
          const payloadOffset = seed ? 2 : 1;
          const payloadLen = payload.byteLength;
          const checkLen = 2;
          const cap = payloadOffset + payloadLen + checkLen;
          const checkOffset = payloadOffset + payloadLen;
          const raw = new Uint8Array(cap);
          if (seed) {
            const encodedPrefix = Codec._encodePrefix(nkeys_1.Prefix.Seed, role);
            raw.set(encodedPrefix);
          } else {
            raw[0] = role;
          }
          raw.set(payload, payloadOffset);
          const checksum = crc16_1.crc16.checksum(raw.slice(0, checkOffset));
          const dv = new DataView(raw.buffer);
          dv.setUint16(checkOffset, checksum, true);
          return base32_1.base32.encode(raw);
        }
        static _decode(src) {
          if (src.byteLength < 4) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidEncoding);
          }
          let raw;
          try {
            raw = base32_1.base32.decode(src);
          } catch (ex) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidEncoding, ex);
          }
          const checkOffset = raw.byteLength - 2;
          const dv = new DataView(raw.buffer);
          const checksum = dv.getUint16(checkOffset, true);
          const payload = raw.slice(0, checkOffset);
          if (!crc16_1.crc16.validate(payload, checksum)) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.InvalidChecksum);
          }
          return payload;
        }
        static _encodePrefix(kind, role) {
          const b1 = kind | role >> 5;
          const b2 = (role & 31) << 3;
          return new Uint8Array([b1, b2]);
        }
        static _decodePrefix(raw) {
          const b1 = raw[0] & 248;
          const b2 = (raw[0] & 7) << 5 | (raw[1] & 248) >> 3;
          return new Uint8Array([b1, b2]);
        }
      };
      exports.Codec = Codec;
    }
  });

  // ../../node_modules/nkeys.js/lib/kp.js
  var require_kp = __commonJS({
    "../../node_modules/nkeys.js/lib/kp.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.KP = void 0;
      var codec_1 = require_codec();
      var nkeys_1 = require_nkeys();
      var helper_1 = require_helper();
      var KP = class {
        constructor(seed) {
          this.seed = seed;
        }
        getRawSeed() {
          if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
          }
          let sd = codec_1.Codec.decodeSeed(this.seed);
          return sd.buf;
        }
        getSeed() {
          if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
          }
          return this.seed;
        }
        getPublicKey() {
          if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
          }
          const sd = codec_1.Codec.decodeSeed(this.seed);
          const kp = helper_1.getEd25519Helper().fromSeed(this.getRawSeed());
          const buf = codec_1.Codec.encode(sd.prefix, kp.publicKey);
          return new TextDecoder().decode(buf);
        }
        getPrivateKey() {
          if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
          }
          const kp = helper_1.getEd25519Helper().fromSeed(this.getRawSeed());
          return codec_1.Codec.encode(nkeys_1.Prefix.Private, kp.secretKey);
        }
        sign(input) {
          if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
          }
          const kp = helper_1.getEd25519Helper().fromSeed(this.getRawSeed());
          return helper_1.getEd25519Helper().sign(input, kp.secretKey);
        }
        verify(input, sig) {
          if (!this.seed) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
          }
          const kp = helper_1.getEd25519Helper().fromSeed(this.getRawSeed());
          return helper_1.getEd25519Helper().verify(input, sig, kp.publicKey);
        }
        clear() {
          if (!this.seed) {
            return;
          }
          this.seed.fill(0);
          this.seed = void 0;
        }
      };
      exports.KP = KP;
    }
  });

  // ../../node_modules/nkeys.js/lib/public.js
  var require_public = __commonJS({
    "../../node_modules/nkeys.js/lib/public.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PublicKey = void 0;
      var codec_1 = require_codec();
      var nkeys_1 = require_nkeys();
      var helper_1 = require_helper();
      var PublicKey = class {
        constructor(publicKey) {
          this.publicKey = publicKey;
        }
        getPublicKey() {
          if (!this.publicKey) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
          }
          return new TextDecoder().decode(this.publicKey);
        }
        getPrivateKey() {
          if (!this.publicKey) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
          }
          throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.PublicKeyOnly);
        }
        getSeed() {
          if (!this.publicKey) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
          }
          throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.PublicKeyOnly);
        }
        sign(_) {
          if (!this.publicKey) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
          }
          throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.CannotSign);
        }
        verify(input, sig) {
          if (!this.publicKey) {
            throw new nkeys_1.NKeysError(nkeys_1.NKeysErrorCode.ClearedPair);
          }
          let buf = codec_1.Codec._decode(this.publicKey);
          return helper_1.getEd25519Helper().verify(input, sig, buf.slice(1));
        }
        clear() {
          if (!this.publicKey) {
            return;
          }
          this.publicKey.fill(0);
          this.publicKey = void 0;
        }
      };
      exports.PublicKey = PublicKey;
    }
  });

  // ../../node_modules/nkeys.js/lib/nkeys.js
  var require_nkeys = __commonJS({
    "../../node_modules/nkeys.js/lib/nkeys.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NKeysError = exports.NKeysErrorCode = exports.Prefixes = exports.Prefix = exports.fromSeed = exports.fromPublic = exports.createServer = exports.createCluster = exports.createUser = exports.createAccount = exports.createOperator = exports.createPair = void 0;
      var kp_1 = require_kp();
      var public_1 = require_public();
      var codec_1 = require_codec();
      var helper_1 = require_helper();
      function createPair(prefix) {
        const rawSeed = helper_1.getEd25519Helper().randomBytes(32);
        let str = codec_1.Codec.encodeSeed(prefix, new Uint8Array(rawSeed));
        return new kp_1.KP(str);
      }
      exports.createPair = createPair;
      function createOperator() {
        return createPair(Prefix.Operator);
      }
      exports.createOperator = createOperator;
      function createAccount() {
        return createPair(Prefix.Account);
      }
      exports.createAccount = createAccount;
      function createUser() {
        return createPair(Prefix.User);
      }
      exports.createUser = createUser;
      function createCluster() {
        return createPair(Prefix.Cluster);
      }
      exports.createCluster = createCluster;
      function createServer() {
        return createPair(Prefix.Server);
      }
      exports.createServer = createServer;
      function fromPublic(src) {
        const ba = new TextEncoder().encode(src);
        const raw = codec_1.Codec._decode(ba);
        const prefix = Prefixes.parsePrefix(raw[0]);
        if (Prefixes.isValidPublicPrefix(prefix)) {
          return new public_1.PublicKey(ba);
        }
        throw new NKeysError(NKeysErrorCode.InvalidPublicKey);
      }
      exports.fromPublic = fromPublic;
      function fromSeed(src) {
        codec_1.Codec.decodeSeed(src);
        return new kp_1.KP(src);
      }
      exports.fromSeed = fromSeed;
      var Prefix;
      (function(Prefix2) {
        Prefix2[Prefix2["Seed"] = 144] = "Seed";
        Prefix2[Prefix2["Private"] = 120] = "Private";
        Prefix2[Prefix2["Operator"] = 112] = "Operator";
        Prefix2[Prefix2["Server"] = 104] = "Server";
        Prefix2[Prefix2["Cluster"] = 16] = "Cluster";
        Prefix2[Prefix2["Account"] = 0] = "Account";
        Prefix2[Prefix2["User"] = 160] = "User";
      })(Prefix = exports.Prefix || (exports.Prefix = {}));
      var Prefixes = class {
        static isValidPublicPrefix(prefix) {
          return prefix == Prefix.Server || prefix == Prefix.Operator || prefix == Prefix.Cluster || prefix == Prefix.Account || prefix == Prefix.User;
        }
        static startsWithValidPrefix(s) {
          let c = s[0];
          return c == "S" || c == "P" || c == "O" || c == "N" || c == "C" || c == "A" || c == "U";
        }
        static isValidPrefix(prefix) {
          let v = this.parsePrefix(prefix);
          return v != -1;
        }
        static parsePrefix(v) {
          switch (v) {
            case Prefix.Seed:
              return Prefix.Seed;
            case Prefix.Private:
              return Prefix.Private;
            case Prefix.Operator:
              return Prefix.Operator;
            case Prefix.Server:
              return Prefix.Server;
            case Prefix.Cluster:
              return Prefix.Cluster;
            case Prefix.Account:
              return Prefix.Account;
            case Prefix.User:
              return Prefix.User;
            default:
              return -1;
          }
        }
      };
      exports.Prefixes = Prefixes;
      var NKeysErrorCode;
      (function(NKeysErrorCode2) {
        NKeysErrorCode2["InvalidPrefixByte"] = "nkeys: invalid prefix byte";
        NKeysErrorCode2["InvalidKey"] = "nkeys: invalid key";
        NKeysErrorCode2["InvalidPublicKey"] = "nkeys: invalid public key";
        NKeysErrorCode2["InvalidSeedLen"] = "nkeys: invalid seed length";
        NKeysErrorCode2["InvalidSeed"] = "nkeys: invalid seed";
        NKeysErrorCode2["InvalidEncoding"] = "nkeys: invalid encoded key";
        NKeysErrorCode2["InvalidSignature"] = "nkeys: signature verification failed";
        NKeysErrorCode2["CannotSign"] = "nkeys: cannot sign, no private key available";
        NKeysErrorCode2["PublicKeyOnly"] = "nkeys: no seed or private key available";
        NKeysErrorCode2["InvalidChecksum"] = "nkeys: invalid checksum";
        NKeysErrorCode2["SerializationError"] = "nkeys: serialization error";
        NKeysErrorCode2["ApiError"] = "nkeys: api error";
        NKeysErrorCode2["ClearedPair"] = "nkeys: pair is cleared";
      })(NKeysErrorCode = exports.NKeysErrorCode || (exports.NKeysErrorCode = {}));
      var NKeysError = class extends Error {
        constructor(code, chainedError) {
          super(code);
          this.name = "NKeysError";
          this.code = code;
          this.chainedError = chainedError;
        }
      };
      exports.NKeysError = NKeysError;
    }
  });

  // ../../node_modules/nkeys.js/lib/util.js
  var require_util3 = __commonJS({
    "../../node_modules/nkeys.js/lib/util.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.dump = exports.decode = exports.encode = void 0;
      function encode(bytes) {
        return btoa(String.fromCharCode(...bytes));
      }
      exports.encode = encode;
      function decode(b64str) {
        const bin = atob(b64str);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          bytes[i] = bin.charCodeAt(i);
        }
        return bytes;
      }
      exports.decode = decode;
      function dump(buf, msg) {
        if (msg) {
          console.log(msg);
        }
        let a = [];
        for (let i = 0; i < buf.byteLength; i++) {
          if (i % 8 === 0) {
            a.push("\n");
          }
          let v = buf[i].toString(16);
          if (v.length === 1) {
            v = "0" + v;
          }
          a.push(v);
        }
        console.log(a.join("  "));
      }
      exports.dump = dump;
    }
  });

  // ../../node_modules/nkeys.js/lib/mod.js
  var require_mod = __commonJS({
    "../../node_modules/nkeys.js/lib/mod.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.encode = exports.decode = exports.Prefix = exports.NKeysErrorCode = exports.NKeysError = exports.fromSeed = exports.fromPublic = exports.createUser = exports.createPair = exports.createOperator = exports.createAccount = void 0;
      var nkeys_1 = require_nkeys();
      Object.defineProperty(exports, "createAccount", { enumerable: true, get: function() {
        return nkeys_1.createAccount;
      } });
      Object.defineProperty(exports, "createOperator", { enumerable: true, get: function() {
        return nkeys_1.createOperator;
      } });
      Object.defineProperty(exports, "createPair", { enumerable: true, get: function() {
        return nkeys_1.createPair;
      } });
      Object.defineProperty(exports, "createUser", { enumerable: true, get: function() {
        return nkeys_1.createUser;
      } });
      Object.defineProperty(exports, "fromPublic", { enumerable: true, get: function() {
        return nkeys_1.fromPublic;
      } });
      Object.defineProperty(exports, "fromSeed", { enumerable: true, get: function() {
        return nkeys_1.fromSeed;
      } });
      Object.defineProperty(exports, "NKeysError", { enumerable: true, get: function() {
        return nkeys_1.NKeysError;
      } });
      Object.defineProperty(exports, "NKeysErrorCode", { enumerable: true, get: function() {
        return nkeys_1.NKeysErrorCode;
      } });
      Object.defineProperty(exports, "Prefix", { enumerable: true, get: function() {
        return nkeys_1.Prefix;
      } });
      var util_1 = require_util3();
      Object.defineProperty(exports, "decode", { enumerable: true, get: function() {
        return util_1.decode;
      } });
      Object.defineProperty(exports, "encode", { enumerable: true, get: function() {
        return util_1.encode;
      } });
    }
  });

  // ../../node_modules/nkeys.js/lib/index.js
  var require_lib = __commonJS({
    "../../node_modules/nkeys.js/lib/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var nacl = require_nacl_fast();
      var helper = {
        randomBytes: nacl.randomBytes,
        verify: nacl.sign.detached.verify,
        fromSeed: nacl.sign.keyPair.fromSeed,
        sign: nacl.sign.detached
      };
      if (typeof TextEncoder === "undefined") {
        const util = require_util2();
        global.TextEncoder = util.TextEncoder;
        global.TextDecoder = util.TextDecoder;
      }
      if (typeof atob === "undefined") {
        global.atob = (a) => {
          return Buffer.from(a, "base64").toString("binary");
        };
        global.btoa = (b) => {
          return Buffer.from(b, "binary").toString("base64");
        };
      }
      var { setEd25519Helper } = require_helper();
      setEd25519Helper(helper);
      __exportStar(require_mod(), exports);
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/nkeys.js
  var require_nkeys2 = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/nkeys.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.nkeys = void 0;
      exports.nkeys = require_lib();
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/mod.js
  var require_mod2 = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/mod.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.toJsMsg = exports.StringCodec = exports.StorageType = exports.RetentionPolicy = exports.ReplayPolicy = exports.nuid = exports.Nuid = exports.nkeyAuthenticator = exports.NatsError = exports.nanos = exports.millis = exports.Match = exports.jwtAuthenticator = exports.JSONCodec = exports.JsHeaders = exports.isHeartbeatMsg = exports.isFlowControlMsg = exports.headers = exports.Events = exports.ErrorCode = exports.Empty = exports.DiscardPolicy = exports.DeliverPolicy = exports.DebugEvents = exports.credsAuthenticator = exports.createInbox = exports.consumerOpts = exports.canonicalMIMEHeaderKey = exports.Bench = exports.AdvisoryKind = exports.AckPolicy = void 0;
      var internal_mod_1 = require_internal_mod();
      Object.defineProperty(exports, "AckPolicy", { enumerable: true, get: function() {
        return internal_mod_1.AckPolicy;
      } });
      Object.defineProperty(exports, "AdvisoryKind", { enumerable: true, get: function() {
        return internal_mod_1.AdvisoryKind;
      } });
      Object.defineProperty(exports, "Bench", { enumerable: true, get: function() {
        return internal_mod_1.Bench;
      } });
      Object.defineProperty(exports, "canonicalMIMEHeaderKey", { enumerable: true, get: function() {
        return internal_mod_1.canonicalMIMEHeaderKey;
      } });
      Object.defineProperty(exports, "consumerOpts", { enumerable: true, get: function() {
        return internal_mod_1.consumerOpts;
      } });
      Object.defineProperty(exports, "createInbox", { enumerable: true, get: function() {
        return internal_mod_1.createInbox;
      } });
      Object.defineProperty(exports, "credsAuthenticator", { enumerable: true, get: function() {
        return internal_mod_1.credsAuthenticator;
      } });
      Object.defineProperty(exports, "DebugEvents", { enumerable: true, get: function() {
        return internal_mod_1.DebugEvents;
      } });
      Object.defineProperty(exports, "DeliverPolicy", { enumerable: true, get: function() {
        return internal_mod_1.DeliverPolicy;
      } });
      Object.defineProperty(exports, "DiscardPolicy", { enumerable: true, get: function() {
        return internal_mod_1.DiscardPolicy;
      } });
      Object.defineProperty(exports, "Empty", { enumerable: true, get: function() {
        return internal_mod_1.Empty;
      } });
      Object.defineProperty(exports, "ErrorCode", { enumerable: true, get: function() {
        return internal_mod_1.ErrorCode;
      } });
      Object.defineProperty(exports, "Events", { enumerable: true, get: function() {
        return internal_mod_1.Events;
      } });
      Object.defineProperty(exports, "headers", { enumerable: true, get: function() {
        return internal_mod_1.headers;
      } });
      Object.defineProperty(exports, "isFlowControlMsg", { enumerable: true, get: function() {
        return internal_mod_1.isFlowControlMsg;
      } });
      Object.defineProperty(exports, "isHeartbeatMsg", { enumerable: true, get: function() {
        return internal_mod_1.isHeartbeatMsg;
      } });
      Object.defineProperty(exports, "JsHeaders", { enumerable: true, get: function() {
        return internal_mod_1.JsHeaders;
      } });
      Object.defineProperty(exports, "JSONCodec", { enumerable: true, get: function() {
        return internal_mod_1.JSONCodec;
      } });
      Object.defineProperty(exports, "jwtAuthenticator", { enumerable: true, get: function() {
        return internal_mod_1.jwtAuthenticator;
      } });
      Object.defineProperty(exports, "Match", { enumerable: true, get: function() {
        return internal_mod_1.Match;
      } });
      Object.defineProperty(exports, "millis", { enumerable: true, get: function() {
        return internal_mod_1.millis;
      } });
      Object.defineProperty(exports, "nanos", { enumerable: true, get: function() {
        return internal_mod_1.nanos;
      } });
      Object.defineProperty(exports, "NatsError", { enumerable: true, get: function() {
        return internal_mod_1.NatsError;
      } });
      Object.defineProperty(exports, "nkeyAuthenticator", { enumerable: true, get: function() {
        return internal_mod_1.nkeyAuthenticator;
      } });
      Object.defineProperty(exports, "Nuid", { enumerable: true, get: function() {
        return internal_mod_1.Nuid;
      } });
      Object.defineProperty(exports, "nuid", { enumerable: true, get: function() {
        return internal_mod_1.nuid;
      } });
      Object.defineProperty(exports, "ReplayPolicy", { enumerable: true, get: function() {
        return internal_mod_1.ReplayPolicy;
      } });
      Object.defineProperty(exports, "RetentionPolicy", { enumerable: true, get: function() {
        return internal_mod_1.RetentionPolicy;
      } });
      Object.defineProperty(exports, "StorageType", { enumerable: true, get: function() {
        return internal_mod_1.StorageType;
      } });
      Object.defineProperty(exports, "StringCodec", { enumerable: true, get: function() {
        return internal_mod_1.StringCodec;
      } });
      Object.defineProperty(exports, "toJsMsg", { enumerable: true, get: function() {
        return internal_mod_1.toJsMsg;
      } });
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/authenticator.js
  var require_authenticator = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/authenticator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.credsAuthenticator = exports.jwtAuthenticator = exports.nkeyAuthenticator = exports.noAuthFn = exports.buildAuthenticator = void 0;
      var nkeys_1 = require_nkeys2();
      var mod_1 = require_mod2();
      var encoders_1 = require_encoders();
      function buildAuthenticator(opts) {
        if (opts.authenticator) {
          return opts.authenticator;
        }
        if (opts.token) {
          return tokenFn(opts.token);
        }
        if (opts.user) {
          return passFn(opts.user, opts.pass);
        }
        return noAuthFn();
      }
      exports.buildAuthenticator = buildAuthenticator;
      function noAuthFn() {
        return () => {
          return;
        };
      }
      exports.noAuthFn = noAuthFn;
      function passFn(user, pass) {
        return () => {
          return { user, pass };
        };
      }
      function tokenFn(token) {
        return () => {
          return { auth_token: token };
        };
      }
      function nkeyAuthenticator(seed) {
        return (nonce) => {
          seed = typeof seed === "function" ? seed() : seed;
          const kp = seed ? nkeys_1.nkeys.fromSeed(seed) : void 0;
          const nkey = kp ? kp.getPublicKey() : "";
          const challenge = encoders_1.TE.encode(nonce || "");
          const sigBytes = kp !== void 0 && nonce ? kp.sign(challenge) : void 0;
          const sig = sigBytes ? nkeys_1.nkeys.encode(sigBytes) : "";
          return { nkey, sig };
        };
      }
      exports.nkeyAuthenticator = nkeyAuthenticator;
      function jwtAuthenticator(ajwt, seed) {
        return (nonce) => {
          const jwt = typeof ajwt === "function" ? ajwt() : ajwt;
          const fn = nkeyAuthenticator(seed);
          const { nkey, sig } = fn(nonce);
          return { jwt, nkey, sig };
        };
      }
      exports.jwtAuthenticator = jwtAuthenticator;
      function credsAuthenticator(creds) {
        const CREDS = /\s*(?:(?:[-]{3,}[^\n]*[-]{3,}\n)(.+)(?:\n\s*[-]{3,}[^\n]*[-]{3,}\n))/ig;
        const s = encoders_1.TD.decode(creds);
        let m = CREDS.exec(s);
        if (!m) {
          throw mod_1.NatsError.errorForCode(mod_1.ErrorCode.BadCreds);
        }
        const jwt = m[1].trim();
        m = CREDS.exec(s);
        if (!m) {
          throw mod_1.NatsError.errorForCode(mod_1.ErrorCode.BadCreds);
        }
        const seed = encoders_1.TE.encode(m[1].trim());
        return jwtAuthenticator(jwt, seed);
      }
      exports.credsAuthenticator = credsAuthenticator;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/options.js
  var require_options = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/options.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.checkUnsupportedOption = exports.checkOptions = exports.parseOptions = exports.defaultOptions = void 0;
      var util_1 = require_util();
      var error_1 = require_error();
      var types_1 = require_types();
      var authenticator_1 = require_authenticator();
      var transport_1 = require_transport();
      var mod_1 = require_mod2();
      function defaultOptions() {
        return {
          maxPingOut: types_1.DEFAULT_MAX_PING_OUT,
          maxReconnectAttempts: types_1.DEFAULT_MAX_RECONNECT_ATTEMPTS,
          noRandomize: false,
          pedantic: false,
          pingInterval: types_1.DEFAULT_PING_INTERVAL,
          reconnect: true,
          reconnectJitter: types_1.DEFAULT_JITTER,
          reconnectJitterTLS: types_1.DEFAULT_JITTER_TLS,
          reconnectTimeWait: types_1.DEFAULT_RECONNECT_TIME_WAIT,
          tls: void 0,
          verbose: false,
          waitOnFirstConnect: false
        };
      }
      exports.defaultOptions = defaultOptions;
      function parseOptions(opts) {
        const dhp = `${types_1.DEFAULT_HOST}:${transport_1.defaultPort()}`;
        opts = opts || { servers: [dhp] };
        if (opts.port) {
          opts.servers = [`${types_1.DEFAULT_HOST}:${opts.port}`];
        }
        if (typeof opts.servers === "string") {
          opts.servers = [opts.servers];
        }
        if (opts.servers && opts.servers.length === 0) {
          opts.servers = [dhp];
        }
        const options = util_1.extend(defaultOptions(), opts);
        if (opts.user && opts.token) {
          throw error_1.NatsError.errorForCode(error_1.ErrorCode.BadAuthentication);
        }
        if (opts.authenticator && (opts.token || opts.user || opts.pass)) {
          throw error_1.NatsError.errorForCode(error_1.ErrorCode.BadAuthentication);
        }
        options.authenticator = authenticator_1.buildAuthenticator(options);
        ["reconnectDelayHandler", "authenticator"].forEach((n) => {
          if (options[n] && typeof options[n] !== "function") {
            throw new error_1.NatsError(`${n} option should be a function`, error_1.ErrorCode.NotFunction);
          }
        });
        if (!options.reconnectDelayHandler) {
          options.reconnectDelayHandler = () => {
            let extra = options.tls ? options.reconnectJitterTLS : options.reconnectJitter;
            if (extra) {
              extra++;
              extra = Math.floor(Math.random() * extra);
            }
            return options.reconnectTimeWait + extra;
          };
        }
        if (options.inboxPrefix) {
          try {
            mod_1.createInbox(options.inboxPrefix);
          } catch (err) {
            throw new error_1.NatsError(err.message, error_1.ErrorCode.ApiError);
          }
        }
        return options;
      }
      exports.parseOptions = parseOptions;
      function checkOptions(info, options) {
        const { proto, tls_required: tlsRequired } = info;
        if ((proto === void 0 || proto < 1) && options.noEcho) {
          throw new error_1.NatsError("noEcho", error_1.ErrorCode.ServerOptionNotAvailable);
        }
        if (options.tls && !tlsRequired) {
          throw new error_1.NatsError("tls", error_1.ErrorCode.ServerOptionNotAvailable);
        }
      }
      exports.checkOptions = checkOptions;
      function checkUnsupportedOption(prop, v) {
        if (v) {
          throw new error_1.NatsError(prop, error_1.ErrorCode.InvalidOption);
        }
      }
      exports.checkUnsupportedOption = checkUnsupportedOption;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/request.js
  var require_request = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/request.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Request = void 0;
      var util_1 = require_util();
      var error_1 = require_error();
      var nuid_1 = require_nuid();
      var Request = class {
        constructor(mux, opts = { timeout: 1e3 }) {
          this.mux = mux;
          this.received = 0;
          this.deferred = util_1.deferred();
          this.token = nuid_1.nuid.next();
          util_1.extend(this, opts);
          this.timer = util_1.timeout(opts.timeout);
        }
        resolver(err, msg) {
          if (this.timer) {
            this.timer.cancel();
          }
          if (err) {
            this.deferred.reject(err);
          } else {
            this.deferred.resolve(msg);
          }
          this.cancel();
        }
        cancel(err) {
          if (this.timer) {
            this.timer.cancel();
          }
          this.mux.cancel(this);
          this.deferred.reject(err ? err : error_1.NatsError.errorForCode(error_1.ErrorCode.Cancelled));
        }
      };
      exports.Request = Request;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/codec.js
  var require_codec2 = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/codec.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.JSONCodec = exports.StringCodec = void 0;
      var error_1 = require_error();
      var encoders_1 = require_encoders();
      function StringCodec() {
        return {
          encode(d) {
            return encoders_1.TE.encode(d);
          },
          decode(a) {
            return encoders_1.TD.decode(a);
          }
        };
      }
      exports.StringCodec = StringCodec;
      function JSONCodec() {
        return {
          encode(d) {
            try {
              if (d === void 0) {
                d = null;
              }
              return encoders_1.TE.encode(JSON.stringify(d));
            } catch (err) {
              throw error_1.NatsError.errorForCode(error_1.ErrorCode.BadJson, err);
            }
          },
          decode(a) {
            try {
              return JSON.parse(encoders_1.TD.decode(a));
            } catch (err) {
              throw error_1.NatsError.errorForCode(error_1.ErrorCode.BadJson, err);
            }
          }
        };
      }
      exports.JSONCodec = JSONCodec;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/jsutil.js
  var require_jsutil = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/jsutil.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.checkJsErrorCode = exports.checkJsError = exports.isHeartbeatMsg = exports.isFlowControlMsg = exports.millis = exports.nanos = exports.defaultConsumer = exports.validateName = exports.validateStreamName = exports.validateDurableName = void 0;
      var types_1 = require_types();
      var error_1 = require_error();
      function validateDurableName(name) {
        return validateName("durable", name);
      }
      exports.validateDurableName = validateDurableName;
      function validateStreamName(name) {
        return validateName("stream", name);
      }
      exports.validateStreamName = validateStreamName;
      function validateName(context, name = "") {
        if (name === "") {
          throw Error(`${context} name required`);
        }
        const bad = [".", "*", ">"];
        bad.forEach((v) => {
          if (name.indexOf(v) !== -1) {
            throw Error(`invalid ${context} name - ${context} name cannot contain '${v}'`);
          }
        });
      }
      exports.validateName = validateName;
      function defaultConsumer(name, opts = {}) {
        return Object.assign({
          name,
          deliver_policy: types_1.DeliverPolicy.All,
          ack_policy: types_1.AckPolicy.Explicit,
          ack_wait: nanos(30 * 1e3),
          replay_policy: types_1.ReplayPolicy.Instant
        }, opts);
      }
      exports.defaultConsumer = defaultConsumer;
      function nanos(millis2) {
        return millis2 * 1e6;
      }
      exports.nanos = nanos;
      function millis(ns) {
        return ns / 1e6;
      }
      exports.millis = millis;
      function isFlowControlMsg(msg) {
        const h = msg.headers;
        if (!h) {
          return false;
        }
        return h.code >= 100 && h.code < 200;
      }
      exports.isFlowControlMsg = isFlowControlMsg;
      function isHeartbeatMsg(msg) {
        var _a;
        return isFlowControlMsg(msg) && ((_a = msg.headers) === null || _a === void 0 ? void 0 : _a.description) === "Idle Heartbeat";
      }
      exports.isHeartbeatMsg = isHeartbeatMsg;
      function checkJsError(msg) {
        const h = msg.headers;
        if (!h) {
          return null;
        }
        return checkJsErrorCode(h.code, h.status);
      }
      exports.checkJsError = checkJsError;
      function checkJsErrorCode(code, description = "") {
        if (code < 300) {
          return null;
        }
        description = description.toLowerCase();
        switch (code) {
          case 503:
            return error_1.NatsError.errorForCode(error_1.ErrorCode.JetStreamNotEnabled, new Error(description));
          default:
            if (description === "") {
              description = error_1.ErrorCode.Unknown;
            }
            return new error_1.NatsError(description, `${code}`);
        }
      }
      exports.checkJsErrorCode = checkJsErrorCode;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/jsbaseclient_api.js
  var require_jsbaseclient_api = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/jsbaseclient_api.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BaseApiClient = exports.defaultJsOptions = void 0;
      var types_1 = require_types();
      var codec_1 = require_codec2();
      var util_1 = require_util();
      var jsutil_1 = require_jsutil();
      var defaultPrefix = "$JS.API";
      var defaultTimeout = 5e3;
      function defaultJsOptions(opts) {
        opts = opts || {};
        if (opts.domain) {
          opts.apiPrefix = `$JS.${opts.domain}.API`;
          delete opts.domain;
        }
        return util_1.extend({ apiPrefix: defaultPrefix, timeout: defaultTimeout }, opts);
      }
      exports.defaultJsOptions = defaultJsOptions;
      var BaseApiClient = class {
        constructor(nc, opts) {
          this.nc = nc;
          this.opts = defaultJsOptions(opts);
          this._parseOpts();
          this.prefix = this.opts.apiPrefix;
          this.timeout = this.opts.timeout;
          this.jc = codec_1.JSONCodec();
        }
        _parseOpts() {
          let prefix = this.opts.apiPrefix;
          if (!prefix || prefix.length === 0) {
            throw new Error("invalid empty prefix");
          }
          const c = prefix[prefix.length - 1];
          if (c === ".") {
            prefix = prefix.substr(0, prefix.length - 1);
          }
          this.opts.apiPrefix = prefix;
        }
        _request(subj, data = null, opts) {
          return __awaiter(this, void 0, void 0, function* () {
            opts = opts || {};
            opts.timeout = this.timeout;
            let a = types_1.Empty;
            if (data) {
              a = this.jc.encode(data);
            }
            const m = yield this.nc.request(subj, a, opts);
            return this.parseJsResponse(m);
          });
        }
        findStream(subject) {
          return __awaiter(this, void 0, void 0, function* () {
            const q = { subject };
            const r = yield this._request(`${this.prefix}.STREAM.NAMES`, q);
            const names = r;
            if (!names.streams || names.streams.length !== 1) {
              throw new Error("no stream matches subject");
            }
            return names.streams[0];
          });
        }
        parseJsResponse(m) {
          const v = this.jc.decode(m.data);
          const r = v;
          if (r.error) {
            const err = jsutil_1.checkJsErrorCode(r.error.code, r.error.description);
            if (err !== null) {
              throw err;
            }
          }
          return v;
        }
      };
      exports.BaseApiClient = BaseApiClient;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/jslister.js
  var require_jslister = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/jslister.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __await = exports && exports.__await || function(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
      };
      var __asyncGenerator = exports && exports.__asyncGenerator || function(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i;
        function verb(n) {
          if (g[n])
            i[n] = function(v) {
              return new Promise(function(a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
              });
            };
        }
        function resume(n, v) {
          try {
            step(g[n](v));
          } catch (e) {
            settle(q[0][3], e);
          }
        }
        function step(r) {
          r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
        }
        function fulfill(value) {
          resume("next", value);
        }
        function reject(value) {
          resume("throw", value);
        }
        function settle(f, v) {
          if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]);
        }
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ListerImpl = void 0;
      var ListerImpl = class {
        constructor(subject, filter, jsm) {
          if (!subject) {
            throw new Error("subject is required");
          }
          this.subject = subject;
          this.jsm = jsm;
          this.offset = 0;
          this.pageInfo = {};
          this.filter = filter;
        }
        next() {
          return __awaiter(this, void 0, void 0, function* () {
            if (this.err) {
              return [];
            }
            if (this.pageInfo && this.offset >= this.pageInfo.total) {
              return [];
            }
            const offset = { offset: this.offset };
            try {
              const r = yield this.jsm._request(this.subject, offset, { timeout: this.jsm.timeout });
              this.pageInfo = r;
              const a = this.filter(r);
              this.offset += a.length;
              return a;
            } catch (err) {
              this.err = err;
              throw err;
            }
          });
        }
        [Symbol.asyncIterator]() {
          return __asyncGenerator(this, arguments, function* _a() {
            let page = yield __await(this.next());
            while (page.length > 0) {
              for (const item of page) {
                yield yield __await(item);
              }
              page = yield __await(this.next());
            }
          });
        }
      };
      exports.ListerImpl = ListerImpl;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/jsstream_api.js
  var require_jsstream_api = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/jsstream_api.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StoredMsgImpl = exports.StreamAPIImpl = void 0;
      var types_1 = require_types();
      var jsbaseclient_api_1 = require_jsbaseclient_api();
      var jslister_1 = require_jslister();
      var jsutil_1 = require_jsutil();
      var headers_1 = require_headers();
      var StreamAPIImpl = class extends jsbaseclient_api_1.BaseApiClient {
        constructor(nc, opts) {
          super(nc, opts);
        }
        add(cfg = {}) {
          return __awaiter(this, void 0, void 0, function* () {
            jsutil_1.validateStreamName(cfg.name);
            const r = yield this._request(`${this.prefix}.STREAM.CREATE.${cfg.name}`, cfg);
            return r;
          });
        }
        delete(stream) {
          return __awaiter(this, void 0, void 0, function* () {
            jsutil_1.validateStreamName(stream);
            const r = yield this._request(`${this.prefix}.STREAM.DELETE.${stream}`);
            const cr = r;
            return cr.success;
          });
        }
        update(cfg = {}) {
          return __awaiter(this, void 0, void 0, function* () {
            jsutil_1.validateStreamName(cfg.name);
            const r = yield this._request(`${this.prefix}.STREAM.UPDATE.${cfg.name}`, cfg);
            return r;
          });
        }
        info(name, data) {
          return __awaiter(this, void 0, void 0, function* () {
            jsutil_1.validateStreamName(name);
            const r = yield this._request(`${this.prefix}.STREAM.INFO.${name}`, data);
            return r;
          });
        }
        list() {
          const filter = (v) => {
            const slr = v;
            return slr.streams;
          };
          const subj = `${this.prefix}.STREAM.LIST`;
          return new jslister_1.ListerImpl(subj, filter, this);
        }
        purge(name, opts) {
          return __awaiter(this, void 0, void 0, function* () {
            if (opts) {
              const { keep, seq } = opts;
              if (typeof keep === "number" && typeof seq === "number") {
                throw new Error("can specify one of keep or seq");
              }
            }
            jsutil_1.validateStreamName(name);
            const v = yield this._request(`${this.prefix}.STREAM.PURGE.${name}`, opts);
            return v;
          });
        }
        deleteMessage(stream, seq, erase = true) {
          return __awaiter(this, void 0, void 0, function* () {
            jsutil_1.validateStreamName(stream);
            const dr = { seq };
            if (!erase) {
              dr.no_erase = true;
            }
            const r = yield this._request(`${this.prefix}.STREAM.MSG.DELETE.${stream}`, dr);
            const cr = r;
            return cr.success;
          });
        }
        getMessage(stream, query) {
          return __awaiter(this, void 0, void 0, function* () {
            if (typeof query === "number") {
              console.log(`\x1B[33m [WARN] jsm.getMessage(number) is deprecated and will be removed on release - use \`{seq: number}\` as an argument \x1B[0m`);
              query = { seq: query };
            }
            jsutil_1.validateStreamName(stream);
            const r = yield this._request(`${this.prefix}.STREAM.MSG.GET.${stream}`, query);
            const sm = r;
            return new StoredMsgImpl(sm);
          });
        }
        find(subject) {
          return this.findStream(subject);
        }
      };
      exports.StreamAPIImpl = StreamAPIImpl;
      var StoredMsgImpl = class {
        constructor(smr) {
          this.subject = smr.message.subject;
          this.seq = smr.message.seq;
          this.time = new Date(smr.message.time);
          this.data = smr.message.data ? this._parse(smr.message.data) : types_1.Empty;
          if (smr.message.hdrs) {
            const hd = this._parse(smr.message.hdrs);
            this.header = headers_1.MsgHdrsImpl.decode(hd);
          } else {
            this.header = headers_1.headers();
          }
        }
        _parse(s) {
          const bs = atob(s);
          const len = bs.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = bs.charCodeAt(i);
          }
          return bytes;
        }
      };
      exports.StoredMsgImpl = StoredMsgImpl;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/jsconsumer_api.js
  var require_jsconsumer_api = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/jsconsumer_api.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ConsumerAPIImpl = void 0;
      var jsbaseclient_api_1 = require_jsbaseclient_api();
      var jslister_1 = require_jslister();
      var jsutil_1 = require_jsutil();
      var ConsumerAPIImpl = class extends jsbaseclient_api_1.BaseApiClient {
        constructor(nc, opts) {
          super(nc, opts);
        }
        add(stream, cfg) {
          return __awaiter(this, void 0, void 0, function* () {
            jsutil_1.validateStreamName(stream);
            const cr = {};
            cr.config = cfg;
            cr.stream_name = stream;
            if (cr.config.durable_name) {
              jsutil_1.validateDurableName(cr.config.durable_name);
            }
            const subj = cfg.durable_name ? `${this.prefix}.CONSUMER.DURABLE.CREATE.${stream}.${cfg.durable_name}` : `${this.prefix}.CONSUMER.CREATE.${stream}`;
            const r = yield this._request(subj, cr);
            return r;
          });
        }
        info(stream, name) {
          return __awaiter(this, void 0, void 0, function* () {
            jsutil_1.validateStreamName(stream);
            jsutil_1.validateDurableName(name);
            const r = yield this._request(`${this.prefix}.CONSUMER.INFO.${stream}.${name}`);
            return r;
          });
        }
        delete(stream, name) {
          return __awaiter(this, void 0, void 0, function* () {
            jsutil_1.validateStreamName(stream);
            jsutil_1.validateDurableName(name);
            const r = yield this._request(`${this.prefix}.CONSUMER.DELETE.${stream}.${name}`);
            const cr = r;
            return cr.success;
          });
        }
        list(stream) {
          jsutil_1.validateStreamName(stream);
          const filter = (v) => {
            const clr = v;
            return clr.consumers;
          };
          const subj = `${this.prefix}.CONSUMER.LIST.${stream}`;
          return new jslister_1.ListerImpl(subj, filter, this);
        }
      };
      exports.ConsumerAPIImpl = ConsumerAPIImpl;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/jsm.js
  var require_jsm = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/jsm.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.JetStreamManagerImpl = void 0;
      var jsbaseclient_api_1 = require_jsbaseclient_api();
      var jsstream_api_1 = require_jsstream_api();
      var jsconsumer_api_1 = require_jsconsumer_api();
      var queued_iterator_1 = require_queued_iterator();
      var JetStreamManagerImpl = class extends jsbaseclient_api_1.BaseApiClient {
        constructor(nc, opts) {
          super(nc, opts);
          this.streams = new jsstream_api_1.StreamAPIImpl(nc, opts);
          this.consumers = new jsconsumer_api_1.ConsumerAPIImpl(nc, opts);
        }
        getAccountInfo() {
          return __awaiter(this, void 0, void 0, function* () {
            const r = yield this._request(`${this.prefix}.INFO`);
            return r;
          });
        }
        advisories() {
          const iter = new queued_iterator_1.QueuedIteratorImpl();
          this.nc.subscribe(`$JS.EVENT.ADVISORY.>`, {
            callback: (err, msg) => {
              if (err) {
                throw err;
              }
              try {
                const d = this.parseJsResponse(msg);
                const chunks = d.type.split(".");
                const kind = chunks[chunks.length - 1];
                iter.push({ kind, data: d });
              } catch (err2) {
                iter.stop(err2);
              }
            }
          });
          return iter;
        }
      };
      exports.JetStreamManagerImpl = JetStreamManagerImpl;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/jsmsg.js
  var require_jsmsg = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/jsmsg.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parseInfo = exports.toJsMsg = exports.ACK = void 0;
      var databuffer_1 = require_databuffer();
      var codec_1 = require_codec2();
      var request_1 = require_request();
      exports.ACK = Uint8Array.of(43, 65, 67, 75);
      var NAK = Uint8Array.of(45, 78, 65, 75);
      var WPI = Uint8Array.of(43, 87, 80, 73);
      var NXT = Uint8Array.of(43, 78, 88, 84);
      var TERM = Uint8Array.of(43, 84, 69, 82, 77);
      var SPACE = Uint8Array.of(32);
      function toJsMsg(m) {
        return new JsMsgImpl(m);
      }
      exports.toJsMsg = toJsMsg;
      function parseInfo(s) {
        const tokens = s.split(".");
        if (tokens.length !== 9 && tokens[0] !== "$JS" && tokens[1] !== "ACK") {
          throw new Error(`not js message`);
        }
        const di = {};
        di.stream = tokens[2];
        di.consumer = tokens[3];
        di.redeliveryCount = parseInt(tokens[4], 10);
        di.streamSequence = parseInt(tokens[5], 10);
        di.deliverySequence = parseInt(tokens[6], 10);
        di.timestampNanos = parseInt(tokens[7], 10);
        di.pending = parseInt(tokens[8], 10);
        return di;
      }
      exports.parseInfo = parseInfo;
      var JsMsgImpl = class {
        constructor(msg) {
          this.msg = msg;
          this.didAck = false;
        }
        get subject() {
          return this.msg.subject;
        }
        get sid() {
          return this.msg.sid;
        }
        get data() {
          return this.msg.data;
        }
        get headers() {
          return this.msg.headers;
        }
        get info() {
          if (!this.di) {
            this.di = parseInfo(this.reply);
          }
          return this.di;
        }
        get redelivered() {
          return this.info.redeliveryCount > 1;
        }
        get reply() {
          return this.msg.reply || "";
        }
        get seq() {
          return this.info.streamSequence;
        }
        doAck(payload) {
          if (!this.didAck) {
            this.didAck = !this.isWIP(payload);
            this.msg.respond(payload);
          }
        }
        isWIP(p) {
          return p.length === 4 && p[0] === WPI[0] && p[1] === WPI[1] && p[2] === WPI[2] && p[3] === WPI[3];
        }
        ackAck() {
          return __awaiter(this, void 0, void 0, function* () {
            if (!this.didAck) {
              this.didAck = true;
              if (this.msg.reply) {
                const mi = this.msg;
                const proto = mi.publisher;
                const r = new request_1.Request(proto.muxSubscriptions);
                proto.request(r);
                try {
                  proto.publish(this.msg.reply, exports.ACK, {
                    reply: `${proto.muxSubscriptions.baseInbox}${r.token}`
                  });
                } catch (err) {
                  r.cancel(err);
                }
                try {
                  yield Promise.race([r.timer, r.deferred]);
                  return true;
                } catch (err) {
                  r.cancel(err);
                }
              }
            }
            return false;
          });
        }
        ack() {
          this.doAck(exports.ACK);
        }
        nak() {
          this.doAck(NAK);
        }
        working() {
          this.doAck(WPI);
        }
        next(subj, ro) {
          let payload = NXT;
          if (ro) {
            const data = codec_1.JSONCodec().encode(ro);
            payload = databuffer_1.DataBuffer.concat(NXT, SPACE, data);
          }
          const opts = subj ? { reply: subj } : void 0;
          this.msg.respond(payload, opts);
        }
        term() {
          this.doAck(TERM);
        }
      };
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/typedsub.js
  var require_typedsub = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/typedsub.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TypedSubscription = exports.checkFn = void 0;
      var util_1 = require_util();
      var queued_iterator_1 = require_queued_iterator();
      var error_1 = require_error();
      function checkFn(fn, name, required = false) {
        if (required === true && !fn) {
          throw error_1.NatsError.errorForCode(error_1.ErrorCode.ApiError, new Error(`${name} is not a function`));
        }
        if (fn && typeof fn !== "function") {
          throw error_1.NatsError.errorForCode(error_1.ErrorCode.ApiError, new Error(`${name} is not a function`));
        }
      }
      exports.checkFn = checkFn;
      var TypedSubscription = class extends queued_iterator_1.QueuedIteratorImpl {
        constructor(nc, subject, opts) {
          super();
          checkFn(opts.adapter, "adapter", true);
          this.adapter = opts.adapter;
          if (opts.callback) {
            checkFn(opts.callback, "callback");
          }
          this.noIterator = typeof opts.callback === "function";
          if (opts.dispatchedFn) {
            checkFn(opts.dispatchedFn, "dispatchedFn");
            this.dispatchedFn = opts.dispatchedFn;
          }
          if (opts.cleanupFn) {
            checkFn(opts.cleanupFn, "cleanupFn");
          }
          let callback = (err, msg) => {
            this.callback(err, msg);
          };
          if (opts.callback) {
            const uh = opts.callback;
            callback = (err, msg) => {
              const [jer, tm] = this.adapter(err, msg);
              uh(jer, tm);
              if (this.dispatchedFn && tm) {
                this.dispatchedFn(tm);
              }
            };
          }
          const { max, queue, timeout } = opts;
          const sopts = { queue, timeout, callback };
          if (max && max > 0) {
            sopts.max = max;
          }
          this.sub = nc.subscribe(subject, sopts);
          if (opts.cleanupFn) {
            this.sub.cleanupFn = opts.cleanupFn;
          }
          this.subIterDone = util_1.deferred();
          Promise.all([this.sub.closed, this.iterClosed]).then(() => {
            this.subIterDone.resolve();
          }).catch(() => {
            this.subIterDone.resolve();
          });
          ((s) => __awaiter(this, void 0, void 0, function* () {
            yield s.closed;
            this.stop();
          }))(this.sub).then().catch();
        }
        unsubscribe(max) {
          this.sub.unsubscribe(max);
        }
        drain() {
          return this.sub.drain();
        }
        isDraining() {
          return this.sub.isDraining();
        }
        isClosed() {
          return this.sub.isClosed();
        }
        callback(e, msg) {
          this.sub.cancelTimeout();
          const [err, tm] = this.adapter(e, msg);
          if (err) {
            this.stop(err);
          }
          if (tm) {
            this.push(tm);
          }
        }
        getSubject() {
          return this.sub.getSubject();
        }
        getReceived() {
          return this.sub.getReceived();
        }
        getProcessed() {
          return this.sub.getProcessed();
        }
        getPending() {
          return this.sub.getPending();
        }
        getID() {
          return this.sub.getID();
        }
        getMax() {
          return this.sub.getMax();
        }
        get closed() {
          return this.sub.closed;
        }
      };
      exports.TypedSubscription = TypedSubscription;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/jsconsumeropts.js
  var require_jsconsumeropts = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/jsconsumeropts.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isConsumerOptsBuilder = exports.ConsumerOptsBuilderImpl = exports.consumerOpts = void 0;
      var types_1 = require_types();
      var jsutil_1 = require_jsutil();
      function consumerOpts(opts) {
        return new ConsumerOptsBuilderImpl(opts);
      }
      exports.consumerOpts = consumerOpts;
      var ConsumerOptsBuilderImpl = class {
        constructor(opts) {
          this.stream = "";
          this.mack = false;
          this.config = jsutil_1.defaultConsumer("", opts || {});
          this.config.ack_policy = types_1.AckPolicy.All;
        }
        getOpts() {
          const o = {};
          o.config = this.config;
          o.mack = this.mack;
          o.stream = this.stream;
          o.callbackFn = this.callbackFn;
          o.max = this.max;
          o.queue = this.qname;
          return o;
        }
        deliverTo(subject) {
          this.config.deliver_subject = subject;
        }
        manualAck() {
          this.mack = true;
        }
        durable(name) {
          jsutil_1.validateDurableName(name);
          this.config.durable_name = name;
        }
        deliverAll() {
          this.config.deliver_policy = types_1.DeliverPolicy.All;
        }
        deliverLast() {
          this.config.deliver_policy = types_1.DeliverPolicy.Last;
        }
        deliverNew() {
          this.config.deliver_policy = types_1.DeliverPolicy.New;
        }
        startSequence(seq) {
          if (seq <= 0) {
            throw new Error("sequence must be greater than 0");
          }
          this.config.deliver_policy = types_1.DeliverPolicy.StartSequence;
          this.config.opt_start_seq = seq;
        }
        startTime(time) {
          this.config.deliver_policy = types_1.DeliverPolicy.StartTime;
          this.config.opt_start_time = time.toISOString();
        }
        ackNone() {
          this.config.ack_policy = types_1.AckPolicy.None;
        }
        ackAll() {
          this.config.ack_policy = types_1.AckPolicy.All;
        }
        ackExplicit() {
          this.config.ack_policy = types_1.AckPolicy.Explicit;
        }
        maxDeliver(max) {
          this.config.max_deliver = max;
        }
        maxAckPending(max) {
          this.config.max_ack_pending = max;
        }
        maxWaiting(max) {
          this.config.max_waiting = max;
        }
        maxMessages(max) {
          this.max = max;
        }
        callback(fn) {
          this.callbackFn = fn;
        }
        queue(n) {
          this.qname = n;
        }
        idleHeartbeat(millis) {
          this.config.idle_heartbeat = jsutil_1.nanos(millis);
        }
        flowControl() {
          this.config.flow_control = true;
        }
      };
      exports.ConsumerOptsBuilderImpl = ConsumerOptsBuilderImpl;
      function isConsumerOptsBuilder(o) {
        return typeof o.getOpts === "function";
      }
      exports.isConsumerOptsBuilder = isConsumerOptsBuilder;
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/jsclient.js
  var require_jsclient = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/jsclient.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.JetStreamClientImpl = void 0;
      var types_1 = require_types();
      var jsbaseclient_api_1 = require_jsbaseclient_api();
      var jsutil_1 = require_jsutil();
      var jsconsumer_api_1 = require_jsconsumer_api();
      var jsmsg_1 = require_jsmsg();
      var typedsub_1 = require_typedsub();
      var error_1 = require_error();
      var queued_iterator_1 = require_queued_iterator();
      var util_1 = require_util();
      var protocol_1 = require_protocol();
      var headers_1 = require_headers();
      var jsconsumeropts_1 = require_jsconsumeropts();
      var PubHeaders;
      (function(PubHeaders2) {
        PubHeaders2["MsgIdHdr"] = "Nats-Msg-Id";
        PubHeaders2["ExpectedStreamHdr"] = "Nats-Expected-Stream";
        PubHeaders2["ExpectedLastSeqHdr"] = "Nats-Expected-Last-Sequence";
        PubHeaders2["ExpectedLastMsgIdHdr"] = "Nats-Expected-Last-Msg-Id";
        PubHeaders2["ExpectedLastSubjectSequenceHdr"] = "Nats-Expected-Last-Subject-Sequence";
      })(PubHeaders || (PubHeaders = {}));
      var JetStreamClientImpl = class extends jsbaseclient_api_1.BaseApiClient {
        constructor(nc, opts) {
          super(nc, opts);
          this.api = new jsconsumer_api_1.ConsumerAPIImpl(nc, opts);
        }
        publish(subj, data = types_1.Empty, opts) {
          return __awaiter(this, void 0, void 0, function* () {
            opts = opts || {};
            opts.expect = opts.expect || {};
            const mh = (opts === null || opts === void 0 ? void 0 : opts.headers) || headers_1.headers();
            if (opts) {
              if (opts.msgID) {
                mh.set(PubHeaders.MsgIdHdr, opts.msgID);
              }
              if (opts.expect.lastMsgID) {
                mh.set(PubHeaders.ExpectedLastMsgIdHdr, opts.expect.lastMsgID);
              }
              if (opts.expect.streamName) {
                mh.set(PubHeaders.ExpectedStreamHdr, opts.expect.streamName);
              }
              if (opts.expect.lastSequence) {
                mh.set(PubHeaders.ExpectedLastSeqHdr, `${opts.expect.lastSequence}`);
              }
              if (opts.expect.lastSubjectSequence) {
                mh.set(PubHeaders.ExpectedLastSubjectSequenceHdr, `${opts.expect.lastSubjectSequence}`);
              }
            }
            const to = opts.timeout || this.timeout;
            const ro = {};
            if (to) {
              ro.timeout = to;
            }
            if (opts) {
              ro.headers = mh;
            }
            const r = yield this.nc.request(subj, data, ro);
            const pa = this.parseJsResponse(r);
            if (pa.stream === "") {
              throw error_1.NatsError.errorForCode(error_1.ErrorCode.JetStreamInvalidAck);
            }
            pa.duplicate = pa.duplicate ? pa.duplicate : false;
            return pa;
          });
        }
        pull(stream, durable) {
          return __awaiter(this, void 0, void 0, function* () {
            jsutil_1.validateStreamName(stream);
            jsutil_1.validateDurableName(durable);
            const msg = yield this.nc.request(
              `${this.prefix}.CONSUMER.MSG.NEXT.${stream}.${durable}`,
              this.jc.encode({ no_wait: true, batch: 1, expires: jsutil_1.nanos(this.timeout) }),
              { noMux: true, timeout: this.timeout }
            );
            const err = jsutil_1.checkJsError(msg);
            if (err) {
              throw err;
            }
            return jsmsg_1.toJsMsg(msg);
          });
        }
        fetch(stream, durable, opts = {}) {
          jsutil_1.validateStreamName(stream);
          jsutil_1.validateDurableName(durable);
          let timer = null;
          const args = {};
          args.batch = opts.batch || 1;
          args.no_wait = opts.no_wait || false;
          const expires = opts.expires || 0;
          if (expires) {
            args.expires = jsutil_1.nanos(expires);
          }
          if (expires === 0 && args.no_wait === false) {
            throw new Error("expires or no_wait is required");
          }
          const qi = new queued_iterator_1.QueuedIteratorImpl();
          const wants = args.batch;
          let received = 0;
          qi.dispatchedFn = (m) => {
            if (m) {
              received++;
              if (timer && m.info.pending === 0) {
                return;
              }
              if (qi.getPending() === 1 && m.info.pending === 0 || wants === received) {
                qi.stop();
              }
            }
          };
          const inbox = protocol_1.createInbox(this.nc.options.inboxPrefix);
          const sub = this.nc.subscribe(inbox, {
            max: opts.batch,
            callback: (err, msg) => {
              if (err === null) {
                err = jsutil_1.checkJsError(msg);
              }
              if (err !== null) {
                if (timer) {
                  timer.cancel();
                  timer = null;
                }
                if (error_1.isNatsError(err) && err.code === error_1.ErrorCode.JetStream404NoMessages) {
                  qi.stop();
                } else {
                  qi.stop(err);
                }
              } else {
                qi.received++;
                qi.push(jsmsg_1.toJsMsg(msg));
              }
            }
          });
          if (expires) {
            timer = util_1.timeout(expires);
            timer.catch(() => {
              if (!sub.isClosed()) {
                sub.drain();
                timer = null;
              }
            });
          }
          (() => __awaiter(this, void 0, void 0, function* () {
            yield sub.closed;
            if (timer !== null) {
              timer.cancel();
              timer = null;
            }
            qi.stop();
          }))().catch();
          this.nc.publish(`${this.prefix}.CONSUMER.MSG.NEXT.${stream}.${durable}`, this.jc.encode(args), { reply: inbox });
          return qi;
        }
        pullSubscribe(subject, opts = jsconsumeropts_1.consumerOpts()) {
          return __awaiter(this, void 0, void 0, function* () {
            const cso = yield this._processOptions(subject, opts);
            if (!cso.attached) {
              cso.config.filter_subject = subject;
            }
            if (cso.config.deliver_subject) {
              throw new Error("consumer info specifies deliver_subject - pull consumers cannot have deliver_subject set");
            }
            const ackPolicy = cso.config.ack_policy;
            if (ackPolicy === types_1.AckPolicy.None || ackPolicy === types_1.AckPolicy.All) {
              throw new Error("ack policy for pull consumers must be explicit");
            }
            const so = this._buildTypedSubscriptionOpts(cso);
            const sub = new JetStreamPullSubscriptionImpl(this, cso.deliver, so);
            try {
              yield this._maybeCreateConsumer(cso);
            } catch (err) {
              sub.unsubscribe();
              throw err;
            }
            sub.info = cso;
            return sub;
          });
        }
        subscribe(subject, opts = jsconsumeropts_1.consumerOpts()) {
          return __awaiter(this, void 0, void 0, function* () {
            const cso = yield this._processOptions(subject, opts);
            if (!cso.config.deliver_subject) {
              throw new Error("consumer info specifies a pull consumer - deliver_subject is required");
            }
            const so = this._buildTypedSubscriptionOpts(cso);
            const sub = new JetStreamSubscriptionImpl(this, cso.deliver, so);
            try {
              yield this._maybeCreateConsumer(cso);
            } catch (err) {
              sub.unsubscribe();
              throw err;
            }
            sub.info = cso;
            return sub;
          });
        }
        _processOptions(subject, opts = jsconsumeropts_1.consumerOpts()) {
          return __awaiter(this, void 0, void 0, function* () {
            const jsi = jsconsumeropts_1.isConsumerOptsBuilder(opts) ? opts.getOpts() : opts;
            jsi.api = this;
            jsi.config = jsi.config || {};
            jsi.stream = jsi.stream ? jsi.stream : yield this.findStream(subject);
            jsi.attached = false;
            if (jsi.config.durable_name) {
              try {
                const info = yield this.api.info(jsi.stream, jsi.config.durable_name);
                if (info) {
                  if (info.config.filter_subject && info.config.filter_subject !== subject) {
                    throw new Error("subject does not match consumer");
                  }
                  jsi.config = info.config;
                  jsi.attached = true;
                }
              } catch (err) {
                if (err.code !== "404") {
                  throw err;
                }
              }
            }
            if (!jsi.attached) {
              jsi.config.filter_subject = subject;
            }
            jsi.deliver = jsi.config.deliver_subject || protocol_1.createInbox(this.nc.options.inboxPrefix);
            return jsi;
          });
        }
        _buildTypedSubscriptionOpts(jsi) {
          const so = {};
          so.adapter = msgAdapter(jsi.callbackFn === void 0);
          if (jsi.callbackFn) {
            so.callback = jsi.callbackFn;
          }
          if (!jsi.mack) {
            so.dispatchedFn = autoAckJsMsg;
          }
          so.max = jsi.max || 0;
          so.queue = jsi.queue;
          return so;
        }
        _maybeCreateConsumer(jsi) {
          return __awaiter(this, void 0, void 0, function* () {
            if (jsi.attached) {
              return;
            }
            jsi.config = Object.assign({
              deliver_policy: types_1.DeliverPolicy.All,
              ack_policy: types_1.AckPolicy.Explicit,
              ack_wait: jsutil_1.nanos(30 * 1e3),
              replay_policy: types_1.ReplayPolicy.Instant
            }, jsi.config);
            const ci = yield this.api.add(jsi.stream, jsi.config);
            jsi.name = ci.name;
            jsi.config = ci.config;
          });
        }
      };
      exports.JetStreamClientImpl = JetStreamClientImpl;
      var JetStreamSubscriptionImpl = class extends typedsub_1.TypedSubscription {
        constructor(js, subject, opts) {
          super(js.nc, subject, opts);
        }
        set info(info) {
          this.sub.info = info;
        }
        get info() {
          return this.sub.info;
        }
        destroy() {
          return __awaiter(this, void 0, void 0, function* () {
            if (!this.isClosed()) {
              yield this.drain();
            }
            const jinfo = this.sub.info;
            const name = jinfo.config.durable_name || jinfo.name;
            const subj = `${jinfo.api.prefix}.CONSUMER.DELETE.${jinfo.stream}.${name}`;
            yield jinfo.api._request(subj);
          });
        }
        consumerInfo() {
          return __awaiter(this, void 0, void 0, function* () {
            const jinfo = this.sub.info;
            const name = jinfo.config.durable_name || jinfo.name;
            const subj = `${jinfo.api.prefix}.CONSUMER.INFO.${jinfo.stream}.${name}`;
            return yield jinfo.api._request(subj);
          });
        }
      };
      var JetStreamPullSubscriptionImpl = class extends JetStreamSubscriptionImpl {
        constructor(js, subject, opts) {
          super(js, subject, opts);
        }
        pull(opts = { batch: 1 }) {
          const { stream, config } = this.sub.info;
          const consumer = config.durable_name;
          const args = {};
          args.batch = opts.batch || 1;
          args.no_wait = opts.no_wait || false;
          if (opts.expires && opts.expires > 0) {
            args.expires = opts.expires;
          }
          if (this.info) {
            const api = this.info.api;
            const subj = `${api.prefix}.CONSUMER.MSG.NEXT.${stream}.${consumer}`;
            const reply = this.sub.subject;
            api.nc.publish(subj, api.jc.encode(args), { reply });
          }
        }
      };
      function msgAdapter(iterator) {
        if (iterator) {
          return iterMsgAdapter;
        } else {
          return cbMsgAdapter;
        }
      }
      function cbMsgAdapter(err, msg) {
        if (err) {
          return [err, null];
        }
        err = jsutil_1.checkJsError(msg);
        if (err) {
          return [err, null];
        }
        if (jsutil_1.isFlowControlMsg(msg)) {
          msg.respond();
          return [null, null];
        }
        const jm = jsmsg_1.toJsMsg(msg);
        try {
          jm.info;
          return [null, jm];
        } catch (err2) {
          return [err2, null];
        }
      }
      function iterMsgAdapter(err, msg) {
        if (err) {
          return [err, null];
        }
        const ne = jsutil_1.checkJsError(msg);
        if (ne !== null) {
          switch (ne.code) {
            case error_1.ErrorCode.JetStream404NoMessages:
            case error_1.ErrorCode.JetStream408RequestTimeout:
            case error_1.ErrorCode.JetStream409MaxAckPendingExceeded:
              return [null, null];
            default:
              return [ne, null];
          }
        }
        if (jsutil_1.isFlowControlMsg(msg)) {
          msg.respond();
          return [null, null];
        }
        const jm = jsmsg_1.toJsMsg(msg);
        try {
          jm.info;
          return [null, jm];
        } catch (err2) {
          return [err2, null];
        }
      }
      function autoAckJsMsg(data) {
        if (data) {
          data.ack();
        }
      }
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/nats.js
  var require_nats = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/nats.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __asyncValues = exports && exports.__asyncValues || function(o) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i);
        function verb(n) {
          i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
              v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
          };
        }
        function settle(resolve, reject, d, v) {
          Promise.resolve(v).then(function(v2) {
            resolve({ value: v2, done: d });
          }, reject);
        }
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NatsConnectionImpl = void 0;
      var util_1 = require_util();
      var protocol_1 = require_protocol();
      var subscription_1 = require_subscription();
      var error_1 = require_error();
      var types_1 = require_types();
      var options_1 = require_options();
      var queued_iterator_1 = require_queued_iterator();
      var request_1 = require_request();
      var msg_1 = require_msg();
      var jsm_1 = require_jsm();
      var jsclient_1 = require_jsclient();
      var NatsConnectionImpl = class {
        constructor(opts) {
          this.draining = false;
          this.options = options_1.parseOptions(opts);
          this.listeners = [];
        }
        static connect(opts = {}) {
          return new Promise((resolve, reject) => {
            const nc = new NatsConnectionImpl(opts);
            protocol_1.ProtocolHandler.connect(nc.options, nc).then((ph) => {
              nc.protocol = ph;
              (function() {
                var e_1, _a;
                return __awaiter(this, void 0, void 0, function* () {
                  try {
                    for (var _b = __asyncValues(ph.status()), _c; _c = yield _b.next(), !_c.done; ) {
                      const s = _c.value;
                      nc.listeners.forEach((l) => {
                        l.push(s);
                      });
                    }
                  } catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                  } finally {
                    try {
                      if (_c && !_c.done && (_a = _b.return))
                        yield _a.call(_b);
                    } finally {
                      if (e_1)
                        throw e_1.error;
                    }
                  }
                });
              })();
              resolve(nc);
            }).catch((err) => {
              reject(err);
            });
          });
        }
        closed() {
          return this.protocol.closed;
        }
        close() {
          return __awaiter(this, void 0, void 0, function* () {
            yield this.protocol.close();
          });
        }
        publish(subject, data = types_1.Empty, options) {
          subject = subject || "";
          if (subject.length === 0) {
            throw error_1.NatsError.errorForCode(error_1.ErrorCode.BadSubject);
          }
          if (data && !util_1.isUint8Array(data)) {
            throw error_1.NatsError.errorForCode(error_1.ErrorCode.BadPayload);
          }
          this.protocol.publish(subject, data, options);
        }
        subscribe(subject, opts = {}) {
          if (this.isClosed()) {
            throw error_1.NatsError.errorForCode(error_1.ErrorCode.ConnectionClosed);
          }
          if (this.isDraining()) {
            throw error_1.NatsError.errorForCode(error_1.ErrorCode.ConnectionDraining);
          }
          subject = subject || "";
          if (subject.length === 0) {
            throw error_1.NatsError.errorForCode(error_1.ErrorCode.BadSubject);
          }
          const sub = new subscription_1.SubscriptionImpl(this.protocol, subject, opts);
          this.protocol.subscribe(sub);
          return sub;
        }
        request(subject, data = types_1.Empty, opts = { timeout: 1e3, noMux: false }) {
          if (this.isClosed()) {
            return Promise.reject(error_1.NatsError.errorForCode(error_1.ErrorCode.ConnectionClosed));
          }
          if (this.isDraining()) {
            return Promise.reject(error_1.NatsError.errorForCode(error_1.ErrorCode.ConnectionDraining));
          }
          subject = subject || "";
          if (subject.length === 0) {
            return Promise.reject(error_1.NatsError.errorForCode(error_1.ErrorCode.BadSubject));
          }
          opts.timeout = opts.timeout || 1e3;
          if (opts.timeout < 1) {
            return Promise.reject(new error_1.NatsError("timeout", error_1.ErrorCode.InvalidOption));
          }
          if (!opts.noMux && opts.reply) {
            return Promise.reject(new error_1.NatsError("reply can only be used with noMux", error_1.ErrorCode.InvalidOption));
          }
          if (opts.noMux) {
            const inbox = opts.reply ? opts.reply : protocol_1.createInbox(this.options.inboxPrefix);
            const d = util_1.deferred();
            this.subscribe(inbox, {
              max: 1,
              timeout: opts.timeout,
              callback: (err, msg) => {
                if (err) {
                  d.reject(err);
                } else {
                  err = msg_1.isRequestError(msg);
                  if (err) {
                    d.reject(err);
                  } else {
                    d.resolve(msg);
                  }
                }
              }
            });
            this.publish(subject, data, { reply: inbox });
            return d;
          } else {
            const r = new request_1.Request(this.protocol.muxSubscriptions, opts);
            this.protocol.request(r);
            try {
              this.publish(subject, data, {
                reply: `${this.protocol.muxSubscriptions.baseInbox}${r.token}`,
                headers: opts.headers
              });
            } catch (err) {
              r.cancel(err);
            }
            const p = Promise.race([r.timer, r.deferred]);
            p.catch(() => {
              r.cancel();
            });
            return p;
          }
        }
        flush() {
          return this.protocol.flush();
        }
        drain() {
          if (this.isClosed()) {
            return Promise.reject(error_1.NatsError.errorForCode(error_1.ErrorCode.ConnectionClosed));
          }
          if (this.isDraining()) {
            return Promise.reject(error_1.NatsError.errorForCode(error_1.ErrorCode.ConnectionDraining));
          }
          this.draining = true;
          return this.protocol.drain();
        }
        isClosed() {
          return this.protocol.isClosed();
        }
        isDraining() {
          return this.draining;
        }
        getServer() {
          const srv = this.protocol.getServer();
          return srv ? srv.listen : "";
        }
        status() {
          const iter = new queued_iterator_1.QueuedIteratorImpl();
          this.listeners.push(iter);
          return iter;
        }
        get info() {
          return this.protocol.isClosed() ? void 0 : this.protocol.info;
        }
        stats() {
          return {
            inBytes: this.protocol.inBytes,
            outBytes: this.protocol.outBytes,
            inMsgs: this.protocol.inMsgs,
            outMsgs: this.protocol.outMsgs
          };
        }
        jetstreamManager(opts = {}) {
          return __awaiter(this, void 0, void 0, function* () {
            jetstreamPreview(this);
            const adm = new jsm_1.JetStreamManagerImpl(this, opts);
            try {
              yield adm.getAccountInfo();
            } catch (err) {
              const ne = err;
              if (ne.code === error_1.ErrorCode.NoResponders) {
                throw error_1.NatsError.errorForCode(error_1.ErrorCode.JetStreamNotEnabled);
              }
              throw ne;
            }
            return adm;
          });
        }
        jetstream(opts = {}) {
          jetstreamPreview(this);
          return new jsclient_1.JetStreamClientImpl(this, opts);
        }
      };
      exports.NatsConnectionImpl = NatsConnectionImpl;
      var jetstreamPreview = (() => {
        let once = false;
        return (nci) => {
          var _a;
          if (!once) {
            once = true;
            const { lang } = (_a = nci === null || nci === void 0 ? void 0 : nci.protocol) === null || _a === void 0 ? void 0 : _a.transport;
            if (lang) {
              console.log(`\x1B[33m >> jetstream functionality in ${lang} is preview functionality \x1B[0m`);
            } else {
              console.log(`\x1B[33m >> jetstream functionality is preview functionality \x1B[0m`);
            }
          }
        };
      })();
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/bench.js
  var require_bench = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/bench.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __asyncValues = exports && exports.__asyncValues || function(o) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i);
        function verb(n) {
          i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
              v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
          };
        }
        function settle(resolve, reject, d, v) {
          Promise.resolve(v).then(function(v2) {
            resolve({ value: v2, done: d });
          }, reject);
        }
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Bench = exports.Metric = void 0;
      var types_1 = require_types();
      var nuid_1 = require_nuid();
      var util_1 = require_util();
      var error_1 = require_error();
      var Metric = class {
        constructor(name, duration) {
          this.name = name;
          this.duration = duration;
          this.date = Date.now();
          this.payload = 0;
          this.msgs = 0;
          this.bytes = 0;
        }
        toString() {
          const sec = this.duration / 1e3;
          const mps = Math.round(this.msgs / sec);
          const label = this.asyncRequests ? "asyncRequests" : "";
          let minmax = "";
          if (this.max) {
            minmax = `${this.min}/${this.max}`;
          }
          return `${this.name}${label ? " [asyncRequests]" : ""} ${humanizeNumber(mps)} msgs/sec - [${sec.toFixed(2)} secs] ~ ${throughput(this.bytes, sec)} ${minmax}`;
        }
        toCsv() {
          return `"${this.name}",${new Date(this.date).toISOString()},${this.lang},${this.version},${this.msgs},${this.payload},${this.bytes},${this.duration},${this.asyncRequests ? this.asyncRequests : false}
`;
        }
        static header() {
          return `Test,Date,Lang,Version,Count,MsgPayload,Bytes,Millis,Async
`;
        }
      };
      exports.Metric = Metric;
      var Bench = class {
        constructor(nc, opts = {
          msgs: 1e5,
          size: 128,
          subject: "",
          asyncRequests: false,
          pub: false,
          sub: false,
          req: false,
          rep: false
        }) {
          this.nc = nc;
          this.callbacks = opts.callbacks || false;
          this.msgs = opts.msgs || 0;
          this.size = opts.size || 0;
          this.subject = opts.subject || nuid_1.nuid.next();
          this.asyncRequests = opts.asyncRequests || false;
          this.pub = opts.pub || false;
          this.sub = opts.sub || false;
          this.req = opts.req || false;
          this.rep = opts.rep || false;
          this.perf = new util_1.Perf();
          this.payload = this.size ? new Uint8Array(this.size) : types_1.Empty;
          if (!this.pub && !this.sub && !this.req && !this.rep) {
            throw new Error("no bench option selected");
          }
        }
        run() {
          return __awaiter(this, void 0, void 0, function* () {
            this.nc.closed().then((err) => {
              if (err) {
                throw new error_1.NatsError(`bench closed with an error: ${err.message}`, error_1.ErrorCode.Unknown, err);
              }
            });
            if (this.callbacks) {
              yield this.runCallbacks();
            } else {
              yield this.runAsync();
            }
            return this.processMetrics();
          });
        }
        processMetrics() {
          const nc = this.nc;
          const { lang, version } = nc.protocol.transport;
          if (this.pub && this.sub) {
            this.perf.measure("pubsub", "pubStart", "subStop");
          }
          const measures = this.perf.getEntries();
          const pubsub = measures.find((m) => m.name === "pubsub");
          const req = measures.find((m) => m.name === "req");
          const pub = measures.find((m) => m.name === "pub");
          const sub = measures.find((m) => m.name === "sub");
          const stats = this.nc.stats();
          const metrics = [];
          if (pubsub) {
            const { name, duration } = pubsub;
            const m = new Metric(name, duration);
            m.msgs = this.msgs * 2;
            m.bytes = stats.inBytes + stats.outBytes;
            m.lang = lang;
            m.version = version;
            m.payload = this.payload.length;
            metrics.push(m);
          }
          if (pub) {
            const { name, duration } = pub;
            const m = new Metric(name, duration);
            m.msgs = this.msgs;
            m.bytes = stats.outBytes;
            m.lang = lang;
            m.version = version;
            m.payload = this.payload.length;
            metrics.push(m);
          }
          if (sub) {
            const { name, duration } = sub;
            const m = new Metric(name, duration);
            m.msgs = this.msgs;
            m.bytes = stats.inBytes;
            m.lang = lang;
            m.version = version;
            m.payload = this.payload.length;
            metrics.push(m);
          }
          if (req) {
            const { name, duration } = req;
            const m = new Metric(name, duration);
            m.msgs = this.msgs * 2;
            m.bytes = stats.inBytes + stats.outBytes;
            m.lang = lang;
            m.version = version;
            m.payload = this.payload.length;
            metrics.push(m);
          }
          return metrics;
        }
        runCallbacks() {
          return __awaiter(this, void 0, void 0, function* () {
            const jobs = [];
            if (this.req) {
              const d = util_1.deferred();
              jobs.push(d);
              const sub = this.nc.subscribe(this.subject, {
                max: this.msgs,
                callback: (_, m) => {
                  m.respond(this.payload);
                  if (sub.getProcessed() === this.msgs) {
                    d.resolve();
                  }
                }
              });
            }
            if (this.sub) {
              const d = util_1.deferred();
              jobs.push(d);
              let i = 0;
              this.nc.subscribe(this.subject, {
                max: this.msgs,
                callback: () => {
                  i++;
                  if (i === 1) {
                    this.perf.mark("subStart");
                  }
                  if (i === this.msgs) {
                    this.perf.mark("subStop");
                    this.perf.measure("sub", "subStart", "subStop");
                    d.resolve();
                  }
                }
              });
            }
            if (this.pub) {
              const job = (() => __awaiter(this, void 0, void 0, function* () {
                this.perf.mark("pubStart");
                for (let i = 0; i < this.msgs; i++) {
                  this.nc.publish(this.subject, this.payload);
                }
                yield this.nc.flush();
                this.perf.mark("pubStop");
                this.perf.measure("pub", "pubStart", "pubStop");
              }))();
              jobs.push(job);
            }
            if (this.req) {
              const job = (() => __awaiter(this, void 0, void 0, function* () {
                if (this.asyncRequests) {
                  this.perf.mark("reqStart");
                  const a = [];
                  for (let i = 0; i < this.msgs; i++) {
                    a.push(this.nc.request(this.subject, this.payload, { timeout: 2e4 }));
                  }
                  yield Promise.all(a);
                  this.perf.mark("reqStop");
                  this.perf.measure("req", "reqStart", "reqStop");
                } else {
                  this.perf.mark("reqStart");
                  for (let i = 0; i < this.msgs; i++) {
                    yield this.nc.request(this.subject);
                  }
                  this.perf.mark("reqStop");
                  this.perf.measure("req", "reqStart", "reqStop");
                }
              }))();
              jobs.push(job);
            }
            yield Promise.all(jobs);
          });
        }
        runAsync() {
          return __awaiter(this, void 0, void 0, function* () {
            const jobs = [];
            if (this.req) {
              const sub = this.nc.subscribe(this.subject, { max: this.msgs });
              const job = (() => __awaiter(this, void 0, void 0, function* () {
                var e_1, _a;
                try {
                  for (var sub_1 = __asyncValues(sub), sub_1_1; sub_1_1 = yield sub_1.next(), !sub_1_1.done; ) {
                    const m = sub_1_1.value;
                    m.respond(this.payload);
                  }
                } catch (e_1_1) {
                  e_1 = { error: e_1_1 };
                } finally {
                  try {
                    if (sub_1_1 && !sub_1_1.done && (_a = sub_1.return))
                      yield _a.call(sub_1);
                  } finally {
                    if (e_1)
                      throw e_1.error;
                  }
                }
              }))();
              jobs.push(job);
            }
            if (this.sub) {
              let first = false;
              const sub = this.nc.subscribe(this.subject, { max: this.msgs });
              const job = (() => __awaiter(this, void 0, void 0, function* () {
                var e_2, _b;
                try {
                  for (var sub_2 = __asyncValues(sub), sub_2_1; sub_2_1 = yield sub_2.next(), !sub_2_1.done; ) {
                    const m = sub_2_1.value;
                    if (!first) {
                      this.perf.mark("subStart");
                      first = true;
                    }
                  }
                } catch (e_2_1) {
                  e_2 = { error: e_2_1 };
                } finally {
                  try {
                    if (sub_2_1 && !sub_2_1.done && (_b = sub_2.return))
                      yield _b.call(sub_2);
                  } finally {
                    if (e_2)
                      throw e_2.error;
                  }
                }
                this.perf.mark("subStop");
                this.perf.measure("sub", "subStart", "subStop");
              }))();
              jobs.push(job);
            }
            if (this.pub) {
              const job = (() => __awaiter(this, void 0, void 0, function* () {
                this.perf.mark("pubStart");
                for (let i = 0; i < this.msgs; i++) {
                  this.nc.publish(this.subject, this.payload);
                }
                yield this.nc.flush();
                this.perf.mark("pubStop");
                this.perf.measure("pub", "pubStart", "pubStop");
              }))();
              jobs.push(job);
            }
            if (this.req) {
              const job = (() => __awaiter(this, void 0, void 0, function* () {
                if (this.asyncRequests) {
                  this.perf.mark("reqStart");
                  const a = [];
                  for (let i = 0; i < this.msgs; i++) {
                    a.push(this.nc.request(this.subject, this.payload, { timeout: 2e4 }));
                  }
                  yield Promise.all(a);
                  this.perf.mark("reqStop");
                  this.perf.measure("req", "reqStart", "reqStop");
                } else {
                  this.perf.mark("reqStart");
                  for (let i = 0; i < this.msgs; i++) {
                    yield this.nc.request(this.subject);
                  }
                  this.perf.mark("reqStop");
                  this.perf.measure("req", "reqStart", "reqStop");
                }
              }))();
              jobs.push(job);
            }
            yield Promise.all(jobs);
          });
        }
      };
      exports.Bench = Bench;
      function throughput(bytes, seconds) {
        return humanizeBytes(bytes / seconds);
      }
      function humanizeBytes(bytes, si = false) {
        const base = si ? 1e3 : 1024;
        const pre = si ? ["k", "M", "G", "T", "P", "E"] : ["K", "M", "G", "T", "P", "E"];
        const post = si ? "iB" : "B";
        if (bytes < base) {
          return `${bytes.toFixed(2)} ${post}/sec`;
        }
        const exp = parseInt(Math.log(bytes) / Math.log(base) + "");
        const index = parseInt(exp - 1 + "");
        return `${(bytes / Math.pow(base, exp)).toFixed(2)} ${pre[index]}${post}/sec`;
      }
      function humanizeNumber(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
  });

  // ../../node_modules/nats.ws/lib/nats-base-client/internal_mod.js
  var require_internal_mod = __commonJS({
    "../../node_modules/nats.ws/lib/nats-base-client/internal_mod.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.State = exports.Parser = exports.Kind = exports.StringCodec = exports.JSONCodec = exports.nkeyAuthenticator = exports.jwtAuthenticator = exports.credsAuthenticator = exports.Request = exports.checkUnsupportedOption = exports.checkOptions = exports.DataBuffer = exports.MuxSubscription = exports.Heartbeat = exports.MsgHdrsImpl = exports.Match = exports.headers = exports.canonicalMIMEHeaderKey = exports.timeout = exports.render = exports.extractProtocolMessage = exports.extend = exports.delay = exports.deferred = exports.ProtocolHandler = exports.INFO = exports.createInbox = exports.Connect = exports.setTransportFactory = exports.Subscriptions = exports.SubscriptionImpl = exports.MsgImpl = exports.JsHeaders = exports.Events = exports.Empty = exports.DebugEvents = exports.toJsMsg = exports.consumerOpts = exports.StorageType = exports.RetentionPolicy = exports.ReplayPolicy = exports.DiscardPolicy = exports.DeliverPolicy = exports.AdvisoryKind = exports.AckPolicy = exports.NatsError = exports.ErrorCode = exports.nuid = exports.Nuid = exports.NatsConnectionImpl = void 0;
      exports.nanos = exports.millis = exports.isHeartbeatMsg = exports.isFlowControlMsg = exports.TypedSubscription = exports.parseIP = exports.isIP = exports.TE = exports.TD = exports.Metric = exports.Bench = exports.writeAll = exports.readAll = exports.MAX_SIZE = exports.DenoBuffer = void 0;
      var nats_1 = require_nats();
      Object.defineProperty(exports, "NatsConnectionImpl", { enumerable: true, get: function() {
        return nats_1.NatsConnectionImpl;
      } });
      var nuid_1 = require_nuid();
      Object.defineProperty(exports, "Nuid", { enumerable: true, get: function() {
        return nuid_1.Nuid;
      } });
      Object.defineProperty(exports, "nuid", { enumerable: true, get: function() {
        return nuid_1.nuid;
      } });
      var error_1 = require_error();
      Object.defineProperty(exports, "ErrorCode", { enumerable: true, get: function() {
        return error_1.ErrorCode;
      } });
      Object.defineProperty(exports, "NatsError", { enumerable: true, get: function() {
        return error_1.NatsError;
      } });
      var types_1 = require_types();
      Object.defineProperty(exports, "AckPolicy", { enumerable: true, get: function() {
        return types_1.AckPolicy;
      } });
      Object.defineProperty(exports, "AdvisoryKind", { enumerable: true, get: function() {
        return types_1.AdvisoryKind;
      } });
      Object.defineProperty(exports, "DeliverPolicy", { enumerable: true, get: function() {
        return types_1.DeliverPolicy;
      } });
      Object.defineProperty(exports, "DiscardPolicy", { enumerable: true, get: function() {
        return types_1.DiscardPolicy;
      } });
      Object.defineProperty(exports, "ReplayPolicy", { enumerable: true, get: function() {
        return types_1.ReplayPolicy;
      } });
      Object.defineProperty(exports, "RetentionPolicy", { enumerable: true, get: function() {
        return types_1.RetentionPolicy;
      } });
      Object.defineProperty(exports, "StorageType", { enumerable: true, get: function() {
        return types_1.StorageType;
      } });
      var jsconsumeropts_1 = require_jsconsumeropts();
      Object.defineProperty(exports, "consumerOpts", { enumerable: true, get: function() {
        return jsconsumeropts_1.consumerOpts;
      } });
      var jsmsg_1 = require_jsmsg();
      Object.defineProperty(exports, "toJsMsg", { enumerable: true, get: function() {
        return jsmsg_1.toJsMsg;
      } });
      var types_2 = require_types();
      Object.defineProperty(exports, "DebugEvents", { enumerable: true, get: function() {
        return types_2.DebugEvents;
      } });
      Object.defineProperty(exports, "Empty", { enumerable: true, get: function() {
        return types_2.Empty;
      } });
      Object.defineProperty(exports, "Events", { enumerable: true, get: function() {
        return types_2.Events;
      } });
      Object.defineProperty(exports, "JsHeaders", { enumerable: true, get: function() {
        return types_2.JsHeaders;
      } });
      var msg_1 = require_msg();
      Object.defineProperty(exports, "MsgImpl", { enumerable: true, get: function() {
        return msg_1.MsgImpl;
      } });
      var subscription_1 = require_subscription();
      Object.defineProperty(exports, "SubscriptionImpl", { enumerable: true, get: function() {
        return subscription_1.SubscriptionImpl;
      } });
      var subscriptions_1 = require_subscriptions();
      Object.defineProperty(exports, "Subscriptions", { enumerable: true, get: function() {
        return subscriptions_1.Subscriptions;
      } });
      var transport_1 = require_transport();
      Object.defineProperty(exports, "setTransportFactory", { enumerable: true, get: function() {
        return transport_1.setTransportFactory;
      } });
      var protocol_1 = require_protocol();
      Object.defineProperty(exports, "Connect", { enumerable: true, get: function() {
        return protocol_1.Connect;
      } });
      Object.defineProperty(exports, "createInbox", { enumerable: true, get: function() {
        return protocol_1.createInbox;
      } });
      Object.defineProperty(exports, "INFO", { enumerable: true, get: function() {
        return protocol_1.INFO;
      } });
      Object.defineProperty(exports, "ProtocolHandler", { enumerable: true, get: function() {
        return protocol_1.ProtocolHandler;
      } });
      var util_1 = require_util();
      Object.defineProperty(exports, "deferred", { enumerable: true, get: function() {
        return util_1.deferred;
      } });
      Object.defineProperty(exports, "delay", { enumerable: true, get: function() {
        return util_1.delay;
      } });
      Object.defineProperty(exports, "extend", { enumerable: true, get: function() {
        return util_1.extend;
      } });
      Object.defineProperty(exports, "extractProtocolMessage", { enumerable: true, get: function() {
        return util_1.extractProtocolMessage;
      } });
      Object.defineProperty(exports, "render", { enumerable: true, get: function() {
        return util_1.render;
      } });
      Object.defineProperty(exports, "timeout", { enumerable: true, get: function() {
        return util_1.timeout;
      } });
      var headers_1 = require_headers();
      Object.defineProperty(exports, "canonicalMIMEHeaderKey", { enumerable: true, get: function() {
        return headers_1.canonicalMIMEHeaderKey;
      } });
      Object.defineProperty(exports, "headers", { enumerable: true, get: function() {
        return headers_1.headers;
      } });
      Object.defineProperty(exports, "Match", { enumerable: true, get: function() {
        return headers_1.Match;
      } });
      Object.defineProperty(exports, "MsgHdrsImpl", { enumerable: true, get: function() {
        return headers_1.MsgHdrsImpl;
      } });
      var heartbeats_1 = require_heartbeats();
      Object.defineProperty(exports, "Heartbeat", { enumerable: true, get: function() {
        return heartbeats_1.Heartbeat;
      } });
      var muxsubscription_1 = require_muxsubscription();
      Object.defineProperty(exports, "MuxSubscription", { enumerable: true, get: function() {
        return muxsubscription_1.MuxSubscription;
      } });
      var databuffer_1 = require_databuffer();
      Object.defineProperty(exports, "DataBuffer", { enumerable: true, get: function() {
        return databuffer_1.DataBuffer;
      } });
      var options_1 = require_options();
      Object.defineProperty(exports, "checkOptions", { enumerable: true, get: function() {
        return options_1.checkOptions;
      } });
      Object.defineProperty(exports, "checkUnsupportedOption", { enumerable: true, get: function() {
        return options_1.checkUnsupportedOption;
      } });
      var request_1 = require_request();
      Object.defineProperty(exports, "Request", { enumerable: true, get: function() {
        return request_1.Request;
      } });
      var authenticator_1 = require_authenticator();
      Object.defineProperty(exports, "credsAuthenticator", { enumerable: true, get: function() {
        return authenticator_1.credsAuthenticator;
      } });
      Object.defineProperty(exports, "jwtAuthenticator", { enumerable: true, get: function() {
        return authenticator_1.jwtAuthenticator;
      } });
      Object.defineProperty(exports, "nkeyAuthenticator", { enumerable: true, get: function() {
        return authenticator_1.nkeyAuthenticator;
      } });
      var codec_1 = require_codec2();
      Object.defineProperty(exports, "JSONCodec", { enumerable: true, get: function() {
        return codec_1.JSONCodec;
      } });
      Object.defineProperty(exports, "StringCodec", { enumerable: true, get: function() {
        return codec_1.StringCodec;
      } });
      __exportStar(require_nkeys2(), exports);
      var parser_1 = require_parser();
      Object.defineProperty(exports, "Kind", { enumerable: true, get: function() {
        return parser_1.Kind;
      } });
      Object.defineProperty(exports, "Parser", { enumerable: true, get: function() {
        return parser_1.Parser;
      } });
      Object.defineProperty(exports, "State", { enumerable: true, get: function() {
        return parser_1.State;
      } });
      var denobuffer_1 = require_denobuffer();
      Object.defineProperty(exports, "DenoBuffer", { enumerable: true, get: function() {
        return denobuffer_1.DenoBuffer;
      } });
      Object.defineProperty(exports, "MAX_SIZE", { enumerable: true, get: function() {
        return denobuffer_1.MAX_SIZE;
      } });
      Object.defineProperty(exports, "readAll", { enumerable: true, get: function() {
        return denobuffer_1.readAll;
      } });
      Object.defineProperty(exports, "writeAll", { enumerable: true, get: function() {
        return denobuffer_1.writeAll;
      } });
      var bench_1 = require_bench();
      Object.defineProperty(exports, "Bench", { enumerable: true, get: function() {
        return bench_1.Bench;
      } });
      Object.defineProperty(exports, "Metric", { enumerable: true, get: function() {
        return bench_1.Metric;
      } });
      var encoders_1 = require_encoders();
      Object.defineProperty(exports, "TD", { enumerable: true, get: function() {
        return encoders_1.TD;
      } });
      Object.defineProperty(exports, "TE", { enumerable: true, get: function() {
        return encoders_1.TE;
      } });
      var ipparser_1 = require_ipparser();
      Object.defineProperty(exports, "isIP", { enumerable: true, get: function() {
        return ipparser_1.isIP;
      } });
      Object.defineProperty(exports, "parseIP", { enumerable: true, get: function() {
        return ipparser_1.parseIP;
      } });
      var typedsub_1 = require_typedsub();
      Object.defineProperty(exports, "TypedSubscription", { enumerable: true, get: function() {
        return typedsub_1.TypedSubscription;
      } });
      var jsutil_1 = require_jsutil();
      Object.defineProperty(exports, "isFlowControlMsg", { enumerable: true, get: function() {
        return jsutil_1.isFlowControlMsg;
      } });
      Object.defineProperty(exports, "isHeartbeatMsg", { enumerable: true, get: function() {
        return jsutil_1.isHeartbeatMsg;
      } });
      Object.defineProperty(exports, "millis", { enumerable: true, get: function() {
        return jsutil_1.millis;
      } });
      Object.defineProperty(exports, "nanos", { enumerable: true, get: function() {
        return jsutil_1.nanos;
      } });
    }
  });

  // ../../node_modules/nats.ws/lib/src/ws_transport.js
  var require_ws_transport = __commonJS({
    "../../node_modules/nats.ws/lib/src/ws_transport.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __await = exports && exports.__await || function(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
      };
      var __asyncGenerator = exports && exports.__asyncGenerator || function(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i;
        function verb(n) {
          if (g[n])
            i[n] = function(v) {
              return new Promise(function(a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
              });
            };
        }
        function resume(n, v) {
          try {
            step(g[n](v));
          } catch (e) {
            settle(q[0][3], e);
          }
        }
        function step(r) {
          r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
        }
        function fulfill(value) {
          resume("next", value);
        }
        function reject(value) {
          resume("throw", value);
        }
        function settle(f, v) {
          if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]);
        }
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WsTransport = void 0;
      var internal_mod_1 = require_internal_mod();
      var VERSION = "1.2.0";
      var LANG = "nats.ws";
      var WsTransport = class {
        constructor() {
          this.version = VERSION;
          this.lang = LANG;
          this.connected = false;
          this.done = false;
          this.socketClosed = false;
          this.encrypted = false;
          this.peeked = false;
          this.yields = [];
          this.signal = internal_mod_1.deferred();
          this.closedNotification = internal_mod_1.deferred();
        }
        connect(server, options) {
          const connected = false;
          const connLock = internal_mod_1.deferred();
          if (options.tls) {
            connLock.reject(new internal_mod_1.NatsError("tls", internal_mod_1.ErrorCode.InvalidOption));
            return connLock;
          }
          this.options = options;
          const u = server.src;
          this.encrypted = u.indexOf("wss://") === 0;
          this.socket = new WebSocket(u);
          this.socket.binaryType = "arraybuffer";
          this.socket.onopen = () => {
          };
          this.socket.onmessage = (me) => {
            this.yields.push(new Uint8Array(me.data));
            if (this.peeked) {
              this.signal.resolve();
              return;
            }
            const t = internal_mod_1.DataBuffer.concat(...this.yields);
            const pm = internal_mod_1.extractProtocolMessage(t);
            if (pm) {
              const m = internal_mod_1.INFO.exec(pm);
              if (!m) {
                if (options.debug) {
                  console.error("!!!", internal_mod_1.render(t));
                }
                connLock.reject(new Error("unexpected response from server"));
                return;
              }
              try {
                const info = JSON.parse(m[1]);
                internal_mod_1.checkOptions(info, this.options);
                this.peeked = true;
                this.connected = true;
                this.signal.resolve();
                connLock.resolve();
              } catch (err) {
                connLock.reject(err);
                return;
              }
            }
          };
          this.socket.onclose = (evt) => {
            this.socketClosed = true;
            let reason;
            if (this.done)
              return;
            if (!evt.wasClean) {
              reason = new Error(evt.reason);
            }
            this._closed(reason);
          };
          this.socket.onerror = (e) => {
            const evt = e;
            const err = new internal_mod_1.NatsError(evt.message, internal_mod_1.ErrorCode.Unknown, new Error(evt.error));
            if (!connected) {
              connLock.reject(err);
            } else {
              this._closed(err);
            }
          };
          return connLock;
        }
        disconnect() {
          this._closed(void 0, true);
        }
        _closed(err, internal = true) {
          return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected)
              return;
            if (this.done)
              return;
            this.closeError = err;
            if (!err) {
              while (!this.socketClosed && this.socket.bufferedAmount > 0) {
                console.log(this.socket.bufferedAmount);
                yield internal_mod_1.delay(100);
              }
            }
            this.done = true;
            try {
              this.socket.close(err ? 1002 : 1e3, err ? err.message : void 0);
            } catch (err2) {
            }
            if (internal) {
              this.closedNotification.resolve(err);
            }
          });
        }
        get isClosed() {
          return this.done;
        }
        [Symbol.asyncIterator]() {
          return this.iterate();
        }
        iterate() {
          return __asyncGenerator(this, arguments, function* iterate_1() {
            while (true) {
              if (this.yields.length === 0) {
                yield __await(this.signal);
              }
              const yields = this.yields;
              this.yields = [];
              for (let i = 0; i < yields.length; i++) {
                if (this.options.debug) {
                  console.info(`> ${internal_mod_1.render(yields[i])}`);
                }
                yield yield __await(yields[i]);
              }
              if (this.done) {
                break;
              } else if (this.yields.length === 0) {
                yields.length = 0;
                this.yields = yields;
                this.signal = internal_mod_1.deferred();
              }
            }
          });
        }
        isEncrypted() {
          return this.connected && this.encrypted;
        }
        send(frame) {
          if (this.done) {
            return Promise.resolve();
          }
          try {
            this.socket.send(frame.buffer);
            if (this.options.debug) {
              console.info(`< ${internal_mod_1.render(frame)}`);
            }
            return Promise.resolve();
          } catch (err) {
            if (this.options.debug) {
              console.error(`!!! ${internal_mod_1.render(frame)}: ${err}`);
            }
            return Promise.reject(err);
          }
        }
        close(err) {
          return this._closed(err, false);
        }
        closed() {
          return this.closedNotification;
        }
      };
      exports.WsTransport = WsTransport;
    }
  });

  // ../../node_modules/nats.ws/lib/src/connect.js
  var require_connect = __commonJS({
    "../../node_modules/nats.ws/lib/src/connect.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.connect = exports.wsUrlParseFn = void 0;
      var internal_mod_1 = require_internal_mod();
      var ws_transport_1 = require_ws_transport();
      function wsUrlParseFn(u) {
        const ut = /^(.*:\/\/)(.*)/;
        if (!ut.test(u)) {
          u = `https://${u}`;
        }
        let url = new URL(u);
        const srcProto = url.protocol.toLowerCase();
        if (srcProto !== "https:" && srcProto !== "http") {
          u = u.replace(/^(.*:\/\/)(.*)/gm, "$2");
          url = new URL(`http://${u}`);
        }
        let protocol;
        let port;
        const host = url.hostname;
        const path = url.pathname;
        const search = url.search || "";
        switch (srcProto) {
          case "http:":
          case "ws:":
          case "nats:":
            port = url.port || "80";
            protocol = "ws:";
            break;
          default:
            port = url.port || "443";
            protocol = "wss:";
            break;
        }
        return `${protocol}//${host}:${port}${path}${search}`;
      }
      exports.wsUrlParseFn = wsUrlParseFn;
      function connect(opts = {}) {
        internal_mod_1.setTransportFactory({
          defaultPort: 443,
          urlParseFn: wsUrlParseFn,
          factory: () => {
            return new ws_transport_1.WsTransport();
          }
        });
        return internal_mod_1.NatsConnectionImpl.connect(opts);
      }
      exports.connect = connect;
    }
  });

  // ../../node_modules/nats.ws/lib/src/mod.js
  var require_mod3 = __commonJS({
    "../../node_modules/nats.ws/lib/src/mod.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.connect = void 0;
      __exportStar(require_internal_mod(), exports);
      var connect_1 = require_connect();
      Object.defineProperty(exports, "connect", { enumerable: true, get: function() {
        return connect_1.connect;
      } });
    }
  });

  // ../../node_modules/nats.ws/nats.cjs
  var require_nats2 = __commonJS({
    "../../node_modules/nats.ws/nats.cjs"(exports, module) {
      "use strict";
      module.exports = require_mod3();
    }
  });

  // ../../node_modules/ms/index.js
  var require_ms = __commonJS({
    "../../node_modules/ms/index.js"(exports, module) {
      var s = 1e3;
      var m = s * 60;
      var h = m * 60;
      var d = h * 24;
      var w = d * 7;
      var y = d * 365.25;
      module.exports = function(val, options) {
        options = options || {};
        var type = typeof val;
        if (type === "string" && val.length > 0) {
          return parse(val);
        } else if (type === "number" && isFinite(val)) {
          return options.long ? fmtLong(val) : fmtShort(val);
        }
        throw new Error(
          "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
        );
      };
      function parse(str) {
        str = String(str);
        if (str.length > 100) {
          return;
        }
        var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          str
        );
        if (!match) {
          return;
        }
        var n = parseFloat(match[1]);
        var type = (match[2] || "ms").toLowerCase();
        switch (type) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return n * y;
          case "weeks":
          case "week":
          case "w":
            return n * w;
          case "days":
          case "day":
          case "d":
            return n * d;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return n * h;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return n * m;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return n * s;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return n;
          default:
            return void 0;
        }
      }
      function fmtShort(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return Math.round(ms / d) + "d";
        }
        if (msAbs >= h) {
          return Math.round(ms / h) + "h";
        }
        if (msAbs >= m) {
          return Math.round(ms / m) + "m";
        }
        if (msAbs >= s) {
          return Math.round(ms / s) + "s";
        }
        return ms + "ms";
      }
      function fmtLong(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return plural(ms, msAbs, d, "day");
        }
        if (msAbs >= h) {
          return plural(ms, msAbs, h, "hour");
        }
        if (msAbs >= m) {
          return plural(ms, msAbs, m, "minute");
        }
        if (msAbs >= s) {
          return plural(ms, msAbs, s, "second");
        }
        return ms + " ms";
      }
      function plural(ms, msAbs, n, name) {
        var isPlural = msAbs >= n * 1.5;
        return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
      }
    }
  });

  // ../../node_modules/debug/src/common.js
  var require_common = __commonJS({
    "../../node_modules/debug/src/common.js"(exports, module) {
      function setup(env) {
        createDebug.debug = createDebug;
        createDebug.default = createDebug;
        createDebug.coerce = coerce;
        createDebug.disable = disable;
        createDebug.enable = enable;
        createDebug.enabled = enabled;
        createDebug.humanize = require_ms();
        createDebug.destroy = destroy;
        Object.keys(env).forEach((key) => {
          createDebug[key] = env[key];
        });
        createDebug.names = [];
        createDebug.skips = [];
        createDebug.formatters = {};
        function selectColor(namespace) {
          let hash = 0;
          for (let i = 0; i < namespace.length; i++) {
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0;
          }
          return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
        }
        createDebug.selectColor = selectColor;
        function createDebug(namespace) {
          let prevTime;
          let enableOverride = null;
          let namespacesCache;
          let enabledCache;
          function debug(...args) {
            if (!debug.enabled) {
              return;
            }
            const self2 = debug;
            const curr = Number(new Date());
            const ms = curr - (prevTime || curr);
            self2.diff = ms;
            self2.prev = prevTime;
            self2.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);
            if (typeof args[0] !== "string") {
              args.unshift("%O");
            }
            let index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
              if (match === "%%") {
                return "%";
              }
              index++;
              const formatter = createDebug.formatters[format];
              if (typeof formatter === "function") {
                const val = args[index];
                match = formatter.call(self2, val);
                args.splice(index, 1);
                index--;
              }
              return match;
            });
            createDebug.formatArgs.call(self2, args);
            const logFn = self2.log || createDebug.log;
            logFn.apply(self2, args);
          }
          debug.namespace = namespace;
          debug.useColors = createDebug.useColors();
          debug.color = createDebug.selectColor(namespace);
          debug.extend = extend;
          debug.destroy = createDebug.destroy;
          Object.defineProperty(debug, "enabled", {
            enumerable: true,
            configurable: false,
            get: () => {
              if (enableOverride !== null) {
                return enableOverride;
              }
              if (namespacesCache !== createDebug.namespaces) {
                namespacesCache = createDebug.namespaces;
                enabledCache = createDebug.enabled(namespace);
              }
              return enabledCache;
            },
            set: (v) => {
              enableOverride = v;
            }
          });
          if (typeof createDebug.init === "function") {
            createDebug.init(debug);
          }
          return debug;
        }
        function extend(namespace, delimiter) {
          const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
          newDebug.log = this.log;
          return newDebug;
        }
        function enable(namespaces) {
          createDebug.save(namespaces);
          createDebug.namespaces = namespaces;
          createDebug.names = [];
          createDebug.skips = [];
          let i;
          const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
          const len = split.length;
          for (i = 0; i < len; i++) {
            if (!split[i]) {
              continue;
            }
            namespaces = split[i].replace(/\*/g, ".*?");
            if (namespaces[0] === "-") {
              createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
            } else {
              createDebug.names.push(new RegExp("^" + namespaces + "$"));
            }
          }
        }
        function disable() {
          const namespaces = [
            ...createDebug.names.map(toNamespace),
            ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
          ].join(",");
          createDebug.enable("");
          return namespaces;
        }
        function enabled(name) {
          if (name[name.length - 1] === "*") {
            return true;
          }
          let i;
          let len;
          for (i = 0, len = createDebug.skips.length; i < len; i++) {
            if (createDebug.skips[i].test(name)) {
              return false;
            }
          }
          for (i = 0, len = createDebug.names.length; i < len; i++) {
            if (createDebug.names[i].test(name)) {
              return true;
            }
          }
          return false;
        }
        function toNamespace(regexp) {
          return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
        }
        function coerce(val) {
          if (val instanceof Error) {
            return val.stack || val.message;
          }
          return val;
        }
        function destroy() {
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
        createDebug.enable(createDebug.load());
        return createDebug;
      }
      module.exports = setup;
    }
  });

  // ../../node_modules/debug/src/browser.js
  var require_browser = __commonJS({
    "../../node_modules/debug/src/browser.js"(exports, module) {
      exports.formatArgs = formatArgs;
      exports.save = save;
      exports.load = load;
      exports.useColors = useColors;
      exports.storage = localstorage();
      exports.destroy = (() => {
        let warned = false;
        return () => {
          if (!warned) {
            warned = true;
            console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
          }
        };
      })();
      exports.colors = [
        "#0000CC",
        "#0000FF",
        "#0033CC",
        "#0033FF",
        "#0066CC",
        "#0066FF",
        "#0099CC",
        "#0099FF",
        "#00CC00",
        "#00CC33",
        "#00CC66",
        "#00CC99",
        "#00CCCC",
        "#00CCFF",
        "#3300CC",
        "#3300FF",
        "#3333CC",
        "#3333FF",
        "#3366CC",
        "#3366FF",
        "#3399CC",
        "#3399FF",
        "#33CC00",
        "#33CC33",
        "#33CC66",
        "#33CC99",
        "#33CCCC",
        "#33CCFF",
        "#6600CC",
        "#6600FF",
        "#6633CC",
        "#6633FF",
        "#66CC00",
        "#66CC33",
        "#9900CC",
        "#9900FF",
        "#9933CC",
        "#9933FF",
        "#99CC00",
        "#99CC33",
        "#CC0000",
        "#CC0033",
        "#CC0066",
        "#CC0099",
        "#CC00CC",
        "#CC00FF",
        "#CC3300",
        "#CC3333",
        "#CC3366",
        "#CC3399",
        "#CC33CC",
        "#CC33FF",
        "#CC6600",
        "#CC6633",
        "#CC9900",
        "#CC9933",
        "#CCCC00",
        "#CCCC33",
        "#FF0000",
        "#FF0033",
        "#FF0066",
        "#FF0099",
        "#FF00CC",
        "#FF00FF",
        "#FF3300",
        "#FF3333",
        "#FF3366",
        "#FF3399",
        "#FF33CC",
        "#FF33FF",
        "#FF6600",
        "#FF6633",
        "#FF9900",
        "#FF9933",
        "#FFCC00",
        "#FFCC33"
      ];
      function useColors() {
        if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
          return true;
        }
        if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
          return false;
        }
        return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
      }
      function formatArgs(args) {
        args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
        if (!this.useColors) {
          return;
        }
        const c = "color: " + this.color;
        args.splice(1, 0, c, "color: inherit");
        let index = 0;
        let lastC = 0;
        args[0].replace(/%[a-zA-Z%]/g, (match) => {
          if (match === "%%") {
            return;
          }
          index++;
          if (match === "%c") {
            lastC = index;
          }
        });
        args.splice(lastC, 0, c);
      }
      exports.log = console.debug || console.log || (() => {
      });
      function save(namespaces) {
        try {
          if (namespaces) {
            exports.storage.setItem("debug", namespaces);
          } else {
            exports.storage.removeItem("debug");
          }
        } catch (error) {
        }
      }
      function load() {
        let r;
        try {
          r = exports.storage.getItem("debug");
        } catch (error) {
        }
        if (!r && typeof process !== "undefined" && "env" in process) {
          r = process.env.DEBUG;
        }
        return r;
      }
      function localstorage() {
        try {
          return localStorage;
        } catch (error) {
        }
      }
      module.exports = require_common()(exports);
      var { formatters } = module.exports;
      formatters.j = function(v) {
        try {
          return JSON.stringify(v);
        } catch (error) {
          return "[UnexpectedJSONParseError]: " + error.message;
        }
      };
    }
  });

  // ../../node_modules/@wapc/host/dist/src/debug.js
  var require_debug = __commonJS({
    "../../node_modules/@wapc/host/dist/src/debug.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.debug = void 0;
      var debug_1 = __importDefault(require_browser());
      var _debug = debug_1.default("wapc");
      function debug(cb) {
        if (_debug.enabled) {
          const params = cb();
          _debug(...params);
        }
      }
      exports.debug = debug;
    }
  });

  // ../../node_modules/@wapc/host/dist/src/callbacks.js
  var require_callbacks = __commonJS({
    "../../node_modules/@wapc/host/dist/src/callbacks.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.generateWASIImports = exports.generateWapcImports = void 0;
      var debug_1 = require_debug();
      function generateWapcImports(instance) {
        return {
          __console_log(ptr, len) {
            debug_1.debug(() => ["__console_log %o bytes @ %o", len, ptr]);
            const buffer = new Uint8Array(instance.getCallerMemory().buffer);
            const bytes = buffer.slice(ptr, ptr + len);
            console.log(instance.textDecoder.decode(bytes));
          },
          __host_call(bd_ptr, bd_len, ns_ptr, ns_len, op_ptr, op_len, ptr, len) {
            debug_1.debug(() => ["__host_call"]);
            const mem = instance.getCallerMemory();
            const buffer = new Uint8Array(mem.buffer);
            const binding = instance.textDecoder.decode(buffer.slice(bd_ptr, bd_ptr + bd_len));
            const namespace = instance.textDecoder.decode(buffer.slice(ns_ptr, ns_ptr + ns_len));
            const operation = instance.textDecoder.decode(buffer.slice(op_ptr, op_ptr + op_len));
            const bytes = buffer.slice(ptr, ptr + len);
            debug_1.debug(() => ["host_call(%o,%o,%o,[%o bytes])", binding, namespace, operation, bytes.length]);
            instance.state.hostError = void 0;
            instance.state.hostResponse = void 0;
            try {
              const result = instance.state.hostCallback(binding, namespace, operation, bytes);
              instance.state.hostResponse = result;
              return 1;
            } catch (e) {
              instance.state.hostError = e.toString();
              return 0;
            }
          },
          __host_response(ptr) {
            debug_1.debug(() => ["__host_response ptr: %o", ptr]);
            if (instance.state.hostResponse) {
              const buffer = new Uint8Array(instance.getCallerMemory().buffer);
              buffer.set(instance.state.hostResponse, ptr);
            }
          },
          __host_response_len() {
            var _a;
            const len = ((_a = instance.state.hostResponse) === null || _a === void 0 ? void 0 : _a.length) || 0;
            debug_1.debug(() => ["__host_response_len %o", len]);
            return len;
          },
          __host_error_len() {
            var _a;
            const len = ((_a = instance.state.hostError) === null || _a === void 0 ? void 0 : _a.length) || 0;
            debug_1.debug(() => ["__host_error_len ptr: %o", len]);
            return len;
          },
          __host_error(ptr) {
            debug_1.debug(() => ["__host_error %o", ptr]);
            if (instance.state.hostError) {
              debug_1.debug(() => ["__host_error writing to mem: %o", instance.state.hostError]);
              const buffer = new Uint8Array(instance.getCallerMemory().buffer);
              buffer.set(instance.textEncoder.encode(instance.state.hostError), ptr);
            }
          },
          __guest_response(ptr, len) {
            debug_1.debug(() => ["__guest_response %o bytes @ %o", len, ptr]);
            instance.state.guestError = void 0;
            const buffer = new Uint8Array(instance.getCallerMemory().buffer);
            const bytes = buffer.slice(ptr, ptr + len);
            instance.state.guestResponse = bytes;
          },
          __guest_error(ptr, len) {
            debug_1.debug(() => ["__guest_error %o bytes @ %o", len, ptr]);
            const buffer = new Uint8Array(instance.getCallerMemory().buffer);
            const bytes = buffer.slice(ptr, ptr + len);
            const message = instance.textDecoder.decode(bytes);
            instance.state.guestError = message;
          },
          __guest_request(op_ptr, ptr) {
            debug_1.debug(() => ["__guest_request op: %o, ptr: %o", op_ptr, ptr]);
            const invocation = instance.state.guestRequest;
            if (invocation) {
              const memory = instance.getCallerMemory();
              debug_1.debug(() => ["writing invocation (%o,[%o bytes])", invocation.operation, invocation.msg.length]);
              const buffer = new Uint8Array(memory.buffer);
              buffer.set(invocation.operationEncoded, op_ptr);
              buffer.set(invocation.msg, ptr);
            } else {
              throw new Error("__guest_request called without an invocation present. This is probably a bug in the library using @wapc/host.");
            }
          }
        };
      }
      exports.generateWapcImports = generateWapcImports;
      function generateWASIImports(instance) {
        return {
          __fd_write(fileDescriptor, iovsPtr, iovsLen, writtenPtr) {
            if (fileDescriptor != 1) {
              return 0;
            }
            const memory = instance.getCallerMemory();
            const dv = new DataView(memory.buffer);
            const heap = new Uint8Array(memory.buffer);
            let bytesWritten = 0;
            while (iovsLen > 0) {
              iovsLen--;
              const base = dv.getUint32(iovsPtr, true);
              iovsPtr += 4;
              const length = dv.getUint32(iovsPtr, true);
              iovsPtr += 4;
              const stringBytes = heap.slice(base, base + length);
              instance.state.writer(instance.textDecoder.decode(stringBytes));
              bytesWritten += length;
            }
            dv.setUint32(writtenPtr, bytesWritten, true);
            return bytesWritten;
          }
        };
      }
      exports.generateWASIImports = generateWASIImports;
    }
  });

  // ../../node_modules/@wapc/host/dist/src/errors.js
  var require_errors = __commonJS({
    "../../node_modules/@wapc/host/dist/src/errors.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StreamingFailure = exports.InvalidWasm = exports.HostCallNotImplementedError = void 0;
      var TestableError = class extends Error {
        matcher() {
          return new RegExp(this.toString().replace(/^Error: /, ""));
        }
      };
      var HostCallNotImplementedError = class extends TestableError {
        constructor(binding, namespace, operation) {
          super(`Host call not implemented. Guest called host with binding = '${binding}', namespace = '${namespace}', & operation = '${operation}'`);
        }
      };
      exports.HostCallNotImplementedError = HostCallNotImplementedError;
      var InvalidWasm = class extends TestableError {
        constructor(error) {
          super(`Invalid wasm binary: ${error.message}`);
        }
      };
      exports.InvalidWasm = InvalidWasm;
      var StreamingFailure = class extends TestableError {
        constructor(error) {
          super(`Could not instantiate from Response object: ${error.message}`);
        }
      };
      exports.StreamingFailure = StreamingFailure;
    }
  });

  // ../../node_modules/@wapc/host/dist/src/wapc-host.js
  var require_wapc_host = __commonJS({
    "../../node_modules/@wapc/host/dist/src/wapc-host.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.instantiateStreaming = exports.instantiate = exports.WapcHost = void 0;
      var debug_1 = require_debug();
      var _1 = require_src();
      var callbacks_1 = require_callbacks();
      var errors_1 = require_errors();
      var START = "_start";
      var WAPC_INIT = "wapc_init";
      var GUEST_CALL = "__guest_call";
      var ModuleState = class {
        constructor(hostCall, writer) {
          this.hostCallback = hostCall || ((binding, namespace, operation) => {
            throw new errors_1.HostCallNotImplementedError(binding, namespace, operation);
          });
          this.writer = writer || (() => void 0);
        }
      };
      var WapcHost = class {
        constructor(hostCall, writer) {
          this.state = new ModuleState(hostCall, writer);
          this.textEncoder = new TextEncoder();
          this.textDecoder = new TextDecoder("utf-8");
          this.guestCall = () => void 0;
        }
        async instantiate(source) {
          const imports = this.getImports();
          const result = await WebAssembly.instantiate(source, imports).catch((e) => {
            throw new _1.errors.InvalidWasm(e);
          });
          this.initialize(result.instance);
          return this;
        }
        async instantiateStreaming(source) {
          const imports = this.getImports();
          if (!WebAssembly.instantiateStreaming) {
            debug_1.debug(() => [
              "WebAssembly.instantiateStreaming is not supported on this browser, wasm execution will be impacted."
            ]);
            const bytes = new Uint8Array(await (await source).arrayBuffer());
            return this.instantiate(bytes);
          } else {
            const result = await WebAssembly.instantiateStreaming(source, imports).catch((e) => {
              throw new _1.errors.StreamingFailure(e);
            });
            this.initialize(result.instance);
            return this;
          }
        }
        getImports() {
          const wasiImports = callbacks_1.generateWASIImports(this);
          return {
            wapc: callbacks_1.generateWapcImports(this),
            wasi: wasiImports,
            wasi_unstable: wasiImports
          };
        }
        initialize(instance) {
          this.instance = instance;
          const start = this.instance.exports[START];
          if (start != null) {
            start([]);
          }
          const init = this.instance.exports[WAPC_INIT];
          if (init != null) {
            init([]);
          }
          this.guestCall = this.instance.exports[GUEST_CALL];
          if (this.guestCall == null) {
            throw new Error("WebAssembly module does not export __guest_call");
          }
        }
        async invoke(operation, payload) {
          debug_1.debug(() => [`invoke(%o, [%o bytes]`, operation, payload.length]);
          const operationEncoded = this.textEncoder.encode(operation);
          this.state.guestRequest = { operation, operationEncoded, msg: payload };
          const result = this.guestCall(operationEncoded.length, payload.length);
          if (result === 0) {
            throw new Error(this.state.guestError);
          } else {
            if (!this.state.guestResponse) {
              throw new Error("Guest call succeeded, but guest response not set. This is a bug in @wapc/host");
            } else {
              return this.state.guestResponse;
            }
          }
        }
        getCallerMemory() {
          return this.instance.exports.memory;
        }
      };
      exports.WapcHost = WapcHost;
      async function instantiate(source, hostCall, writer) {
        const host = new WapcHost(hostCall, writer);
        return host.instantiate(source);
      }
      exports.instantiate = instantiate;
      async function instantiateStreaming(source, hostCall, writer) {
        const host = new WapcHost(hostCall, writer);
        return host.instantiateStreaming(await source);
      }
      exports.instantiateStreaming = instantiateStreaming;
    }
  });

  // ../../node_modules/@wapc/host/dist/src/index.js
  var require_src = __commonJS({
    "../../node_modules/@wapc/host/dist/src/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.errors = exports.WapcHost = exports.instantiateStreaming = exports.instantiate = void 0;
      var wapc_host_1 = require_wapc_host();
      Object.defineProperty(exports, "instantiate", { enumerable: true, get: function() {
        return wapc_host_1.instantiate;
      } });
      Object.defineProperty(exports, "instantiateStreaming", { enumerable: true, get: function() {
        return wapc_host_1.instantiateStreaming;
      } });
      Object.defineProperty(exports, "WapcHost", { enumerable: true, get: function() {
        return wapc_host_1.WapcHost;
      } });
      exports.errors = __importStar(require_errors());
    }
  });

  // ../../dist/src/wasmbus.js
  var require_wasmbus = __commonJS({
    "../../dist/src/wasmbus.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Wasmbus = exports.instantiate = void 0;
      var host_1 = require_src();
      async function instantiate(source, hostCall, writer) {
        const host = new Wasmbus(hostCall, writer);
        return host.instantiate(source);
      }
      exports.instantiate = instantiate;
      var Wasmbus = class extends host_1.WapcHost {
        constructor(hostCall, writer) {
          super(hostCall, writer);
        }
        async instantiate(source) {
          const imports = super.getImports();
          const result = await WebAssembly.instantiate(source, {
            wasmbus: imports.wapc,
            wasi: imports.wasi,
            wasi_unstable: imports.wasi_unstable
          }).catch((e) => {
            throw new Error(`Invalid wasm binary: ${e.message}`);
          });
          super.initialize(result.instance);
          return this;
        }
      };
      exports.Wasmbus = Wasmbus;
    }
  });

  // ../../dist/src/util.js
  var require_util4 = __commonJS({
    "../../dist/src/util.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.jsonDecode = exports.jsonEncode = exports.parseJwt = exports.uuidv4 = void 0;
      var nats_ws_1 = require_nats2();
      var jc = nats_ws_1.JSONCodec();
      function uuidv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
          return v.toString(16);
        });
      }
      exports.uuidv4 = uuidv4;
      function parseJwt(token) {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        var jsonPayload = decodeURIComponent(atob(base64).split("").map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
        return JSON.parse(jsonPayload);
      }
      exports.parseJwt = parseJwt;
      function jsonEncode(data) {
        return jc.encode(data);
      }
      exports.jsonEncode = jsonEncode;
      function jsonDecode(data) {
        return jc.decode(data);
      }
      exports.jsonDecode = jsonDecode;
    }
  });

  // ../../dist/src/events.js
  var require_events = __commonJS({
    "../../dist/src/events.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createEventMessage = exports.EventType = void 0;
      var util_1 = require_util4();
      var EventType;
      (function(EventType2) {
        EventType2["ActorStarted"] = "com.wasmcloud.lattice.actor_started";
        EventType2["ActorStopped"] = "com.wasmcloud.lattice.actor_stopped";
        EventType2["HeartBeat"] = "com.wasmcloud.lattice.host_heartbeat";
        EventType2["HealthCheckPass"] = "com.wasmcloud.lattice.health_check_passed";
        EventType2["HostStarted"] = "com.wasmcloud.lattice.host_started";
      })(EventType = exports.EventType || (exports.EventType = {}));
      function createEventMessage(hostKey, eventType, data) {
        return {
          data,
          datacontenttype: "application/json",
          id: util_1.uuidv4(),
          source: hostKey,
          specversion: "1.0",
          time: new Date().toISOString(),
          type: eventType
        };
      }
      exports.createEventMessage = createEventMessage;
    }
  });

  // ../../dist/src/actor.js
  var require_actor = __commonJS({
    "../../dist/src/actor.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.startActor = exports.Actor = void 0;
      var msgpack_1 = require_dist();
      var wasmbus_1 = require_wasmbus();
      var events_1 = require_events();
      var util_1 = require_util4();
      var Actor = class {
        constructor(hostName = "default", hostKey, wasm, invocationCallback, hostCall, writer) {
          this.key = "";
          this.hostName = hostName;
          this.hostKey = hostKey;
          this.claims = {
            jti: "",
            iat: 0,
            iss: "",
            sub: "",
            wascap: {
              name: "",
              hash: "",
              tags: [],
              caps: [],
              ver: "",
              prov: false
            }
          };
          this.wasm = wasm;
          this.invocationCallback = invocationCallback;
          this.hostCall = hostCall;
          this.writer = writer;
        }
        async startActor(actorBuffer) {
          const token = await this.wasm.extract_jwt(actorBuffer);
          const valid = await this.wasm.validate_jwt(token);
          if (!valid) {
            throw new Error("invalid token");
          }
          this.claims = util_1.parseJwt(token);
          this.key = this.claims.sub;
          this.module = await wasmbus_1.instantiate(actorBuffer, this.hostCall, this.writer);
        }
        async stopActor(natsConn) {
          const actorToStop = {
            host_id: this.hostKey,
            actor_ref: this.key
          };
          natsConn.publish(`wasmbus.ctl.${this.hostName}.cmd.${this.hostKey}.sa`, util_1.jsonEncode(actorToStop));
        }
        async publishActorStarted(natsConn) {
          const claims = {
            call_alias: "",
            caps: this.claims.wascap.caps[0],
            iss: this.claims.iss,
            name: this.claims.wascap.name,
            rev: "1",
            sub: this.claims.sub,
            tags: "",
            version: this.claims.wascap.ver
          };
          natsConn.publish(`lc.${this.hostName}.claims.${this.key}`, util_1.jsonEncode(claims));
          const actorStarted = {
            api_version: 0,
            instance_id: util_1.uuidv4(),
            public_key: this.key
          };
          natsConn.publish(`wasmbus.evt.${this.hostName}`, util_1.jsonEncode(events_1.createEventMessage(this.hostKey, events_1.EventType.ActorStarted, actorStarted)));
          const actorHealthCheck = {
            instance_id: util_1.uuidv4(),
            public_key: this.key
          };
          natsConn.publish(`wasmbus.evt.${this.hostName}`, util_1.jsonEncode(events_1.createEventMessage(this.hostKey, events_1.EventType.HealthCheckPass, actorHealthCheck)));
        }
        async subscribeInvocations(natsConn) {
          const invocationsTopic = natsConn.subscribe(`wasmbus.rpc.${this.hostName}.${this.key}`);
          for await (const invocationMessage of invocationsTopic) {
            const invocationData = msgpack_1.decode(invocationMessage.data);
            const invocation = invocationData;
            const invocationResult = await this.module.invoke(invocation.operation, invocation.msg);
            invocationMessage.respond(msgpack_1.encode({
              invocation_id: invocationData.id,
              instance_id: util_1.uuidv4(),
              msg: invocationResult
            }));
            if (this.invocationCallback) {
              this.invocationCallback(invocationResult);
            }
          }
          throw new Error("actor.inovcation subscription closed");
        }
      };
      exports.Actor = Actor;
      async function startActor(hostName, hostKey, actorModule, natsConn, wasm, invocationCallback, hostCall, writer) {
        const actor = new Actor(hostName, hostKey, wasm, invocationCallback, hostCall, writer);
        await actor.startActor(actorModule);
        await actor.publishActorStarted(natsConn);
        Promise.all([actor.subscribeInvocations(natsConn)]).catch((err) => {
          throw err;
        });
        return actor;
      }
      exports.startActor = startActor;
    }
  });

  // ../../node_modules/axios/lib/helpers/bind.js
  var require_bind = __commonJS({
    "../../node_modules/axios/lib/helpers/bind.js"(exports, module) {
      "use strict";
      module.exports = function bind(fn, thisArg) {
        return function wrap() {
          var args = new Array(arguments.length);
          for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
          }
          return fn.apply(thisArg, args);
        };
      };
    }
  });

  // ../../node_modules/axios/lib/utils.js
  var require_utils = __commonJS({
    "../../node_modules/axios/lib/utils.js"(exports, module) {
      "use strict";
      var bind = require_bind();
      var toString = Object.prototype.toString;
      function isArray(val) {
        return toString.call(val) === "[object Array]";
      }
      function isUndefined(val) {
        return typeof val === "undefined";
      }
      function isBuffer(val) {
        return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
      }
      function isArrayBuffer(val) {
        return toString.call(val) === "[object ArrayBuffer]";
      }
      function isFormData(val) {
        return typeof FormData !== "undefined" && val instanceof FormData;
      }
      function isArrayBufferView(val) {
        var result;
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
          result = ArrayBuffer.isView(val);
        } else {
          result = val && val.buffer && val.buffer instanceof ArrayBuffer;
        }
        return result;
      }
      function isString(val) {
        return typeof val === "string";
      }
      function isNumber(val) {
        return typeof val === "number";
      }
      function isObject(val) {
        return val !== null && typeof val === "object";
      }
      function isPlainObject(val) {
        if (toString.call(val) !== "[object Object]") {
          return false;
        }
        var prototype = Object.getPrototypeOf(val);
        return prototype === null || prototype === Object.prototype;
      }
      function isDate(val) {
        return toString.call(val) === "[object Date]";
      }
      function isFile(val) {
        return toString.call(val) === "[object File]";
      }
      function isBlob(val) {
        return toString.call(val) === "[object Blob]";
      }
      function isFunction(val) {
        return toString.call(val) === "[object Function]";
      }
      function isStream(val) {
        return isObject(val) && isFunction(val.pipe);
      }
      function isURLSearchParams(val) {
        return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
      }
      function trim(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
      }
      function isStandardBrowserEnv() {
        if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
          return false;
        }
        return typeof window !== "undefined" && typeof document !== "undefined";
      }
      function forEach(obj, fn) {
        if (obj === null || typeof obj === "undefined") {
          return;
        }
        if (typeof obj !== "object") {
          obj = [obj];
        }
        if (isArray(obj)) {
          for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
          }
        } else {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              fn.call(null, obj[key], key, obj);
            }
          }
        }
      }
      function merge() {
        var result = {};
        function assignValue(val, key) {
          if (isPlainObject(result[key]) && isPlainObject(val)) {
            result[key] = merge(result[key], val);
          } else if (isPlainObject(val)) {
            result[key] = merge({}, val);
          } else if (isArray(val)) {
            result[key] = val.slice();
          } else {
            result[key] = val;
          }
        }
        for (var i = 0, l = arguments.length; i < l; i++) {
          forEach(arguments[i], assignValue);
        }
        return result;
      }
      function extend(a, b, thisArg) {
        forEach(b, function assignValue(val, key) {
          if (thisArg && typeof val === "function") {
            a[key] = bind(val, thisArg);
          } else {
            a[key] = val;
          }
        });
        return a;
      }
      function stripBOM(content) {
        if (content.charCodeAt(0) === 65279) {
          content = content.slice(1);
        }
        return content;
      }
      module.exports = {
        isArray,
        isArrayBuffer,
        isBuffer,
        isFormData,
        isArrayBufferView,
        isString,
        isNumber,
        isObject,
        isPlainObject,
        isUndefined,
        isDate,
        isFile,
        isBlob,
        isFunction,
        isStream,
        isURLSearchParams,
        isStandardBrowserEnv,
        forEach,
        merge,
        extend,
        trim,
        stripBOM
      };
    }
  });

  // ../../node_modules/axios/lib/helpers/buildURL.js
  var require_buildURL = __commonJS({
    "../../node_modules/axios/lib/helpers/buildURL.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      function encode(val) {
        return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      module.exports = function buildURL(url, params, paramsSerializer) {
        if (!params) {
          return url;
        }
        var serializedParams;
        if (paramsSerializer) {
          serializedParams = paramsSerializer(params);
        } else if (utils.isURLSearchParams(params)) {
          serializedParams = params.toString();
        } else {
          var parts = [];
          utils.forEach(params, function serialize(val, key) {
            if (val === null || typeof val === "undefined") {
              return;
            }
            if (utils.isArray(val)) {
              key = key + "[]";
            } else {
              val = [val];
            }
            utils.forEach(val, function parseValue(v) {
              if (utils.isDate(v)) {
                v = v.toISOString();
              } else if (utils.isObject(v)) {
                v = JSON.stringify(v);
              }
              parts.push(encode(key) + "=" + encode(v));
            });
          });
          serializedParams = parts.join("&");
        }
        if (serializedParams) {
          var hashmarkIndex = url.indexOf("#");
          if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
          }
          url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
        }
        return url;
      };
    }
  });

  // ../../node_modules/axios/lib/core/InterceptorManager.js
  var require_InterceptorManager = __commonJS({
    "../../node_modules/axios/lib/core/InterceptorManager.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      function InterceptorManager() {
        this.handlers = [];
      }
      InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
        this.handlers.push({
          fulfilled,
          rejected,
          synchronous: options ? options.synchronous : false,
          runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
      };
      InterceptorManager.prototype.eject = function eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      };
      InterceptorManager.prototype.forEach = function forEach(fn) {
        utils.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      };
      module.exports = InterceptorManager;
    }
  });

  // ../../node_modules/axios/lib/helpers/normalizeHeaderName.js
  var require_normalizeHeaderName = __commonJS({
    "../../node_modules/axios/lib/helpers/normalizeHeaderName.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      module.exports = function normalizeHeaderName(headers, normalizedName) {
        utils.forEach(headers, function processHeader(value, name) {
          if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = value;
            delete headers[name];
          }
        });
      };
    }
  });

  // ../../node_modules/axios/lib/core/enhanceError.js
  var require_enhanceError = __commonJS({
    "../../node_modules/axios/lib/core/enhanceError.js"(exports, module) {
      "use strict";
      module.exports = function enhanceError(error, config, code, request, response) {
        error.config = config;
        if (code) {
          error.code = code;
        }
        error.request = request;
        error.response = response;
        error.isAxiosError = true;
        error.toJSON = function toJSON() {
          return {
            message: this.message,
            name: this.name,
            description: this.description,
            number: this.number,
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            config: this.config,
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null
          };
        };
        return error;
      };
    }
  });

  // ../../node_modules/axios/lib/core/createError.js
  var require_createError = __commonJS({
    "../../node_modules/axios/lib/core/createError.js"(exports, module) {
      "use strict";
      var enhanceError = require_enhanceError();
      module.exports = function createError(message, config, code, request, response) {
        var error = new Error(message);
        return enhanceError(error, config, code, request, response);
      };
    }
  });

  // ../../node_modules/axios/lib/core/settle.js
  var require_settle = __commonJS({
    "../../node_modules/axios/lib/core/settle.js"(exports, module) {
      "use strict";
      var createError = require_createError();
      module.exports = function settle(resolve, reject, response) {
        var validateStatus = response.config.validateStatus;
        if (!response.status || !validateStatus || validateStatus(response.status)) {
          resolve(response);
        } else {
          reject(createError(
            "Request failed with status code " + response.status,
            response.config,
            null,
            response.request,
            response
          ));
        }
      };
    }
  });

  // ../../node_modules/axios/lib/helpers/cookies.js
  var require_cookies = __commonJS({
    "../../node_modules/axios/lib/helpers/cookies.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + "=" + encodeURIComponent(value));
            if (utils.isNumber(expires)) {
              cookie.push("expires=" + new Date(expires).toGMTString());
            }
            if (utils.isString(path)) {
              cookie.push("path=" + path);
            }
            if (utils.isString(domain)) {
              cookie.push("domain=" + domain);
            }
            if (secure === true) {
              cookie.push("secure");
            }
            document.cookie = cookie.join("; ");
          },
          read: function read(name) {
            var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
            return match ? decodeURIComponent(match[3]) : null;
          },
          remove: function remove(name) {
            this.write(name, "", Date.now() - 864e5);
          }
        };
      }() : function nonStandardBrowserEnv() {
        return {
          write: function write() {
          },
          read: function read() {
            return null;
          },
          remove: function remove() {
          }
        };
      }();
    }
  });

  // ../../node_modules/axios/lib/helpers/isAbsoluteURL.js
  var require_isAbsoluteURL = __commonJS({
    "../../node_modules/axios/lib/helpers/isAbsoluteURL.js"(exports, module) {
      "use strict";
      module.exports = function isAbsoluteURL(url) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
      };
    }
  });

  // ../../node_modules/axios/lib/helpers/combineURLs.js
  var require_combineURLs = __commonJS({
    "../../node_modules/axios/lib/helpers/combineURLs.js"(exports, module) {
      "use strict";
      module.exports = function combineURLs(baseURL, relativeURL) {
        return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
      };
    }
  });

  // ../../node_modules/axios/lib/core/buildFullPath.js
  var require_buildFullPath = __commonJS({
    "../../node_modules/axios/lib/core/buildFullPath.js"(exports, module) {
      "use strict";
      var isAbsoluteURL = require_isAbsoluteURL();
      var combineURLs = require_combineURLs();
      module.exports = function buildFullPath(baseURL, requestedURL) {
        if (baseURL && !isAbsoluteURL(requestedURL)) {
          return combineURLs(baseURL, requestedURL);
        }
        return requestedURL;
      };
    }
  });

  // ../../node_modules/axios/lib/helpers/parseHeaders.js
  var require_parseHeaders = __commonJS({
    "../../node_modules/axios/lib/helpers/parseHeaders.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var ignoreDuplicateOf = [
        "age",
        "authorization",
        "content-length",
        "content-type",
        "etag",
        "expires",
        "from",
        "host",
        "if-modified-since",
        "if-unmodified-since",
        "last-modified",
        "location",
        "max-forwards",
        "proxy-authorization",
        "referer",
        "retry-after",
        "user-agent"
      ];
      module.exports = function parseHeaders(headers) {
        var parsed = {};
        var key;
        var val;
        var i;
        if (!headers) {
          return parsed;
        }
        utils.forEach(headers.split("\n"), function parser(line) {
          i = line.indexOf(":");
          key = utils.trim(line.substr(0, i)).toLowerCase();
          val = utils.trim(line.substr(i + 1));
          if (key) {
            if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
              return;
            }
            if (key === "set-cookie") {
              parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
            } else {
              parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
            }
          }
        });
        return parsed;
      };
    }
  });

  // ../../node_modules/axios/lib/helpers/isURLSameOrigin.js
  var require_isURLSameOrigin = __commonJS({
    "../../node_modules/axios/lib/helpers/isURLSameOrigin.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement("a");
        var originURL;
        function resolveURL(url) {
          var href = url;
          if (msie) {
            urlParsingNode.setAttribute("href", href);
            href = urlParsingNode.href;
          }
          urlParsingNode.setAttribute("href", href);
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
          };
        }
        originURL = resolveURL(window.location.href);
        return function isURLSameOrigin(requestURL) {
          var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
          return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
        };
      }() : function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      }();
    }
  });

  // ../../node_modules/axios/lib/cancel/Cancel.js
  var require_Cancel = __commonJS({
    "../../node_modules/axios/lib/cancel/Cancel.js"(exports, module) {
      "use strict";
      function Cancel(message) {
        this.message = message;
      }
      Cancel.prototype.toString = function toString() {
        return "Cancel" + (this.message ? ": " + this.message : "");
      };
      Cancel.prototype.__CANCEL__ = true;
      module.exports = Cancel;
    }
  });

  // ../../node_modules/axios/lib/adapters/xhr.js
  var require_xhr = __commonJS({
    "../../node_modules/axios/lib/adapters/xhr.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var settle = require_settle();
      var cookies = require_cookies();
      var buildURL = require_buildURL();
      var buildFullPath = require_buildFullPath();
      var parseHeaders = require_parseHeaders();
      var isURLSameOrigin = require_isURLSameOrigin();
      var createError = require_createError();
      var defaults = require_defaults();
      var Cancel = require_Cancel();
      module.exports = function xhrAdapter(config) {
        return new Promise(function dispatchXhrRequest(resolve, reject) {
          var requestData = config.data;
          var requestHeaders = config.headers;
          var responseType = config.responseType;
          var onCanceled;
          function done() {
            if (config.cancelToken) {
              config.cancelToken.unsubscribe(onCanceled);
            }
            if (config.signal) {
              config.signal.removeEventListener("abort", onCanceled);
            }
          }
          if (utils.isFormData(requestData)) {
            delete requestHeaders["Content-Type"];
          }
          var request = new XMLHttpRequest();
          if (config.auth) {
            var username = config.auth.username || "";
            var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
            requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
          }
          var fullPath = buildFullPath(config.baseURL, config.url);
          request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
          request.timeout = config.timeout;
          function onloadend() {
            if (!request) {
              return;
            }
            var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
            var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
            var response = {
              data: responseData,
              status: request.status,
              statusText: request.statusText,
              headers: responseHeaders,
              config,
              request
            };
            settle(function _resolve(value) {
              resolve(value);
              done();
            }, function _reject(err) {
              reject(err);
              done();
            }, response);
            request = null;
          }
          if ("onloadend" in request) {
            request.onloadend = onloadend;
          } else {
            request.onreadystatechange = function handleLoad() {
              if (!request || request.readyState !== 4) {
                return;
              }
              if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
                return;
              }
              setTimeout(onloadend);
            };
          }
          request.onabort = function handleAbort() {
            if (!request) {
              return;
            }
            reject(createError("Request aborted", config, "ECONNABORTED", request));
            request = null;
          };
          request.onerror = function handleError() {
            reject(createError("Network Error", config, null, request));
            request = null;
          };
          request.ontimeout = function handleTimeout() {
            var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
            var transitional = config.transitional || defaults.transitional;
            if (config.timeoutErrorMessage) {
              timeoutErrorMessage = config.timeoutErrorMessage;
            }
            reject(createError(
              timeoutErrorMessage,
              config,
              transitional.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
              request
            ));
            request = null;
          };
          if (utils.isStandardBrowserEnv()) {
            var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
            if (xsrfValue) {
              requestHeaders[config.xsrfHeaderName] = xsrfValue;
            }
          }
          if ("setRequestHeader" in request) {
            utils.forEach(requestHeaders, function setRequestHeader(val, key) {
              if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
                delete requestHeaders[key];
              } else {
                request.setRequestHeader(key, val);
              }
            });
          }
          if (!utils.isUndefined(config.withCredentials)) {
            request.withCredentials = !!config.withCredentials;
          }
          if (responseType && responseType !== "json") {
            request.responseType = config.responseType;
          }
          if (typeof config.onDownloadProgress === "function") {
            request.addEventListener("progress", config.onDownloadProgress);
          }
          if (typeof config.onUploadProgress === "function" && request.upload) {
            request.upload.addEventListener("progress", config.onUploadProgress);
          }
          if (config.cancelToken || config.signal) {
            onCanceled = function(cancel) {
              if (!request) {
                return;
              }
              reject(!cancel || cancel && cancel.type ? new Cancel("canceled") : cancel);
              request.abort();
              request = null;
            };
            config.cancelToken && config.cancelToken.subscribe(onCanceled);
            if (config.signal) {
              config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
            }
          }
          if (!requestData) {
            requestData = null;
          }
          request.send(requestData);
        });
      };
    }
  });

  // ../../node_modules/axios/lib/defaults.js
  var require_defaults = __commonJS({
    "../../node_modules/axios/lib/defaults.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var normalizeHeaderName = require_normalizeHeaderName();
      var enhanceError = require_enhanceError();
      var DEFAULT_CONTENT_TYPE = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      function setContentTypeIfUnset(headers, value) {
        if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
          headers["Content-Type"] = value;
        }
      }
      function getDefaultAdapter() {
        var adapter;
        if (typeof XMLHttpRequest !== "undefined") {
          adapter = require_xhr();
        } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
          adapter = require_xhr();
        }
        return adapter;
      }
      function stringifySafely(rawValue, parser, encoder) {
        if (utils.isString(rawValue)) {
          try {
            (parser || JSON.parse)(rawValue);
            return utils.trim(rawValue);
          } catch (e) {
            if (e.name !== "SyntaxError") {
              throw e;
            }
          }
        }
        return (encoder || JSON.stringify)(rawValue);
      }
      var defaults = {
        transitional: {
          silentJSONParsing: true,
          forcedJSONParsing: true,
          clarifyTimeoutError: false
        },
        adapter: getDefaultAdapter(),
        transformRequest: [function transformRequest(data, headers) {
          normalizeHeaderName(headers, "Accept");
          normalizeHeaderName(headers, "Content-Type");
          if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
            return data;
          }
          if (utils.isArrayBufferView(data)) {
            return data.buffer;
          }
          if (utils.isURLSearchParams(data)) {
            setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
            return data.toString();
          }
          if (utils.isObject(data) || headers && headers["Content-Type"] === "application/json") {
            setContentTypeIfUnset(headers, "application/json");
            return stringifySafely(data);
          }
          return data;
        }],
        transformResponse: [function transformResponse(data) {
          var transitional = this.transitional || defaults.transitional;
          var silentJSONParsing = transitional && transitional.silentJSONParsing;
          var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
          var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
          if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
            try {
              return JSON.parse(data);
            } catch (e) {
              if (strictJSONParsing) {
                if (e.name === "SyntaxError") {
                  throw enhanceError(e, this, "E_JSON_PARSE");
                }
                throw e;
              }
            }
          }
          return data;
        }],
        timeout: 0,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        maxBodyLength: -1,
        validateStatus: function validateStatus(status) {
          return status >= 200 && status < 300;
        },
        headers: {
          common: {
            "Accept": "application/json, text/plain, */*"
          }
        }
      };
      utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
        defaults.headers[method] = {};
      });
      utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
        defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
      });
      module.exports = defaults;
    }
  });

  // ../../node_modules/axios/lib/core/transformData.js
  var require_transformData = __commonJS({
    "../../node_modules/axios/lib/core/transformData.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var defaults = require_defaults();
      module.exports = function transformData(data, headers, fns) {
        var context = this || defaults;
        utils.forEach(fns, function transform(fn) {
          data = fn.call(context, data, headers);
        });
        return data;
      };
    }
  });

  // ../../node_modules/axios/lib/cancel/isCancel.js
  var require_isCancel = __commonJS({
    "../../node_modules/axios/lib/cancel/isCancel.js"(exports, module) {
      "use strict";
      module.exports = function isCancel(value) {
        return !!(value && value.__CANCEL__);
      };
    }
  });

  // ../../node_modules/axios/lib/core/dispatchRequest.js
  var require_dispatchRequest = __commonJS({
    "../../node_modules/axios/lib/core/dispatchRequest.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var transformData = require_transformData();
      var isCancel = require_isCancel();
      var defaults = require_defaults();
      var Cancel = require_Cancel();
      function throwIfCancellationRequested(config) {
        if (config.cancelToken) {
          config.cancelToken.throwIfRequested();
        }
        if (config.signal && config.signal.aborted) {
          throw new Cancel("canceled");
        }
      }
      module.exports = function dispatchRequest(config) {
        throwIfCancellationRequested(config);
        config.headers = config.headers || {};
        config.data = transformData.call(
          config,
          config.data,
          config.headers,
          config.transformRequest
        );
        config.headers = utils.merge(
          config.headers.common || {},
          config.headers[config.method] || {},
          config.headers
        );
        utils.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          function cleanHeaderConfig(method) {
            delete config.headers[method];
          }
        );
        var adapter = config.adapter || defaults.adapter;
        return adapter(config).then(function onAdapterResolution(response) {
          throwIfCancellationRequested(config);
          response.data = transformData.call(
            config,
            response.data,
            response.headers,
            config.transformResponse
          );
          return response;
        }, function onAdapterRejection(reason) {
          if (!isCancel(reason)) {
            throwIfCancellationRequested(config);
            if (reason && reason.response) {
              reason.response.data = transformData.call(
                config,
                reason.response.data,
                reason.response.headers,
                config.transformResponse
              );
            }
          }
          return Promise.reject(reason);
        });
      };
    }
  });

  // ../../node_modules/axios/lib/core/mergeConfig.js
  var require_mergeConfig = __commonJS({
    "../../node_modules/axios/lib/core/mergeConfig.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      module.exports = function mergeConfig(config1, config2) {
        config2 = config2 || {};
        var config = {};
        function getMergedValue(target, source) {
          if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
            return utils.merge(target, source);
          } else if (utils.isPlainObject(source)) {
            return utils.merge({}, source);
          } else if (utils.isArray(source)) {
            return source.slice();
          }
          return source;
        }
        function mergeDeepProperties(prop) {
          if (!utils.isUndefined(config2[prop])) {
            return getMergedValue(config1[prop], config2[prop]);
          } else if (!utils.isUndefined(config1[prop])) {
            return getMergedValue(void 0, config1[prop]);
          }
        }
        function valueFromConfig2(prop) {
          if (!utils.isUndefined(config2[prop])) {
            return getMergedValue(void 0, config2[prop]);
          }
        }
        function defaultToConfig2(prop) {
          if (!utils.isUndefined(config2[prop])) {
            return getMergedValue(void 0, config2[prop]);
          } else if (!utils.isUndefined(config1[prop])) {
            return getMergedValue(void 0, config1[prop]);
          }
        }
        function mergeDirectKeys(prop) {
          if (prop in config2) {
            return getMergedValue(config1[prop], config2[prop]);
          } else if (prop in config1) {
            return getMergedValue(void 0, config1[prop]);
          }
        }
        var mergeMap = {
          "url": valueFromConfig2,
          "method": valueFromConfig2,
          "data": valueFromConfig2,
          "baseURL": defaultToConfig2,
          "transformRequest": defaultToConfig2,
          "transformResponse": defaultToConfig2,
          "paramsSerializer": defaultToConfig2,
          "timeout": defaultToConfig2,
          "timeoutMessage": defaultToConfig2,
          "withCredentials": defaultToConfig2,
          "adapter": defaultToConfig2,
          "responseType": defaultToConfig2,
          "xsrfCookieName": defaultToConfig2,
          "xsrfHeaderName": defaultToConfig2,
          "onUploadProgress": defaultToConfig2,
          "onDownloadProgress": defaultToConfig2,
          "decompress": defaultToConfig2,
          "maxContentLength": defaultToConfig2,
          "maxBodyLength": defaultToConfig2,
          "transport": defaultToConfig2,
          "httpAgent": defaultToConfig2,
          "httpsAgent": defaultToConfig2,
          "cancelToken": defaultToConfig2,
          "socketPath": defaultToConfig2,
          "responseEncoding": defaultToConfig2,
          "validateStatus": mergeDirectKeys
        };
        utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
          var merge = mergeMap[prop] || mergeDeepProperties;
          var configValue = merge(prop);
          utils.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
        });
        return config;
      };
    }
  });

  // ../../node_modules/axios/lib/env/data.js
  var require_data = __commonJS({
    "../../node_modules/axios/lib/env/data.js"(exports, module) {
      module.exports = {
        "version": "0.24.0"
      };
    }
  });

  // ../../node_modules/axios/lib/helpers/validator.js
  var require_validator = __commonJS({
    "../../node_modules/axios/lib/helpers/validator.js"(exports, module) {
      "use strict";
      var VERSION = require_data().version;
      var validators = {};
      ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
        validators[type] = function validator(thing) {
          return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
        };
      });
      var deprecatedWarnings = {};
      validators.transitional = function transitional(validator, version, message) {
        function formatMessage(opt, desc) {
          return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
        }
        return function(value, opt, opts) {
          if (validator === false) {
            throw new Error(formatMessage(opt, " has been removed" + (version ? " in " + version : "")));
          }
          if (version && !deprecatedWarnings[opt]) {
            deprecatedWarnings[opt] = true;
            console.warn(
              formatMessage(
                opt,
                " has been deprecated since v" + version + " and will be removed in the near future"
              )
            );
          }
          return validator ? validator(value, opt, opts) : true;
        };
      };
      function assertOptions(options, schema, allowUnknown) {
        if (typeof options !== "object") {
          throw new TypeError("options must be an object");
        }
        var keys = Object.keys(options);
        var i = keys.length;
        while (i-- > 0) {
          var opt = keys[i];
          var validator = schema[opt];
          if (validator) {
            var value = options[opt];
            var result = value === void 0 || validator(value, opt, options);
            if (result !== true) {
              throw new TypeError("option " + opt + " must be " + result);
            }
            continue;
          }
          if (allowUnknown !== true) {
            throw Error("Unknown option " + opt);
          }
        }
      }
      module.exports = {
        assertOptions,
        validators
      };
    }
  });

  // ../../node_modules/axios/lib/core/Axios.js
  var require_Axios = __commonJS({
    "../../node_modules/axios/lib/core/Axios.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var buildURL = require_buildURL();
      var InterceptorManager = require_InterceptorManager();
      var dispatchRequest = require_dispatchRequest();
      var mergeConfig = require_mergeConfig();
      var validator = require_validator();
      var validators = validator.validators;
      function Axios(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
          request: new InterceptorManager(),
          response: new InterceptorManager()
        };
      }
      Axios.prototype.request = function request(config) {
        if (typeof config === "string") {
          config = arguments[1] || {};
          config.url = arguments[0];
        } else {
          config = config || {};
        }
        config = mergeConfig(this.defaults, config);
        if (config.method) {
          config.method = config.method.toLowerCase();
        } else if (this.defaults.method) {
          config.method = this.defaults.method.toLowerCase();
        } else {
          config.method = "get";
        }
        var transitional = config.transitional;
        if (transitional !== void 0) {
          validator.assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators.boolean),
            forcedJSONParsing: validators.transitional(validators.boolean),
            clarifyTimeoutError: validators.transitional(validators.boolean)
          }, false);
        }
        var requestInterceptorChain = [];
        var synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
            return;
          }
          synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
          requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        var responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });
        var promise;
        if (!synchronousRequestInterceptors) {
          var chain = [dispatchRequest, void 0];
          Array.prototype.unshift.apply(chain, requestInterceptorChain);
          chain = chain.concat(responseInterceptorChain);
          promise = Promise.resolve(config);
          while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
          }
          return promise;
        }
        var newConfig = config;
        while (requestInterceptorChain.length) {
          var onFulfilled = requestInterceptorChain.shift();
          var onRejected = requestInterceptorChain.shift();
          try {
            newConfig = onFulfilled(newConfig);
          } catch (error) {
            onRejected(error);
            break;
          }
        }
        try {
          promise = dispatchRequest(newConfig);
        } catch (error) {
          return Promise.reject(error);
        }
        while (responseInterceptorChain.length) {
          promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
        }
        return promise;
      };
      Axios.prototype.getUri = function getUri(config) {
        config = mergeConfig(this.defaults, config);
        return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
      };
      utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
        Axios.prototype[method] = function(url, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            url,
            data: (config || {}).data
          }));
        };
      });
      utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
        Axios.prototype[method] = function(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            url,
            data
          }));
        };
      });
      module.exports = Axios;
    }
  });

  // ../../node_modules/axios/lib/cancel/CancelToken.js
  var require_CancelToken = __commonJS({
    "../../node_modules/axios/lib/cancel/CancelToken.js"(exports, module) {
      "use strict";
      var Cancel = require_Cancel();
      function CancelToken(executor) {
        if (typeof executor !== "function") {
          throw new TypeError("executor must be a function.");
        }
        var resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
          resolvePromise = resolve;
        });
        var token = this;
        this.promise.then(function(cancel) {
          if (!token._listeners)
            return;
          var i;
          var l = token._listeners.length;
          for (i = 0; i < l; i++) {
            token._listeners[i](cancel);
          }
          token._listeners = null;
        });
        this.promise.then = function(onfulfilled) {
          var _resolve;
          var promise = new Promise(function(resolve) {
            token.subscribe(resolve);
            _resolve = resolve;
          }).then(onfulfilled);
          promise.cancel = function reject() {
            token.unsubscribe(_resolve);
          };
          return promise;
        };
        executor(function cancel(message) {
          if (token.reason) {
            return;
          }
          token.reason = new Cancel(message);
          resolvePromise(token.reason);
        });
      }
      CancelToken.prototype.throwIfRequested = function throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      };
      CancelToken.prototype.subscribe = function subscribe(listener) {
        if (this.reason) {
          listener(this.reason);
          return;
        }
        if (this._listeners) {
          this._listeners.push(listener);
        } else {
          this._listeners = [listener];
        }
      };
      CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
        if (!this._listeners) {
          return;
        }
        var index = this._listeners.indexOf(listener);
        if (index !== -1) {
          this._listeners.splice(index, 1);
        }
      };
      CancelToken.source = function source() {
        var cancel;
        var token = new CancelToken(function executor(c) {
          cancel = c;
        });
        return {
          token,
          cancel
        };
      };
      module.exports = CancelToken;
    }
  });

  // ../../node_modules/axios/lib/helpers/spread.js
  var require_spread = __commonJS({
    "../../node_modules/axios/lib/helpers/spread.js"(exports, module) {
      "use strict";
      module.exports = function spread(callback) {
        return function wrap(arr) {
          return callback.apply(null, arr);
        };
      };
    }
  });

  // ../../node_modules/axios/lib/helpers/isAxiosError.js
  var require_isAxiosError = __commonJS({
    "../../node_modules/axios/lib/helpers/isAxiosError.js"(exports, module) {
      "use strict";
      module.exports = function isAxiosError(payload) {
        return typeof payload === "object" && payload.isAxiosError === true;
      };
    }
  });

  // ../../node_modules/axios/lib/axios.js
  var require_axios = __commonJS({
    "../../node_modules/axios/lib/axios.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var bind = require_bind();
      var Axios = require_Axios();
      var mergeConfig = require_mergeConfig();
      var defaults = require_defaults();
      function createInstance(defaultConfig) {
        var context = new Axios(defaultConfig);
        var instance = bind(Axios.prototype.request, context);
        utils.extend(instance, Axios.prototype, context);
        utils.extend(instance, context);
        instance.create = function create(instanceConfig) {
          return createInstance(mergeConfig(defaultConfig, instanceConfig));
        };
        return instance;
      }
      var axios = createInstance(defaults);
      axios.Axios = Axios;
      axios.Cancel = require_Cancel();
      axios.CancelToken = require_CancelToken();
      axios.isCancel = require_isCancel();
      axios.VERSION = require_data().version;
      axios.all = function all(promises) {
        return Promise.all(promises);
      };
      axios.spread = require_spread();
      axios.isAxiosError = require_isAxiosError();
      module.exports = axios;
      module.exports.default = axios;
    }
  });

  // ../../node_modules/axios/index.js
  var require_axios2 = __commonJS({
    "../../node_modules/axios/index.js"(exports, module) {
      module.exports = require_axios();
    }
  });

  // ../../dist/src/fetch.js
  var require_fetch = __commonJS({
    "../../dist/src/fetch.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fetchActor = exports.fetchActorDigest = void 0;
      var axios_1 = __importDefault(require_axios2());
      async function fetchActorDigest(actorRef, withTLS) {
        const image = actorRef.split("/");
        const registry = image[0];
        const [name, version] = image[1].split(":");
        const response = await axios_1.default.get(`${withTLS ? "https://" : "http://"}${registry}/v2/${name}/manifests/${version}`, {
          headers: {
            Accept: "application/vnd.oci.image.manifest.v1+json"
          }
        }).catch((err) => {
          throw err;
        });
        const layers = response.data;
        if (layers.layers.length === 0) {
          throw new Error("no layers");
        }
        return {
          name,
          digest: layers.layers[0].digest,
          registry
        };
      }
      exports.fetchActorDigest = fetchActorDigest;
      async function fetchActor(url) {
        const response = await axios_1.default.get(url, {
          responseType: "arraybuffer"
        }).catch((err) => {
          throw err;
        });
        return new Uint8Array(response.data);
      }
      exports.fetchActor = fetchActor;
    }
  });

  // ../../dist/wasmcloud-rs-js/pkg/index.js
  var require_pkg = __commonJS({
    "../../dist/wasmcloud-rs-js/pkg/index.js"(exports, module) {
      "use strict";
      (() => {
        "use strict";
        var e, r, t, n, a = { 462: (e2, r2, t2) => {
          t2.a(e2, async (e3, n2) => {
            try {
              t2.r(r2), t2.d(r2, { HostKey: () => a2.tL, __wbg_buffer_de1150f91b23aa89: () => a2.$r, __wbg_crypto_b8c92eaac23d0d80: () => a2.iY, __wbg_getRandomValues_dd27e6b0652b3236: () => a2.yX, __wbg_getRandomValues_e57c9b75ddead065: () => a2.ae, __wbg_length_e09c0b925ab8de5d: () => a2.uV, __wbg_msCrypto_9ad6677321a08dd8: () => a2.mS, __wbg_new_97cf52648830a70d: () => a2.xe, __wbg_newwithlength_e833b89f9db02732: () => a2.Nu, __wbg_randomFillSync_d2ba53160aec6aba: () => a2.Os, __wbg_require_f5521a5b85ad2542: () => a2.r2, __wbg_self_86b4b13392c7af56: () => a2.U5, __wbg_set_a0172b213e2469e9: () => a2.Rh, __wbg_static_accessor_MODULE_452b4680e8614c81: () => a2.DA, __wbg_subarray_9482ae5cd5cd99d3: () => a2.dx, __wbindgen_is_undefined: () => a2.XP, __wbindgen_memory: () => a2.oH, __wbindgen_object_drop_ref: () => a2.ug, __wbindgen_string_new: () => a2.h4, __wbindgen_throw: () => a2.Or, extract_jwt: () => a2.$n, validate_jwt: () => a2.Xo });
              var a2 = t2(194), _2 = e3([a2]);
              a2 = (_2.then ? (await _2)() : _2)[0], n2();
            } catch (e4) {
              n2(e4);
            }
          });
        }, 194: (e2, r2, t2) => {
          t2.a(e2, async (n2, a2) => {
            try {
              let y = function(e3, r3) {
                if (!(e3 instanceof r3))
                  throw new TypeError("Cannot call a class as a function");
              }, p = function(e3, r3) {
                for (var t3 = 0; t3 < r3.length; t3++) {
                  var n3 = r3[t3];
                  n3.enumerable = n3.enumerable || false, n3.configurable = true, "value" in n3 && (n3.writable = true), Object.defineProperty(e3, n3.key, n3);
                }
              }, h = function() {
                return 0 === i2.byteLength && (i2 = new Uint8Array(_2.memory.buffer)), i2;
              }, m = function(e3, r3) {
                return c.decode(h().subarray(e3, e3 + r3));
              }, v = function(e3) {
                b === u.length && u.push(u.length + 1);
                var r3 = b;
                return b = u[r3], u[r3] = e3, r3;
              }, x = function(e3) {
                return u[e3];
              }, k = function(e3) {
                e3 < 36 || (u[e3] = b, b = e3);
              }, S = function(e3) {
                var r3 = x(e3);
                return k(e3), r3;
              }, j = function() {
                return 0 === d.byteLength && (d = new Int32Array(_2.memory.buffer)), d;
              }, O = function(e3) {
                if (1 == f)
                  throw new Error("out of js stack");
                return u[--f] = e3, f;
              }, E = function(e3) {
                try {
                  var r3 = _2.__wbindgen_add_to_stack_pointer(-16);
                  _2.extract_jwt(r3, O(e3));
                  var t3 = j()[r3 / 4 + 0], n3 = j()[r3 / 4 + 1], a3 = j()[r3 / 4 + 2], o3 = j()[r3 / 4 + 3], i3 = t3, c2 = n3;
                  if (o3)
                    throw i3 = 0, c2 = 0, S(a3);
                  return m(i3, c2);
                } finally {
                  _2.__wbindgen_add_to_stack_pointer(16), u[f++] = void 0, _2.__wbindgen_free(i3, c2);
                }
              }, A = function(e3, r3, t3) {
                if (void 0 === t3) {
                  var n3 = w.encode(e3), a3 = r3(n3.length);
                  return h().subarray(a3, a3 + n3.length).set(n3), s = n3.length, a3;
                }
                for (var _3 = e3.length, o3 = r3(_3), i3 = h(), c2 = 0; c2 < _3; c2++) {
                  var u2 = e3.charCodeAt(c2);
                  if (u2 > 127)
                    break;
                  i3[o3 + c2] = u2;
                }
                if (c2 !== _3) {
                  0 !== c2 && (e3 = e3.slice(c2)), o3 = t3(o3, _3, _3 = c2 + 3 * e3.length);
                  var d2 = h().subarray(o3 + c2, o3 + _3);
                  c2 += l(e3, d2).written;
                }
                return s = c2, o3;
              }, P = function(e3) {
                var r3 = A(e3, _2.__wbindgen_malloc, _2.__wbindgen_realloc), t3 = s;
                return 0 !== _2.validate_jwt(r3, t3);
              }, T = function(e3, r3) {
                try {
                  return e3.apply(this, r3);
                } catch (e4) {
                  _2.__wbindgen_exn_store(v(e4));
                }
              }, U = function(e3, r3) {
                return v(m(e3, r3));
              }, R = function(e3) {
                S(e3);
              }, V = function(e3, r3, t3) {
                var n3, a3;
                x(e3).randomFillSync((n3 = r3, a3 = t3, h().subarray(n3 / 1, n3 / 1 + a3)));
              }, D = function(e3, r3) {
                x(e3).getRandomValues(x(r3));
              }, X = function() {
                return T(function() {
                  return v(self.self);
                }, arguments);
              }, $ = function(e3) {
                return v(x(e3).crypto);
              }, q = function(e3) {
                return v(x(e3).msCrypto);
              }, M = function(e3) {
                return void 0 === x(e3);
              }, L = function(e3, r3, t3) {
                return v(x(e3).require(m(r3, t3)));
              }, C = function(e3) {
                return v(x(e3).getRandomValues);
              }, F = function() {
                return v(e2);
              }, H = function(e3) {
                return v(x(e3).buffer);
              }, I = function(e3) {
                return v(new Uint8Array(x(e3)));
              }, N = function(e3, r3, t3) {
                x(e3).set(x(r3), t3 >>> 0);
              }, B = function(e3) {
                return x(e3).length;
              }, W = function(e3) {
                return v(new Uint8Array(e3 >>> 0));
              }, Y = function(e3, r3, t3) {
                return v(x(e3).subarray(r3 >>> 0, t3 >>> 0));
              }, K = function(e3, r3) {
                throw new Error(m(e3, r3));
              }, z = function() {
                return v(_2.memory);
              };
              t2.d(r2, { $n: () => E, $r: () => H, DA: () => F, Nu: () => W, Or: () => K, Os: () => V, Rh: () => N, U5: () => X, XP: () => M, Xo: () => P, ae: () => D, dx: () => Y, h4: () => U, iY: () => $, mS: () => q, oH: () => z, r2: () => L, tL: () => g, uV: () => B, ug: () => R, xe: () => I, yX: () => C });
              var _2 = t2(293);
              e2 = t2.hmd(e2);
              var o2 = n2([_2]);
              _2 = (o2.then ? (await o2)() : o2)[0];
              var i2, c = new ("undefined" == typeof TextDecoder ? (0, e2.require)("util").TextDecoder : TextDecoder)("utf-8", { ignoreBOM: true, fatal: true });
              c.decode();
              var u = new Array(32).fill(void 0);
              u.push(void 0, null, true, false);
              var d, b = u.length;
              var f = 32;
              var s = 0, w = new ("undefined" == typeof TextEncoder ? (0, e2.require)("util").TextEncoder : TextEncoder)("utf-8"), l = "function" == typeof w.encodeInto ? function(e3, r3) {
                return w.encodeInto(e3, r3);
              } : function(e3, r3) {
                var t3 = w.encode(e3);
                return r3.set(t3), { read: e3.length, written: t3.length };
              };
              var g = function() {
                function e3() {
                  y(this, e3);
                  var r4 = _2.hostkey_new();
                  return e3.__wrap(r4);
                }
                var r3, t3, n3;
                return r3 = e3, n3 = [{ key: "__wrap", value: function(r4) {
                  var t4 = Object.create(e3.prototype);
                  return t4.ptr = r4, t4;
                } }], (t3 = [{ key: "__destroy_into_raw", value: function() {
                  var e4 = this.ptr;
                  return this.ptr = 0, e4;
                } }, { key: "free", value: function() {
                  var e4 = this.__destroy_into_raw();
                  _2.__wbg_hostkey_free(e4);
                } }, { key: "pk", get: function() {
                  try {
                    var e4 = _2.__wbindgen_add_to_stack_pointer(-16);
                    _2.hostkey_pk(e4, this.ptr);
                    var r4 = j()[e4 / 4 + 0], t4 = j()[e4 / 4 + 1];
                    return m(r4, t4);
                  } finally {
                    _2.__wbindgen_add_to_stack_pointer(16), _2.__wbindgen_free(r4, t4);
                  }
                } }, { key: "seed", get: function() {
                  try {
                    var e4 = _2.__wbindgen_add_to_stack_pointer(-16);
                    _2.hostkey_seed(e4, this.ptr);
                    var r4 = j()[e4 / 4 + 0], t4 = j()[e4 / 4 + 1];
                    return m(r4, t4);
                  } finally {
                    _2.__wbindgen_add_to_stack_pointer(16), _2.__wbindgen_free(r4, t4);
                  }
                } }]) && p(r3.prototype, t3), n3 && p(r3, n3), e3;
              }();
              d = new Int32Array(_2.memory.buffer), i2 = new Uint8Array(_2.memory.buffer), a2();
            } catch (e3) {
              a2(e3);
            }
          });
        }, 293: (e2, r2, t2) => {
          t2.a(e2, async (n2, a2) => {
            try {
              var _2, o2 = n2([_2 = t2(194)]), [_2] = o2.then ? (await o2)() : o2;
              await t2.v(r2, e2.id, "cb0a530d888b2657c6eb", { "./index_bg.js": { __wbindgen_string_new: _2.h4, __wbindgen_object_drop_ref: _2.ug, __wbg_randomFillSync_d2ba53160aec6aba: _2.Os, __wbg_getRandomValues_e57c9b75ddead065: _2.ae, __wbg_self_86b4b13392c7af56: _2.U5, __wbg_crypto_b8c92eaac23d0d80: _2.iY, __wbg_msCrypto_9ad6677321a08dd8: _2.mS, __wbindgen_is_undefined: _2.XP, __wbg_require_f5521a5b85ad2542: _2.r2, __wbg_getRandomValues_dd27e6b0652b3236: _2.yX, __wbg_static_accessor_MODULE_452b4680e8614c81: _2.DA, __wbg_buffer_de1150f91b23aa89: _2.$r, __wbg_new_97cf52648830a70d: _2.xe, __wbg_set_a0172b213e2469e9: _2.Rh, __wbg_length_e09c0b925ab8de5d: _2.uV, __wbg_newwithlength_e833b89f9db02732: _2.Nu, __wbg_subarray_9482ae5cd5cd99d3: _2.dx, __wbindgen_throw: _2.Or, __wbindgen_memory: _2.oH } }), a2();
            } catch (e3) {
              a2(e3);
            }
          }, 1);
        } }, _ = {};
        function o(e2) {
          var r2 = _[e2];
          if (void 0 !== r2)
            return r2.exports;
          var t2 = _[e2] = { id: e2, loaded: false, exports: {} };
          return a[e2](t2, t2.exports, o), t2.loaded = true, t2.exports;
        }
        e = "function" == typeof Symbol ? Symbol("webpack queues") : "__webpack_queues__", r = "function" == typeof Symbol ? Symbol("webpack exports") : "__webpack_exports__", t = "function" == typeof Symbol ? Symbol("webpack error") : "__webpack_error__", n = (e2) => {
          e2 && !e2.d && (e2.d = 1, e2.forEach((e3) => e3.r--), e2.forEach((e3) => e3.r-- ? e3.r++ : e3()));
        }, o.a = (a2, _2, o2) => {
          var i2;
          o2 && ((i2 = []).d = 1);
          var c, u, d, b = /* @__PURE__ */ new Set(), f = a2.exports, s = new Promise((e2, r2) => {
            d = r2, u = e2;
          });
          s[r] = f, s[e] = (e2) => (i2 && e2(i2), b.forEach(e2), s.catch((e3) => {
          })), a2.exports = s, _2((a3) => {
            var _3;
            c = ((a4) => a4.map((a5) => {
              if (null !== a5 && "object" == typeof a5) {
                if (a5[e])
                  return a5;
                if (a5.then) {
                  var _4 = [];
                  _4.d = 0, a5.then((e2) => {
                    o4[r] = e2, n(_4);
                  }, (e2) => {
                    o4[t] = e2, n(_4);
                  });
                  var o4 = {};
                  return o4[e] = (e2) => e2(_4), o4;
                }
              }
              var i3 = {};
              return i3[e] = (e2) => {
              }, i3[r] = a5, i3;
            }))(a3);
            var o3 = () => c.map((e2) => {
              if (e2[t])
                throw e2[t];
              return e2[r];
            }), u2 = new Promise((r2) => {
              (_3 = () => r2(o3)).r = 0;
              var t2 = (e2) => e2 !== i2 && !b.has(e2) && (b.add(e2), e2 && !e2.d && (_3.r++, e2.push(_3)));
              c.map((r3) => r3[e](t2));
            });
            return _3.r ? u2 : o3();
          }, (e2) => (e2 ? d(s[t] = e2) : u(f), n(i2))), i2 && (i2.d = 0);
        }, o.d = (e2, r2) => {
          for (var t2 in r2)
            o.o(r2, t2) && !o.o(e2, t2) && Object.defineProperty(e2, t2, { enumerable: true, get: r2[t2] });
        }, o.g = function() {
          if ("object" == typeof globalThis)
            return globalThis;
          try {
            return this || new Function("return this")();
          } catch (e2) {
            if ("object" == typeof window)
              return window;
          }
        }(), o.hmd = (e2) => ((e2 = Object.create(e2)).children || (e2.children = []), Object.defineProperty(e2, "exports", { enumerable: true, set: () => {
          throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: " + e2.id);
        } }), e2), o.o = (e2, r2) => Object.prototype.hasOwnProperty.call(e2, r2), o.r = (e2) => {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
        }, o.v = (e2, r2, t2, n2) => {
          var a2 = fetch(o.p + "wasmcloud.wasm");
          return "function" == typeof WebAssembly.instantiateStreaming ? WebAssembly.instantiateStreaming(a2, n2).then((r3) => Object.assign(e2, r3.instance.exports)) : a2.then((e3) => e3.arrayBuffer()).then((e3) => WebAssembly.instantiate(e3, n2)).then((r3) => Object.assign(e2, r3.instance.exports));
        }, (() => {
          var e2;
          o.g.importScripts && (e2 = o.g.location + "");
          var r2 = o.g.document;
          if (!e2 && r2 && (r2.currentScript && (e2 = r2.currentScript.src), !e2)) {
            var t2 = r2.getElementsByTagName("script");
            t2.length && (e2 = t2[t2.length - 1].src);
          }
          if (!e2)
            throw new Error("Automatic publicPath is not supported in this browser");
          e2 = e2.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/"), o.p = e2;
        })();
        var i = o(462);
        module.exports = i;
      })();
    }
  });

  // ../../dist/src/host.js
  var require_host = __commonJS({
    "../../dist/src/host.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.startHost = exports.Host = void 0;
      var msgpack_1 = require_dist();
      var nats_ws_1 = require_nats2();
      var actor_1 = require_actor();
      var events_1 = require_events();
      var fetch_1 = require_fetch();
      var util_1 = require_util4();
      var HOST_HEARTBEAT_INTERVAL = 3e4;
      var Host = class {
        constructor(name = "default", withRegistryTLS, heartbeatInterval, natsConnOpts, wasm) {
          const hostKey = new wasm.HostKey();
          this.name = name;
          this.key = hostKey.pk;
          this.seed = hostKey.seed;
          this.withRegistryTLS = withRegistryTLS;
          this.actors = {};
          this.labels = {
            "hostcore.arch": "web",
            "hostcore.os": "browser",
            "hostcore.osfamily": "js"
          };
          this.friendlyName = `java-script-${Math.round(Math.random() * 9999)}`;
          this.wasm = wasm;
          this.heartbeatInterval = heartbeatInterval;
          this.natsConnOpts = natsConnOpts;
          this.invocationCallbacks = {};
          this.hostCalls = {};
          this.writers = {};
        }
        async connectNATS() {
          const opts = Array.isArray(this.natsConnOpts) ? {
            servers: this.natsConnOpts
          } : this.natsConnOpts;
          this.natsConn = await nats_ws_1.connect(opts);
        }
        async disconnectNATS() {
          this.natsConn.close();
        }
        async startHeartbeat() {
          this.heartbeatIntervalId;
          const heartbeat = {
            actors: [],
            providers: [],
            labels: this.labels
          };
          for (const actor in this.actors) {
            heartbeat.actors.push({
              actor,
              instances: 1
            });
          }
          const heartbeatFn = () => {
            this.natsConn.publish(`wasmbus.evt.${this.name}`, util_1.jsonEncode(events_1.createEventMessage(this.key, events_1.EventType.HeartBeat, heartbeat)));
          };
          this.heartbeatIntervalId = setInterval(heartbeatFn, this.heartbeatInterval);
        }
        async stopHeartbeat() {
          clearInterval(this.heartbeatIntervalId);
          this.heartbeatIntervalId = null;
        }
        async publishHostStarted() {
          const hostStarted = {
            labels: this.labels,
            friendly_name: this.friendlyName
          };
          this.natsConn.publish(`wasmbus.evt.${this.name}`, util_1.jsonEncode(events_1.createEventMessage(this.key, events_1.EventType.HostStarted, hostStarted)));
        }
        async subscribeToEvents(eventCallback) {
          this.eventsSubscription = this.natsConn.subscribe(`wasmbus.evt.${this.name}`);
          for await (const event of this.eventsSubscription) {
            const eventData = util_1.jsonDecode(event.data);
            if (eventCallback) {
              eventCallback(eventData);
            }
          }
          throw new Error("evt subscription was closed");
        }
        async unsubscribeEvents() {
          var _a;
          (_a = this.eventsSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
          this.eventsSubscription = null;
        }
        async launchActor(actorRef, invocationCallback, hostCall, writer) {
          const actor = {
            actor_ref: actorRef,
            host_id: this.key
          };
          this.natsConn.publish(`wasmbus.ctl.${this.name}.cmd.${this.key}.la`, util_1.jsonEncode(actor));
          if (invocationCallback) {
            this.invocationCallbacks[actorRef] = invocationCallback;
          }
          if (hostCall) {
            this.hostCalls[actorRef] = hostCall;
          }
          if (writer) {
            this.writers[actorRef] = writer;
          }
        }
        async stopActor(actorRef) {
          const actorToStop = {
            host_id: this.key,
            actor_ref: actorRef
          };
          this.natsConn.publish(`wasmbus.ctl.${this.name}.cmd.${this.key}.sa`, util_1.jsonEncode(actorToStop));
        }
        async listenLaunchActor() {
          var _a, _b, _c;
          const actorsTopic = this.natsConn.subscribe(`wasmbus.ctl.${this.name}.cmd.${this.key}.la`);
          for await (const actorMessage of actorsTopic) {
            const actorData = util_1.jsonDecode(actorMessage.data);
            const actorRef = actorData.actor_ref;
            const usingRegistry = !actorRef.endsWith(".wasm");
            try {
              let url;
              if (usingRegistry) {
                const actorDigest = await fetch_1.fetchActorDigest(actorRef);
                url = `${this.withRegistryTLS ? "https://" : "http://"}${actorDigest.registry}/v2/${actorDigest.name}/blobs/${actorDigest.digest}`;
              } else {
                url = actorRef;
              }
              const actorModule = await fetch_1.fetchActor(url);
              const actor = await actor_1.startActor(this.name, this.key, actorModule, this.natsConn, this.wasm, (_a = this.invocationCallbacks) === null || _a === void 0 ? void 0 : _a[actorRef], (_b = this.hostCalls) === null || _b === void 0 ? void 0 : _b[actorRef], (_c = this.writers) === null || _c === void 0 ? void 0 : _c[actorRef]);
              if (this.actors[actorRef]) {
                this.actors[actorRef].count++;
              } else {
                this.actors[actorRef] = {
                  count: 1,
                  actor
                };
              }
            } catch (err) {
              console.log("error", err);
            }
          }
          throw new Error("la.subscription was closed");
        }
        async listenStopActor() {
          const actorsTopic = this.natsConn.subscribe(`wasmbus.ctl.${this.name}.cmd.${this.key}.sa`);
          for await (const actorMessage of actorsTopic) {
            const actorData = util_1.jsonDecode(actorMessage.data);
            const actorStop = {
              instance_id: util_1.uuidv4(),
              public_key: this.actors[actorData.actor_ref].actor.key
            };
            this.natsConn.publish(`wasmbus.evt.${this.name}`, util_1.jsonEncode(events_1.createEventMessage(this.key, events_1.EventType.ActorStopped, actorStop)));
            delete this.actors[actorData.actor_ref];
            delete this.invocationCallbacks[actorData.actor_ref];
          }
          throw new Error("sa.subscription was closed");
        }
        async createLinkDefinition(actorKey, providerKey, linkName, contractId, values) {
          const linkDefinition = {
            actor_id: actorKey,
            provider_id: providerKey,
            link_name: linkName,
            contract_id: contractId,
            values
          };
          this.natsConn.publish(`wasmbus.rpc.${this.name}.${providerKey}.${linkName}.linkdefs.put`, msgpack_1.encode(linkDefinition));
        }
        async startHost() {
          await this.connectNATS();
          Promise.all([
            this.publishHostStarted(),
            this.startHeartbeat(),
            this.listenLaunchActor(),
            this.listenStopActor()
          ]).catch((err) => {
            throw err;
          });
        }
        async stopHost() {
          await this.stopHeartbeat();
          for (const actor in this.actors) {
            await this.stopActor(actor);
          }
          await this.natsConn.drain();
          await this.disconnectNATS();
        }
      };
      exports.Host = Host;
      async function startHost2(name, withRegistryTLS = true, natsConnection, heartbeatInterval) {
        const wasmModule = await Promise.resolve().then(() => __importStar(require_pkg()));
        const wasm = await wasmModule.default;
        const host = new Host(name, withRegistryTLS, heartbeatInterval ? heartbeatInterval : HOST_HEARTBEAT_INTERVAL, natsConnection, wasm);
        await host.startHost();
        return host;
      }
      exports.startHost = startHost2;
    }
  });

  // ../../dist/src/index.js
  var require_src2 = __commonJS({
    "../../dist/src/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.startHost = void 0;
      var host_1 = require_host();
      Object.defineProperty(exports, "startHost", { enumerable: true, get: function() {
        return host_1.startHost;
      } });
    }
  });

  // main.js
  var import_src = __toESM(require_src2());
  var runningHosts = [];
  document.getElementById("hostButton").onclick = () => {
    const latticePrefixInput = document.getElementById("latticePrefix");
    if (!latticePrefixInput || !latticePrefixInput.value || latticePrefixInput.value === "") {
      (async () => {
        const host = await (0, import_src.startHost)("374b6434-f18d-4b93-8743-bcd3089e4d5b", false, ["ws://localhost:6222"]);
        runningHosts.push(host);
        document.getElementById("runningHosts").innerHTML = hostList(runningHosts).innerHTML;
        console.dir(runningHosts);
      })();
    } else {
      (async () => {
        const host = await (0, import_src.startHost)(latticePrefixInput.value, false, ["ws://localhost:6222"]);
        runningHosts.push(host);
        document.getElementById("runningHosts").innerHTML = hostList(runningHosts).innerHTML;
        console.dir(runningHosts);
      })();
    }
  };
  function hostList(runningHosts2) {
    let list = document.createElement("ol");
    runningHosts2.forEach((host) => {
      console.dir(host);
      let listItem = document.createElement("li");
      listItem.innerText = host.friendlyName;
      list.appendChild(listItem);
    });
    return list;
  }
})();
