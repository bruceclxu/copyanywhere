
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const tplPath = path.join(__dirname,'../../views/dir.tpl')
const source = fs.readFileSync(tplPath)
const template = Handlebars.compile(source.toString())
const config = require('../defaultConfig')
const mime = require('./mime')
const compress = require('./compress')
const range = require('./range')
const isFresh = require('./cache')
const conf = require('../defaultConfig')

module.exports = async function (req,res,firPath) {
    try{
        const stats = await stat(firPath)
        if(stats.isFile()){
            const contentType = mime(firPath)
            res.statusCode = 200;
            res.setHeader('Content-Type', `${contentType.name}`)

            if(isFresh(stats,req,res)){
                res.statusCode = 304
                res.end()
                return
            }

            let rs
            const{code,start,end} = range(stats.size,req,res)

            if(code === 200){
                rs = fs.createReadStream(firPath)
            }else{
                rs = fs.createReadStream(firPath,{start,end})
            }

            if(firPath.match(config.compress)){
                rs = compress(rs,req,res)
            }
            rs.pipe(res)
        }else if(stats.isDirectory()){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html')
            const files = await readdir(firPath)
            const dir = path.relative(config.root,firPath)
            const data={
                title:path.basename(firPath),
                dir: dir?`/${dir}`:'',
                files: files.map(file =>{
                    console.error('dir = '+`${dir}/${file}`)
                    return{
                        file,
                        icon : mime(file).icon === '/imgs/image.png'?`${dir}/${file}`:mime(file).icon ,
                        host: `http://${conf.hostname}:${conf.port}`,
                        rativeaddr:mime(file).icon === '/imgs/image.png'?'/':`/src/config/helper`
                    }
                })
            }
            res.end(template(data))
        }
    }catch(e){
        console.error(e)
        res.statusCode = 404;
        // res.write(e)
        res.setHeader('Content-Type', 'text/plain')
        res.end('404 not found')
    }
}