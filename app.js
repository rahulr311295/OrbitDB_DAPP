const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const fs = require("fs");
const app = express();
const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const port = 3000
const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  }
}
// Create IPFS instance
// const ipfs = new IPFS()
// ipfs.on('ready', async () => {
//   const orbitdb = new OrbitDB(ipfs)
//   const db = await orbitdb.keyvalue('first-database')
//   console.log(db.address)
//   // /orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVSU/first-database
//   await db.put('key1', 'hello1')
//   await db.put('key2', 'hello2')
//   await db.put('key3', 'hello3')
//   const value = db.get('key1')
//   console.log(db.key.getPublic('hex'))
//
// })

const ipfs = new IPFS()
ipfs.on('ready', async () => {
  const orbitdb = new OrbitDB(ipfs)

  const access = {
    // Give write access to ourselves
    write: [orbitdb.key.getPublic('hex')],
  }

  const db = await orbitdb.keyvalue('first-database', access)
  console.log(db.address.toString())
  // /orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVSU/first-database
})
app.set('view engine', 'ejs');



app.get('/', function(req, res){
  let fileInfo="";
 	res.render('index',{data:fileInfo});
});



app.post("/", multer({dest: "./uploads/"}).array("orbit_image", 12), function(req, res) {
    var fileInfo = [];
    for(var i = 0; i < req.files.length; i++) {
        fileInfo.push({
            "b64": new Buffer(fs.readFileSync(req.files[i].path)).toString("base64")
        });
        fs.unlink(req.files[i].path);
    }
    // res.send(fileInfo);
    console.log(fileInfo[0].b64);
    res.render('index',{data:fileInfo[0].b64});

});

app.listen(port, () => console.log(`Running on ${port}!`))
