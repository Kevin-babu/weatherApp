const express= require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { localsName } = require("ejs");
const { response } = require("express");
const { BADHINTS } = require("dns");

const app= express();

var cityN="";
var unit="Metric";
var temp=0;
var weatherDiscrptn="";
var imageUrl="";
var speed=0;
var maxTemp=0;
var minTemp=0;
var time=0;
var lat=0;
var lon=0;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use("/static", express.static("static"))

app.get("/", function(req, res){
    res.render('index',{name: cityN, 
        tempUnit: unit, Temper: temp, 
        disc: weatherDiscrptn,
        image:imageUrl,
        Max: maxTemp, Min: minTemp,
        worldTime: time, wind: speed});
});



app.post("/", function(req, res){
    
    const city= req.body.cityName;
    
    
    
    const appKey= "49d82be977b567a9ee69ba7562bc68da";
    const url= "https://api.openweathermap.org/data/2.5/weather?appid="+appKey+"&q="+city+"&units="+unit;
    const timeAppKey="102c70bb378f41899b6aa3e593e16bfa";

    https.get(url, function(response){
        console.log(response.statusCode);

        if(response.statusCode === 200){
            response.on("data", function(data){
                const weatherData = JSON.parse(data);
                temp = weatherData.main.temp;
                weatherDiscrptn = weatherData.weather[0].description;
                speed= weatherData.wind.speed;
                maxTemp= weatherData.main.temp_max;
                minTemp= weatherData.main.temp_min;
                const Tzone=  weatherData.timezone;
                cityN= weatherData.name;
                lon= weatherData.coord.lon;
                lat= weatherData.coord.lat;
                var icon = weatherData.weather[0].icon;
                imageUrl = "http://openweathermap.org/img/wn/"+ icon +"@2x.png";
                console.log("lat-" +lat+"lon"+lon);
    
                const timeUrl= "https://api.ipgeolocation.io/timezone?apiKey=" +timeAppKey+"&lat="+lat+"&long="+lon;
                console.log(timeUrl);
                https.get(timeUrl, function(response){
    
                    response.on("data", function(data){
                        const timeData= JSON.parse(data);
                        time = timeData.time_12;
                        
                        console.log(time);
                    
    
                    })
                    res.redirect("/"); 
                })
            
            })
        }
        else{
            res.sendFile(__dirname+"/second.html");
        }
       
        
       
    })

})


app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});


