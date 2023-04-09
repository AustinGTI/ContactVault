import * as jspb from 'google-protobuf'



export class UserRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UserRequest): UserRequest.AsObject;
  static serializeBinaryToWriter(message: UserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserRequest;
  static deserializeBinaryFromReader(message: UserRequest, reader: jspb.BinaryReader): UserRequest;
}

export namespace UserRequest {
  export type AsObject = {
  }
}

export class UserResponse extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): UserResponse;

  getError(): string;
  setError(value: string): UserResponse;

  getUsername(): string;
  setUsername(value: string): UserResponse;

  getId(): string;
  setId(value: string): UserResponse;

  getPassword(): string;
  setPassword(value: string): UserResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserResponse): UserResponse.AsObject;
  static serializeBinaryToWriter(message: UserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserResponse;
  static deserializeBinaryFromReader(message: UserResponse, reader: jspb.BinaryReader): UserResponse;
}

export namespace UserResponse {
  export type AsObject = {
    status: number,
    error: string,
    username: string,
    id: string,
    password: string,
  }
}

export class LoginRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): LoginRequest;

  getPassword(): string;
  setPassword(value: string): LoginRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoginRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LoginRequest): LoginRequest.AsObject;
  static serializeBinaryToWriter(message: LoginRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoginRequest;
  static deserializeBinaryFromReader(message: LoginRequest, reader: jspb.BinaryReader): LoginRequest;
}

export namespace LoginRequest {
  export type AsObject = {
    username: string,
    password: string,
  }
}

export class LoginResponse extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): LoginResponse;

  getError(): string;
  setError(value: string): LoginResponse;

  getJwttoken(): string;
  setJwttoken(value: string): LoginResponse;

  getRefreshtoken(): string;
  setRefreshtoken(value: string): LoginResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoginResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LoginResponse): LoginResponse.AsObject;
  static serializeBinaryToWriter(message: LoginResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoginResponse;
  static deserializeBinaryFromReader(message: LoginResponse, reader: jspb.BinaryReader): LoginResponse;
}

export namespace LoginResponse {
  export type AsObject = {
    status: number,
    error: string,
    jwttoken: string,
    refreshtoken: string,
  }
}

export class RefreshAccessTokenRequest extends jspb.Message {
  getRefreshtoken(): string;
  setRefreshtoken(value: string): RefreshAccessTokenRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RefreshAccessTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RefreshAccessTokenRequest): RefreshAccessTokenRequest.AsObject;
  static serializeBinaryToWriter(message: RefreshAccessTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RefreshAccessTokenRequest;
  static deserializeBinaryFromReader(message: RefreshAccessTokenRequest, reader: jspb.BinaryReader): RefreshAccessTokenRequest;
}

export namespace RefreshAccessTokenRequest {
  export type AsObject = {
    refreshtoken: string,
  }
}

export class RefreshAccessTokenResponse extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): RefreshAccessTokenResponse;

  getError(): string;
  setError(value: string): RefreshAccessTokenResponse;

  getAccesstoken(): string;
  setAccesstoken(value: string): RefreshAccessTokenResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RefreshAccessTokenResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RefreshAccessTokenResponse): RefreshAccessTokenResponse.AsObject;
  static serializeBinaryToWriter(message: RefreshAccessTokenResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RefreshAccessTokenResponse;
  static deserializeBinaryFromReader(message: RefreshAccessTokenResponse, reader: jspb.BinaryReader): RefreshAccessTokenResponse;
}

export namespace RefreshAccessTokenResponse {
  export type AsObject = {
    status: number,
    error: string,
    accesstoken: string,
  }
}

