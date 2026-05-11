export type Attraction = {
    name: string;
    description: string;
    image?: string;
};

export type DistrictDetail = {
    description: string;
    bestTime: string;
    attractions: Attraction[];
    gallery: string[];
};

const districtDetails: Record<string, DistrictDetail> = {
    hunza: {
        description:
            "Hunza Valley is one of Pakistan's most breathtaking destinations, nestled among the Karakoram mountains. Famous for the ancient Baltit Fort, crystal-clear Attabad Lake, and the legendary longevity of its people, Hunza is a paradise for trekkers and nature lovers.",
        bestTime: "April – October",
        attractions: [
            { name: "Baltit Fort", description: "A 700-year-old fort perched high above Karimabad with stunning mountain views." },
            { name: "Attabad Lake", description: "A vivid turquoise lake formed by a 2010 landslide, now a major tourist attraction." },
            { name: "Eagle's Nest", description: "A viewpoint offering panoramic views of Rakaposhi, Ultar, and Hunza Valley." },
            { name: "Passu Cones", description: "Striking jagged mountain peaks near Passu village." },
            { name: "Khunjerab Pass", description: "The highest paved international border crossing in the world." },
            { name: "Altit Fort", description: "An ancient fort older than Baltit, overlooking the Hunza river." },
            { name: "Hussaini Suspension Bridge", description: "A thrilling, ancient suspension bridge crossing the Hunza River." },
            { name: "Hopper Glacier", description: "A magnificent, fast-moving glacier in the Nagar Valley." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1531747056595-07f6a4d73043?w=800",
            "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800",
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
        ],
    },
    skardu: {
        description:
            "Skardu is the gateway to the world's highest peaks including K2, the second highest mountain on Earth. It features the stunning Shangrila Resort, Satpara Lake, and serves as a base for expeditions to the mighty Karakoram range.",
        bestTime: "May – September",
        attractions: [
            { name: "Shangrila Resort (Heaven on Earth Lake)", description: "A picturesque lake with a famous resort built inside an old aircraft." },
            { name: "Satpara Lake", description: "A natural freshwater lake surrounded by snow-capped peaks." },
            { name: "Skardu Fort (Kharpocho)", description: "A 16th-century fort perched on a massive rock overlooking Skardu town." },
            { name: "Deosai National Park", description: "The second highest plateau in the world, known as the Land of Giants." },
            { name: "Upper Kachura Lake", description: "A pristine, clear water lake hidden within a beautiful forest." },
            { name: "Shigar Fort", description: "A restored 17th-century palace offering a glimpse into royal history." },
            { name: "Manthokha Waterfall", description: "A stunning waterfall located in Kharmang Valley." },
            { name: "Katpana Desert", description: "The famous cold desert of Skardu featuring sand dunes at high altitude." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
            "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800",
        ],
    },
    gilgit: {
        description:
            "Gilgit is the capital of Gilgit-Baltistan and lies at the confluence of three great mountain ranges: the Himalayas, Karakoram, and Hindu Kush. It is a vibrant hub for adventure tourism and the starting point for journeys to the world's highest peaks.",
        bestTime: "April – October",
        attractions: [
            { name: "Kargah Buddha", description: "A 7th-century rock carving in a scenic gorge outside Gilgit town." },
            { name: "Gilgit River", description: "A magnificent river with opportunities for fishing and rafting." },
            { name: "Naltar Valley", description: "A stunning valley with colorful Naltar Lakes and ski slopes." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
            "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
        ],
    },
    diamer: {
        description:
            "Diamer district is home to Nanga Parbat, the ninth highest mountain in the world and the westernmost of the Himalayan giants. The district offers dramatic gorges, roaring rivers, and the base camp of the legendary Killer Mountain.",
        bestTime: "June – September",
        attractions: [
            { name: "Nanga Parbat Base Camp", description: "Trekking route to the base of the world's ninth highest peak." },
            { name: "Fairy Meadows", description: "A lush alpine meadow offering one of the best views of Nanga Parbat." },
            { name: "Indus River Gorge", description: "One of the deepest gorges in the world where the Indus cuts through mountains." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
            "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
        ],
    },
    shigar: {
        description:
            "Shigar Valley is a historic valley in Gilgit-Baltistan, famous for the magnificent Shigar Fort, the cold desert of Sarfaranga, and its role as a base camp route for K2 expeditions.",
        bestTime: "May – October",
        attractions: [
            { name: "Shigar Fort", description: "A 17th-century royal palace now converted into a heritage hotel." },
            { name: "Sarfaranga Cold Desert", description: "A vast desert landscape surrounded by towering snow-capped peaks." },
            { name: "Shigar River", description: "A glacial river offering rafting and scenic valley walks." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800",
        ],
    },
    ghanche: {
        description:
            "Ghanche district contains the highest concentration of eight-thousanders in the world. The cold desert landscape with towering glaciers and pristine mountain lakes makes it a bucket-list destination for serious trekkers.",
        bestTime: "June – August",
        attractions: [
            { name: "K2 Base Camp Trek", description: "Trek to the base of the world's second highest and most challenging mountain." },
            { name: "Deosai National Park", description: "A high-altitude plateau rich in wildlife and wildflowers." },
            { name: "Khaplu Palace", description: "A charming heritage palace with stunning mountain scenery." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        ],
    },
    kharmang: {
        description:
            "Kharmang is a remote and magnificent district on the banks of the Shyok River, known for its ancient forts, high-altitude trekking routes, and pristine natural beauty far from the tourist crowds.",
        bestTime: "May – September",
        attractions: [
            { name: "Kharmang Fort", description: "An ancient fort with breathtaking views of the Shyok River valley." },
            { name: "Shyok River", description: "A glacial river offering jaw-dropping valley scenery." },
            { name: "Remote Trekking Routes", description: "Treks through high-altitude passes and hidden valleys." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800",
            "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
            "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
        ],
    },
    muzaffarabad: {
        description:
            "Muzaffarabad, the capital of Azad Jammu & Kashmir, sits at the confluence of the Neelum and Jhelum rivers. It is surrounded by forested hills and serves as the gateway to the scenic Neelum Valley.",
        bestTime: "March – October",
        attractions: [
            { 
                name: "Pir Chinasi", 
                description: "A sacred hill station at 2,900m offering panoramic views of the city.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Pir%20Chinasi.jpg"
            },
            { 
                name: "Neelum Valley", 
                description: "A paradise of rivers, forests, and meadows stretching toward the Line of Control.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Neelam%20Valley.jpg"
            },
            { 
                name: "Red Fort (Muzaffarabad Fort)", 
                description: "A 16th-century Mughal fort overlooking the Jhelum River.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/muzaffarabad.jpg"
            },
        ],
        gallery: [
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/muzaffarabad.jpg",
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Pir%20Chinasi.jpg",
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Neelam%20Valley.jpg",
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Dhanni%20Waterfall.jpg",
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Arang%20kel.jpg",
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Sharda%20Peeth.jpg",
        ],
    },
    islamabad: {
        description:
            "Islamabad, Pakistan's modern capital, is nestled against the Margalla Hills. It is one of the most planned and beautiful capitals in Asia, offering a blend of modernity, nature, and culture.",
        bestTime: "October – April",
        attractions: [
            { 
                name: "Faisal Mosque", 
                description: "One of the largest mosques in the world, an iconic symbol of Pakistan.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/islamabad/islamabad.jpeg?updatedAt=1778410320483"
            },
            { 
                name: "Margalla Hills National Park", 
                description: "A national park offering hiking trails, wildlife, and stunning city views.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/islamabad/islamabad%20margla%20hills.jpeg?updatedAt=1778410320368"
            },
            { 
                name: "Lok Virsa Museum", 
                description: "A museum showcasing Pakistan's rich folk and traditional heritage.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/islamabad/Lok%20Virsa%20Museum.webp"
            },
        ],
        gallery: [
            "https://ik.imagekit.io/odxmgomft/gallery/islamabad/islamabad.jpeg?updatedAt=1778410320483",
            "https://ik.imagekit.io/odxmgomft/gallery/islamabad/islamabad%20margla%20hills.jpeg?updatedAt=1778410320368",
            "https://ik.imagekit.io/odxmgomft/gallery/islamabad/monoment.webp",
            "https://ik.imagekit.io/odxmgomft/gallery/islamabad/Panjpeer%20Rocks.webp",
            "https://ik.imagekit.io/odxmgomft/gallery/islamabad/Shumber%20Waterfalls.jpg",
            "https://ik.imagekit.io/odxmgomft/gallery/islamabad/Lok%20Virsa%20Museum.webp",
            "https://ik.imagekit.io/odxmgomft/gallery/islamabad/Pir%20Sohawa.webp",
            "https://ik.imagekit.io/odxmgomft/gallery/islamabad/Bruti%20waterfall%20Islamabad.jpg",
        ],
    },
    peshawar: {
        description:
            "Peshawar, one of the oldest cities in the world, is the capital of Khyber Pakhtunkhwa. A gateway to Central Asia, it features a vibrant bazaar culture, ancient mosques, and a deeply rooted Pashtun heritage dating back over 2,500 years.",
        bestTime: "October – March",
        attractions: [
            { name: "Qissa Khwani Bazaar", description: "The historic Street of Storytellers, one of Pakistan's most famous bazaars." },
            { name: "Mahabat Khan Mosque", description: "A 17th-century Mughal mosque with intricately painted frescoes." },
            { name: "Peshawar Museum", description: "One of the best collections of Gandhara Buddhist art in the world." },
        ],
        gallery: [
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
            "https://images.unsplash.com/photo-1565354148893-eee43a2e28e4?w=800",
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
        ],
    },
    swat: {
        description:
            "Swat Valley, often called the Switzerland of Pakistan, is a lush green paradise of rivers, mountains, and waterfalls. It was once a major center of Buddhist civilization and today offers some of Pakistan's most spectacular scenery.",
        bestTime: "April – October",
        attractions: [
            { name: "Malam Jabba", description: "Pakistan's premier ski resort with a ski lift and adventure activities." },
            { name: "Mingora Bazaar", description: "A vibrant market for Swati embroidery, gems, and handicrafts." },
            { name: "Kalam Valley", description: "A breathtaking alpine valley with waterfalls and flower-filled meadows." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
            "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800",
            "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
        ],
    },
    chitral: {
        description:
            "Chitral is a remote district bordering Afghanistan, home to the unique Kalash people with their ancient pagan culture. Dominated by the mighty Tirich Mir peak (7,708m), it offers extraordinary cultural tourism and high-altitude trekking.",
        bestTime: "May – September",
        attractions: [
            { name: "Kalash Valleys", description: "Home to the ancient Kalash people with a unique pre-Islamic culture and colorful festivals." },
            { name: "Tirich Mir View Point", description: "Panoramic view of the highest peak of the Hindu Kush." },
            { name: "Chitral Fort", description: "A historic fort from the Katoor dynasty era." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800",
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
            "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
        ],
    },
    abbottabad: {
        description:
            "Abbottabad is a beautiful hill station at 1,260m in the Orash Valley, surrounded by pine forests. Known for its pleasant weather, top educational institutions, and the nearby Thandiani hill station, it is a popular weekend retreat.",
        bestTime: "March – October",
        attractions: [
            { name: "Thandiani", description: "A scenic hill station at 2,745m with lush forests and mountain views." },
            { name: "Abbottabad Board Bazar", description: "A bustling commercial center with traditional markets and local cuisine." },
            { name: "Shimla Hill Park", description: "A forested park offering walks and panoramic city views." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
            "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        ],
    },
    mansehra: {
        description:
            "Mansehra is the gateway to the famous Kaghan Valley and Naran. It features Ashoka's ancient rock edicts, lush green hills, and serves as the starting point for Pakistan's most scenic road trips toward Babusar Pass.",
        bestTime: "May – September",
        attractions: [
            { name: "Kaghan Valley", description: "A spectacular valley with crystal-clear rivers, lakes, and alpine meadows." },
            { name: "Lulusar Lake", description: "A stunning high-altitude lake near Babusar Pass." },
            { name: "Ashoka's Rock Edicts", description: "Ancient inscriptions from Emperor Ashoka dating back to 3rd century BC." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
            "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800",
        ],
    },
    dir: {
        description:
            "Dir district is known for its stunning Kumrat Valley, ancient wooden mosques, and dense forests. The Panjkora River runs through its heart, making it a paradise for fishing and nature lovers.",
        bestTime: "May – September",
        attractions: [
            { name: "Kumrat Valley", description: "An unspoiled valley with dense pine forests and crystal-clear rivers." },
            { name: "Katora Lake", description: "A hidden high-altitude lake accessible via a challenging trek." },
            { name: "Traditional Wooden Mosques", description: "Centuries-old mosques built using the Deodar cedar wood tradition." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
            "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
            "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
        ],
    },
    bannu: {
        description:
            "Bannu is a historic city on the Kurram River known for its unique Bannuchi culture, traditional markets, and significant archaeological sites. It was an important cantonment town during British rule.",
        bestTime: "October – March",
        attractions: [
            { name: "Bannu Museum", description: "A museum housing Gandhara artifacts and local historical collections." },
            { name: "Kurram River", description: "A scenic river with fertile banks and agricultural landscapes." },
            { name: "Old Bazaar", description: "A traditional market offering local crafts and famous Bannuchi cuisine." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
            "https://images.unsplash.com/photo-1565354148893-eee43a2e28e4?w=800",
        ],
    },
    "dera-ismail-khan": {
        description:
            "Dera Ismail Khan (D.I. Khan) sits on the western bank of the Indus River and is an important cultural and commercial hub. It preserves rich Pashtun and Sikh historical heritage.",
        bestTime: "October – March",
        attractions: [
            { name: "Indus River Promenade", description: "A scenic riverside walk along one of Asia's greatest rivers." },
            { name: "Kafir Kot", description: "Ancient Hindu temple ruins from the 8th century CE on the Indus banks." },
            { name: "D.I. Khan Museum", description: "Showcasing local history, art, and archaeological finds." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=800",
            "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
            "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800",
        ],
    },
    lahore: {
        description:
            "Lahore, the cultural capital of Pakistan and the heart of Punjab, is a city of magnificent Mughal architecture, vibrant food streets, lively festivals, and rich literary traditions. It is home to some of South Asia's finest monuments.",
        bestTime: "October – March",
        attractions: [
            { name: "Badshahi Mosque", description: "One of the largest mosques in the world, a masterpiece of Mughal architecture." },
            { name: "Lahore Fort (Shahi Qila)", description: "A UNESCO World Heritage site showcasing Mughal grandeur." },
            { name: "Food Street (Gawalmandi)", description: "A legendary food street famous for traditional Lahori cuisine." },
            { name: "Shalimar Gardens", description: "A beautiful Mughal garden complex recognized as a UNESCO World Heritage site." },
            { name: "Minar-e-Pakistan", description: "A national monument marking the location where the Lahore Resolution was passed." },
            { name: "Lahore Museum", description: "Pakistan's largest museum housing ancient artifacts and Gandhara art." },
            { name: "Wagah Border", description: "The famous border crossing where the daily flag-lowering ceremony takes place." },
            { name: "Anarkali Bazaar", description: "One of the oldest surviving markets in South Asia, bustling with culture." },
        ],
        gallery: [
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
        ],
    },
    rawalpindi: {
        description:
            "Rawalpindi, the twin city of Islamabad, is one of Pakistan's most historic military towns. It features a mix of British-era cantonment architecture, bustling bazaars, and modern commercial areas.",
        bestTime: "October – April",
        attractions: [
            { name: "Raja Bazaar", description: "One of Asia's largest and oldest traditional markets." },
            { name: "Ayub National Park", description: "A large recreational park shared between Rawalpindi and Islamabad." },
            { name: "Army Museum", description: "A comprehensive museum showcasing Pakistan Army's history and achievements." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1565354148893-eee43a2e28e4?w=800",
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
        ],
    },
    faisalabad: {
        description:
            "Faisalabad, Pakistan's third-largest city and its textile capital, is known as the Manchester of Pakistan. The famous Clock Tower (Ghanta Ghar) with its eight surrounding bazaars forms the heart of the city.",
        bestTime: "October – March",
        attractions: [
            { name: "Ghanta Ghar (Clock Tower)", description: "The iconic British-era clock tower with 8 surrounding bazaars forming a Union Jack pattern." },
            { name: "Lyallpur Museum", description: "A museum dedicated to the history of Faisalabad and the textile industry." },
            { name: "Jinnah Garden", description: "A large public park with a beautiful lake in the heart of the city." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
            "https://images.unsplash.com/photo-1565354148893-eee43a2e28e4?w=800",
        ],
    },
    multan: {
        description:
            "Multan, the City of Saints and Sufis, is one of the oldest cities in the world with a history spanning 5,000 years. Famous for its spectacular shrines, blue pottery, mango gardens, and intense summer heat.",
        bestTime: "October – February",
        attractions: [
            { name: "Shah Rukn-e-Alam Shrine", description: "A magnificent 14th-century Sufi shrine, one of the finest examples of Tughluq architecture." },
            { name: "Multan Fort", description: "The historic fort with great views over the city's shrines and mosques." },
            { name: "Multan Craft Market", description: "Famous for blue-glazed pottery, camel-skin lamps, and handwoven textiles." },
        ],
        gallery: [
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
            "https://images.unsplash.com/photo-1565354148893-eee43a2e28e4?w=800",
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
        ],
    },
    gujranwala: {
        description:
            "Gujranwala, the City of Wrestlers, is Pakistan's fourth-largest city and an industrial hub. It was the birthplace of Maharaja Ranjit Singh and has a rich Sikh heritage alongside vibrant wrestling traditions.",
        bestTime: "October – March",
        attractions: [
            { name: "Ranjit Singh's Birthplace", description: "Historical site marking the birthplace of the legendary Sikh ruler." },
            { name: "Gujranwala Food Street", description: "Famous across Pakistan for desi food, especially meat dishes." },
            { name: "Gujranwala Museum", description: "A local museum with artifacts from the Sikh era and earlier." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
            "https://images.unsplash.com/photo-1565354148893-eee43a2e28e4?w=800",
        ],
    },
    sialkot: {
        description:
            "Sialkot is Pakistan's sports goods manufacturing capital, producing a significant share of the world's footballs and hockey sticks. It is also the birthplace of national poet Allama Iqbal.",
        bestTime: "October – March",
        attractions: [
            { name: "Iqbal Manzil", description: "The ancestral home of Allama Iqbal, now a heritage museum." },
            { name: "Sialkot Fort", description: "An ancient fort with historical significance from the Mughal and Hindu Shahi eras." },
            { name: "Sports Factories Tour", description: "Visit world-renowned factories producing footballs and sporting goods." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1565354148893-eee43a2e28e4?w=800",
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
        ],
    },
    bahawalpur: {
        description:
            "Bahawalpur is a city of royal palaces and the famous Cholistan Desert. Once the capital of the independent Bahawalpur State, it features stunning Noor Mahal palace, the ancient Derawar Fort, and the scenic Lal Suhanra National Park.",
        bestTime: "October – February",
        attractions: [
            { name: "Derawar Fort", description: "A magnificent 40-bastion desert fort rising dramatically from the Cholistan sands." },
            { name: "Noor Mahal Palace", description: "An Italian-style palace of the Nawabs of Bahawalpur, now open to visitors." },
            { name: "Lal Suhanra National Park", description: "A desert national park home to blackbuck, chinkara, and migratory birds." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
            "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
            "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800",
        ],
    },
    sargodha: {
        description:
            "Sargodha, the City of Eagles, is Pakistan's premier air force base city and a hub for Pakistan's citrus industry. The Kirana Hills provide a rocky, scenic landscape unique to central Punjab.",
        bestTime: "October – March",
        attractions: [
            { name: "Kirana Hills", description: "Rocky hills with ancient rock carvings and diverse bird species." },
            { name: "PAF Sargodha Base", description: "Home to Pakistan's elite air force squadron, the Sherdils." },
            { name: "Citrus Orchards", description: "Visit the fragrant orange and mandarin gardens during harvest season." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
            "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
            "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
        ],
    },
    sheikhupura: {
        description:
            "Sheikhupura, founded by Mughal Emperor Jahangir, is home to the magnificent Hiran Minar and features Mughal-era monuments close to Lahore.",
        bestTime: "October – March",
        attractions: [
            { name: "Hiran Minar", description: "Emperor Jahangir's tribute to his beloved pet deer — a minaret at the center of a large tank." },
            { name: "Sheikhupura Fort", description: "A Mughal-era fort built by Emperor Jahangir as a hunting lodge." },
            { name: "Chauburji", description: "An imposing Mughal gateway monument near Lahore with four decorative towers." },
        ],
        gallery: [
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
            "https://images.unsplash.com/photo-1565354148893-eee43a2e28e4?w=800",
        ],
    },
    karachi: {
        description:
            "Karachi, Pakistan's largest city and economic capital, is a vibrant metropolis on the Arabian Sea coast. It is a melting pot of cultures, cuisines, and people from across Pakistan, with a thriving arts scene and beautiful beaches.",
        bestTime: "November – February",
        attractions: [
            { name: "Clifton Beach", description: "Karachi's most popular beach with camel and horse rides along the shore." },
            { name: "Mohatta Palace Museum", description: "A stunning 1920s palace housing an exceptional collection of Pakistani art." },
            { name: "Empress Market", description: "A Victorian-era market and Karachi's most iconic landmark." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
            "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800",
        ],
    },
    hyderabad: {
        description:
            "Hyderabad, the second-largest city of Sindh, sits on the eastern bank of the Indus River. It was once the capital of the Talpur Mirs and features historic forts, vibrant glass bangle markets, and Sindhi cultural traditions.",
        bestTime: "November – February",
        attractions: [
            { name: "Pakka Qilla (Hyderabad Fort)", description: "The historic fort of the Talpur Mirs with panoramic city views." },
            { name: "Glass Bangles Market", description: "A world-famous market for colorful handmade glass bangles." },
            { name: "Sindhu Cultural Center", description: "Showcasing the rich cultural heritage of Sindh province." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1565354148893-eee43a2e28e4?w=800",
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
        ],
    },
    sukkur: {
        description:
            "Sukkur is an ancient city on the Indus River, known for the magnificent Sukkur Barrage — one of the world's largest irrigation works. The city has a rich history going back over 5,000 years.",
        bestTime: "November – February",
        attractions: [
            { name: "Sukkur Barrage", description: "A historic engineering marvel built in 1932, irrigating 5 million acres of farmland." },
            { name: "Sadhu Bela Temple", description: "A beautiful Hindu temple complex on an island in the Indus River." },
            { name: "Lansdowne Bridge", description: "A 19th-century iron bridge — one of the longest of its kind when built." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=800",
            "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
            "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800",
        ],
    },
    larkana: {
        description:
            "Larkana is the gateway to Mohenjo-daro, a UNESCO World Heritage Site and one of the largest cities of the ancient Indus Valley Civilization (c. 2600 BCE). The district holds immense archaeological significance.",
        bestTime: "November – February",
        attractions: [
            { name: "Mohenjo-daro", description: "A UNESCO World Heritage Site — ruins of one of the world's earliest urban settlements." },
            { name: "Mohenjo-daro Museum", description: "A fascinating museum of artifacts from the 4,500-year-old civilization." },
            { name: "Shahi Bazaar", description: "A historic marketplace with traditional Sindhi crafts and food." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1717518215340-0d1184c493fa?w=800",
            "https://images.unsplash.com/photo-1565354148893-eee43a2e28e4?w=800",
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
        ],
    },
    mirpurkhas: {
        description:
            "Mirpurkhas is the cultural heart of the Mango Region of Sindh, producing some of Pakistan's most prized mango varieties. The district also has significant Buddhist ruins.",
        bestTime: "April – June (Mango Season)",
        attractions: [
            { name: "Mango Orchards", description: "Experience Pakistan's famous mango harvest in sprawling orchards." },
            { name: "Kahu-jo-Daro", description: "Ancient Buddhist stupa and ruins from the Kushan period." },
            { name: "Mirpurkhas Museum", description: "Museum showcasing Sindhi heritage and local archaeological finds." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
            "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800",
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        ],
    },
    thatta: {
        description:
            "Thatta, the ancient capital of lower Sindh, contains the UNESCO-listed Makli Necropolis — the world's largest funerary site — and the stunning Shah Jahan Mosque built by Mughal Emperor Shah Jahan.",
        bestTime: "November – February",
        attractions: [
            { name: "Makli Necropolis", description: "A UNESCO World Heritage Site — a vast necropolis with 500,000 tombs spanning 4 centuries." },
            { name: "Shah Jahan Mosque", description: "A 17th-century mosque with 103 domes built by Mughal Emperor Shah Jahan." },
            { name: "Keenjhar Lake", description: "Pakistan's second-largest freshwater lake, rich in migratory birds." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1685369250486-053a9bf47faa?w=800",
            "https://ik.imagekit.io/odxmgomft/gallery/Lahore/lahore.jpeg",
            "https://images.unsplash.com/photo-1565354148893-eee43a2e28e4?w=800",
        ],
    },
    badin: {
        description:
            "Badin is a coastal district of Sindh known for its beautiful beaches, mangrove forests, and the Indus Delta. It is an important ecological zone, home to the rare Indus River dolphin and various migratory bird species.",
        bestTime: "November – February",
        attractions: [
            { name: "Keti Bandar", description: "A coastal town at the mouth of the Indus with fishing communities and bird watching." },
            { name: "Mangrove Forests", description: "Explore dense mangrove forests that protect the coastline and house rich wildlife." },
            { name: "Ancient Temples", description: "Hindu temples from the pre-partition era scattered across the district." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
            "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800",
        ],
    },
    quetta: {
        description:
            "Quetta, the capital of Balochistan, sits at 1,680m elevation surrounded by mountains. Known as the Fruit Garden of Pakistan, it offers a blend of Pashtun and Baloch cultures with stunning landscapes.",
        bestTime: "March – May & September – November",
        attractions: [
            { name: "Hanna Lake", description: "A serene reservoir surrounded by rocky hills — perfect for boating and picnics." },
            { name: "Ziarat Residency", description: "Historic summer retreat of Quaid-e-Azam Muhammad Ali Jinnah." },
            { name: "Quetta Bazaar", description: "A lively market offering Balochi handicrafts, dry fruits, and carpets." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1604440095301-4ec2f9230155?w=800",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
        ],
    },
    gwadar: {
        description:
            "Gwadar is a port city on the Arabian Sea coast, rapidly developing as a key node of the China-Pakistan Economic Corridor (CPEC). Its coastline offers pristine beaches and dramatic cliff views.",
        bestTime: "October – March",
        attractions: [
            { name: "Hammerhead Point", description: "A dramatic peninsula with panoramic views of the Arabian Sea." },
            { name: "Gwadar Beach", description: "Pristine golden sands perfect for sunset walks." },
            { name: "Gwadar Port", description: "One of the world's largest deep-sea ports under development." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
            "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800",
        ],
    },
    turbat: {
        description:
            "Turbat is the second largest city in Balochistan, famous for its date palms, hot climate, and the Kech River. The region is known for its unique Balochi dance and music traditions.",
        bestTime: "November – February",
        attractions: [
            { name: "Date Farms", description: "Vast orchards of date palms stretching across the landscape." },
            { name: "Kech River", description: "A life-giving river flowing through arid Makran terrain." },
            { name: "Mand Hills", description: "Rugged hills offering trekking adventures." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
            "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800",
            "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800",
        ],
    },
    khuzdar: {
        description:
            "Khuzdar is known for its rugged mountainous terrain, ancient history, and significant mineral resources. The region houses remnants of ancient civilizations and breathtaking natural scenery.",
        bestTime: "March – May",
        attractions: [
            { name: "Khuzdar Hills", description: "Dramatic rocky mountains ideal for adventure tourism." },
            { name: "Naal Valley", description: "A green valley oasis in a largely arid landscape." },
            { name: "Ancient Sites", description: "Archaeological sites dating back thousands of years." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
            "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
            "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
        ],
    },
    chaman: {
        description:
            "Chaman is a border town connecting Pakistan and Afghanistan via the Khojak Pass. It lies on an ancient trade route and features the marvelous Khojak Tunnel, a British-era engineering marvel.",
        bestTime: "March – April & October – November",
        attractions: [
            { name: "Khojak Tunnel", description: "A historic railway tunnel from the British colonial era." },
            { name: "Khojak Pass", description: "A mountain pass offering commanding views of the border region." },
            { name: "Friendship Gate", description: "The official border crossing between Pakistan and Afghanistan." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
            "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800",
            "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800",
        ],
    },
    zhob: {
        description:
            "Zhob is a historic district in northeastern Balochistan, known for the Zhob River, fertile valleys, and a strategic location on ancient Silk Road routes. The region has a rich Pashtun cultural heritage.",
        bestTime: "April – June & September – October",
        attractions: [
            { name: "Zhob River", description: "A scenic river that sustains life across this arid region." },
            { name: "Sherani Hills", description: "Forested hills with diverse wildlife and scenic trails." },
            { name: "Fort Sandeman", description: "A British-era fort with panoramic views over the district." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800",
            "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
            "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=800",
        ],
    },
    ziarat: {
        description:
            "Ziarat is famous for the world's second-largest juniper forest and as the location of the Quaid-e-Azam Residency where Pakistan's founder spent his last days. It is a cool mountain retreat at 2,449m elevation.",
        bestTime: "May – September",
        attractions: [
            { name: "Quaid-e-Azam Residency", description: "Historic retreat of Pakistan's founding father, now a museum." },
            { name: "Juniper Forest", description: "One of the world's oldest and largest juniper forests." },
            { name: "Prospect Point", description: "A stunning viewpoint overlooking the entire Ziarat valley." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
            "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800",
            "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800",
        ],
    },
    "neelum-valley": {
        description:
            "Neelum Valley is a 144 km long bow-shaped valley in Azad Kashmir. It is known for its lush greenery, towering hills, noisy river, and attractive waterfalls.",
        bestTime: "April – October",
        attractions: [
            { 
                name: "Arang Kel", 
                description: "A breathtaking village and tourist spot on a hilltop above Kel, known as the Pearl of Neelum.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Arang%20kel.jpg"
            },
            { 
                name: "Sharda Peeth", 
                description: "An ancient Hindu temple and historic learning center ruins in the village of Sharda.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Sharda%20Peeth.jpg"
            },
            { 
                name: "Neelum River", 
                description: "A powerful, scenic river that flows throughout the valley.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Neelam%20Valley.jpg"
            },
            { 
                name: "Ratti Galli Waterfall", 
                description: "A stunning alpine waterfall fed by the Ratti Gali glacial lake.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Ratti%20Galli%20Waterfall.webp"
            },
        ],
        gallery: [
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Neelam%20Valley.jpg",
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Arang%20kel.jpg",
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Sharda%20Peeth.jpg",
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Ratti%20Galli%20Waterfall.webp",
        ],
    },
    poonch: {
        description:
            "Poonch District, with its capital Rawalakot, is famous as the 'Pearl Valley'. It offers high-altitude meadows, serene lakes, and a pleasant summer climate.",
        bestTime: "April – October",
        attractions: [
            { 
                name: "Rawalakot", 
                description: "The heart of Pearl Valley, known for its natural beauty and cool weather.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Rawalakot.jpg"
            },
            { 
                name: "Banjosa Lake", 
                description: "A scenic artificial lake surrounded by pine forests and mountains.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Banjosa%20Lake.jpg"
            },
            { 
                name: "Toli Pir", 
                description: "The highest hilltop in the region with expansive meadows and breathtaking views.",
                image: "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Toli%20Pir.webp"
            },
        ],
        gallery: [
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Rawalakot.jpg",
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Banjosa%20Lake.jpg",
            "https://ik.imagekit.io/odxmgomft/gallery/Kashmir/Toli%20Pir.webp",
        ],
    },
};

export function getDistrictDetail(slug: string): DistrictDetail | null {
    return districtDetails[slug] ?? null;
}
