export type Benefit = {
  icon: string
  title: string
  body: string
}

export type HowToUseStep = {
  step: string
  detail: string
}

export type Product = {
  slug: string
  image: string
  name: string
  tag: string
  description: string
  price: string
  longDescription: string
  benefits: Benefit[]
  howToUse: HowToUseStep[]
  servingSize: string
  extract: string
  betaGlucan: string
}

export const PRODUCTS: Product[] = [
  {
    slug:        'lions-mane',
    image:       '/lm.jpeg',
    name:        "Lion's Mane",
    tag:         'Cognitive Focus',
    description: "Sharpen neural pathways and fuel deep focus. Lion's Mane stimulates NGF for long-term cognitive performance.",
    price:       '₹1,599',
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
  },
  {
    slug:        'reishi',
    image:       '/reishi.jpeg',
    name:        'Reishi',
    tag:         'Stress + Immunity',
    description: 'Adaptogenic support to regulate cortisol, fortify immunity, and promote restful recovery.',
    price:       '₹1,199',
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
  },
  {
    slug:        'cordyceps',
    image:       '/cordy.jpeg',
    name:        'Cordyceps',
    tag:         'Energy + Endurance',
    description: 'Unlock cellular energy at the mitochondrial level. Clinically studied for VO₂ max and sustained output.',
    price:       '₹2,599',
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
  },
]
