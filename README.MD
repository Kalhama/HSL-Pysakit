# HSLWeather
This project is a info screen page for displaying finnish major cities bus routes, weather and a clock on a any screen.

## Live example
- Visit https://hslweather.max.kalhama.fi

## Developing

1. install node.js 
    - https://nodejs.org/en/
2. install yarn 
    - https://classic.yarnpkg.com/en/docs/install
3. navigate to project root
4. run `yarn install` to install dependencies
5. run `yarn start` to start development server locally

## Production
1. run `yarn build` to create production build. Build files will be in `build/` folder

## Configuring
- environment variables are located inside [env.js](./env.js)

## External API's used
- [Open Weather API](https://openweathermap.org/api)
- [Digitransit / HSL](https://digitransit.fi/en/developers/apis/) (GraphQL)
- [Giphy API](https://developers.giphy.com/) 
    - to display memes during hard times (errors)

## Contributing
[Things to do](./todo.txt)