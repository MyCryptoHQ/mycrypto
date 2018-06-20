import { BrowserWindow, ipcMain, IpcMessageEvent } from 'electron';

const EVENT = 'enclave:pin';
const scriptNonce = Math.floor(Math.random() * 1000000000000);
const html = `
<html>
  <head>
    <title>TREZOR - Enter PIN</title>
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'nonce-${scriptNonce}'">
    <style>
      body {
        color: #FFF;
        padding: 20px;
        margin: 0;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        box-sizing: border-box;
      }
      body * {
        box-sizing: inherit;
      }

      h1,
      h2 {
        text-align: center;
      }
      h1 {
        font-size: 28px;
        font-weight: 100;
        margin-bottom: 3px;
        letter-spacing: 1.2px;
      }
      h2 {
        opacity: 0.5;
        font-size: 13px;
        font-weight: 400;
      }

      .pin-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
        width: 180px;
        height: 180px;
      }
      .pin-button {
        position: relative;
        width: 54px;
        height: 54px;
        border-radius: 4px;
        border: 1px solid #FFF;
        background: rgba(255, 255, 255, 0.1);
        transition: all 120ms ease;
        opacity: 0.4;
      }
      .pin-button:hover,
      .pin-button:active {
        opacity: 0.8;
      }
      .pin-button:after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 100%;
        background: #FFF;
      }

      .pin-controls {
        position: relative;
        width: 180px;
        margin: 0 auto;
      }
      .pin-input {
        width: 100%;
        background: none;
        border: none;
        border-bottom: 1px solid #FFF;
        opacity: 0.7;
        font-size: 32px;
        padding: 0 4px;
        margin-bottom: 10px;
        letter-spacing: 3px;
        color: #FFF;
      }
      .pin-clear {
        position: absolute;
        right: 0;
        top: 11px;
        padding: 4px;
        border-radius: 100%;
        border: 2px solid;
        opacity: 0.6;
      }
      .pin-clear:hover,
      .pin-clear:active {
        opacity: 0.8;
      }
      .pin-unlock {
        width: 100%;
        padding: 6px;
        opacity: 0.6;
        text-align: center;
        font-size: 10px;
        border: 1px solid #FFF;
        border-radius: 2px;
        text-transform: uppercase;
        letter-spacing: 1.2px;
      }
      .pin-unlock:hover,
      .pin-unlock:active {
        opacity: 0.8;
      }

      .close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 14px;
        height: 14px;
        opacity: 0.3;
        overflow: hidden;
      }
      .close:hover,
      .close:focus {
        opacity: 1;
      }

      button {
        display: block;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        color: #FFF;
        outline: none;
      }
    </style>
  </head>
  <body>
    <h1>Enter your PIN</h1>
    <h2>Look at your device for the number positions</h2>

    <div class="pin-buttons">
      <button class="pin-button" data-number="7"></button>
      <button class="pin-button" data-number="8"></button>
      <button class="pin-button" data-number="9"></button>

      <button class="pin-button" data-number="4"></button>
      <button class="pin-button" data-number="5"></button>
      <button class="pin-button" data-number="6"></button>

      <button class="pin-button" data-number="1"></button>
      <button class="pin-button" data-number="2"></button>
      <button class="pin-button" data-number="3"></button>
    </div>

    <div class="pin-controls">
      <input class="pin-input" type="password" readonly/>
      <button class="pin-clear">
        <svg viewPort="0 0 8 8" width="8" height="8" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <line x1="1" y1="7" x2="7" y2="1" stroke="white" stroke-width="2"/>
          <line x1="1" y1="1" x2="7" y2="7" stroke="white" stroke-width="2"/>
        </svg>
      </button>

      <button class="pin-unlock">
        Unlock
      </button>
    </div>

    <button class="close">
      <svg viewPort="0 0 12 12" width="12" height="12" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <line x1="1" y1="11" x2="11" y2="1" stroke="white" stroke-width="2"/>
        <line x1="1" y1="1" x2="11" y2="11" stroke="white" stroke-width="2"/>
      </svg>
    </button>

    <script nonce="${scriptNonce}">
      var ipcRenderer = require('electron').ipcRenderer;
      var remote = require('electron').remote;
      var pin = [];
      var pinButtons = document.querySelectorAll('.pin-button');
      var input = document.querySelector('.pin-input');
      var unlock = document.querySelector('.pin-unlock');
      var clear = document.querySelector('.pin-clear');
      var close = document.querySelector('.close');

      var closeWindow = function() {
        var window = remote.getCurrentWindow();
        window.close();
      }

      pinButtons.forEach(function(el) {
        el.addEventListener('click', function(ev) {
          pin.push(ev.currentTarget.getAttribute('data-number'));
          input.value = pin.join('');
        });
      });

      clear.addEventListener('click', function() {
        pin = [];
        input.value = '';
      });

      unlock.addEventListener('click', function() {
        if (!pin.length) return;
        ipcRenderer.send('${EVENT}', pin.join(''));
        closeWindow();
      });

      close.addEventListener('click', function() {
        closeWindow();
      });
    </script>
  </body>
</html>
`;

export async function showPinPrompt(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const window = new BrowserWindow({
      width: 320,
      height: 380,
      frame: false,
      backgroundColor: '#21252B',
      darkTheme: true
    });

    window.on('closed', () => {
      reject(new Error('ENCLAVE_TREZOR_CANCELED'));
    });

    ipcMain.once(EVENT, (_: IpcMessageEvent, pin: string) => {
      resolve(pin);
    });

    window.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(html)}`);
    window.show();
    window.focus();
  });
}
