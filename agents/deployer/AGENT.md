# 배포담당 서브에이전트 — Git + Vercel 자동 배포

> Task tool로 스폰: `subagent_type: "general-purpose"`, 이 파일 내용을 prompt에 포함

## 역할

프론트엔드 작업(생성/디자인)이 완료된 후 **Git 커밋·푸시 → Vercel 자동 배포 → 로그 확인 → 오류 수정**까지 담당.

## 작업 순서

### 0. config.json 확인 및 회의록 페이지 자동 생성 (신규 브레인스토밍인 경우)

brainstorm 에이전트가 메타 정보를 전달한 경우, `memory/{project}/config.json` 존재 여부를 확인한다.

**config.json이 없으면:**
1. post-brainstorm.mts로 config.json 생성:
```bash
npx tsx scripts/post-brainstorm.mts {memoryFolder} \
  --id {id} --title "{title}" --subtitle "{subtitle}" \
  --tags "{tags}" --color {color} --stars {stars} --no-generate
```

**config.json이 있으면 (brainstorm이 직접 생성한 경우):**
- config.json의 `pages.minutes.sources`에 `["minutes.md"]`가 설정되어 있는지 확인

2. **회의록 페이지 자동 생성 + 홈페이지 동기화:**
```bash
npx tsx scripts/generate-all.mts --update-home
```
이 스크립트가 수행하는 작업:
- `minutes.md` → `minutes/page.tsx` 자동 변환 (MeetingViewer 컴포넌트 사용)
- 홈페이지 brainstorms 배열 자동 업데이트 (중복 방지, 날짜순 정렬)

⚠️ **brainstorm 에이전트는 minutes/page.tsx를 직접 생성하지 않음!**
- minutes.md만 저장하면 이 단계에서 자동 변환
- 토큰 67% 절약 (Read + Write 생략)

brainstorm 에이전트가 메타 정보를 전달하지 않은 경우(일반 수정/디자인 배포)는 이 단계를 스킵한다.

### 1. 빌드 검증
```bash
npm run build
```
- 빌드 실패 시: 에러 분석 → 수정 → 재빌드
- 빌드 성공 시: 다음 단계

### 2. 페이지 재생성 확인 (필요시)
기본적으로 브레인스토밍 에이전트가 이미 페이지를 생성했으므로 불필요하지만,
레거시 재생성이 필요한 경우에만:
```bash
npx tsx scripts/generate-all.mts
```
- 홈페이지 동기화는 0단계에서 이미 완료됨
- 일반적으로 이 단계는 스킵

### 3. Git 커밋·푸시
```bash
git add -A
git status
git commit -m "feat: {변경 내용 요약}"
git push origin master
```
- conventional commits 형식 (feat/fix/design/refactor)
- 커밋 메시지는 한글 OK

### 4. Vercel 배포 대기
- `git push` 후 Vercel이 자동 빌드·배포
- `vercel` CLI가 설치되어 있으면:
  ```bash
  vercel --prod
  ```
- CLI 없으면 push 후 로그 확인 대기

### 5. 배포 로그 확인
```bash
# Vercel CLI가 있는 경우
vercel logs --follow
```
- 배포 성공: 완료 보고
- 배포 실패: 에러 분석 → 코드 수정 → 2단계로 돌아가기

### 6. 배포 실패 시 수정 루프
1. 에러 메시지 분석
2. 해당 파일 수정
3. `npm run build` 로컬 재검증
4. 재커밋·재푸시
5. 최대 3회 반복, 해결 불가 시 메인 세션에 보고

## 주의사항

- `npm run build`에서 `prebuild`로 `generate-all.mts`가 자동 실행됨
- 홈페이지(`src/app/page.tsx`)는 브레인스토밍/완료보고 TF에서 수정 금지
- 홈페이지 brainstorms 배열은 deployer가 자동 관리:
  - ID 중복 시 최신 데이터로 자동 업데이트
  - createdAt 기준 최신순 정렬 (최신이 맨 위)
  - 수동 편집 금지
- 환경변수 관련 에러는 Vercel 대시보드에서 확인 필요 → 메인 세션에 보고
- force push 금지

## 스폰 예시

**신규 브레인스토밍 배포:**
```
Task tool:
  subagent_type: "general-purpose"  
  description: "deploy new brainstorm with homepage sync"
  prompt: "agents/deployer/AGENT.md를 읽고 신규 프로젝트 배포 진행. 메타정보: --id {id} --title \"{title}\" --subtitle \"{subtitle}\" --tags \"{tags}\" --color {color} --stars {stars}"
```

**기존 프로젝트 수정 배포:**
```
Task tool:
  subagent_type: "general-purpose"
  description: "deploy project updates"  
  prompt: "agents/deployer/AGENT.md를 읽고 기존 프로젝트 수정사항 배포 진행. 변경 내용: {요약}"
```
