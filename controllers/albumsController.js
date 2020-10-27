const router = require('express').Router();
const Album = require('../models/album').Album;
const Song = require('../models/album').Song;
// Instead we could do the following
// const { Album, Song } = require('../models/album');

// NEW ALBUM FORM

router.get('/new', (req, res) => {
  res.render('albums/new.ejs');
});

// ADD EMPTY FORM TO ALBUM SHOW PAGE TO ADD SONG TO AN ALBUM

router.get('/:albumId', (req, res) => {
    // find album in db by id and add new song
    Album.findById(req.params.albumId, (error, album) => {
      res.render('albums/show.ejs', { album });
    });
  });

// CREATE A NEW ALBUM
// http://localhost:3000/albums/

router.post('/', (req, res) => {
  Album.create(req.body, (error, album) => {
    res.redirect(`/albums/${album.id}`);
  });
});

// ALL ALBUMS INDEX

router.get('/', (req, res) => {
  Album.find({}, (error, albums) => {
    res.render('albums/index.ejs', { albums });
  });
});

// CREATE SONG EMBEDDED IN ALBUM
// http://localhost:3000/albums/5f9763486104abc84b5ce2f9

router.post('/:albumId/songs', (req, res) => {
  console.log(req.body);
  // store new song in memory with data from request body
  const newSong = new Song({ songName: req.body.songName });
  // find album in db by id and add new song
  Album.findById(req.params.albumId, (error, album) => {
    album.songs.push(newSong);
    console.log(album)
    album.save((err, album) => {
      res.redirect(`/albums/${album.id}`);
    });
  });
});

// EDIT SONGS
// http://localhost:3000/albums/5f971ef8f2e94ec142dbff89/songs/5f971f0ff2e94ec142dbff8a/edit

router.get('/:albumId/songs/:songId/edit', (req, res) => {
  // set the value of the album and song ids
  const albumId = req.params.albumId;
  const songId = req.params.songId;
  // find album in db by id
  Album.findById(albumId, (err, foundAlbum) => {
    // find song embedded in album
    const foundSong = foundAlbum.songs.id(songId);
    // update song name and completed with data from request body
    res.render('songs/edit.ejs', { foundAlbum, foundSong });
  });
});

// UPDATE SONG EMBEDDED IN AN ALBUM DOCUMENT

router.put('/:albumId/songs/:songId', (req, res) => {
  console.log('PUT ROUTE');
  // set the value of the album and song ids
  const albumId = req.params.albumId;
  const songId = req.params.songId;
  // find album in db by id
  Album.findById(albumId, (err, foundAlbum) => {
    // find song embedded in album
    const foundSong = foundAlbum.songs.id(songId);
    // update song name and completed with data from request body
    foundSong.songName = req.body.songName;
    foundAlbum.save((err, savedAlbum) => {
      res.redirect(`/albums/${foundAlbum.id}`);
    });
  });
});

// DELETE SONG

router.delete('/:albumId/songs/:songId', (req, res) => {
  console.log('DELETE SONG');
  // set the value of the album and song ids
  const albumId = req.params.albumId;
  const songId = req.params.songId;
  // find album in db by id
  Album.findById(albumId, (err, foundAlbum) => {
    // find song embedded in album
    foundAlbum.songs.id(songId).remove();
    // update song name and completed with data from request body
    foundAlbum.save((err, savedAlbum) => {
      res.redirect(`/albums/${foundAlbum.id}`);
    });
  });
});

module.exports = router;


