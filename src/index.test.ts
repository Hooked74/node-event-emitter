import NodeEventEmitter from "./";

let handler1: jest.Mock, handler2: jest.Mock, bodyEmitter: NodeEventEmitter<HTMLElement>;

function createMock(): void {
  handler1 = jest.fn();
  handler2 = jest.fn();
  bodyEmitter = new NodeEventEmitter(document.body);
}

export default describe("NodeEventEmitter", () => {
  describe("test on and off by handler", () => {
    beforeAll(createMock);

    it("should attach event and trigger", () => {
      bodyEmitter.on("event", handler1);
      bodyEmitter.emit("event", "value");

      expect(handler1.mock.calls.length).toBe(1);
      expect(handler1.mock.calls[0][0].detail).toBe("value");
    });

    it("should detach event", () => {
      bodyEmitter.off("event", handler1);
      bodyEmitter.emit("event");

      expect(handler1.mock.calls.length).toBe(1);
    });
  });

  describe("test on and off all events by event name", () => {
    beforeAll(createMock);

    it("should attach events and trigger all events", () => {
      bodyEmitter.on("event", handler1);
      bodyEmitter.on("event", handler2);
      bodyEmitter.emit("event", "value");

      expect(handler1.mock.calls.length).toBe(1);
      expect(handler2.mock.calls.length).toBe(1);
      expect(handler1.mock.calls[0][0].detail).toBe("value");
      expect(handler2.mock.calls[0][0].detail).toBe("value");
    });

    it("should detach events", () => {
      bodyEmitter.off("event");
      bodyEmitter.emit("event");

      expect(handler1.mock.calls.length).toBe(1);
      expect(handler2.mock.calls.length).toBe(1);
    });
  });

  describe("test on and off all events", () => {
    beforeAll(createMock);

    it("should attach events and trigger all events", () => {
      bodyEmitter.on("event1", handler1);
      bodyEmitter.on("event2", handler2);
      bodyEmitter.emit("event1", "value");

      expect(handler1.mock.calls.length).toBe(1);
      expect(handler2.mock.calls.length).toBe(0);
      expect(handler1.mock.calls[0][0].detail).toBe("value");
    });

    it("should detach events", () => {
      bodyEmitter.off();
      bodyEmitter.emit("event2");

      expect(handler1.mock.calls.length).toBe(1);
      expect(handler2.mock.calls.length).toBe(0);
    });
  });

  describe("test once", () => {
    beforeAll(createMock);

    it("should attach event once and trigger", () => {
      bodyEmitter.once("event", handler1);
      bodyEmitter.emit("event");
      bodyEmitter.emit("event");

      expect(handler1.mock.calls.length).toBe(1);
    });
  });

  describe("test all emits", () => {
    beforeAll(createMock);

    it("should attach UI event and trigger", () => {
      bodyEmitter.once("abort", handler1);
      bodyEmitter.emitUI("abort");

      expect(handler1.mock.calls.length).toBe(1);
    });

    it("should attach Mouse event and trigger", () => {
      bodyEmitter.once("click", handler1);
      bodyEmitter.emitMouse("click");

      expect(handler1.mock.calls.length).toBe(2);
    });

    it("should attach Keyboard event and trigger", () => {
      bodyEmitter.once("keydown", handler1);
      bodyEmitter.emitKeyboard("keydown");

      expect(handler1.mock.calls.length).toBe(3);
    });

    it("should attach Wheel event and trigger", () => {
      bodyEmitter.once("wheel", handler1);
      bodyEmitter.emitWheel("wheel");

      expect(handler1.mock.calls.length).toBe(4);
    });

    it("should attach Focus event and trigger", () => {
      bodyEmitter.once("blur", handler1);
      bodyEmitter.emitFocus("blur");

      expect(handler1.mock.calls.length).toBe(5);
    });

    it("should attach Touch event and trigger", () => {
      bodyEmitter.once("touchcancel", handler1);
      bodyEmitter.emitTouch("touchcancel");

      expect(handler1.mock.calls.length).toBe(6);
    });
  });

  describe("test customEvents", () => {
    beforeAll(createMock);

    it("should attach tap event", () => {
      bodyEmitter.on(NodeEventEmitter.TAP, handler1);
      bodyEmitter.emit("click");
      bodyEmitter.emitTouch("touchstart");
      bodyEmitter.emitTouch("touchend");

      expect(handler1.mock.calls.length).toBe(2);
    });

    it("should detach tap event", () => {
      bodyEmitter.off(NodeEventEmitter.TAP, handler1);
      bodyEmitter.emit("click");
      bodyEmitter.emitTouch("touchstart");
      bodyEmitter.emitTouch("touchend");

      expect(handler1.mock.calls.length).toBe(2);
    });
  });
});
