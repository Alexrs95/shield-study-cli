#!/usr/bin/env node

/*eslint no-console: 0 */

// this package is shield-study-cli

var chalk = require('chalk');
var program = require('commander');
var util = require('util');
var clim = require('clim');

clim.logWrite = function (level, prefixes, msg) {
  var pfx = '';
  if (prefixes.length > 0) pfx = prefixes.join(' ');

  level = (f[level.toLowerCase()] || function (p) {return p;})(level);
  var line = util.format('%s [%s] %s', pfx, level, msg);
  process.stderr.write(line + '\n');
};

var console = clim(chalk.grey('shield'));

var f = {
  error: chalk.red,
  link: chalk.underline.blue,
  info: chalk.blue,
  log: chalk.blue,
  warn: chalk.red,
  bold: chalk.bold
};

var nodeCLI = require('shelljs-nodecli');

var passedOn = [];
function preprocess (args) {
  var dashed = false;
  var out = [];
  args.forEach(function (a) {
    if (a === '--') {
      dashed = true;
      return;
    }
    if (dashed) passedOn.push(a);
    else out.push(a);
  });
  return out;
}

function initStudy(dir, name) {
  // body...
}

var standardPrefs = {
  'toolkit.telemetry.enabled': 'false',
  // 'extensions.sdk.console.logLevel': 'debug',
  'browser.selfsuppport.enabled': false,
  'general.warnOnAboutConfig': false
};

program
  .version(require('./package.json').version)
  .description('cli for Shield Studies actions');

program
  .command('init <name>')
  .option('-f --force', 'remove dir if exists')
  .action(function (name, options) {
    name = name.startsWith('shield-study-') ? name : 'shield-study-' + name;

    if (options.force) {
      nodeCLI.exec('rm', '-rf', name);
    }
    if (nodeCLI.exec(__dirname + '/scripts/initStudy.bash', name).code !== 0) {
      process.exit(1);
    }
    initStudy(name);
    process.exit(0);
  });

program
  .command('help')
  .action(function (env) {
    program.help();
    process.exit(0);
  })

program
  .command('*')
  .action(function (env) {
    console.error(f.error( env + ' command does not yet exist.'));
    console.info('request it at: ', f.link(require('./package.json').bugs.url));
    program.help();
  });

program.parse(preprocess(process.argv));
if (!program.args.length) {
  console.error(f.error('no command given'));
  program.help();
}
