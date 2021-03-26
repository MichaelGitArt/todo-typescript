type Listener<V> = (value: V) => void;

interface EmmiterSubscribers<Events, Key extends keyof Events = keyof Events> {
  on<K extends Key = Key>(event: K, listener: Listener<Events[K]>): void;
}
interface EmmiterRunners<Events, Key extends keyof Events = keyof Events>
  extends EmmiterSubscribers<Events, Key> {
  emit: (event: Key, value: Events[Key]) => void;
}

export interface IEmmiter<Events, Key extends keyof Events>
  extends EmmiterRunners<Events, Key> {}

export class EventEmmiter<Events, Key extends keyof Events = keyof Events>
  implements IEmmiter<Events, Key> {
  private listeners: Map<Key, Set<Listener<Events[Key]>>> = new Map();

  on<K extends Key>(event: K, listener: Listener<Events[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const found = this.listeners.get(event);

    if (found) {
      found.add(listener);
    }
  }

  emit<K extends Key>(event: K, value: Events[K]) {
    const found = this.listeners.get(event);
    if (found) {
      found.forEach((fn) => fn(value));
    }
  }
}
