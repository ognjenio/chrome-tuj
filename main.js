function trim(s)
{
  s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
}

function addButtons(){
  elements = $("table.category-items tr").has("td.name")
  elements.each(function(){
    cur = $(this);
    item = cur.find(".name a").attr("rel").replace("item=", "")

    wowhead = "http://www.wowhead.com/item=" + item
    ah = "https://us.battle.net/wow/en/vault/character/auction/browse?itemId=" + item

    $('<span>', {
      id: item + "_util",
      class: "util"
    }).appendTo(cur.find("td.name"));

    $('<a>',{
      html: '<img src="'+ chrome.extension.getURL('wowhead.png') + '" width=16>',
      title: 'Wowhead',
      target: "_blank",
      href: wowhead}
    ).appendTo(cur.find("#" + item + "_util"));

    $('<a>',{
      html: '<img src="'+ chrome.extension.getURL('wow.ico') + '" width=16>',
      title: 'WoW AH',
      target: "_blank",
      href: ah}
    ).appendTo(cur.find("#" + item + "_util"));

    price = []
    price[0] = $(cur.find(".price span")[0]).html()
    price[1] = $(cur.find(".price span")[1]).html()
    price[2] = $(cur.find(".price span")[2]).html()

    quantity = parseFloat($(cur.find(".quantity span")[0]).html())

    for (var i = 0; i < 3; i++){
      z = price[i];
      if (z != null)
      {
        if (z.indexOf("g") > -1){
          z = z.replace('g', '')
          z = parseFloat(z) * 10000;
        }
        else if (z.indexOf("s") > -1){
          z = z.replace('s', '')
          z = parseFloat(z) * 100;
        }
        else if (z.indexOf("c") > -1){
          z = z.replace('c', '')
          z = parseFloat(z);
        }
        price[i] = z;
      }
    }

    qualifier = "low";

    if ((
      (price[0] < price[1] * 0.2 && price[0]+500000 < price[1]) ||
      (price[0] < price[1] * 0.3 && price[0]+1500000 < price[1]) ||
      (price[0] < price[1] * 0.4 && price[0]+3000000 < price[1]) ||
      (price[0] < price[1] * 0.1)
    ) && quantity < 3)
    {
      qualifier = "high";
    }
    else if ((
      (price[0] < price[1] * 0.3 && price[0]+500000 < price[1]) ||
      (price[0] < price[1] * 0.45 && price[0]+1500000 < price[1]) ||
      (price[0] < price[1] * 0.6 && price[0]+3000000 < price[1]) ||
      (price[0] < price[1] * 0.2)
    ) && quantity < 5)
    {
      qualifier = "medium";
    }

    ratio = (price[0] / price[1]) * 100
    profit = (price[1] - price[0])/10000


    $('<div>',{
      html: ratio.toFixed(0) + "% | " + profit.toFixed(0) + "g",
      class: "qualifier " + qualifier
    }).appendTo(cur.find("#" + item + "_util"));





  });
}

setTimeout(function(){
    addButtons();
}, 2000);
