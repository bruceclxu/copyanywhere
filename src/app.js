const http = require('http')
const chalk = require('chalk')
const path = require('path')
const conf = require('./config/defaultConfig')
const route = require('./config/helper/route')
const openUrl = require('./helper/openUrl')

class Server{
  constructor(config){
    this.conf = Object.assign({},conf,config)
  }
  start(){
    const server = http.createServer((req, res) => {
      const firPath = path.join(this.conf.root,req.url)
      route(req,res,firPath)
    });
    
    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}/`
      console.info(`Server started at ${chalk.green(addr)}`)
      openUrl(addr)
    });
  }
}

module.exports = Server
