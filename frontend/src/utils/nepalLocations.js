/**
 * Nepal Administrative Divisions Data
 * 7 Provinces, 77 Districts, and Major Municipalities/Cities
 */

export const NEPAL_PROVINCES = [
  {
    id: "koshi",
    name: "Koshi Province",
    districts: [
      { name: "Bhojpur", cities: ["Bhojpur", "Shadananda", "Hatuwagadhi", "Pauwadungma"] },
      { name: "Dhankuta", cities: ["Dhankuta", "Pakhribas", "Mahalaxmi", "Hile"] },
      { name: "Ilam", cities: ["Ilam", "Deumai", "Mai", "Suryodaya", "Pashupatinagar"] },
      { name: "Jhapa", cities: ["Birtamod", "Damak", "Bhadrapur", "Mechinagar (Kakarbhitta)", "Kankai", "Arjundhara", "Shivasatakshi", "Gauradaha"] },
      { name: "Khotang", cities: ["Diktel Rupakot Majhuwagadhi", "Halesi Tuwachung"] },
      { name: "Morang", cities: ["Biratnagar Metropolitan", "Sundarharaicha", "Belbari", "Pathari Shanischare", "Urlabari", "Rangeli", "Ratuwamai", "Sunbarshi"] },
      { name: "Okhaldhunga", cities: ["Siddhicharan", "Rumjatar"] },
      { name: "Panchthar", cities: ["Phidim", "Hilihang"] },
      { name: "Sankhuwasabha", cities: ["Khandbari", "Chainpur", "Dharmadevi", "Madi", "Panchakhapan"] },
      { name: "Solukhumbu", cities: ["Solu Dudhkunda (Salleri)", "Namche Bazaar", "Lukla"] },
      { name: "Sunsari", cities: ["Dharan Sub-Metropolitan", "Itahari Sub-Metropolitan", "Inaruwa", "Ramdhuni", "Barahakshetra", "Duhabi"] },
      { name: "Taplejung", cities: ["Phungling", "Olangchung Gola"] },
      { name: "Terhathum", cities: ["Myanglung", "Laligurans", "Basantapur"] },
      { name: "Udayapur", cities: ["Triyuga (Gaighat)", "Katari", "Chaudandigadhi", "Belaka"] },
    ],
  },
  {
    id: "madhesh",
    name: "Madhesh Province",
    districts: [
      { name: "Bara", cities: ["Kalaiya Sub-Metropolitan", "Jitpur Simara Sub-Metropolitan", "Kolhabi", "Nijgadh", "Mahagadhimai", "Simraungadh"] },
      { name: "Dhanusha", cities: ["Janakpur Sub-Metropolitan", "Mithila", "Sabaila", "Shahidnagar", "Dhanusadham", "Ganeshman Charnath", "Chhireshwarnath", "Dhalkebar"] },
      { name: "Mahottari", cities: ["Jaleshwar", "Bardibas", "Gaushala", "Bhangaha", "Loharpatti", "Matihani", "Ramgopalpur"] },
      { name: "Parsa", cities: ["Birgunj Metropolitan", "Pokhariya", "Bahudaramai", "Parsagadhi"] },
      { name: "Rautahat", cities: ["Gaur", "Chandrapur", "Garuda", "Gujara", "Brindaban", "Maulapur", "Rajdevi"] },
      { name: "Saptari", cities: ["Rajbiraj", "Kanchanrup", "Dakneshwari", "Bodebarsain", "Sambhunath", "Surunga", "Hanumannagar Kankalini"] },
      { name: "Sarlahi", cities: ["Malangwa", "Barahathawa", "Hariwan", "Ishwarpur", "Haripur", "Lalbandi", "Godaita", "Bagmati"] },
      { name: "Siraha", cities: ["Siraha", "Lahan", "Golbazar", "Mirchaiya", "Kalyanpur", "Dhangadhimai", "Sukhipur"] },
    ],
  },
  {
    id: "bagmati",
    name: "Bagmati Province",
    districts: [
      { name: "Bhaktapur", cities: ["Bhaktapur", "Madhyapur Thimi", "Suryabinayak", "Changunarayan"] },
      { name: "Chitwan", cities: ["Bharatpur Metropolitan", "Ratnanagar", "Khairahani", "Madi", "Rapti", "Kalika", "Sauraha"] },
      { name: "Dhading", cities: ["Nilkantha (Dhading Besi)", "Dhunibesi", "Gajuri", "Malekhu"] },
      { name: "Dolakha", cities: ["Bhimeshwar (Charikot)", "Jiri"] },
      { name: "Kathmandu", cities: ["Kathmandu Metropolitan", "Kirtipur", "Budhanilkantha", "Chandragiri", "Tokha", "Tarakeshwar", "Nagarjun", "Gokarneshwar", "Shankharapur", "Dakshinkali", "Kageshwari-Manohara"] },
      { name: "Kavrepalanchok", cities: ["Dhulikhel", "Banepa", "Panauti", "Panchkhal", "Namobuddha", "Mandandeupur"] },
      { name: "Lalitpur", cities: ["Lalitpur Metropolitan (Patan)", "Mahalaxmi", "Godawari"] },
      { name: "Makwanpur", cities: ["Hetauda Sub-Metropolitan", "Thaha", "Bhimphedi"] },
      { name: "Nuwakot", cities: ["Bidur", "Belkotgadhi", "Trishuli"] },
      { name: "Ramechhap", cities: ["Manthali", "Ramechhap"] },
      { name: "Rasuwa", cities: ["Dhunche", "Kalika", "Gosaikunda", "Syabrubesi"] },
      { name: "Sindhuli", cities: ["Kamalamai (Sindhulimadi)", "Dudhauli"] },
      { name: "Sindhupalchok", cities: ["Chautara Sangachokgadhi", "Melamchi", "Barhabise", "Tatopani"] },
    ],
  },
  {
    id: "gandaki",
    name: "Gandaki Province",
    districts: [
      { name: "Baglung", cities: ["Baglung", "Dhorpatan", "Jaimini", "Galkot"] },
      { name: "Gorkha", cities: ["Gorkha", "Palungtar", "Arughat"] },
      { name: "Kaski", cities: ["Pokhara Metropolitan", "Lekhnath"] },
      { name: "Lamjung", cities: ["Besisahar", "Sundarbazar", "Madhyanepal", "Rainas"] },
      { name: "Manang", cities: ["Chame", "Manang", "Neshyang"] },
      { name: "Mustang", cities: ["Jomsom", "Gharapjhong", "Thasang", "Lomanthang", "Muktinath"] },
      { name: "Myagdi", cities: ["Beni", "Galeshwor"] },
      { name: "Nawalpur (Nawalparasi East)", cities: ["Kawasoti", "Gaindakot", "Devchuli", "Madhyabindu"] },
      { name: "Parbat", cities: ["Kushma", "Phalebas"] },
      { name: "Syangja", cities: ["Putalibazar", "Waling", "Galyang", "Chapakot", "Bhirkot"] },
      { name: "Tanahun", cities: ["Vyas (Damauli)", "Shuklagandaki", "Bhanu", "Bhimad", "Dumre", "Bandipur"] },
    ],
  },
  {
    id: "lumbini",
    name: "Lumbini Province",
    districts: [
      { name: "Arghakhanchi", cities: ["Sandhikharka", "Sitaganga", "Bhumikasthan"] },
      { name: "Banke", cities: ["Nepalgunj Sub-Metropolitan", "Kohalpur"] },
      { name: "Bardiya", cities: ["Gulariya", "Madhuwan", "Rajapur", "Thakurbaba", "Bansgadhi", "Barbardiya"] },
      { name: "Dang", cities: ["Ghorahi Sub-Metropolitan", "Tulsipur Sub-Metropolitan", "Lamahi", "Bhalubang"] },
      { name: "Gulmi", cities: ["Tamghas (Resunga)", "Musikot", "Ridi"] },
      { name: "Kapilvastu", cities: ["Kapilvastu (Taulihawa)", "Banganga", "Buddhabhumi", "Shivaraj", "Maharajgunj", "Krishnanagar"] },
      { name: "Palpa", cities: ["Tansen", "Rampur"] },
      { name: "Parasi (Nawalparasi West)", cities: ["Ramgram (Parasi)", "Sunwal", "Bardaghat"] },
      { name: "Pyuthan", cities: ["Pyuthan", "Swargadwari"] },
      { name: "Rolpa", cities: ["Rolpa (Liwang)", "Sulichaur"] },
      { name: "Rukum East", cities: ["Rukumkot", "Sisne", "Bhume"] },
      { name: "Rupandehi", cities: ["Butwal Sub-Metropolitan", "Siddharthanagar (Bhairahawa)", "Tilottama", "Sainamaina", "Devdaha", "Lumbini Sanskritik"] },
    ],
  },
  {
    id: "karnali",
    name: "Karnali Province",
    districts: [
      { name: "Dailekh", cities: ["Narayan", "Dullu", "Chamunda Bindrasaini", "Aathbis"] },
      { name: "Dolpa", cities: ["Thuli Bheri (Dunai)", "Tripura Sundari"] },
      { name: "Humla", cities: ["Simikot", "Kharpunath", "Sarkegad"] },
      { name: "Jajarkot", cities: ["Bheri (Khalanga)", "Chhedagad", "Nalgad"] },
      { name: "Jumla", cities: ["Chandannath (Khalanga)"] },
      { name: "Kalikot", cities: ["Khandachakra (Manma)", "Raskot", "Tilagufa"] },
      { name: "Mugu", cities: ["Chhayanath Rara (Gamgadhi)"] },
      { name: "Rukum West", cities: ["Musikot (Khalanga)", "Chaurjahari", "Aathbiskot"] },
      { name: "Salyan", cities: ["Sharada (Khalanga)", "Bagchaur", "Bangad Kupinde"] },
      { name: "Surkhet", cities: ["Birendranagar", "Gurbhakot", "Bheriganga", "Panchapuri", "Lekbeshi"] },
    ],
  },
  {
    id: "sudurpashchim",
    name: "Sudurpashchim Province",
    districts: [
      { name: "Achham", cities: ["Mangalsen", "Sanphebagar", "Kamalbazar", "Panchadewal Binayak"] },
      { name: "Baitadi", cities: ["Dasharathchand", "Patan", "Melauli", "Purchaudi"] },
      { name: "Bajhang", cities: ["Jayaprithvi (Chainpur)", "Bungal"] },
      { name: "Bajura", cities: ["Badimalika (Martadi)", "Tribeni", "Budhiganga", "Budhinanda"] },
      { name: "Dadeldhura", cities: ["Amargadhi", "Parshuram"] },
      { name: "Darchula", cities: ["Khalanga (Mahakali)", "Shailyashikhar"] },
      { name: "Doti", cities: ["Dipayal Silgadhi", "Shikhar"] },
      { name: "Kailali", cities: ["Dhangadhi Sub-Metropolitan", "Tikapur", "Lamki Chuha", "Ghodaghodi", "Bhajani", "Godawari", "Gauriganga", "Attariya"] },
      { name: "Kanchanpur", cities: ["Bhimdatta (Mahendranagar)", "Bedkot", "Shuklaphanta", "Krishnapur", "Punarbas", "Belauri", "Mahakali"] },
    ],
  },
];

