var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config')
var request = require('request')
var _ = require('lodash');

var app = express();

app.set('port', (process.env.PORT || 8080));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/resources'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var pipelines;

get_pipelines = (callback) => {
	request({
		url: config.concourse_url + config.api_subdirectory + "/pipelines",
		json: true
	}, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			pipelines = body;
			callback();
		}
	});
}

get_pipeline_statuses = () => {
	for (pipeline of pipelines) {
		request({
			url: config.concourse_url + config.api_subdirectory + pipeline.url + "/jobs",
			json: true
		}, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				for (task of body) {
					if(task.finished_build !== undefined) {
						var index = _.findIndex(pipelines, { 'name': task.finished_build.pipeline_name });
						pipelines[index]["status"] = task.finished_build.status;
					}
				}
			}
		});
	}
}

app.get('/', (req, res) => {
	res.render('overview', { config: config, pipelines: pipelines });
});

app.get('/refresh_pipelines', (req, res) => {
	get_pipelines(get_pipeline_statuses);
	res.status(200).send('complete');
});

app.listen(app.get('port'), () => {
	console.log('running on port', app.get('port'));
});