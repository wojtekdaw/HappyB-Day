const profiles = [
  {
    name: "Zuzanna S.",
    age: 24,
    distance: "2 km od Ciebie",
    status: "W nastroju na wspólne chrupanie orzeszków",
    image: "sw1.png",
    badge: "New",
    bio: "Znam wszystkie wyjścia z płonącej nory. Szukam kogoś, kto nie przestraszy się iskier ani moich nocnych zabaw z patykami.",
    interests: ["Turlanie się w popiele", "Plotki znad strumienia", "Zbieranie malin"],
    preferences: ["Poranki przy ognisku", "Wyścigi po kłodach", "Playlisty z gitarą"],
  },
  {
    name: "Julia T.",
    age: 24,
    distance: "4 km od Ciebie",
    status: "Pracuję w ochronie pieczonych kasztanów",
    image: "sw2.png",
    badge: "Top pick",
    bio: "Moje futro zmienia kolor przy świetle płomieni. Jeśli potrafisz dotrzymać kroku mojej energii — mamy randkę.",
    interests: ["Sprinty przez wrzosowiska", "Akrobatyka na skałach", "Gry terenowe"],
    preferences: ["Wieczorne akcje ratunkowe", "Wspólne grzebanie w popiele", "Improwizowane rapy"],
  },
  {
    name: "Oliwia T.",
    age: 24,
    distance: "5 km od Ciebie",
    status: "Projektuję stroje odporne na ogień",
    image: "sw3.png",
    badge: "Flame pro",
    bio: "Jeśli lubisz, gdy ktoś przejmuje kontrolę nad sytuacją, to mój numer. Do każdej randki dodaję gratis: iskry i plan B.",
    interests: ["Szycie skórzanych kombinezonów", "Sesje zdjęciowe przy gejzerze", "Taneczne wygibasy"],
    preferences: ["Duety na drzewach", "Debaty o bezpieczeństwie", "Minimalistyczne ogniska"],
  },
  {
    name: "Miłego dnia 🍑🍆",
    age: 28,
    distance: "6 km od Ciebie",
    status: "Prowadzę bloga o hodowli ognistych paproci",
    image: "sw4.png",
    badge: "Creative",
    bio: "Sławny wśród susłów vloger. Jeżeli masz cierpliwość do moich żartów o wiewiórkach, odwzajemnię się prywatną premierą filmu.",
    interests: ["Nagrywanie vloga", "Kolekcjonowanie kamieni", "Rozpalanie tysiącem zapałek"],
    preferences: ["Maratony dokumentów", "Testy kulinarnych przepisów z żarem", "Wspólne montowanie filmów"],
  },
  {
    name: "Wiktoria H. ",
    age: 24,
    distance: "1 km od Ciebie",
    status: "Instruktorka błyszczących akrobacji",
    image: "sw2.png",
    badge: "Spotlight",
    bio: "Wiem jak rozświetlić każdy wieczór. Uwielbiam uczyć nowych tricków i sprawiać, że wszystko dookoła lśni.",
    interests: ["Złote konfetti", "Układy synchroniczne", "Nocne kąpiele w strumieniu"],
    preferences: ["Treningi na świeżym powietrzu", "Planowanie pokazów", "Wspólne playlisty R&B"],
  },
  {
    name: "Wiktoria S.",
    age: 26,
    distance: "8 km od Ciebie",
    status: "Strażak ochotnik w płonącej krainie",
    image: "sw1.png",
    badge: "TOP CHOICE",
    bio: "Mam plan ewakuacji na każdą okazję, ale wolę zostać, jeśli znajdę iskierkę chemii. Po serii randek pokażę Ci tajną ścieżkę do płomiennego świata.",
    interests: ["Szkolenia taktyczne", "Szukanie polan", "Budowanie wież z drewna"],
    preferences: ["Strategiczne randki", "Wyprawy z mapą", "Testowanie wytrzymałości na żar"],
  },
];

const cardEl = document.querySelector(".date-card");
const imageEl = document.getElementById("profile-image");
const badgeEl = document.getElementById("profile-badge");
const nameEl = document.getElementById("profile-name");
const ageEl = document.getElementById("profile-age");
const distanceEl = document.getElementById("profile-distance");
const statusEl = document.getElementById("profile-status");
const bioEl = document.getElementById("profile-bio");
const interestsEl = document.getElementById("profile-interests");
const preferencesEl = document.getElementById("profile-preferences");
const counterEl = document.getElementById("profile-counter");
const progressEl = document.getElementById("profile-progress");

const dislikeButton = document.getElementById("button-pass");
const likeButton = document.getElementById("button-like");

if (
  cardEl &&
  imageEl &&
  badgeEl &&
  nameEl &&
  ageEl &&
  distanceEl &&
  statusEl &&
  bioEl &&
  interestsEl &&
  preferencesEl &&
  dislikeButton &&
  likeButton
) {
  let currentIndex = 0;

  const renderProfile = () => {
    const profile = profiles[currentIndex];
    imageEl.src = profile.image;
    imageEl.alt = `${profile.name} — profil randkowy susła`;
    badgeEl.textContent = profile.badge;
    nameEl.textContent = profile.name;
    ageEl.textContent = `${profile.age} lat`;
    distanceEl.textContent = profile.distance;
    statusEl.textContent = profile.status;
    bioEl.textContent = profile.bio;

    interestsEl.innerHTML = profile.interests.map((item) => `<li>${item}</li>`).join("");
    preferencesEl.innerHTML = profile.preferences.map((item) => `<li>${item}</li>`).join("");

    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1}/${profiles.length}`;
    }

    const progress = (currentIndex + 1) / profiles.length;
    if (progressEl) {
      progressEl.style.transform = `scaleX(${progress})`;
    }

    cardEl.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      currentIndex += 1;
    } else {
      currentIndex = profiles.length - 1;
    }
    renderProfile();
  };

  const goToFirstProfile = () => {
    currentIndex = 0;
    renderProfile();
  };

  dislikeButton.addEventListener("click", () => {
    if (currentIndex === profiles.length - 1) {
      goToFirstProfile();
      return;
    }
    goToNextProfile();
  });

  likeButton.addEventListener("click", () => {
    if (currentIndex === profiles.length - 1) {
      window.location.href = "flames.html";
      return;
    }
    goToNextProfile();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      dislikeButton.click();
    }
    if (event.key === "ArrowRight") {
      likeButton.click();
    }
  });

  renderProfile();
} else {
  console.warn("Brakuje elementów interfejsu dla Marmot Match.");
}
