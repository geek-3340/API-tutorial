// ポケモン一体のデータを抽出するモジュール
const extractSingle = (pokemon) => {
    // ポケモンのidと名前を抽出
    const id = pokemon.id;
    const name = pokemon.name;
    // 画像は front_default が null の場合は空文字列を返す
    const img = pokemon.sprites?.front_default||'';
    // タイプは単一の場合は配列に変換し、複数の場合はそのまま配列でタイプ名を抽出（配列で返す）
    const types = (pokemon.types || []).map((t) => t.type.name);
    // 抽出したデータをオブジェクトとして返す
    return { id, name, img, types };
};

// getPokemonData関数・getPokemonDataForType関数で取得したポケモンのデータから必要な情報を抽出する関数
export const extractData = (pokemonData) => {
    // ポケモンのデータがnullの場合はnullを返す
    if (!pokemonData) return null;

    // タイプ検索で複数のポケモンが取得された場合の処理
    if (pokemonData.pokemons) {
        // 全てのポケモンのデータに対してextractSingle関数を実行し、必要な情報を抽出
        // 抽出したデータをpokemonsに配列として格納
        const pokemons = pokemonData.pokemons.map((p) => extractSingle(p));
        // 抽出したデータをオブジェクトとして返す
        return { type: pokemonData.type, pokemons };
    }

    // ポケモンのデータが単体の場合はextractSingle関数を実行し、必要な情報を抽出
    // 抽出したデータをオブジェクトとして返す
    return { pokemon: extractSingle(pokemonData) };
};

// extractData関数で抽出したデータをHTMLに表示する関数
// 引数にはextractData関数で抽出したデータを渡す
export const showData = (data) => {
    // 抽出したデータを表示するターゲットDOMを取得し変数に格納
    const target = document.querySelector('#js-result');
    // ターゲットDOMが存在しない場合は何もしない
    if (!target) return;
    // ポケモンのデータがnullの場合は、ターゲットDOMに「No results.」と表示
    if (!data) {
        target.innerHTML = '<p>No results.</p>';
        return;
    }

    // 抽出したポケモンのデータが複数ある場合の処理
    if (data.pokemons) {
        // 指定したタイプのポケモンが存在しない場合は、ターゲットDOMに「No pokemons found for type "type".」と表示
        if (data.pokemons.length === 0) {
            target.innerHTML = `<p>No pokemons found for type "${data.type}".</p>`;
            return;
        }

        // ポケモン一体ごとにカード形式でHTMLを生成し変数に格納
        const htmlList = data.pokemons
            .map((p) => {
                // ポケモンの画像が存在する場合はimgタグを生成、存在しない場合は「No image」と表示する変数
                const imgHtml = p.img
                    ? `<img src="${p.img}" alt="${p.name}">`
                    : `<div class="no-image">No image</div>`;

                // ポケモンのカード形式のHTMLを生成し返す
                // 画像はimgHtml変数を使用
                // タイプが複数の場合はp.typesをカンマ区切りで表示
                return `
                <div class="pokemon-card">
                    <h3>${p.name} <small>#${p.id}</small></h3>
                    <div class="pokemon-thumb">${imgHtml}</div>
                    <p>Types: ${p.types.join(', ')}</p>
                </div>
            `;
            })
            .join(''); // 生成されたポケモン一体ごとのHTMLの配列を区切り文字なしで結合

        // ターゲットDOMにタイプ名と取得したポケモンの数、取得したポケモンのリストを表示
        // タイプ名はdata.typeから取得し、ポケモンの数はdata.pokemons.lengthで取得
        // ポケモンのリストはhtmlList変数を使用
        target.innerHTML = `<h2>Type: ${data.type} (${data.pokemons.length})</h2><div class="pokemon-list">${htmlList}</div>`;
        return;
    }

    // 抽出したポケモンのデータが単体の場合の処理
    if (data.pokemon) {
        // 抽出したポケモンのデータを変数に格納（後の処理で扱いやすくするため）
        const p = data.pokemon;
        // ターゲットDOMにポケモンのカード形式のHTMLを生成し表示
        // ポケモンの画像が存在する場合はimgタグを生成、存在しない場合は「No image」と表示
        // タイプが複数の場合はp.typesをカンマ区切りで表示
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
    // もしポケモンのデータが抽出できなかった場合は、ターゲットDOMに「No results.」と表示
    target.innerHTML = '<p>No results.</p>';
};
