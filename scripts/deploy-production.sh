DIR=/var/www/hslweather.max.kalhama.fi
yarn build
rsync -avh --delete ./build/ max@kalhama.fi:$DIR/html/