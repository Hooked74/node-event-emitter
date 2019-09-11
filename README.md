<h1 align="center"><strong>Node Event Emitter</strong></h1>

[![Build Status](https://travis-ci.org/Hooked74/node-event-emitter.svg?branch=master)](https://travis-ci.org/Hooked74/node-event-emitter)
![npm](https://img.shields.io/npm/v/@hooked74/node-event-emitter)
![Codecov](https://img.shields.io/codecov/c/github/hooked74/node-event-emitter?token=203907d891d1498e9910c58a0b720633)
![NPM](https://img.shields.io/npm/l/@hooked74/node-event-emitter)
![Module Size](https://img.shields.io/badge/dynamic/json?color=success&label=module%20size&query=%24.module&url=https%3A%2F%2Fraw.githubusercontent.com%2FHooked74%2Fnode-event-emitter%2Fmaster%2F.size-snapshot.json)

## Table of contents

<!--ts-->
   * [Install](#install)
   * [Basic Usage](#basic-usage)
   * [Advanced Usage](#advanced-usage)
   * [Methods](#methods)
   * [Custom Events](#custom-events)
<!--te-->


## Install

```
npm install @hooked74/node-event-emitter
```

## Basic Usage

```js
// initialize
const emitter = new NodeEventEmitter(document.body);

// attach handlers
const handler1 = e => console.log(e instanceof MouseEvent);
const handler2 = e => console.log(e instanceof CustomEvent, e.detail);
emitter.on(NodeEventEmitter.CLICK, handler1);
emitter.on("custom event", handler2);

// dispatch
emitter.emitMouse(NodeEventEmitter.CLICK);
emitter.emit("custom event", "value");

// output:
// true
// true value

// detach specific handler
emitter.off(NodeEventEmitter.CLICK, handler1);

// detach all handlers for specific event
emitter.off(NodeEventEmitter.CLICK);

// detach all handlers
emitter.off();

```

## Advanced Usage

```js
import NodeEventEmitter, { CustomNodeEvents } from "node-event-emitter";

// create my custom event
const myCustomEvent = {
  off(emitter: NodeEventEmitter, handler: EventHandler) {
    // ...
    emitter.off("my custom event", handler);
    console.log("detach my custom event")
    // ...
  },
  on(
    emitter: NodeEventEmitter,
    handler: EventHandler,
    options: boolean | AddEventListenerOptions
  ) {
    // ...
    emitter.on("my custom event", handler);
    console.log("attach my custom event")
    // ...
  },
  // optional
  emit(
    emitter: NodeEventEmitter,
    data: any,
    options: EventInit
  ) {
    // ...
    emitter.emit("my custom event", data, options);
    console.log("dispatch my custom event")
    // ...
  }
}

// extend emitter and override custom events
class CustomNodeEventEmitter extends NodeEventEmitter {
  customEvents = { ...CustomNodeEvents, myCustomEvent };
}

// usage my custom event
const emitter = new CustomNodeEventEmitter(document.body);

const handler = e => console.log(e.detail);
emitter.on("myCustomEvent", handler);
emitter.emit("myCustomEvent", "some value");
emitter.off("myCustomEvent", handler);

// output:
// attach my custom event
// some value
// dispatch my custom event
// detach my custom event
```

## Methods

### **emitter.on(name, handler[, options])**
- name `<string>` The name of the event.
- handler `<(e?: Event) => any>` The callback function.
- options **(optional)** `<boolean> | <AddEventListenerOptions>`  An options object that specifies characteristics about the event listener.
- Returns: `<void>`

Sets up a function that will be called whenever the specified event is delivered to the target. Uses **addEventListener**, but if the event is found in **customEvents** will use it.

### **emitter.off([name, handler])**
- name **(optional)** `<string>` The name of the event.
- handler **(optional)** `<(e?: Event) => any>` The callback function.
- Returns: `<void>`

Removes event listeners. Uses **removeEventListener**, but if the event is found in **customEvents** will use it. If no handler is specified, it will delete all handlers named **name**. If the **name** is also not specified, then all handlers will be deleted.

### **emitter.once(name, handler[, options])**
- name `<string>` The name of the event.
- handler `<(e?: Event) => any>` The callback function.
- options **(optional)** `<boolean> | <AddEventListenerOptions>`  An options object that specifies characteristics about the event listener.
- Returns: `<void>`

The listener should be invoked at most once after being added and automatically removed when invoked. Used the same way as **emitter.on**.

### **emitter.emit(name[, data, options])**
- name `<string>` The name of the event.
- data **(optional)** `<any>` Any data passed when initializing the event.
- options **(optional)** `<EventInit>` Event options
- Returns: `<void>`

Triggers an event. Uses **CustomEvent** and **dispatchEvent** method. If the event is found in **customEvents** will use it. Can dispatch any events.

### **emitter.emitUI(name[, options])**
- name `<string>` The name of the event.
- options **(optional)** `<UIEventInit>` Event options
- Returns: `<void>`

Triggers an event. Uses **UIEvent** and **dispatchEvent** method. If the event is found in **customEvents** will use it. Can dispatch *abort*, *beforeunload*, *error*, *load*, *resize*, *scroll*, *select*, *unload* events.

### **emitter.emitMouse(name[, options])**
- name `<string>` The name of the event.
- options **(optional)** `<MouseEventInit>` Event options
- Returns: `<void>`

Triggers an event. Uses **MouseEvent** and **dispatchEvent** method. If the event is found in **customEvents** will use it. Can dispatch *click*, *contextmenu*, *dblclick*, *mousedown*, *mouseenter*, *mouseleave*, *mousemove*, *mouseout*, *mouseover*, *mouseup* events.

### **emitter.emitKeyboard(name[, options])**
- name `<string>` The name of the event.
- options **(optional)** `<KeyboardEventInit>` Event options
- Returns: `<void>`

Triggers an event. Uses **KeyboardEvent** and **dispatchEvent** method. If the event is found in **customEvents** will use it. Can dispatch *keydown*, *keypress*, *keyup* events.

### **emitter.emitWheel(name[, options])**
- name `<string>` The name of the event.
- options **(optional)** `<WheelEventInit>` Event options
- Returns: `<void>`

Triggers an event. Uses **WheelEvent** and **dispatchEvent** method. If the event is found in **customEvents** will use it. Can dispatch *wheel* events.

### **emitter.emitFocus(name[, options])**
- name `<string>` The name of the event.
- options **(optional)** `<FocusEventInit>` Event options
- Returns: `<void>`

Triggers an event. Uses **FocusEvent** and **dispatchEvent** method. If the event is found in **customEvents** will use it. Can dispatch *blur*, *focus*, *focusin*, *focusout* events.

### **emitter.emitTouch(name[, options])**
- name `<string>` The name of the event.
- options **(optional)** `<TouchEventInit>` Event options
- Returns: `<void>`

Triggers an event. Uses **TouchEvent** and **dispatchEvent** method. If the event is found in **customEvents** will use it. Can dispatch *touchcancel*, *touchend*, *touchmove*, *touchstart* events.

### **emitter.emitPointer(name[, options])**
- name `<string>` The name of the event.
- options **(optional)** `<PointerEventInit>` Event options
- Returns: `<void>`

Triggers an event. Uses **PointerEvent** and **dispatchEvent** method. If the event is found in **customEvents** will use it. Can dispatch *pointerover*, *pointerenter*, *pointerdown*, *pointermove*, *pointerup*, *pointercancel*, *pointerout*, *pointerleave*, *gotpointercapture*, *lostpointercapture* events.

## Custom Events

The following custom events are available by default:

### **pointerTap**

Emulates a `click` event on the desktop and `tap`(`touchstart`, `touchend`) on touch devices.

### **pointerDown**

Emulates the interaction of events `touchstart`, `mousedown`, `pointerdown`.

### **pointerUp**

Emulates the interaction of events `touchend`, `mouseup`, `pointerup`.

### **pointerMove**

Emulates the interaction of events `touchmove`, `mousemove`, `pointermove`.
