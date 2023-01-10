
const stopWordsObject = {
  "a":1,
  "acaba":1,
  "altı":1,
  "ama":1,
  "ancak":1,
  "artık":1,
  "asla":1,
  "aslında":1,
  "az":1,
  "b":1,
  "bana":1,
  "bazen":1,
  "bazı":1,
  "bazıları":1,
  "bazısı":1,
  "belki":1,
  "ben":1,
  "beni":1,
  "benim":1,
  "beş":1,
  "bile":1,
  "bir":1,
  "birçoğu":1,
  "birçok":1,
  "birçokları":1,
  "biri":1,
  "birisi":1,
  "birkaç":1,
  "birkaçı":1,
  "birşey":1,
  "birşeyi":1,
  "biz":1,
  "bize":1,
  "bizi":1,
  "bizim":1,
  "böyle":1,
  "böylece":1,
  "bu":1,
  "buna":1,
  "bunda":1,
  "bundan":1,
  "bunu":1,
  "bunun":1,
  "burada":1,
  "bütün":1,
  "c":1,
  "ç":1,
  "çoğu":1,
  "çoğuna":1,
  "çoğunu":1,
  "çok":1,
  "çünkü":1,
  "d":1,
  "da":1,
  "daha":1,
  "de":1,
  "değil":1,
  "demek":1,
  "diğer":1,
  "diğeri":1,
  "diğerleri":1,
  "diye":1,
  "dokuz":1,
  "dolayı":1,
  "dört":1,
  "e":1,
  "elbette":1,
  "en":1,
  "f":1,
  "fakat":1,
  "falan":1,
  "felan":1,
  "filan":1,
  "g":1,
  "gene":1,
  "gibi":1,
  "ğ":1,
  "h":1,
  "hâlâ":1,
  "hangi":1,
  "hangisi":1,
  "hani":1,
  "hatta":1,
  "hem":1,
  "henüz":1,
  "hep":1,
  "hepsi":1,
  "hepsine":1,
  "hepsini":1,
  "her":1,
  "her":1,
  "herkes":1,
  "herkese":1,
  "herkesi":1,
  "hiç":1,
  "hiç":1,
  "hiçbiri":1,
  "hiçbirine":1,
  "hiçbirini":1,
  "ı":1,
  "i":1,
  "için":1,
  "içinde":1,
  "iki":1,
  "ile":1,
  "ise":1,
  "işte":1,
  "j":1,
  "k":1,
  "kaç":1,
  "kadar":1,
  "kendi":1,
  "kendine":1,
  "kendini":1,
  "ki":1,
  "kim":1,
  "kime":1,
  "kimi":1,
  "kimin":1,
  "kimisi":1,
  "l":1,
  "m":1,
  "madem":1,
  "mı":1,
  "mı":1,
  "mi":1,
  "mu":1,
  "mu":1,
  "mü":1,
  "mü":1,
  "n":1,
  "nasıl":1,
  "ne":1,
  "ne":1,
  "neden":1,
  "nedir":1,
  "nerde":1,
  "nerede":1,
  "nereden":1,
  "nereye":1,
  "nesi":1,
  "neyse":1,
  "niçin":1,
  "niye":1,
  "o":1,
  "on":1,
  "ona":1,
  "ondan":1,
  "onlar":1,
  "onlara":1,
  "onlardan":1,
  "onların":1,
  "onların":1,
  "onu":1,
  "onun":1,
  "orada":1,
  "oysa":1,
  "oysaki":1,
  "ö":1,
  "öbürü":1,
  "ön":1,
  "önce":1,
  "ötürü":1,
  "öyle":1,
  "p":1,
  "r":1,
  "rağmen":1,
  "s":1,
  "sana":1,
  "sekiz":1,
  "sen":1,
  "senden":1,
  "seni":1,
  "senin":1,
  "siz":1,
  "sizden":1,
  "size":1,
  "sizi":1,
  "sizin":1,
  "son":1,
  "sonra":1,
  "ş":1,
  "şayet":1,
  "şey":1,
  "şeyden":1,
  "şeye":1,
  "şeyi":1,
  "şeyler":1,
  "şimdi":1,
  "şöyle":1,
  "şu":1,
  "şuna":1,
  "şunda":1,
  "şundan":1,
  "şunlar":1,
  "şunu":1,
  "şunun":1,
  "t":1,
  "tabi":1,
  "tamam":1,
  "tüm":1,
  "tümü":1,
  "u":1,
  "ü":1,
  "üç":1,
  "üzere":1,
  "v":1,
  "var":1,
  "ve":1,
  "veya":1,
  "veyahut":1,
  "y":1,
  "ya":1,
  "ya":1,
  "yani":1,
  "yedi":1,
  "yerine":1,
  "yine":1,
  "yoksa":1,
  "z":1,
  "zaten":1,
  "zira":1,
  "https": 1,
  "http": 1,
};