/**
 * Get districts by province name
 */
export function getDistrictsByProvince(provinceName) {
  if (!provinceName) return [];
  const found = NEPAL_PROVINCES.find(
    (p) => p.name.toLowerCase() === provinceName.toLowerCase() || p.id === provinceName.toLowerCase()
  );
  return found ? found.districts : [];
}

/**
 * Get cities by district name
 */
export function getCitiesByDistrict(provinceName, districtName) {
  if (!districtName) return [];
  const districts = provinceName
    ? getDistrictsByProvince(provinceName)
    : NEPAL_PROVINCES.flatMap((p) => p.districts);
  const found = districts.find(
    (d) => d.name.toLowerCase() === districtName.toLowerCase()
  );
  return found ? found.cities : [];
}

/**
 * Formats structured location into a clean Nepal delivery address string
 */
export function formatNepalAddress({ province, district, city, streetAddress }) {
  const parts = [];
  if (streetAddress && streetAddress.trim()) {
    parts.push(streetAddress.trim());
  }
  if (city && city.trim() && city !== "Other / Local Area") {
    parts.push(city.trim());
  }
  if (district && district.trim()) {
    parts.push(district.trim());
  }
  if (province && province.trim()) {
    parts.push(province.trim());
  }
  return parts.join(", ");
}

