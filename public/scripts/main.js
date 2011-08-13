var socket = io.connect(window.location.origin);

socket.emit('echo', 'hi');
socket.on('echo', function(d) {
  console.log(d);
});
