// 引数に、フォームの入力値を元にAPIで取得したデータを受け取る
export const extractData = (pokemonData) => {
    // 取得したデータからid、name、sprites.front_default(ポケモンの画像)を抽出しオブジェクトに格納
    const id = pokemonData.id;
    const name = pokemonData.name;
    const img = pokemonData.sprites.front_default;
    // 複数のタイプがあるため、配列として格納するための空の配列を作成
    const types = [];
    // typesプロパティは配列で、各要素にtypeプロパティがあるため、forEachメソッドを使用して各要素のtype.nameを取得
    // 取得したタイプをtypes配列に格納
    pokemonData.types.forEach((typeItem) => {
        types.push(typeItem.type.name);
    });
    // 抽出したデータをオブジェクトとして返す
    return { id, name, img, types };
};

// 引数に、extractData関数からの返り値を受け取る
export const showData = (data) => {
    // 受け取ったデータをHTMLのdl要素として整形
    // id属性がjs-resultの要素にinnerHTMLプロパティを使用して、整形したHTMLを挿入
    const htmlData = `
        <dl>
        <dt>Name: ${data.name}</dt>
        <dd><img src="${data.img}" alt=""></dd>
        <dd>ID: ${data.id}</dd>
        <dt>Types: ${data.types.join(', ')}</dd>
        </dl>
    `;
    document.querySelector('#js-result').innerHTML = htmlData;
};
