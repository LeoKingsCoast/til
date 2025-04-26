# File-Not-Found Errors with Fallback Page Enabled

There are cases where we want to redirect `404` HTML errors (file not found) so that a specific template page is displayed instead.

Now, consider this occours when we are trying to `fetch` a file the conventional way, as in the example bellow:
```javascript
fecth("https://mydomain/path/to/file")
    .then(res => {
        if(!res.ok) throw new Error("File not found");

        return res.text();
    })
    .then(text => {
        // Do stuff with the response
    })
    .catch(err => {
        console.warn(`Very bad no good error: ${err}`);
    })
```

If we have setup a fallback page, the response will not be `404`, therefore, our inexistent file will pass the `if(!res.ok)` check.

## Solution

To account for this situation, if you know the target files are never HTML, you can use that to check for the error:
```javascript
fecth("https://mydomain/path/to/file")
    .then(res => {
        if(!res.ok) throw new Error("File not found");
        if(res.headers.get("Content-Type")?.includes('text/html')) {
            throw new Error("Unexpected HTML response");
        }

        return res.text();
    })
    .then(text => {
        // Do stuff with the response
    })
    .catch(err => {
        console.warn(`Very bad no good error: ${err}`);
    })
```

### Making the solution more reliable

A more reliable, that will not throw an error for HTML pages other than the `index.html` is to include a unique piece of text inside the `index.html` file, and use it to identify it. For example:
```html title:"index.html"
<meta name="index-file" content="true">
```

Then, check the response test to see if your unique text is inside the file:
```javascript
if(text.includes('<meta name="index-file"')) {
    throw new Error("Unexpected Index File response")
}
```
