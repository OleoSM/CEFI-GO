declare module "@vimeo/player" {
  export default class Player {
    constructor(element: HTMLElement, options?: Record<string, unknown>): Player;
    on(event: string, callback: (data: Record<string, unknown>) => void): void;
    pause(): Promise<void>;
    play(): Promise<void>;
    destroy(): Promise<void>;
  }
}
