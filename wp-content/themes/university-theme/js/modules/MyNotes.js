class MyNotes 
{
    // CONSTRUCTOR
    constructor() {
        this.submitNoteButton = document.querySelector('.submit-note');

        this.events();
    }
    // EVENTS
    events () {

        document.body.addEventListener('click', this.eventHandler.bind(this));
        this.submitNoteButton.addEventListener('click', this.createNote.bind(this));
    }

    // METHODS
    eventHandler(e) {

        if (e.target.classList.contains('delete-note')) {
            
            this.deleteNote(e);

        }

        if (e.target.classList.contains('edit-note')) {

            this.editNote(e);
            
        }

        if (e.target.classList.contains('update-note')) {

            this.updateNote(e);
            
        }

    }

    deleteNote (e)
    {
        
        var thisNote = e.target.parentElement;

        fetch(`${universityData.root_url}/wp-json/wp/v2/note/${thisNote.dataset.id}`, {
            headers: {
                'X-WP-Nonce' : universityData.nonce
            },
            credentials: 'same-origin',
            method: 'DELETE' 
        }).then(function(response){
            return response.json(); 
        }).then(function(response){
            thisNote.remove();
            console.log(`SUCCESS`);
            if (response.userNoteCount < 6) {
                document.querySelector('.note-limit-message').classList.remove('active');
            } 

        }).catch(err => console.log(`ERROR : ${err}`))

    }

    editNote (e) {

        var thisNote = e.target.parentElement;

        if (thisNote.getAttribute('state') == 'editable') {

            this.makeNoteReadOnly(thisNote);

        } else {

            this.makeNoteEditable(thisNote);

        }
            
    }

    makeNoteEditable(thisNote) {

        for (let element of thisNote.children) {

             if (element.classList.contains('edit-note')) {

                element.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> Cancel';
                
            }

            if  (element.readOnly) {

                element.readOnly = false;
                element.classList.add('note-active-field');
            
            }

            if (element.classList.contains('update-note')) {

                element.classList.add('update-note--visible');

            }

        }

        thisNote.setAttribute('state', 'editable');
    }

    makeNoteReadOnly(thisNote) {

        // iterate through childElements, 
        for (let element of thisNote.children) {

             // Check for button element and add class, to make it visible
             if (element.classList.contains('edit-note')) {

                element.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i> Edit';
                
            }

            // check for readonly-Attribute, remove it and add class
            if  (element.classList.contains('note-active-field')) {

                element.readOnly = true;
                element.classList.remove('note-active-field');
            
            }

            // Check for button element and add class, to make it visible
            if (element.classList.contains('update-note--visible')) {

                element.classList.remove('update-note--visible');

            }

        }
        // console.log("HalloFromMakeNotReadOnly");
        thisNote.removeAttribute('state', 'editable');
    }

    updateNote (e)
    {
        
        var thisNote = e.target.parentElement;
        var thisNoteTitle;
        var thisNoteContent;

        // iterate through thisNode and get title and content field

        for (let element of thisNote.children) {

            if (element.classList.contains('note-title-field')) {

                thisNoteTitle = element.value;                

            }

            if (element.classList.contains('note-body-field')) {

                thisNoteContent = element.value;          
 
            }

       }

        // wp-api needs this specific fieldnames!
        var ourUpdatedPost = {
            'title': thisNoteTitle,
            'content': thisNoteContent
        }

        fetch(`${universityData.root_url}/wp-json/wp/v2/note/${thisNote.dataset.id}`, {
            headers: {
                'X-WP-Nonce' : universityData.nonce,
                'Content-Type' : 'application/json'
            },
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify(ourUpdatedPost), // data can be `string` or {object}!
        }).then(response => {
            return response.json(); 
        }).then(response => {
            console.log(`SUCCESS`);
            JSON.stringify(response)
            this.makeNoteReadOnly(thisNote);
            // console.log(thisNote);
        }).catch(err => console.log(`ERROR : ${err}`))

    }

    createNote (e)
    {
      
        var newPostTitleInput = document.querySelector('.new-note-title');
        var newPostContentTextarea = document.querySelector('.new-note-body');
        var notesUnordneredList = document.querySelector('#my-notes');
        var newPostListItem = document.createElement('li');

        // wp-api needs this specific fieldnames!
        var ourNewPost = {
            'title': newPostTitleInput.value,
            'content': newPostContentTextarea.value,
            'status' : 'publish'
        }

        fetch(`${universityData.root_url}/wp-json/wp/v2/note/`, {
            headers: {
                'X-WP-Nonce' : universityData.nonce,
                'Content-Type' : 'application/json',
                'Charset' : 'UTF-8'
            },
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify(ourNewPost), // data can be `string` or {object}!
        }).then(response => {
 
           return response.json(); 

        }).then(data => {

            if (data.responseText == 'You have reached your note limit.') {

                document.querySelector('.note-limit-message').classList.add('active');
                
            }

           
           
        
            console.log(`SUCCESS`);
            console.log(data);
            
            newPostTitleInput.value = '';
            newPostContentTextarea.value = '';

            newPostListItem.innerHTML = `
                <li data-id="${data.id}">
                    <input readonly class="note-title-field" value="${data.title.raw}">
                    <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                    <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
                    <textarea readonly class="note-body-field">${data.content.raw}</textarea>
                    <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
                </li>
            `;

            notesUnordneredList.prepend(newPostListItem);


        }).catch(err => {
            
            console.log(`ERROR`);

            console.log(err);
            
           
        })

    }
}

export default MyNotes;