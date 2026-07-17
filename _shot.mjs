import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForSelector("text=HAVE A QUESTION");
const el = await page.$("section.help");
await el.screenshot({ path: "C:/Users/DELL.CC/AppData/Local/Temp/claude/d--netways-Marafiq-web2/117c1b83-4b8c-44e1-8875-b5e2ab9d961f/scratchpad/help-section.png" });
await browser.close();
