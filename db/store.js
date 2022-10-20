
const util = require('util');
const fs = require('fs');
// Our unique ids will be made with this package. 
const uuid = require('uuid');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


class Store {
    read() {
      return readFileAsync('db/db.json', 'utf-8');
  }

  write(note) {
      return writeFileAsync('db/db.json', JSON.stringify(note));
  }


  getNotes() {
    return this.read().then((note) => {
      let parsedNotes;

      // If notes isn't an array or can't be changed into one, send back a new empty array.
      try {
        parsedNotes = [].concat(JSON.parse(note));
      } catch (err) {
        parsedNotes = [];
      }

      return parsedNotes;
    });
  }

  addNote(note) {
    const { title, text } = note;

    if (!title || !text) {
      throw new Error("Enter Text Please");
    }

    // Use the uuid package to give the note a unique id.
    const newNote = { title, text, id: uuid.v4() };

    // Get all the notes, add the new one, update all the notes, and give back the newNote.
    return this.getNotes()
      .then((notes) => [...notes, newNote])
      .then((updatedNotes) => this.write(updatedNotes))
      .then(() => newNote);
  }

  removeNote(id) {
    // Get all the notes, delete the one with the given id, and write the notes that were left.
    return this.getNotes()
      .then((notes) => notes.filter((note) => note.id !== id))
      .then((filteredNotes) => this.write(filteredNotes));
  }
}

module.exports = new Store();
