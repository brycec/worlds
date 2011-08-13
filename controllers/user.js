var PI = 3.14

exports.area = function (r) {
  return PI * r * r
}

exports.circumference = function (r) {
  return 2 * PI * r
}

app.get('/*', function(req, res, next){
  var file = req.params[0];
  downloads[file] = downloads[file] || 0;
  downloads[file]++;
  next();
});
