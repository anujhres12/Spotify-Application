function changeColors() {
  const boxes = document.querySelectorAll(".playbar, .songList .invert");

  boxes.forEach((box) => {
    box.style.backgroundColor = getRandomRGBAColor();
  });
}

function getRandomRGBAColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = 0.5; // fixed 50% opacity

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// 🔁 Run automatically every 1 second (1000 ms)
setInterval(changeColors, 1000);


let currentSong = new Audio();
let songs = [];
let currentSongIndex = 0;
let currFolder;

function secondsToMMSS(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

async function getSongs(folder) {
  currFolder = folder;
  songs = [];
  currentSongIndex = 0;
  let a = await fetch(`http://127.0.0.1:3000/${currFolder}/`);
  let response = await a.text();
  //   console.log(response);

  let div = document.createElement("div");
  div.innerHTML = response;
  let asongs = div.getElementsByTagName("a");

  // console.log(asongs);

  for (let index = 0; index < asongs.length; index++) {
    const element = asongs[index];

    if (element.href.endsWith(".mp3")) {
      // 1️⃣ Decode URL (%5C, %20 → \, space)
      const decoded = decodeURIComponent(element.href);

      // 2️⃣ Get filename
      const fileName = decoded.split("\\").pop();
      // Example: "Ami Je Tomar Tandav.mp3"

      // 3️⃣ Remove ".mp3"
      const songName = fileName.split(".mp3")[0];

      songs.push(songName);
    }
  }

  //show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                <img class="invert" width="20px" src="music.svg" alt="" />
                <div class="info">
                  <div>${song.replaceAll("", "")}</div>
                  <div class="songArtist">Anuj</div>
                </div>
                <img class="invert" width="25px" src="playnow.svg" alt="" />
              </li>`;
  }

  //Attach an eventlistner to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li"),
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
    //   console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  return songs;
}

// const playMusic = (track, pause = false) => {
//   currentSong.src = encodeURI(`http://127.0.0.1:3000/songs/${track}.mp3`);
//   currentSong.load();
//     if(!pause){
//         currentSong.play();
//     }

//     document.querySelector(".songinfo").innerHTML = decodeURI(track)
//     document.querySelector(".songtime").innerHTML = "00:00"

//     // .catch(err => console.error("Playback error:", err))

// };
const playMusic = (track, pause = false) => {
  currentSongIndex = songs.indexOf(track); //  TRACK INDEX

  currentSong.src = encodeURI(
    `http://127.0.0.1:3000/${currFolder}/${track}.mp3`,
  );
  currentSong.load();

  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00";
};

async function displayAlbums() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  cardContainer.innerHTML = ""; // clear old cards

  Array.from(anchors).forEach(e => {
    let decoded = decodeURIComponent(e.href).replace(/\\/g, "/");

    // Ignore parent /songs link
    if (decoded.includes("/songs/") && !decoded.endsWith("/songs/")) {

      let folder = decoded.replace(/\/$/, "").split("/").pop();

      // Create card
      let card = document.createElement("div");
      card.classList.add("card");
      card.dataset.folder = folder;

      card.innerHTML = `
         <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="45px" viewBox="0 0 640 640">
                                <!-- Green circle background -->
                                <circle cx="320" cy="320" r="320" fill="#0dce47" />
                                <!-- Smaller black play icon -->
                                <g transform="translate(320 320) scale(0.65) translate(-320 -320)">
                                    <path fill="#000000"
                                        d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z" />
                                </g>
                            </svg>
                        </div>

        <img 
          src="http://127.0.0.1:3000/songs/${folder}/cover.jpg"
          alt="${folder}"
          onerror="this.src='default.jpg'"
        />
        <h3>${folder}</h3>
        <p>Playlist • ${folder}</p>
      `;

      cardContainer.appendChild(card);
    }
  });

  // Click album → load songs
  Array.from(document.getElementsByClassName("card")).forEach(card => {
    card.addEventListener("click", async () => {
      await getSongs(`songs/${card.dataset.folder}`);
      playMusic(songs[0], true);
      playMusic(songs[0])
    });
  });
}

async function main() {
  //Get the list of all the songs
  await getSongs("songs/ncs");
  //   console.log(songs);
  playMusic(songs[0], true);

  //Display all the albums on the page

  displayAlbums();

  // Attach an eventlisterner to play, next and previous

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  // eventListener for time Update event
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML =
      `${secondsToMMSS(currentSong.currentTime)} / ${secondsToMMSS(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an Eventlistner to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an eventListener for hamburger
  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "0";
  });

  // Add an eventListner for close button
  document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "-130%";
  });

  // Add an eventListner for previous button
  previous.addEventListener("click", () => {
    if (currentSongIndex > 0) {
      currentSongIndex--;
    } else {
      currentSongIndex = songs.length - 1; // loop to last song
    }

    playMusic(songs[currentSongIndex]);
  });

  // Add an eventListner for next button

  next.addEventListener("click", () => {
    if (currentSongIndex < songs.length - 1) {
      currentSongIndex++;
    } else {
      currentSongIndex = 0; // loop to first song
    }

    playMusic(songs[currentSongIndex]);
  });

  currentSong.addEventListener("ended", () => {
    next.click();
  });

  // Adding Eventlistner to Volume range
  document
    .querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      // console.log("Setting volume to ", e.target.value, "/100");
      currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        }

    });

//Add eventlistner to mute the volume 

    document.querySelector(".volume>img").addEventListener("click", (e)=>{
        // console.log(e.target)
        console.log("changing", e.target.src);

        if(e.target.src.includes("volume.svg"))
        {
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
           e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = 0.2;
        }

    })










}

main();
