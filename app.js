// ===== 1. API ki settings =====
var API_KEY = "f645a23d9712d1d7483e2883fc1664c5";
var BASE_URL = "https://api.openweathermap.org/data/2.5";

// ===== 2. HTML ke elements pakdo =====
var cityInput = document.getElementById("cityInput");
var searchBtn = document.getElementById("searchBtn");
var locationBtn = document.getElementById("locationBtn");
var unitBtn = document.getElementById("unitBtn");
var skeleton = document.getElementById("skeleton");
var errorBox = document.getElementById("error");
var card = document.getElementById("weatherCard");
var recentBox = document.getElementById("recent");
var scene = document.getElementById("scene");

// ===== 3. Variables =====
var unit = "C";        // "C" ya "F"
var temp = 0;          // temperature (hamesha Celsius me save)
var feelsLike = 0;
var forecastList = []; // 5 din ka data


// ===== 4. Chhote helper functions =====

// 0 se 1 ke beech random number (animations ko alag alag karne ke liye)
function random(min, max) {
  return min + Math.random() * (max - min);
}

// Celsius ko unit ke hisab se number banao
function getTemp(celsius) {
  if (unit == "C") {
    return Math.round(celsius);
  } else {
    return Math.round(celsius * 9 / 5 + 32);
  }
}

// Weather ke hisab se emoji
function getIcon(weather, isNight) {
  if (weather == "Clear" && isNight) return "🌙";
  if (weather == "Clear") return "☀️";
  if (weather == "Clouds") return "☁️";
  if (weather == "Rain") return "🌧️";
  if (weather == "Drizzle") return "🌦️";
  if (weather == "Thunderstorm") return "⛈️";
  if (weather == "Snow") return "❄️";
  return "🌫️";
}

// Weather ke hisab se background ki class
function getBackground(weather, isNight) {
  if (weather == "Clear" && isNight) return "clear-night";
  if (weather == "Clear") return "clear-day";
  if (weather == "Clouds") return "clouds";
  if (weather == "Rain" || weather == "Drizzle") return "rain";
  if (weather == "Thunderstorm") return "thunder";
  if (weather == "Snow") return "snow";
  return "mist";
}

// Mashwara
function getTip(temperature, weather) {
  if (weather == "Rain" || weather == "Drizzle") return "☔ Chhatri le jao, barish ho rahi hai!";
  if (weather == "Thunderstorm") return "⚡ Ghar ke andar raho, bijli chamak rahi hai.";
  if (weather == "Snow") return "🧤 Garam kapde aur gloves pehno.";
  if (temperature >= 38) return "🥵 Bohot garmi hai! Pani peete raho.";
  if (temperature >= 28) return "😎 Garmi hai, halke kapde pehno.";
  if (temperature >= 18) return "🙂 Mausam acha hai, bahar ghoom lo!";
  if (temperature >= 8) return "🧥 Thand hai, jacket le lo.";
  return "🥶 Bohot thand! Sweater pehno.";
}


// ===== 5. Aasman ki animations =====
// Har function ek cheez banata hai aur scene me daal deta hai

function makeSun() {
  var sun = document.createElement("div");
  sun.className = "sun";
  scene.appendChild(sun);
}

function makeMoon() {
  var moon = document.createElement("div");
  moon.className = "moon";
  scene.appendChild(moon);
}

function makeStars() {
  for (var i = 0; i < 70; i++) {
    var star = document.createElement("div");
    star.className = "star";
    star.style.left = random(0, 100) + "%";
    star.style.top = random(0, 70) + "%";
    star.style.width = random(1, 3) + "px";
    star.style.height = star.style.width;
    star.style.animationDuration = random(1, 4) + "s";
    scene.appendChild(star);
  }
}

function makeClouds(howMany) {
  for (var i = 0; i < howMany; i++) {
    var cloud = document.createElement("div");
    cloud.className = "cloud";
    cloud.style.top = random(2, 45) + "%";
    cloud.style.scale = random(0.7, 1.8);
    cloud.style.animationDuration = random(40, 90) + "s";
    cloud.style.animationDelay = "-" + random(0, 60) + "s"; // minus = shuru se hi screen par
    scene.appendChild(cloud);
  }
}

function makeRain(howMany) {
  for (var i = 0; i < howMany; i++) {
    var drop = document.createElement("div");
    drop.className = "rain-drop";
    drop.style.left = random(0, 110) + "%";
    drop.style.animationDuration = random(0.6, 1.1) + "s";
    drop.style.animationDelay = "-" + random(0, 2) + "s";
    scene.appendChild(drop);
  }
}

