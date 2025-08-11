import '../styles/style.css';
import { getPokemonData, getPokemonDataForType } from './modules/HttpRequest';
import { extractData, showData } from './modules/PokemonData';

const getInputData = (e) => {
    const form = new FormData(e.target);
    let pokeData;
    if(form.has('pokeName') && form.get('pokeName').trim() !== ''){
        pokeData = form.get('pokeName').toLowerCase();
    }else if(form.has('pokeType') && form.get('pokeType').trim() !== ''){
        pokeData = form.get('pokeType').toLowerCase();
    }else if(form.has('pokeId') && form.get('pokeId').trim() !== ''){
        pokeData = form.get('pokeId').toLowerCase();
    }
    return pokeData;
};

const submitHandler = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const inputData = getInputData(e);
    let pokemonData;
    if(form.has('pokeType') && form.get('pokeType').trim() !== ''){
        pokemonData = await getPokemonDataForType(inputData);
    }else{
        pokemonData = await getPokemonData(inputData);
    }
    const extractedData = extractData(pokemonData);
    showData(extractedData);
};

document.querySelector('#js-form').addEventListener('submit', (e) => submitHandler(e));
