const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const parameter_name = urlParams.get('paragraph');
const pages = urlParams.get('page');
const host = document.getElementById("host"); 
const guest = document.getElementById("guest"); 

const paragraph = document.getElementById('subtitle')
async function run2() {
    let cache1 = localStorage.getItem("clipped");
    localStorage.setItem("current_page", pages);
    if(paragraph) paragraph.innerHTML = parameter_name || "0";
    let parsed = JSON.parse(cache1)
    if(parsed?.length > 0){
      let resp = parsed;
      guest.innerHTML = '<strong>Guest:</strong> ' + resp[parseInt(parameter_name)].text
      let sub = parseInt(parameter_name)
      host.innerHTML = '<strong>Host:</strong> ' + resp[sub-=1].text
    } 
 };

run2();