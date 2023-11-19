/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "com.language.v1";

export interface Language {
}

export enum Language_Code {
  CODE_UNSPECIFIED = 0,
  CODE_EN = 1,
  CODE_FA = 2,
  UNRECOGNIZED = -1,
}

export function language_CodeFromJSON(object: any): Language_Code {
  switch (object) {
    case 0:
    case "CODE_UNSPECIFIED":
      return Language_Code.CODE_UNSPECIFIED;
    case 1:
    case "CODE_EN":
      return Language_Code.CODE_EN;
    case 2:
    case "CODE_FA":
      return Language_Code.CODE_FA;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Language_Code.UNRECOGNIZED;
  }
}

export function language_CodeToJSON(object: Language_Code): string {
  switch (object) {
    case Language_Code.CODE_UNSPECIFIED:
      return "CODE_UNSPECIFIED";
    case Language_Code.CODE_EN:
      return "CODE_EN";
    case Language_Code.CODE_FA:
      return "CODE_FA";
    case Language_Code.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseLanguage(): Language {
  return {};
}

export const Language = {
  encode(_: Language, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Language {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLanguage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): Language {
    return {};
  },

  toJSON(_: Language): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<Language>): Language {
    return Language.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<Language>): Language {
    const message = createBaseLanguage();
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
