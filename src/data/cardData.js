// Card actions constants
export const R = 'Raise';
export const B = 'Bet';
export const F = 'Fold';
export const RR = 'Reraise';
export const RRL = 'Reraise and Raise Limpers';
export const RFI = 'Raise first in, otherwise call';
export const RFIC1 = 'Raise if first one in, Call 1 or more callers';
export const RFIOF = 'Raise if first one in, Fold if any calls';
export const C = 'Call';
export const R1C2 = 'Raise if 1 caller, Call 2 or more callers';

export const RRLC3 = 'RR a lone late position player, Call 3+ players';
export const RRLC1 = 'RR a lone late position player,  Call 1+';
export const RRLF = 'RR a lone late postion player, otherwise Fold';
export const R12C3 = 'Raise 1 or 2 callers, Call 3+ callers ';
export const RR12C3 = 'Reraise 1 or 2 callers, Call 3+ callers';
export const RR1C2 = 'Reraise one caller, Call 2+ callers';
export const C1 = 'Call if 1+ callers in pot';
export const C2 = 'Call if 2+ callers in pot';
export const C3 = 'Call if 3+ callers in pot';
export const C4 = 'Call if 4+ callers in pot';
export const C5 = 'Call if 5+ callers in pot';
export const C21L = 'Call if 2+ callers or 1 Late postion better';
export const C41L = 'Call if 4+ callers or 1 Late postion better';
export const CH = 'Check';

export const CR1L = 'Call, Raise if only 1 Limper in pot';
export const C21ML = 'Call 2+, or 1 Middle or Late raiser';
export const C21L_ALT = 'Call 2+, or 1 Late raiser';
export const CR12L = 'Call (Raise 1 in or 2 Limpers in pot)';
export const C1LF = 'Call 1 Late, Fold';
export const RROPCA = 'Reraise 1 Opt, Call All';
export const RRF1C3 = 'Reraise or Fold vs only 1 player, Call if 3+ players in hand';
export const EMPTY = '';

