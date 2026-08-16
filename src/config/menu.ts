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
    icon: '💸',
    subCategories: [
      {
        label: '주식',
        items: [
          { id: 'report', label: '실시간 시황 리포트', icon: '🔥', isReady: true },
          { id: 'scouter', label: '주식 전투력 측정기', icon: '🔭', isReady: true }
        ]
      },
      {
        label: '투자 계산기',
        items: [
          { id: 'calc-avg', label: '물타기(평단가) 계산기', icon: '🛟', isReady: true },
          { id: 'calc-compound', label: '복리 수익률 시뮬레이터', icon: '🪄', isReady: false }
        ]
      }
    ]
  },
  {
    id: 'utilities',
    label: '유틸리티 / 도구',
    icon: '⚡',
    subCategories: [
      {
        label: '텍스트 도구',
        items: [
          { id: 'spell-check', label: 'AI 맞춤법 검사기', icon: '✍️', isReady: false },
          { id: 'translator', label: '글자 수 세기 / 번역', icon: '🌍', isReady: false }
        ]
      },
      {
        label: '일상 편의',
        items: [
          { id: 'qr-gen', label: 'QR코드 생성기', icon: '👾', isReady: false },
          { id: 'lotto', label: '로또 번호 추첨기', icon: '🍀', isReady: false }
        ]
      }
    ]
  },
  {
    id: 'trends',
    label: '트렌드 / 커뮤니티',
    icon: '🎙️',
    subCategories: [
      {
        label: '사이트 소식',
        items: [
          { id: 'patchnotes', label: 'KOREKORE 패치 노트', icon: '📌', isReady: true },
          { id: 'feedback', label: '사용자 건의 게시판', icon: '💬', isReady: false }
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
