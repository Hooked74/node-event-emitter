/// <reference types="react-scripts" />

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
