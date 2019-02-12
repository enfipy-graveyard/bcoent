const fs = require('fs')

module.exports.getHeight = () => {
  var config = {}
  try {
    const rawdata = fs.readFileSync('config.json')
    config = JSON.parse(rawdata)
  } catch (err) {
    console.log(`Failed to read config: ${err}`)
    process.exit(1)
  }
  return config.height || 0
}

module.exports.setHeight = (height) => {
  try {
    const data = JSON.stringify({ height })
    fs.writeFileSync('config.json', data)
  } catch (err) {
    console.log(`Failed to update config: ${err}`)
    process.exit(1)
  }
}
