    // main.js - Main script for the FFBeast Wheel web interface


      import { WheelApi } from './wheel_api_comm.js';
      import { SettingsFieldEnum } from './wheel_api_lib.js';
      const wheelApi = new WheelApi();
      let latestState = null; // Variable to hold the latest wheel state from readState/setupInputReportListener
      let lastConnectionStatus = null; // Track last connection status


    //Connect button handler--------------------------------------------------------------------------------------
    document.getElementById('connectBtn').addEventListener('click', async () => {
      log('Requesting device...');
      try {
        const connected = await wheelApi.connect();
        if (connected) {
          updateEffectSettings();         // Load initial effect settings
          updateHardwareSettings();       // Load initial hardware settings
          updateFirmwareLicense();        // Load firmware license
          wheelApi.setupInputReportListener((state) => {   // Listener for device state
            latestState = state;                           // Store the latest state
          });
          log('Device connected!');
        } else {
          log('No device selected or connection failed.');
        }
      } catch (e) {
        log('Error: ' + e.message);
      }
    });

    //Automatic reconnect logic---------------------------------------------------
    const RECONNECT_INTERVAL = 500;
    let reconnecting = false;
    setInterval(async () => {
      if (!wheelApi.isConnected && !reconnecting) {
        reconnecting = true;
        let connected = false;  // Declare outside try block
        try {
          connected = await wheelApi.tryAutoReconnect();
          if (connected) {
            log('Reconnected to the device successfully.');
            updateEffectSettings();         
            updateHardwareSettings();       
            updateFirmwareLicense();        
            wheelApi.setupInputReportListener((state) => {   // Listener for device state
              latestState = state;                           // Store the latest state
            });

          }
        } catch (e) {
          log('Reconnect error: ' + e.message);
        } finally {
          reconnecting = false;
          if (!connected) {
            //log('Failed to reconnect to the device.');
          }
        }
      }
    }, RECONNECT_INTERVAL);




    function renderLoop() {   //--------------------------------------------------
    // Update status-visual ui elements
        if (latestState) {
        updateTorqueBar(latestState.Torque);
        updateWheelRotation(latestState.Position);
        }
        
    
      // Update pro features visibility based on registration status
      if(latestState) {
        if (latestState.IsRegistered == 1) {
          document.querySelectorAll('[data-pro-feature]').forEach(el => el.classList.remove('not-pro'));
        } else {
          document.querySelectorAll('[data-pro-feature]').forEach(el => el.classList.add('not-pro'));
        }
      }

    // Update visibility of UI elements based on connection state
      const elementsToHide = [
          document.querySelector('.tabs'),
          document.querySelectorAll('.tab-content'),
          document.querySelector('.bottom-buttons')
      ];
      // Handle both single elements and NodeLists
      elementsToHide.forEach(element => {
          if (element instanceof NodeList) {
              // Handle NodeList from querySelectorAll
              element.forEach(el => {
                  if (wheelApi.isConnected) {
                      el.classList.remove('hidden-when-disconnected');
                  } else {
                      el.classList.add('hidden-when-disconnected');
                  }
              });
          } else if (element) {
              // Handle single elements
              if (wheelApi.isConnected) {
                  element.classList.remove('hidden-when-disconnected');
              } else {
                  element.classList.add('hidden-when-disconnected');
              }
          }
      });

      // Update connection status text and class and version
      const statusElem = document.getElementById('connectionStatus');
      const versionElem = document.getElementById('versionInfo');
      if (latestState) {
        if (statusElem) {
          if (wheelApi.isConnected !== lastConnectionStatus) {
            if (wheelApi.isConnected && latestState.IsRegistered == 1) {
              statusElem.textContent = 'FFBeast Wheel PRO connected';
              statusElem.classList.add('connected');
              statusElem.classList.remove('disconnected');
            } else if (wheelApi.isConnected) {
              statusElem.textContent = 'FFBeast Wheel connected';
              statusElem.classList.add('connected');
              statusElem.classList.remove('disconnected');
            } else {
              statusElem.textContent = 'DISCONNECTED';
              statusElem.classList.add('disconnected');
              statusElem.classList.remove('connected');
            }
            lastConnectionStatus = wheelApi.isConnected;
          }
        }
        if(versionElem){
          if(wheelApi.isConnected) {
            versionElem.textContent ="Version: " +
            [
              latestState["FirmwareVersion.ReleaseType"],
              latestState["FirmwareVersion.ReleaseMajor"],
              latestState["FirmwareVersion.ReleaseMinor"],
            latestState["FirmwareVersion.ReleasePatch"]
          ].join(".");
          }
          else versionElem.textContent = '';
        }
      }

      requestAnimationFrame(renderLoop);
    }

    renderLoop(); // Start the render loop---------------------------------------------------


    const wheelSvg = document.getElementById('wheelSvg');
    function updateWheelRotation(positionParam) {
      // positionParam: -10000 to 10000
      const motionRange = document.getElementById('MotionRange').value || 900; // Default to 900 if not set
      const positionDegrees = (positionParam / 10000) * (motionRange / 2); // Scale to motion range
      wheelSvg.style.transform = `rotate(${positionDegrees}deg)`;
    }


  const torqueBarFill = document.getElementById('torqueBarFill');
  function updateTorqueBar(torqueParam) {
    // torqueParam: -10000 to 10000
    const maxWidth = 35;
    const value = Math.max(-10000, Math.min(10000, torqueParam));
    const width = Math.abs(value) * maxWidth / 10000;
    torqueBarFill.style.width = width + 'px';
    torqueBarFill.style.left = value >= 0 ? '50%' : (50 - (width / 0.7)) + '%';
}
  


      
    // Tab switching logic
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.dataset.tab).classList.add('active');

        // Call HID update function for the selected tab
        switch (this.dataset.tab) {
          case 'effects':
            updateEffectSettings();
            break;
          case 'periphery':
            //updateGpioExtensionSettings();
            break;
          case 'controller':
            updateHardwareSettings();
            break;
          case 'license':
            //updateFirmwareLicense();
            break;
        }
      });
    });

      async function updateEffectSettings() {
        try {
          const data = await wheelApi.readEffectsSettings();
          updateElementsFromData(data);
          log('Effects settings updated.');
        } catch (e) {
          log('Failed to update effects settings: ' + e.message);
        }
      }

      async function updateHardwareSettings() {
        try {
          const data = await wheelApi.readHardwareSettings();
          updateElementsFromData(data);
          log('Hardware settings updated.');
        } catch (e) {
          log('Failed to update hardware settings: ' + e.message);
        }
      }

      async function updateGpioExtensionSettings() {
        try {
          const data = await wheelApi.readGpioExtensionSettings();
          updateElementsFromData(data);
          log('GPIO extension settings updated.');
        } catch (e) {
          log('Failed to update GPIO extension settings: ' + e.message);
        }
      }

      async function updateAdcExtensionSettings() {
        try {
          const data = await wheelApi.readAdcExtensionSettings();
          updateElementsFromData(data);
          log('ADC extension settings updated.');
        } catch (e) {
          log('Failed to update ADC extension settings: ' + e.message);
        }
      }

      async function updateFirmwareLicense() {
        try {
          const data = await wheelApi.readFirmwareLicense();
          data.SerialKey = parseNumHexStr(data.SerialKey); // Convert serial key to hex string format
          data.DeviceId = parseNumHexStr(data.DeviceId);   // Convert device ID to hex string format
          updateElementsFromData(data);
          log('Firmware license updated.');
        } catch (e) {
          log('Failed to update firmware license: ' + e.message);
        }
      }

      function parseNumHexStr(array) {
        return array.map(num => 
          num.toString(16)          // Convert to hex string
             .toUpperCase()         // Make uppercase
             .padStart(8, '0')      // Pad to 8 digits
        ).join('-');               // Join with dashes
      }

      
      // Helper: updates all elements whose id matches a key in the data object
      function updateElementsFromData(data) {
        if (!data) return;
        Object.keys(data).forEach(key => {
          const el = document.getElementById(key);
          if (el) {
            if (el.type === "checkbox") {
              // Support custom checked/unchecked values
              const checkedValue = el.getAttribute('data-checked-value');
              const uncheckedValue = el.getAttribute('data-unchecked-value');
              if (checkedValue !== null && uncheckedValue !== null) {
                // Set checked if data[key] matches checkedValue
                el.checked = String(data[key]) === String(checkedValue);
                } else {
                // Fallback to boolean logic
                el.checked = !!data[key];
                log(`Checkbox "${key}" (id="${el.id}") missing data-checked-value or data-unchecked-value, using boolean logic.`);
              }
            } else if (el.type === "range" || el.type === "number" || el.type === "text") {
              el.value = data[key];
              //get parent control and update range input if it exists
              const control = el.closest('.control');
              if (control) {
                const rangeInput = control.querySelector('input[type="range"]');
                if (rangeInput) {
                  rangeInput.value = data[key];
                }
              }
            }
            // Add more types if needed
          }
        });
      }
      


      // Button handlers for bottom-buttons
      document.getElementById('resetCenterBtn').addEventListener('click', async () => {
        try {
          await wheelApi.resetCenter();
          log('Wheel center reset command sent.');
        } catch (e) {
          log('Error sending command: ' + e.message);
        }
      });

      document.getElementById('saveAndRebootBtn').addEventListener('click', async () => {
        try {
          await wheelApi.saveAndReboot();
          log('Save and reboot command sent.');
        } catch (e) {
          log('Error sending command: ' + e.message);
        }
      });

      document.getElementById('switchtoDFUBtn').addEventListener('click', async () => {
        try {
          await wheelApi.switchtoDFU();
          log('Switch to DFU mode command sent.');
        } catch (e) {
          log('Error sending command: ' + e.message);
        }
      });

      document.getElementById('rebootControllerBtn').addEventListener('click', async () => {
        try {
          await wheelApi.rebootController();
          log('Reboot controller command sent.');
        } catch (e) {
          log('Error sending command: ' + e.message);
        }
      });


      // Activate firmware license button
      document.getElementById('activateFirmwareBtn').addEventListener('click', async () => {
        const licenseKey = document.getElementById('SerialKey').value.trim();
        if (!licenseKey) {
          log('Error: License key is empty');
          return;
        }

        try {
          await wheelApi.sendFirmwareActivation(licenseKey);
          log('Try firmware license activation command: ' + licenseKey);
        } catch (e) {
          log('Error sending command: ' + e.message);
        }
      });

      // Combined handler for range/numnber sync and all settings sending
      document.querySelectorAll('.control').forEach(control => {
        const range = control.querySelector('input[type="range"]');
        const number = control.querySelector('input[type="number"]');
        const checkbox = control.querySelector('input[type="checkbox"]');
        const fieldElem = control.querySelector('[settings-field]');

        if (range && number) {
          // Live sync values as user moves slider or types number
          range.addEventListener('input', () => {
            number.value = range.value;
          });
          number.addEventListener('input', () => {
            range.value = number.value;
          });
        }

        if (range && fieldElem) {
          range.addEventListener('pointerup', async () => {   // Mouse/touch release
            await triggerSettingSend(fieldElem);
          });
          range.addEventListener('keyup', async (e) => {      // Keyboard arrows and Enter
            if (
              ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Enter'].includes(e.key)
            ) {
              await triggerSettingSend(fieldElem);
            }
          });
          range.addEventListener('blur', async () => {      // When focus is lost (why not)
            await triggerSettingSend(fieldElem);
          });
        }

        if (number && fieldElem) {
          number.addEventListener('change', async () => {     // Only send setting when value changes
            // Clamp value to min/max
            let min = Number(number.min);
            let max = Number(number.max);
            let val = Number(number.value);
            if (!isNaN(min) && val < min) val = min;
            if (!isNaN(max) && val > max) val = max;
            if (val !== Number(number.value)) number.value = val;
              if (range) {
                if (val > Number(range.max)) {
                  range.setAttribute('max', val); 
                } 
                range.value = val;
              }
            
            await triggerSettingSend(fieldElem);
          });
        }
        
        if (checkbox && fieldElem) {
          checkbox.addEventListener('change', async () => {
            await triggerSettingSend(fieldElem);
          });
        }
      });

      // Helper function to send the setting
      async function triggerSettingSend(input) {
        const fieldName = input.getAttribute('settings-field');
        const field = SettingsFieldEnum[fieldName];
        if (field === undefined) {
          log('Unknown settings field: ' + fieldName);
          return;
        }
        
        const typeId = input.getAttribute('id');
        let fieldDataType = wheelApi.getFieldDataType(typeId);
        
        let fieldValue;
        if (input.type === "checkbox") {
          const checkedValue = input.getAttribute('data-checked-value');
          const uncheckedValue = input.getAttribute('data-unchecked-value');
          if (checkedValue === null || uncheckedValue === null) {
            log(`Error: Checkbox ${fieldName} missing data-checked-value or data-unchecked-value`);
            return;
          }
          fieldValue = input.checked ? Number(checkedValue) : Number(uncheckedValue);
        } else if (input.type === "number" || input.type === "range") {
          fieldValue = Number(input.value);
        } else if (input.tagName === "SELECT") {
          fieldValue = 0;
        } else {
          log(`Error: Unsupported input type for settings-field ${fieldName} ${field}`);
          return;
        }

        try {
          await wheelApi.sendSettingReport(field, 0, fieldValue, fieldDataType);
          log(`Try sending setting: ${fieldName} = ${fieldValue} , ${fieldDataType}`);
        } catch (e) {
          log(`Error sending setting: ${e.message}`);
        }
      }


    // Log open/close logic
    const logContainer = document.getElementById('log-container');
    const logHeader = document.getElementById('log-header');
    const logArrow = document.getElementById('log-arrow');
    logHeader.addEventListener('click', () => {
      logContainer.classList.toggle('closed');
      logContainer.classList.toggle('open');
    });

    function log(msg) {
      const logContent = document.getElementById('log-content');
      logContent.innerHTML += msg + '<br>';
      logContent.scrollTop = logContent.scrollHeight;
    }