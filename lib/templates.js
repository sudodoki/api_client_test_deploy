var utils = require('shipit-utils');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

function getContext(shipit) {
  var config = shipit.config;
  var context = _.assign({}, config);
  var addition = {};
  Object.keys(config.templates.context).forEach(function (key) {
    var path = config.templates.context[key];
    addition[key] = require(path);
  });
  context = _.assign(context, addition);
  return context;
}

function renderTemplates(context) {
  var input = path.resolve(__dirname, '../templates')
  var templates = fs.readdirSync(input);
  var output = path.resolve(__dirname, '../config')
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }
  var outputNames = [];
  templates.forEach(function (templateName) {
    var templatePath = path.join(input, templateName)
    console.log(templatePath)
    var outputName = templateName.replace(/\.template$/, '')
    outputNames.push(outputName);
    var templateFn = _.template(fs.readFileSync(templatePath, 'utf8'))
    fs.writeFileSync(path.join(output, outputName), templateFn(context));
  })
  return {
    outputPath: output,
    outputNames: outputNames
  }
}

module.exports = function (gruntOrShipit) {
  var shipit = utils.getShipit(gruntOrShipit);

  utils.registerTask(gruntOrShipit, 'templates', function (cb) {
    context = getContext(shipit);
    var renderResult = renderTemplates(context);
    shipit.remoteCopy(renderResult.outputPath, shipit.config.deployTo).then(function () {
      var options = shipit.config.templates.files;
      var configPath = shipit.config.deployTo + '/config'
      var cdCmd = 'cd ' + configPath
      renderResult.outputNames.forEach(function(filename){
        var lnCmd;
        if (options[filename]) {
          lnCmd = 'ln -sf ' + configPath + '/' + filename + ' ' + options[filename].destination + filename
        }
        shipit.remote([cdCmd, lnCmd].join(' && '))
      })
      shipit.emit('templates')
    })
  });

  shipit.on('published', function () {
    shipit.start('templates');
  })
}
