
#Concourse Pipelines Dashboard
The [Concourse CI](http://concourse.ci) tool currently does not have a nice way to view all your pipelines.
Pipelines are hidden behind a drawer and the order depends on when you've added the pipeline (and can't be sorted)

This project solves this issue by using the Concourse REST API to create a single page dashboard of all your pipelines that with their current statuses.

![screenshot](http://allenhuangnet1.ipage.com/_misc/concourse_dashboard/concourse-dashboard.png)

Live Demo available [here](http://concourse-dashboard.herokuapp.com)

## Installation
This project is written in node.js
Clone the project and make sure all node dependencies are installed.
Edit the config.js file and update the required variables.

TODO: flesh this out.

## Usage

### Running from commandline
```
cd .../concourse-pipelines-dashboard
npm start 
```

### Running using Docker

You can build the image locally by running `docker build -t my/concourse-pipeline-dashboard` or pull from dockerhub by running `docker pull innyso/concourse-pipeline-dashboard`

To run the dasboard run `docker run -it --rm -p 8080:8080 my/concourse-pipeline-dasboard`

To customise it with you setting, checkout config.js and inject appropriate environment variable to your docker container, for example

```
docker run -it --rm -e CONCOURSE_URL=http://my-concourse.ci -e CONCOURSE_USERNAME=my-username -e CONCOURSE_PASSWORD=my-password -e CONCOURSEi_TEAM=my-team -p 8080:8080 my/concourse-pipeline-dasboard
```

