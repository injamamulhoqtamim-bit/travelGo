// ================= NAVBAR =================
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// ================= LOGIN =================
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const loginBtnMobile = document.getElementById('loginBtnMobile');
const closeLogin = document.getElementById('closeLogin');
const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');

let isLoggedIn = false;

function openLogin(){
  loginModal.classList.remove('hidden');
  loginModal.classList.add('flex');
}

function closeLoginModal(){
  loginModal.classList.add('hidden');
  loginModal.classList.remove('flex');
}

loginBtn.addEventListener('click', openLogin);
loginBtnMobile.addEventListener('click', openLogin);
closeLogin.addEventListener('click', closeLoginModal);

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm[0].value;
  const password = loginForm[1].value;

  loginMsg.classList.remove('text-red-600', 'text-green-600');

  if(email === "admin@gmail.com" && password === "123456"){
    loginMsg.textContent = "Login Successful ✅";
    loginMsg.classList.add('text-green-600');

    isLoggedIn = true;

    setTimeout(() => {
      closeLoginModal();
      loginForm.reset();
    }, 1000);

  } else {
    loginMsg.textContent = "Invalid Email or Password ❌";
    loginMsg.classList.add('text-red-600');
  }
});

// ================= WARNING =================
const warningPopup = document.getElementById('warningPopup');

function showWarning(){
  warningPopup.classList.remove('hidden');
  warningPopup.classList.add('flex');

  setTimeout(() => {
    warningPopup.classList.add('hidden');
    warningPopup.classList.remove('flex');
  }, 2000);
}

// ================= PACKAGE =================
const packageModal = document.getElementById('packageModal');
const closePackage = document.getElementById('closePackage');

const packageTitle = document.getElementById('packageTitle');
const packageDuration = document.getElementById('packageDuration');
const packagePrice = document.getElementById('packagePrice');
const packageFeatures = document.getElementById('packageFeatures');

const bookButtons = document.querySelectorAll('.bookBtn');

bookButtons.forEach(btn => {
  btn.addEventListener('click', () => {

    if(!isLoggedIn){
      showWarning();
      openLogin();
      return;
    }

    packageTitle.textContent = btn.dataset.title;
    packageDuration.textContent = btn.dataset.duration;
    packagePrice.textContent = btn.dataset.price;

    packageFeatures.innerHTML = "";

    btn.dataset.features.split(',').forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      packageFeatures.appendChild(li);
    });

    packageModal.classList.remove('hidden');
    packageModal.classList.add('flex');
  });
});

closePackage.addEventListener('click', () => {
  packageModal.classList.add('hidden');
  packageModal.classList.remove('flex');
});

// ================= BOOKING FORM =================
const packageBookingForm = document.getElementById('packageBookingForm');

packageBookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputs = packageBookingForm.querySelectorAll('input');

  const bookingData = {
    title: packageTitle.textContent,
    duration: packageDuration.textContent,
    price: packagePrice.textContent,
    name: inputs[0].value,
    phone: inputs[1].value,
    address: inputs[2].value,
    email: inputs[3].value,
    date: inputs[4].value
  };

  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  bookings.push(bookingData);

  localStorage.setItem('bookings', JSON.stringify(bookings));

  alert("Package Booking Confirmed ✅");

  packageBookingForm.reset();

  packageModal.classList.add('hidden');
  packageModal.classList.remove('flex');

  loadBookings();
  updateBookingCount();
});

// ================= DESTINATION =================
const destinationModal = document.getElementById('destinationModal');
const closeDestination = document.getElementById('closeDestination');

const destinationTitle = document.getElementById('destinationTitle');
const destinationList = document.getElementById('destinationList');
const destinationImage = document.getElementById('destinationImage');
const destinationRating = document.getElementById('destinationRating');
const mapLink = document.getElementById('mapLink');
const bookDestinationBtn = document.getElementById('bookDestinationBtn');

const bookingList = document.getElementById('bookingList');

let currentBooking = {};

document.querySelectorAll('.destinationCard').forEach(card => {
  card.addEventListener('click', () => {

    currentBooking = {
      title: card.dataset.title,
      image: card.dataset.image,
      rating: card.dataset.rating
    };

    destinationTitle.textContent = card.dataset.title;
    destinationImage.src = card.dataset.image;
    mapLink.href = card.dataset.map;
    destinationRating.textContent = "⭐ " + card.dataset.rating;

    destinationList.innerHTML = "";
    card.dataset.places.split(',').forEach(place => {
      const li = document.createElement('li');
      li.textContent = place;
      destinationList.appendChild(li);
    });

    destinationModal.classList.remove('hidden');
    destinationModal.classList.add('flex');
  });
});

closeDestination.addEventListener('click', () => {
  destinationModal.classList.add('hidden');
  destinationModal.classList.remove('flex');
});

bookDestinationBtn.addEventListener('click', () => {

  if(!isLoggedIn){
    showWarning();
    openLogin();
    return;
  }

  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  bookings.push({
    ...currentBooking,
    date: new Date().toLocaleString()
  });

  localStorage.setItem('bookings', JSON.stringify(bookings));

  alert("Booking Saved ✅");

  loadBookings();
  updateBookingCount();
});

// ================= LOAD BOOKINGS =================
function loadBookings(){
  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  bookingList.innerHTML = "";

  if(bookings.length === 0){
    bookingList.innerHTML = "<p class='text-center text-gray-500'>No bookings yet</p>";
    return;
  }

  [...bookings].reverse().forEach(b => {
    const div = document.createElement('div');
    div.className = "flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow";

    div.innerHTML = `
      <img src="${b.image}" class="w-20 h-16 object-cover rounded"/>
      <div>
        <h3 class="font-bold">${b.title}</h3>
        <p class="text-sm text-gray-500">⭐ ${b.rating}</p>
        <p class="text-xs text-gray-400">${b.date}</p>
      </div>
    `;

    bookingList.appendChild(div);
  });
}

// ================= FILTER =================
const searchInput = document.getElementById('searchInput');
const districtFilter = document.getElementById('districtFilter');
const budgetFilter = document.getElementById('budgetFilter');

const allCards = document.querySelectorAll('.destinationCard');

function filterDestinations() {
  const searchText = searchInput.value.toLowerCase();
  const selectedDistrict = districtFilter.value;
  const selectedBudget = budgetFilter.value;

  allCards.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const budget = card.dataset.budget;

    const show =
      title.includes(searchText) &&
      (selectedDistrict === "" || card.dataset.title === selectedDistrict) &&
      (selectedBudget === "" || budget === selectedBudget);

    card.style.display = show ? "block" : "none";
  });
}

searchInput.addEventListener('input', filterDestinations);
districtFilter.addEventListener('change', filterDestinations);
budgetFilter.addEventListener('change', filterDestinations);

// ================= BOOKING COUNT =================
const bookingCount = document.getElementById('bookingCount');

function updateBookingCount(){
  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  if(bookings.length > 0){
    bookingCount.textContent = bookings.length;
    bookingCount.classList.remove('hidden');
  } else {
    bookingCount.classList.add('hidden');
  }
}

// ================= SCROLL =================
document.getElementById('historyBtn').addEventListener('click', () => {
  document.getElementById('history').scrollIntoView({ behavior: 'smooth' });
});

// INIT
loadBookings();
updateBookingCount();