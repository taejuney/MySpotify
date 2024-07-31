/*jshint strict:false */
/*jshint esversion: 8 */
/*global console*/

/* for now, we are just fetching a JSON stored within our application you can swap this url out
with any other publicly available API end-point (e.g. Spotify) */
const musicURL = "http://localhost:3000/music-data";
const photoURL = "http://localhost:3000/photo-data";

// Helper method/function to just fetch the data from the data url
async function getData(url) {
  try {
    const response = await fetch(url);

    // response is a javascript object, where response.ok means that the fetch request
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

// Populates the photos section in index.html with photos from photos.json
function loadPhotos(url){
    getData(url).then((data) => {
      const root = document.querySelector('#photo-albums');

      let albumName = document.createElement('h1');
      albumName.innerText = data.album;

      const photoList = root.querySelector('#photos');

      for(let i=0; i < data.photos.length; i++){
        // Figure is a container for the image and the caption (figcaption)
        let figure = document.createElement('figure');
        figure.className = "photo";

        let caption = document.createElement('figcaption');
        caption.innerText = data.photos[i].date;

        let photo = document.createElement('img');
        photo.src = `./assets/img/${data.photos[i].filename}`;
        photo.alt = data.photos[i].alt;

        figure.append(photo);
        figure.append(caption);
        photoList.append(figure);

        //adding the event handler for each figure
        figure.addEventListener("click", (event) => {
          //event.target object has information about which element triggered the event
          console.log(event.target.src);
        });
      }
      root.prepend(albumName);
    });
}

// Populates the music-albums section in index.html with albums from music.json
// pretty much identical to loadPhotos, but minor adjustments based on the JSON structure
function loadMusic(url){
    getData(url).then((data) => {
      const root = document.querySelector('#albums');

      for(let i=0; i<data.length; i++){
        let album = data[i];
        let figure = document.createElement('figure');
        figure.className = "album";

        let caption = document.createElement('figcaption');
        caption.innerText = album.name;

        let photo = document.createElement('img');
        photo.src = album.album_art;
        photo.alt = "";

        figure.append(photo);
        figure.append(caption);
        root.append(figure);

        //adding the event handler for each figure
        figure.addEventListener("click", (event) => {
          //event.target object has information about which element triggered the event
          console.log(event.target.src);
        });
      }
    });
}

loadPhotos(photoURL);

loadMusic(musicURL);

// example of changing a url and getting data from a public API (Art Inst. of Chicago in this case)
const artURL = "https://api.artic.edu/api/v1/artworks?fields=id,title,artist_display,date_display,main_reference_number";
getData(artURL).then((mydata) =>
{
  // console.log(mydata);
});


