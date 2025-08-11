import '../styles/style.css';
import { getPokemonData } from './modules/HttpRequest';
import { extractData, showData } from './modules/PokemonData';

// この関数のパラメーターは呼び出し元のsubmitHandler関数のsubmitイベントを受け取り、その情報を元に処理を行う
const getInputName = (e) => {
    // e.targetで取得したフォームの内容を用いて、FormDataクラスを元にインスタンスを生成し変数に格納
    // FormDataクラスは、フォームのデータを簡単に取得できる
    // e.targetはsubmitイベントが発生したフォーム要素を指す
    const form = new FormData(e.target);
    // FormDataクラスのgetメソッドを使用して、name属性がpokeNameの値を取得
    // 取得した値をtoLowerCaseメソッドを使用して小文字に変換し変数に格納
    const pokeName = form.get('pokeName').toLowerCase();
    // 取得した値を返す
    return pokeName;
};

// この関数は、引数にフォームのsubmitイベントを受け取り、その情報を元に処理を行う
// また、async/awaitを使用して非同期処理を行う
const submitHandler = async (e) => {
    // フォームのデフォルトのsubmitイベントをキャンセルしページリロードを防ぐ
    // ページをリロードすると、JavaScriptの状態がリセットされてしまうため
    e.preventDefault();
    // getInputName関数を呼び出し、返り値を変数に格納
    const inputName = getInputName(e);
    // getPokemonData関数を呼び出し、返り値を変数に格納（）
    // 引数にinputNameを渡す
    // 返り値はPromiseオブジェクトなので、awaitを使用して非同期処理を待つ
    const pokemonData = await getPokemonData(inputName);
    // extractData関数を呼び出し、返り値を変数に格納
    // 引数にpokemonDataを渡す
    const extractedData = extractData(pokemonData);
    // showData関数を呼び出し、引数にextractedDataを渡す
    showData(extractedData);
};

// フォームのボタンがクリックされたときのイベントリスナー発火　＞　submitHandlerを呼び出す
document.querySelector('#js-form').addEventListener('submit', (e) => submitHandler(e));
