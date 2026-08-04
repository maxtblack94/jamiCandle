export const environment = {
  production: true,
  /**
   * Imposta su `true` per mostrare la pagina "Sito in lavorazione"
   * anziché il sito completo.
   */
  comingSoon: false,

  contact: {
    email: 'info@jamicandles.it',
    whatsapp: '+393663305757',
    whatsappName: 'Sonia'
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
