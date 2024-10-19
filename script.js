// script.js

// Function to handle promo code validation and discount calculation
function applyPromoCode() {
  var promoCodeInput = document.getElementById("promoCode").value;
  var originalPrice = 2500;  // Assuming system price is R2500
  var discount = 0;

  // Sample promo codes and corresponding discounts
  var promoCodes = {
    "STINGRAY10": 10,   // 10% discount
    "STINGRAY20": 20,   // 20% discount
    "STINGRAY30": 30,   // 30% discount
    "STINGRAY40": 40,   // 40% discount
    "STINGRAY50": 50    // 50% discount
  };

  if (promoCodes[promoCodeInput]) {
    discount = promoCodes[promoCodeInput];
    var discountedPrice = originalPrice - (originalPrice * discount / 100);
    document.getElementById("discountMessage").innerHTML = `Promo code applied! You get a ${discount}% discount. Your total is R${discountedPrice}.`;
    document.getElementById("discountMessage").style.color = "green";
  } else {
    document.getElementById("discountMessage").innerHTML = "Invalid promo code. Please try again.";
    document.getElementById("discountMessage").style.color = "red";
  }
}

// Function to validate contact form inputs
function validateContactForm() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;
  var errorMessage = "";

  if (name === "" || email === "" || message === "") {
    errorMessage = "Please fill out all fields.";
  } else if (!validateEmail(email)) {
    errorMessage = "Please enter a valid email address.";
  }

  if (errorMessage) {
    document.getElementById("contactError").innerHTML = errorMessage;
    document.getElementById("contactError").style.color = "red";
    return false;
  } else {
    document.getElementById("contactError").innerHTML = "Form submitted successfully!";
    document.getElementById("contactError").style.color = "green";
    return true;
  }
}

// Helper function to validate email format
function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Navigation active link highlight
function setActiveLink() {
  var currentLocation = window.location.href;
  var menuItems = document.querySelectorAll('nav ul li a');
  menuItems.forEach(function(item) {
    if (item.href === currentLocation) {
      item.classList.add('active');
    }
  });
}

// Function to dynamically display pricing details or pop-ups
function togglePricingDetails() {
  var details = document.getElementById("pricingDetails");
  if (details.style.display === "none" || details.style.display === "") {
    details.style.display = "block";
  } else {
    details.style.display = "none";
  }
}

// Call setActiveLink to highlight the current page in the nav bar
window.onload = function() {
  setActiveLink();
}
