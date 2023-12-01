const Imap = require("imap");
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

const openInbox = (imap) => {
  return new Promise((resolve, reject) => {
    imap.openBox("INBOX", true, (err, box) => {
      if (err) reject(err);
      else resolve(box);
    });
  });
};

const fetchUnreadEmails = (imap, box) => {
  return new Promise((resolve, reject) => {
    const f = imap.seq.fetch("1:*", {
      bodies: ["HEADER.FIELDS (IN-REPLY-TO)", "1"],
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
          lastEmail = buffer;
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
    f.once("end", () => {
      console.log("Last email:", lastEmail);
      console.log("Reply to ID:", replyToId);
      resolve({ lastEmail, replyToId });
    });
  });
};

const startEmailListening = async function () {
  imap.once("ready", async function () {
    try {
      const box = await openInbox(imap);
      await fetchUnreadEmails(imap, box);
    } catch (error) {
      console.error(error);
    }
  });
  imap.connect();
};

module.exports = startEmailListening;
