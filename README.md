# AuditGui
Audit preitter

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

## Features

- Make your audits easier to read.


## Installation

AuditGui requires [Node.js](https://nodejs.org/) v14+ to run.


```sh
npm i -g @moonstone78/npmaudit
```

## Run
```sh
npmaudit

Example

┌ Mime ────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│• Dependency: mime                                                            │
│• Title: Regular Expression Denial of Service in mime                         │
│• Url: https://github.com/advisories/GHSA-wrvr-8mpx-r7pp                      │
│• Severity: moderate                                                          │
│• Range: <1.4.1                                                               │
│• Nodes: node_modules/mime                                                    │
│• Npm: https://www.npmjs.com/package/mime                                     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────┐
│Low: 0 Moderate: 1 High: 3 Critical: 0 Total: 4                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

