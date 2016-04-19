
/**
 * Module dependencies.
 */
var prismic = require('express-prismic');
var configuration = require('./prismic-configuration').Configuration;
var app = require('./config');
var PORT = app.get('port');

function handleError(err, req, res) {
  if (err.status == 404) {
    res.status(404).send("404 not found");
  } else {
    res.status(500).send("Error 500: " + err.message);
  }
}

app.listen(PORT, function() {
  console.log('Express server listening on port ' + PORT);
});

app.route('/').get(function(req, res) {
  res.render('index');
});

app.route('/search').get(function(req, res) {
  var q = req.query.q;
  prismic.api(configuration.apiEndpoint, configuration.accessToken).then(function(api) {
    return api.query(prismic.Predicates.fulltext('document', q));
  }).then(function(response) {
    var json = response.results.map(function (doc) {
      return {
        id: doc.id,
        slug: doc.slug
      };
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(json));
  }).catch(function (err) {
    handleError(err, req, res);
  });
});

app.route('/preview').get(prismic.preview);
