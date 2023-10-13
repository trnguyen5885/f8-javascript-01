const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const player = $('.player')
const heading = $('header h2')
const singer = $('header h4')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Id072019",
            singer: "W/n",
            path: "./assets/audio/audio1.mp3",
            image: "./assets/thumb/thumb1.jpg"
        },
        {
            name: "3107/3",
            singer: "W/n , DuongG , Nâu",
            path: "./assets/audio/audio2.mp3",
            image: "./assets/thumb/thumb2.jpg"
        },
        {
            name: "3107",
            singer: "W/n , DuongG , Nâu",
            path: "./assets/audio/audio3.mp3",
            image: "./assets/thumb/thumb3.jpg"
        },
        {
            name: "2022",
            singer: "W/n , Title",
            path: "./assets/audio/audio4.mp3",
            image: "./assets/thumb/thumb4.jpg"
        },
        {
            name: "3107",
            singer: "W/n , DuongG , Nâu",
            path: "./assets/audio/audio5.mp3",
            image: "./assets/thumb/thumb5.jpg"
        },
        {
            name: "Giấc Mơ Khác",
            singer: "Chillies",
            path: "./assets/audio/audio6.mp3",
            image: "./assets/thumb/thumb6.jpg"
        },
        {
            name: "Qua Khung Cửa Sổ",
            singer: "Chillies",
            path: "./assets/audio/audio7.mp3",
            image: "./assets/thumb/thumb7.jpg"
        }, 
        {
            name: "Trên Những Đám Mây",
            singer: "Chillies",
            path: "./assets/audio/audio8.mp3",
            image: "./assets/thumb/thumb8.jpg"
        },  
        {
            name: "Vì Sao",
            singer: "Chillies",
            path: "./assets/audio/audio9.mp3",
            image: "./assets/thumb/thumb9.jpg"
        },
        {
            name: "Bạn đời",
            singer: "Chillies",
            path: "./assets/audio/audio10.mp3",
            image: "./assets/thumb/thumb10.jpg"
        },     
    ],

    renderSong: function() {
        const html = this.songs.map((song , index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div
                        class="thumb"
                        style="
                            background-image: url('${song.image}');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = html.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong' , {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // Lắng nghe sự kiện audio chạy thì cdThumb phải quay
        const cdThumbAnimate = cdThumb.animate([{
            transform:'rotate(360deg)'
        }] , {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()
        // Lắng nghe sự kiện của scroll
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        
        }
        // Lắng nghe sự kiện khi click vào nút play để phát nhạc
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();                
            }
        }

        // Lắng nghe sự kiện khi audio play

        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play();
        }

        // Lắng nghe sự kiện khi audio pause

        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi

        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                console.log(progressPercent)
            }
        }
        progress.onchange = function(e) {
            const seek = audio.duration / 100 * e.target.value;
            audio.currentTime = seek;
        }
        // Xử lí khi bấm nút repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat )
        }
        // Xử lí khi bấm nút next
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.renderSong();
            _this.scrollToActiveSong();
        
        }
        // Xử lí khi bấm nút pre
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.renderSong();
            _this.scrollToActiveSong();
        }

        // Lắng nghe hành động click vào nút random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lí khi song khi kết thúc
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Xử lí khi click vào song
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.renderSong()
                    audio.play()
                    

                }
            }
        }



    },
    scrollToActiveSong: function() {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        })
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        singer.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newCurrentIndex
            do {
                newCurrentIndex = Math.floor(Math.random() * this.songs.length)
            } while(newCurrentIndex === this.currentIndex)
            this.currentIndex = newCurrentIndex
            this.loadCurrentSong();
    },

    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        // Lắng nghe sự kiện
        this.handleEvents();
        // Tải nhạc hiện tại
        this.loadCurrentSong();


        // Render ra các bài hát ở danh sách phát
        this.renderSong();
    }

};

app.start();



