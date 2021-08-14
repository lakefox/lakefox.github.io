window.onresize = () => {
  if (window.innerWidth < 895) {
    document.querySelector("#mission_statement").style.display = "block";
  } else {
    document.querySelector("#mission_statement").style.display = "-webkit-box";
  }
}

// cipherHash demo

document.querySelector("#chInput").addEventListener("keydown",chDemo);
document.querySelector("#chPassword").addEventListener("keydown",chDemo);
chDemo();

function chDemo() {
  let input = document.querySelector("#chInput").value;
  let password = document.querySelector("#chPassword").value;

  document.querySelector("#hashOutput").innerHTML = genPassPhrase(a2hex(input).length,password).slice(0,a2hex(input).length);
  document.querySelector("#cipherOutput").innerHTML = a2hex(input);
  document.querySelector("#resultOutput").innerHTML = cipherHash(input,password);
}
let showingEncrypt = false;
function showEncrypt() {
  if (showingEncrypt) {
    showingEncrypt = false;
    document.querySelector("#injectEncrypt").innerHTML = "Inject Lakefox Encrypt";
    document.querySelector("#injectEncrypt").style.background = "#5899e2";
    document.querySelector("#injectScript").remove();
  } else {
    showingEncrypt = true;
    document.querySelector("#injectEncrypt").style.background = "#ef6461";
    document.querySelector("#injectEncrypt").innerHTML = "Remove Lakefox Encrypt";
    encryptShow();
  }
}


document.querySelector("#gkLat").addEventListener("change",gkDemoLL);
document.querySelector("#gkLng").addEventListener("change",gkDemoLL);

function gkDemoLL() {
  let gkLat = document.querySelector("#gkLat").value;
  let gkLng = document.querySelector("#gkLng").value;

  var lat = parseFloat(gkLat);
  var lng = parseFloat(gkLng);
  var latKey = (Math.floor((lat+90)*7200)).toString(16).toUpperCase();
  var rawLng = Math.floor(Math.abs(lng)*7200);
  var lngKey = rawLng.toString(16).toUpperCase();
  if (lng < 0) {
    lngKey = lngKey.toLowerCase();
  }
  document.querySelector("#gkres").value = (latKey+":"+lngKey);
}

document.querySelector("#gkres").addEventListener("keydown",gkDemoGK);

function gkDemoGK() {
  var keys = document.querySelector("#gkres").value.split(":");
  var lat = (parseInt(keys[0], 16)/7200)-90;
  var n = 1;
  if (keys[1].toUpperCase() != keys[1]) {
    n = -1;
  }
  var lng = (parseInt(keys[1], 16)/7200)*n;
  document.querySelector("#gkLat").value = lat;
  document.querySelector("#gkLng").value = lng;
}

function resize() {
  if (window.innerWidth < 500) {
    let res = document.querySelectorAll(".shresult");
    for (var i = 0; i < res.length; i++) {
      res[i].style.marginLeft = "0";
    }
    document.querySelector("#shResults").style.width = "276px";
  } else {
    let res = document.querySelectorAll(".shresult");
    for (var i = 0; i < res.length; i++) {
      res[i].style.marginLeft = "30px";
    }
    document.querySelector("#shResults").style.width = "692px";
  }
  waterfall('#shResults');
  document.querySelector("#shResults").style.margin = "auto";
  document.querySelector("#shResults").style.height = "500px";
  document.querySelector("#shResults").style.marginTop = "30px";

}
window.onresize = resize;


document.querySelector("#filter").addEventListener("change", (e) => {
  search();
});

function search() {
  fetch(`https://search.lakefox.net/results?query=taliban`).then((d) => {
    return d.json();
  }).then((data) => {
    console.log(data);

    let filter = document.querySelector("#filter").value;

    if (filter == "new") {
      data = data.sort((a,b) => {
        return new Date(b.time || new Date(0)).getTime() - new Date(a.time || new Date(0)).getTime();
      });
    } else if (filter == "old") {
      data = data.sort((a,b) => {
        return new Date(a.time || new Date(0)).getTime() - new Date(b.time || new Date(0)).getTime();
      });
    }

    let html = "";
    for (var i = 0; i < data.length; i++) {
      let d = data[i];
      if (d.video != "./cdn/undefined" && d.video != undefined) {
        html += getVideo(d);
      } else if (d.photos.length > 0) {
        for (var photoIndex = 0; photoIndex < d.photos.length; photoIndex++) {
          html += getImage(d,photoIndex);
        }
      } else {
        html += getPlain(d);
      }
    }
    document.querySelector("#shResults").innerHTML = html;
    resize();
  })
}

function getImage(data, num) {
  let d = new Date(data.time);
  return `<div class="shresult">
    <div class="shimgContainer">
      <img src="${data.photos[num]}" class="shembededVideo" onload="waterfall('#results');"/>
    </div>
    <div class="shdescription">
      ${data.description} [${num+1}/${data.photos.length}]
    </div>
    <div class="shrow">
      <div class="shsource">
        ${data.user}
      </div>
      <div class="shtime">
        ${d.getMonth().toString().padStart(2,"0")}-${d.getDay().toString().padStart(2,"0")}-${d.getFullYear()} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}
      </div>
    </div>
    <div class="shlinkholder">
      <a target="_blank" href="${data.url}" class="shtelegramLink"><i class='bx bxl-telegram'></i></a>
    </div>
  </div>`;
}

function getVideo(data) {
  let d = new Date(data.time);
  return `<div class="shresult">
    <div class="shvideoContainer">
      <video src="${data.video}" class="shembededVideo" controls></video>
    </div>
    <div class="shdescription">
      ${data.description}
    </div>
    <div class="shrow">
      <div class="shsource">
        ${data.user}
      </div>
      <div class="shtime">
        ${d.getMonth().toString().padStart(2,"0")}-${d.getDay().toString().padStart(2,"0")}-${d.getFullYear()} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}
      </div>
    </div>
    <div class="shlinkholder">
      <a target="_blank" href="${data.url}" class="shtelegramLink"><i class='bx bxl-telegram'></i></a>
    </div>
  </div>`;
}

function getPlain(data) {
  let d = new Date(data.time);
  return `<div class="shresult">
    <div class="shdescription">
      ${data.description}
    </div>
    <div class="shrow">
      <div class="shsource">
        ${data.user}
      </div>
      <div class="shtime">
        ${d.getMonth().toString().padStart(2,"0")}-${d.getDay().toString().padStart(2,"0")}-${d.getFullYear()} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}
      </div>
    </div>
    <div class="shlinkholder">
      <a target="_blank" href="${data.url}" class="shtelegramLink"><i class='bx bxl-telegram'></i></a>
    </div>
  </div>`;
}
