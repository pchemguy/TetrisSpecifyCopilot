import type { EngineCommand } from '../../types/game';

export interface QueuedCommand extends EngineCommand {
  sequence: number;
}

export class CommandQueue {
  private readonly commands: QueuedCommand[] = [];

  private nextSequence = 0;

  enqueue(command: EngineCommand): QueuedCommand {
    const queuedCommand: QueuedCommand = {
      ...command,
      sequence: this.nextSequence,
    };

    this.nextSequence += 1;
    this.commands.push(queuedCommand);
    this.commands.sort((left, right) => {
      if (left.issuedAtMs === right.issuedAtMs) {
        return left.sequence - right.sequence;
      }

      return left.issuedAtMs - right.issuedAtMs;
    });

    return queuedCommand;
  }

  drainUpTo(issuedAtMs: number): QueuedCommand[] {
    const drainIndex = this.commands.findIndex((command) => command.issuedAtMs > issuedAtMs);

    if (drainIndex === -1) {
      return this.commands.splice(0);
    }

    return this.commands.splice(0, drainIndex);
  }

  clear(): void {
    this.commands.length = 0;
  }

  peek(): readonly QueuedCommand[] {
    return this.commands;
  }

  size(): number {
    return this.commands.length;
  }
}