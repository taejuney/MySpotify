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
      let container = document.createElement('div');
      container.className = "album-container";

      let photo = document.createElement('img');
      photo.src = album.album_art;
      photo.alt = album.name;
      photo.className = "album-art";

      let caption = document.createElement('div');
      caption.innerText = album.name;
      caption.className = "album-name";

      container.append(photo);
      container.append(caption);
      root.append(container);

      // Adding the event handler for each figure
      container.addEventListener("click", () => {
        playAudio(album.tracks.items[0].preview_url); // Assumes you want to play the first track's preview
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.querySelector('.sidebar-toggle');
  let sidebarOpen = false;

  toggleButton.addEventListener('click', () => {
      if (sidebarOpen) {
          sidebar.classList.remove('open-sidebar');
          sidebarOpen = false;
      } else {
          sidebar.classList.add('open-sidebar');
          sidebarOpen = true;
      }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('/assets/json/tracks.json')
      .then(response => response.json())
      .then(data => populateTracklist(data))
      .catch(error => console.error('Error fetching tracks:', error));
});

function populateTracklist(tracks) {
  const tracklistBody = document.getElementById('tracklist-body');

  tracks.forEach(track => {
      const row = document.createElement('tr');

      // Add track number
      const trackNumber = document.createElement('td');
      trackNumber.textContent = track.id;
      row.appendChild(trackNumber);

      // Add track title
      const trackTitle = document.createElement('td');
      trackTitle.textContent = track.title;
      row.appendChild(trackTitle);

      // Add album name
      const trackAlbum = document.createElement('td');
      trackAlbum.textContent = track.album;
      row.appendChild(trackAlbum);

      // Add track duration and the "..." button with the Share tab
      const trackDuration = document.createElement('td');
      trackDuration.classList.add('track-options');
      
      const durationText = document.createElement('span');
      durationText.textContent = track.duration;
      trackDuration.appendChild(durationText);
      
      const moreButton = document.createElement('ion-icon');
      moreButton.setAttribute('name', 'ellipsis-horizontal-outline');
      moreButton.classList.add('more-btn');
      trackDuration.appendChild(moreButton);
      
      // Create the Share tab with an icon and text
      const shareTab = document.createElement('div');
      shareTab.classList.add('share-tab');

      const shareIcon = document.createElement('i');
      shareIcon.classList.add('fas', 'fa-share-alt'); 
      
      const shareText = document.createElement('span');
      shareText.textContent = ' Share';
      
      shareTab.appendChild(shareIcon);
      shareTab.appendChild(shareText);
      trackDuration.appendChild(shareTab);
      
      row.appendChild(trackDuration);

      tracklistBody.appendChild(row);
  });

  // Add event listeners for the "..." buttons to show the Share tab
  document.querySelectorAll('.more-btn').forEach(button => {
      button.addEventListener('click', function(event) {
          // Prevent the click from affecting the rest of the row
          event.stopPropagation();

          // Close any open share tabs first
          document.querySelectorAll('.track-options').forEach(option => {
              option.classList.remove('show-share');
          });

          // Toggle the share tab for the clicked button
          const trackOptions = this.closest('.track-options');
          trackOptions.classList.toggle('show-share');
      });
  });

  // Close the share tab if the user clicks anywhere else
  document.addEventListener('click', () => {
      document.querySelectorAll('.track-options').forEach(option => {
          option.classList.remove('show-share');
      });
  });
}



function playAudio(src) {
  let existingAudio = document.getElementById('album-audio');
  if (existingAudio) {
      existingAudio.pause();
      existingAudio.remove();
  }

  const audio = document.createElement('audio');
  audio.id = 'album-audio';
  audio.src = src;
  audio.controls = true;
  audio.autoplay = true;

  document.body.appendChild(audio);
}
loadPhotos(photoURL);

loadMusic(musicURL);


// example of changing a url and getting data from a public API (Art Inst. of Chicago in this case)
const artURL = "https://api.artic.edu/api/v1/artworks?fields=id,title,artist_display,date_display,main_reference_number";
getData(artURL).then((mydata) =>
{
  // console.log(mydata);
});


