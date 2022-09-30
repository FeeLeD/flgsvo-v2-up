<div align='center'>
  <a href="https://www.flgsvo.ru">
    <img alt="FLGSVO" src="https://storage.yandexcloud.net/flgso-files/flgso_logo.svg" width="100" />
  </a>
  
  <h1 align="center">
    Федерации Свердловской области по лыжным гонкам (клон)
  </h1>
</div>

Проект является улучшением уже существующего. Добавлена автоматизация развертывания приложения как для локальной разработки, так и для production решений.

### Локальная разработка

1. Добавить файл `.env` в папку `/app` проекта со следующим содержимым (переменные могут быть изменены):

```
  POSTGRES_DB=flgsvo_db                
  POSTGRES_USER=user                   
  POSTGRES_PASSWORD=my_password

  DATABASE_HOST=localhost
  DATABASE_PORT=5435

  DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${POSTGRES_DB}
```

2. Запустить команду `bash setup.sh` для поднятия базы данных и применения к ней миграции. Добавление флага `bash setup.sh --with-start` дополнительно сбилдит и запустит проект (production решение) 
3. Перейти в папку `app` и выполнить команду `yarn dev` для запуска dev-сервера.

> Первые два шага необходимо выполнить один раз только при первом запуске!

### Production развертывание 

При коммите в `master` происходит билд и публикация docker image, который можно использовать для удобного развертывания на любой машине (требует глобальную переменную `DATABASE_URL`, содержащую строку подключения к базе данных) 
