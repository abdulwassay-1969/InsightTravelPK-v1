'use server';

export interface TtsSpeechConfig {
  text: string;
  langCode: string;
  voiceNamePattern?: string;
  speechRate: number;
}

export async function generateMultiLangAudio(
  text: string, 
  language: string, 
  voiceGender: 'male' | 'female'
): Promise<TtsSpeechConfig> {
  // Map friendly language names to BCP-47 language codes supported by Web Speech API
  const langMappings: Record<string, { code: string; pattern: string }> = {
    english: { code: 'en-US', pattern: 'Google US English' },
    urdu: { code: 'ur-PK', pattern: 'Urdu' },
    chinese: { code: 'zh-CN', pattern: 'Chinese' },
    arabic: { code: 'ar-SA', pattern: 'Arabic' },
    spanish: { code: 'es-ES', pattern: 'Spanish' },
    french: { code: 'fr-FR', pattern: 'French' },
    german: { code: 'de-DE', pattern: 'German' }
  };

  const selected = langMappings[language.toLowerCase()] || langMappings.english;
  
  // Rate adjustment: Urdu/Arabic are spoken slightly slower to ensure clear articulation
  const speechRate = ['ur-PK', 'ar-SA'].includes(selected.code) ? 0.85 : 1.0;

  return {
    text,
    langCode: selected.code,
    voiceNamePattern: selected.pattern,
    speechRate
  };
}
