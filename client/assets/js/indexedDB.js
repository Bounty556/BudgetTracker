let db;
const request = indexedDB.open('budgetTracker', 1);

request.onupgradeneeded = function(event) {
   // Create our 'pending' database
  const db = event.target.result;
  db.createObjectStore('pending', { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log('Error in indexedDB: ' + event.target.errorCode);
};

function saveRecord(record) {
  // Add record to 'pending' database
  const transaction = db.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore('pending');
  store.add(record);
}

function checkDatabase() {
  // Get all pending objects
  const transaction = db.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore('pending');
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(() => {
        // We're online, so clear all transactions made offline
        const transaction = db.transaction(['pending'], 'readwrite');
        const store = transaction.objectStore('pending');
        store.clear();
      });
    }
  };
}

// When we're connected to the internet, check our database for pending transactions
window.addEventListener('online', checkDatabase);