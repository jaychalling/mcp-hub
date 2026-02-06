const fs = require('fs');
const path = require('path');

const pages = {
  vibecoder: {
    color: 'blue',
    headline: '이 서비스를 쓰면 비개발자가 대화 3번만으로 텔레그램/디스코드 봇을 완성하고 즉시 배포한다.',
    deliverables: [
      { name: '완성된 봇 코드', format: '자동 생성', description: '대화만으로 완성되는 텔레그램/디스코드 봇' },
      { name: '1클릭 배포', format: '클라우드', description: 'Railway/Fly.io 자동 배포, 도메인 연결' },
      { name: '봇 관리 대시보드', format: '웹 UI', description: '사용량, 에러 로그, 설정 변경' },
    ],
    journey: [
      { step: '입력', label: '봇 설명', description: '"주식 가격 알려주는 봇 만들어줘"' },
      { step: '처리', label: 'AI 코드 생성', description: '대화 기반 코드 생성 + 테스트 + 수정' },
      { step: '결과', label: '배포 완료', description: '1클릭 배포 + 봇 토큰 연결 + 즉시 사용' },
    ],
    screens: [
      { title: '💬 대화 인터페이스', items: ['자연어로 봇 설명', 'AI가 질문·확인', '실시간 프리뷰'] },
      { title: '🚀 배포 화면', items: ['1클릭 Railway 배포', '봇 토큰 입력', '배포 상태 모니터링'] },
      { title: '📊 관리 대시보드', items: ['사용량 통계', '에러 로그', '설정 변경'] },
    ],
    whyMoney: '봇 개발 외주비 50~200만원을 $9.99로 대체. 비개발자 시장이 개발자보다 10배 크다.',
  },
  'launchcompare-v2': {
    color: 'violet',
    headline: '이 서비스를 쓰면 개발자/크리에이터가 31개 AI 이미지 모델의 결과를 한 화면에서 비교하고 최적 모델을 선택한다.',
    deliverables: [
      { name: '모델 비교 그리드', format: '웹 UI', description: '같은 프롬프트로 31개 모델 결과 나란히 비교' },
      { name: '품질 평가 리포트', format: '카드/표', description: '해상도, 속도, 스타일 정확도 비교 데이터' },
      { name: '비용 계산기', format: '인터랙티브', description: '모델별 API 비용 비교 + 월 예상 비용' },
    ],
    journey: [
      { step: '입력', label: '프롬프트 입력', description: '원하는 이미지 설명을 자연어로 입력' },
      { step: '처리', label: '31개 모델 동시 생성', description: 'DALL-E, Midjourney, Stable Diffusion 등 병렬 실행' },
      { step: '결과', label: '비교 그리드', description: '결과 나란히 비교 + 품질·속도·비용 평가' },
    ],
    screens: [
      { title: '✏️ 프롬프트 입력', items: ['자연어 프롬프트 입력', '스타일/해상도 옵션', '크레딧 표시'] },
      { title: '🖼️ 비교 그리드', items: ['31개 모델 결과 나란히', '확대/다운로드', '즐겨찾기 저장'] },
      { title: '📊 평가 리포트', items: ['품질/속도/비용 비교표', '모델별 강점 요약', '추천 모델 표시'] },
    ],
    whyMoney: '개발자가 모델 선택에 쓰는 시간 절약. 크레딧 시스템으로 사용량 기반 과금.',
  },
  solostack: {
    color: 'teal',
    headline: '이 서비스를 쓰면 솔로프레너가 자신의 SaaS 스택 총 비용을 한눈에 파악하고 더 저렴한 대안을 즉시 찾는다.',
    deliverables: [
      { name: '월 스택 비용 리포트', format: '대시보드', description: '현재 사용 중인 도구들의 총 월비용 시각화' },
      { name: '대안 도구 추천', format: '비교 카드', description: '각 도구별 무료/저가 대안 + 절약 금액' },
      { name: '스택 공유 카드', format: '이미지/링크', description: '"내 스택은 월 $X" SNS 공유용 카드' },
    ],
    journey: [
      { step: '입력', label: '도구 선택', description: '현재 사용 중인 SaaS 도구들 검색·추가' },
      { step: '처리', label: 'AI 대안 매칭', description: '비용 합산 + 카테고리별 저가 대안 자동 매칭' },
      { step: '결과', label: '비용 리포트', description: '월 비용 + 절약 가능 금액 + 대안 추천 리스트' },
    ],
    screens: [
      { title: '🔍 도구 검색', items: ['SaaS 도구 검색·추가', '카테고리 필터', '현재 스택 태그'] },
      { title: '💰 비용 대시보드', items: ['월 총 비용 표시', '도구별 대안 비교', '절약 금액 하이라이트'] },
      { title: '📤 공유', items: ['스택 카드 생성', 'SNS 공유', '다른 스택과 비교'] },
    ],
    whyMoney: 'Featured Listing (SaaS 기업이 노출에 월 $50~200 지불) + 어필리에이트 링크 수익.',
  },
  stackpicker: {
    color: 'cyan',
    headline: '이 서비스를 쓰면 개발자가 AI 코딩 도구를 빠르게 비교하고 자신에게 맞는 최적의 스택을 찾는다.',
    deliverables: [
      { name: 'AI 도구 비교표', format: '인터랙티브 표', description: '기능·가격·성능 필터링 비교' },
      { name: 'Stack Quiz 결과', format: '추천 카드', description: '5문항 퀴즈로 맞춤 도구 추천' },
      { name: '도구 리뷰·평점', format: '커뮤니티', description: '실사용자 리뷰 + 별점' },
    ],
    journey: [
      { step: '입력', label: 'Stack Quiz', description: '5문항 퀴즈 (언어, 예산, 용도 등)' },
      { step: '처리', label: 'AI 매칭', description: '답변 기반 최적 도구 조합 추천' },
      { step: '결과', label: '추천 스택', description: '맞춤 도구 3~5개 + 비교표 + 리뷰' },
    ],
    screens: [
      { title: '🧩 Stack Quiz', items: ['5문항 인터랙티브 퀴즈', '프로그레스 바', '결과 미리보기'] },
      { title: '📊 비교표', items: ['도구별 기능 매트릭스', '가격 필터', '성능 벤치마크'] },
      { title: '⭐ 리뷰', items: ['실사용자 별점·리뷰', '장단점 요약', '대안 도구 링크'] },
    ],
    whyMoney: '도구 제작사 스폰서 리스팅 + 어필리에이트 + 프리미엄 비교 기능 구독.',
  },
  georank: {
    color: 'lime',
    headline: '이 서비스를 쓰면 마케터/SEO 담당자가 AI 검색엔진에서 자사 브랜드의 가시성 점수를 측정하고 개선한다.',
    deliverables: [
      { name: 'GEO Score (0-100)', format: '점수', description: 'AI 검색엔진 가시성 종합 점수' },
      { name: '키워드별 순위 리포트', format: '대시보드', description: 'ChatGPT, Perplexity 등에서의 언급 순위' },
      { name: '개선 액션 플랜', format: '체크리스트', description: 'GEO 점수 올리는 구체적 행동 가이드' },
    ],
    journey: [
      { step: '입력', label: '도메인 + 키워드', description: '자사 URL과 타겟 키워드 입력' },
      { step: '처리', label: 'AI 검색엔진 스캔', description: 'ChatGPT/Perplexity/Gemini에서 브랜드 언급 분석' },
      { step: '결과', label: 'GEO Score 리포트', description: '점수 + 순위 + 경쟁사 비교 + 개선 가이드' },
    ],
    screens: [
      { title: '🔍 도메인 입력', items: ['URL + 키워드 입력', '경쟁사 URL 추가 (선택)', '스캔 시작'] },
      { title: '📊 GEO 대시보드', items: ['종합 점수 게이지', '키워드별 순위 차트', '주간 트렌드 그래프'] },
      { title: '📋 액션 플랜', items: ['점수 개선 체크리스트', '우선순위별 정렬', '예상 효과 표시'] },
    ],
    whyMoney: '기존 SEO 도구($99~249/월)가 AI 검색을 다루지 못하는 블루오션. $39~249 3티어 구독.',
  },
};

