// ============================================================
// Day 3 - Notes Toolkit
// Practice: arrays of objects, filter/some, building objects,
// and validating input before changing data.
// ============================================================

// ---------- Starting data ----------
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

const CATEGORIES = ["personal", "work", "study"];
const MAX_TEXT = 200;

// Trim, lowercase and squeeze repeated spaces, so that
// "  Call MUM " and "call mum" are treated as the same text.
function normalise(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

// ---------- 1. searchNotes(word) ----------
// Returns every note whose text contains word, ignoring upper/lower case.
function searchNotes(word) {
  const term = normalise(word);
  return notes.filter((note) => note.text.toLowerCase().includes(term));
}

// ---------- 2. longestNote() ----------
// Returns the note with the most characters, or null when there are no notes.
function longestNote() {
  if (notes.length === 0) return null;

  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

// ---------- 3. countByCategory() ----------
// Returns an object that counts the notes in each category.
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    if (counts[note.category]) {
      counts[note.category] += 1;
    } else {
      counts[note.category] = 1;
    }
  }
  return counts;
}

// ---------- 4. getSummary() ----------
// Returns one sentence describing the list, e.g.
// "5 notes: 2 personal, 1 work, 2 study."
function getSummary() {
  const counts = countByCategory();
  const label = notes.length === 1 ? "note" : "notes";

  const parts = [];
  for (const category of CATEGORIES) {
    if (counts[category]) parts.push(`${counts[category]} ${category}`);
  }
  // A category outside the usual three is still reported.
  for (const category of Object.keys(counts)) {
    if (!CATEGORIES.includes(category)) parts.push(`${counts[category]} ${category}`);
  }

  const detail = parts.length ? parts.join(", ") : "none yet";
  return `${notes.length} ${label}: ${detail}.`;
}

// ---------- 5. isDuplicate(text) ----------
// True when a note with the same text already exists
// (case differences and extra spaces are ignored).
function isDuplicate(text) {
  const target = normalise(text);
  return notes.some((note) => normalise(note.text) === target);
}

// ---------- 6. addNote(text, category) ----------
// Adds a note only when the text is 1-200 characters, the text is not a
// duplicate, and the category is personal, work or study.
// Returns true when the note was added, false otherwise (logging the reason).
function addNote(text, category) {
  const cleanText = String(text).trim();

  if (cleanText.length < 1 || cleanText.length > MAX_TEXT) {
    console.log(
      `addNote refused: text must be 1-${MAX_TEXT} characters (got ${cleanText.length}).`
    );
    return false;
  }

  if (!CATEGORIES.includes(category)) {
    console.log(
      `addNote refused: category must be one of ${CATEGORIES.join(
        ", "
      )} (got "${category}").`
    );
    return false;
  }

  if (isDuplicate(cleanText)) {
    console.log(`addNote refused: "${cleanText}" is already in the list.`);
    return false;
  }

  const nextId = notes.length
    ? Math.max(...notes.map((note) => note.id)) + 1
    : 1;
  notes.push({ id: nextId, text: cleanText, category });
  console.log(
    `addNote added: { id: ${nextId}, text: "${cleanText}", category: "${category}" }`
  );
  return true;
}

// ============================================================
// Tests - each function is checked with a normal case and an edge case.
// ============================================================

// Keep a copy of the original list so the tests that empty it can put it back.
const backup = notes;

console.log("===== searchNotes =====");
console.log(searchNotes("milk"));
// Expected: [ { id: 1, text: 'Buy milk and bread', category: 'personal' } ]
console.log(searchNotes("THE"));
// Expected: [ { id: 2, ... 'Finish the Day 3 assignment' ... }, { id: 3, ... 'Email the project report to Grace' ... } ] (upper case still matches)
console.log(searchNotes("gym"));
// Expected: [] (no results)

console.log("===== longestNote =====");
console.log(longestNote());
// Expected: { id: 3, text: 'Email the project report to Grace', category: 'work' }
notes = [];
console.log(longestNote());
// Expected: null (the list is empty)
notes = backup;

console.log("===== countByCategory =====");
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }
notes = [];
console.log(countByCategory());
// Expected: {} (nothing to count)
notes = backup;

console.log("===== getSummary =====");
console.log(getSummary());
// Expected: 5 notes: 2 personal, 1 work, 2 study.
notes = [{ id: 1, text: "Book the hall", category: "work" }];
console.log(getSummary());
// Expected: 1 note: 1 work. (singular "note")
notes = backup;

console.log("===== isDuplicate =====");
console.log(isDuplicate("call MUM"));
// Expected: true (case ignored)
console.log(isDuplicate("   buy   milk   and   bread   "));
// Expected: true (extra spaces ignored)
console.log(isDuplicate("water the plants"));
// Expected: false (no such note yet)

console.log("===== addNote =====");
console.log(addNote("Pay the electricity bill", "personal"));
// Expected: true, plus log: addNote added: { id: 6, text: "Pay the electricity bill", category: "personal" }
console.log(addNote("buy   milk   and   bread", "personal"));
// Expected: false, plus log: addNote refused: "buy   milk   and   bread" is already in the list.
console.log(addNote("   ", "study"));
// Expected: false, plus log: addNote refused: text must be 1-200 characters (got 0).
console.log(addNote("Read chapter 4", "fun"));
// Expected: false, plus log: addNote refused: category must be one of personal, work, study (got "fun").
console.log(addNote("x".repeat(201), "study"));
// Expected: false, plus log: addNote refused: text must be 1-200 characters (got 201).
console.log(getSummary());
// Expected: 6 notes: 3 personal, 1 work, 2 study.
