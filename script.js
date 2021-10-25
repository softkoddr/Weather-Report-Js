const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBTn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
weatrIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

apiKey = "43d027c6c5f7186063d881f3f60f9460";

let api;

inputField.onkeyup = e =>{
    if(e.key == "Enter" && inputField.value !=""){
        requestApi(inputField.value);
    }
}

locationBTn.onclick = () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }else{
        alert("Browser won't support")
    }
}

function onSuccess(position){
    const{latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    fetchData();
}

function onError(error){
    infoTxt.innerHTML = error.message
    infoTxt.classList.add("error");
}

function requestApi(city){
    api =`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    fetchData();
}

function fetchData(){
    infoTxt.innerHTML = "Getting Details..."
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infoTxt.innerHTML = `${inputField.value} Getting Details...`;

    }else{
        const city = info.name
        const country = info.sys.country
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            weatrIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            weatrIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            weatrIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            weatrIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            weatrIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            weatrIcon.src = "icons/rain.svg";
        }


        wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location").innerHTML = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerHTML = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerHTML = humidity;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
        console.log(info);
    }
}

arrowBack.onclick = () =>{
    wrapper.classList.remove("active");
    inputField.value = ""
}