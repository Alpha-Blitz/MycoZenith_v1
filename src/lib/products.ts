export type Benefit = {
  icon: string
  title: string
  body: string
}

export type HowToUseStep = {
  step: string
  detail: string
}

export type HeroBullet = {
  icon: string
  label: string
}

export type FAQ = {
  q: string
  a: string
}

export type Testimonial = {
  rating: number
  quote: string
  author: string
}

export type Product = {
  slug: string
  image: string
  images: string[]
  name: string
  tag: string
  description: string
  price: string
  rating: number
  reviewCount: number
  heroBullets: HeroBullet[]
  descriptionBullets: string[]
  longDescription: string
  benefits: Benefit[]
  howToUse: HowToUseStep[]
  servingSize: string
  extract: string
  betaGlucan: string
  testimonials: Testimonial[]
  faq: FAQ[]
}

export const PRODUCTS: Product[] = [
  {
    slug:        'lions-mane',
    image:       '/lm.jpeg',
    images:      ['/lm.jpeg', '/neuro.webp', '/fruiting.jpeg'],
    name:        "Lion's Mane",
    tag:         'Cognitive Focus',
    description: "Sharpen neural pathways and fuel deep focus. Lion's Mane stimulates NGF for long-term cognitive performance.",
    price:       '₹1,599',
    rating:      4.8,
    reviewCount: 94,
    heroBullets: [
      { icon: '🧠', label: 'Stimulates Nerve Growth Factor (NGF)' },
      { icon: '🎯', label: 'Sharpens focus & eliminates brain fog' },
      { icon: '💾', label: 'Enhances memory consolidation' },
      { icon: '🌿', label: 'Pure fruiting body — no mycelium filler' },
    ],
    descriptionBullets: [
      'Stimulates NGF synthesis for long-term neuroplasticity',
      'Reduces cognitive fatigue during deep work sessions',
      'Supports hippocampal health and memory formation',
      'Promotes restful sleep for overnight neural repair',
      '10:1 dual extract — 30× more potent than raw powder',
    ],
    longDescription:
      "Lion's Mane (Hericium erinaceus) is the most studied nootropic mushroom on earth. Its unique hericenones and erinacines cross the blood-brain barrier and stimulate Nerve Growth Factor (NGF) — the protein responsible for the growth, maintenance, and survival of neurons. Regular supplementation supports sharper recall, deeper focus, and long-term cognitive resilience.",
    benefits: [
      { icon: '🧠', title: 'NGF Stimulation',   body: 'Hericenones & erinacines directly upregulate Nerve Growth Factor, supporting neuroplasticity and new neuron formation.' },
      { icon: '🎯', title: 'Deep Focus',          body: 'Reduces brain fog and promotes a calm, alert mental state — ideal for sustained cognitive work.' },
      { icon: '💾', title: 'Memory & Recall',     body: 'Supports hippocampal function linked to both short-term recall and long-term memory consolidation.' },
      { icon: '🌙', title: 'Sleep Quality',        body: 'Promotes healthy sleep architecture, giving the brain time to process and consolidate the day\'s learning.' },
    ],
    howToUse: [
      { step: 'Morning Dose',       detail: 'Take 2 capsules in the morning with or without food. Pairs well with coffee or your pre-work ritual.' },
      { step: 'Consistent Use',     detail: 'NGF upregulation is cumulative — benefits peak at 4–8 weeks of daily use. Do not skip days.' },
      { step: 'Stack Optionally',   detail: 'Combines synergistically with Cordyceps for energy + focus, or Reishi for evening wind-down.' },
    ],
    servingSize: '2 capsules / day',
    extract:     '10:1 dual extract',
    betaGlucan:  '≥30% beta-glucans',
    testimonials: [
      { rating: 5, quote: "My focus during long coding sessions is night and day. No crash, just clean clarity.", author: 'Arjun M.' },
      { rating: 5, quote: "Three weeks in and I'm retaining information so much faster. Genuinely surprised.", author: 'Priya S.' },
      { rating: 5, quote: "Stacked it with Cordyceps for work + gym. Best combination I've tried.", author: 'Karan T.' },
    ],
    faq: [
      { q: 'How long until I notice results?',    a: 'Most users report improved focus within 1–2 weeks. NGF-related benefits like memory and neuroplasticity peak at 4–8 weeks of consistent daily use.' },
      { q: 'Can I take it with coffee?',           a: 'Yes — Lion\'s Mane pairs excellently with caffeine. It sharpens the focus without adding jitteriness.' },
      { q: 'Is this fruiting body or mycelium?',   a: '100% fruiting body extract. We never use mycelium-on-grain, which contains mostly starch and negligible beta-glucans.' },
      { q: 'Any side effects?',                    a: 'Lion\'s Mane is well-tolerated. Rarely, individuals may experience mild digestive sensitivity in the first few days — take with food if needed.' },
    ],
  },
  {
    slug:        'reishi',
    image:       '/reishi.jpeg',
    images:      ['/reishi.jpeg', '/hero.jpeg', '/lm.jpeg'],
    name:        'Reishi',
    tag:         'Stress + Immunity',
    description: 'Adaptogenic support to regulate cortisol, fortify immunity, and promote restful recovery.',
    price:       '₹1,199',
    rating:      4.7,
    reviewCount: 78,
    heroBullets: [
      { icon: '🛡️', label: 'Fortifies immune response' },
      { icon: '⚖️', label: 'Regulates cortisol & HPA axis' },
      { icon: '💤', label: 'Deepens sleep & recovery' },
      { icon: '🌿', label: 'Pure fruiting body — no mycelium filler' },
    ],
    descriptionBullets: [
      'Activates macrophages and natural killer cells via beta-glucans',
      'Triterpenes modulate the HPA axis to reduce chronic cortisol',
      'Promotes slow-wave sleep for deeper physical and neural recovery',
      'Supports healthy blood pressure and lipid regulation',
      '15:1 dual extract — maximum bioavailability of active triterpenes',
    ],
    longDescription:
      'Reishi (Ganoderma lucidum) — the "Mushroom of Immortality" — has been central to Eastern medicine for over 2,000 years. Its triterpenes and polysaccharides work on the hypothalamic-pituitary-adrenal (HPA) axis to modulate cortisol, reduce stress reactivity, and build a resilient immune response. The result is a calmer nervous system and deeper, more restorative recovery.',
    benefits: [
      { icon: '🛡️', title: 'Immune Fortification', body: 'Beta-glucans activate macrophages and natural killer cells, strengthening the body\'s first line of defence.' },
      { icon: '⚖️', title: 'Cortisol Modulation',   body: 'Triterpenes regulate the HPA axis to lower chronic stress hormones and reduce stress reactivity.' },
      { icon: '💤', title: 'Sleep & Recovery',       body: 'Promotes deeper slow-wave sleep — the phase where physical and neural repair actually happens.' },
      { icon: '❤️', title: 'Cardiovascular Support', body: 'Research links Reishi to improved blood pressure regulation and healthier lipid profiles.' },
    ],
    howToUse: [
      { step: 'Evening Dose',       detail: 'Take 2 capsules 1–2 hours before bed. Reishi\'s calming effect pairs best with the wind-down period.' },
      { step: 'With Food',          detail: 'For optimal triterpene absorption, take with a small meal or healthy fat source.' },
      { step: 'Immunity Protocol',  detail: 'During high-stress periods or travel, increase to 3 capsules per day for targeted immune support.' },
    ],
    servingSize: '2 capsules / day',
    extract:     '15:1 dual extract',
    betaGlucan:  '≥25% beta-glucans',
    testimonials: [
      { rating: 5, quote: "I sleep so much deeper now. Wake up actually feeling rested for the first time in years.", author: 'Sneha R.' },
      { rating: 5, quote: "Got sick once this winter instead of the usual four times. Sticking with Reishi.", author: 'Dev K.' },
      { rating: 4, quote: "Stress at work is still there but my reaction to it has completely changed. More calm.", author: 'Meera J.' },
    ],
    faq: [
      { q: 'When is the best time to take Reishi?',  a: 'Evening, 1–2 hours before bed. Its calming, adaptogenic effect pairs best with the wind-down period and supports deeper sleep.' },
      { q: 'Can I take it during the day?',           a: 'Yes, but daytime use may cause some drowsiness in sensitive individuals. Start with an evening dose to gauge your response.' },
      { q: 'How does it help with stress?',           a: 'Reishi triterpenes regulate the HPA axis — the brain-body stress circuit — reducing baseline cortisol and blunting the acute stress response.' },
      { q: 'Any side effects?',                       a: 'Reishi is extremely well-tolerated. Very rarely, high doses may cause mild digestive discomfort. Stay within the recommended serving.' },
    ],
  },
  {
    slug:        'cordyceps',
    image:       '/cordy.jpeg',
    images:      ['/cordy.jpeg', '/vo2.webp', '/hero1.jpeg'],
    name:        'Cordyceps',
    tag:         'Energy + Endurance',
    description: 'Unlock cellular energy at the mitochondrial level. Clinically studied for VO₂ max and sustained output.',
    price:       '₹2,599',
    rating:      4.9,
    reviewCount: 132,
    heroBullets: [
      { icon: '⚡', label: 'Boosts cellular ATP production' },
      { icon: '🫁', label: 'Improves oxygen utilisation' },
      { icon: '🏃', label: 'Increases VO₂ max & endurance' },
      { icon: '🌿', label: 'Pure fruiting body — no mycelium filler' },
    ],
    descriptionBullets: [
      'Upregulates mitochondrial ATP synthesis via cordycepin',
      'Clinical trials: measurable VO₂ max gains in 3+ weeks',
      'Improves lactate clearance — delays fatigue at threshold',
      'Enhances bronchodilation and oxygen delivery to muscles',
      '8:1 dual extract — highest cordycepin concentration available',
    ],
    longDescription:
      'Cordyceps militaris is the most researched ergogenic mushroom in sports science. Its primary active compound, cordycepin, mimics adenosine and directly stimulates the production of cellular ATP — the body\'s primary energy currency. Peer-reviewed trials show consistent improvements in VO₂ max, lactate threshold, and time-to-exhaustion, making it an evidence-backed edge for athletes and high-performers alike.',
    benefits: [
      { icon: '⚡', title: 'ATP Production',      body: 'Cordycepin upregulates key enzymes in the electron transport chain, increasing mitochondrial ATP output at the cellular level.' },
      { icon: '🏃', title: 'VO₂ Max & Endurance', body: 'Clinical trials show measurable increases in maximal oxygen uptake and time-to-exhaustion after 3+ weeks of use.' },
      { icon: '🔬', title: 'Lactate Clearance',    body: 'Improves the body\'s ability to buffer and clear lactic acid, delaying fatigue during high-intensity effort.' },
      { icon: '🫁', title: 'Oxygen Utilisation',   body: 'Enhances lung efficiency and bronchodilation, improving oxygen delivery to working muscles.' },
    ],
    howToUse: [
      { step: 'Pre-Workout',          detail: 'Take 2 capsules 30–45 minutes before training for peak ergogenic effect. Can be taken with pre-workout or black coffee.' },
      { step: 'Rest Day Protocol',    detail: 'On non-training days, take in the morning to maintain baseline ATP and mitochondrial adaptation.' },
      { step: 'Loading Phase',        detail: 'For new users: take daily for the first 3 weeks to establish cordycepin saturation before performance benefits fully manifest.' },
    ],
    servingSize: '2 capsules / day',
    extract:     '8:1 dual extract',
    betaGlucan:  '≥35% beta-glucans',
    testimonials: [
      { rating: 5, quote: "Better than any pre-workout I've used. No crash. Stamina just stays elevated.", author: 'Rohit V.' },
      { rating: 5, quote: "Workout stamina improved noticeably in under a week. PR'd my 5K run.", author: 'Aisha M.' },
      { rating: 5, quote: "Focus is clean and consistent. I stack it with Lion's Mane for a full cognitive + physical edge.", author: 'Siddharth P.' },
    ],
    faq: [
      { q: 'Any side effects?',                         a: 'No major side effects when used as directed. Cordyceps is well-tolerated even at higher doses. Not recommended for individuals on blood thinners without medical advice.' },
      { q: 'When will I see results?',                  a: 'Energy improvements can be felt within days. VO₂ max and endurance gains become measurable after 3+ weeks of consistent daily use.' },
      { q: 'Can I take it with coffee?',                a: 'Yes — the two are synergistic. Cordyceps enhances oxygen efficiency while caffeine boosts alertness. Many users prefer this stack pre-workout.' },
      { q: 'Is it safe for long-term daily use?',       a: 'Yes. Cordyceps has a strong long-term safety profile. Daily use is recommended to maintain cordycepin saturation and sustained performance benefits.' },
    ],
  },
]