function makeSnow() {
  for (var i = 0; i < 60; i++) {
    var flake = document.createElement("div");
    flake.className = "flake";
    flake.style.left = random(0, 100) + "%";
    flake.style.width = random(4, 10) + "px";
    flake.style.height = flake.style.width;
    flake.style.animationDuration = random(5, 10) + "s";
    flake.style.animationDelay = "-" + random(0, 8) + "s";
    scene.appendChild(flake);
  }
}

function makeLightning() {
  var flash = document.createElement("div");
  flash.className = "flash";
  scene.appendChild(flash);
}

// Weather dekh kar sahi cheezein banao
function buildScene(weather, isNight) {
  scene.innerHTML = ""; // pehle purana sab saaf

  if (weather == "Clear") {
    if (isNight) {
      makeMoon();
      makeStars();
    } else {
      makeSun();
    }
  } else if (weather == "Clouds" || weather == "Mist" || weather == "Haze" || weather == "Fog") {
    makeClouds(7);
  } else if (weather == "Rain") {
    makeClouds(5);
    makeRain(90);
  } else if (weather == "Drizzle") {
    makeClouds(5);
    makeRain(40);
  } else if (weather == "Thunderstorm") {
    makeClouds(5);
    makeRain(90);
    makeLightning();
  } else if (weather == "Snow") {
    makeClouds(5);
    makeSnow();
  } else {
    makeClouds(6);
  }
}


// ===== 6. Temperature ginti karte hue dikhao (0 se asli number tak) =====
function showTempWithCount(finalValue) {
  var tempEl = document.getElementById("temp");
  var number = 0;
  var step = finalValue >= 0 ? 1 : -1;

  var timer = setInterval(function () {
    tempEl.textContent = number + "°";
    if (number == finalValue) {
      clearInterval(timer);
    }
    number = number + step;
  }, 30);
}


// ===== 7. Messages =====
function showLoading(on) {
  if (on) {
    skeleton.classList.remove("hidden");
    card.classList.add("hidden");
  } else {
    skeleton.classList.add("hidden");
  }
}

function showError(message) {
  errorBox.textContent = "⚠️ " + message;
  errorBox.classList.remove("hidden");
  card.classList.add("hidden");
}


// ===== 8. Pichli searches (localStorage me save hoti hain) =====
function getRecent() {
  var saved = localStorage.getItem("recentCities");
  if (saved == null) {
    return [];
  }
  return JSON.parse(saved);
}

function saveRecent(city) {
  var list = getRecent();

  // agar pehle se hai to hata do (duplicate na ho)
  var newList = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].toLowerCase() != city.toLowerCase()) {
      newList.push(list[i]);
    }
  }

  newList.unshift(city);          // sab se upar lagao
  newList = newList.slice(0, 5);  // sirf 5 rakho
  localStorage.setItem("recentCities", JSON.stringify(newList));
  showRecent();
}

function showRecent() {
  recentBox.innerHTML = "";
  var list = getRecent();

  for (var i = 0; i < list.length; i++) {
    var btn = document.createElement("button");
    btn.textContent = list[i];
    btn.onclick = function () {
      getWeather(this.textContent);
    };
    recentBox.appendChild(btn);
  }
}


// ===== 9. API se data lana =====
function getWeather(city) {
  city = city.trim();
  if (city == "") {
    showError("Pehle city ka naam likho!");
    return;
  }
  var url1 = BASE_URL + "/weather?q=" + city + "&units=metric&appid=" + API_KEY;
  var url2 = BASE_URL + "/forecast?q=" + city + "&units=metric&appid=" + API_KEY;
  loadData(url1, url2);
}

function getWeatherByLocation(lat, lon) {
  var place = "lat=" + lat + "&lon=" + lon;
  var url1 = BASE_URL + "/weather?" + place + "&units=metric&appid=" + API_KEY;
  var url2 = BASE_URL + "/forecast?" + place + "&units=metric&appid=" + API_KEY;
  loadData(url1, url2);
}

async function loadData(weatherUrl, forecastUrl) {
  errorBox.classList.add("hidden");
  showLoading(true);

  try {
    var response = await fetch(weatherUrl);
    var data = await response.json();

    // Galat city ya galat key ho to yahan pakda jayega
    if (data.cod == 404) {
      throw new Error("City nahi mili. Spelling check karo!");
    }
    if (data.cod == 401) {
      throw new Error("API key sahi nahi hai ya abhi active nahi hui.");
    }

    var response2 = await fetch(forecastUrl);
    var data2 = await response2.json();

    // roz dopahar 12 baje wala data chuno
    forecastList = [];
    for (var i = 0; i < data2.list.length; i++) {
      if (data2.list[i].dt_txt.includes("12:00:00")) {
        forecastList.push(data2.list[i]);
      }
    }

    showLoading(false);
    showWeather(data);
    saveRecent(data.name);

  } catch (error) {
    showLoading(false);
    if (error.message == "Failed to fetch") {
      showError("Internet connection check karo!");
    } else {
      showError(error.message);
    }
  }
}


