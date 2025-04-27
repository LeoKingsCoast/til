function url_to_file_path(url_path) {
    content_dir = '/tils'
    if(url_path === '' || url_path === '/') {
        return content_dir + '/index.md'
    }
    return content_dir + url_path + '.md'
}

function render_markdown(md_file_content) {
    document.getElementById("content").innerHTML = marked.parse(md_file_content)
}

async function render_page(url_path) {
    md_file_path = url_to_file_path(url_path)
    console.log(`Opening page: ${url_path}`)
    console.log(`Markdown file: ${md_file_path}`)

    fetch(md_file_path)
        .then(response => {
            if(!response.ok) {
                document.getElementById("content").innerHTML = "<p>Oh nooo, error :(</p>"
                throw new Error("404 Response: TIL file not found")
            }    
            /*
             * When running on with index.html as fallback, a file not found will
             * not return a 404 response, instead returning the index.html file.
             * Therefore, we need to check if the type of the return file is html
             * to identify a file not found error.
             */
            if (response.headers.get('Content-Type')?.includes('text/html')) {
                throw new Error("Unexpected HTML response: TIL file not found");
            }
            return response.text()
        })
        .then(md_file_content => {
            render_markdown(md_file_content)
        })
        .catch(err => {
            document.getElementById("content").innerHTML = "<p>Oh nooo, error :(</p>"
            console.warn(`Failed to fetch content: ${err}`)
        });
}

render_page('')
