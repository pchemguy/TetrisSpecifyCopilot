import { useEffect } from 'react';
import type { EngineCommandName } from '../../types/game';

export interface KeyboardInputHandlerProps {
  onCommand: (type: EngineCommandName) => void;
}

const KEY_DOWN_COMMANDS: Record<string, EngineCommandName> = {
  ArrowLeft: 'move_left',
  ArrowRight: 'move_right',
  ArrowDown: 'soft_drop_start',
  ArrowUp: 'rotate_cw',
  x: 'rotate_cw',
  X: 'rotate_cw',
  z: 'rotate_ccw',
  Z: 'rotate_ccw',
  Space: 'hard_drop',
  ' ': 'hard_drop',
  c: 'hold',
  C: 'hold',
  Shift: 'hold',
  p: 'pause_toggle',
  P: 'pause_toggle',
  Escape: 'pause_toggle',
  r: 'restart',
  R: 'restart',
};

const NON_REPEATABLE_COMMANDS = new Set<EngineCommandName>([
  'rotate_cw',
  'rotate_ccw',
  'hard_drop',
  'hold',
  'pause_toggle',
  'restart',
]);

export function KeyboardInputHandler({ onCommand }: KeyboardInputHandlerProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const command = KEY_DOWN_COMMANDS[event.key];

      if (!command) {
        return;
      }

      if (event.repeat && NON_REPEATABLE_COMMANDS.has(command)) {
        return;
      }

      event.preventDefault();
      onCommand(command);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowDown') {
        return;
      }

      event.preventDefault();
      onCommand('soft_drop_stop');
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onCommand]);

  return null;
}

export default KeyboardInputHandler;