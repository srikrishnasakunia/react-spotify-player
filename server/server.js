const express = require ('express');
const cors = require ('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require ('spotify-web-api-node');
const lyricsFInder = require ('lyrics-finder')

var app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.post("/refresh",(req,res)=>{
    const refreshToken = req.body.refreshToken
    const SpotifyApi = new SpotifyWebApi({
        redirectUri : 'http://localhost:3000',
        clientId : '87274b8b2e5e4ba1915fb48d07fc11bd',
        clientSecret : '7df7011306c2482b8c0a79d1a1921fea',
        refreshToken,
    })
    SpotifyApi
    .refreshAccessToken()
    .then(data => {
        res.json({
            accessToken:data.body.access_token,
            expiresIn:data.body.expires_in,
        })
    })
    .catch(()=> {
        res.sendStatus(400)
    })
})

app.post('/login',(req,res)=>{
    const code = req.body.code;
    const SpotifyApi = new SpotifyWebApi({
        redirectUri : 'http://localhost:3000',
        clientId : '87274b8b2e5e4ba1915fb48d07fc11bd',
        clientSecret : '7df7011306c2482b8c0a79d1a1921fea'
    })

    SpotifyApi.authorizationCodeGrant(code).then(data =>{
        res.json({
            accessToken : data.body.access_token,
            refreshToken : data.body.refresh_token,
            expiresIn : data.body.expires_in
        })
    })
    .catch(err =>{
        console.log(err)
        res.sendStatus(400)
    })
}) 

app.get('/lyrics',async (req,res)=>{
    const lyrics = await lyricsFInder(req.query.artist, req.query.track) || "No lyrics Found"
    res.json({lyrics})
})

app.listen(3001);