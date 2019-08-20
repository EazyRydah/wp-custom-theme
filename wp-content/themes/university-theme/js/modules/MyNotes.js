class MyNotes 
{
    // constructor
    constructor() {
        this.events();
    }
    // events
    events () {
        document.body.addEventListener('click', this.eventHandler.bind(this));
    }

    // methods
    eventHandler(e) {

        if (e.target.classList.contains('delete-note')) {
            
            this.deleteNote(e);

        }

        if (e.target.classList.contains('edit-note')) {

            this.editNote(e);
            
        }

        if (e.target.classList.contains('update-note')) {

            this.updateNote(e);
            //console.log("updateNoteClicked");
            
        }


    }

    deleteNote (e)
    {
        
        var thisNote = e.target.parentElement;
        //console.log(e.target.parentElement);

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
        }).catch(err => console.log(`ERROR : ${err}`))

    }

    editNote (e) {

        var thisNote = e.target.parentElement;

        if (thisNote.getAttribute('state') == 'editable') {

            this.makeNoteReadOnly(thisNote);
            // console.log("makeReadOnlyWirdausgeführt!");
            
        } else {
            this.makeNoteEditable(thisNote);
            console.log("makeEditableWirdausgeführt!");
        }
            
    }

    makeNoteEditable(thisNote) {

        // iterate through childElements, 
        for (let element of thisNote.children) {

             // Check for button element and add class, to make it visible
             if (element.classList.contains('edit-note')) {

                element.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> Cancel';
                
            }

            // check for readonly-Attribute, remove it and add class
            if  (element.readOnly) {

                element.readOnly = false;
                element.classList.add('note-active-field');
            
            }

            // Check for button element and add class, to make it visible
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
        }).then(function(response){
            return response.json(); 
        }).then(function(response){
            console.log(`SUCCESS`);
            JSON.stringify(response)
            console.log(thisNote);
        }).catch(err => console.log(`ERROR : ${err}`))

    }
}

export default MyNotes;