"use client";
import { useState } from "react";
import Link from "next/link";

// Buy panel for one category's 1,000-prompt pack (₹999).
// Three full prompts from the pack are shown as a free preview, plus a
// few locked titles; the other 997 paid prompts are never shown.
// Payment is by UPI; the buyer sends the payment screenshot on
// WhatsApp and Shenick shares the pack file there.
const UPI_ID = "9566977211@upi";
const UPI_LINK = "upi://pay?pa=9566977211@upi&pn=Shenick%20Jain&am=999&cu=INR";
const WHATSAPP_NUMBER = "919566977211";

// Free preview: 3 real prompts from each pack (IDs 31-33, right after
// the 5 locked-preview titles). Each sample shows in full on that
// pack's page as a free preview.
const PREVIEW_SAMPLES: Record<string, { title: string; text: string }[]> = {
  "art": [
    { title: "Continuous line drawing challenge", text: "Give me a continuous line drawing challenge where I draw [an object] without lifting my pencil from the paper. Explain how to start, where to slow down for details, and how to turn a wobbly first attempt into a confident second drawing." },
    { title: "Pencil grades explained simply", text: "Explain pencil grades from 2H to 8B in plain language for a beginner in India. Tell me which pencil to use for light sketching, dark shading and fine details, and suggest a small starter set under [₹ amount] with one practice exercise for each pencil." },
    { title: "Eraser techniques for highlights", text: "Teach me five eraser techniques to create highlights in a pencil drawing, including lifting light, shaping edges and cleaning smudges. Use [a subject] as the example, and give me a short practice task I can finish in 15 minutes at home." },
  ],
  "business": [
    { title: "Monthly profit calculation made simple", text: "Teach me how to calculate my monthly profit in a simple way, using total sales minus all costs and expenses. Use [my business] with example numbers I give, explain what to include and leave out, and show me a one-page monthly profit sheet." },
    { title: "Simple cash book for a small shop", text: "Show me how to keep a simple cash book for a small shop, with date, description, money in and money out. Give me a sample week using [my shop], explain how to close the book daily, and list three common mistakes to avoid." },
    { title: "Pricing a service for the first time", text: "Help me price a service for the first time, using my time, travel, materials and a fair profit margin. Use [my service] as the example, explain how to work out an hourly rate, and give me a simple formula I can reuse." },
  ],
  "design": [
    { title: "Graduation invitation design", text: "Design a proud graduation invitation for [name], ceremony on [date] at [place]. Suggest the colours, a cap and scroll motif, the main heading, and the exact wording with time and venue details." },
    { title: "Corporate event invitation", text: "Design a formal invitation for our company event [event name] on [date] at [venue]. Suggest a professional colour scheme, a clean layout, the headline, and the exact wording with agenda, time and dress code." },
    { title: "School admission poster", text: "Design a poster for school admissions for [school name], admissions open for classes [classes]. Describe the headline, the main photo idea, three reasons to join, the colours, and where to put the phone number." },
  ],
  "finance": [
    { title: "Budget after a salary cut", text: "My salary has dropped from ₹[old] to ₹[new] a month. Help me remake my family budget: what to cut first, what to protect, and how to manage EMIs and school fees until my income recovers." },
    { title: "Budget after a job loss", text: "I lost my job and have savings of ₹[amount] to live on. Help me make a tight monthly budget for the next three months, what to pause, and how to stretch the money while I look for work." },
    { title: "Budget for irregular income", text: "I earn different amounts each month, usually between ₹[low] and ₹[high]. Help me make a budget that works on my lowest month, how to save in good months, and what to do in a slow month." },
  ],
  "hr": [
    { title: "Job ad for a security guard", text: "Write a job ad for a security guard for a [shop / office / apartment] in [area]. Mention day or night shift, uniform, duties at the gate, salary, and weekly off. Ask for age, height and previous experience if any." },
    { title: "Job ad for a data entry operator", text: "Write a job ad for a data entry operator who can type in English and [Hindi / Tamil] and use Excel. Mention the work (bills, stock lists, customer records), office hours, salary, and a short typing test at interview." },
    { title: "Job ad for a telecaller", text: "Write a job ad for a telecaller to call existing customers about [offers / orders / reminders] from our office in [area]. Mention languages needed, calling hours, salary plus incentive, and that no field work is involved." },
  ],
  "health": [
    { title: "Fibre-rich Indian foods", text: "List 12 fibre-rich Indian foods and how to add them to daily meals without changing the menu too much. Explain in simple words why fibre helps digestion. This is general food information, not medical advice." },
    { title: "Foods for healthy skin", text: "List 12 everyday Indian foods that generally support healthy skin, with one line each on why they help. Add 3 daily habits like water and sleep. This is general food information, not medical advice." },
    { title: "Foods for strong hair", text: "List 12 everyday Indian foods that generally support strong hair, with one line each on the nutrient they give. Add 3 simple hair care habits. This is general food information, not medical advice." },
  ],
  "learning": [
    { title: "Learn Bengali basics", text: "Teach me Bengali basics for beginners, including greetings, numbers, and simple sentences for daily life in West Bengal. Explain the pronunciation in English letters, give examples I can use at home, and finish with a small quiz using [topic] as the theme." },
    { title: "Learn Gujarati phrases", text: "Teach me useful Gujarati phrases for daily conversation in Gujarat, including greetings, asking for prices, and ordering vegetarian food. Write each phrase in English letters with its meaning, and create a short market dialogue I can practise with [family member]." },
    { title: "Learn Punjabi basics", text: "Teach me Punjabi basics for beginners, including greetings, polite words, and simple sentences used in Punjab homes. Explain the pronunciation in English letters, give me a daily practice list, and add five easy questions to test myself after learning [topic]." },
  ],
  "legal": [
    { title: "Ancestral property basics", text: "Explain ancestral property basics in India in simple words, including what ancestral property means, who can claim a share, and how it is different from self-acquired property. Use a simple family example, and note that the rules can vary by religion and state. This is general information only, not legal advice." },
    { title: "Property partition basics family", text: "Explain property partition basics for a family in India in simple words, including how family members can divide a shared property by agreement or through court. Explain the common steps, the documents usually needed, and why a written agreement matters. This is general information only, not legal advice." },
    { title: "Property gift deed basics", text: "Explain a property gift deed in simple words, including what it is, when people use it, and the usual steps like preparing the deed, paying stamp duty, and registering it. Explain the difference from a sale in plain words, and remind me to get legal help before signing. This is general information only, not legal advice." },
  ],
  "marketing": [
    { title: "Pamphlet distribution plan", text: "Plan how to distribute 2,000 pamphlets for my [business] in [area] in one week. Say which streets, housing societies and shops to cover, the best time of day, and how to track which areas bring the most customers." },
    { title: "Shop board wording that sells", text: "My shop board only has my shop name. Suggest 5 short lines to add underneath for a [shop type] in [area] that tell passers-by what I sell, one special offer, and why they should stop. Each line must be under 8 words." },
    { title: "Newspaper ad for a local shop", text: "Write a small newspaper ad for my [business] in [local newspaper name]. Keep it under 60 words, include the offer, address, phone number and timings, and make the headline clear enough to read at a glance." },
  ],
  "seo": [
    { title: "Hindi keyword ideas", text: "My website is in English but many customers search in Hindi. Give me 15 Hindi search phrases for [topic / product] in simple Hindi words, with the English meaning, and say which pages could use them." },
    { title: "Tamil keyword ideas for local business", text: "My shop is in Tamil Nadu and serves Tamil-speaking customers. List 15 Tamil search phrases for [product / service] in simple Tamil, with the English meaning, and say where to use them on my website." },
    { title: "Seasonal keyword calendar", text: "My website sells [products]. Make a 12-month keyword calendar: which search terms rise in each month — Diwali, summer, exams, weddings — and what page or post I should prepare one month before each peak." },
  ],
  "social-media": [
    { title: "GRWM reel for a function", text: "Plan a get-ready-with-me reel for [a wedding / a festival / a family function]. List the clips in order from outfit to final look, the on-screen text for each clip, and one tip to keep the whole reel under 45 seconds." },
    { title: "Q and A reel with followers", text: "Help me plan a question-and-answer reel for my page about [topic]. Give me 8 questions followers often ask, a one-line answer for each, and the order to ask them so the reel stays fun and fast." },
    { title: "Myth-busting reel", text: "Write a short myth-busting reel script about [topic, e.g. homemade food / skincare / studying]. Pick 3 common myths, give the true fact for each in one line, and end with a line that invites viewers to share their own myth." },
  ],
  "writing": [
    { title: "Email to a courier company about a late parcel", text: "Write a polite email to a courier company about my parcel [tracking number] that was due on [date] but has not arrived. Ask for the current status, the new delivery date, and a reply by email today." },
    { title: "Email to electricity board about a wrong bill", text: "Write a polite email to the electricity board about a wrong bill for [month]. My consumer number is [number], the bill shows ₹[amount] but my usual bill is about ₹[amount]. Ask them to check the meter reading and send a corrected bill." },
    { title: "Email to internet provider about slow connection", text: "Write a polite email to my internet provider about very slow internet for the last [number] days. Give my customer ID, my plan speed, and the speed I am actually getting, and ask them to fix it or send a technician." },
  ],
  "photo": [
    { title: "Metro ride home in the rain", text: "Using the uploaded couple photo, create an ultra-realistic cinematic portrait (4:5). Preserve both faces exactly as they are in the original image, with no change to eyes, nose, mouth, jawline, skin tone or expressions. No face replacement, no face morphing, no facial modifications. Place the couple sitting together in a city metro train on a rainy evening, rain drops sliding down the window beside them and city lights blurring past outside. The man wears a light blue formal shirt with sleeves rolled up and the woman wears a peach coloured office kurta, her wet hair tucked behind one ear. They smile at each other over the top of a shared phone, tired after work but happy to be heading home together. Cool blue evening light mixes with the warm glow of the metro interior. Shallow depth of field, dreamy blurred background, professional DSLR photography quality, 8K resolution, sharp focus on faces, realistic skin details and natural color grading. Add a small elegant semi-transparent watermark text 'Shenick7' subtly blended into the design (around 40% visibility), positioned naturally within the scene." },
    { title: "Green fields passing the window", text: "Create an ultra-realistic cinematic wide scene (16:9) using the uploaded couple photo. Keep both faces exactly as in the uploaded image, with the same eyes, nose, mouth, facial structure, skin tone and expressions. Do not alter, beautify, reshape or regenerate the faces. Place the couple seated by the large window of a daytime train, watching bright green paddy fields and palm trees slide past under a clear blue sky. The man wears a beige linen shirt and the woman wears a light green cotton saree with a simple silver necklace. Fresh morning sunlight fills the compartment and lights up their relaxed faces as they point at something interesting outside. Capture the calm joy of a slow countryside journey, the open sky and the green land stretching to the horizon. Bright natural light, soft shadows, shallow depth of field, professional DSLR photography quality, 8K resolution, sharp focus on faces, realistic skin details and natural color grading. Add a small elegant semi-transparent watermark text 'Shenick7' subtly blended into the design (around 40% visibility), positioned naturally within the scene." },
    { title: "First train trip at sunrise", text: "Create an ultra-realistic cinematic Facebook post size (1:1) romantic portrait using the uploaded couple photo. Extract only the faces of both individuals from the uploaded image and seamlessly integrate them into a new scene while preserving their original face identity exactly. The eyes, nose, mouth, facial structure, skin tone, expressions, and unique facial features must remain completely unchanged. Do not alter, beautify, reshape, or regenerate the faces. Place the couple on a quiet railway platform at sunrise, standing close with their backpacks, the first light of the day painting the sky in soft orange and pink. The man wears a rust coloured t-shirt and the woman wears a white kurta with a denim jacket. They hold paper tickets and smile at each other with the excitement of their first trip together, a train waiting in the background with its lights still on. Capture the beginning of a journey and the happiness of starting it side by side. Premium cinematic photography, 8K resolution, sharp focus on faces, realistic skin details, magazine-quality editing, high dynamic range and natural color grading. Add a small elegant semi-transparent watermark text 'Shenick7' subtly blended into the design (around 40% visibility), positioned naturally within the scene." },
  ],
  "cooking": [
    { title: "Idli batter plan for the whole week", text: "Plan idli batter for the whole week for a family of 4, so we can steam fresh idli on busy mornings. Tell me how much rice and urad dal to soak, how to store the batter, and how many days it stays good. Keep the steps simple, use everyday utensils, and note one way to save time on [a weekday]." },
    { title: "Idli with sambar for Sunday breakfast", text: "Make a Sunday breakfast of idli with hot sambar for 5 people, with the sambar cooked while the idlis steam. List the sambar vegetables, the tempering steps, and the order to cook everything so both are ready together. Use ingredients from [your kitchen] and keep the cost under ₹[amount] for the whole family." },
    { title: "Fixing hard idli at home", text: "Help me fix idli that turns out hard and dry, even though I follow the recipe every time. Explain the likely reasons in simple words, the correct batter consistency, and one test to try before steaming the full batch. Add a [tip] for [your family] and a simple serving idea for [a busy morning]." },
  ],
  "travel": [
    { title: "Plan a trip around a festival", text: "We want to plan a [number]-day trip around [festival name] in [month]. Tell me which city celebrates it best, what happens on each day, where to stay nearby, what to eat, and how early we should book travel and rooms so we do not miss the main events." },
    { title: "Choose a destination for a friends trip", text: "Four friends want a fun [number]-day trip from [your city] with a budget of ₹[amount] each. We like [adventure / food / music / sightseeing]. Suggest three places that suit a young group, with the cheapest way to reach each one, fun activities, and a rough daily cost per person." },
    { title: "Pick a quiet place for a relaxing break", text: "I need a quiet, relaxing break for [number] days and want to avoid crowded tourist spots. Suggest three calm places in India with clean air, slow mornings, simple food and short walks. Include how to reach each place from [your city] and the best month to visit." },
  ],
  "technology": [
    { title: "Understand RAM on a phone", text: "Explain what RAM means on a phone in very simple words, like you are telling a beginner. Tell me the difference between 4 GB, 6 GB and 8 GB RAM, how it affects speed, and how much RAM I need for daily use and light games." },
    { title: "New phone or second-hand phone", text: "Should I buy a new phone or a second-hand phone with a budget of [₹10,000]? List the advantages and risks of each choice in simple words. Tell me what to check before buying a used phone and when a new phone is the safer choice." },
    { title: "Checklist before buying a phone", text: "Give me a simple checklist to use before buying a new phone from a shop. Include what to check on the bill, warranty card, box seal, screen, camera and battery. Tell me which questions to ask the shopkeeper so I do not get cheated." },
  ],
  "sports": [
    { title: "Play the cut shot well", text: "Teach me how to play the cut shot in cricket. Explain the right ball to cut, the footwork, the bat angle and the follow-through. Give me a simple drill I can do with a tennis ball and a friend in [your area]." },
    { title: "Play the sweep against spin", text: "Explain how to play the sweep shot against spin bowling in simple steps. Tell me when to sweep, how to get down low, and how to keep the ball on the ground. Give me two practice drills and the mistakes to avoid." },
    { title: "Bat against fast bowling confidently", text: "Give me simple tips for batting against fast bowling as a beginner. Explain how to watch the ball early, keep my head still and play late. Include ways to build confidence and a short net practice plan for [two days a week]." },
  ],
  "parenting": [
    { title: "Sterilising bottles and feeding equipment", text: "Give me a simple daily routine for cleaning and sterilising my baby's bottles, teats and bowls. Explain boiling, steam steriliser and cold-water methods in plain words. Tell me how often to replace teats and when sterilising can stop." },
    { title: "Night feeds without losing sleep", text: "Give me a calm night-feed routine for my [age]-old baby that helps us both get back to sleep quickly. Cover dim lights, quiet feeding, changing the nappy only when needed, and settling the baby down again. Add tips for parents who take turns." },
    { title: "My baby spits up after feeds", text: "Explain why babies spit up milk after feeds and when it is normal. Tell me the difference between simple spitting up and reflux that needs a doctor. Give me feeding positions and habits that reduce spitting up in a [age]-old baby." },
  ],
  "farming": [
    { title: "Compare paddy and maize for my field", text: "Compare paddy and maize for my [3-acre] field in [your district] where I have canal water in kharif season. Compare water needs, growing days, labour, cost and income, and tell me which crop fits better if I have only two workers at home." },
    { title: "Choose between cotton and groundnut this season", text: "Help me decide between cotton and groundnut for this season on my [4-acre] field in [your state]. My soil is [describe it] and I have [borewell / rain only] water. Compare cost, risk, market price and work, then give a clear final suggestion." },
    { title: "Best short duration crop after paddy harvest", text: "After my paddy harvest in [month], I have [2 acres] free for about three months before the next season. Suggest short duration crops I can grow in that gap, with sowing dates, water needs and expected income for each option in simple words." },
  ],
  "photography": [
    { title: "Try time lapse video for beginners", text: "Explain time lapse video in simple words and help me record one of [clouds moving / traffic at a signal / a sunset]. Tell me how long to record, where to keep the phone steady, and what to check before starting." },
    { title: "Explore manual mode without fear", text: "Explain manual mode on my phone camera for a complete beginner. Describe ISO, shutter speed and white balance in simple words, then give me one safe setting to try first for [an indoor room / an evening garden]." },
    { title: "Use macro mode for tiny details", text: "Teach me to use macro mode to photograph [a flower / a coin / a ring]. Tell me how close to go, how to keep the phone steady, and why good daylight matters more than zoom for tiny subjects." },
  ],
  "music": [
    { title: "First instrument for a shy six-year-old", text: "My child is shy and quiet, and I want a first instrument for my 6-year-old son. Compare the drums, flute and guitar for confidence, solo practice at [your home], and playing with others later. Suggest the kindest starting point and how to keep lessons fun." },
    { title: "Best first instrument for small flats", text: "We live in a small flat in [your city] and want a first instrument for my retired father. Compare the drums, flute and guitar for space, noise, storage and cost. Recommend the best fit and explain how to practise quietly without disturbing neighbours." },
    { title: "First instrument for a college student", text: "We live in a small flat in [your city] and want a first instrument for me, a college student. Compare the keyboard, guitar and flute for space, noise, storage and cost. Recommend the best fit and explain how to practise quietly without disturbing neighbours." },
  ],
  "home-living": [
    { title: "Weekday cleaning plan for a single person living alone", text: "Make a weekday cleaning plan for a single person living alone in a [1-bedroom flat]. It should take 15 minutes a day, cover the kitchen and bathroom, and include one small extra job each day so the flat stays clean all week." },
    { title: "Daily cleaning checklist for a home with a pet dog", text: "Create a daily cleaning checklist for a home with a pet dog. Include sweeping up fur, cleaning the dog's bowls and bed, mopping muddy paw marks, and a quick weekly wash of the dog's blankets and toys." },
    { title: "Quick 15-minute tidy-up routine before guests arrive", text: "Give me a quick 15-minute tidy-up routine to do before guests arrive. Tell me what to clean first, how to make the living room and bathroom look fresh, and where to hide clutter quickly without making a mess elsewhere." },
  ],
  "pets": [
    { title: "Dog breeds that are good with children", text: "My children are aged [ages]. Which dog breeds are known to be patient and gentle with children? Give me four options with temperament, size, playfulness and safety tips for the first month together at home." },
    { title: "Low shedding dog breeds explained simply", text: "Someone in our home has dust allergies, so we need a low-shedding dog in [your city]. Explain what low shedding really means, list four suitable breeds, and tell me how much grooming, brushing and cleaning each one still needs every week." },
    { title: "Choosing between a puppy and adult dog", text: "Should I adopt a puppy or an adult dog? I live in [your city], work [hours] a day and have [children / no children]. Compare training time, cost, patience needed and bonding, then help me decide which suits my daily routine better." },
  ],
  "fashion": [
    { title: "Pick colours that suit warm skin tones", text: "Explain in simple words which colours suit a warm skin tone and which colours to avoid. Give examples of everyday tops, kurtas and dresses in those colours. Tell me how to test a colour against my skin at home using natural light and a mirror." },
    { title: "Pick colours that suit cool skin tones", text: "Explain in simple words which colours suit a cool skin tone and which colours to avoid. Give examples of everyday tops, kurtas and dresses in those colours. Tell me how to test a colour against my skin at home using natural light and a mirror." },
    { title: "Dress for a humid monsoon day", text: "Suggest what to wear on a humid monsoon day in [your city] when it may rain at any time. I need clothes that dry fast, do not stick to the skin and stay comfortable on a crowded bus. List the outfit, colours and fabrics, and what to avoid." },
  ],
  "personal-growth": [
    { title: "Start a new habit in 30 days", text: "I want to build the habit of [your chosen habit] but I always quit after a few days. Make me a 30-day plan that starts very small, grows slowly each week and includes a daily tick box, a weekly reward and a plan for days when I feel lazy or busy." },
    { title: "Break the late night phone habit", text: "I scroll on my phone till 1 am and then wake up tired. Help me break this habit in 30 days. Give me a night routine, a phone-free bedroom plan, replacement activities for the last hour before bed and a way to measure my progress each week in [your city]." },
    { title: "Morning routine for students before school", text: "My child is [age] years old and struggles to wake up for school at [school time]. Design a morning routine that starts the night before, includes a fixed wake-up time, breakfast ideas and a calm way to revise for ten minutes, without rushing or scolding." },
  ],
  "real-estate": [
    { title: "Understand the total cost of buying", text: "Explain the total cost of buying a home in [your city] in simple words. Apart from the flat price, what other costs come up, like registration, stamp duty, society charges and moving costs? Give a simple example with a home of [amount]." },
    { title: "Check water supply before buying", text: "Tell me how to check the water supply of a flat before buying it in [your city]. What questions should I ask about borewell water, municipal water, tanker supply and storage tanks? Explain what answers should worry me and what is normal." },
    { title: "Visit a home in the evening", text: "Tell me why I should visit a home in the evening as well as in the daytime. What can I learn about noise, water, power, parking and safety after dark? Give me a short list of things to notice on an evening visit to [area name]." },
  ],
  "environment": [
    { title: "Control Pests on Tomatoes Naturally", text: "I found whiteflies on my tomatoes in [your city] and want to save the crop for my family. Give me three natural remedies I can make at home, explain how to apply each one safely, and tell me how to check after three days whether the pests are gone." },
    { title: "Fix Weak Tomato Plants Fast", text: "My tomato plants look weak, with yellow leaves and slow growth, in [your city]. Ask me three simple questions about water, sunlight and soil, then explain the likely causes, what to change first, and how long it should take for new green leaves to appear." },
    { title: "Feed Tomatoes With Homemade Fertiliser", text: "I grow tomatoes in [your city] and want a monthly feeding plan using kitchen waste and compost costing under ₹[amount]. List what to add each week, how much to use for one 12-inch pot, and how to tell if the leaves turn greener and growth improves." },
  ],
  "festivals": [
    { title: "Make a Diwali cleaning checklist for family", text: "Make a Diwali cleaning checklist for a family of [four people]. Divide the work by room and by person, including children with small safe jobs. Add a tick box style list we can print and finish over [five days] before the festival." },
    { title: "Clean the bathroom before Diwali guests arrive", text: "Give me a quick plan to clean two bathrooms before Diwali in [your city] guests arrive. Cover tiles, taps, mirrors, drains and the floor. List safe cleaners I can buy locally and tell me how to remove hard water marks without strong chemicals." },
    { title: "Organise the store room before Diwali", text: "Help me organise my messy store room before Diwali in [your city]. Suggest how to sort boxes, label them clearly, and use shelves and old bags for storage. Tell me what to keep for the festival and what to move out so the room looks tidy." },
  ],
  "teaching": [
    { title: "Simple Lesson Plan For Slow Learners", text: "Plan a 30 minutes lesson on [a topic they find hard] for slow learners in a small group in a quiet tuition room. Give a clear aim, a short opening, three steps, one activity, and a quick closing check. Use simple words, keep steps short, and add one example from cooking at home that learners will recognise." },
    { title: "Simple Lesson Plan For A Mixed Class", text: "Plan a 40 minutes lesson on [a new topic] for a mixed class of 30 pupils in a school classroom. Give a clear aim, a short opening, three steps, one activity, and a quick closing check. Use simple words, keep steps short, and add one example from a school garden that learners will recognise." },
    { title: "Simple Lesson Plan For Young Children", text: "Plan a 25 minutes lesson on [a simple topic] for children aged 6 to 8 in a morning class. Give a clear aim, a short opening, three steps, one activity, and a quick closing check. Use simple words, keep steps short, and add one example from a family function that learners will recognise." },
  ],
  "languages": [
    { title: "Speak English at the vegetable shop", text: "Write a short English conversation for buying vegetables at a shop in [your area]. Include asking prices, asking for [1 kg tomatoes], and asking for change. Keep every sentence short and simple, and give me 5 extra sentences I can use at any shop." },
    { title: "Describe my family in English simply", text: "Help me describe my family in simple English. Ask me about [number] family members, their work and their hobbies, one question at a time. After my answers, write my family description in 10 easy sentences I can read aloud and practise every morning." },
    { title: "Talk about the weather in English", text: "Give me 15 short English sentences to talk about the weather in [your city] in [summer / monsoon]. Include hot days, rain, and cool mornings. Add 5 questions I can ask a friend about the weather, and a short two-person chat to practise." },
  ],
  "science": [
    { title: "How a magnifying glass works", text: "Explain how a magnifying glass makes small print look bigger. Tell me what the curved glass does to light, why we must hold it at the right distance, and how people use it to read [a newspaper] at home." },
    { title: "Why a spoon looks bent in water", text: "Explain why a spoon in a glass of water looks bent at the surface. Tell me how light changes direction when it moves from air into water, and give two more daily examples of this effect in [your kitchen]." },
    { title: "White light and seven colours", text: "Explain how white sunlight is made of seven colours. Tell me what happens when sunlight passes through a prism or raindrops, name the colours in order, and give a simple way to show this to a child at [home]." },
  ],
  "history": [
    { title: "The Great Bath of Mohenjo-daro", text: "Describe the Great Bath of Mohenjo-daro in simple words. Tell me its size, how it was built to hold water, and why historians think people used it. Finish with two ideas for a school chart about it for [my class]." },
    { title: "Indus Valley crafts and workers", text: "List the main crafts of the Indus Valley, such as pottery, bead making, metal work and weaving. For each craft, explain what the worker made and which material they used, in simple words a [class 6 student] can understand." },
    { title: "How Indus cities got water", text: "Explain how Indus Valley cities managed water in simple words. Cover wells, drains, baths and the Great Bath, and tell me what modern Indian towns can still learn from them today. Keep the answer short and clear for a [school project]." },
  ],
  "movies": [
    { title: "Classic family film for a first watch", text: "Suggest a classic family film that [our children aged 10 and 13] have never seen before. It should still feel fresh today, with a strong story and memorable characters. Explain what makes it a classic and what to talk about after watching it." },
    { title: "Film about friendship for the whole family", text: "Find a family film about friendship that we can watch with [our 8-year-old daughter]. It should show kind friends helping each other, with funny moments and a sweet ending. Tell me the story briefly and one good question to ask her after the film." },
    { title: "Family film with a kind moral lesson", text: "Recommend a family film with a clear, kind lesson about honesty or helping others. It should suit [children aged 6 to 11] and teach without sounding like a school lesson. Give the name, the story in short, and the lesson it teaches." },
  ],
  "books": [
    { title: "Choose a book to read with my mother", text: "My mother and I want to read the same book and talk about it every Sunday. She likes [family stories] and prefers [Tamil] books. Suggest 5 books we can both enjoy, tell me what each book is about in simple words, and pick the best one for us." },
    { title: "Find a short book for a busy week", text: "I am very busy this week and I only have [15 minutes] a day to read. I want a short book I can finish in [7 days]. Suggest 5 books under [150 pages], tell me how many pages to read each day, and say which one is the easiest to finish." },
    { title: "Pick a book for my holiday in Goa", text: "I am going on holiday to [Goa] for [5 days] and I want a light book for the beach. I like [travel and sea stories] and I want something relaxing. Suggest 5 books, tell me the mood of each one, and choose the best book for a slow holiday." },
  ],
  "shopping": [
    { title: "Buy clothes for a growing child", text: "Help me buy clothes for my [age]-year-old child who is growing fast. Tell me how much bigger to buy, which clothes are worth buying bigger, and which ones should fit exactly now. Give me a simple checklist for school and daily wear." },
    { title: "Check a dress fit properly", text: "Help me check if a dress fits me properly in the trial room. Tell me what to look at around the shoulders, waist, chest and hem. Explain how to move, sit and raise my arms to test comfort, and when the dress needs a different size." },
    { title: "Choose clothes for a tall person", text: "Help me choose clothes that fit a tall person well. My height is [height]. Tell me which shirt lengths, trouser lengths and sleeve lengths to look for, and which styles to avoid. Suggest simple tailoring fixes for sleeves and hems that are too short." },
  ],
  "vehicles": [
    { title: "Comparing two vehicles fairly for family trips", text: "Compare two popular electric scooter models that cost around ₹1 lakh in Jaipur. I will use it mainly for long highway trips every month. Compare price, comfort, safety, boot space and after-sales service. End with a clear suggestion for a family buyer." },
    { title: "Comparing two vehicles fairly on a tight budget", text: "Compare two popular premium bike models that cost around ₹2 lakh in Indore. I will use it mainly for short city rides and market runs. Compare price, comfort, safety, boot space and after-sales service. End with a clear suggestion for a family buyer." },
    { title: "Comparing two vehicles fairly for new buyers", text: "Compare two popular hatchback models that cost around ₹7 lakh in Kochi. I will use it mainly for daily college travel of 15 km. Compare price, comfort, safety, boot space and after-sales service. End with a clear suggestion for a family buyer." },
  ],
  "weddings": [
    { title: "Find hidden wedding costs before they surprise you", text: "List the hidden costs many Indian families forget when planning a wedding for [number] guests. Include small things like transport, tips, extra chairs and last-minute shopping. Give a rough ₹ amount for each one so we can plan better." },
    { title: "Save money on your wedding without cutting joy", text: "Give me twenty practical ways to save money on a wedding in [your city] for [number] guests. Focus on smart choices, not on cutting the fun. For each idea, say roughly how much money it can save." },
    { title: "Build a monthly saving plan for the wedding", text: "Our wedding is in [number] months and we need to save [amount]. Make a simple monthly saving plan for our family. Show how much to set aside each month and suggest easy ways to cut daily spending till the wedding." },
  ],
  "elder-care": [
    { title: "Hair wash day routine for my grandmother", text: "Plan a hair wash day routine for my [grandmother] with long hair. Explain how often to wash it, how to wet, soap and rinse it gently, and how to dry it without tiring her. Add tips for combing and oiling her hair afterwards." },
    { title: "How to keep bath time calm and private", text: "Suggest ways to make bath time calm and private for my [elderly father]. Explain how to close the door, keep only the needed items nearby, talk softly, and let him do what he can himself. Add ideas for days when he feels shy or upset." },
    { title: "A simple bath checklist for daily care", text: "Make a simple daily bath checklist for caring for my [elderly mother] at home. List everything to prepare before the bath, the steps during the bath, and what to check afterwards. Keep it short enough to stick on the bathroom wall." },
  ],
};

