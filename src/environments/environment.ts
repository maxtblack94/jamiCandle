export const environment = {
  production: false,
  /**
   * Imposta su `true` per mostrare la pagina "Sito in lavorazione"
   * anziché il sito completo.
   */
  comingSoon: true,

  contact: {
    email: 'candelemanieanima@gmail.com',
    whatsapp: '+393663305757',
    whatsappName: 'Sonia'
  },

  emailjs: {
    serviceId: 'service_97g0uwj',
    templateId: 'template_m3r9r4m',
    publicKey: 'GR1khwF5_yiqNLHmj',
    toEmail: 'candelemanieanima@gmail.com',
  },

  supabase: {
    url:     'https://xdcdncukxexvzhtxkhgz.supabase.co',
    anonKey: 'sb_publishable_GMkkAtvtAqvpjR2XMlSfQQ_aTF-Dj3O',
  },

  /**
   * 'local'    → usa le immagini statiche in public/
   * 'supabase' → carica le immagini da Supabase Storage (per il sito live)
   */
  imageSource: 'supabase' as 'local' | 'supabase',
};
