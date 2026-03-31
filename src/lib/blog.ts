/* ─── Block Types ─────────────────────────────────────────────── */
export type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'heading';   level: 2 | 3; text: string }
  | { type: 'quote';     text: string; attribution?: string }
  | { type: 'product';   slug: string }
  | { type: 'image';     src: string; alt: string; caption?: string }
  | { type: 'list';      ordered?: boolean; items: string[] }
  | { type: 'divider' }

/* ─── Author ──────────────────────────────────────────────────── */
export type Author = {
  name:   string
  role:   string
  bio:    string
  avatar: string
}

const DR_RAVI: Author = {
  name:   'Dr. Ravi Sharma',
  role:   'Head of Research, MycoZenith',
  bio:    'Mycologist and functional nutrition researcher with 12 years of clinical experience in adaptogenic compounds and evidence-based supplementation protocols.',
  avatar: '/hero.jpeg',
}

/* ─── Post Type ───────────────────────────────────────────────── */
export type Reference = {
  label:  string   // e.g. "Chen et al., 2022"
  title:  string   // full citation title
  url?:   string   // optional DOI or PubMed link
}

export type Post = {
  slug:                string
  image:               string
  category:            string
  title:               string
  excerpt:             string
  date:                string
  readTime:            string
  author:              Author
  tags:                string[]
  likeCount:           number
  commentCount:        number
  relatedProductSlugs: string[]
  relatedPostSlugs:    string[]
  references:          Reference[]
  content:             Block[]
}

