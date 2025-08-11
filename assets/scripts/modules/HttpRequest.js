import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/',
    timeout: 1000,
});

export const getPokemonData = async (pokeData) => {
    try { 
        const response = await instance.get('pokemon/' + pokeData); 
        return response.data;
    } catch (error) { 
        console.error(error);
        alert('Pokemon not found');
    }
};

export const getPokemonDataForType = async (pokeData) => {
    try { 
        const response = await instance.get('type/' + pokeData); 
        return response.data;
    } catch (error) { 
        console.error(error);
        alert('Pokemon not found');
    }
};