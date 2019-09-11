import NodeEventEmitter from ".";

const eventHandlersMap: H74_NEEC.EventHandlersMapMap = new Map();

function addMapByName(name: string): void {
  if (!eventHandlersMap.has(name)) {
    eventHandlersMap.set(name, new WeakMap());
  }
}

function existsHandlers(
  name: string,
  handler: H74_NEEC.EventHandler
): H74_NEEC.EventHandlersMap | null {
  if (eventHandlersMap.has(name)) {
    const handlersMap: H74_NEEC.EventHandlersMap = eventHandlersMap.get(name);

    if (handlersMap.has(handler)) {
      return handlersMap;
    }
  }

  return null;
}

function attachPointerEventWrapper(names: string[]): H74_NEEC.AttachEventHandler<NodeEventEmitter> {
  return (
    emitter: NodeEventEmitter,
    handler: H74_NEEC.EventHandler,
    options: boolean | AddEventListenerOptions
  ): void => {
    addMapByName(names[0]);

    const handlersMap: H74_NEEC.EventHandlersMap = eventHandlersMap.get(names[0]);

    if (!handlersMap.has(handler)) {
      let isTouch: boolean = false;
      const touchHandler: H74_NEEC.EventHandler = (e: Event) => {
        isTouch = true;
        handler(e);
      };
      const mouseHandler: H74_NEEC.EventHandler = (e: Event) => {
        if (!isTouch) {
          handler(e);
        }
        isTouch = false;
      };

      handlersMap.set(handler, { touchHandler, mouseHandler });

      emitter.on(names[1], touchHandler, options);
      emitter.on(names["PointerEvent" in window ? 0 : 2], mouseHandler, options);
    }
  };
}

function detachPointerEventWrapper(names: string[]): H74_NEEC.DetachEventHandler<NodeEventEmitter> {
  return (emitter: NodeEventEmitter, handler: H74_NEEC.EventHandler): void => {
    const handlersMap: H74_NEEC.EventHandlersMap = existsHandlers(names[0], handler);
    if (handlersMap) {
      const { touchHandler, mouseHandler }: H74_NEEC.EventHandlers = handlersMap.get(handler);

      emitter.off(names[1], touchHandler);
      emitter.off(names["PointerEvent" in window ? 0 : 2], mouseHandler);

      handlersMap.delete(handler);
    }
  };
}

const pointerDownNames: string[] = ["pointerdown", "touchstart", "mousedown"];
const pointerDown: H74_NEEC.CustomNodeEvent<NodeEventEmitter> = {
  off: detachPointerEventWrapper(pointerDownNames),
  on: attachPointerEventWrapper(pointerDownNames)
};

const pointerUpNames: string[] = ["pointerup", "touchend", "mouseup"];
const pointerUp: H74_NEEC.CustomNodeEvent<NodeEventEmitter> = {
  off: detachPointerEventWrapper(pointerUpNames),
  on: attachPointerEventWrapper(pointerUpNames)
};

const pointerMoveNames: string[] = ["pointermove", "touchmove", "mousemove"];
const pointerMove: H74_NEEC.CustomNodeEvent<NodeEventEmitter> = {
  off: detachPointerEventWrapper(pointerMoveNames),
  on: attachPointerEventWrapper(pointerMoveNames)
};

const tapName: string = "tap";
const tap: H74_NEEC.CustomNodeEvent<NodeEventEmitter> = {
  off: (emitter: NodeEventEmitter, handler: H74_NEEC.EventHandler) => {
    const handlersMap: H74_NEEC.EventHandlersMap = existsHandlers(tapName, handler);
    if (handlersMap) {
      const { startTouch, endTouch, cancelTouch }: H74_NEEC.EventHandlers = handlersMap.get(
        handler
      );
      emitter.off("touchstart", startTouch);
      emitter.off("touchend", endTouch);

      document.removeEventListener("touchmove", cancelTouch, false);
      document.removeEventListener("touchleave", cancelTouch, false);
      document.removeEventListener("touchcancel", cancelTouch, false);

      handlersMap.delete(handler);
    }
  },
  on: (
    emitter: NodeEventEmitter,
    handler: H74_NEEC.EventHandler,
    options: boolean | AddEventListenerOptions
  ) => {
    addMapByName(tapName);

    const handlersMap: H74_NEEC.EventHandlersMap = eventHandlersMap.get(tapName);

    if (!handlersMap.has(handler)) {
      let isTap: boolean = false;
      const startTouch: H74_NEEC.EventHandler = () => (isTap = true);
      const endTouch: H74_NEEC.EventHandler = (e: Event) => {
        if (isTap) handler(e);
      };
      const cancelTouch: H74_NEEC.EventHandler = () => (isTap = false);

      handlersMap.set(handler, { startTouch, endTouch, cancelTouch });

      emitter.on("touchstart", startTouch, options);
      emitter.on("touchend", endTouch, options);

      document.addEventListener("touchmove", cancelTouch, false);
      document.addEventListener("touchleave", cancelTouch, false);
      document.addEventListener("touchcancel", cancelTouch, false);
    }
  }
};

const pointerTapName: string = "pointertap";
const pointerTap: H74_NEEC.CustomNodeEvent<NodeEventEmitter> = {
  off: (emitter: NodeEventEmitter, handler: H74_NEEC.EventHandler) => {
    const handlersMap: H74_NEEC.EventHandlersMap = existsHandlers(pointerTapName, handler);
    if (handlersMap) {
      const { touchHandler, mouseHandler }: H74_NEEC.EventHandlers = handlersMap.get(handler);

      tap.off(emitter, touchHandler);
      emitter.off("click", mouseHandler);

      handlersMap.delete(handler);
    }
  },
  on: (
    emitter: NodeEventEmitter,
    handler: H74_NEEC.EventHandler,
    options: boolean | AddEventListenerOptions
  ) => {
    addMapByName(pointerTapName);

    const handlersMap: H74_NEEC.EventHandlersMap = eventHandlersMap.get(pointerTapName);
    if (!handlersMap.has(handler)) {
      let isTouch: boolean = false;
      const touchHandler: H74_NEEC.EventHandler = (e: Event) => {
        isTouch = true;
        handler(e);
      };
      const mouseHandler: H74_NEEC.EventHandler = (e: Event) => {
        if (!isTouch) {
          handler(e);
        }
        isTouch = false;
      };

      handlersMap.set(handler, { touchHandler, mouseHandler });

      tap.on(emitter, touchHandler, options);
      emitter.on("click", mouseHandler, options);
    }
  }
};

export default { pointerDown, pointerUp, pointerMove, pointerTap, tap };
