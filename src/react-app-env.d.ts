/// <reference types="react-scripts" />

type EventHandler<T = any> = (e?: Event) => T;

interface EventHandlers {
  [key: string]: EventHandler;
}

type EventHandlersMap = WeakMap<EventHandler, EventHandlers>;
type EventHandlersMapMap = Map<string, EventHandlersMap>;

type AttachEventHandler<EE extends NodeEventEmitter = NodeEventEmitter> = (
  emitter: EE,
  handler: EventHandler,
  options: boolean | AddEventListenerOptions
) => void;
type DetachEventHandler<EE extends NodeEventEmitter = NodeEventEmitter> = (
  emitter: EE,
  handler: EventHandler
) => void;

type DispatchEvent<
  EI extends EventInit = EventInit,
  EE extends NodeEventEmitter = NodeEventEmitter
> = (emitter: EE, options?: EI) => void;
type DispatchEventWithData<D = any, EE extends NodeEventEmitter = NodeEventEmitter> = (
  emitter: EE,
  data?: D,
  options?: EventInit
) => void;

interface EventListeners {
  [event: string]: Set<EventHandler>;
}

interface CustomNodeEvent<
  EE extends NodeEventEmitter = NodeEventEmitter,
  EI extends EventInit = EventInit,
  D = any
> {
  on: AttachEventHandler<EE>;
  off: DetachEventHandler<EE>;
  emit?: DispatchEvent<EI> | DispatchEventWithData<D>;
}

interface CustomNodeEvents<EE extends NodeEventEmitter = NodeEventEmitter> {
  [event: string]: CustomNodeEvent<EE>;
}

type DispatchOptions<D = any, EI extends EventInit = EventInit> = [D, EI] | [EI];
