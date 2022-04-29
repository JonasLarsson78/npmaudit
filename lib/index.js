#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';
import boxen from 'boxen';

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
      console.log(boxen(
        chalk.yellow('\n• Dependency: ') + vulnerabilitie[obj]?.via[0]?.dependency + '\n'
        + chalk.yellow('• Title: ') + vulnerabilitie[obj]?.via[0]?.title + '\n'
        + chalk.yellow('• Url: ') + vulnerabilitie[obj]?.via[0]?.url + '\n'
        + chalk.yellow('• Severity: ') + severity(vulnerabilitie[obj].severity) + '\n'
        + chalk.yellow('• Range: ') + vulnerabilitie[obj].range + '\n'
        + chalk.yellow('• Nodes: ') + vulnerabilitie[obj].nodes + '\n'
        + chalk.yellow('• Npm: ') + `https://www.npmjs.com/package/${vulnerabilitie[obj]?.via[0]?.dependency}` + '\n'
        + (typeof vulnerabilitie[obj]?.fixAvailable === 'object' ? chalk.yellow('• Fix available:')
        + ' via `npm audit fix --force` will install '
        + vulnerabilitie[obj].fixAvailable.name
        + '@' + vulnerabilitie[obj].fixAvailable.version + '\n' : ''),
        { title: chalk.cyan(capitalizeFirstLetter(vulnerabilitie[obj].name)), width: 80 }
        ));
      }
    })
}


const data = auditJson
const { vulnerabilities } = data.metadata

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
