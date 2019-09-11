import "@hooked74/events-polyfill";
import CustomNodeEvents from "./custom-node-events";

export { CustomNodeEvents };

export default class NodeEventEmitter<N extends Node = Node> {
  public static readonly CLICK: string = "click";
  public static readonly TAP: string = "pointerTap";
  public static readonly DOWN: string = "pointerDown";
  public static readonly UP: string = "pointerUp";
  public static readonly MOVE: string = "pointerMove";

  // WIP
  public static readonly OVER: string = "mouseover"; // "pointerover";
  public static readonly OUT: string = "mouseout"; // "pointerout";
  public static readonly ENTER: string = "mouseenter"; // "pointerenter";
  public static readonly LEAVE: string = "mouseleave"; // "pointerleave";

  protected customEvents: NEEC.CustomNodeEvents<NodeEventEmitter> = CustomNodeEvents;

  private listeners: NEEC.EventListeners = {};

  constructor(protected node: N) {}

  public on(
    name: string,
    handler: NEEC.EventHandler,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (name in this.customEvents) {
      this.customEvents[name].on(this, handler, options);
    } else {
      if (this.listeners[name]) {
        this.listeners[name].add(handler);
      } else {
        this.listeners[name] = new Set([handler]);
      }

      this.node.addEventListener(name, handler, options);
    }
  }

  public off(name?: string, handler?: NEEC.EventHandler): void {
    if (typeof name !== "undefined") {
      if (name in this.customEvents) {
        this.customEvents[name].off(this, handler);
      } else if (name in this.listeners) {
        if (typeof handler !== "undefined") {
          this.removeListener(name, handler);
        } else {
          this.removeListenersByName(name);
        }
      }
    } else {
      this.removeAllListeners();
    }
  }

  public once(
    name: string,
    handler: NEEC.EventHandler,
    options?: boolean | AddEventListenerOptions
  ): void {
    const wrapper: NEEC.EventHandler = (e: Event) => {
      this.off(name, wrapper);
      handler(e);
    };

    this.on(name, wrapper, options);
  }

  /**
   * any events
   */
  public emit<D>(name: string, data?: D, options: EventInit = {}): void {
    this.dispatch(name, new CustomEvent(name, { ...options, detail: data }), data, options);
  }

  /**
   * abort	The event occurs when the loading of a media is aborted
   * beforeunload	The event occurs before the document is about to be unloaded
   * error	The event occurs when an error occurred during the loading of a media file
   * load	The event occurs when an object has loaded
   * resize	The event occurs when the document view is resized
   * scroll	The event occurs when an element's scrollbar is being scrolled
   * select	The event occurs after the user selects some text (for <input> and <textarea>)
   * unload	The event occurs once a page has unloaded (for <body>)
   */
  public emitUI(name: string, options: UIEventInit = {}): void {
    this.dispatch(name, new UIEvent(name, options), options);
  }

  /**
   * onclick	The event occurs when the user clicks on an element
   * oncontextmenu	The event occurs when the user right-clicks on an element to open a context menu
   * ondblclick	The event occurs when the user double-clicks on an element
   * onmousedown	The event occurs when the user presses a mouse button over an element
   * onmouseenter	The event occurs when the pointer is moved onto an element
   * onmouseleave	The event occurs when the pointer is moved out of an element
   * onmousemove	The event occurs when the pointer is moving while it is over an element
   * onmouseout	The event occurs when a user moves the mouse pointer out of an element, or out of one of its children
   * onmouseover	The event occurs when the pointer is moved onto an element, or onto one of its children
   * onmouseup	The event occurs when a user releases a mouse button over an element
   */
  public emitMouse(name: string, options: MouseEventInit = {}): void {
    this.dispatch(name, new MouseEvent(name, options), options);
  }

  /**
   * onkeydown	The event occurs when the user is pressing a key
   * onkeypress	The event occurs when the user presses a key
   * onkeyup	The event occurs when the user releases a key
   */
  public emitKeyboard(name: string, options: KeyboardEventInit = {}): void {
    this.dispatch(name, new KeyboardEvent(name, options), options);
  }

  /**
   * onwheel	The event occurs when the mouse wheel rolls up or down over an element
   */
  public emitWheel(name: string, options: WheelEventInit = {}): void {
    this.dispatch(name, new WheelEvent(name, options), options);
  }

  /**
   * onblur	The event occurs when an element loses focus
   * onfocus The event occurs when an element gets focus
   * onfocusin The event occurs when an element is about to get focus
   * onfocusout	The event occurs when an element is about to lose focus
   */
  public emitFocus(name: string, options: FocusEventInit = {}): void {
    this.dispatch(name, new FocusEvent(name, options), options);
  }

  /**
   * ontouchcancel	The event occurs when the touch is interrupted
   * ontouchend	The event occurs when a finger is removed from a touch screen
   * ontouchmove	The event occurs when a finger is dragged across the screen
   * ontouchstart	The event occurs when a finger is placed on a touch screen
   */
  public emitTouch(name: string, options: TouchEventInit = {}): void {
    this.dispatch(name, new TouchEvent(name, options), options);
  }

  /**
   * pointerover
   * pointerenter
   * pointerdown
   * pointermove
   * pointerup
   * pointercancel
   * pointerout
   * pointerleave
   * gotpointercapture
   * lostpointercapture
   */
  public emitPointer(name: string, options: PointerEventInit = {}): void {
    this.dispatch(name, new PointerEvent(name, options), options);
  }

  private removeListener(name: string, handler: NEEC.EventHandler): void {
    this.listeners[name].delete(handler);
    this.node.removeEventListener(name, handler);
  }

  private removeListenersByName(name: string): void {
    for (const usedHandler of this.listeners[name]) {
      this.removeListener(name, usedHandler);
    }
  }

  private removeAllListeners(): void {
    for (const name in this.listeners) {
      this.removeListenersByName(name);
    }
  }

  private dispatch<E extends Event, D, EI>(
    name: string,
    event: E,
    ...args: NEEC.DispatchOptions<D, EI>
  ): void {
    if (this.customEvents[name] && this.customEvents[name].emit) {
      this.customEvents[name].emit(this, ...args);
    } else {
      this.node.dispatchEvent(event);
    }
  }
}
