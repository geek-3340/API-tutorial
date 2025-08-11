export const extractData = (pokemonData) => {
    const id = pokemonData.id;
    const name = pokemonData.name;
    const img = pokemonData.sprites.front_default;
    const types = [];
    pokemonData.types.forEach((typeItem) => {
        types.push(typeItem.type.name);
    });
    return { id, name, img, types };
};

export const showData = (data) => {
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
