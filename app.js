const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Waiting For You",
      singer: "Mono",
      path: "./music/song1.mp3",
      image: "./img/song1.jpg",
    },
    {
      name: "Đáp Án Cuối Cùng",
      singer: "Quân AP",
      path: "./music/song2.mp3",
      image: "./img/song2.jpg",
    },
    {
      name: "Bên Trên Tầng Lầu",
      singer: "Tăng Duy Tân",
      path: "./music/song3.mp3",
      image: "./img/song3.jpg",
    },
    {
      name: "Nắng Ấm Ngang Qua",
      singer: "Sơn Tùng MTP",
      path: "./music/song4.mp3",
      image: "./img/song4.jpg",
    },
    {
      name: "Người Như Anh",
      singer: "Mai Tiến Dũng",
      path: "./music/song5.mp3",
      image: "./img/song5.jpg",
    },
    {
      name: "Cơn Mưa Xa Dần",
      singer: "Sơn Tùng MTP",
      path: "./music/song6.mp3",
      image: "./img/song6.jpg",
    },
    {
      name: "Hai Mươi Hai",
      singer: "AMEE",
      path: "./music/song7.mp3",
      image: "./img/song7.jpg",
    },
    {
      name: "Và Ngày Nào Đó",
      singer: "Trung Quân Idol",
      path: "./music/song8.mp3",
      image: "./img/song8.jpg",
    },
    {
      name: "Nàng Thơ",
      singer: "Hoàng Dũng",
      path: "./music/song9.mp3",
      image: "./img/song9.jpg",
    },
    {
      name: "Khó Vẽ Nụ Cười",
      singer: "Đạt G",
      path: "./music/song10.mp3",
      image: "./img/song10.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
              <div class="thumb" style="background-image: url('${song.image}')">
              </div>
              <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
              </div>
              <div class="option">
                <i class="fas fa-ellipsis-h"></i>
              </div>
            </div>  
          `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //Xu ly CD quay / dung
    const cdThumbAmimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAmimate.pause();

    // Xu ly phong to / thu nho CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xu ly khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi bai hat duoc play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAmimate.play();
    };

    // Khi bai hat bi pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAmimate.pause();
    };

    // Khi tien do bai hat duoc thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xu ly khi tua bai hat
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next bai hat
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi prev bai hat
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xu ly bat / tat random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xu ly lap lai 1 bai hat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xu ly next bai hat khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lang nghe hanh vi click vao playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xu ly khi click vao bai hat
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        //Xu ly khi click vao option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.currentSong();
  },
  start: function () {
    // Dinh nghia cac thuoc tinh cho object
    this.defineProperties();

    // Lang nghe / xu ly cac su kien (DOM events)
    this.handleEvents();

    // Tai thong ti bai hat dau tien vao UI khi chay ung dung
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};

app.start();
