const $addToppingBtn = document.querySelector("#add-topping");
const $pizzaForm = document.querySelector("#pizza-form");
const $customToppingsList = document.querySelector("#custom-toppings-list");

const handleAddTopping = (event) => {
  event.preventDefault();

  const toppingValue = document.querySelector("#new-topping").value;

  if (!toppingValue) {
    return false;
  }

  const checkbox = document.createElement("input"); //this will be the checkbox element that will be added to the list of toppings
  //then we will create a label for the checkbox and append it to the list of toppings
  checkbox.type = "checkbox";
  checkbox.name = "topping";
  checkbox.value = toppingValue;
  checkbox.id = toppingValue
    .toLowerCase() //this is the only way to make the checkbox unique in the DOM (otherwise it will be overwritten)
    .split(" ") // split the string into an array of words (e.g. "Pepperoni" => ["Pepperoni"]) and then join them with an underscore (e.g. ["Pepperoni"] => "Pepperoni")
    .join("-"); // join the array of words with a hyphen (e.g. ["Pepperoni"] => "Pepperoni") to make it a valid ID (e.g. "Pepperoni")

  const label = document.createElement("label"); //this will be the label for the checkbox element that will be added to the list of toppings
  label.textContent = toppingValue; //this will be the text that will be displayed next to the checkbox
  label.htmlFor = toppingValue.toLowerCase().split(" ").join("-"); //this will be the value of the checkbox (e.g. "Pepperoni")

  const divWrapper = document.createElement("div");

  divWrapper.appendChild(checkbox);
  divWrapper.appendChild(label);
  $customToppingsList.appendChild(divWrapper);

  toppingValue.value = "";
};

const handlePizzaSubmit = (event) => {
  //essentially the same as handleAddTopping, but for the submit button
  // it will prevent the default behavior of the submit button (which is to submit the form)
  event.preventDefault();

  const pizzaName = $pizzaForm.querySelector("#pizza-name").value;
  const createdBy = $pizzaForm.querySelector("#created-by").value;
  const size = $pizzaForm.querySelector("#pizza-size").value;
  const toppings = [
    ...$pizzaForm.querySelectorAll("[name=topping]:checked"),
  ].map((topping) => {
    return topping.value;
  });

  if (!pizzaName || !createdBy || !toppings.length) {
    //essentially, if any of the fields are empty, then we will return false
    //this will prevent the form from submitting and the page from reloading (which would be the default behavior)
    return;
  }

  const formData = { pizzaName, createdBy, size, toppings };

  fetch("/api/pizzas", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((postResponse) => {
      alert("Pizza created successfully!");
      console.log(postResponse);
    })
    .catch((err) => {
      console.log(err);
      saveRecord(formData);
    });
};

$pizzaForm.addEventListener("submit", handlePizzaSubmit);
$addToppingBtn.addEventListener("click", handleAddTopping);
