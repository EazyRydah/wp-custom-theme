class Search {

  // Constructor
  constructor() {
    
    this.addSearchHTML();
    this.resultsDiv = document.querySelector("#search-overlay__results");
    this.searchOverlay = document.querySelector(".search-overlay");
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
    
    // EventDelegation to listen for Event on multipleElements with sameClass
    this.body.addEventListener("click", this.openOverlay.bind(this));
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

    fetch(universityData.root_url + "/wp-json/university/v1/search?term=" + this.searchField.value)
    .then(res => res.json())
    .then((out) => {
      this.resultsDiv.innerHTML = `
        <div class="row">
          <div class="one-third">
            <h2 class="search-overlay__section-title">General Information</h2>
              ${out.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search.</p>'}
              ${out.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}`: '' }</li>`).join('')}
              ${out.generalInfo.length ? '</ul>' : ''}
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Programs</h2>
              ${out.programs.length ? '<ul class="link-list min-list">' : `<p>No programs match that search. <a href="${universityData.root_url}/programs">View all programs</a></p>`}
              ${out.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
              ${out.programs.length ? '</ul>' : ''}
            <h2 class="search-overlay__section-title">Professors</h2>
              ${out.professors.length ? '<ul class="professor-cards">' : `<p>No professors match that search.</p>`}
              ${out.professors.map(item => `
                <li class="professor-card__list-item">
                  <a class="professor-card" href="${item.permalink}">
                      <img class="professor-card__image" src="${item.image}">
                      <span class="professor-card__name">${item.title}</span>
                  </a>
                </li> 
              `).join('')}
              ${out.professors.length ? '</ul>' : ''}
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
              ${out.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match that search. <a href="${universityData.root_url}/campuses">View all campuses</a></p>`}
              ${out.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
              ${out.campuses.length ? '</ul>' : ''}
            <h2 class="search-overlay__section-title">Events</h2>
              ${out.events.length ? '' : `<p>No events match that search. <a href="${universityData.root_url}/events">View all events</a></p>`}
              ${out.events.map(item => `
                <div class="event-summary">
                  <a class="event-summary__date t-center" href="${item.permalink}">
                  <span class="event-summary__month">${item.month}</span>
                  <span class="event-summary__day">${item.day}</span>  
                  </a>
                <div class="event-summary__content">
                <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
                <p>${item.description}<a href="${item.permalink}" class="nu gray">Learn more</a></p>
                </div>
                </div>
              `).join('')}
          </div>
        </div>
      `;
      this.isSpinnerVisible = false;
    })
    .catch(err => { throw err });

    }

  keyPressDispatcher(e) {

    // Some issues...with textareas and input and overlay
    if (e.keyCode == 83 && ! this.isOverlayOpen && document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA' ) {
 
      this.openOverlay(e);

    }

    if (e.keyCode == 27 && this.isOverlayOpen) {

      this.closeOverlay(e);
      
    }

  }

  // passing event object for event delegation
  openOverlay(e) {
    // needed for event delegation
    if (e.target.parentElement.classList.contains('js-search-trigger') || e.keyCode == 83 ) {

      this.searchOverlay.classList.add("search-overlay--active");
      this.body.classList.add("body-no-scroll");
      this.searchField.value = '';
     
      // Wait for overlay css transition
      setTimeout(() => this.searchField.focus(), 301);
      console.log("our open method just ran!");
      this.isOverlayOpen = true;
      e.preventDefault();

     }

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