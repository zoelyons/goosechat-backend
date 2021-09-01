const fs = require('fs')
const path = require('path')

const events = {};

fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(file => {
    const fullName = path.join(__dirname, file)

    if (file.toLowerCase().endsWith('.js')) {
      const [filename] = file.split('.')
      events[filename] = require(fullName)
    }
  })

module.exports = events