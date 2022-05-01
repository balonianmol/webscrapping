// const { default: async } = require("async");
const puppeteer = require("puppeteer");
const scrapmobile = async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      "https://www.flipkart.com/mobiles/pr?sid=tyy,4io&q=mobiles&otracker=categorytree"
    );
    const mobiledata = await page.evaluate(() => {
      let mobiledatastore = [];
      let mobilestatus = document.getElementsByClassName("_3pLy-c row");
      for (let i = 0; i < mobilestatus.length; i++) {
        let name = mobilestatus.item(i);

        let mobileheaderdata =
          name.getElementsByClassName("_4rR01T")[0].innerText;
        let pricedata =
          name.getElementsByClassName("_30jeq3 _1_WHN1")[0].innerText;
        mobiledatastore[i] = {
          productname: mobileheaderdata,
          price: pricedata,
        };
      }
      return mobiledatastore;
    });
    res.send(mobiledata);
    await browser.close();
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const scraptshirt = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      dumpio: true
    });
    const page = await browser.newPage();
    await page.goto("https://www.snapdeal.com/products/mens-tshirts-polos");
    const tshirtdata = await page.evaluate(() => {
      let tshirtdatastore = [];
      let tshirtstatus = document.getElementsByClassName("product-tuple-description")
      for (let i = 0; i < tshirtstatus.length; i++) {
        let tname = tshirtstatus.item(i);
        let t_shirtdata = tname.getElementsByClassName("product-title")[0].innerText
        let t_cost = tname.getElementsByClassName("lfloat product-price")[0].innerText
        tshirtdatastore[i] = {
          product: t_shirtdata,
          price: t_cost,
        };
      }
      return tshirtdatastore
    })
    res.send(tshirtdata)

    await browser.close();
  }
  catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }

}
const getMobileSpecs = async (browser, mobileScrapFull) => {
  const allHighlights = [];
  for (let i = 0; i < mobileScrapFull.length; i++) {
  const newPage = await browser.newPage();
  
  await newPage.goto(mobileScrapFull[i].url);
  
  const highlights = await newPage.$$eval("._21Ahn-", (list) =>
  list.map((li) => li.innerText)
  );
  allHighlights.push(highlights);
  }
  await browser.close();
  return allHighlights;
  };
const scrapmobilefull = async (req, res) => {
  try{
    const browser = await puppeteer.launch({
    dumpio: true,
    });
    
    const page = await browser.newPage();
    
    await page.goto(
    "https://www.flipkart.com/search?q=mobiles&as=on&as-show=on&otracker=AS_Query_TrendingAutoSuggest_1_0_na_na_na&otracker1=AS_Query_TrendingAutoSuggest_1_0_na_na_na&as-pos=1&as-type=TRENDING&suggestionId=mobiles&requestId=5c95024f-641d-460d-bbdd-ed303169a304"
    );
    
    const mobileScrapFull = await page.evaluate(async () => {
    const allMobiles = [];
    const mobileDataScrapUrlStore =
    document.getElementsByClassName("_2kHMtA");
    
    for (let i = 0; i < mobileDataScrapUrlStore.length; i++) {
    let mname = mobileDataScrapUrlStore[i];
    const url = mname.getElementsByClassName("_1fQZEK")[0].href;
    
    const name = mname.getElementsByClassName("_4rR01T")[0].innerText;
    allMobiles.push({ url, name });
    }
    return allMobiles;
    });
    
    const allHighlights = await getMobileSpecs(browser, mobileScrapFull);
    
    for (let i = 0; i < mobileScrapFull.length; i++) {
    mobileScrapFull[i].highlights = [...allHighlights[i]];
    }
    
    console.log(mobileScrapFull);
    await browser.close();
    res.json(mobileScrapFull)
  }
  catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
}
module.exports = { scrapmobile, scraptshirt, scrapmobilefull };