// Buyer reviews. The "What buyers say" section stays hidden until at least
// one review is added here.
// TODO (Shenick): add your first buyer review to show the section.
const PACK_REVIEWS: { name: string; text: string }[] = [];

export default function PackBuyPanel({
  label,
  slug,
  previewTitles,
}: {
  label: string;
  slug: string;
  previewTitles: string[];
}) {
  const [copied, setCopied] = useState(false);

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the ID is shown as plain text to copy by hand.
    }
  }

  const waText = encodeURIComponent(
    `Hi Shenick, I paid ₹999 for the ${label} prompt pack (1,000 prompts). My payment reference (UTR): [paste it here]. I am attaching the payment screenshot.`
  );

  return (
    <section className="card featured" style={{ marginTop: 28 }}>
      <h2 style={{ marginTop: 0 }}>Get all 1,000 {label} prompts — ₹999</h2>
      <p>
        The 25 prompts above are free. The full pack has 1,000 {label.toLowerCase()} prompts —
        every one written for beginners, ready to copy into any AI tool.
      </p>
      {previewTitles.length > 0 && (
        <div>
          <p className="muted" style={{ fontSize: 14, marginBottom: 6 }}>
            A peek inside the pack (locked — full text comes with the pack):
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
            {previewTitles.map((t) => (
              <li key={t} className="muted" style={{ padding: "4px 0" }}>
                🔒 {t}
              </li>
            ))}
            <li className="muted" style={{ padding: "4px 0" }}>🔒 …and 995 more</li>
          </ul>
        </div>
      )}
      <h3 style={{ marginBottom: 6 }}>Free preview</h3>
      <p className="muted" style={{ fontSize: 14, marginTop: 0 }}>
        Three full prompts from this pack — try them free before you buy.
      </p>
      {(PREVIEW_SAMPLES[slug] ?? []).map((s) => (
        <article key={s.title} className="card">
          <h3>{s.title}</h3>
          <p className="prompt">{s.text}</p>
        </article>
      ))}
      <div className="box">
        <h3 style={{ marginTop: 0 }}>What you get</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>1,000 prompts — one-time payment, no subscription.</li>
          <li>Format: PDF — one file with all the prompts.</li>
          <li>Delivery: on WhatsApp within 1 hour after payment is checked.</li>
          <li>Works in ChatGPT, Claude, Gemini and other AI tools.</li>
          <li>The 25 free prompts are included in the pack file too — 1,025 prompts in total.</li>
        </ul>
      </div>
      <h3 style={{ marginBottom: 6 }}>How to buy</h3>
      <ol style={{ marginTop: 0 }}>
        <li>
          <b>Pay ₹999 via UPI</b> — tap the button below (opens your UPI app), scan the QR code,
          or copy the UPI ID <code>{UPI_ID}</code>{" "}
          <button type="button" className="chip" onClick={copyUpi}>
            {copied ? "Copied ✓" : "Copy UPI ID"}
          </button>
        </li>
        <li>
          <b>Send your payment screenshot on WhatsApp</b> — tap the WhatsApp button and attach
          the screenshot of your payment there.
        </li>
        <li>
          <b>Shenick shares the full pack file with you on WhatsApp</b> (1,000 paid
          prompts + the 25 free prompts) after checking your payment.
        </li>
      </ol>
      <p style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <a className="btn" href={UPI_LINK}>
          Pay ₹999 via UPI
        </a>
        <a
          className="btn ghost"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          I&apos;ve paid — send screenshot on WhatsApp
        </a>
      </p>
      <p style={{ margin: "4px 0 0" }}>
        <img
          src="/upi-qr-999.svg"
          alt="QR code to pay ₹999 via UPI for the prompt pack"
          width={180}
          height={180}
        />
      </p>
      <p className="muted" style={{ fontSize: 14, marginBottom: 0 }}>
        Pay only ₹999 for this pack. One-time payment, no subscription. Refunds: see our{" "}
        <Link href="/refund-policy">Refund policy</Link>.
      </p>
      <section className="faq" aria-label="Common questions">
        <h2>Common questions</h2>
        <details>
          <summary>How do I pay?</summary>
          <p>Pay ₹999 with UPI — tap “Pay ₹999 via UPI” above, scan the QR code, or copy the UPI ID into your UPI app. We don’t take card payments on this site.</p>
        </details>
        <details>
          <summary>When do I get it?</summary>
          <p>After we check your payment, Shenick shares the pack file with you on WhatsApp — within 1 hour.</p>
        </details>
        <details>
          <summary>What format?</summary>
          <p>PDF. You get one PDF file with all the prompts — the 1,000 paid prompts plus the 25 free prompts.</p>
        </details>
        <details>
          <summary>Can I get a refund?</summary>
          <p>No. All sales are final — prompt packs are digital files. If you paid and did not get your pack within 1 hour, message us on WhatsApp and we will send it. See our <Link href="/refund-policy">Refund policy</Link>.</p>
        </details>
        <details>
          <summary>Can I use these for my business?</summary>
          <p>Yes. You can use the prompts for your own personal and business work. You can’t resell the pack, share the pack file, or publish the prompts as your own. See the <Link href="/terms">Terms</Link> for the full licence.</p>
        </details>
      </section>
      {PACK_REVIEWS.length > 0 && (
        <section aria-label="What buyers say">
          <h2>What buyers say</h2>
          {PACK_REVIEWS.map((r) => (
            <blockquote key={r.name}>
              <p>{r.text}</p>
              <p className="muted">— {r.name}</p>
            </blockquote>
          ))}
        </section>
      )}
    </section>
  );
}
