var express = require("express");
var app = express();
var fs = require("fs-extra");
const puppeteer = require("puppeteer");
const hbs = require("handlebars");
const path = require("path");

const compile = async function(templateName, data) {
  const filePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
  const html = await fs.readFile(filePath, "utf-8");
  return hbs.compile(html)(data);
};

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const content = await compile("test", { title: "Hello World !" });
  // await page.goto(`data:text/html,${content}`, { waitUntil: "networkidle0" });
  await page.setContent(content);
  await page.emulateMedia("screen");
  // await page.goto("http://localhost:3000/incident-reporting/1050", {
  //   waitUntil: "networkidle0"
  // });
  const pdf = await page.pdf({
    path: "test.pdf",
    format: "A4",
    printBackground: true
  });

  await browser.close();
  console.log("pdf generated");
  return pdf;
}

app.get("/", async function(req, res) {
  await printPDF();
  const file = `${__dirname}/test.pdf`;
  // await app.delete(file);
  res.download(file);

  // Set disposition and send it.
  // res.render("index", {
  //   title: "Test Title",
  //   condition: false,
  //   h1: "Heading 1",
  //   anyArray: [1, 2, 3]
  // });
});

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
