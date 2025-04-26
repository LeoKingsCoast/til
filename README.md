# Leo's TIL

This is my TIL repo, where I'll be posting small pieces of knowledge as I learn programming. I hope you can learn something from here as well :)

## Running Locally

To run the website locally, use a static server that allows specifying a fallback for file-not-found errors. I use `live-server`:
```bash
npm install -g live-server
```

Then, run `live-server` with `index.html` as fallback:
```bash
live-server --entry-file=./index.html
```
