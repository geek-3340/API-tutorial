// axiosを使用する際は以下のようにインポートする
import axios from 'axios';

// axisosのインスタンスを作成
const instance = axios.create({
    // baseURLを設定することで、APIのエンドポイントを簡潔に指定できる
    baseURL: 'https://pokeapi.co/api/v2/pokemon/',
    // timeoutを設定することで、リクエストが一定時間内に完了しない場合にエラーを返す
    timeout: 1000,
});

// 引数に、フォーム内のname属性が'pokeName'である要素の入力値を受け取る(getInputName関数からの返り値)
export const getPokemonData = async (pokeName) => {
    try { // リクエストの非同期処理
        // axiosのgetメソッドを使用して、APIからデータを取得し変数に格納
        // エンドポイントはbaseURLに引数を追加したもの
        const response = await instance.get(pokeName); 
        // 取得したデータを返す
        return response.data;
    } catch (error) { // レスポンスエラーが発生した場合の処理
        // エラーをコンソールに出力
        console.error(error);
        // エラーが発生した場合は、ユーザーに通知するためのアラートをブラウザに表示
        alert('Pokemon not found');
    }
};
