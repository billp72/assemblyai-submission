(()=>{const t=window.location.search,e=new URLSearchParams(t).get("paragraph"),n=document.getElementById("host"),r=document.getElementById("guest"),s=document.getElementById("subtitle"),o=document.getElementById("outterloader1");(async()=>{let t=localStorage.getItem("transcript");s&&(s.innerHTML=e||"0");let a=JSON.parse(t);if(a?.length>0){o.style.visibility="hidden";let t=a;r.innerHTML="<strong>Guest:</strong> "+t[parseInt(e)].text;let s=parseInt(e);n.innerHTML="<strong>Host:</strong> "+t[s-=1].text}})()})();