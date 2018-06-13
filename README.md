# Основная идея
Для хранения приватных данных пользователя (только email по ТЗ) можно использовать AES шифрование с ключом - значение email.
В этом случае, пользователь выступает в роли носителя ключа для расшифровки значения email в БД, которое используется для отправки номера телефона, но не хранится нигде в явном виде (исключая доступ к памяти во время выполнения).
Полный доступ к коду приложения, и полный доступ к БД не позволяет скомпрометировать приватные поля.

Для ускорения выборки и сравнения email с хэшем в БД внутри запроса используется расширение **pgcrypto**. 

# Установка

Создание роли, базы данных, таблицы, установка расширений
```sh
$ sh bin/create_database.sh
```
Установка зависимостей
```sh
$ npm install
```
Настройка SMTP

`mailer.js:7` `host`

`mailer.js:8` `port` 

`mailer.js:9` `user`

`mailer.js:10` `pass`

Или включить режим имитации отправки (не использует реальный SMTP транспорт)

`mailer.js:5`
`smpt_fake_mode = true`

Запуск
```sh
$ node ./bin/www
```

# Описание реализованного функционала

  - Регистрация нового пользователя по двум полям email и phone
```http request
POST /users/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "test@test.com",
  "phone": "89001234567"
}
```
```http request
POST /users/register HTTP/1.1
Host: localhost:3000
Content-Type: application/x-www-form-urlencoded

email=test%40test.com&phone=89001234567
```  
  - Восстановление номера телефона по email пользователя
```http request
POST /users/restore HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "test@test.com"
}
```
```http request
POST /users/restore HTTP/1.1
Host: localhost:3000
Content-Type: application/x-www-form-urlencoded

email=test%40test.com
```
  - Скачивание файла `./data/file.doc` с телом `Document` под любым произвольным названием
```http request
GET /files?filename=document.doc HTTP/1.1
Host: localhost:3000
Cache-Control: no-cache

``` 