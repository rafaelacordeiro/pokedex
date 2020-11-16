fetch("./views/home.html").then(response => {return response.text()}).then(data => {
    document.querySelector("header").innerHTML = data;
});
