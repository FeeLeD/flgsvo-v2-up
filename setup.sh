# running postgres database 
cd db && docker-compose --env-file ../app/.env up -d
cd ..

# migrating db
cd app && yarn prisma migrate dev

# starting the app if there's a flag --with-start
case "$1" in
  --with-start) yarn build && yarn start;;
  *) echo "unknown flag";;
esac