// axiosを使用する際は以下のようにインポートする
import axios from 'axios';

// axiosを用いたAPIリクエストのインスタンスを作成
const instance = axios.create({
    // PokeAPIのベースURLを設定
    baseURL: 'https://pokeapi.co/api/v2/',
    // リクエストのタイムアウトを設定（ミリ秒単位）
    // オーバーするとエラーが発生する
    timeout: 10000,
});

// 非同期処理
// ポケモンの名前またはIDを指定して、ポケモンの詳細データを取得する場合の関数
// 引数はgetInputData関数で取得したポケモンの名前またはID
export const getPokemonData = async (pokeData) => {
    try {
        // url:https://pokeapi.co/api/v2/pokemon/{name or id}でAPIを叩く
        const response = await instance.get('pokemon/' + pokeData);
        // 取得したデータをそのまま返す
        return response.data;
    } catch (error) {
        // エラーが発生した場合はコンソールにエラーメッセージを表示し、アラートを出す
        console.error(error);
        alert('Pokemon not found');
        // nullチェック対策
        return null;
    }
};

// 非同期処理
// ポケモンのタイプを指定して、ポケモンのリストを取得する場合の関数
// 引数はgetInputData関数で取得したポケモンのタイプ
export const getPokemonDataForType = async (pokeData) => {
    try {
        // url:https://pokeapi.co/api/v2/type/{type}でAPIを叩く処理
        const response = await instance.get('type/' + pokeData);
        // レスポンスからポケモンのリストを抽出（厳密にはここでAPIを叩いている）
        const pokemonEntries = response.data.pokemon; // [{ pokemon: { name, url }, slot }, ...]
        // 処理が重くなる可能性があるため、同時並列リクエスト数を制限する
        const batchSize = 20;
        // ポケモンの詳細データを格納する配列を初期化
        const pokemons = [];

        // ポケモンのリストをバッチ処理で取得
        // 指定したタイプで取得したポケモンのリスト数に応じて、バッチサイズごとにリクエストを分割
        for (let i = 0; i < pokemonEntries.length; i += batchSize) {
            // バッチごとにポケモンの詳細データを分割
            const batch = pokemonEntries.slice(i, i + batchSize);
            // url:https://pokeapi.co/api/v2/pokemon/{name}でAPIを叩く処理
            // {name}にポケモン名前を指定する処理を、batchで分割後のポケモンリストの数だけmap()で処理を回す
            const requests = batch.map((p) => instance.get(`pokemon/${p.pokemon.name}`));
            // Promiseでリクエストを並列に実行（非同期処理で実行）
            // .allSettled でHTTPエラーでも処理を継続
            // レスポンスのデータを変数に格納
            // 厳密にはここでAPIを叩いている
            const results = await Promise.allSettled(requests);

            // 全てのレスポンスに対して処理を行う
            results.forEach((r, idx) => {
                // 成功した場合はポケモンの詳細データをpokemons配列に追加
                // 失敗した場合はコンソールにどのポケモンの取得に失敗したかと、その理由を警告表示
                if (r.status === 'fulfilled') {
                    pokemons.push(r.value.data);
                } else {
                    console.warn(`Failed fetching pokemon ${batch[idx].pokemon.name}`, r.reason);
                }
            });
        }
        // 取得したポケモンのリストをオブジェクトとして返す
        // typeキーには取得したタイプ名、pokemonsキーにはポケモンの詳細データを格納
        return { type: response.data.name, pokemons };
    } catch (error) {
        // エラーが発生した場合は、コンソールにエラーメッセージを表示し、アラートを出す
        console.error(error);
        alert('Type not found');
        // nullチェック対策
        return null;
    }
};
