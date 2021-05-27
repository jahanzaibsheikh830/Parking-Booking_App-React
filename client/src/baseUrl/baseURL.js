var url = window.location.href.split(":");
if (url[0] === "https") {
    url = 'https://login-system-jahan.herokuapp.com'
}
else {
    url = "http://localhost:4000"
}
export default url;