
export const mockComparisons = [
  {
    id: 1,
    title: "공무원 국외출장 규정",
    similarity: 85,
    differences: [
      "국외출장은 30일 이전 신청 필요 (국내는 7일)",
      "외화 지급 절차 추가",
      "영사확인서 제출 의무"
    ],
    department: "인사팀",
    type: "규정"
  },
  {
    id: 2,
    title: "교육훈련 출장 관리 지침",
    similarity: 72,
    differences: [
      "교육기관 사전 승인 필요",
      "교육 결과보고서 제출 의무",
      "교육비와 출장비 별도 정산"
    ],
    department: "인사팀",
    type: "지침"
  }
];

export const mockHistory = [
  {
    date: "2024-05-15",
    version: "v2.1",
    changes: [
      "출장 신청 기간을 5일에서 7일로 연장",
      "숙박비 지급 기준 상향 조정",
      "대중교통 이용 의무화 조항 신설"
    ],
    modifier: "인사팀",
    reason: "실무 편의성 개선 및 예산 절약"
  },
  {
    date: "2024-02-28",
    version: "v2.0",
    changes: [
      "전자결재 시스템 연동",
      "출장명령서 서식 개정",
      "해외출장 절차 간소화"
    ],
    modifier: "기획조정실",
    reason: "디지털 전환 대응"
  },
  {
    date: "2023-12-10",
    version: "v1.5",
    changes: [
      "코로나19 관련 특별 조항 삭제",
      "출장 중 회계처리 기준 명확화"
    ],
    modifier: "총무팀",
    reason: "팬데믹 종료에 따른 정상화"
  }
];

export const mockPopularRegulations = [
  {
    rank: 1,
    title: "출장 및 교육훈련 관리 규정",
    department: "인사팀",
    viewCount: 1247,
    weeklyGrowth: 15,
    type: "규정",
    lastViewed: "1시간 전"
  },
  {
    rank: 2,
    title: "개인정보보호법 시행령",
    department: "개인정보보호위원회",
    viewCount: 1156,
    weeklyGrowth: 8,
    type: "법률",
    lastViewed: "2시간 전"
  },
  {
    rank: 3,
    title: "예산집행 업무처리 규정",
    department: "기획재정부",
    viewCount: 987,
    weeklyGrowth: 12,
    type: "규정",
    lastViewed: "3시간 전"
  },
  {
    rank: 4,
    title: "정보시스템 운영 관리지침",
    department: "정보보안팀",
    viewCount: 856,
    weeklyGrowth: -2,
    type: "지침",
    lastViewed: "5시간 전"
  },
  {
    rank: 5,
    title: "사이버보안 대응 매뉴얼",
    department: "정보보안팀",
    viewCount: 743,
    weeklyGrowth: 25,
    type: "가이드",
    lastViewed: "1일 전"
  }
];

