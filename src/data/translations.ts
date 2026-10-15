import { LanguageDictionary, Currency } from '../types';

export const TRANSLATIONS: LanguageDictionary = {
  // Navigation
  'nav.home': { en: 'ARCHIVE MAINPLATE', pt: 'PAINEL CENTRAL' },
  'nav.archive': { en: 'EXCAVATED ARTIFACTS', pt: 'ARTEFATOS ESCAVADOS' },
  'nav.chronicles': { en: 'TACTICAL JOURNALS', pt: 'DIÁRIOS TÁTICOS' },
  'nav.manifesto': { en: 'FOUNDATION BLUEPRINT', pt: 'MANIFESTO FUNDACIONAL' },
  'nav.blueprints': { en: 'UX AND BRAND ROADMAP', pt: 'SITEMAP E ROADMAP' },
  'nav.transceiver': { en: 'SECURE TRANSCEIVER', pt: 'RECEPTOR SEGURO' },
  
  // Loader
  'loader.decryption': { en: 'DECRYPTING ARCHIVE SYSTEM...', pt: 'DESCRIPTOGRAFANDO SISTEMA...' },
  'loader.warning': { en: 'RESTRICTED SECTOR CODES LOADED', pt: 'CÓDIGOS DE SETOR RESTRITOS CARREGADOS' },
  'loader.enter': { en: 'ENTER ARCHIVE TERMINAL', pt: 'ENTRAR NO TERMINAL' },
  
  // Hero
  'hero.tagline': { en: 'THE WORLD ENDED. WE KEPT DESIGNING.', pt: 'O MUNDO ACABOU. NÓS CONTINUAMOS CRICANDO.' },
  'hero.prompt': { en: 'SCAN RECOVERY CODES // DECODE PRESERVED APPAREL', pt: 'ESCANEAR CÓDIGOS DE RECUPERAÇÃO // DESCODIFICAR ARTEFATOS' },
  
  // General Buttons/Statuses
  'btn.add_to_cart': { en: 'CALIBRATE STORAGE INTAKE (+)', pt: 'CALIBRAR ARMAZENAMENTO (+)' },
  'btn.add_to_wishlist': { en: 'REGISTER INTEL CODE (★)', pt: 'REGISTRAR CÓDIGO DE INTEL (★)' },
  'btn.view_artifact': { en: 'DECRYPT TECH SPEC', pt: 'DESCIFRAR ESPECIFICAÇÕES' },
  'btn.back': { en: '// RETURN TO CENTRAL NODE', pt: '// RETORNAR AO NÓ CENTRAL' },
  'btn.checkout': { en: 'CONFIRM SECURE SHIPMENT ROUTE', pt: 'CONFIRMAR ROTA DE ENVIO SEGURO' },
  
  // Archive filters
  'filter.title': { en: 'MUSEUM CLASSIFICATION FILTERS', pt: 'FILTROS DE CLASSIFICAÇÃO' },
  'filter.all': { en: 'ALL EXCAVATED ENTRIES', pt: 'TODOS OS REGISTROS' },
  'filter.category': { en: 'GARMENT TYPE', pt: 'TIPO DE VESTIMENTA' },
  'filter.material': { en: 'REINFORCING MATERIAL', pt: 'MATERIAL REFORÇANTE' },
  'filter.collection': { en: 'EXCAVATION COHORT', pt: 'COORTE DE ESCAVAÇÃO' },
  'filter.outerwear': { en: 'Tactical Outerwear', pt: 'Outerwear Tático' },
  'filter.basewear': { en: 'Protective Base Layers', pt: 'Camadas de Base Protegidas' },
  'filter.footwear': { en: 'Archaic Footwear', pt: 'Calçados Arcaicos' },
  'filter.accessories': { en: 'Modular Load-bearing Accessories', pt: 'Acessórios Modulares' },
  'filter.womenswear': { en: "Women's Clothing", pt: "Women's Clothing" },
  'filter.bodysuits': { en: 'Bodysuits', pt: 'Bodysuits' },
  'filter.tops': { en: 'Tops & Crop Tops', pt: 'Tops & Crop Tops' },
  'filter.dresses': { en: "Women's Dresses", pt: "Women's Dresses" },

  // Brand Manifesto
  'manifesto.title': { en: 'THE PHILOSOPHY OF ASHES', pt: 'A FILOSOFIA DAS CINZAS' },
  'manifesto.p1': { en: 'We do not build seasonal fashion. We catalog historical resilience. When the iron storm swept across the continents, and the infrastructure collapsed into charcoal dust, the acts of drawing, spinning, cutting, and stitching did not cease. Design is our survival system.', pt: 'Não fabricamos moda sazonal. Catalogamos resiliência histórica. Quando a tempestade de ferro varreu os continentes e as infraestruturas colapsaram em cinzas, os atos de desenhar, fiar, cortar e costurar não cessaram.' },
  'manifesto.p2': { en: 'Every DANIEL’S MAISON artifact is designed beyond luxury standards. It is constructed from carbonized natural weaves, pre-stressed protective metals, and chemical coatings designed to survive nuclear fallout, corrosive rains, and centuries of neglect or excavation.', pt: 'Cada artefato DANIEL’S MAISON é projetado além dos padrões tradicionais. É construído com tecelagens naturais carbonizadas, metais defensivos pré-tensionados e revestimentos químicos para resistir à chuva ácida e séculos de abandono.' },

  // E-commerce panel
  'cart.title': { en: 'STORAGE INTAKE HARNESS (CART)', pt: 'ARNES DE CAPTAÇÃO (CARRINHO)' },
  'cart.empty': { en: 'No artifacts loaded in active chambers.', pt: 'Nenhum artefato carregado nas câmaras ativas.' },
  'cart.total': { en: 'CALCULATED ALLOCATION INDEX:', pt: 'ÍNDICE DE ALOCAÇÃO CALCULADO:' },
  'cart.shipping': { en: 'SECURE NOMADIC CARRIER ROUTE:', pt: 'ROTA DE TRANSPORTADORA NÔMADE SEGURO:' },
  'cart.shipping_standard': { en: 'Surface Caravan Transit (Slow, High Corrosion risk)', pt: 'Caravana de Superfície (Lenta, Risco de Corrosão)' },
  'cart.shipping_express': { en: 'Subterranean Rail Transit (Secure, Fortified)', pt: 'Trilho Subterrâneo (Seguro, Fortificado)' },
  'cart.checkout_success': { en: 'TRANSMISSION ACCEPTED // ENCRYPTED INVOICE CONFIRMED. PREPARE SCANNING BIOMETRICS AT DESTINATION SAFE-ZONE.', pt: 'TRANSMISSÃO ACEITA // NOTA CRIPTOGRAFADA CONFIRMADA. PREPARE DADOS BIOMÉTRICOS NO PONTO SEGURO DE DESTINO.' },
  'wishlist.title': { en: 'INTEL DATA LOGS (WISHLIST)', pt: 'REGISTROS DE INTEL MONITORADOS (WISHLIST)' },

  // Contact / Transceiver
  'contact.title': { en: 'MAINPLATE BROADCAST TRANSCEIVER', pt: 'RECEPTOR DE TRANSMISSÃO CENTRAL' },
  'contact.subtitle': { en: 'Transmit high-frequency wave updates to our secure coordinates. Fields will decrypt as typed.', pt: 'Transmita atualizações por ondas de alta frequência para nossas coordenadas seguras.' },
  'contact.name': { en: 'SENDER CALLSIGN (NAME)', pt: 'ASSINATURA DE CHAMADA (NOME)' },
  'contact.email': { en: 'RE-ROUTING COMPACT ADDRESS (EMAIL)', pt: 'ENDEREÇO DE REENCAMINHAMENTO (EMAIL)' },
  'contact.subject': { en: 'ENCRYPTION PROTOCOL LEVEL', pt: 'NÍVEL DE PROTOCOLO DE CRIPTOGRAFIA' },
  'contact.message': { en: 'COMPRESSED RAW INTEL TRANSMISSION', pt: 'TRANSMISSÃO DE INTEL COMPRIMIDA' },
  'contact.submit': { en: 'BROADCAST PULSE TO DANIEL’S MAISON SAFE-ZONE', pt: 'TRANSMITIR SINAL PARA ZONA SEGURA' },
  'contact.success': { en: 'SIGNAL RECEIVED. COURIERS DISPATCHED TO RETRIEVE YOUR ENCRYPTED FREQUENCY LOCATIONS.', pt: 'SINAL RECEBIDO. CORREIOS ENVIADOS PARA LOCALIZAR SUAS COORDENADAS RECEPTORAS.' },
  
  // Footer
  'footer.auth': { en: 'DANIEL’S MAISON SYSTEM NODE ADMIN // REGISTERED IN SECTOR 04 GREEN ZONE // ALL APPAREL ENCODED FOR RADIATION RESISTANCE', pt: 'SISTEMA ADMINISTRATIVO DANIEL’S MAISON // SETOR 04 ZONA VERDE // VESTIMENTAS CODIFICADAS ANTI-RADIAÇÃO' }
};

export const CURRENCIES: { [key in Currency]: { symbol: string; rate: number; label: string } } = {
  GBP: { symbol: '£', rate: 1, label: 'British Pound (£)' },
};
