import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/',
    // type検索時に多数のリクエストが起きうるのでタイムアウトは少し余裕を持たせます
    timeout: 10000,
});

export const getPokemonData = async (pokeData) => {
    try {
        const response = await instance.get('pokemon/' + pokeData);
        return response.data;
    } catch (error) {
        console.error(error);
        alert('Pokemon not found');
        return null;
    }
};

/**
 * type/{type} を叩き、その結果に含まれる各ポケモンの詳細(pokemon/{name})を取得して返す
 * 大量リクエストを避けるためバッチ（並列数制限）でフェッチします。
 * 戻り値: { type: string, pokemons: Array<FullPokemonObject> } または null
 */
export const getPokemonDataForType = async (pokeData) => {
    try {
        const response = await instance.get('type/' + pokeData);
        const pokemonEntries = response.data.pokemon; // [{ pokemon: { name, url }, slot }, ...]
        const batchSize = 20; // 同時並列リクエスト数を調整
        const pokemons = [];

        for (let i = 0; i < pokemonEntries.length; i += batchSize) {
            const batch = pokemonEntries.slice(i, i + batchSize);
            const requests = batch.map((p) => instance.get(`pokemon/${p.pokemon.name}`));
            // Promise.allSettled にして失敗しても継続
            const results = await Promise.allSettled(requests);
            results.forEach((r, idx) => {
                if (r.status === 'fulfilled') {
                    pokemons.push(r.value.data);
                } else {
                    console.warn(`Failed fetching pokemon ${batch[idx].pokemon.name}`, r.reason);
                }
            });
        }

        return { type: response.data.name, pokemons };
    } catch (error) {
        console.error(error);
        alert('Type not found');
        return null;
    }
};