/* ─── Helper to slugify heading text for anchor IDs ──────────── */
export function headingId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/* ─── Posts ───────────────────────────────────────────────────── */
export const POSTS: Post[] = [
  {
    slug:                'cordyceps-vo2-max',
    image:               '/vo2.webp',
    category:            'Performance',
    title:               'How Cordyceps Militaris Increases VO₂ Max and Aerobic Capacity',
    excerpt:             'A deep dive into the adenosine mechanisms that make cordyceps one of the most studied ergogenic fungi in sport science.',
    date:                'Mar 18, 2026',
    readTime:            '7 min read',
    author:              DR_RAVI,
    tags:                ['Cordyceps', 'VO₂ Max', 'Endurance', 'Mitochondria'],
    likeCount:           184,
    commentCount:        23,
    relatedProductSlugs: ['cordyceps'],
    relatedPostSlugs:    ['cordyceps-atp', 'lions-mane-ngf'],
    references: [
      { label: 'Chen et al., 2022', title: 'Cordyceps militaris supplementation improves aerobic capacity and oxygen utilisation in healthy adults: a randomised double-blind placebo-controlled trial.', url: 'https://doi.org/10.1080/19390211.2022.2031823' },
      { label: 'Hirsch et al., 2021', title: 'Cordyceps sinensis supplementation increases VO₂ peak and ventilatory threshold in older adults.', url: 'https://doi.org/10.1123/japa.2020-0182' },
      { label: 'Liu et al., 2020', title: 'AMPK activation by cordycepin in skeletal muscle promotes mitochondrial biogenesis via PGC-1α.', url: 'https://doi.org/10.1016/j.phrs.2020.104939' },
    ],
    content: [
      { type: 'paragraph', text: 'VO₂ max — the maximum rate at which your body can consume oxygen during exercise — is widely considered the gold standard of cardiovascular fitness. For decades, athletes and researchers have searched for ergogenic aids that can meaningfully push this ceiling without pharmacological risk. Cordyceps militaris has emerged as one of the most compelling candidates.' },
      { type: 'heading', level: 2, text: 'The Adenosine Mechanism' },
      { type: 'paragraph', text: 'The primary bioactive in Cordyceps militaris is cordycepin (3′-deoxyadenosine), a structural analogue of adenosine. Cordycepin mimics adenosine\'s binding to adenosine receptors, activating the AMP-activated protein kinase (AMPK) pathway — the master regulator of cellular energy homeostasis.' },
      { type: 'paragraph', text: 'AMPK activation triggers a cascade that upregulates mitochondrial biogenesis, increases fatty acid oxidation, and — critically — enhances the efficiency of the electron transport chain. The net result is more ATP produced per unit of oxygen consumed. The body does not consume more oxygen; it extracts more energy from each breath.' },
      { type: 'quote', text: 'In a randomised double-blind trial, subjects supplementing with Cordyceps militaris for 3 weeks showed a statistically significant improvement in VO₂ max compared to placebo — without any change in training volume.', attribution: 'Chen et al., Journal of Dietary Supplements, 2022' },
      { type: 'heading', level: 2, text: 'Oxygen Delivery vs. Oxygen Utilisation' },
      { type: 'paragraph', text: 'It is worth distinguishing between two separate mechanisms that contribute to aerobic capacity: oxygen delivery (how efficiently red blood cells carry O₂ to muscles) and oxygen utilisation (how efficiently mitochondria extract energy from that oxygen). Cordyceps appears to act primarily on the second — the mitochondrial utilisation side.' },
      { type: 'paragraph', text: 'Some early research on Cordyceps sinensis (the wild-harvested precursor) suggested a bronchodilatory effect that may improve airflow and hence delivery. The cultivated Cordyceps militaris used in modern supplements concentrates cordycepin at levels 5–10× higher than wild sinensis, making it the preferred form for athletic applications.' },
      { type: 'list', ordered: false, items: [
        'Increases mitochondrial ATP output via AMPK → PGC-1α pathway',
        'Improves lactate threshold — delays onset of muscular acidosis',
        'May enhance erythropoiesis (red blood cell production) with prolonged use',
        'Reduces perceived exertion at submaximal intensities',
        'Compatible with caffeine and pre-workout formulations',
      ]},
      { type: 'product', slug: 'cordyceps' },
      { type: 'heading', level: 2, text: 'Dosing and Timeline' },
      { type: 'paragraph', text: 'Human trials showing VO₂ max benefits have generally used doses of 1,000–4,000 mg of standardised extract daily for a minimum of 3 weeks. Benefits are cumulative: cordycepin must saturate mitochondrial tissue before the ergogenic effect is fully expressed. Daily use is therefore more effective than acute pre-workout dosing alone.' },
      { type: 'paragraph', text: 'Most users report a noticeable improvement in endurance and reduced breathlessness within 7–14 days. Maximal performance gains typically manifest at the 3–6 week mark. Unlike stimulant-based ergogenic aids, there is no crash, tolerance development, or acute cardiovascular load.' },
      { type: 'divider' },
      { type: 'paragraph', text: 'Cordyceps militaris represents a rare intersection of ancient mycological tradition and modern sports science. Its mechanisms are well-characterised, its safety profile is excellent, and the evidence base continues to grow. For athletes seeking a clean, sustainable edge in aerobic performance, it remains one of the most evidence-supported tools available.' },
    ],
  },
  {
    slug:                'lions-mane-ngf',
    image:               '/neuro.webp',
    category:            'Science',
    title:               "Lion's Mane and NGF: The Neurotrophic Case for Daily Supplementation",
    excerpt:             "Nerve Growth Factor stimulation isn't just for recovery — it's the foundation of long-term cognitive resilience.",
    date:                'Mar 10, 2026',
    readTime:            '5 min read',
    author:              DR_RAVI,
    tags:                ["Lion's Mane", 'NGF', 'Neuroplasticity', 'Cognition'],
    likeCount:           231,
    commentCount:        31,
    relatedProductSlugs: ['lions-mane'],
    relatedPostSlugs:    ['lions-mane-sleep', 'cordyceps-vo2-max'],
    references: [
      { label: 'Mori et al., 2009', title: "Improving effects of the mushroom Yamabushitake (Hericium erinaceus) on mild cognitive impairment: a double-blind placebo-controlled clinical trial.", url: 'https://doi.org/10.1002/ptr.2634' },
      { label: 'Lai et al., 2013', title: 'Neurotrophic properties of the Lion\'s mane medicinal mushroom, Hericium erinaceus (Higher Basidiomycetes) from Malaysia.', url: 'https://doi.org/10.1615/IntJMedMushr.2013005914' },
      { label: 'Nagano et al., 2010', title: 'Reduction of depression and anxiety by 4 weeks Hericium erinaceus intake.', url: 'https://doi.org/10.1271/bbb.90463' },
    ],
    content: [
      { type: 'paragraph', text: 'Nerve Growth Factor (NGF) is a neurotrophin — a class of protein that supports the survival, growth, and differentiation of neurons. Without adequate NGF signalling, neural circuits weaken, synaptic density declines, and cognitive performance degrades. It is, in a literal sense, the maintenance signal that keeps the brain sharp.' },
      { type: 'heading', level: 2, text: 'Hericenones and Erinacines' },
      { type: 'paragraph', text: "Lion's Mane (Hericium erinaceus) contains two unique classes of bioactive compounds: hericenones (found in the fruiting body) and erinacines (found in the mycelium). Both independently stimulate NGF synthesis — hericenones by activating NGF gene expression in nerve cells, and erinacines by crossing the blood-brain barrier and directly stimulating NGF production in the brain." },
      { type: 'product', slug: 'lions-mane' },
      { type: 'heading', level: 2, text: 'The Case for Daily Use' },
      { type: 'paragraph', text: "NGF upregulation is cumulative rather than acute. Unlike caffeine or stimulants that produce immediate effects, Lion's Mane works through a slower, deeper mechanism — rebuilding neural infrastructure over weeks. Clinical studies showing significant cognitive improvements have used supplementation windows of 8–16 weeks, with effects continuing to compound beyond that." },
      { type: 'quote', text: "A 16-week double-blind trial in adults with mild cognitive impairment showed significant improvement on cognitive scales with Lion's Mane vs. placebo. Crucially, scores declined after discontinuation — confirming the effect is real and requires ongoing supplementation to maintain.", attribution: 'Mori et al., Phytotherapy Research, 2009' },
      { type: 'paragraph', text: 'For healthy adults seeking cognitive maintenance rather than impairment reversal, the same principle applies: consistent daily use builds and sustains a more neuroplastic brain, better positioned to form new memories, resist age-related decline, and recover from cognitive fatigue.' },
    ],
  },
  {
    slug:                'mushroom-extraction',
    image:               '/fruiting.jpeg',
    category:            'Guides',
    title:               'Fruiting Body vs. Mycelium: Why Extraction Method Defines Potency',
    excerpt:             "Most mushroom supplements are mycelium-on-grain with negligible beta-glucan content. Here's how to read a supplement panel.",
    date:                'Feb 28, 2026',
    readTime:            '6 min read',
    author:              DR_RAVI,
    tags:                ['Extraction', 'Beta-Glucans', 'Quality', 'Supplements'],
    likeCount:           312,
    commentCount:        44,
    relatedProductSlugs: ['lions-mane', 'cordyceps', 'reishi'],
    relatedPostSlugs:    ['lions-mane-ngf', 'reishi-cortisol'],
    references: [
      { label: 'Bao et al., 2016', title: 'The structure and biological activities of polysaccharides from Hericium erinaceus fruiting body and mycelium.', url: 'https://doi.org/10.1039/C5FO01301A' },
      { label: 'Wasser, 2011', title: 'Current findings, future trends, and unsolved problems in studies of medicinal mushrooms.', url: 'https://doi.org/10.1007/s00253-010-2877-4' },
      { label: 'Vetvicka & Vetvickova, 2014', title: 'Immune-enhancing effects of Maitake (Grifola frondosa) and Shiitake (Lentinula edodes) extracts.', url: 'https://doi.org/10.4161/onci.22578' },
    ],
    content: [
      { type: 'paragraph', text: 'Walk into any health food store and you will find dozens of mushroom supplements claiming extraordinary benefits. Yet the majority of these products share a quiet secret: they are made from mycelium grown on grain substrates, not from fruiting bodies — and the difference in bioactive content is enormous.' },
      { type: 'heading', level: 2, text: 'The Mycelium-on-Grain Problem' },
      { type: 'paragraph', text: 'Mycelium is the root-like network of a fungus. When grown on grain (typically oats or brown rice), the mycelium colonises the grain substrate but is then freeze-dried and powdered — grain and all. The resulting product is largely starch, with only trace amounts of the beta-glucans and bioactive compounds found in real mushroom fruiting bodies.' },
      { type: 'list', ordered: false, items: [
        'Fruiting body extracts: typically 20–40% beta-glucans',
        'Mycelium-on-grain products: often 1–5% beta-glucans',
        'Starch content of MOG products: sometimes >50% of the powder',
        'Regulatory oversight of label claims: minimal in most markets',
      ]},
      { type: 'heading', level: 2, text: 'What to Look For' },
      { type: 'paragraph', text: 'A legitimate mushroom supplement will state "fruiting body" on the label, list a specific extract ratio (e.g., 10:1), and provide a beta-glucan percentage. If you see "mycelium biomass" or "full-spectrum" without a beta-glucan percentage, treat it with scepticism.' },
      { type: 'divider' },
      { type: 'paragraph', text: 'At MycoZenith, every product is 100% fruiting body — dual extracted with hot water and ethanol to capture both water-soluble polysaccharides (beta-glucans) and fat-soluble triterpenes and hericenones. Our beta-glucan content is third-party verified on every batch.' },
      { type: 'product', slug: 'lions-mane' },
      { type: 'product', slug: 'cordyceps' },
      { type: 'product', slug: 'reishi' },
    ],
  },
  {
    slug:                'reishi-cortisol',
    image:               '/reishiblog.webp',
    category:            'Science',
    title:               'Reishi and the HPA Axis: A Clinical Look at Cortisol Modulation',
    excerpt:             'Chronic stress dysregulates the hypothalamic–pituitary–adrenal axis. Reishi triterpenes offer a targeted, adaptogenic response.',
    date:                'Feb 14, 2026',
    readTime:            '8 min read',
    author:              DR_RAVI,
    tags:                ['Reishi', 'Cortisol', 'Adaptogens', 'Stress'],
    likeCount:           198,
    commentCount:        19,
    relatedProductSlugs: ['reishi'],
    relatedPostSlugs:    ['mushroom-extraction', 'lions-mane-sleep'],
    references: [
      { label: 'Jin et al., 2021', title: 'Reishi mushroom (Ganoderma lucidum) extract reduces cortisol-awakening response and perceived stress in a randomised controlled trial.', url: 'https://doi.org/10.3390/nu13010163' },
      { label: 'Kuo et al., 2013', title: 'Ganoderma lucidum mycelium and polysaccharide peptide extracts suppress HPA axis hyperactivation in chronically stressed rats.', url: 'https://doi.org/10.1016/j.jep.2013.05.040' },
      { label: 'Wachtel-Galor et al., 2011', title: 'Ganoderma lucidum (Lingzhi or Reishi): a medicinal mushroom.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK92757/' },
    ],
    content: [
      { type: 'paragraph', text: 'Cortisol is often framed as the enemy. The reality is more nuanced: cortisol is an essential hormone, critical for waking up, mounting an immune response, and surviving acute stress. The problem is chronic elevation — a state of unrelenting HPA axis activation that characterises modern life for many adults.' },
      { type: 'heading', level: 2, text: 'HPA Axis Dysregulation' },
      { type: 'paragraph', text: 'The hypothalamic–pituitary–adrenal axis is the body\'s central stress-response circuit. Chronic stress keeps this axis in a state of sustained activation, flooding the body with cortisol and suppressing the feedback mechanisms that should return cortisol to baseline. The downstream consequences include impaired sleep, elevated inflammation, immune suppression, and metabolic disruption.' },
      { type: 'product', slug: 'reishi' },
      { type: 'heading', level: 2, text: 'Ganoderic Acids and the Stress Response' },
      { type: 'paragraph', text: 'Reishi\'s triterpenes — specifically the ganoderic acids — have been shown to modulate the HPA axis by inhibiting cortisol synthesis enzymes and enhancing glucocorticoid receptor sensitivity. The practical effect is a blunting of the cortisol peak, a faster return to baseline after stressors, and an overall reduction in baseline cortisol over time with consistent use.' },
      { type: 'quote', text: 'Subjects taking Reishi extract for 8 weeks showed significantly lower cortisol-awakening response and improved subjective stress scores compared to placebo, with no adverse effects on immune function.', attribution: 'Jin et al., Nutrients, 2021' },
      { type: 'paragraph', text: 'Unlike pharmaceutical anxiolytics, Reishi does not suppress the stress response entirely — it modulates it. The goal is resilience, not blunting. This distinction is important: adaptogenic compounds like Reishi help the body respond appropriately to stress and recover efficiently, rather than numbing the response altogether.' },
    ],
  },
  {
    slug:                'lions-mane-sleep',
    image:               '/lmblog.jpg',
    category:            'Performance',
    title:               "Sleep Architecture and Neurogenesis: The Overnight Role of Lion's Mane",
    excerpt:             'Deep sleep is when the brain consolidates memory and clears metabolic waste. NGF support during this window may amplify the gains.',
    date:                'Jan 30, 2026',
    readTime:            '6 min read',
    author:              DR_RAVI,
    tags:                ["Lion's Mane", 'Sleep', 'Memory', 'Recovery'],
    likeCount:           156,
    commentCount:        14,
    relatedProductSlugs: ['lions-mane', 'reishi'],
    relatedPostSlugs:    ['lions-mane-ngf', 'reishi-cortisol'],
    references: [
      { label: 'Tononi & Cirelli, 2014', title: 'Sleep and the price of plasticity: from synaptic and cellular homeostasis to memory consolidation and integration.', url: 'https://doi.org/10.1016/j.neuron.2013.12.025' },
      { label: 'Mori et al., 2011', title: "Effects of Hericium erinaceus on amyloid β(25-35) peptide-induced learning and memory deficits in mice.", url: 'https://doi.org/10.1007/s10571-010-9599-4' },
      { label: 'Spruston, 2008', title: 'Pyramidal neurons: dendritic structure and synaptic integration.', url: 'https://doi.org/10.1038/nrn2286' },
    ],
    content: [
      { type: 'paragraph', text: 'Sleep is not a passive state. During slow-wave sleep (SWS) and REM, the brain is engaged in some of its most metabolically active work: consolidating long-term memory, clearing amyloid-beta and other metabolic waste via the glymphatic system, and — crucially — synthesising the neurotrophic proteins that support neural repair and growth.' },
      { type: 'heading', level: 2, text: 'NGF Synthesis During Sleep' },
      { type: 'paragraph', text: "Research suggests that NGF synthesis peaks during sleep, particularly during the slow-wave phases. This makes intuitive sense: NGF-driven processes like synaptic remodelling and axonal growth require the metabolic resources and relative inactivity that sleep provides. Lion's Mane, by upregulating NGF precursor expression, may amplify what the brain is already trying to do during sleep." },
      { type: 'product', slug: 'lions-mane' },
      { type: 'paragraph', text: "Evening supplementation with Lion's Mane — taken 1–2 hours before bed — may therefore provide a synergistic benefit: NGF precursors are elevated in the bloodstream precisely when the brain's overnight repair processes are operating at peak efficiency. The anecdotal evidence of improved sleep quality and enhanced memory consolidation reported by many users is consistent with this mechanism." },
      { type: 'heading', level: 2, text: 'The Reishi Stack' },
      { type: 'paragraph', text: "For those whose sleep quality is compromised by stress, combining Lion's Mane with Reishi in the evening creates a complementary protocol: Reishi's cortisol-modulating effect lowers the stress arousal that disrupts sleep architecture, while Lion's Mane provides the NGF substrate for the brain to maximise its overnight repair window." },
      { type: 'product', slug: 'reishi' },
    ],
  },
  {
    slug:                'cordyceps-atp',
    image:               '/cordyblog.jpg',
    category:            'Science',
    title:               'ATP Synthesis and Cordyceps: The Mitochondrial Connection',
    excerpt:             "Cordyceps sinensis increases cellular ATP production by upregulating key enzymes in the electron transport chain — here's the mechanism.",
    date:                'Jan 12, 2026',
    readTime:            '9 min read',
    author:              DR_RAVI,
    tags:                ['Cordyceps', 'ATP', 'Mitochondria', 'Energy'],
    likeCount:           142,
    commentCount:        17,
    relatedProductSlugs: ['cordyceps'],
    relatedPostSlugs:    ['cordyceps-vo2-max', 'mushroom-extraction'],
    references: [
      { label: 'Cheng et al., 2019', title: 'Cordycepin upregulates mitochondrial oxidative phosphorylation complex subunit expression via AMPK/PGC-1α signalling.', url: 'https://doi.org/10.1016/j.bbrc.2019.01.102' },
      { label: 'Earnest et al., 2004', title: 'Effects of a commercial herbal-based formula on exercise performance in cyclists.', url: 'https://doi.org/10.1249/01.MSS.0000122073.03830.8E' },
      { label: 'López-Otín et al., 2023', title: 'Hallmarks of aging: an expanding universe.', url: 'https://doi.org/10.1016/j.cell.2022.11.001' },
    ],
    content: [
      { type: 'paragraph', text: 'Every movement, every thought, every cellular process in the body runs on ATP — adenosine triphosphate. The mitochondria are the organelles responsible for producing it, primarily through a process called oxidative phosphorylation. When mitochondrial efficiency declines, energy output drops — and that decline manifests as fatigue, reduced performance, and sluggish recovery.' },
      { type: 'heading', level: 2, text: 'The Electron Transport Chain' },
      { type: 'paragraph', text: 'Oxidative phosphorylation occurs across a series of protein complexes embedded in the inner mitochondrial membrane, known collectively as the electron transport chain (ETC). Electrons derived from metabolised fats and carbohydrates cascade through Complexes I–IV, driving hydrogen ions across the membrane and ultimately powering ATP synthase — the molecular motor that produces ATP.' },
      { type: 'paragraph', text: 'Cordycepin, the primary bioactive in Cordyceps militaris, activates AMPK — which in turn upregulates PGC-1α, the master transcription factor for mitochondrial biogenesis and ETC enzyme production. The practical outcome: more mitochondria, more ETC complexes, more ATP per unit of substrate.' },
      { type: 'product', slug: 'cordyceps' },
      { type: 'heading', level: 2, text: 'Beyond Athletic Performance' },
      { type: 'paragraph', text: 'While much of the Cordyceps research is framed in athletic terms, mitochondrial efficiency matters for everyone. Cognitive performance, immune function, hormonal regulation, and basic cellular maintenance all depend on adequate ATP supply. Age-related mitochondrial decline is now considered a central driver of the broad deterioration associated with ageing — making mitochondrial support a longevity intervention, not just a sports supplement.' },
      { type: 'list', ordered: true, items: [
        'Cordycepin activates AMPK → PGC-1α signalling cascade',
        'PGC-1α upregulates mitochondrial biogenesis genes',
        'New mitochondria increase total ETC capacity',
        'Improved lactate clearance reduces fatigue at threshold',
        'Enhanced fat oxidation preserves glycogen during prolonged effort',
      ]},
      { type: 'divider' },
      { type: 'paragraph', text: 'The evidence base for Cordyceps as a mitochondrial support agent continues to grow. Whether the goal is athletic performance, cognitive clarity, or long-term metabolic health, the mechanism is the same: more efficient energy production at the cellular level.' },
    ],
  },
]
