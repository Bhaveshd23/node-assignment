const https = require("https")
const http = require("http")
const url = `https://time.com/`;
const port = 5000;

const req = https.get(url, (res) => {
    const output =[];
    let htmlData = "";
    res.on("data", d => {
        htmlData += d
    })
    res.on("end", () => {
        const splitData = htmlData.slice(htmlData.indexOf("latest-stories__item"), htmlData.lastIndexOf("latest-stories__item"))
        const linkRx = /<a\s+href=(["'])(.*?)+/g;
        const links = splitData.match(linkRx)
        const hreg = /<h3\s+class=[" '](.*?)+\/h3>/g;

        const head = splitData.match(hreg);

        const title = [];
        const link = [];

        for (let i = 0; i < head.length; i++) {
            title.push(head[i].slice(42, head[i].length - 5))
        }

        for (let i = 0; i < links.length; i++) {
            link.push("https://time.com/" + links[i].slice(9, links[i].length - 2))
        }

        for (let i = 0; i < title.length; i++) {
            let obj = {};
            obj.title = title[i];
            obj.link = link[i];
            output.push(obj);
        }
        console.log(output)
        const server = http.createServer((request, response) => {
            if (request.url === "/") {
                response.write("Hello");
                response.end();
            }
            if (request.url === "/getTimeStories") {
                response.write(JSON.stringify(output));
                response.end();
            }
        })
        server.listen(port, () => {
            console.log("listening on port", port)
        });
    });
})
req.on("error", (error) => {
    console.log(error)
})
req.end()
