export type Difficulty = 'Fácil' | 'Média' | 'Difícil';

export const WORD_POOL: Record<Difficulty, string[]> = {
  Fácil: [
    "CA SA", "BO LA", "GA TO", "LU A", "SO FA", "MA LA", "BO LO", "DA DO", "FA CA", "JA CA", 
    "SA PO", "TA TU", "VA CA", "PI A", "MÃO", "PÉ", "U VA", "O VO", "PÃO", "CÉU", 
    "DE DO", "FI GO", "GA LO", "JA RRA", "LA TA", "MA TO", "NA VE", "PA TO", "RA TO", "SA LA", 
    "SA PA", "TE LA", "VI LA", "FOU CE", "DO CE", "RE DE", "BO TA", "CO LA", "FO GO", "GE LO",
    "MA PA", "PI PÁ", "PI PA", "SI NO", "TU BO", "VA SO", "ZE RO", "A NO", "A SA", "A VO",
    "BÚ LE", "BA LA", "BE BE", "BE CO", "BI CO", "CA BO", "CA JU", "CA MA", "CA PA", "CE DO",
    "CO CO", "CO PO", "CU BO", "DA TA", "DO NA", "DU RO", "FA MA", "FA TA", "FE IO", "FI TA",
    "FO TO", "FU RO", "GA DO", "GA TA", "GE MA", "GI BÍ", "GO TA", "GU DE", "JA PA", "JO GO",
    "JU BA", "LA ÇO", "LA DO", "LA MA", "LE AO", "LI XO", "LO BO", "LO JA", "LU TA", "MA CA",
    "ME DO", "ME IA", "ME SA", "MI CO", "MO LA", "MO TO", "NA BO", "NE VE", "NI NHO", "NO VE",
    "PA CA", "PA NO", "PE SO", "PI NHA", "PO ÇO", "PU LO", "RA BO", "RE DE", "RI CO", "RO DA"
  ],
  Média: [
    "MA CA CO", "BA NA NA", "JA NE LA", "SA PA TO", "CA VA LO", "CA BE LO", "BO NE CA", "CA DE I RA", 
    "TE LE FO NE", "GI RA FA", "JA CA RÉ", "TO MA TE", "PE TE CA", "GA LI NHA", "A MO RA", "CA CHOR RO", 
    "PÁS SA RO", "A BE LHA", "CO E LHO", "PLA NE TA", "ES TRE LA", "BRA ÇO", "PRA TO", "TREM", 
    "BLU SA", "CLU BE", "BI CI CLE TA", "TRU FA", "LIV RO", "FRU TA", "PRE GO", "BRIN CO", 
    "CRA VO", "FRO TA", "GRA MA", "PRA ÇA", "VID RO", "LI MÃO", "A MI GO", "CO LE GA",
    "AB E LHA", "A VEZ TRUZ", "A LE GRI A", "A MI ZA DE", "A RO MA", "A ZU LE JO", "BA LEI A", "BA RA TA",
    "BA TE RI A", "BI GO DE", "BO CA DE I RA", "BO LA CHA", "CA CAU", "CA DER NO", "CA MI SA", "CA NA RIO",
    "CA PE LA", "CA RO ÇO", "CA MI NHÃO", "CE BO LA", "CE NOU RA", "CO RA ÇÃO", "CO RU JA", "DA NO NE",
    "DE SEN HO", "DI A RI O", "DO MIN GO", "DRU I DA", "ES CO LA", "ES CO VA", "ES MO LA", "ES PE LHO",
    "FA BRI CA", "FA RI NHA", "FA ZEN DA", "FI VE LA", "FLO RES TA", "FO CA CI NHA", "FO GU EI RA", "GA FA NHO TO",
    "GA LI NHA", "GA RA GEM", "GE LA DI NA", "GI RAS SOL", "GRA VA TA", "IG RE JA", "I GUA NA", "IL HA MO",
    "JA BU TI", "JA NE LA", "JO EI LHO", "JU BUB A", "LA GO A", "LA RI CA", "LO MOU DE", "LU ZI NHA",
    "MA CA CA", "MA CA CÃO", "MA DE I RA", "MA MÃO", "ME NI NO", "ME NI NA", "ME TA DE", "MO RAN GO",
    "NA VI O", "NE VO EI RO", "NU VEM", "O LHE I RA", "O VE LHA", "PA DA RI A", "PA LHA ÇO", "PA NE LA"
  ],
  Difícil: [
    "PA RA LE LE PÍ PE DO", "O TOR RI NO LA RIN GO LO GIS TA", "LI QÜI DI FI CA DOR", "ME LAN CI A", 
    "IN CONS TI TU CIO NAL", "PNEU MÁ TI CO", "EX TRA OR DI NÁ RIO", "JU RIS PRU DÊN CIA", 
    "HE LI CÓP TE RO", "AS TRO NAU TA", "I NA CEI TÁ VEL", "IN TE LI GÊN CIA", "PRO CRAS TI NA ÇÃO", 
    "LÂM PA DA", "Ô NI BUS", "ÁR VO RE", "MÁ GI CO", "ÚL TI MO", "PÂN CRE AS", "XÍ CA RA", 
    "Ó CU LOS", "SÍM BO LO", "PLÁS TI CO", "MÚ SI CA", "PÁS SA RO", "AR QUI TE TU RA", "FO GUE TE",
    "PÊN DU LO", "CÉ LU LA", "MÁ QUI NA", "FÍ SI CA", "QUÍ MI CA", "BÚS SO LA", "PÉ TA LA", 
    "VÍ TI MA", "LÁ GRI MA", "PÁ GI NA", "XÁ CA RA", "SÁ BA DO", "RÚS TI CO", "E CLIP SE",
    "AB SO LU TA MEN TE", "A CE LER A ÇÃO", "A COM PA NHA MEN TO", "A E RO POR TO", "A GRI CUL TU RA", "A MO SE XI DA DE",
    "AN TI CONS TI TU CIO NAL", "AP RO XI MA DA MEN TE", "A QUI TE TU RA", "AS TRO NO MI A", "A TRO PE LA MEN TO",
    "BI BLI O TE CA", "BI O DI VER SI DA DE", "CA BO CI NHOS", "CA CHOR RO QUEN TE", "CA LIS TE NI A",
    "CA MI NHO NE TE", "CA PI TA LIS MO", "CA RAC TE RÍS TI CA", "CI RUR GI A", "CLA XI FI CA ÇÃO", "COM PAR TI LHA MEN TO",
    "CON CEI TU A ÇÃO", "CON FRA TER NI ZA ÇÃO", "CON GRA TU LA ÇÕES", "CON SE QUÊN CIA", "CON TEM PO RÂ NE O",
    "CRIS TI A NIS MO", "CRO NO LO GI A", "DE MO CRA CI A", "DE MAR CA ÇÃO", "DE SEN VOL VI MEN TO", "DI FE REN CI AL",
    "DI NO SAU RO", "DI PLO MA CI A", "DIS CRI MI NA ÇÃO", "E CO LO GI A", "E LE TRO DO MÉS TI CO",
    "E MER GÊN CIA", "EN GEN HA RI A", "ES CO LA RI DA DE", "ES CRI TÓ RI O", "ES PAN TA LHO", "ES PE CI A LIS TA",
    "ES PE TA CU LAR", "ES TRE PI TO SA MEN TE", "ES TRU TU RA ÇÃO", "EU CA LIP TO", "EX PE RI ÊN CIA", "EX TRA TER RES TRE",
    "FER CA DI ÇÃO", "FI LO SO FI A", "FI SIO TE RA PI A", "FO TO SÍN TE SE", "FRAN QUI A", "GA RAN TI A",
    "GLO BA LI ZA ÇÃO", "HI GI E NI ZA ÇÃO", "HIP PO CA MPO", "I DEN TI FI CA ÇÃO", "ILUMI NA ÇÃO", "IM PRO VI SA ÇÃO",
    "IN CON VENIÊN CIA", "IN DE PEN DÊN CIA", "IN DU BI TÁ VEL", "IN FLE XI BI LI DA DE", "IN FRA ES TRU TU RA", "IN JUS TI ÇA"
  ]
};
