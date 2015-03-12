var app = angular.module('app', ['ngRoute']);
app.controller('appController', function($scope) {
  // INITIALISING

  var initialiseSoundcloud = function() {
    var CLIENT_ID = '6603d805dad113c51b7df28b6737f2cc';
    SC.initialize({
      client_id: CLIENT_ID,
      redirect_uri: 'http://example.com/callback.html',
    });
  };

  initialiseSoundcloud();

  var track = function() {
    return {
      url: 'https://soundcloud.com/simonhfrost/the-flatinator',
      title: '',
      artist: '',
      position: '5000',
      duration: '1000',
      artUrl: '',
      playing: false,
      cachedSound: ''
    };
  };

  $scope.rows = [];
  for (var y = 0; y < 8; y++) {
    var row = [];
    for (var x = 0; x < 8; x++) {
      row.push(track());
    }
    $scope.rows.push(row);
  }

  $scope.selectedSquare = $scope.rows[0][0];

  // CACHING

  $scope.$watch('selectedSquare.url', function() {
    cacheSquare($scope.selectedSquare);
  });

  var cacheSquare = function(square) {
    SC.get('/resolve', { url: square.url }, function(track) {
      var trackId = track.id;
      SC.stream(trackId, function(sound) {
        square.cachedSound = sound;
      });
      setTrackInfo(square, track);
    });
  };

  $scope.rows.forEach(function(row) {
    row.forEach(function(square) {
      cacheSquare(square);
    });
  });

  // CLICKING CLIPS

  $scope.click = function(square) {
    var trackUrl = square.url;

    playTrack(square);

    $scope.selectedSquare = square;
  };

  var currentTimeout = '';
  var playTrack = function(square) {
    var sound = square.cachedSound;
    var position = square.position;
    var duration = square.duration;

    sound.stop();
    sound.setPosition(position);
    sound.play();

    window.clearTimeout(currentTimeout);
    currentTimeout = setTimeout(function() {
      sound.stop();
      // FIXME: Again, why do I have to manually digest?
      $scope.$digest();
    }, duration);
  };

  // TRACK INFO DIALOG

  var setTrackInfo = function(selectedSquare, trackInfo) {
    selectedSquare.title = trackInfo.title;
    selectedSquare.artist = trackInfo.user.username;
    if (trackInfo.artwork_url) {
      selectedSquare.artUrl = trackInfo.artwork_url;
    } else {
      selectedSquare.artUrl = trackInfo.user.avatar_url;
    }
    // FIXME: Why do I manually have to digest?
    $scope.$digest();
  };

  $scope.changeTrackClicked = function() {
    var url = prompt('URL: ');
    if (url) {
      $scope.selectedSquare.url = url;
    }
  };

  $scope.changePositionClicked = function() {
    var position = prompt('POSITION: ');
    if (position) {
      $scope.selectedSquare.position = position;
    }
  };

  $scope.changeDurationClicked = function() {
    var duration = prompt('DURATION: ');
    if (duration) {
      $scope.selectedSquare.duration = duration;
    }
  };

});
