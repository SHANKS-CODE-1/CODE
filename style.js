/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: 
│ .style <النص>            - يرجّع كل أشكال الزخرفة المتاحة
│ .style <رقم> <النص>      - يرجّع شكل واحد بس (رقمه من القايمة)
│
│ ملحوظة: الأشكال اللي بتعتمد على رموز يونيكود خاصة (بولد/إيطاليك/فراكتور...)
│ شغالة كويس مع الحروف الإنجليزية والأرقام فقط (حدود يونيكود الرسمية).
│ الأشكال اللي عبارة عن "تأطير برموز" أو "خط فوق/تحت الحروف" شغالة مع أي لغة
│ (عربي/إنجليزي/أي حاجة)
╰━━━━━━━━━━━━━━━━━━╯
*/

function mapRange(text, { upper, lower, digit, exUpper = {}, exLower = {} } = {}) {
    let out = '';
    for (const ch of text) {
        const code = ch.codePointAt(0);
        if (code >= 65 && code <= 90) { 
            out += exUpper[ch] || (upper !== undefined ? String.fromCodePoint(upper + (code - 65)) : ch);
        } else if (code >= 97 && code <= 122) { 
            out += exLower[ch] || (lower !== undefined ? String.fromCodePoint(lower + (code - 97)) : ch);
        } else if (code >= 48 && code <= 57 && digit !== undefined) { 
            out += String.fromCodePoint(digit + (code - 48));
        } else {
            out += ch;
        }
    }
    return out;
}


const EX = {
    italicLower: { h: 'ℎ' },
    scriptUpper: { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ' },
    scriptLower: { e: 'ℯ', g: 'ℊ', o: 'ℴ' },
    frakturUpper: { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' },
    doubleUpper: { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' }
};


const FLIP = {
    a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ',
    k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ',
    u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
    A: '∀', B: 'B', C: 'Ɔ', D: 'D', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I', J: 'ſ',
    K: 'K', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Q', R: 'R', S: 'S', T: '⊥',
    U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
    '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
    '.': '˙', ',': "'", "'": ',', '?': '¿', '!': '¡', '"': ',,', '_': '‾'
};
function flipText(text) {
    return [...text].reverse().map(ch => FLIP[ch] ?? ch).join('');
}


const SMALL_CAPS = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ',
    k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ꞯ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ',
    u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
};
function smallCaps(text) {
    return [...text].map(ch => SMALL_CAPS[ch.toLowerCase()] ?? ch).join('');
}


function withCombining(text, mark) {
    return [...text].map(ch => (ch === ' ' ? ch : ch + mark)).join('');
}


const SUPER = {
    a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ',
    k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', q: 'q', r: 'ʳ', s: 'ˢ', t: 'ᵗ',
    u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
    A: 'ᴬ', B: 'ᴮ', C: 'C', D: 'ᴰ', E: 'ᴱ', F: 'F', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ',
    K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', Q: 'Q', R: 'ᴿ', S: 'S', T: 'ᵀ',
    U: 'ᵁ', V: 'ⱽ', W: 'ᵂ', X: 'X', Y: 'Y', Z: 'Z',
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
};
function toSuperscript(text) {
    return [...text].map(ch => SUPER[ch] ?? ch).join('');
}


const SUB = {
    a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ',
    p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
};
function toSubscript(text) {
    return [...text].map(ch => SUB[ch.toLowerCase()] ?? ch).join('');
}


const ZALGO_UP = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314'];
const ZALGO_DOWN = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0347', '\u0348', '\u0349', '\u0323'];
const ZALGO_MID = ['\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328'];

function zalgo(text, intensity = 3) {
    return [...text].map(ch => {
        if (ch === ' ') return ch;
        let out = ch;
        for (let i = 0; i < intensity; i++) out += ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)];
        for (let i = 0; i < intensity; i++) out += ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)];
        if (Math.random() < 0.5) out += ZALGO_MID[Math.floor(Math.random() * ZALGO_MID.length)];
        return out;
    }).join('');
}


function toFlags(text) {
    return [...text].map(ch => {
        const up = ch.toUpperCase();
        const code = up.codePointAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F1E6 + (code - 65));
        return ch;
    }).join(' ');
}


function widenText(text) {
    return [...text].join(' ');
}


