(function($) {
  window.LibraryInitialiser = Backbone.Model.extend({

    initialize: function() {
      this.setupSoundcloud();
      this.setupWebMidi();
    },

    setupSoundcloud: function() {
      window.CLIENT_ID = '6603d805dad113c51b7df28b6737f2cc';

      SC.initialize({
        client_id: window.CLIENT_ID,
        redirect_uri: 'http://example.com/callback.html',
      });
    },

    setupWebMidi: function() {
      navigator.requestMIDIAccess().then(this.onMidiSuccess, this.onMidiFailure, this);
    },

    onMidiSuccess: function(midiAccess) {
      if(midiAccess.outputs[0]) {
        window.midiDevice = midiAccess.outputs[0];
        window.midiDevice.send([176, 0, 0]); // reset launchpad
      } else {
        console.warn("Couldn't find any midi devices");
      }
      if(window.Midi) {
        window.Midi.inputs()[0].onmidimessage = function(event) {
          console.debug(event.data);
          if (event.data[2] === 127) { // use on signal and ignore off
            $('#launchpad').trigger('midiInput', event.data[1]);
          }
        };
      } else {
        console.warn("Couldn't find and midi devices");
      };
    },

    onMidiFailure: function(message) {
      console.log("Failed to get MIDI access - " + message);
    },

    onMidiMessage: function(event) {
      $('#launchpad').trigger('midiInput', event.data[1]);
    },

    sendMidiSignal: function(message) {
      if(window.midiDevice) {
        window.midiDevice.send(message);
      }
    }
  });
})(jQuery);
