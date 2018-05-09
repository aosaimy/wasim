Wasim
=====================

## Introduction
Wasim is a web-based tool for semi-automatic morphosyntactic annotation of inflectional languages resources. It features high flexibility in segmenting tokens, editing, diacritizing, and labelling tokens and segments. 

If you use this tool in your research, please cite the following article, where you can find more information regard the tool:
`A. Alosaimy and E. Atwell, “Web-based Annotation Tool for Inflectional Language Resources Major features,” in 11th Edition of its Language Resources and Evaluation Conference, 2018.`

## Motivation
Text annotation of highly inflectional languages (including Arabic) requires key functionality which we could not see in a survey of existing tools. 

## Features
- Wasim integrates with morphological analysers to speed up the annotation process by selecting one from its proposed analyses. 
- It integrates as well with external POS taggers for kick-start annotation and adaptive predicting based on annotations made so far. 
- It aims to speed up the annotation by completely relying on keyboard, with no mouse interaction required. 

Wasim has been tested on four case studies and these features proved to be useful.

## Demo
You can use use wasim via a demo project [here](http://wasim-app.al-osaimy.com/#/docs/temp/92694396fc7f1d510e44931e31f6c379).

You can create projects using the username: demo, password: demo [http://wasim-app.al-osaimy.com](http://wasim-app.al-osaimy.com)

## Using to this project

If you only want to use the project, you have to need a client (front end) and a server (back end):

1. Frontend: Please use this repo [wasim-www](https://github.com/aosaimy/wasim-www). You will need to upload the folder to your server in public. You will need to edit configuration file (assests/ionic.config.json), especially the url to backend server.

2. Backend: Please use this repo [wasim-backend](https://github.com/aosaimy/wasim-backend). You will need to download it, install packages, configure it, and run it in your server. 

## Contributing to this project (for developers)

You'll need the Ionic CLI with support for v2 apps:

```bash
$ npm install -g ionic
```

Then run:

```bash
$ ionic start myApp
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/docs/v2/getting-started/) page.

## Licence

The source-code is released under the MIT license. 
