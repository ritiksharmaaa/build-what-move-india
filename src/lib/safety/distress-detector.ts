type Helpline = { name: string; number: string; hours: string; };

export type DistressResult = {
  detected: boolean;
  severity: 'low' | 'high';
  helplines: Helpline[];
};

const DISTRESS_KEYWORDS_EN = [
  'kill myself', 'want to die', 'suicide', 'end my life',
  'no point living', 'parents will kill me', 'nobody cares',
  'run away', 'self harm', 'hurt myself'
];

const DISTRESS_KEYWORDS_HI = [
  'मरना चाहता हूं', 'जीने का मन नहीं', 'आत्महत्या',
  'कोई फायदा नहीं', 'भाग जाना', 'मार डालेंगे'
];

const HELPLINES: Helpline[] = [
  { name: 'iCall', number: '9152987821', hours: 'Mon-Sat 8am-10pm' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', hours: '24/7' },
  { name: 'AASRA', number: '9820466726', hours: '24/7' },
];

export function detectDistress(input: string): DistressResult {
  const normalized = input.toLowerCase();
  
  const foundEn = DISTRESS_KEYWORDS_EN.some(kw => normalized.includes(kw));
  const foundHi = DISTRESS_KEYWORDS_HI.some(kw => normalized.includes(kw));
  
  if (foundEn || foundHi) {
    return {
      detected: true,
      severity: 'high',
      helplines: HELPLINES
    };
  }
  
  return { detected: false, severity: 'low', helplines: [] };
}
