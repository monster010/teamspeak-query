'use strict';

function keepalive(f) {
  let timeout,
      enable = false,
      duration = 240 * 1000;

  function interrupt() {
    timeout = clearTimeout(timeout);

    if(enable)
      schedule();
  }

  function schedule() {
    timeout = setTimeout(() => {
      f();
      interrupt();
    }, duration);
  }

  let o = {
    interrupt,
    enable: () => {
      enable = true

      interrupt();
    },
    disable: () => {
      enable = false

      interrupt();
    },
    setDuration: seconds => {
      if(seconds < 1) {
        o.disable();
        return;
      }

      duration = seconds * 1000;

      interrupt();
    },
    destroy: () => o.disable()
  };

  return o;
}

module.exports = keepalive;
