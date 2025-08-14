# MIDI Controller Application

## Codebase Summary

This is a high-quality vanilla JavaScript web application that functions as a virtual piano. It is built without any major frameworks like React or Vue, focusing on performance and direct use of web APIs.

### Key Architectural Points:

*   **No Frameworks:** The project is written in pure, modern JavaScript (`"use strict"`). It does not use a UI framework like React, Angular, or Vue.
*   **Git Submodules for Dependencies:** Instead of using a package manager like `npm` or `yarn`, the project manages its dependencies through Git submodules. It pulls in several custom libraries from GitHub user `gridsound`:
    *   `gs-ui-components`: Provides custom UI elements like `<gsui-keys>` and analysers.
    *   `gs-utils`: Contains utility functions for DOM manipulation, audio, math, etc.
    *   `gs-wa-components`: Web Audio components, specifically for handling MIDI devices.
    *   `assets` and `samples`: Repositories for fonts, images, and the core piano audio samples.
*   **Programmatic UI Creation:** The entire user interface is built dynamically in the `run.js` file. It uses utility functions (from `gs-utils-dom.js`) to create and append all the necessary HTML and SVG elements to the `document.body`.
*   **Build Process:** The `build-conf.mjs` file defines how the application should be assembled. A build tool reads this configuration to concatenate all the specified JavaScript and CSS files from the main project and its submodules into a final `index.html` file.

### Core Functionality:

*   **Sample-Based Synthesis:** This is not a synthesizer that generates sounds from oscillators. Instead, it plays back high-quality audio samples recorded from a real Steinway & Sons piano. The samples are loaded by octave from the `samples` directory.
*   **Web Audio API:** It uses the Web Audio API for all audio processing. When a key is pressed, it creates an `AudioBufferSourceNode` to play the correct sample, a `GainNode` to control the volume based on velocity, and a `BiquadFilterNode` to make the sound brighter or softer.
*   **Multiple Input Methods:**
    1.  **Mouse:** You can click the keys on the screen.
    2.  **Computer Keyboard:** The keys are mapped to standard keyboard layouts.
    3.  **MIDI Devices:** It can connect to external MIDI keyboards and devices using the `gswaMIDIDevices` component.
*   **Visual Feedback:** The application includes a real-time audio analyser (`<gsui-analyser-td>`) that visualizes the sound being played.
*   **Responsive Design:** The `onresize` function in `run.js` and the CSS in `style.css` work together to make the piano keyboard and layout adapt to different screen sizes.

In summary, this is a well-structured, dependency-free (in the traditional package manager sense) web application that leverages browser APIs and custom components to create a realistic and performant virtual piano experience.

---

## Drag-to-Play Event Handling

The "drag-to-play" functionality is achieved through a combination of several mouse events, rather than relying on individual `click` events. Here's how it works:

1.  **`mousedown` Initiates "Play Mode":** When you first press the mouse button down on any key, the component enters an internal "active" or "dragging" state. It fires a `keyDown` event for that first key, which triggers the `startKey()` function to play the note.
2.  **`mouseover` Triggers New Notes:** While you keep the mouse button held down, the component continuously listens for `mouseover` events. As your cursor drags over a *new* piano key, the component immediately:
    *   Fires a `keyUp` event for the previous key you were on (to stop its sound).
    *   Fires a `keyDown` event for the new key you just entered (to start its sound).
3.  **`mouseup` Ends "Play Mode":** When you finally release the mouse button anywhere on the page, the component fires a final `keyUp` event for the last key that was played and exits its "active" state.

This logic is all encapsulated within the `gsui-keys.js` component, which is part of the `gs-ui-components` submodule. This keeps the main `run.js` file much cleaner, as it only has to listen for two simple custom events (`keyDown` and `keyUp`) without worrying about the complex mouse-dragging logic.