function buildStyles(text) {
    const styles = [];
    const add = (name, value) => styles.push({ name, value });

    add('Bold', mapRange(text, { upper: 0x1D400, lower: 0x1D41A, digit: 0x1D7CE }));
    add('Italic', mapRange(text, { upper: 0x1D434, lower: 0x1D44E, exLower: EX.italicLower }));
    add('Bold Italic', mapRange(text, { upper: 0x1D468, lower: 0x1D482 }));
    add('Script', mapRange(text, { upper: 0x1D49C, lower: 0x1D4B6, exUpper: EX.scriptUpper, exLower: EX.scriptLower }));
    add('Bold Script', mapRange(text, { upper: 0x1D4D0, lower: 0x1D4EA }));
    add('Fraktur', mapRange(text, { upper: 0x1D504, lower: 0x1D51E, exUpper: EX.frakturUpper }));
    add('Bold Fraktur', mapRange(text, { upper: 0x1D56C, lower: 0x1D586 }));
    add('Double-Struck', mapRange(text, { upper: 0x1D538, lower: 0x1D552, digit: 0x1D7D8, exUpper: EX.doubleUpper }));
    add('Sans-Serif', mapRange(text, { upper: 0x1D5A0, lower: 0x1D5BA, digit: 0x1D7E2 }));
    add('Sans Bold', mapRange(text, { upper: 0x1D5D4, lower: 0x1D5EE, digit: 0x1D7EC }));
    add('Sans Italic', mapRange(text, { upper: 0x1D608, lower: 0x1D622 }));
    add('Sans Bold Italic', mapRange(text, { upper: 0x1D63C, lower: 0x1D656 }));
    add('Monospace', mapRange(text, { upper: 0x1D670, lower: 0x1D68A, digit: 0x1D7F6 }));
    add('Circled', mapRange(text, { upper: 0x24B6, lower: 0x24D0 }));
    add('Circled (Black)', mapRange(text.toUpperCase(), { upper: 0x1F150 })); 
    add('Squared', mapRange(text.toUpperCase(), { upper: 0x1F130 })); 
    add('Squared (Black)', mapRange(text.toUpperCase(), { upper: 0x1F170 })); 
    add('Parenthesized', mapRange(text.toLowerCase(), { lower: 0x249C })); 
    add('Superscript', toSuperscript(text));
    add('Subscript', toSubscript(text));
    add('Regional (Flags)', toFlags(text));
    add('Wide (Spaced)', widenText(text));
    add('Mirror', [...text].reverse().join(''));
    add('Dotted', withCombining(text, '\u0307'));
    add('Zalgo (ملعون)', zalgo(text));
    add('Fullwidth', [...text].map(ch => {
        const c = ch.codePointAt(0);
        if (c === 32) return '\u3000';
        if (c >= 33 && c <= 126) return String.fromCodePoint(c + 0xFEE0);
        return ch;
    }).join(''));
    add('Small Caps', smallCaps(text));
    add('Upside Down', flipText(text));
    add('Strikethrough', withCombining(text, '\u0336'));
    add('Underline', withCombining(text, '\u0332'));

    
    const wraps = [
        t => `꧁༺${t}༻꧂`,
        t => `•°•.${t}.•°•`,
        t => `『${t}』`,
        t => `【${t}】`,
        t => `☬${t}☬`,
        t => `꧁${t}꧂`,
        t => `✦${t}✦`,
        t => `▁▂▃${t}▃▂▁`,
        t => `𓆩${t}𓆪`,
        t => `»–(${t})–«`
    ];
    wraps.forEach((fn, i) => add(`تأطير ${i + 1}`, fn(text)));

    return styles;
}

const handler = async (m, { text, args }) => {
    if (!text || !text.trim()) {
        return m.reply('❌ اكتب النص اللي عايز تزخرفه.\n\nمثال:\n» *.style Shanks*\n» *.style 3 Shanks* (لشكل رقم 3 بس)');
    }

    const maybeNum = parseInt(args[0]);
    let target = text.trim();
    let onlyIndex = null;

    if (Number.isInteger(maybeNum) && args.length > 1) {
        onlyIndex = maybeNum;
        target = args.slice(1).join(' ');
    }

    const styles = buildStyles(target);

    if (onlyIndex !== null) {
        const picked = styles[onlyIndex - 1];
        if (!picked) return m.reply(`❌ مفيش شكل بالرقم ده. متاح من 1 لـ ${styles.length}.`);
        return m.reply(picked.value);
    }

    const lines = styles.map((s, i) => `${i + 1}. ${s.value}`);
    const result =
        `꒰🖋꒱ *زخارف النص: ${target}*\n\n` +
        lines.join('\n') +
        `\n\n💡 لشكل واحد بس: *.style <رقم> ${target}*`;

    await m.reply(result);
};

handler.help = ['style <text>', 'style <رقم> <text>'];
handler.tags = ['tools'];
handler.command = ['style', 'زخرفة', 'زخرف'];

export default handler;