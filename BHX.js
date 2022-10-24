"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const listMusic = $(".list-music");
const playBtn = $(".play");
const song = $("#song");
const nextBtn = $("#next-btn");
const prevBtn = $("#prev-btn");
const progress = $("#input-range");
const nameMusic = $("#song-title");
const singerName = $("#song-singer");
const imgMusic = $("#image-music");
const repeat = $(".repeat");
const shuffle = $(".shuffle");
const startTime = $(".start-time");
const endTime = $(".end-time");
const volume = $("#volume");
const numberVolume = $(".numberVolume");
let indexSong = 0;
let isPlaying = true;
// lấy web api mp3
const displayMusic = async function () {
  try {
    const res = await fetch(`https://mp3.zing.vn/xhr/chart-realtime?songId=10`);
    const data = await res.json();
    const dataNew = data.data.song;
    //console.log(data.data);
    renderMusic(dataNew);
    audioSong(dataNew);
  } catch (err) {
    alert(`err:`, err);
  }
};
//renderMusic
const renderMusic = function (dataNew) {
  //console.log(dataNew);
  let html = ``;
  dataNew.forEach((items, index) => {
    html += `<div class="row py-2 " id='box-music'>
    <span class="col-1 fs-1 fw-bold text-opacity-50" id="number"
      >${items.order}</span
    >
    <div class="d-flex col-5">
      <img src="${items.thumbnail}" alt=""  />
      <div class="d-flex flex-column">
        <span>${items.name}</span>
        <span>${items.performer}</span>
      </div>
    </div>
    <div class="col-5">
      <span>${items.name}</span>
    </div>
    <div class="col-1">
      <span>Time</span>
    </div>
  </div>`;
    listMusic.innerHTML = html;
  });
};

displayMusic();

//play-pause
playBtn.addEventListener("click", function () {
  playPause();
});

const playPause = function () {
  if (isPlaying) {
    song.play();
    playBtn.innerHTML = `<i class="bi bi-pause-circle"></i>`;

    isPlaying = false;
  } else {
    song.pause();
    playBtn.innerHTML = `<i class="bi bi-play-circle"></i>`;
    isPlaying = true;
  }
};

//audio

const audioSong = function (dataNew) {
  $$("#box-music").forEach((items, index) => {
    items.addEventListener("click", function () {
      function music() {
        const findMusic = dataNew.find(
          (e, index) => index + 1 === Number(items.textContent.slice(5, 7))
        );
        //console.log(items);
        song.src = `http://api.mp3.zing.vn/api/streaming/audio/${findMusic.id}/320`;
        nameMusic.textContent = `${findMusic.name}`;
        singerName.textContent = `${findMusic.performer}`;
        imgMusic.src = `${findMusic.thumbnail}`;
      }
      music();

      isPlaying = true;
      playPause();
      indexSong = index;
    });
  });

  //random song
  let isSong = true;
  shuffle.addEventListener("click", function () {
    if (isSong) {
      shuffle.classList.add("active");

      isSong = false;
    } else {
      shuffle.classList.remove("active");
      isSong = true;
    }
  });

  //next-prev
  function dataMusic() {
    song.src = `http://api.mp3.zing.vn/api/streaming/audio/${dataNew[indexSong].id}/320`;
    nameMusic.textContent = `${dataNew[indexSong].name}`;
    singerName.textContent = `${dataNew[indexSong].performer}`;
    imgMusic.src = `${dataNew[indexSong].thumbnail}`;

    isPlaying = true;
    playPause();
  }

  const nextPrevMusic = function () {
    nextBtn.addEventListener("click", function () {
      if (!isSong) {
        const randomSong = Math.floor(Math.random() * $$("#box-music").length);
        indexSong = randomSong;
        dataMusic();
        console.log(indexSong);
      } else if (isSong) {
        changeSong(1);
      }
    });
    prevBtn.addEventListener("click", function () {
      if (!isSong) {
        const randomSong = Math.floor(Math.random() * $$("#box-music").length);
        indexSong = randomSong;
        dataMusic();
        console.log(indexSong);
      } else if (isSong) {
        changeSong(-1);
      }
    });
  };
  nextPrevMusic();

  const changeSong = function (dir) {
    if (dir === 1) {
      indexSong++;
      //console.log(dataNew.index);
      // console.log(indexSong);
      if (indexSong >= dataNew.length) {
        indexSong = 0;
      }
    } else if (dir === -1) {
      indexSong--;
      console.log(indexSong);
      if (indexSong <= 0) {
        indexSong = dataNew.length;
      }
    }

    dataMusic();
  };

  //time song
  song.ontimeupdate = function () {
    if (song.duration) {
      const progressPercent = Math.floor(
        (song.currentTime / song.duration) * 100
      );
      progress.value = progressPercent;
      //start time
      const minutes = Math.floor(song.currentTime / 60);
      const seconds = Math.floor(song.currentTime - minutes * 60);

      startTime.textContent = `0${minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
      //end time
      const timeEndMinutes = Math.floor(song.duration / 60);
      const timeEndSeconds = Math.floor(song.duration - timeEndMinutes * 60);

      endTime.textContent = `0${timeEndMinutes}:${timeEndSeconds}`;
    }
    if (song.duration == song.currentTime) {
      //change song auto
      if (!isSong) {
        const randomSong = Math.floor(Math.random() * $$("#box-music").length);
        indexSong = randomSong;
        dataMusic();
        console.log(indexSong);
      } else if (isSong) {
        changeSong(1);
      }
    }
    progress.onchange = function (e) {
      const seekTime = (song.duration / 100) * e.target.value;
      song.currentTime = seekTime;
    };
  };
};

//loop song
let isRepeat = true;
repeat.addEventListener("click", function () {
  if (isRepeat) {
    repeat.classList.add("active");
    song.loop = true;
    //song.load();
    isRepeat = false;
  } else {
    repeat.classList.remove("active");
    song.loop = false;
    isRepeat = true;
  }
});

volume.onchange = function () {
  song.volume = volume.value;
  numberVolume.textContent = `${volume.value * 100}`;
};
