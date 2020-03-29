//requiring path and fs modules
const path = require('path');
const fs = require('fs');

function getPath(dirPath) {
  const safePath = dirPath || ""
  return path.join(__dirname, "..", "datadir", safePath)
}

// https://stackfame.com/list-all-files-in-a-directory-nodejs
function readDir(subdir) {
  //joining path of directory 
  const directoryPath = getPath(subdir);
  //console.log(directoryPath)
  return fs.readdirSync(directoryPath);
}

function isDir(dirPath) {
  const absPath = getPath(dirPath)
  //console.log("isDir", getPath(absPath), fs.existsSync(absPath), fs.existsSync(absPath) && fs.lstatSync(absPath).isFile())
  const exists = fs.existsSync(absPath)
  if (!exists) {
    return exists
  }
  const stats = fs.lstatSync(absPath)
  if (stats.isSymbolicLink()) {
    const symStats = fs.lstatSync(fs.readlinkSync(absPath))
    return symStats.isDirectory()
  }
  return stats.isDirectory()
}

function isFile(dirPath) {
  const absPath = getPath(dirPath)
  //console.log("isFile", getPath(absPath), fs.existsSync(absPath), fs.existsSync(absPath) && fs.lstatSync(absPath).isFile())
  return fs.existsSync(absPath) && fs.lstatSync(absPath).isFile()
}

module.exports = {
  readDir: readDir,
  isDir: isDir,
  isFile: isFile
}