const appDir = 'E:/idea-hub/src/app';

for (const [slug, data] of Object.entries(pages)) {
  const filePath = path.join(appDir, slug, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${slug} (no file)`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add import if not present
  if (!content.includes('ValueDelivery')) {
    content = content.replace(
      /from '@mantine\/core';/,
      `from '@mantine/core';\nimport ValueDelivery from '../../components/ValueDelivery';`
    );
  }
  
  // Find and replace Value Delivery block
  const vdStart = content.indexOf('{/* 🎯 Value Delivery */}');
  if (vdStart === -1) {
    // Try alternate pattern
    const altStart = content.indexOf('{/* ?? Value Delivery */}');
    if (altStart === -1) {
      console.log(`NO VD BLOCK: ${slug}`);
      // For files without VD, add it after the first heading section
      continue;
    }
  }
  
  // Build replacement component JSX
  const comp = `<ValueDelivery
        color="${data.color}"
        headline="${data.headline}"
        deliverables={${JSON.stringify(data.deliverables)}}
        journey={${JSON.stringify(data.journey)}}
        screens={${JSON.stringify(data.screens)}}
        whyMoney="${data.whyMoney}"
      />`;
  
  // Replace the old VD block (from {/* Value Delivery */} to closing </Paper>)
  // Find the VD section start
  const patterns = ['{/* 🎯 Value Delivery */}', '{/* ?? Value Delivery */}'];
  let startIdx = -1;
  for (const p of patterns) {
    startIdx = content.indexOf(p);
    if (startIdx !== -1) break;
  }
  
  if (startIdx === -1) {
    console.log(`PATTERN NOT FOUND: ${slug}`);
    continue;
  }
  
  // Find the closing </Paper> that ends the VD section
  // The VD section is wrapped in a Paper, so we need to find the matching close
  // Strategy: find the next occurrence of a section header after VD
  const afterVD = content.substring(startIdx);
  
  // Find the end of the VD Paper block - look for the pattern that comes after
  // Usually it's followed by another section like <Title order={2}
  const endPatterns = [
    '<Title order={2}',
    '{/* Part 1',
    '{/* ─── Part',
    '{/* =====',
    '{/* =====================',
  ];
  
  let endIdx = -1;
  for (const ep of endPatterns) {
    const idx = afterVD.indexOf(ep, 100); // skip at least 100 chars
    if (idx !== -1 && (endIdx === -1 || idx < endIdx)) {
      endIdx = idx;
    }
  }
  
  if (endIdx === -1) {
    console.log(`END NOT FOUND: ${slug}`);
    continue;
  }
  
  // Replace
  const before = content.substring(0, startIdx);
  const after = content.substring(startIdx + endIdx);
  const newContent = before + comp + '\n\n      ' + after;
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`OK: ${slug}`);
}

console.log('Done!');