/**
 * Intelligent parser to extract Province and District from legacy or unstructured address string
 */
export function parseNepalAddress(addressString = "") {
  if (!addressString || typeof addressString !== "string") {
    return { province: "", district: "", city: "", streetAddress: "" };
  }

  const clean = addressString.trim();
  let matchedProvince = "";
  let matchedDistrict = "";
  let matchedCity = "";

  // 1. Try to find province
  for (const prov of NEPAL_PROVINCES) {
    if (clean.toLowerCase().includes(prov.name.toLowerCase())) {
      matchedProvince = prov.name;
      break;
    }
  }

  // 2. Try to find district
  for (const prov of NEPAL_PROVINCES) {
    for (const dist of prov.districts) {
      const regex = new RegExp(`\\b${dist.name}\\b`, "i");
      if (regex.test(clean)) {
        matchedDistrict = dist.name;
        if (!matchedProvince) {
          matchedProvince = prov.name;
        }
        break;
      }
    }
    if (matchedDistrict) break;
  }

  // 3. Try to find city
  if (matchedDistrict) {
    const cities = getCitiesByDistrict(matchedProvince, matchedDistrict);
    for (const c of cities) {
      const firstWord = c.split(" ")[0];
      const regex = new RegExp(`\\b${firstWord}\\b`, "i");
      if (regex.test(clean)) {
        matchedCity = c;
        break;
      }
    }
  }

  // Extract leftover as street address
  let streetAddress = clean;
  if (matchedProvince) {
    streetAddress = streetAddress.replace(new RegExp(matchedProvince, "gi"), "");
  }
  if (matchedDistrict) {
    streetAddress = streetAddress.replace(new RegExp(matchedDistrict, "gi"), "");
  }
  if (matchedCity) {
    streetAddress = streetAddress.replace(new RegExp(matchedCity, "gi"), "");
  }
  streetAddress = streetAddress
    .replace(/,\s*Nepal\s*$/i, "")
    .replace(/^,\s*|,\s*$/g, "")
    .replace(/,\s*,/g, ",")
    .trim();

  return {
    province: matchedProvince,
    district: matchedDistrict,
    city: matchedCity,
    streetAddress: streetAddress || clean,
  };
}
