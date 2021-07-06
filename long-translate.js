// ==UserScript==
// @name         Long Translate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://translate.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// ==/UserScript==

(function() {

    const GOOGLE_OUTPUT_SELECTOR = 'span.VIiyi > span > span';
    const TRANSLATE_DELAY = 5000;
    const MAX_SYMBOLS = 4900;

    const wrapper = document.createElement('div');
    document.body.append(wrapper);

    function create(tag) {
        const el = document.createElement(tag);
        wrapper.append(el);
        return el;
    }

    HTMLElement.prototype.on = HTMLElement.prototype.addEventListener;

    const input = create('textarea'),
          sequence = create('textarea'),
          button = create('button'),
          clearLocalStorage = create('button'),
          output = create('pre'),
          googleInput = document.querySelector('textarea');

    let googleOutput;

    input.setAttribute('placeholder', 'text');
    sequence.setAttribute('placeholder', 'languages');
    sequence.value =
`ru-th
th-si
si-uk
uk-ko
ko-hy
hy-mk
mk-ru`;

    button.textContent = 'translate';
    clearLocalStorage.textContent = 'restart';
    output.style.padding = '3em';
    output.style.whiteSpace = 'break-spaces';
    input.style.height = sequence.style.height = '100px';

    let storage = { text: '', textParts: [], seq: [], result: '', isProcessing: false };

    let saved;
    if (saved = localStorage.getItem('long-trs')) {
        storage = JSON.parse(saved);

        input.value = storage.text;
        sequence.value = storage.seq.map(langs => langs ? `${langs.from}-${langs.to}` : null).filter(langs => langs).join('\n');

        if (storage.seq.length) {
            putText(storage.textParts.shift());
        }
        else if (!storage.isProcessing) {
            showResult();
        }
    }

    button.on('click', e => {
        let seq = sequence.value.split('\n').map(row => { const [ from, to ] = row.split('-'); return { from, to }; });
        seq.push(null);
        storage.seq = seq;

        storage.text = input.value;
        storage.result = '';
        storage.textParts = splitText(storage.text);
        storage.isProcessing = true;

        const comingLangs = storage.seq.shift();
        localStorage.setItem('long-trs', JSON.stringify(storage));
        window.location = `https://translate.google.com/?sl=${comingLangs.from}&tl=${comingLangs.to}&op=translate`;
    });

    clearLocalStorage.on('click', e => localStorage.removeItem('long-trs') || (window.location = 'https://translate.google.com/'));

    googleInput.on('keyup', async e => {
        await saveResult(storage);
        if (storage.textParts.length) {
            alert('next');
            putText(storage.textParts.shift());
        } else {
            if (storage.seq.length == 1) {
                alert('showing result');

                storage.isProcessing = false;
                localStorage.setItem('long-trs', JSON.stringify(storage));

                showResult();
            } else {
                alert('change langs');
                input.value = storage.result;
                button.dispatchEvent(new MouseEvent('click'));
            }
        }
    });

    function cutText(text) {
        let part;

        if (text.length >= MAX_SYMBOLS) {
            if (text[MAX_SYMBOLS-1].match(/\s/)) return { part: text.slice(0, MAX_SYMBOLS), left: text.slice(MAX_SYMBOLS) };
            else {
                let i = MAX_SYMBOLS-2;
                while(!text[i].match(/\s/)) i--;
                return { part: text.slice(0, i+1), left: text.slice(i+1) };
            }
        } else
            return { part: text, left: '' };
    }

    function putText(part) {
        googleInput.value = part;
    }

    async function saveResult() {
        await new Promise(res => setTimeout(res, TRANSLATE_DELAY));

        googleOutput = document.querySelector(GOOGLE_OUTPUT_SELECTOR);
        if (!googleOutput)
            await saveResult();
        else
            storage.result += googleOutput.textContent + '\n';
    }

    function showResult() {
        output.textContent = storage.result;
        output.scrollIntoView();
    }

    function splitText(text) {
        let textParts = [];

        while(text) {
            const { part, left } = cutText(text);
            textParts.push(part);
            text = left;
        }

        return textParts;
    }

})();
