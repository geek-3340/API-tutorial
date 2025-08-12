// helper: single pokemon から必要なデータを抜く
const extractSingle = (pokemon) => {
    const id = pokemon.id;
    const name = pokemon.name;
    // 画像は front_default が null のケースがあるのでフォールバックを用意
    const img =
        pokemon.sprites?.front_default ||
        pokemon.sprites?.other?.['official-artwork']?.front_default ||
        '';
    const types = (pokemon.types || []).map((t) => t.type.name);
    return { id, name, img, types };
};

/**
 * 入力は2種類を想定：
 * 1) 単体ポケモンオブジェクト（/pokemon/{id or name} のレスポンス）
 * 2) { type: string, pokemons: [fullPokemonObject, ...] }（getPokemonDataForType の返却）
 *
 * 戻り値は showData にわかりやすく渡せる形に統一する
 */
export const extractData = (pokemonData) => {
    if (!pokemonData) return null;

    // type検索での返却（配列）
    if (pokemonData.pokemons && Array.isArray(pokemonData.pokemons)) {
        const pokemons = pokemonData.pokemons.map((p) => extractSingle(p));
        return { type: pokemonData.type, pokemons };
    }

    // 単体ポケモン
    return { pokemon: extractSingle(pokemonData) };
};

export const showData = (data) => {
    const target = document.querySelector('#js-result');
    if (!target) return;

    if (!data) {
        target.innerHTML = '<p>No results.</p>';
        return;
    }

    // タイプ検索で複数
    if (data.pokemons && Array.isArray(data.pokemons)) {
        if (data.pokemons.length === 0) {
            target.innerHTML = `<p>No pokemons found for type "${data.type}".</p>`;
            return;
        }

        // simple card list を作る（必要ならCSSで .pokemon-list/.pokemon-card を整える）
        const htmlList = data.pokemons
            .map((p) => {
                const imgHtml = p.img
                    ? `<img src="${p.img}" alt="${p.name}">`
                    : `<div class="no-image">No image</div>`;
                return `
                <div class="pokemon-card">
                    <h3>${p.name} <small>#${p.id}</small></h3>
                    <div class="pokemon-thumb">${imgHtml}</div>
                    <p>Types: ${p.types.join(', ')}</p>
                </div>
            `;
            })
            .join('');

        target.innerHTML = `<h2>Type: ${data.type} (${data.pokemons.length})</h2><div class="pokemon-list">${htmlList}</div>`;
        return;
    }

    // 単体表示
    if (data.pokemon) {
        const p = data.pokemon;
        target.innerHTML = `
            <div class="pokemon-card">
                    <h3>${p.name} <small>#${p.id}</small></h3>
                    <div class="pokemon-thumb">${
                        p.img
                            ? `<img src="${p.img}" alt="${p.name}">`
                            : 'No image'
                    }</div>
                    <p>Types: ${p.types.join(', ')}</p>
                </div>
        `;
        return;
    }

    target.innerHTML = '<p>No results.</p>';
};
