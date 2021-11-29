//create let to hold db connection
let db;
//establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open("pizza_hunt", 1);

//this evern will emit if the db version changes (nonexistant to version 1, v1 to v2, etc)
request.onupgradeneeded = function (event) {
  //save a reference to the db
  const db = event.target.result;
  //create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

//upon a successful connection, this event will emit
request.onsuccess = function (event) {
  //save a reference to the db
  db = event.target.result;

  //check if app is online, if it is, call the `sendPizza` function
  if (navigator.onLine) {
    //uploadPizza();
  }
};

request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
};

// This function will be exe if we attempt to submit a new pizza and thers no internet connection
function saveRecord(record) {
  //open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new_pizza"], "readwrite");

  //accessed the `new_pizza` object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  //add the record to the object store
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  //open a transaction on the `new_pizza` object store with read & write permissions
  const transaction = db.transaction(["new_pizza"], "readwrite");

  //access the `new_pizza` object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  //get all records from the object store
  const getAll = pizzaObjectStore.getAll();

  // upon a successful .getAll() execution, run this function
  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(["new_pizza"], "readwrite");
          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore("new_pizza");
          // clear all items in your store
          pizzaObjectStore.clear();

          alert("All saved pizza has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

//listen for app coming back online
window.addEventListener("online", uploadPizza);
