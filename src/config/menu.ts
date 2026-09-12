export type MenuItem = {
  id: string;
  label: string;
  icon: string;
  isReady: boolean;
};

export type SubCategory = {
  label: string;
  items: MenuItem[];
};

export type MainCategory = {
  id: string;
  label: string;
  icon: string;
  subCategories: SubCategory[];
};

export const PORTAL_MENUS: MainCategory[] = [
  {
    id: 'finance',
    label: '금융 / 재테크',
    icon: 'Wallet',
    subCategories: [
      {
        label: '주식',
        items: [
          { id: 'whale', label: '세력 포착기 (스마트머니)', icon: 'Activity', isReady: true },
          { id: 'report', label: '실시간 시황 리포트', icon: 'BarChart2', isReady: true },
          { id: 'scouter', label: '주식 전투력 측정기', icon: 'Crosshair', isReady: true },
          { id: 'fortune', label: '주식 포춘쿠키 (운세)', icon: 'Sparkles', isReady: true },
          { id: 'reverse-trade', label: '인구신 AI 스캐너', icon: 'Cpu', isReady: true },
          { id: 'buyback', label: '기업 소각장 (자사주)', icon: 'Flame', isReady: true }
        ]
      },
      {
        label: '고급 정보 (Alpha)',
        items: [
          { id: 'info-board', label: '증시 꿀팁 / 인사이트', icon: 'Gem', isReady: true }
        ]
      },
      {
        label: '투자 계산기',
        items: [
          { id: 'calc-avg', label: '물타기(평단가) 계산기', icon: 'Calculator', isReady: true },
          { id: 'calc-compound', label: '레버리지 계좌 엑스레이 (X-Ray)', icon: 'ScanSearch', isReady: true },
          { id: 'fomo', label: 'FOMO 타임머신', icon: 'History', isReady: true }
        ]
      }
    ]
  },
  {
    id: 'utilities',
    label: '유틸리티 / 도구',
    icon: 'Wrench',
    subCategories: [
      {
        label: '텍스트 도구',
        items: [
          { id: 'spell-check', label: 'AI 맞춤법 검사기', icon: 'SpellCheck', isReady: false },
          { id: 'translator', label: '글자 수 세기 / 번역', icon: 'Languages', isReady: false }
        ]
      },
      {
        label: '일상 편의',
        items: [
          { id: 'qr-gen', label: 'QR코드 생성기', icon: 'QrCode', isReady: false },
          { id: 'lotto', label: '로또 번호 추첨기', icon: 'Clover', isReady: false }
        ]
      }
    ]
  },
  {
    id: 'games',
    label: '게임 / 오락',
    icon: 'Gamepad2',
    subCategories: [
      {
        label: '클래식 / 향수',
        items: [
          { id: 'classic-games', label: '클래식 게임 핫이슈', icon: 'Flame', isReady: true }
        ]
      }
    ]
  },
  {
    id: 'trends',
    label: '트렌드 / 커뮤니티',
    icon: 'Radio',
    subCategories: [
      {
        label: '사이트 소식',
        items: [
          { id: 'patchnotes', label: 'KOREKORE 패치 노트', icon: 'Pin', isReady: true },
          { id: 'feedback', label: '사용자 건의 게시판', icon: 'MessageSquare', isReady: true }
        ]
      }
    ]
  }
];

export const getMenuItemById = (id: string): MenuItem | undefined => {
  for (const main of PORTAL_MENUS) {
    for (const sub of main.subCategories) {
      const found = sub.items.find(item => item.id === id);
      if (found) return found;
    }
  }
  return undefined;
};