// ===== 10. Screen par dikhana =====
function showWeather(data) {
  var weather = data.weather[0].main;                  // jaise "Rain"
  var isNight = data.dt < data.sys.sunrise || data.dt > data.sys.sunset;

  temp = data.main.temp;
  feelsLike = data.main.feels_like;

  document.getElementById("cityName").textContent = data.name + ", " + data.sys.country;
  document.getElementById("description").textContent = data.weather[0].description;
  document.getElementById("icon").textContent = getIcon(weather, isNight);
  document.getElementById("humidity").textContent = data.main.humidity + "%";
  document.getElementById("tip").textContent = getTip(temp, weather);

  // us shehar ka time
  var localTime = new Date((data.dt + data.timezone) * 1000);
  document.getElementById("localTime").textContent = "Local time: " +
    localTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

  // Hawa (m/s ko km/h me badlo) aur pankhe ki speed
  var windSpeed = Math.round(data.wind.speed * 3.6);
  document.getElementById("wind").textContent = windSpeed + " km/h";
  var fanTime = 3 - windSpeed / 12;
  if (fanTime < 0.3) fanTime = 0.3;
  document.getElementById("fan").style.animationDuration = fanTime + "s";

  // Background aur aasman badlo
  document.body.className = getBackground(weather, isNight);
  buildScene(weather, isNight);

  // Card dikhao (animation dobara chalane ke liye class hata ke wapas lagao)
  card.classList.remove("hidden");
  card.classList.remove("show");
  void card.offsetWidth;
  card.classList.add("show");
  document.getElementById("icon").classList.add("float");

  // Humidity bar bharo
  var bar = document.getElementById("humBar");
  bar.style.width = "0";
  setTimeout(function () {
    bar.style.width = data.main.humidity + "%";
  }, 300);

  showTempWithCount(getTemp(temp));
  document.getElementById("feels").textContent = getTemp(feelsLike) + "°";
  unitBtn.textContent = "°" + unit;
  showForecast();
}

function showForecast() {
  var box = document.getElementById("forecast");
  box.innerHTML = "";

  for (var i = 0; i < forecastList.length; i++) {
    var item = forecastList[i];
    var dayName = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });

    var div = document.createElement("div");
    div.className = "day";
    div.style.setProperty("--d", i);   // har din thodi der baad aayega
    div.innerHTML = dayName + "<span>" + getIcon(item.weather[0].main, false) + "</span>" +
                    getTemp(item.main.temp) + "°";
    box.appendChild(div);
  }
}


// ===== 11. User ki location (Geolocation API) =====
function useMyLocation() {
  if (!navigator.geolocation) {
    showError("Tumhara browser location support nahi karta.");
    return;
  }

  showLoading(true);
  navigator.geolocation.getCurrentPosition(
    function (position) {
      getWeatherByLocation(position.coords.latitude, position.coords.longitude);
    },
    function () {
      showLoading(false);
      showError("Location ki permission do ya city khud likho.");
    }
  );
}


// ===== 12. Buttons ka kaam =====
searchBtn.addEventListener("click", function () {
  getWeather(cityInput.value);
});

// Enter dabane se bhi search ho
cityInput.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    getWeather(cityInput.value);
  }
});

locationBtn.addEventListener("click", useMyLocation);

// °C aur °F badalna
unitBtn.addEventListener("click", function () {
  if (unit == "C") {
    unit = "F";
  } else {
    unit = "C";
  }
  unitBtn.textContent = "°" + unit;
  document.getElementById("temp").textContent = getTemp(temp) + "°";
  document.getElementById("feels").textContent = getTemp(feelsLike) + "°";
  showForecast();
});

// Mouse hilane par card thoda 3D me hilta hai
card.addEventListener("mousemove", function (event) {
  var box = card.getBoundingClientRect();
  var x = (event.clientX - box.left) / box.width - 0.5;
  var y = (event.clientY - box.top) / box.height - 0.5;
  card.style.setProperty("--ry", x * 12 + "deg");
  card.style.setProperty("--rx", -y * 12 + "deg");
});

card.addEventListener("mouseleave", function () {
  card.style.setProperty("--ry", "0deg");
  card.style.setProperty("--rx", "0deg");
});


// ===== 13. Page khulte hi =====
document.getElementById("today").textContent =
  new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });

showRecent();

var lastCity = getRecent()[0];
if (lastCity) {
  getWeather(lastCity);   // pichli city khud khul jaye
} else {
  buildScene("Clear", false);
}