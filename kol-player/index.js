;(function () {
   theme.addEventListener('click', e => {
     $(e.target).parents('.radio-container').toggleClass('radio-container_light');
   });

// Настройка городов и возможных станций
const IMAGES_FOLDER = './attach';
const STREAMING = {
   /*
   'Город': { // Выведется в выпадающий список
      "название_файла_картинки": 'ссылка_на_поток_радио',
   },
   Ссылка на картинку генерируется так: IMAGES_FOLDER + название_картинки_в_каждом_случае
   */
   'Симферополь': {
      "evropa.png": 'https://mdstrm.com/audio/60a2745ff943100826374a70/icecast.audio',
      "7.png": 'https://a1-it.newradio.it/stream',
      "retro.png": 'http://20283.live.streamtheworld.com/LOS40_ARGENTINA.mp3',
      "record.png": 'https://cdn001.tegotv.com/icecast/RadioJaagriti/icecast.audio',
      "jazzfm.png": 'http://playerservices.streamtheworld.com/api/livestream-redirect/DISNEY_ARG_BA.mp3',
      "dorozhnoe.png": 'http://playerservices.streamtheworld.com/api/livestream-redirect/RIVADAVIA.mp3',
      "nashe.png": 'http://20283.live.streamtheworld.com/LOS40_ARGENTINA.mp3',
      "relax.png": 'https://mdstrm.com/audio/60a2745ff943100826374a70/icecast.audio',
   },
   'Севастополь': {
      "evropa.png": 'https://mdstrm.com/audio/60a2745ff943100826374a70/icecast.audio',
      "7.png": 'https://a1-it.newradio.it/stream',
      "record.png": 'https://cdn001.tegotv.com/icecast/RadioJaagriti/icecast.audio',
      "jazzfm.png": 'http://playerservices.streamtheworld.com/api/livestream-redirect/DISNEY_ARG_BA.mp3',
      "nashe.png": 'http://20283.live.streamtheworld.com/LOS40_ARGENTINA.mp3',
      "relax.png": 'https://mdstrm.com/audio/60a2745ff943100826374a70/icecast.audio',
   },
   "Саки": {
      "7.png": 'https://a1-it.newradio.it/stream',
      "retro.png": 'http://20283.live.streamtheworld.com/LOS40_ARGENTINA.mp3',
      "record.png": 'https://cdn001.tegotv.com/icecast/RadioJaagriti/icecast.audio',
      "jazzfm.png": 'http://playerservices.streamtheworld.com/api/livestream-redirect/DISNEY_ARG_BA.mp3',
      "dorozhnoe.png": 'http://playerservices.streamtheworld.com/api/livestream-redirect/RIVADAVIA.mp3',
      "nashe.png": 'http://20283.live.streamtheworld.com/LOS40_ARGENTINA.mp3',
   },
};

// API

var player = document.getElementById('radioPlayer');
var radioVolume = document.getElementById('radioVol');
var userVolume = 50;
let stations = document.querySelector('.radio-stations');

radioCity.getSelected = function() {
   return this.options[this.selectedIndex];
};

// Generate select
for (let city in STREAMING) {
   radioCity.append($(`<option>${city}</option>`)[0]);
}

const STATE = {
   city: radioCity.getSelected().textContent,
   station: null,
   get stream() {
      return this.station.dataset.stream;
   },
   get isPlaying() {
      return $('.button-play > i').hasClass('fa-pause');
   }
};

// Generate stations
function renderStations(city) {
   stations.innerHTML = '';

   for (let image in STREAMING[city]) {
      let stream = STREAMING[city][image];
      let $stationEl = $(`
         <div 
            class="radio-station"
            style="background-image: url('${IMAGES_FOLDER+'/'+image}')"
            data-stream="${stream}">
         </div>`);
      stations.append($stationEl[0]);
   }
   
   STATE.station = stations.firstElementChild;
   STATE.station.classList.add('radio-station_selected');
   STATE.stream = STATE.station.dataset.stream;

   player.pause();
   player.src = STATE.stream;
   if (STATE.isPlaying)
      player.play();
}
renderStations(STATE.city);

// events
$(radioCity).on('change input', e => {
   const city = radioCity.getSelected().textContent;
   STATE.city = city;
   renderStations(city);
});

$('.radio-station').click(e => {
   const station = e.currentTarget;
   
   STATE.station.classList.remove('radio-station_selected');
   station.classList.add('radio-station_selected');

   STATE.station = station;
   
   player.pause();
   player.src = STATE.stream;
   if (STATE.isPlaying)
      player.play();
});

$('.button-play').click(function () {
   icon = $(this).find('i');

   if (icon.hasClass('fa-pause')) {
      icon.removeClass('fa-pause');
      icon.addClass('fa-play');
      if (player.src != STATE.stream) {
         player.src = STATE.stream;
      }
      player.pause();
   } else {
      icon.removeClass('fa-play');
      icon.addClass('fa-pause');
      player.play();
   }
});

$('.button-sound').click(function () {
   icon = $(this).find('i');

   if (icon.hasClass('fa-volume-off')) {
      radioVolume.value = userVolume;
   } else {
      radioVolume.value = 0;
   }
   setVolume();
});

// sound API
function setVolume() {
   player.volume = radioVolume.value / 100;
   checkVolume();
};

function checkVolume() {
   icon = $('.button-sound').find('i');

   if (radioVolume.value == 0) {
      icon.removeClass('fa-volume-up');
      icon.removeClass('fa-volume-down');
      icon.addClass('fa-volume-off');
   } else if (radioVolume.value < 50) {
      icon.removeClass('fa-volume-off');
      icon.removeClass('fa-volume-up');
      icon.addClass('fa-volume-down');
      userVolume = radioVolume.value;
   } else {
      icon.removeClass('fa-volume-off');
      icon.removeClass('fa-volume-down');
      icon.addClass('fa-volume-up');
      userVolume = radioVolume.value;
   }
};

window.setVolume = setVolume;

})();