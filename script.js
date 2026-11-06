(() => {
  "use strict";
  
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");
  const cover = document.getElementById("frontCover");
  const book = document.getElementById("book");
  const openBtn = document.getElementById("openBookBtn");
  const homeBtn = document.getElementById("homeBtn");
  const pages = document.getElementById("pages");
  const profilePage = document.getElementById("profilePage");
  const turnPages = [...document.querySelectorAll(".turn-page")];
  const pageNavButtons = [...document.querySelectorAll(".page-nav")];
  const mobilePrev = document.getElementById("mobilePrev");
  const mobileNext = document.getElementById("mobileNext");
  const mobilePageLabel = document.getElementById("mobilePageLabel");
  const viewHint = document.getElementById("viewHint");
  const mobileQuery = window.matchMedia("(max-width: 640px)");
  
  const labels = [
    "Cover",
    "Profile",
    "Work Experience",
    "Education",
    "Services",
    "Contact"
  ];
  let mobileIndex = 0;
  let desktopSpread = 0;
  let busy = false;
  let busyTimer = null;
  
  function setTheme(theme) {
    root.dataset.theme = theme;
    themeIcon.className = theme === "dark" ? "bx bx-sun" : "bx bx-moon";
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    try { localStorage.setItem("theme", theme); } catch (_) {}
  }
  setTheme(root.dataset.theme || "dark");
  themeToggle.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));
  
  function isMobile() { return mobileQuery.matches; }
  
  function clearMobileClasses() {
    profilePage.classList.remove("mobile-current");
    turnPages.forEach(page => {
      page.classList.remove("mobile-current", "mobile-show-front", "mobile-show-back");
    });
  }
  
  function renderMobile() {
    if (!isMobile()) {
      clearMobileClasses();
      pages.classList.remove("mobile-active");
      cover.classList.toggle("is-open", mobileIndex !== 0);
      book.classList.toggle("cover-open", mobileIndex !== 0);
      return;
    }
    cover.classList.toggle("is-open", mobileIndex !== 0);
    book.classList.toggle("cover-open", mobileIndex !== 0);
    pages.classList.toggle("mobile-active", mobileIndex !== 0);
    
    profilePage.style.visibility = "";
    profilePage.style.pointerEvents = "";
    turnPages.forEach(page => {
      page.style.visibility = "";
      page.style.pointerEvents = "";
      page.style.zIndex = "";
    });
    clearMobileClasses();
    
    if (mobileIndex === 1) {
      profilePage.classList.add("mobile-current");
    } else if (mobileIndex === 2 || mobileIndex === 3) {
      const page = turnPages[0];
      page.classList.add("mobile-current");
      page.classList.add(mobileIndex === 2 ? "mobile-show-front" : "mobile-show-back");
    } else if (mobileIndex === 4) {
      const page = turnPages[1];
      page.classList.add("mobile-current");
      page.classList.add("mobile-show-front");
    } else if (mobileIndex === 5) {
      const page = turnPages[2];
      page.classList.add("mobile-current");
      page.classList.add("mobile-show-back");
    }
    
    mobilePageLabel.textContent = labels[mobileIndex] || "Portfolio";
    mobilePrev.disabled = mobileIndex === 0;
    mobileNext.disabled = mobileIndex === labels.length - 1;
    viewHint.textContent = "Faruk Hossain’s Portfolio";
  }
  
  function applyDesktopSpread(spread) {
    desktopSpread = Math.max(0, Math.min(3, spread));
    book.dataset.spread = String(desktopSpread);
    
    const contactPage = document.getElementById("turn-3");
    const contactFace = contactPage.querySelector(".page-back");
    const contactContent = contactFace.querySelector(".page-content");
    
    book.classList.toggle("is-final-page", desktopSpread === 3);
    
    turnPages.forEach((page, index) => {
      const pageNumber = index + 1;
      const shouldBeTurned = desktopSpread === 0 ? pageNumber !== 1 :
                             desktopSpread === 1 ? pageNumber !== 2 :
                             desktopSpread === 2 ? pageNumber !== 3 : true;
      const visible = desktopSpread === 3 ? pageNumber === 3 :
                      desktopSpread === 0 ? pageNumber === 1 :
                      desktopSpread === 1 ? pageNumber === 1 || pageNumber === 2 :
                      pageNumber === 2 || pageNumber === 3;
      
      page.classList.toggle("is-turned", shouldBeTurned);
      page.style.zIndex = String(30 + (3 - pageNumber));
      page.style.visibility = visible ? "visible" : "hidden";
      page.style.pointerEvents = visible ? "auto" : "none";
    });
    
    profilePage.style.visibility = desktopSpread === 0 ? "visible" : "hidden";
    profilePage.style.pointerEvents = desktopSpread === 0 ? "auto" : "none";
    
    contactPage.style.left = "";
    contactPage.style.right = "";
    contactPage.style.width = "";
    contactPage.style.transform = "";
    contactPage.style.opacity = "";
    contactPage.style.display = "";
    
    contactFace.style.display = "";
    contactFace.style.position = "";
    contactFace.style.inset = "";
    contactFace.style.transform = "";
    contactFace.style.backfaceVisibility = "";
    contactFace.style.visibility = "";
    contactFace.style.opacity = "";
    
    contactContent.style.visibility = "";
    contactContent.style.opacity = "";
    
    if (desktopSpread === 3) {
      contactPage.style.left = "25%";
      contactPage.style.right = "auto";
      contactPage.style.width = "50%";
      contactPage.style.transform = "none";
      contactPage.style.opacity = "1";
      contactPage.style.display = "block";
      contactPage.style.visibility = "visible";
      contactPage.style.zIndex = "100";
      contactPage.style.pointerEvents = "auto";
      
      contactFace.style.display = "flex";
      contactFace.style.position = "absolute";
      contactFace.style.inset = "0";
      contactFace.style.transform = "none";
      contactFace.style.backfaceVisibility = "visible";
      contactFace.style.visibility = "visible";
      contactFace.style.opacity = "1";
      
      contactContent.style.visibility = "visible";
      contactContent.style.opacity = "1";
    }
  }
  
  function setBusy(value) {
    busy = value;
    pageNavButtons.forEach(button => button.disabled = value);
    if (busyTimer) clearTimeout(busyTimer);
    if (value) busyTimer = setTimeout(() => setBusy(false), 950);
  }
  
  function openBook() {
    if (isMobile()) {
      mobileIndex = 1;
      renderMobile();
      return;
    }
    book.classList.add("cover-open");
    cover.classList.add("is-open");
  }
  
  function closeBook() {
    if (isMobile()) {
      mobileIndex = 0;
      renderMobile();
      return;
    }
    if (busy) return;
    setBusy(true);
    book.classList.remove("is-final-page");
    applyDesktopSpread(0);
    setTimeout(() => {
      cover.classList.remove("is-open");
      book.classList.remove("cover-open");
      setBusy(false);
    }, 850);
  }
  
  openBtn.addEventListener("click", openBook);
  cover.addEventListener("click", event => {
    if (event.target === cover || event.target.classList.contains("cover-decoration")) openBook();
  });
  homeBtn.addEventListener("click", closeBook);
  
  function turnPage(pageId, direction) {
    if (busy || isMobile()) return;
    const targetSpread = direction === "next" ? pageId : pageId - 1;
    if (targetSpread < 0 || targetSpread > 3 || targetSpread === desktopSpread) return;
    setBusy(true);
    applyDesktopSpread(targetSpread);
    setTimeout(() => { setBusy(false); }, 880);
  }
  
  pageNavButtons.forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.turn);
      turnPage(id, button.classList.contains("next") ? "next" : "prev");
    });
  });
  
  function goToContact() {
    if (isMobile()) {
      mobileIndex = 5;
      renderMobile();
      return;
    }
    if (busy) return;
    setBusy(true);
    applyDesktopSpread(3);
    setTimeout(() => setBusy(false), 900);
  }
  
  document.querySelectorAll('[data-goto="5"]').forEach(button => button.addEventListener("click", goToContact));
  
  function changeMobilePage(delta) {
    if (!isMobile()) return;
    mobileIndex = Math.max(0, Math.min(labels.length - 1, mobileIndex + delta));
    renderMobile();
  }
  
  mobilePrev.addEventListener("click", () => changeMobilePage(-1));
  mobileNext.addEventListener("click", () => changeMobilePage(1));
  
  mobileQuery.addEventListener?.("change", () => {
    if (!isMobile()) {
      mobileIndex = 0;
      cover.classList.remove("is-open");
      book.classList.remove("cover-open");
      pages.classList.remove("mobile-active");
      clearMobileClasses();
    } else {
      mobileIndex = cover.classList.contains("is-open") ? 1 : 0;
      renderMobile();
    }
  });
  
  // --- EmailJS Integration Code ---
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formNote = document.getElementById("formNote");

  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    
    // বাটন ডিজেবল ও লোডিং টেক্সট দেখানো
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formNote.textContent = "Please wait, sending your message...";

    // EmailJS প্যারামিটার (আপনার EmailJS Service ID এবং Template ID এখানে বসাতে হবে)
    const serviceID = "service_iovn95p";
    const templateID = "template_htazc19";

    // ফর্মের ডাটা পাঠানো
    emailjs.sendForm(serviceID, templateID, contactForm)
      .then(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Send Message <i class="bx bx-send"></i>`;
        formNote.textContent = "Message sent successfully! I will contact you soon.";
        contactForm.reset();
      }, (error) => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Send Message <i class="bx bx-send"></i>`;
        formNote.textContent = "Failed to send message. Please try again later.";
        console.error("EmailJS Error:", error);
      });
  });
  
  document.addEventListener("keydown", event => {
    if (isMobile() || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Escape") closeBook();
    if (event.key === "ArrowRight" && desktopSpread < 3) turnPage(desktopSpread + 1, "next");
    if (event.key === "ArrowLeft" && desktopSpread > 0) turnPage(desktopSpread, "prev");
  });
  
  applyDesktopSpread(0);
  if (isMobile()) renderMobile();
})();

document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    alert('Link not added yet.');
  });
});
