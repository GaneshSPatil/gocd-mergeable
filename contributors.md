# Contributors

### Checkin

- Do checkin source (`index.js`, `util.js`, `util/*.js`)
- Do checkin a single index.js file after running `ncc`
- Do not checking node_modules

### NCC

In order to avoid uploading `node_modules` to the repository, we use [zeit/ncc](https://github.com/zeit/ncc) to create a single `index.js` file that gets saved in `dist/`.

If you're developing locally you can run
```
npm install
ncc build
```
You can also do
```
npm run compile # runs ncc build
npm run test # runs tests
```

### Testing

Tests are included under `test/*` and can be run using `npm test`.

