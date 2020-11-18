const pokemonList = document.querySelector(".pokemon-list");
const buttons = document.querySelectorAll(".pagination button");
const page = document.querySelectorAll(".page");
let currentGen = 0;

const generations = [
    [1, 100],
    [101, 200],
    [201, 300],
    [301, 400],
    [401, 500],
    [501, 600],
    [601, 700],
];

async function getPokemons(pokemonStartID, pokemonEndID) {
    // Adding the loader
    pokemonList.innerHTML = `<span class="loader"></span>`;

    // Clicking Restricting (buttons)
    buttons.forEach((el) => {
        el.classList.add("restrict-click");
    });

    // Fetching all pokemons
    const responses = [];
    for (let id = pokemonStartID; id <= pokemonEndID; id++) {
        const resp = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        responses.push(resp);
    }
    const proms = await Promise.all(responses);
    const promises = await Promise.all(proms.map((el) => el.json()));

    // Removing the loader
    pokemonList.innerHTML = "";

    // Adding pokemons
    promises.forEach((el, ind) => {
        const pokemonName = el.name;
        const pokemonTypes = [];
        const pokemonAbilities = [];
        el.types.forEach((item) => {
            pokemonTypes.push(item.type.name);
        });
        el.abilities.forEach((item) => {
            pokemonAbilities.push(item.ability.name);
        });
        const imageURL = el.sprites.other["official-artwork"].front_default;
        pokemonList.innerHTML += `
            <div class="pc-container">
                <div class="pokemon-card">
                    <div class="card_front">
                        <img src=${imageURL}></img>
                        <div class="square"></div>
                        <h5 class="id"> #${el.id} </h5>
                        <h5 class="name"> ${pokemonName.replace(/\w/, (ch) => ch.toUpperCase())} </h5>
                        <div class="ability">Abilities: ${pokemonAbilities.join(" / ").replace(/\b\w/g, (ch) => ch.toUpperCase())} </div>
                    </div>
                    <div class="card_back">
                        <img src=${imageURL}></img>
                        <div class="status">Type: ${pokemonTypes.join(" / ").replace(/\b\w/g, (ch) => ch.toUpperCase())} </div>
                        <div class="status">HP: ${el.stats[0].base_stat}</div>
                        <div class="status">Attack: ${el.stats[1].base_stat}</div>
                        <div class="status">Defense: ${el.stats[2].base_stat}</div>
                        <div class="status">Special-Attack: ${el.stats[3].base_stat}</div>
                        <div class="status">Special-Defense: ${el.stats[4].base_stat}</div>
                        <div class="status">Speed: ${el.stats[5].base_stat}</div>
                    <div>
                </div>
            </div>
		`;
    });

    // Enabling Clicking on Buttons
    setTimeout(() => {
        buttons.forEach((el) => {
            el.classList.remove("restrict-click");
        });
    }, 500);

    search();
}

// Listening to the research
function search() {
    const pokemons = document.querySelectorAll(".pokemon-card .name");
    const searchBox = document.querySelector(".search-box");

    searchBox.addEventListener("keyup", (e) => {
        const inp = searchBox.value.toLowerCase();

        pokemons.forEach((pokemon) => {
            const name = pokemon.textContent.toLowerCase();
            if (name.indexOf(inp) !== -1) {
                pokemon.parentElement.parentElement.parentElement.style.display = "flex";
            } else {
                pokemon.parentElement.parentElement.parentElement.style.display = "none";
            }
        });
    });
}

// Buttons (Left and Right)
buttons.forEach((el) => {
    el.addEventListener("click", (e) => {
        const searchBox = document.querySelector(".search-box");
        if (searchBox) {
            searchBox.value = "";
        }
        if (e.target.id === "page-right" && !e.target.classList.contains("restrict-click")) {
            page[currentGen].classList.remove("page-current");
            currentGen = (currentGen + 1) % generations.length;
            page[currentGen].classList.add("page-current");
            getPokemons(generations[currentGen][0], generations[currentGen][1]);
        } else if (e.target.id === "page-left" && !e.target.classList.contains("restrict-click")) {
            page[currentGen].classList.remove("page-current");
            currentGen = (currentGen - 1 + generations.length) % generations.length;
            page[currentGen].classList.add("page-current");
            getPokemons(generations[currentGen][0], generations[currentGen][1]);
        }
    });
});

// Pagination
page.forEach((el) => {
    el.addEventListener("click", (e) => {
        const searchBox = document.querySelector(".search-box");
        if (searchBox) {
            searchBox.value = "";
        }
        if (!buttons[0].classList.contains("restrict-click")) {
            page[currentGen].classList.remove("page-current");
            currentGen = el.textContent - 1;
            page[currentGen].classList.add("page-current");
            getPokemons(generations[currentGen][0], generations[currentGen][1]);
        }
    });
});

getPokemons(generations[0][0], generations[0][1]);