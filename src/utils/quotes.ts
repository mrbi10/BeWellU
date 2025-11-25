export const motivationalQuotes = [
  {
    text: "Chinna step eduthaale periya journey start aagum da en chola.",
    author: " "
  },
  {
    text: "Success nu oru end illa ma, fail anaalum nikkaama munneranum da en papu.",
    author: " "
  },
  {
    text: "Nee mudiyum nu nambina, adhe half victory da en kutty.",
    author: " "
  },
  {
    text: "Time pathi yosikadha baby… neenga work pannunga, namma growth automatic varum.",
    author: " "
  },
  {
    text: "Unakku pidicha vishayathula heart la irundhu pannuna, adhe thaan periya work da bujjy.",
    author: " "
  },
  {
    text: "Unga health ah paathukardhu expense illa ma… investment da en ammu.",
    author: " "
  },
  {
    text: "Intha body thaan namma veedu ma… adha nalla paathukko en chinnu.",
    author: " "
  },
  {
    text: "Daily konjam konjama improve pannina, nalaiku nee shock aagiruvaa da kutty.",
    author: " "
  },
  {
    text: "Start panna thaan venum ma, great aah irukanum nu avasiyam illa en papu.",
    author: " "
  },
  {
    text: "Namma future ellam inikku nama seyyra actions la iruku da en chola.",
    author: " "
  },
  {
    text: "Unakku pidicha padippu ah love pannitu padicha, athu thaan real genius da baby.",
    author: " "
  },
  {
    text: "Padikkara payyan/ponnu thaan nalaiku namma world ah shape pannuva… so ready aagiko en kutty.",
    author: " "
  },
  {
    text: "Thanni kudichaale health glow aagum da bujjy… hydration super important.",
    author: " "
  },
  {
    text: "Un mind sollra ellathayum body kekkum ma… positive aa irundha life um positive aagum.",
    author: " "
  },
  {
    text: "Health nalla irundha thaan happy aah irukka mudiyum ma… so unnu paathuko my sweet one.",
    author: " "
  }
];

export function getDailyQuote(): { text: string; author: string } {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime())
      / 1000 / 60 / 60 / 24
  );
  return motivationalQuotes[dayOfYear % motivationalQuotes.length];
}
