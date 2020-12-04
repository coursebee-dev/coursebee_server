const Vimeo = require('vimeo').Vimeo;
const { VIMEO_CLIENT_ID, VIMEO_CLIENT_SECRET, VIMEO_REDIRECT_URI } = process.env
const client = new Vimeo(VIMEO_CLIENT_ID, VIMEO_CLIENT_SECRET);

const scopes = ["private", "public"]
redirect_uri = VIMEO_REDIRECT_URI;
const state = Math.random().toString(36).substring(7);
const getVimeoAuthUrl = async () => {
    var url = await client.buildAuthorizationEndpoint(redirect_uri, scopes, state)
    console.log(url)
    return url
}
/*client.accessToken(code, redirect_uri, function (err, response) {
    if (err) {
        return response.end("error\n" + err);
    }

    if (response.access_token) {
        client.setAccessToken(response.access_token);

        // Other useful information is included alongside the access token,
        // which you can dump out to see, or visit our API documentation.
        //
        // We include the final scopes granted to the token. This is
        // important because the user, or API, might revoke scopes during
        // the authentication process.
        var scopes = response.scope;

        // We also include the full user response of the newly
        // authenticated user.
        var user = response.user;
    }
});*/

module.exports = {
    getVimeoAuthUrl: getVimeoAuthUrl
}