// Card array data
//                  Middle     Early   Late          //SB           //BB
export const cardArray = [ 
  ['AA',  R,RR,      R,RR   ,R,RR            ,R,RR,            EMPTY,  RRL],
  ['KK',  R,RR,      R,RR   ,R,RR            ,R,RR,            EMPTY,  RRL],
  ['QQ',  R,RR,      R,RR   ,R,RR            ,R,RR,            EMPTY,  RRL],

  ['JJ',  RFIC1,C,   C,C    ,R1C2,RROPCA      ,R1C2,RR1C2,        EMPTY,  CR1L],
  ['TT',  RFIC1,F,   C,F    ,R1C2,RROPCA      ,R1C2,RR1C2,        EMPTY,  C],

  ['99',  C,F,       C,F    ,RFIC1,RRF1C3    ,R1C2,RR1C2,         EMPTY,  C],
  ['88',  C1,F,      C1,F   ,RFIC1,C3        ,C,RRLC3,            EMPTY,  C21ML],
  ['77',  C1,F,      C1,F   ,RFIC1,C3        ,C,RRLC3,            EMPTY,  C21ML],
  ['66',  C2,F,      F,F    ,C2,C4           ,C,C3,               EMPTY,  C21L_ALT],
  ['55',  C2,F,      F,F    ,C2,C4           ,C,C3,               EMPTY,  C21L_ALT],
  ['44',  C3,F,      F,F    ,C3,C4           ,C,C3,               EMPTY,  C2],
  ['33',  C3,F,      F,F    ,C3,C4            ,C,C3,               EMPTY,  C2],
  ['22',  C3,F,      F,F    ,C3,C4            ,C,C3,               EMPTY,  C2],

  ['AK',  R,RR,      R,RR   ,R,RR              ,R,RR,              EMPTY,  RRL],
  ['AQ',  R,C,       R,C    ,R,RROPCA          ,R12C3,RR12C3,      EMPTY,  CR12L],
  ['AJs', R,C,       R,C    ,R,RROPCA          ,R1C2,RRLC1,        EMPTY,  C],
  ['AJ',  RFIC1,F,   C,F    ,R1C2,F            ,R1C2,RRLF,         EMPTY,  C],
  ['ATs', RFIC1,F,   C,F    ,R1C2,F            ,R1C2,RRLC1,        EMPTY,  C],
  ['AT',  RFIC1,F,   F,F    ,RFIC1,F           ,R1C2,RRLF,         EMPTY,  C],
  ['A9s', C,F,       C,F    ,RFIC1,F           ,C,RRLF,            EMPTY,  C],
  ['A9',  F,F,       F,F    ,RFIOF,F           ,C,F,              EMPTY,  C1LF],
  ['A8s', C,F,       C1,F   ,RFIC1,F           ,C,F,             EMPTY,  C1LF],
  ['A8',  F,F,       F,F    ,F,F               ,C,F,              EMPTY,  C1LF],
  ['A7s', C,F,       C1,F   ,F,F               ,C,F,             EMPTY,  C],        

  ['AZs', C1,F,      F,F    ,RFIC1,F            ,C,F,       EMPTY,  C],
  ['AZ',  F,F,       F,F    ,F,F                ,C,F,       EMPTY,  F],

  ['KQs', C,F,      C,F   ,R1C2,C             ,C,C21L_ALT,   EMPTY,  C],
  ['KQ',  C,F,      F,F   ,RFIC1,F            ,C,F,      EMPTY,  C],
  ['KJs', C,F,      C1,F  ,RFIC1,F            ,C,C41L,   EMPTY,  C],
  ['KJ',  F,F,      F,F   ,RFIC1,F            ,C,F,      EMPTY,  C21L_ALT],
  ['KTs', C1,F,     F,F   ,RFIC1,F            ,C,F,      EMPTY,  C],
  ['KT',  F,F,      F,F   ,C2,F               ,C,F,      EMPTY,  C21L_ALT],
  ['K9s', F,F,      F,F   ,C2,F               ,C,F,      EMPTY,  C],
  ['K8s', F,F,      F,F   ,C3,F               ,C,F,      EMPTY,  C3],
  ['K7s', F,F,      F,F   ,C3,F               ,C,F,      EMPTY,  C3],
  ['KZs', F,F,      F,F   ,C4,F               ,C,F,      EMPTY,  C3],
    
  ['QJs', C,F,       C1,F  ,RFIC1,C4           ,C,C4,     EMPTY,  C],
  ['QJ',  F,F,       F,F   ,RFIC1,F            ,C,F,      EMPTY,  C],
  ['QTs', C,F,       F,F   ,RFIC1,F            ,C,F,      EMPTY,  C],
  ['QT',  F,F,       F,F   ,C2,F               ,C,F,      EMPTY,  C],
  ['Q9s', F,F,       F,F   ,C2,F               ,C,F,      EMPTY,  C21L_ALT],
  ['Q8s', F,F,       F,F   ,C4,F               ,C,F,      EMPTY,  C21L_ALT],
  ['QZs', F,F,       F,F   ,F,F                ,C3,F,      EMPTY,  C3],

  ['JTs', C,F,       F,F    ,RFIC1,C4           ,C,C4,     EMPTY,  C],
  ['JT',  F,F,       F,F    ,C3,F               ,C,F,      EMPTY,  C2],
  ['J9s', C,F,       F,F    ,C2,F               ,C,F,      EMPTY,  C2],
  ['J8s', F,F,       F,F    ,C4,F               ,C,F,      EMPTY,  C3],
  ['J7s', F,F,       F,F    ,F,F                ,C3,F,     EMPTY,  C5],

  ['T9s', C,F,       F,F    ,C2,C5             ,C,C5,     EMPTY,  C2],
  ['T9', F,F,       F,F    ,F,F               ,C,F,      EMPTY,  C3],
  ['T8s', F,F,       F,F    ,C3,F              ,C,F,      EMPTY,  C3],
  ['T7s', F,F,       F,F    ,F,F               ,C3,F,     EMPTY,  C4],

  ['98s', C,F,       F,F    ,C3,C5             ,C,F,       EMPTY,  C],
  ['98',  F,F,       F,F    ,F,C5              ,C3,F,       EMPTY,  C3],
  ['97s', F,F,       F,F    ,F,F               ,C3,F,      EMPTY,  C3],
  ['96s', F,F,       F,F    ,F,F               ,C4,F,      EMPTY,  C5],

  ['87s', F,F,       F,F    ,C4,F              ,C,F,       EMPTY,  C3],
  ['87',  F,F,       F,F    ,F,F               ,C3,F,       EMPTY,  C4],
  ['86s', F,F,       F,F    ,F,F               ,C3,F,      EMPTY,  C4],
  ['85s', F,F,       F,F    ,F,F               ,C4,F,      EMPTY,  F],

  ['76s', F,F,       F,F    ,C4,F              ,C,F,       EMPTY,  C3],
  ['76',  F,F,       F,F    ,F,F               ,C3,F,       EMPTY,  C3],
  ['75s', F,F,       F,F    ,F,F               ,C3,F,      EMPTY,  C4],

  ['65s', F,F,       F,F    ,F,F               ,C2,F,      EMPTY,  C3],
  ['65',  F,F,       F,F    ,F,F               ,C3,F,       EMPTY,  F],
  ['64s', F,F,       F,F    ,F,F               ,C3,F,      EMPTY,  F],

  ['54s', F,F,       F,F    ,F,F               ,C2,F,      EMPTY,  C4],
  ['54',  F,F,       F,F    ,F,F               ,C4,F,       EMPTY,  F],
  ['53s', F,F,       F,F    ,F,F               ,C4,F,      EMPTY,  F],

  ['43s', F,F,       F,F    ,F,F               ,C4,F,      EMPTY,  F],
  ['32s', F,F,       F,F    ,F,F               ,C4,F,      EMPTY,  F],
];
