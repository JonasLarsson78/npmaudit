#!/usr/bin/env node
import { execSync } from 'child_process'
import chalk from 'chalk'
import { status, summary, draw } from './utils.js'

const options = process.argv

if (options.includes('-version') || options.includes('-v')) {
  const version = execSync('npm ls -g @moonstone78/npmaudit', {
    encoding: 'utf-8',
  })
  console.log(
    chalk.green(
      ' Global on your computer: V' +
        version.substring(version.lastIndexOf('@') + 1)
    )
  )
} else if (options.includes('-latest') || options.includes('-l')) {
  const version = execSync('npm view @moonstone78/npmaudit version', {
    encoding: 'utf-8',
  })
  console.log(chalk.green(' Latest on npm: V' + version))
} else if (options.includes('-fix') || options.includes('-f')) {
  let auditJsonFix, vulnerabilitieFix

  try {
    auditJsonFix = execSync('npm audit fix --json', { encoding: 'utf-8' })
    auditJsonFix = JSON.parse(auditJsonFix)
    if (auditJsonFix.audit.metadata.vulnerabilities.total === 0) {
      console.log(
        chalk.white('Yes!! There are NO vulnerabilities to fix.\nTotal: ') +
          chalk.green(auditJsonFix.audit.metadata.vulnerabilities.total)
      )
    }
  } catch (data) {
    auditJsonFix = draw(data, vulnerabilitieFix, auditJsonFix, true)
    status(auditJsonFix)
    summary(auditJsonFix, true)
  }
} else {
  let auditJson, vulnerabilitie
  try {
    auditJson = execSync('npm audit --json', { encoding: 'utf-8' })
    auditJson = JSON.parse(auditJson)
    if (auditJson.metadata.vulnerabilities.total === 0) {
      console.log(
        chalk.white('Yes!! There are NO vulnerabilities.\nTotal: ') +
          chalk.green(auditJson.metadata.vulnerabilities.total)
      )
    }
  } catch (data) {
    auditJson = draw(data, vulnerabilitie, auditJson)
    summary(auditJson)
  }
}