export const allMockResults = [
  {
    id: 1,
    title: "개인정보보호법 시행령",
    content: "개인정보보호법 제2조제1호에 따른 개인정보의 처리에 관한 사항을 규정하며, 개인정보처리자의 의무와 정보주체의 권리를 보장하기 위한 세부 규정을 포함합니다. 제3조에서는 개인정보 처리의 원칙을, 제4조에서는 개인정보의 수집·이용 제한을 명시하고 있습니다.",
    source: "법제처",
    department: "개인정보보호위원회",
    lastModified: "2024-03-15",
    fileName: "개인정보보호법_시행령.pdf",
    type: "법률",
    url: "#"
  },
  {
    id: 2,
    title: "정보시스템 운영 관리지침",
    content: "정보시스템의 안정적 운영을 위한 관리 절차 및 방법을 정의합니다. 시스템 점검, 백업, 보안 관리, 장애 대응 등의 운영 업무를 체계적으로 수행하기 위한 세부 지침을 제공하며, 담당자별 역할과 책임을 명확히 규정하고 있습니다.",
    source: "내부문서",
    department: "정보보안팀",
    lastModified: "2024-06-10",
    fileName: "정보시스템_운영관리지침.hwp",
    type: "지침",
    url: "#"
  },
  {
    id: 3,
    title: "예산집행 업무처리 규정",
    content: "예산의 편성, 집행, 결산에 관한 업무처리 절차를 규정합니다. 예산요구서 작성, 예산배정, 지출원인행위, 지급명령 등 예산집행의 전 과정에 대한 세부 절차와 필요 서류를 명시하고, 내부통제 방안을 포함하고 있습니다.",
    source: "내부문서",
    department: "기획재정부",
    lastModified: "2024-05-20",
    fileName: "예산집행_업무처리규정.pdf",
    type: "규정",
    url: "#"
  },
  {
    id: 4,
    title: "공무원 인사관리 규정",
    content: "공무원의 임용, 승진, 전보, 교육훈련, 평가 등 인사관리 전반에 관한 사항을 규정합니다. 인사위원회 운영, 근무성적평정, 징계절차, 포상 및 표창 등의 세부 기준과 절차를 포함하며, 공정하고 투명한 인사행정을 위한 지침을 제공합니다.",
    source: "내부문서",
    department: "인사팀",
    lastModified: "2024-04-08",
    fileName: "공무원_인사관리규정.pdf",
    type: "규정",
    url: "#"
  },
  {
    id: 5,
    title: "행정절차법",
    content: "행정청이 행정처분, 행정계획수립, 행정입법 등의 행정작용을 할 때 공통적으로 적용되는 절차에 관한 기본적인 사항을 규정함으로써 국민의 행정 참여를 도모하고 행정의 공정성·투명성 및 신뢰성을 확보하여 국민의 권익을 보호함을 목적으로 합니다.",
    source: "법제처",
    department: "법제처",
    lastModified: "2024-02-28",
    fileName: "행정절차법.pdf",
    type: "법률",
    url: "#"
  },
  {
    id: 6,
    title: "사이버보안 대응 매뉴얼",
    content: "사이버 공격 및 보안 사고 발생 시 신속하고 체계적인 대응을 위한 행동 지침입니다. 보안사고 유형별 대응절차, 비상연락체계, 복구방안 등을 상세히 기술하고 있으며, 정기적인 모의훈련 계획도 포함되어 있습니다.",
    source: "내부문서",
    department: "정보보안팀",
    lastModified: "2024-06-25",
    fileName: "사이버보안_대응매뉴얼.hwp",
    type: "가이드",
    url: "#"
  },
  {
    id: 7,
    title: "공공조달 업무 가이드",
    content: "국가계약법에 따른 조달업무 처리 가이드라인으로, 입찰공고부터 계약체결, 이행관리까지의 전 과정을 설명합니다. 제한경쟁입찰, 수의계약 등 계약방법별 세부 절차와 주의사항, 계약서 작성 요령 등을 포함하고 있습니다.",
    source: "내부문서",
    department: "조달팀",
    lastModified: "2024-05-15",
    fileName: "공공조달_업무가이드.pdf",
    type: "가이드",
    url: "#"
  },
  {
    id: 8,
    title: "정보공개 업무처리 지침",
    content: "정보공개법에 따른 정보공개 청구 접수, 검토, 결정, 통지 등의 업무처리 절차를 규정합니다. 공개·비공개 판단기준, 부분공개 방법, 이의신청 처리 등의 세부 지침과 표준 서식을 제공하여 일관성 있는 정보공개 업무를 지원합니다.",
    source: "내부문서",
    department: "민원담당팀",
    lastModified: "2024-04-22",
    fileName: "정보공개_업무처리지침.hwp",
    type: "지침",
    url: "#"
  },
  {
    id: 9,
    title: "국가공무원법",
    content: "국가공무원의 신분보장, 복무, 능률성 확보 등에 관한 기본사항을 규정함으로써 국민에 대한 공무원의 봉사정신을 확립하고 공무원의 이익을 보호하며 행정의 민주적이고 능률적인 운영을 기함을 목적으로 합니다.",
    source: "법제처",
    department: "인사혁신처",
    lastModified: "2024-01-10",
    fileName: "국가공무원법.pdf",
    type: "법률",
    url: "#"
  },
  {
    id: 10,
    title: "출장 및 교육훈련 관리 규정",
    content: "공무원의 국내외 출장 및 교육훈련에 관한 계획수립, 승인절차, 비용지급, 결과보고 등의 업무처리 기준을 규정합니다. 출장명령서 작성, 여비 산정, 교육기관 선정 기준 등의 세부 지침과 함께 예산 절약 방안도 포함하고 있습니다.",
    source: "내부문서",
    department: "인사팀",
    lastModified: "2024-03-30",
    fileName: "출장교육훈련_관리규정.pdf",
    type: "규정",
    url: "#"
  },
  {
    id: 11,
    title: "문서관리 시스템 운영 지침",
    content: "전자문서시스템을 활용한 공문서 작성, 결재, 시행, 보존 등의 업무처리 절차를 규정합니다. 문서번호 부여체계, 보존연한 설정, 접근권한 관리, 백업 및 이관 절차 등을 포함하여 체계적인 문서관리를 지원합니다.",
    source: "내부문서",
    department: "총무팀",
    lastModified: "2024-05-08",
    fileName: "문서관리시스템_운영지침.hwp",
    type: "지침",
    url: "#"
  },
  {
    id: 12,
    title: "국정감사 대응 매뉴얼",
    content: "국정감사 준비부터 종료까지의 전 과정에 대한 대응 지침으로, 자료수집, 답변서 작성, 현장 대응요령 등을 상세히 설명합니다. 부서별 역할분담, 보고체계, 주요 예상질의 및 답변 예시 등을 포함하여 효과적인 국정감사 대응을 지원합니다.",
    source: "내부문서",
    department: "기획조정실",
    lastModified: "2024-02-14",
    fileName: "국정감사_대응매뉴얼.pdf",
    type: "가이드",
    url: "#"
  }
];
