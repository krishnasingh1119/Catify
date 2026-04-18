console.log("hello");

let currentsong = new Audio()
let songLink = [];
songTitle = [];

let currentFolder;

function formatTime(seconds) {
  if (isNaN(seconds)) return "01:09";
  const totalSeconds = Math.floor(seconds); // removes fraction

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


async function getsong(folder) {
  let songs = await fetch(`http://127.0.0.1:5500/songs/${folder}/`)
  let response = await songs.text()
  let div = document.createElement('div')
  div.innerHTML = response
  let tds = div.getElementsByTagName('a')

  let songul = document.querySelector('.song-list').getElementsByTagName('ul')[0]
  songul.innerHTML = ''

  songLink = []
  songTitle = []
  let songPack = [songLink, songTitle]
  for (let index = 0; index < tds.length; index++) {
    const element = tds[index];
    if (element.href.endsWith(".mp3")) {
      songLink.push(element.href)
    }
    if (element.title.endsWith(".mp3")) {
      songTitle.push(element.title.slice(0, -4))

      let songName = element.title.slice(0, -4).replace("-", " ")

      songul.innerHTML = songul.innerHTML + `
               <li data-url="${element.href}">
            <div class="info">
              <img src="utilities/music.svg" alt="">
              <div>
                <div><p class="song-name">${songName}</p></div>
                <div>Krishna</div>
              </div>
            </div>
            <span>
              <div id="play-button"> Play Now </div>
              <img src="utilities/play.svg" alt="">
            </span>
          </li>
             `
    }

  }

  Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", element => {
      playAudio(e.dataset.url, false)
      // dispaly current song in play bar
      document.querySelector(".current-song-name").innerHTML = e.querySelector(".song-name").innerHTML



    })
  })

  document.querySelector(".current-song-name").innerHTML = songTitle[0]

  playAudio(songLink[0], true)
  return { songLink, songTitle }
}


function playAudio(track, pause = true) {
  currentsong.src = track
  if (!pause) {
    currentsong.play();
    play.src = "utilities/pause.svg"
  }
  else{
    play.src = "utilities/play.svg"
  }
}

// functions to display dynamic albums direct from the folder
async function LoadAlbums() {
  let songs = await fetch(`http://127.0.0.1:5500/songs/`)
  let response = await songs.text()
  let div = document.createElement('div')
  div.innerHTML = response

  let CardConatiner = document.querySelector(".catify-playlist")

  let anchor = div.getElementsByTagName("a")
  let array = Array.from(anchor)

  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split('/').slice(-1)[0].replace("%20", " ")

      let songs = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
      let info = await songs.json()


      CardConatiner.innerHTML += `
        <div data-folder="${folder}" class="playlist-card">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000"
                            fill="#000">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M5.25 5.78987C5.25 4.42081 6.7512 3.58195 7.91717 4.29947L18.0091 10.5099C19.1196 11.1933 19.1196 12.8074 18.0091 13.4907L7.91717 19.7011C6.7512 20.4187 5.25 19.5798 5.25 18.2107V5.78987Z"
                                fill="currentColor" />
                        </svg>
                    </button>
                    <img src="songs/${folder}/cover.png" alt="">
                    <p class="playlist-name">${info.title}</p>
                    <p class="playlist-artist">${info.discription}</p>
                </div>
      `
    }
  }
  Array.from(document.getElementsByClassName("playlist-card")).forEach((element) => {
    element.addEventListener("click", async (item) => {
      ({ songLink, songTitle } = await getsong(item.currentTarget.dataset.folder))
      document.querySelector(".current-song-name").innerHTML = songTitle[0]

    playAudio(songLink[0], false)

    
    
    })
  })
}



async function main() {
  ({ songLink, songTitle } = await getsong("Guru"))






  LoadAlbums()
}
main()


play.addEventListener("click", () => {
  if (currentsong.paused) {
    currentsong.play()
    play.src = "utilities/pause.svg"
  }
  else {
    currentsong.pause()
    play.src = "utilities/play.svg"
  }
})

currentsong.addEventListener("timeupdate", () => {
  document.querySelector(".current-duration").innerHTML = formatTime(currentsong.currentTime)
  document.querySelector(".total-duration").innerHTML = formatTime(currentsong.duration)
  document.querySelector(".current-duration-bar").style.width = ((currentsong.currentTime / currentsong.duration) * 100) + "%"

})

document.querySelector(".duration-bar").addEventListener("click", (e) => {

  let percent = e.offsetX / e.currentTarget.getBoundingClientRect().width * 100
  document.querySelector(".current-duration-bar").style.width = percent + "%"
  currentsong.currentTime = (currentsong.duration * percent) / 100
})


document.querySelector(".playlist-section .menu").addEventListener("click", (e) => {
  let MenuBotton = document.querySelector(".library-section")
  MenuBotton.style.left = "0px"

  // document.querySelector(".library-section").style.width = "350px"

})


// adding in and out function to library
document.querySelector(".library-section .menu").addEventListener("click", (e) => {
  let MenuBotton = document.querySelector(".library-section")
  MenuBotton.style.left = "-120%"

  document.querySelector(".library-section").style.width = "340px"

})

// adding previour funtionality
previous.addEventListener("click", () => {
  let index = songLink.indexOf(currentsong.src)
  if (index > 0) {
    playAudio(songLink[index - 1], false)
    document.querySelector(".current-song-name").innerHTML = songTitle[index - 1]
  }

  else {
    playAudio(songLink[songLink.length - 1], false)
    document.querySelector(".current-song-name").innerHTML = songTitle[songLink.length - 1]
  }

})

// addind next funtion
next.addEventListener("click", () => {
  let index = songLink.indexOf(currentsong.src)
  if (index < songLink.length - 1) {
    playAudio(songLink[index + 1], false)
    document.querySelector(".current-song-name").innerHTML = songTitle[index + 1]
  }

  else {
    playAudio(songLink[0], false)
    document.querySelector(".current-song-name").innerHTML = songTitle[0]
  }
})


volume.addEventListener("click",(e) => {
  if(volumeBar.value == 0){
    volume.src = "utilities/volume.svg"
    volumeBar.value = 10
    currentsong.volume = 0.1
  }
  else {
    volume.src = "utilities/mute.svg"
    volumeBar.value = 0
    currentsong.volume = 0
  }
})

volumeBar.addEventListener("change", (e) => {
  currentsong.volume = e.target.value / 100
  if(e.currentTarget.value == 0) {
    volume.src = "utilities/mute.svg"
  }
  else{
    volume.src = "utilities/volume.svg"
  }
})



// Automatically play next song when current one ends
currentsong.addEventListener("ended", () => {
    let index = songLink.indexOf(currentsong.src);

    if (index < songLink.length - 1) {

        playAudio(songLink[index + 1], false);
        document.querySelector(".current-song-name").innerHTML = songTitle[index + 1];
    } 
    else {
    
        playAudio(songLink[0], true);
        document.querySelector(".current-song-name").innerHTML = songTitle[0];

        currentsong.currentTime = 0; 
        document.querySelector(".current-duration-bar").style.width = "0%";
        document.querySelector(".current-duration").innerHTML = "01:09";
        
        // Use this if you want it to just stop at the end instead:
        // play.src = "utilities/play.svg";
    }
});


console.log('end');
