/// <reference types="node" />

declare type int = number;
declare type uint = number;
declare type float = number;
declare type ufloat = number;

declare type KeysOfUnion<T> = T extends any ? keyof T : never;
declare type PickField<T, K extends keyof T> = T[K];

declare type PromiseResolve = (value?: void | PromiseLike<void> | undefined) => void;
declare type PromiseReject = (reason?: any) => void;

declare type Constructor<T extends object> = T extends object ? new (...args: any[]) => T : never;
declare type Decorator<T extends object, U extends T> = (
  Component: Constructor<T>
) => Constructor<U>;

declare type ReadonlyPartial<T> = { readonly [P in keyof T]?: T[P] };
declare type Writable<T> = { -readonly [K in keyof T]: T[K] };

declare type Handler<T = any> = (...args: any[]) => T;

declare interface Dictionary<T> {
  [key: string]: T;
}

declare interface Tuple<T> {
  [key: number]: T;
}

declare interface ReadonlyDictionary<T> {
  readonly [key: string]: T;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }

  interface Global {}
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare namespace NodeEventEmitterCommon {
  type EventHandler<T = any> = (e?: Event) => T;

  interface EventHandlers {
    [key: string]: EventHandler;
  }

  type EventHandlersMap = WeakMap<EventHandler, EventHandlers>;
  type EventHandlersMapMap = Map<string, EventHandlersMap>;

  type AttachEventHandler<EE> = (
    emitter: EE,
    handler: EventHandler,
    options: boolean | AddEventListenerOptions
  ) => void;
  type DetachEventHandler<EE> = (emitter: EE, handler: EventHandler) => void;

  type DispatchEvent<EE, EI extends EventInit = EventInit> = (emitter: EE, options?: EI) => void;
  type DispatchEventWithData<EE, D = any> = (emitter: EE, data?: D, options?: EventInit) => void;

  interface EventListeners {
    [event: string]: Set<EventHandler>;
  }

  interface CustomNodeEvent<EE, EI extends EventInit = EventInit, D = any> {
    on: AttachEventHandler<EE>;
    off: DetachEventHandler<EE>;
    emit?: DispatchEvent<EE, EI> | DispatchEventWithData<D>;
  }

  interface CustomNodeEvents<EE> {
    [event: string]: CustomNodeEvent<EE>;
  }

  type DispatchOptions<D = any, EI extends EventInit = EventInit> = [D, EI] | [EI];
}

import H74_NEEC = NodeEventEmitterCommon;
