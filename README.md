## Chrome拡張機能 
これは，Google Meet使用時に顔に化粧フィルタを掛けるようにするchrome拡張機能です．<br>

- manifest.json  : manifest V3に対応<br>
- main.js : 処理を記述<br>
- output.js：顔に掛けるフィルタ(ファンデーション)
- tf-core.js：これ以下はTensorFlow.js
- tf-converter.js
- tf-backend-webl.js
- face-landmarks-detecion.js
- extensions.sh：TensorFlow.jsをローカルにダウンロードするためのシェルスクリプト

#### - extensions.shの実行方法<br>
`$ ./extensions.sh` 　で実行する．<br>
`-bash: ./extensions.sh: Permission denied ` 　というエラーが出たときは，管理者権限で実行する必要があるので，<br>
`$ chmod 755 extensions.sh`<br>
`$ ./extensions.sh`
で実行する