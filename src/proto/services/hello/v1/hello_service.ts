/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import { Language_Code, language_CodeFromJSON, language_CodeToJSON } from "../../../com/language/v1/language";

export const protobufPackage = "services.hello.v1";

export interface GreetRequest {
  name: string;
  languageCode: Language_Code;
}

export interface GreetResponse {
  greeting: string;
}

function createBaseGreetRequest(): GreetRequest {
  return { name: "", languageCode: 0 };
}

export const GreetRequest = {
  encode(message: GreetRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.languageCode !== 0) {
      writer.uint32(16).int32(message.languageCode);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GreetRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGreetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.languageCode = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GreetRequest {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      languageCode: isSet(object.languageCode) ? language_CodeFromJSON(object.languageCode) : 0,
    };
  },

  toJSON(message: GreetRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.languageCode !== 0) {
      obj.languageCode = language_CodeToJSON(message.languageCode);
    }
    return obj;
  },

  create(base?: DeepPartial<GreetRequest>): GreetRequest {
    return GreetRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GreetRequest>): GreetRequest {
    const message = createBaseGreetRequest();
    message.name = object.name ?? "";
    message.languageCode = object.languageCode ?? 0;
    return message;
  },
};

function createBaseGreetResponse(): GreetResponse {
  return { greeting: "" };
}

export const GreetResponse = {
  encode(message: GreetResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.greeting !== "") {
      writer.uint32(10).string(message.greeting);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GreetResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGreetResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.greeting = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GreetResponse {
    return { greeting: isSet(object.greeting) ? globalThis.String(object.greeting) : "" };
  },

  toJSON(message: GreetResponse): unknown {
    const obj: any = {};
    if (message.greeting !== "") {
      obj.greeting = message.greeting;
    }
    return obj;
  },

  create(base?: DeepPartial<GreetResponse>): GreetResponse {
    return GreetResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GreetResponse>): GreetResponse {
    const message = createBaseGreetResponse();
    message.greeting = object.greeting ?? "";
    return message;
  },
};

export type HelloServiceDefinition = typeof HelloServiceDefinition;
export const HelloServiceDefinition = {
  name: "HelloService",
  fullName: "services.hello.v1.HelloService",
  methods: {
    greet: {
      name: "Greet",
      requestType: GreetRequest,
      requestStream: false,
      responseType: GreetResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface HelloServiceImplementation<CallContextExt = {}> {
  greet(request: GreetRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GreetResponse>>;
}

export interface HelloServiceClient<CallOptionsExt = {}> {
  greet(request: DeepPartial<GreetRequest>, options?: CallOptions & CallOptionsExt): Promise<GreetResponse>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
