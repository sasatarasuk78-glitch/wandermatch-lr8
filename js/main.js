const mobileMenu = document.querySelector("#menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");

if (mobileMenu && primaryNavigation) {
  const setMenuOpen = (isOpen) => {
    primaryNavigation.classList.toggle("hidden", !isOpen);
    mobileMenu.setAttribute("aria-expanded", String(isOpen));
  };

  mobileMenu.addEventListener("click", () => {
    const isOpen = mobileMenu.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  primaryNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 768px)").matches) setMenuOpen(false);
  });
}

const newsletterForm = document.querySelector("#newsletter-form");
const newsletterStatus = document.querySelector("#newsletter-status");

if (newsletterForm && newsletterStatus) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterStatus.textContent = "Дякуємо! Це демонстрація: дані нікуди не надсилаються.";
  });
}

const destinationSelect = document.querySelector("#destination-select");

if (destinationSelect) {
  const destinations = {
    kyoto: {
      name: "Кіото",
      country: "Японія",
      query: "Kyoto, Japan",
      latitude: 35.0116,
      longitude: 135.7681,
      videoId: "Jd1wzlwtKJ0",
      videoTitle: "Kyoto Vacation Travel Guide | Expedia",
      videoDescription: "Храми, традиційні квартали та знакові місця міста у відеоогляді.",
    },
    lisbon: {
      name: "Лісабон",
      country: "Португалія",
      query: "Lisbon, Portugal",
      latitude: 38.7223,
      longitude: -9.1393,
      videoId: "N8bHCHl8X_0",
      videoTitle: "Lisbon Vacation Travel Guide | Expedia",
      videoDescription: "Жовті трамваї, старі квартали й краєвиди Лісабона у відеопутівнику.",
    },
    bali: {
      name: "Балі",
      country: "Індонезія",
      query: "Bali, Indonesia",
      latitude: -8.4095,
      longitude: 115.1889,
      videoId: "Xnke1lbylog",
      videoTitle: "Bali Indonesia Travel Guide 4K",
      videoDescription: "Пляжі, храми та тропічні краєвиди острова Балі у відеоогляді.",
    },
    dolomites: {
      name: "Доломіти",
      country: "Італія",
      query: "Dolomites, Italy",
      latitude: 46.4102,
      longitude: 11.844,
      videoId: "F1xwnRiq4iY",
      videoTitle: "Dolomites 4K — Immersive Tour and Travel Guide",
      videoDescription: "Гірські вершини, озера й альпійські селища Доломітів у відеотурі.",
    },
    marrakech: {
      name: "Марракеш",
      country: "Марокко",
      query: "Marrakech, Morocco",
      latitude: 31.6295,
      longitude: -7.9811,
      videoId: "OvN1numZqqU",
      videoTitle: "Marrakech 4K — The Pearl of Morocco",
      videoDescription: "Медина, базари, палаци й сади Марракеша у відеопутівнику.",
    },
    reykjavik: {
      name: "Рейк'явік",
      country: "Ісландія",
      query: "Reykjavik, Iceland",
      latitude: 64.1466,
      longitude: -21.9426,
      videoId: "i6V7jc6bXP0",
      videoTitle: "Iceland Walking Tour — Reykjavík [4K]",
      videoDescription: "Прогулянка Рейк'явіком: гавань, міські вулиці й архітектура столиці Ісландії.",
    },
  };

  const exploreTitle = document.querySelector("#explore-title");
  const destinationStatus = document.querySelector("#destination-status");
  const videoHeading = document.querySelector("#destination-video-heading");
  const videoDescription = document.querySelector("#destination-video-description");
  const videoPreview = document.querySelector("#destination-video-preview");
  const videoThumbnail = document.querySelector("#destination-video-thumbnail");
  const videoPlayButton = document.querySelector("#destination-video-play");
  const videoPlayer = document.querySelector("#destination-video-player");
  const videoFrame = document.querySelector("#destination-video-frame");
  const videoLink = document.querySelector("#destination-video-link");
  const mapHeading = document.querySelector("#destination-map-heading");
  const mapFrame = document.querySelector("#destination-map-frame");
  const mapLink = document.querySelector("#destination-map-link");
  const weatherHeading = document.querySelector("#destination-weather-heading");
  const weatherDescription = document.querySelector("#destination-weather-description");
  const weatherFrame = document.querySelector("#destination-weather-frame");
  const weatherLink = document.querySelector("#destination-weather-link");

  const updateDestination = (key) => {
    const destination = destinations[key];
    if (!destination) return;

    const { name, country, query, latitude, longitude, videoId, videoTitle, videoDescription: videoCopy } = destination;
    const place = `${name}, ${country}`;
    const mapsSearch = new URL("https://www.google.com/maps/search/");
    mapsSearch.searchParams.set("api", "1");
    mapsSearch.searchParams.set("query", query);

    const windyEmbed = new URL("https://embed.windy.com/embed2.html");
    const windyParams = {
      lat: latitude,
      lon: longitude,
      detailLat: latitude,
      detailLon: longitude,
      width: 650,
      height: 450,
      zoom: 6,
      level: "surface",
      overlay: "wind",
      menu: "",
      message: "true",
      marker: "true",
      calendar: "now",
      pressure: "",
      type: "map",
      location: "coordinates",
      detail: "",
      metricWind: "default",
      metricTemp: "default",
      radarRange: -1,
    };
    Object.entries(windyParams).forEach(([param, value]) => windyEmbed.searchParams.set(param, value));

    exploreTitle.textContent = `Відчуй ${name} ще до подорожі`;
    videoHeading.textContent = `Побач ${name} очима мандрівника`;
    videoDescription.textContent = videoCopy;
    videoFrame.title = `${videoTitle} — ${place}`;
    videoLink.href = `https://www.youtube.com/watch?v=${videoId}`;

    if (videoThumbnail && videoPreview && videoPlayer && videoPlayButton) {
      videoThumbnail.alt = `Прев’ю відеопутівника: ${videoTitle} — ${place}`;
      videoThumbnail.dataset.fallbackLevel = "0";
      videoThumbnail.dataset.videoId = videoId;
      videoThumbnail.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      videoPlayButton.setAttribute("aria-label", `Відтворити відео про ${place}`);
      videoFrame.removeAttribute("src");
      videoPreview.classList.remove("hidden");
      videoPlayer.classList.add("hidden");
    }

    mapHeading.textContent = `${name} на мапі`;
    mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=12&output=embed`;
    mapFrame.title = `Google Maps — карта міста ${place}`;
    mapLink.href = mapsSearch.toString();

    weatherHeading.textContent = `Погода: ${name}`;
    weatherDescription.textContent = `Інтерактивна карта вітру й погодних умов для напрямку ${place}.`;
    weatherFrame.src = windyEmbed.toString();
    weatherFrame.title = `Windy — прогноз погоди для ${place}`;
    weatherLink.href = `https://www.windy.com/?${latitude},${longitude},6`;

    destinationStatus.textContent = `Показано відео, карту та прогноз погоди для ${place}.`;
  };

  if (videoThumbnail) {
    const loadThumbnailFallback = () => {
      const fallbackLevel = Number(videoThumbnail.dataset.fallbackLevel || 0);
      const videoId = videoThumbnail.dataset.videoId;
      const fallbackFiles = ["sddefault.jpg", "hqdefault.jpg"];

      if (videoId && fallbackLevel < fallbackFiles.length) {
        videoThumbnail.dataset.fallbackLevel = String(fallbackLevel + 1);
        videoThumbnail.src = `https://i.ytimg.com/vi/${videoId}/${fallbackFiles[fallbackLevel]}`;
      }
    };

    videoThumbnail.addEventListener("error", loadThumbnailFallback);
    videoThumbnail.addEventListener("load", () => {
      // Some unavailable YouTube sizes return a tiny placeholder instead of a 404.
      if (videoThumbnail.naturalWidth < 200) loadThumbnailFallback();
    });
  }

  if (videoPlayButton) {
    videoPlayButton.addEventListener("click", () => {
      const destination = destinations[destinationSelect.value];
      if (!destination || !videoFrame || !videoPreview || !videoPlayer) return;

      const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${destination.videoId}`);
      embedUrl.searchParams.set("autoplay", "1");
      embedUrl.searchParams.set("rel", "0");
      embedUrl.searchParams.set("origin", window.location.origin);
      videoFrame.src = embedUrl.toString();
      videoPreview.classList.add("hidden");
      videoPlayer.classList.remove("hidden");
    });
  }

  destinationSelect.addEventListener("change", () => updateDestination(destinationSelect.value));
  updateDestination(destinationSelect.value);
}
