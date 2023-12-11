const Imap = require("imap");
const { setDenuncia } = require("../controllers/denuncia.controller");
require("dotenv").config();

const imap = new Imap({
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  connTimeout: 3000,
  authTimeout: 2000,
  tlsOptions: { rejectUnauthorized: false },
});

imap.on("error", function (err) {
  console.log("IMAP error:", err);
});

const openInbox = (imap) => {
  return new Promise((resolve, reject) => {
    imap.openBox("INBOX", false, (err, box) => {
      if (err) {
        reject(err);
      } else {
        resolve(box);
      }
    });
  });
};

const fetchUnreadEmails = (imap, box) => {
  return new Promise((resolve, reject) => {
    imap.search(
      [["UNSEEN", "FROM", process.env.EMAIL_COMPLAINT]],
      function (err, results) {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          resolve(null);
        } else {
          const f = imap.seq.fetch(results, {
            bodies: ["HEADER.FIELDS (IN-REPLY-TO)", "1"],
            markSeen: true,
          });
          let lastEmail = "";
          let replyToId = "";
          f.on("message", (msg, seqno) => {
            let buffer = "";
            msg.on("body", (stream, info) => {
              stream.on("data", (chunk) => {
                buffer += chunk.toString("utf8");
              });
              stream.once("end", () => {
                lastEmail = extractEmailBody(buffer);
                const match = buffer.match(/In-Reply-To: <(.*)>/);
                if (match) {
                  replyToId = match[1];
                }
              });
            });
          });
          f.once("error", (err) => {
            reject(err);
          });
          f.once("end", async () => {
            replyToId = "<" + replyToId + ">";
            const estado = extractStatus(lastEmail);
            console.log(lastEmail);
            await setDenuncia({
              denCod: replyToId,
              denEst: estado,
              denMsjEst: lastEmail,
            });
            resolve({ lastEmail, replyToId });
          });
        }
      }
    );
  });
};

const startEmailListening = async function () {
  imap.once("ready", async function () {
    try {
      const box = await openInbox(imap);
      await fetchUnreadEmails(imap, box);
    } catch (error) {
      console.error(error);
    } finally {
      imap.end();
    }
  });
  imap.connect();
};

setInterval(startEmailListening, 20000);

const extractStatus = (lastEmail) => {
  const lines = lastEmail.split("\n");
  for (let line of lines) {
    if (line.startsWith("Estado:")) {
      return line.slice(7).trim();
    }
  }
  return "Enviado";
};
function extractEmailBody(buffer) {
  const match = buffer.match(
    /In-Reply-To: <.*>([\s\S]*?)El \w+, \d+ \w+ \d+ a las \d+:\d+, <\w+@\w+\.\w+> escribi/
  );
  return match ? match[1].trim() : "";
}

module.exports = startEmailListening;
