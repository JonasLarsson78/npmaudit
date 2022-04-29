#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';
import boxen from 'boxen';
import { readFile } from 'fs/promises';

const options = process.argv

if (options.includes('-version') || options.includes('-v')) {
const json = JSON.parse(
  await readFile(
    new URL(process.cwd() + '/package.json', import.meta.url)
  )
);
console.log(chalk.green(' V'+json.version));
} else {
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const severity = (str) => {
  switch (str) {
    case 'low':
      return chalk.blueBright(str)
    case 'moderate':
      return chalk.yellowBright(str)
    case 'high':
      return chalk.redBright(str)
    case 'critical':
      return chalk.magentaBright(str)
    default:
      return chalk.white(str)
  }
}

let auditJson, vulnerabilitie
try {
    auditJson = execSync('npm audit --json', { encoding: 'utf-8' });
    auditJson = JSON.parse(auditJson)
} catch(data) {
    auditJson = JSON.parse(data.output[1]);
    vulnerabilitie = auditJson.vulnerabilities
    const keys = Object.keys(vulnerabilitie)
    keys.forEach((obj) => {
      if (vulnerabilitie[obj].via.length > 0) {
        let via, viaArr
        if (typeof vulnerabilitie[obj].via[0] !== 'string') {
          via = chalk.yellow('• Title: ') + vulnerabilitie[obj]?.via[0]?.title + '\n'
          + chalk.yellow('• Url: ') + vulnerabilitie[obj]?.via[0]?.url + '\n'
          viaArr = ''
        } else {
          viaArr = chalk.yellow('• Via: ') + JSON.stringify(vulnerabilitie[obj].via) + '\n'
          via = ''
        }

      console.log(boxen(
        chalk.yellow('\n• Dependency: ') + vulnerabilitie[obj].name + '\n' +
        via
        + chalk.yellow('• Severity: ') + severity(vulnerabilitie[obj].severity) + '\n'
        + chalk.yellow('• Range: ') + vulnerabilitie[obj].range + '\n'
        + chalk.yellow('• Nodes: ') + vulnerabilitie[obj].nodes + '\n'
        + chalk.yellow('• Npm: ') + `https://www.npmjs.com/package/${vulnerabilitie[obj].name}` + '\n'
        + (typeof vulnerabilitie[obj]?.fixAvailable === 'object' ? chalk.yellow('• Fix available:')
        + ' via `npm audit fix --force` will install '
        + vulnerabilitie[obj].fixAvailable.name
        + '@' + vulnerabilitie[obj].fixAvailable.version + '\n' : viaArr),
        { title: chalk.cyan(capitalizeFirstLetter(vulnerabilitie[obj].name)), width: 80 }
        ));
      }
    })
}


const data = auditJson
const { vulnerabilities } = data.metadata

if (vulnerabilities.total === 0) {
  console.log(chalk.white('Yes!! There are NO vulnerabilities.\nTotal: ') + chalk.green(vulnerabilities.total))
} else {
  console.log(boxen(
  chalk.blueBright('Low: ')
  + chalk.yellow(vulnerabilities.low)
  + chalk.yellowBright(' Moderate: ')
  + chalk.yellow(vulnerabilities.moderate)
  + chalk.redBright(' High: ')
  + chalk.yellow(vulnerabilities.high)
  + chalk.magentaBright(' Critical: ')
  + chalk.yellow(vulnerabilities.critical)
  + ' Total: '
  + chalk.yellow(vulnerabilities.total), { width: 80 }
))
}
}
