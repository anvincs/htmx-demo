import express from "express";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handle GET requests to /users route
app.get("/users", async (req, res) => {
  const limit = req.query.limit || 10;
  // we can apply the limit manually if we want
  // jsonplaceholder supports a query param for limiting the response
  // therefore we can use that instead

  //   const users = [
  //     { id: 1, name: "John", age: 20 },
  //     { id: 2, name: "Bob", age: 21 },
  //     { id: 3, name: "Jack", age: 22 },
  //   ];

  // setTimeout is used here to simulate a delay in the response inorder to see the loader in action using the hx-target attribute
  setTimeout(async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?_limit=${limit}}`
    );
    const users = await response.json();

    res.send(`
        <h1 class="text-2xl font-bold my-4">Users</h1>
        ${users.map((user) => `<li>${user.name}</li>`).join("")}
    `);
  }, 2000);
});

// Handle POST requests to /convert route for temperature conversion
app.post("/convert", (req, res) => {
  setTimeout(() => {
    const fahrenheit = parseFloat(req.body.fahrenheit); //(req.body.'name' of the input field)
    const celsius = (fahrenheit - 32) * (5 / 9);

    res.send(`
    <p>
        ${fahrenheit}°F = ${celsius.toFixed(2)}°C
    </p>
    `);
  }, 1000);
});

let counter = 0;
// Handle GET requests to /poll route for polling example
app.get("/poll", (req, res) => {
  counter++;
  const data = { value: counter };

  res.json(data);
});

let currentTemperture = 25;
// Handle GET request for weather data
app.get("/get-temperature", (req, res) => {
  currentTemperture += Math.random() * 2 - 1;
  res.send(currentTemperture.toFixed(2) + "°C");
});

const contacts = [
  { name: "John", email: "john@email.com" },
  { name: "Jane", email: "jane@email.com" },
  { name: "Jack", email: "jack@email.com" },
  { name: "Bob", email: "bob@email.com" },
  { name: "David", email: "david@email.com" },
  { name: "Mary", email: "mary@email.com" },
  { name: "Alice", email: "alice@email.com" },
  { name: "Jacob", email: "jacob@email.com" },
  { name: "Paul", email: "paul@email.com" },
];

// Handle POST request for contacts search
app.post("/search", (req, res) => {
  const searchTerm = req.body.search.toLowerCase();
  // search is the name of the input field

  if (!searchTerm) {
    return res.send("<tr></tr>");
  }

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  setTimeout(() => {
    const searchResultsHTML = searchResults
      .map(
        (contact) => `
    <tr>
      <td><div class="my-4 p-2">${contact.name}</div></td>
      <td><div class="my-4 p-2">${contact.email}</div></td>
    </tr>
    `
      )
      .join("");

    res.send(searchResultsHTML);
  }, 2000);
});

// Handle POST request for contacts search from jsonplaceholder
app.post("/search/api", async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();
  // search is the name of the input field

  if (!searchTerm) {
    return res.send("<tr></tr>");
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users}`);
  const contacts = await response.json();

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  setTimeout(() => {
    const searchResultsHTML = searchResults
      .map(
        (contact) => `
    <tr>
      <td><div class="my-4 p-2">${contact.name}</div></td>
      <td><div class="my-4 p-2">${contact.email}</div></td>
    </tr>
    `
      )
      .join("");

    res.send(searchResultsHTML);
  }, 2000);
});

// Handle POST request for email validation
app.post("/contact/email", (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const isValid = {
    message: "Email is valid",
    class: "text-green-700",
  };

  const isInvalid = {
    message: "Please enter a valid email address",
    class: "text-red-700",
  };

  if (!emailRegex.test(submittedEmail)) {
    return res.send(`
    <div
        class="mb-4"
        hx-target="this"
        hx-swap="outerHTML"
      >
        <label
          for="email"
          class="block text-gray-700 text-sm font-bold mb-2"
          >Email Address</label
        >
        <input
          type="email"
          id="email"
          name="email"
          hx-post="/contact/email"
          class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          value="${submittedEmail}"
          required
        />
        <div class="${isInvalid.class}">${isInvalid.message}</div>
      </div>
    `);
  } else {
    return res.send(`
    <div
        class="mb-4"
        hx-target="this"
        hx-swap="outerHTML"
      >
        <label
          for="email"
          class="block text-gray-700 text-sm font-bold mb-2"
          >Email Address</label
        >
        <input
          type="email"
          id="email"
          name="email"
          hx-post="/contact/email"
          class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          value="${submittedEmail}"
          required
        />
        <div class="${isValid.class}">${isValid.message}</div>
      </div>
    `);
  }
});

// Start the server
app.listen(3000, () => console.log("Server listening on port 3000"));
