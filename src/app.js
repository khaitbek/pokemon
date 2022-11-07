const pokemonList = document.querySelector("#pokemonList")
// loop through pokemons
const pokemonTemplate = document.querySelector("[data-pokemon]").content
const pokeFragment = new DocumentFragment()
const pokemonForm = document.querySelector("#pokemonForm")
const pokemonInput = pokemonForm.querySelector("#pokemonSearch")
const categorySelect = document.querySelector("#pokemonSelect")

// functions

function renderPokemons(pokemons,list){
    list.innerHTML = ""
    pokemons.forEach(pokemon => {
        // select DOM elements
        const pokeTemplateClone = pokemonTemplate.cloneNode(true).children[0]
        const { name, img, type, num, spawn_time } = pokemon;
        pokeTemplateClone.querySelector("#pokemonName").textContent = name
        pokeTemplateClone.querySelector("#pokemonImg").src = img
        const pokemonType = pokeTemplateClone.querySelector("#pokemonType")
        pokeTemplateClone.querySelector("#pokemonNum").textContent =  num
        pokeTemplateClone.querySelector("#pokemonTime").textContent = spawn_time
        
        pokeFragment.appendChild(pokeTemplateClone)
    })
    pokemonList.append(pokeFragment)
}

function getCategories(pokemons){
    const categories = pokemons.reduce((previousItem,current) => {
        current.weaknesses.forEach(weakness => {
            if(!previousItem.includes(weakness)){
                previousItem.push(weakness)
            }
        })
        return previousItem
    },[])
    return renderCategories(categories,categorySelect)
}

function renderCategories(categories,categoryList){
    const categoryFragment = new DocumentFragment()
    categories.map(category => {
        const newCategoryItem = document.createElement("option")
        newCategoryItem.textContent = category
        newCategoryItem.value = category
        categoryFragment.append(newCategoryItem)
    })
    categoryList.append(categoryFragment)
}

function filterPokemons(searchString,category){
    const filteredPokemons = pokemons.filter(pokemon => {
        return pokemon.name.match(new RegExp(searchString,"gi")) && (category === "all" || pokemon.weaknesses.includes(category))
    })
    renderPokemons(filteredPokemons,pokemonList)
}

const updateInputText = debounce(text => {
    filterPokemons(text,categorySelect.value)
})

function debounce(cb,delay = 1000){
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            cb(...args)
        },delay)
    }
}

// events
pokemonForm.addEventListener("submit", e => {
    e.preventDefault()
    filterPokemons(pokemonInput.value,categorySelect.value)
})
pokemonInput.addEventListener("input",e => {
    updateInputText(e.target.value)
})

// function calls
renderPokemons(pokemons,pokemonList)
getCategories(pokemons)