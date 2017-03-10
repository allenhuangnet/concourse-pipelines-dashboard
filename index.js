var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config')
var request = require('request')
var _ = require('lodash');
var async = require('async')

var app = express();

app.set('port', (process.env.PORT || 8080));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/resources'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var pipelines;
var token;

get_bearer = (callback) => {
    request({
      url: config.concourse_url + config.api_subdirectory + "/teams/" + config.concourse_team + "/auth/token",
      auth: {
        username: config.concourse_username,
        password: config.concourse_password
      },
      json: true,
      strictSSL: false
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        token = body.value;
        callback();
      } else {
        console.log(error);
      }
    });
}

get_pipelines = (callback) => {
	request({
		url: config.concourse_url + config.api_subdirectory + "/pipelines",
    headers:{
      cookie: 'ATC-Authorization=Bearer ' + token
    },
		json: true,
		strictSSL: false
	}, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			pipelines = body;
			callback();
		} else {
			console.log(error);
		}
	});
}

get_pipeline_statuses = (callback) => {
	for (pipeline of pipelines) {
		request({
			url: config.concourse_url + config.api_subdirectory + pipeline.url + "/jobs",
      headers:{
        cookie: 'ATC-Authorization=Bearer ' + token
      },
			json: true,
			strictSSL: false
		}, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				for (task of body) {
					if(task.finished_build !== undefined && task.finished_build !== null) {
						var index = _.findIndex(pipelines, { 'name': task.finished_build.pipeline_name });
						if(pipelines[index]["status"] === undefined || pipelines[index]["status"] === "succeeded")
							pipelines[index]["status"] = task.finished_build.status;
					}
				}
			}
		});
	}
  callback();
}

app.get('/', (req, res) => {
  async.series([
      function(callback) {
        if (config.use_bearer_token) {
          get_bearer(callback);
        } else {
          callback();
        }
      }, 
      get_pipelines,
      get_pipeline_statuses
      ], 
      function (err, result) {
      }
    )
  
  if (pipelines != undefined && pipelines.length != 0) {
    res.render('overview', {config: config, pipelines: pipelines})
  }
});

app.listen(app.get('port'), () => {
	console.log('running on port', app.get('port'));
});
