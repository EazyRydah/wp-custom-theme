class Search {

  // Constructor
  constructor() {

    this.addSearchHTML();
    this.resultsDiv = document.querySelector("#search-overlay__results");
    this.searchOverlay = document.querySelector(".search-overlay");
    this.openButton = document.querySelector(".js-search-trigger");
    this.closeButton = document.querySelector(".search-overlay__close");
    this.searchField = document.querySelector("#search-term");
    this.body = document.body;
    this.events();
    this.isOverlayOpen = false;
    this.isSpinnerVisible = false;
    this.previousValue;
    this.typingTimer;

  }

  // Events
  events() {
   
    this.openButton.addEventListener("click", this.openOverlay.bind(this));
    this.closeButton.addEventListener("click", this.closeOverlay.bind(this));
    document.addEventListener("keydown", this.keyPressDispatcher.bind(this));
    this.searchField.addEventListener("keyup", this.typingLogic.bind(this));


  }

  // Methods 

  typingLogic() {

    if (this.searchField.value != this.previousValue) {

      clearTimeout(this.typingTimer);

      if (this.searchField.value) {

        if ( ! this.isSpinnerVisible) {
          this.resultsDiv.innerHTML = "<div class='spinner-loader'></div>";
          this.isSpinnerVisible = true;
        }

        this.typingTimer = setTimeout(this.getResults.bind(this), 750);

      } else {

        this.resultsDiv.innerHTML = "";
        this.isSpinnerVisible = false;

      }
    }

    this.previousValue = this.searchField.value;

  }

  getResults() {
    
    fetch(universityData.root_url + "/wp-json/wp/v2/posts?search=" + this.searchField.value)
    .then(res => res.json())
    .then((out) => {
      this.resultsDiv.innerHTML = `
        <h2 class="search-overlay__section-title">General Information</h2>
        ${out.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search</p>' }
          ${out.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
        ${out.length ? '</ul>'  : '' }
      `;
      this.isSpinnerVisible = false;
    })
    .catch(err => { throw err });
    

  }

  keyPressDispatcher(e) {

    // Some issues...with textareas and input and overlay
    if (e.keyCode == 83 && ! this.isOverlayOpen && ! document.querySelectorAll("input") == (document.activeElement === document.querySelectorAll("input")) && ! document.querySelectorAll("textarea") == (document.activeElement === document.querySelectorAll("textarea")) ) {
      this.openOverlay();
    }

    if (e.keyCode == 27 && this.isOverlayOpen) {
      this.closeOverlay();
    }

  }

  openOverlay() {

    this.searchOverlay.classList.add("search-overlay--active");
    this.body.classList.add("body-no-scroll");
    this.searchField.value = '';
    // Wait for overlay css transition
    setTimeout(() => this.searchField.focus(), 301);
    console.log("our open method just ran!");
    this.isOverlayOpen = true;

  }

  closeOverlay() {

    this.searchOverlay.classList.remove("search-overlay--active");
    this.body.classList.remove("body-no-scroll");
    console.log("our close method just ran!");
    this.isOverlayOpen = false;

  }

  addSearchHTML() {

    document.body.innerHTML += (`
      
    <div class="search-overlay">
    <div class="search-overlay__top">
      <div class="container">
        <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
        <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
        <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
      </div>
      
    </div>
    <div class="container">
        <div id="search-overlay__results">
          
        </div>
      </div>
    </div>

    `);

  }

}

export default Search;