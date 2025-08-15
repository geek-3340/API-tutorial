import '../styles/style.css';
import { getPokemonData, getPokemonDataForType } from './modules/HttpRequest';
import { extractData, showData } from './modules/PokemonData';

// ポケモンの入力欄のDOM要素を取得（配列に格納）
const inputs = document.querySelectorAll('input[type="text"]');

// 単一の入力欄に入力があった場合、他の入力欄を無効化するロジック
// 入力欄（配列）ごとに処理
inputs.forEach(input => {
    // 入力欄に変更があった場合のイベントリスナー
    input.addEventListener('input', () => {
        // 入力欄に値がある場合
        if (input.value.trim() !== "") {
            // 値がある入力欄以外を無効化
            inputs.forEach(other => {
                if (other !== input) {
                    other.disabled = true;
                }
            });
        } else {
            // 全ての入力欄が空の場合の処理
            // 補足：every()はNodeListでは使えないので、スプレッド演算子で配列に変換
            if ([...inputs].every(i => i.value.trim() === "")) {
                // 全ての入力欄を有効化
                inputs.forEach(i => i.disabled = false);
            }
        }
    });
});

// フォームの送信時に全ての入力欄を有効化するロジック
document.querySelector('#js-form').addEventListener('submit', () => {
    // 全ての入力欄を有効化
    inputs.forEach(i => i.disabled = false);
});

// フォーム送信時の入力データ取得処理
const getInputData = (e) => {
    // リクエストされたフォームのデータを取得し変数に格納
    const form = new FormData(e.target);
    // 入力欄の値を格納する変数を定義し、空の場合undefinedではなくnullを返す
    // 明示的にnullを返すことで、後続の処理でのnullチェックが容易になる
    let pokeData = null;
    // 全ての入力欄の値をチェックし、空でない場合は値を小文字に変換しpokeDataに格納
    if (form.get('pokeName').trim() !== '') {
        pokeData = form.get('pokeName').toLowerCase().trim();
    } else if (form.get('pokeType').trim() !== '') {
        pokeData = form.get('pokeType').toLowerCase().trim();
    } else if (form.get('pokeId').trim() !== '') {
        pokeData = form.get('pokeId').toLowerCase().trim();
    }
    // formの値を取得後、値をクリア
    e.target.reset();
    // 取得したpokeDataを返す
    // もし全ての入力欄が空の場合はnullを返す
    return pokeData;
};

// フォーム送信時のハンドラー
const submitHandler = async (e) => {
    // デフォルトのフォーム送信を防ぐ
    e.preventDefault();
    // リクエストされたフォームのデータを取得し変数に格納
    const form = new FormData(e.target);
    // 入力データを取得（getInputData関数参照）
    const inputData = getInputData(e);
    // レスポンスのターゲットDOMを取得し変数に格納
    const resultTarget = document.querySelector('#js-result');

    // フォームをリクエスト時に入力値が全てnullの場合はアラートを表示
    if (!inputData) {
        alert('検索ワードを入力してください');
        return;
    }

    // 読込表示(この位置に設定することで、リクエスト中にユーザーにフィードバックを提供)
    if (resultTarget) resultTarget.innerHTML = '<p>Loading...</p>';

    // nullチェック対策
    let pokemonData = null;

    // 入力値に応じて、ポケモンデータを取得（HttpRequest.js参照）
    if (form.get('pokeType').trim() !== '') {
        pokemonData = await getPokemonDataForType(inputData);
    } else {
        pokemonData = await getPokemonData(inputData);
    }

    // 取得したデータがnullの場合は、ユーザーにフィードバックを提供
    if (!pokemonData) {
        if (resultTarget) resultTarget.innerHTML = '<p>No results.</p>';
        return;
    }

    // データを抽出し、表示する（PokemonData.js参照）
    const extractedData = extractData(pokemonData);
    showData(extractedData);
};

// フォームの送信時にsubmitHandlerを発火
document.querySelector('#js-form').addEventListener('submit', (e) => submitHandler(e));

// JS動作フロー
// formの送信時にsubmitHandlerを発火
// submitHandler内でgetInputDataを呼び出し、入力値を取得
// 入力値に応じてgetPokemonDataまたはgetPokemonDataForTypeを呼び出し、ポケモンデータを取得
// 取得したデータをextractDataで抽出し、showDataで表示