(function($) {
  window.LibraryInitialiser = function() {
    var midiDevice;

    var initialiseWebMidi = function() {
      navigator.requestMIDIAccess().then(onMidiSuccess, onMidiFailure, this);
    };

    var onMidiSuccess = function(midiAccess) {
      if(midiAccess.outputs[0]) {
        midiDevice = midiAccess.outputs[0];
        midiDevice.send([176, 0, 0]); // reset launchpad
      } else {
        console.warn("Couldn't find any midi devices");
      }
      Midi.inputs()[0].onmidimessage = function(event) {
        console.debug(event.data);
        if (event.data[2] === 127) { // use on signal and ignore off
          $('#launchpad').trigger('midiInput', event.data[1]);
        }
      };
    };

    var onMidiFailure = function(message) {
      console.log("Failed to get MIDI access - " + message);
    };

    var onMidiMessage = function(event) {
      // display proper image
    };

    var sendMidiSignal = function() {
      var RED = 15;
      var AMBER = 63;
      var GREEN = 60;

      var message = [0x90, squareNumber, AMBER];

      if (midiDevice) {
        midiDevice.send(message);
      }
    };
  };
})(jQuery);
