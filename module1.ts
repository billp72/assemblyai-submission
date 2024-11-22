// Start by making sure the `assemblyai` package is installed.
// If not, you can install it by running the following command:
// npm install assemblyai
import { AssemblyAI } from 'assemblyai';
//import { SoxRecording } from './sox.js'
const client = new AssemblyAI({
  apiKey: '6410a0f10abd474d9c98d6e2b0439e99',
});

const FILE_URL =
  'https://assembly.ai/wildfires.mp3';

const data = {
  audio: FILE_URL,
  speaker_labels: true
}

let cache = localStorage.getItem("transcript");
let transcript;

const paginate = async (arr) => {
  let p = localStorage.getItem('pages')
  let init = !!p ? JSON.parse(p) : {start:0, finish:8};
  const cloneArr = [...arr]
  return cloneArr.slice(init.start, init.finish);
}
const text = document.getElementById("text"),
      outterload = document.createElement('div'),
      innerload = document.createElement('div');
      outterload.setAttribute("aria-label","loading spinner")
      outterload.setAttribute("tabindex", "1");
      innerload.setAttribute("tabindex", "1");
      innerload.classList.add('loader');
      outterload.classList.add('outterLoader');
      let current_page = localStorage.getItem("current_page");
      outterload.appendChild(innerload);
      text.appendChild(outterload);
      
      const elm = document.getElementById('btn'),
      page = document.createElement('span'),
      btn = document.createElement('button');
      page.style.backgroundColor = '#DCDCDC'
      page.style.padding = '12px 15px 15px 15px';
      page.style.fontSize = '20px';
      page.textContent = current_page ? `page ${current_page}` : 'page 1'
      page.setAttribute("tabindex", "2");
      btn.setAttribute("tabindex", "2");
      btn.setAttribute("aria-label", "next page button");
      btn.style.width = '80px';
      btn.style.height = '50px';
      btn.style.backgroundColor = "#6082B6";
      btn.style.border = "2px solid #7393B3"
      btn.style.color = "white";
      let calls = !current_page ? 1 : parseInt(current_page);
      btn.addEventListener('click', () => {
        let p = localStorage.getItem('pages')
        let advance;
        if(!!p){
            let next = JSON.parse(p)
            advance = {start:next.finish, finish:next.finish+8}
        }else {
            advance = {start:8, finish:16}
        }
        let parsed = JSON.parse(localStorage.getItem("transcript"))
          
        if(parsed.length > advance.start){
            //console.log(parsed.length, advance.start)
            localStorage.setItem('pages', JSON.stringify(advance))
            text.innerHTML = ""
            text.appendChild(outterload);
        }else{
            localStorage.setItem('pages', JSON.stringify({start:0, finish:8}))
            text.innerHTML = ""
            text.appendChild(outterload);
        }
        calls++
        const f = parsed.length < advance.start ? calls = 1 : calls;
        page.textContent = `page ${f}`;
        run(calls);
    });
    let textn = document.createTextNode("NEXT");
    btn.appendChild(textn);

async function run(call = 0) {

  if(!transcript) {
    transcript = await client.transcripts.transcribe(data);
  }
  if (transcript.status === 'error') {
    console.error(`Transcription failed: ${transcript.error}`)
    process.exit(1)
  }
  let parsed = JSON.parse(cache)
  if(parsed?.length > 0 || transcript?.utterances?.length > 0){
    localStorage.setItem("transcript", JSON.stringify(transcript.utterances));
    let resp = parsed || transcript.utterances;
    let para = ''
    text.removeChild(outterload);
    let anchor = '';
    let index = 0;
    const clipped = await paginate(resp)
    localStorage.setItem("clipped", JSON.stringify(clipped));
    for (let utterance of clipped) {
      let adjust = !call ? 1 : call
      anchor = utterance.speaker === 'A' ? 'Host' : 'Guest'
       para += `<div aria-label="conversation text"><p tabindex="1" style=${utterance.speaker === 'A' ? 'color:#808080;' : 'color:#7393B3;'}>
          ${anchor==='Guest' ? '<a tabindex="1" style="color:black;" href=https://fierce-everglades-96194-97a0bfd171b5.herokuapp.com/focuspage?paragraph='+index+'&page='+adjust+'>Guest</a>:': 
            '<span style="color:black">Host</span>:'}
            ${utterance.text}
        </p></div>`
        index+=1
    }
     
    text.innerHTML = para
    
    if(call === 0) {
      elm.appendChild(btn)
      elm.appendChild(page);
    }
  }
};

run();