import '../styles/style.css';
import { getPokemonData, getPokemonDataForType } from './modules/HttpRequest';
import { extractData, showData } from './modules/PokemonData';

const inputs = document.querySelectorAll('input[type="text"]');

document.querySelector('#js-form').addEventListener('submit', () => {
    inputs.forEach(i => i.disabled = false);
});

inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim() !== "") {
            // 他の入力欄を無効化
            inputs.forEach(other => {
                if (other !== input) {
                    other.disabled = true;
                }
            });
        } else {
            // すべて有効化（全て空なら）
            if ([...inputs].every(i => i.value.trim() === "")) {
                inputs.forEach(i => i.disabled = false);
            }
        }
    });
});

const getInputData = (e) => {
    const form = new FormData(e.target);
    let pokeData = null;
    if (form.has('pokeName') && form.get('pokeName').trim() !== '') {
        pokeData = form.get('pokeName').toLowerCase().trim();
    } else if (form.has('pokeType') && form.get('pokeType').trim() !== '') {
        pokeData = form.get('pokeType').toLowerCase().trim();
    } else if (form.has('pokeId') && form.get('pokeId').trim() !== '') {
        pokeData = form.get('pokeId').toLowerCase().trim();
    }
    // formの値を取得後、値をクリア
    e.target.reset();
    return pokeData;
};

const submitHandler = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const inputData = getInputData(e);
    const resultTarget = document.querySelector('#js-result');

    if (!inputData) {
        alert('検索ワードを入力してください');
        return;
    }

    // 読込表示
    if (resultTarget) resultTarget.innerHTML = '<p>Loading...</p>';

    let pokemonData = null;
    if (form.has('pokeType') && form.get('pokeType').trim() !== '') {
        pokemonData = await getPokemonDataForType(inputData);
    } else {
        pokemonData = await getPokemonData(inputData);
    }

    if (!pokemonData) {
        if (resultTarget) resultTarget.innerHTML = '<p>No results.</p>';
        return;
    }

    const extractedData = extractData(pokemonData);
    showData(extractedData);
};

document.querySelector('#js-form').addEventListener('submit', (e) => submitHandler(e));
