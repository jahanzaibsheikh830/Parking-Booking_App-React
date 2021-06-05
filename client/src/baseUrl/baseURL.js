var url = window.location.href.split(":");
if (url[0] === "https") {
    url = 'https://parking-app-react.herokuapp.com'
}
else {
    url = "http://localhost:4000"
}
export default url;