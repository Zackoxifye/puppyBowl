const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

const cohortName = "2308-FTB-MT-WEB-PT";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;
const cohortPlayersAPI = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(cohortPlayersAPI);
    const responseData = await response.json();
    const allPlayers = responseData.data.players;
    console.log("From fetchAllPlayers 2: ", allPlayers);
    return allPlayers;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${cohortPlayersAPI}/${playerId}`);
    const responseData = await response.json();
    const player = responseData;
    console.log("From fetch SinglePlayer 1:", player);
    return player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(cohortPlayersAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });

    const newPlayer = await response.json();
    console.log("New Player Added:", newPlayer);

    const allPlayers = await fetchAllPlayers();
    renderAllPlayers(allPlayers);
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${cohortPlayersAPI}/${playerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Check if the deletion was successful
    if (response.ok) {
      console.log(`Player with ID ${playerId} deleted successfully.`);
      window.location.reload();
    } else {
      console.error(`Failed to delete player with ID ${playerId}.`);
    }
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
  try {
    playerList.forEach((player) => {
      const newCard = document.createElement("div");
      newCard.classList.add("playerCard");

      const newImg = document.createElement("img");
      newImg.setAttribute("src", player.imageUrl);
      const newParagraph = document.createElement("p");
      newParagraph.innerText = `
            Name: ${player.name}
            Breed: ${player.breed}
            Status: ${player.status}
            `;

      // details button
      const detailsButton = document.createElement("button");
      detailsButton.addEventListener("click", async (event) => {
        const playerId = event.target.dataset.id;
        const playerDetails = await fetchSinglePlayer(player.id);
        console.log("Player Details: ", playerDetails);
        renderSinglePlayer(playerDetails.data.player);
      });

      // remove button
      const removeButton = document.createElement("button");
      removeButton.addEventListener("click", async (event) => {
        const playerId = event.target.dataset.id;
        await removePlayer(player.id);
      });

      detailsButton.innerText = "See Details";
      removeButton.innerText = "Remove Player";

      newCard.appendChild(newParagraph);
      newCard.appendChild(newImg);
      newCard.appendChild(detailsButton);
      newCard.appendChild(removeButton);
      playerContainer.appendChild(newCard);
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

const renderSinglePlayer = (player) => {
  const Modal = document.createElement("div");
  Modal.classList.add("playerModal");
  document.body.appendChild(Modal);
  Modal.style.display = "block";
  const newCard = document.createElement("div");
  newCard.classList.add("playerCard");
  newCard.style.opacity = 1;
  const newImg = document.createElement("img");
  newImg.setAttribute("src", player.imageUrl);
  newImg.style.backgroundColor = "white";
  const newParagraph = document.createElement("p");
  newParagraph.innerText = `
            Name: ${player.name}
            Breed: ${player.breed}
            Status: ${player.status}
        `;
  newCard.appendChild(newParagraph);
  newCard.appendChild(newImg);
  Modal.appendChild(newCard);
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    const formHTML = `
        <form id="new-player-form">
            <label for="name">Name:</label>
            <input type="text" id="nameInput" name="name" required>

            <label for="breed">Breed:</label>
            <input type="text" id="breedInput" name="breed" required>

            <label for="status">Status:</label>
            <input type="text" id="statusInput" name="status" required>

            <button type="submit">Add Player</button>
        </form>
    `;

    newPlayerFormContainer.innerHTML = formHTML;

    const form = document.getElementById("new-player-form");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const newPuppy = {
        name: nameText,
        breed: breedText,
        status: statusText,
        imageUrl:
          "https://learndotresources.s3.amazonaws.com/workshop/60ad725bbe74cd0004a6cba0/puppybowl-default-dog.png",
      };
      console.log(newPuppy);
      const result = await addPuppy(newPuppy);
      if (result.success) {
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
        window.location.reload();
      }
    });

    nameInput.addEventListener("input", function (e) {
      nameText = e.target.value;
      console.log(nameText);
    });

    breedInput.addEventListener("input", function (e) {
      breedText = e.target.value;
      console.log(breedText);
    });

    statusInput.addEventListener("input", function (e) {
      statusText = e.target.value;
      console.log(statusText);
    });

    async function addPuppy(post) {
      try {
        const res = await fetch(cohortPlayersAPI, {
          method: "POST",
          body: JSON.stringify(post),
          headers: { "Content-type": "application/json" },
        });
        const json = await res.json();
        console.log(json);
        return json;
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

init();
