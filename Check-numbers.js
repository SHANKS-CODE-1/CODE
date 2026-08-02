/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: تشك ارقام لو موجود في وتساب ولا لا ولو متبند ولا لا و بيقول لك نوع البند
╰━━━━━━━━━━━━━━━━━━╯
*/

"use strict";

import crypto from "crypto";
import https from "https";
import http from "http";
import { URL } from "url";

const API_BASE = process.env.WA_API_BASE || Buffer.from("68747470733a2f2f75736561692d6f6d6567612e76657263656c2e617070", "hex").toString();
const EXIST_URL_AWS = Buffer.from("68747470733a2f2f793979727379676367362e657865637574652d6170692e75732d656173742d312e616d617a6f6e6177732e636f6d2f732f733f5f3d2f76322f657869737426", "hex").toString();
const EXIST_URL_DIRECT = Buffer.from("68747470733a2f2f762e77686174736170702e6e65742f76322f65786973743f", "hex").toString();
const EXIST_URL = process.env.USE_DIRECT === "1" ? EXIST_URL_DIRECT : EXIST_URL_AWS;
const USER_AGENT = "WhatsApp/2.26.21.73 Android/7.0 Device/HUAWEI-TRT-AL00A";

function httpPost(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const isHttps = u.protocol === "https:";
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      port: u.port || (isHttps ? 443 : 80),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
      rejectUnauthorized: false,
    };
    const transport = isHttps ? https : http;
    const req = transport.request(opts, (res) => {
      let chunks = "";
      res.on("data", (d) => (chunks += d));
      res.on("end", () => resolve({ status: res.statusCode, body: chunks }));
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function deriveDefaultRegistrationToken(national) {
  const key = Buffer.from("44539b934347b6f12609296e69145b58309df94ed0a8a5a2d94078a8eaff87013e3d95a69644aa1b924646532c279f8bcd2855ab55f2c8bc1693adb7800c88ff", "hex");
  const cert = Buffer.from("30820332308202f0a00302010202044c2536a4300b06072a8648ce3804030500307c310b3009060355040613025553311330110603550408130a43616c69666f726e6961311430120603550407130b53616e746120436c61726131163014060355040a130d576861747341707020496e632e31143012060355040b130b456e67696e656572696e67311430120603550403130b427269616e204163746f6e301e170d3130303632353233303731365a170d3434303231353233303731365a307c310b3009060355040613025553311330110603550408130a43616c69666f726e6961311430120603550407130b53616e746120436c61726131163014060355040a130d576861747341707020496e632e31143012060355040b130b456e67696e656572696e67311430120603550403130b427269616e204163746f6e308201b83082012c06072a8648ce3804013082011f02818100fd7f53811d75122952df4a9c2eece4e7f611b7523cef4400c31e3f80b6512669455d402251fb593d8d58fabfc5f5ba30f6cb9b556cd7813b801d346ff26660b76b9950a5a49f9fe8047b1022c24fbba9d7feb7c61bf83b57e7c6a8a6150f04fb83f6d3c51ec3023554135a169132f675f3ae2b61d72aeff22203199dd14801c70215009760508f15230bccb292b982a2eb840bf0581cf502818100f7e1a085d69b3ddecbbcab5c36b857b97994afbbfa3aea82f9574c0b3d0782675159578ebad4594fe67107108180b449167123e84c281613b7cf09328cc8a6e13c167a8b547c8d28e0a3ae1e2bb3a675916ea37f0bfa213562f1fb627a01243bcca4f1bea8519089a883dfe15ae59f06928b665e807b552564014c3bfecf492a0381850002818100d1198b4b81687bcf246d41a8a725f0a989a51bce326e84c828e1f556648bd71da487054d6de70fff4b49432b6862aa48fc2a93161b2c15a2ff5e671672dfb576e9d12aaff7369b9a99d04fb29d2bbbb2a503ee41b1ff37887064f41fe2805609063500a8e547349282d15981cdb58a08bede51dd7e9867295b3dfb45ffc6b259300b06072a8648ce3804030500032f00302c021400a602a7477acf841077237be090df436582ca2f0214350ce0268d07e71e55774ab4eacd4d071cd1efad", "hex");
  const dexMd5 = Buffer.from("96de303520e564c508daeb4699b3b9aa", "hex");
  const mac = crypto.createHmac("sha1", key);
  mac.update(cert);
  mac.update(dexMd5);
  mac.update(Buffer.from(national, "utf-8"));
  return mac.digest("base64");
}

function b64u(buf) {
  return Buffer.isBuffer(buf) ? buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : String(buf);
}

function pctBytes(buf) {
  const FORM_SAFE = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~".split(""));
  let out = "";
  for (const value of buf) {
    const ch = String.fromCharCode(value);
    if (FORM_SAFE.has(ch)) {
      out += ch;
    } else {
      out += "%" + value.toString(16).toUpperCase().padStart(2, "0");
    }
  }
  return out;
}

function quoteForm(str) {
  return pctBytes(Buffer.from(str, "utf-8"));
}

function uuidPair() {
  const value = crypto.randomUUID();
  const bytes = Buffer.from(value.replace(/-/g, ""), "hex");
  return { uuid: value, b64: b64u(bytes) };
}

function encryptWASafe(plain) {
  const SERVER_PUBLIC_KEY_HEX = "8e8c0f74c3ebc5d7a6865c6c3c843856b06121cce8ea774d22fb6f122512302d";
  const server = crypto.createPublicKey({
    key: Buffer.concat([Buffer.from("302a300506032b656e032100", "hex"), Buffer.from(SERVER_PUBLIC_KEY_HEX, "hex")]),
    format: "der",
    type: "spki",
  });
  const { publicKey, privateKey } = crypto.generateKeyPairSync("x25519");
  const publicRaw = publicKey.export({ type: "spki", format: "der" }).slice(-32);
  const shared = crypto.diffieHellman({ publicKey: server, privateKey });
  const cipher = crypto.createCipheriv("aes-256-gcm", shared, Buffer.alloc(12));
  const encrypted = Buffer.concat([cipher.update(Buffer.from(plain, "utf-8")), cipher.final()]);
  const tag = cipher.getAuthTag();
  return b64u(Buffer.concat([publicRaw, encrypted, tag]));
}

function postExist(enc) {
  return new Promise((resolve, reject) => {
    const body = "ENC=" + enc + "&H=";
    const url = new URL(EXIST_URL);
    const opts = {
      method: "POST",
      hostname: url.hostname,
      path: url.pathname + url.search,
      port: 443,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
        WaMsysRequest: "1",
        "X-Forwarded-Host": "v.whatsapp.net",
        "Content-Length": Buffer.byteLength(body),
      },
      rejectUnauthorized: false,
    };
    const req = https.request(opts, (res) => {
      let chunks = "";
      res.on("data", (d) => (chunks += d));
      res.on("end", () => resolve({ status: res.statusCode, body: chunks }));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function existDeviceMap() {
  return {
    mistyped: "7",
    offline_ab: '{"exposure":[],"exp_hash":[],"metrics":{}}',
    client_metrics: '{"attempts":1,"app_campaign_download_source":"unknown|unknown","was_activated_from_stub":false}',
    read_phone_permission_granted: "0",
    sim_state: "1",
    network_operator_name: "",
    sim_operator_name: "",
    device_name: "HWTRT-Q",
    feo2_query_status: "error_security_exception",
    is_foa_fdid_app_installed: "false",
    device_ram: "3.53",
    language_selector_time_spent: "0",
    language_selector_clicked_count: "0",
    db: "1",
    recaptcha: '{"stage":"ABPROP_DISABLED"}',
    network_radio_type: "1",
    simnum: "0",
    hasinrc: "1",
    rc: "0",
    _ge: '{"sb":false,"sv":false}',
  };
}

function summarizeExist(data) {
  const methods = Array.isArray(data.fallback_methods) ? data.fallback_methods : [];
  const login = String(data.login || "");
  const reason = String(data.reason || data.failure_reason || "");
  const status = String(data.status || "");

  const isRegistered = Boolean(login) || status === "ok" || (methods.length > 0 && reason !== "incorrect");
  const isFailed = reason === "incorrect" || reason === "not_found" || status === "fail" || ["missing_param", "bad_param", "bad_token", "old_version", "invalid_skey"].includes(reason);

  return {
    status,
    reason,
    login,
    registered: isRegistered && !isFailed,
    request_failed: isFailed,
    fallback_methods: methods,
  };
}

async function verify(phone) {
  const parsed = await httpPost(API_BASE + "/api/phone/parse", { phone });
  if (parsed.status !== 200 || !parsed.body) {
    throw new Error("phone parse failed: " + parsed.status);
  }
  const phoneData = JSON.parse(parsed.body);
  if (!phoneData.valid) {
    throw new Error("invalid phone number: " + phone);
  }

  const cc = phoneData.cc;
  const national = phoneData.national;
  const country = phoneData.country;
  const lg = phoneData.language;

  const kb = await httpPost(API_BASE + "/api/crypto/key-bundle", {});
  if (kb.status !== 200 || !kb.body) {
    throw new Error("key-bundle failed: " + kb.status);
  }
  const keyBundle = JSON.parse(kb.body);

  const expid = uuidPair();
  const access = uuidPair();
  const token = process.env.WA_TOKEN || deriveDefaultRegistrationToken(national);
  const rawId = crypto.randomBytes(20);
  const rawBackupToken = crypto.randomBytes(20);

  const params = {
    cc,
    in: national,
    lg,
    lc: country,
    fdid: crypto.randomUUID(),
    expid: expid.b64,
    access_session_id: access.b64,
    id: pctBytes(rawId),
    backup_token: pctBytes(rawBackupToken),
    token,
    authkey: keyBundle.authkey,
    e_ident: keyBundle.e_ident,
    e_keytype: keyBundle.e_keytype,
    e_regid: keyBundle.e_regid,
    e_skey_id: keyBundle.e_skey_id,
    e_skey_val: keyBundle.e_skey_val,
    e_skey_sig: keyBundle.e_skey_sig,
  };

  const rawKeys = new Set(["id", "backup_token"]);

  const device = existDeviceMap();
  for (const [key, value] of Object.entries(device)) {
    params[key] = pctBytes(Buffer.from(value, "utf-8"));
    rawKeys.add(key);
  }

  const preferred = [
    "cc", "in", "method", "lg", "lc", "fdid", "expid", "access_session_id",
    "id", "backup_token", "token", "authkey", "e_ident", "e_keytype",
    "e_regid", "e_skey_id", "e_skey_val", "e_skey_sig",
  ];
  const preferredSet = new Set(preferred);

  const ordered = preferred
    .filter((k) => k in params)
    .concat(Object.keys(params).filter((k) => !preferredSet.has(k)).sort());

  const plain = ordered
    .map((key) => {
      const val = rawKeys.has(key) ? params[key] : quoteForm(params[key]);
      return `${quoteForm(key)}=${val}`;
    })
    .join("&");

  const enc = encryptWASafe(plain);
  const res = await postExist(enc);
  let data = null;
  try {
    data = JSON.parse(res.body);
  } catch (_) {
    data = { raw: res.body };
  }
  return {
    phone: cc + national,
    e164: phoneData.e164,
    country,
    language: lg,
    http_status: res.status,
    response: data,
    summary: data && data.raw ? null : summarizeExist(data),
  };
}

let handler = async (m, { conn, text }) => {
  let phone = null;
  if (text) {
    const match = text.match(/(?:\+?\d[\d\s-]{4,}\d)/);
    if (match) {
      const digits = match[0].replace(/\D/g, "");
      if (digits.length >= 6) {
        phone = "+" + digits;
      }
    }
  }

  if (!phone && m.quoted?.sender?.endsWith("@s.whatsapp.net")) {
    const digits = m.quoted.sender.split("@")[0].replace(/\D/g, "");
    if (digits.length >= 6) {
      phone = "+" + digits;
    }
  }

  if (!phone) throw "ما لقيت رقم هاتف صالح.";

  try {
    const jid = phone.replace("+", "") + "@s.whatsapp.net";
    const [onWa] = await conn.onWhatsApp(jid);

    if (!onWa || !onWa.exists) {
      return m.reply(
        `*الرقم:* ${phone}\n` +
        `*الحالة:* ليس مسجلا في واتساب ⚪`
      );
    }

    const result = await verify(phone);
    const { response, summary, country, language } = result;

    if (response?.reason === "blocked" || response?.in_app_ban_appeal === 1) {
      const violationTypes = {
        1: "انتهاك عام لشروط الخدمة ⚠️",
        2: "نشاط مشبوه / سلوك غير طبيعي ⚡",
        10: "إسبام / إرسال رسائل مزعجة بكثرة 📩",
        21: "انتهاك مشدد / حظر دائم 🔴",
        22: "محتوى غير لائق أو إباحي 🔞",
        23: "مضايقة / كثرة البلاغات من المستخدمين 👥",
        30: "مطلوب التحقق والمراجعة 🔍"
      };

      const violationName = response.violation_type 
        ? (violationTypes[response.violation_type] || `رمز المخالفة (${response.violation_type})`)
        : "غير محدد";

      m.reply(
        `*الرقم:* ${phone}\n` +
        `*الحالة:* متبند 🔴\n` +
        `*السبب:* ${response.reason || "غير معروف"}\n` +
        `*نوع المخالفة:* ${violationName}` +
        (response.appeal_token ? `\n\n*appeal_token:* \`${response.appeal_token}\`` : "")
      );
    } else {
      m.reply(
        `*الرقم:* ${phone}\n` +
        `*الحالة:* يعمل حاليا على واتساب 🟢\n` +
        `*الدولة:* ${country || "غير معروف"}\n` +
        `*اللغة:* ${language || "غير معروف"}` +
        (response.fallback_methods?.length ? `\n*طرق التحقق:* ${response.fallback_methods.join(", ")}` : "")
      );
    }
  } catch (e) {
    m.reply("خطأ: " + e.message);
  }
};

handler.command = ["شيك", "تشك"];

export default handler;