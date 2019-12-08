// SpeechRecognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US';

let p = document.createElement('p');
const words = document.querySelector('.speech-box');
const clearBtn = document.getElementById('clear-text');
const copyBtn = document.getElementById('copy-text');
clearBtn.addEventListener('click', ()=> {
  words.innerHTML = '';
});
words.appendChild(p);

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');

  const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩');
  p.textContent = poopScript;

  if (e.results[0].isFinal) {
    p = document.createElement('p');
    words.appendChild(p);
    const scrollHeight = words.scrollHeight;
    words.scrollTop = words.scrollHeight;
  }
});

recognition.addEventListener('end', recognition.start);
recognition.start();

copyBtn.addEventListener('click', () => {
  //rangeオブジェクトの作成
  var range = document.createRange();
  //取得した要素の内側を範囲とする
  range.selectNodeContents(words);
  //範囲を選択状態にする
  window.getSelection().addRange(range);
  document.execCommand('copy');
})

// record
var recordButton, stopButton, recorder;

window.onload = function () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');

  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia({
    audio:true
  })
  .then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    // make mediaRecorder
    recorder = new MediaRecorder(stream);

    // listen to dataavailable, which gets triggered whenever we have an audio blob available
    // dataavailable イベントが発生してからキャプチャされたすべてのメディアデータが引き渡されます。 その後、新しい Blob が作成され、メディアのキャプチャがその blob に対して続行されます。
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
}

function startRecording() {
  // recordボタンを無効化してstopボタンを押せるようにする
  recordButton.disabled = true;
  stopButton.disabled = false;
  recordButton.classList.toggle("show");
  stopButton.classList.toggle("show");

  recorder.start();
}

function stopRecording() {
  // stopボタンを無効化してrecordボタンを押せるようにする
  recordButton.disabled = false;
  stopButton.disabled = true;
  recordButton.classList.toggle("show");
  stopButton.classList.toggle("show");

  // stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
  recognition.stop();
}

function onRecordingReady(e) {
  var audio = document.getElementById('audio');
  // e.data contains a blob representing the recording
  audio.src = URL.createObjectURL(e.data);
  audio.play();
}


