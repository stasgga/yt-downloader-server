const ytpl = require('ytpl');
const fs = require('fs');
const ytdl = require('ytdl-core');
const config = require('./config');

function wtf(name, str) {
  fs.writeFile(name, str, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!", name);
  }); 
}

function mkdir(dirname) {
  if (!fs.existsSync(dirname)){
    fs.mkdirSync(dirname);
  }
}

function readFile(path, callback, errorCallback) {
  fs.readFile(path, function(err,data){
    if (!err) {
      callback(data)
      //console.log('received data: ' + data);
    } else if (errorCallback) {
      errorCallback()
    } else {
      console.log(err);
    }
  });
}

mkdir("datadir")

function getDirFilename(playlistName) {
  return "datadir/" + playlistName
}

function getFileFilename(playlistName, videoTitle) {
  return getDirFilename(playlistName) + "/" + videoTitle
}

function removeKnownItems(playlistItems, knownItems) {
  let knownSet = new Set(knownItems.map(knownItem => knownItem.id))
  return [...playlistItems].filter(playlistItem => !knownSet.has(playlistItem.id))
}

function downloadItems(items, playlistName, afterDownload) {
  console.log("To download: ", items.length)
  items.forEach(async (item) => {
    const filename = getFileFilename(
          playlistName,
          new Date().toISOString() + "_" + item.title
        ) + '.flv'
    await ytdl(item.url_simple, {quality: "highestvideo"})
      .pipe(fs.createWriteStream(
        filename + "_video"));
    await ytdl(item.url_simple, {quality: "highestaudio"})
      .pipe(fs.createWriteStream(
        filename + "_audio"));
  })
  afterDownload()
}

function dlPlaylist(playlistName, id) {
  console.log("Downloading", playlistName)
  ytpl(id, function(err, playlist) {
    if(err) throw err;
    const items = playlist.items
    const indexFilename = getFileFilename(playlistName, "knownItems.json")
    readFile(indexFilename,
      (knownItems) => {
        downloadItems(
          removeKnownItems(items, JSON.parse(knownItems)), 
          playlistName,
          () => {
            wtf(indexFilename, JSON.stringify(items))
          });
      },
      () => {
        console.log("File is not present. Saving and NOOP")
        mkdir(getDirFilename(playlistName))
        wtf(indexFilename, JSON.stringify(items))
      })
  });
}

config.playlists.forEach(({playlistName, playlistId}) => {
  dlPlaylist(playlistName, playlistId)
})

