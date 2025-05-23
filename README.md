# Todo event sourcinfg

関数型ドメインモデリングとイベントソーシングを使ってTodo APIを作った

## APIs

### 取得
```shell
curl http://localhost:12345/todos/${todo_id}
```

### 一覧
```shell
curl http://localhost:12345/todos
```

### 変更履歴
```shell
curl http://localhost:12345/todos/${todo_id}/history
```

### 作成
```shell
curl -X POST http://localhost:12345/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, and bread from the supermarket."}'
```

### タイトル変更
```shell
curl -X PATCH http://localhost:12345/todos/997819f4-c3e0-442f-a70f-b8e023d7e0fb/title \
  -H "Content-Type: application/json" \
  -d '{"title": "new title"}'
```

### 完了
```shell
curl -X PATCH http://localhost:12345/todos/${todo_id}/complete
```

