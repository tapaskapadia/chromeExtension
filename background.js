$(document).ready(function () {
  chrome.browserAction.onClicked.addListener(function(tab) {chrome.tabs.update({ url: "chrome://newtab" });});
  //Function to set quotes in local storage for 6hours
  function quote() {
    if(!localStorage.getItem('timeStampQuote') || (Math.floor(Date.now() / 1000)  - localStorage.getItem('timeStampQuote')) > 21600) {
      $.getJSON("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?", function (a) {
        quoteStuff = a.quoteText + "[/]" + a.quoteAuthor;
        localStorage.setItem('q', quoteStuff);
        localStorage.setItem('timeStampQuote',Math.floor(Date.now() / 1000))
      });
    }
  };
  // 


  //Functions to get the Geolocation and stores it in the local storage
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    var crd = pos.coords;
    var d = Math.floor(Date.now() / 1000);
    var txt = crd.latitude + "," + crd.longitude + "," + d;
    localStorage.setItem('geo', txt);
    localStorage.setItem('timeStampGeo',Math.floor(Date.now() / 1000))

  };

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  function doGeo() {
    if(!localStorage.getItem('timeStampGeo') || (Math.floor(Date.now() / 1000)  - localStorage.getItem('timeStampGeo')) > 1800) {
    navigator.geolocation.getCurrentPosition(success, error, options);
    }
  }
  //    

  //Function to store the image in local storage for 6hours.
  function doDataUri() {
    if(!localStorage.getItem('timeStampImage') || (Math.floor(Date.now() / 1000)  - localStorage.getItem('timeStampImage')) > 21600) {
    getDataUri('https://source.unsplash.com/collection/1513876/1600x900', function (dataUri) {
      //localStorage.setItem("imgData", dataUri);
      console.log(dataUri.length);
      localStorage.setItem("imgData",dataUri);
      localStorage.setItem('timeStampImage', Math.floor(Date.now() / 1000))
    });
  }
  }
  function getDataUri(url, callback) {
    var image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
      canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
      canvas.getContext('2d').drawImage(this, 0, 0);
      callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
      callback(canvas.toDataURL('image/png'));
    };
    image.src = url;
  }
  //
  
  //Calls the functions so they are stored initally
  quote();
  getDataUri('https://source.unsplash.com/collection/1513876/1600x900', function (dataUri) {
    console.log(dataUri.length);
    localStorage.setItem("imgData", dataUri);
    localStorage.setItem('timeStampImage', Math.floor(Date.now() / 1000))
  });
  doGeo();
  // 

  //Contiously Updates
  setInterval(doGeo, 120000);       //updates geolocation every 30min;  checks every two minute to see if has been 30 minutes
  setInterval(doDataUri, 120000);   //updates background image every 6hours; checks every two minute to see if has been 6hours 
  setInterval(quote, 120000);       //updates quote every 6hours; checks every two minute to see if has been 6hours 
  //
});