const stopWordsList = [
  "a",
  "acaba",
  "altı",
  "ama",
  "ancak",
  "artık",
  "asla",
  "aslında",
  "az",
  "b",
  "bana",
  "bazen",
  "bazı",
  "bazıları",
  "bazısı",
  "belki",
  "ben",
  "beni",
  "benim",
  "beş",
  "bile",
  "bir",
  "birçoğu",
  "birçok",
  "birçokları",
  "biri",
  "birisi",
  "birkaç",
  "birkaçı",
  "birşey",
  "birşeyi",
  "biz",
  "bize",
  "bizi",
  "bizim",
  "böyle",
  "böylece",
  "bu",
  "buna",
  "bunda",
  "bundan",
  "bunu",
  "bunun",
  "burada",
  "bütün",
  "c",
  "ç",
  "çoğu",
  "çoğuna",
  "çoğunu",
  "çok",
  "çünkü",
  "d",
  "da",
  "daha",
  "de",
  "değil",
  "demek",
  "diğer",
  "diğeri",
  "diğerleri",
  "diye",
  "dokuz",
  "dolayı",
  "dört",
  "e",
  "elbette",
  "en",
  "f",
  "fakat",
  "falan",
  "felan",
  "filan",
  "g",
  "gene",
  "gibi",
  "ğ",
  "h",
  "hâlâ",
  "hangi",
  "hangisi",
  "hani",
  "hatta",
  "hem",
  "henüz",
  "hep",
  "hepsi",
  "hepsine",
  "hepsini",
  "her",
  "her",
  "herkes",
  "herkese",
  "herkesi",
  "hiç",
  "hiç",
  "hiçbiri",
  "hiçbirine",
  "hiçbirini",
  "ı",
  "i",
  "için",
  "içinde",
  "iki",
  "ile",
  "ise",
  "işte",
  "j",
  "k",
  "kaç",
  "kadar",
  "kendi",
  "kendine",
  "kendini",
  "ki",
  "kim",
  "kime",
  "kimi",
  "kimin",
  "kimisi",
  "l",
  "m",
  "madem",
  "mı",
  "mı",
  "mi",
  "mu",
  "mu",
  "mü",
  "mü",
  "n",
  "nasıl",
  "ne",
  "ne",
  "neden",
  "nedir",
  "nerde",
  "nerede",
  "nereden",
  "nereye",
  "nesi",
  "neyse",
  "niçin",
  "niye",
  "o",
  "on",
  "ona",
  "ondan",
  "onlar",
  "onlara",
  "onlardan",
  "onların",
  "onların",
  "onu",
  "onun",
  "orada",
  "oysa",
  "oysaki",
  "ö",
  "öbürü",
  "ön",
  "önce",
  "ötürü",
  "öyle",
  "p",
  "r",
  "rağmen",
  "s",
  "sana",
  "sekiz",
  "sen",
  "senden",
  "seni",
  "senin",
  "siz",
  "sizden",
  "size",
  "sizi",
  "sizin",
  "son",
  "sonra",
  "ş",
  "şayet",
  "şey",
  "şeyden",
  "şeye",
  "şeyi",
  "şeyler",
  "şimdi",
  "şöyle",
  "şu",
  "şuna",
  "şunda",
  "şundan",
  "şunlar",
  "şunu",
  "şunun",
  "t",
  "tabi",
  "tamam",
  "tüm",
  "tümü",
  "u",
  "ü",
  "üç",
  "üzere",
  "v",
  "var",
  "ve",
  "veya",
  "veyahut",
  "y",
  "ya",
  "ya",
  "yani",
  "yedi",
  "yerine",
  "yine",
  "yoksa",
  "z",
  "zaten",
  "zira",
  "https",
  "http",
];


module.exports = {
  stopWordsObject,
  stopWordsList
};