'use strict';
{
    const random_sentence_url_api = "https://api.quotable.io/random";
    const typeDisplay = document.querySelector('#type-display');
    const typeInput = document.querySelector('#typeinput');
    const timer = document.querySelector('#timer');
    // 音源のインスタンス化
    const typeSound = new Audio("./audio/typing-sound.mp3");
    const wrongSound = new Audio("./audio/wrong.mp3");
    const correctSound = new Audio("./audio/correct.mp3");


    // テキストの正誤判定
    typeInput.addEventListener('input', () => {
        // タイプ音をつける
        typeSound.play();
        // console.log(typeSound);
        typeSound.currentTime = 0;
        const sentenceArray = typeDisplay.querySelectorAll('span');
        // console.log(sentenceArray);
        const arrayValue = typeInput.value.split("");
        // フラグを立てる
        let correct = true;
        // console.log(arrayValue);
        sentenceArray.forEach((charsSpan,index) => {
            if((arrayValue[index] == null)) {
                charsSpan.classList.remove('corrected');
                charsSpan.classList.remove('incorrected');
                correct = false;
            } else if(charsSpan.innerHTML == arrayValue[index]) {
                charsSpan.classList.add('corrected');
                charsSpan.classList.remove('incorrected');
            } else {
                charsSpan.classList.add('incorrected');
                charsSpan.classList.remove('corrected');
                wrongSound.play();
                wrongSound.currentTime = 0;
                correct = false;
            }
        });
        if(correct == true) {
            correctSound.play();
            correctSound.currentTime = 0;
            renderNextSentence();
        }
    })

    // 非同期でランダムに取得する。この部分は最悪配列でもよい
    function getRandomSentence () {
        return fetch(random_sentence_url_api).then((response) => response.json()).then((data) => data.content);
    } 
    // ランダムな文章を取得して表示する
    async function renderNextSentence() {
        const sentence = await getRandomSentence();
        // console.log(sentence);
        typeDisplay.innerHTML =  "";
        // 文字を1つずつ分解してspanタグを生成する
        let oneText = sentence.split("");
        oneText.forEach((chars) => {
            const charsSpan = document.createElement('span');
            charsSpan.innerText = chars;
            // console.log(charsSpan);
            typeDisplay.appendChild(charsSpan);
            // charsSpan.classList.add('corrected');
        });
        typeInput.value  = "";
        startTimer();

    }
    let startTime;
    let originTime = 60;
    function startTimer() {
        timer.innerHTML = originTime;
        startTime = new Date();
        setInterval(() => {
            timer.innerHTML = originTime - getTimerTime();
            if(timer.innerHTML <= 0) TimeUp();
        },1000);
    }
    function getTimerTime () {
        return Math.floor((new Date() - startTime ) / 1000);
    }
    function TimeUp() {
        renderNextSentence();
    }
    renderNextSentence();

}