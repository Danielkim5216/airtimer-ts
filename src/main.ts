import './style.css';

console.log("🚀 ROKAF Clock Main script loaded.");

interface Cohort {
  cohortNumber: number;
  enlistmentDate: Date;
  dischargeDate: Date;
  pRecruitEnd: Date;    // End of Recruit (5 weeks)
  pPrivateEnd: Date;    // End of Private (3 months of service)
  pPfcEnd: Date;        // End of PFC (9 months of service)
  pCplEnd: Date;        // End of Corporal (15 months of service)
  pSgtEnd: Date;        // End of Sergeant (Discharge)
}

type Rank = '민간인' | '훈련병' | '이등병' | '일병' | '상병' | '병장' | '예비역';

// Constant Variables & Cohort Specific Date Overrides
const START_COHORT = 862;
const END_COHORT = 880;
const REF_COHORT = 879; // 879기 is recruit as of June 2026
const REF_DATE = new Date(2026, 5, 1); // 2026-06-01 (Month is 0-indexed, so 5 is June)

// 각 기수의 실제 입대일과 전역일을 개별 지정하려면 아래 객체에 추가/수정.
// 날짜 포맷은 'YYYY-MM-DD' 형식입니다. 전역일(discharge)은 적지 않으면 입대일로부터 21개월 후로 자동 계산됩니다
// 최근부터 입대일이 일정하지 않으니 수동으로 넣는걸 추천.
const COHORT_DATE_OVERRIDES: { [cohort: number]: { enlist: string; discharge?: string } } = {
  '862': { enlist: '2024-10-14', discharge: '2026-07-13' },
  '863': { enlist: '2024-11-18', discharge: '2026-08-17' },
  '864': { enlist: '2024-12-23', discharge: '2026-09-22' },
  '865': { enlist: '2025-02-03', discharge: '2026-11-02' },
  '866': { enlist: '2025-03-10', discharge: '2026-12-09' },
  '867': { enlist: '2025-04-14', discharge: '2027-01-13' },
  '868': { enlist: '2025-05-19', discharge: '2027-02-18' },
  '869': { enlist: '2025-06-23', discharge: '2027-03-22' },
  '870': { enlist: '2025-07-28', discharge: '2027-04-27' },
  '871': { enlist: '2025-09-01', discharge: '2027-05-31' },
  '872': { enlist: '2025-10-13', discharge: '2027-07-12' },
  '873': { enlist: '2025-11-17', discharge: '2027-08-16' },
  '874': { enlist: '2025-12-22', discharge: '2027-09-21' },
  '875': { enlist: '2026-01-19', discharge: '2027-10-18' },
  '876': { enlist: '2026-02-23', discharge: '2027-11-22' },
  '877': { enlist: '2026-03-23', discharge: '2027-12-22' },
  '878': { enlist: '2026-04-20', discharge: '2028-01-19' },
  '879': { enlist: '2026-05-18', discharge: '2028-02-17' },
  '880': { enlist: '2026-06-22', discharge: '2028-03-21' },
  // 필요 시 아래 형식으로 입대/전역 날짜를 추가하여 개별 변경.
  // 878: { enlist: '2026-05-04', discharge: '2028-02-03' },
};

// 5초마다 보여줄 공지사항 목록
const NOTICES = [
  "최초 업데이트가 완료되었습니다. (862기~880기)",
  "개발자는 869기 입니다. 869기 화이팅!",
  "Gemini 3.5 Flash의 테스트 도중 만들어봤습니다.",
];

// Helper Functions
function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

function createCohort(cohortNumber: number): Cohort {
  let enlistmentDate: Date;
  let dischargeDate: Date;

  const override = COHORT_DATE_OVERRIDES[cohortNumber];
  if (override) {
    enlistmentDate = parseLocalDate(override.enlist);
    if (override.discharge) {
      dischargeDate = parseLocalDate(override.discharge);
    } else {
      dischargeDate = new Date(enlistmentDate.getFullYear(), enlistmentDate.getMonth() + 21, 1);
      dischargeDate.setDate(dischargeDate.getDate() - 1);
    }
  } else {
    // 자동 계산 (매월 1일 입대)
    const diffMonths = cohortNumber - REF_COHORT;
    enlistmentDate = new Date(REF_DATE.getFullYear(), REF_DATE.getMonth() + diffMonths, 1);
    dischargeDate = new Date(enlistmentDate.getFullYear(), enlistmentDate.getMonth() + 21, 1);
    dischargeDate.setDate(dischargeDate.getDate() - 1);
  }
  
  // Ranks Milestones:
  // 1. Recruit (훈련병): 5 weeks (35 days) from enlistment
  const pRecruitEnd = new Date(enlistmentDate.getTime());
  pRecruitEnd.setDate(pRecruitEnd.getDate() + 35);
  
  // 2. Private (이등병): Ends at 3 months from enlistment
  const pPrivateEnd = new Date(enlistmentDate.getFullYear(), enlistmentDate.getMonth() + 3, 1);
  
  // 3. PFC (일병): Ends at 9 months from enlistment
  const pPfcEnd = new Date(enlistmentDate.getFullYear(), enlistmentDate.getMonth() + 9, 1);
  
  // 4. Corporal (상병): Ends at 15 months from enlistment
  const pCplEnd = new Date(enlistmentDate.getFullYear(), enlistmentDate.getMonth() + 15, 1);
  
  // 5. Sergeant (병장): Ends at Discharge Date
  const pSgtEnd = dischargeDate;

  return {
    cohortNumber,
    enlistmentDate,
    dischargeDate,
    pRecruitEnd,
    pPrivateEnd,
    pPfcEnd,
    pCplEnd,
    pSgtEnd
  };
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}. ${m}. ${d}.`;
}

function getRankAndTimeline(cohort: Cohort, now: Date): { rank: Rank; start: Date | null; end: Date | null; nextRank: string } {
  const time = now.getTime();
  const eTime = cohort.enlistmentDate.getTime();
  const rEnd = cohort.pRecruitEnd.getTime();
  const pEnd = cohort.pPrivateEnd.getTime();
  const pfcEnd = cohort.pPfcEnd.getTime();
  const cEnd = cohort.pCplEnd.getTime();
  const dTime = cohort.dischargeDate.getTime();

  if (time < eTime) {
    return { rank: '민간인', start: null, end: cohort.enlistmentDate, nextRank: '훈련병' };
  } else if (time >= dTime) {
    return { rank: '예비역', start: cohort.dischargeDate, end: null, nextRank: '전역 완료' };
  } else if (time >= eTime && time < rEnd) {
    return { rank: '훈련병', start: cohort.enlistmentDate, end: cohort.pRecruitEnd, nextRank: '이등병' };
  } else if (time >= rEnd && time < pEnd) {
    return { rank: '이등병', start: cohort.pRecruitEnd, end: cohort.pPrivateEnd, nextRank: '일병' };
  } else if (time >= pEnd && time < pfcEnd) {
    return { rank: '일병', start: cohort.pPrivateEnd, end: cohort.pPfcEnd, nextRank: '상병' };
  } else if (time >= pfcEnd && time < cEnd) {
    return { rank: '상병', start: cohort.pPfcEnd, end: cohort.pCplEnd, nextRank: '병장' };
  } else {
    return { rank: '병장', start: cohort.pCplEnd, end: cohort.dischargeDate, nextRank: '예비역' };
  }
}

function calculateRankPercentage(cohort: Cohort, now: Date): number {
  const time = now.getTime();
  const { start, end } = getRankAndTimeline(cohort, now);
  
  if (!start && end) {
    // Before enlistment
    return 0;
  }
  if (start && !end) {
    // Discharged
    return 100;
  }
  if (start && end) {
    const total = end.getTime() - start.getTime();
    const current = time - start.getTime();
    return Math.max(0, Math.min(100, (current / total) * 100));
  }
  return 0;
}

function calculateTotalPercentage(cohort: Cohort, now: Date): number {
  const time = now.getTime();
  const eTime = cohort.enlistmentDate.getTime();
  const dTime = cohort.dischargeDate.getTime();
  
  if (time < eTime) return 0;
  if (time >= dTime) return 100;
  
  const total = dTime - eTime;
  const current = time - eTime;
  return Math.max(0, Math.min(100, (current / total) * 100));
}

function getDdays(cohort: Cohort, now: Date): { dischargeDday: string; nextRankDday: string } {
  const time = now.getTime();
  const eTime = cohort.enlistmentDate.getTime();
  const dTime = cohort.dischargeDate.getTime();
  const { end, rank } = getRankAndTimeline(cohort, now);
  
  const msInDay = 24 * 60 * 60 * 1000;
  
  let dischargeDday = '';
  if (time >= dTime) {
    dischargeDday = '전역 완료';
  } else if (time < eTime) {
    const diff = Math.ceil((eTime - time) / msInDay);
    dischargeDday = `입대 D-${diff}`;
  } else {
    const diff = Math.ceil((dTime - time) / msInDay);
    dischargeDday = `D-${diff}`;
  }

  let nextRankDday = '';
  if (rank === '예비역') {
    nextRankDday = '-';
  } else if (rank === '병장') {
    nextRankDday = dischargeDday;
  } else if (end) {
    const diff = Math.ceil((end.getTime() - time) / msInDay);
    nextRankDday = `D-${diff}`;
  } else {
    nextRankDday = '-';
  }

  return { dischargeDday, nextRankDday };
}

function getMilitaryClock(pct: number): string {
  const totalMs = 24 * 60 * 60 * 1000;
  const clockMs = (pct / 100) * totalMs;
  
  const hours = Math.floor(clockMs / (60 * 60 * 1000));
  const minutes = Math.floor((clockMs % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((clockMs % (60 * 1000)) / 1000);
  
  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');
  
  return `${hStr}:${mStr}:${sStr}`;
}

function getRankBadgeClass(rank: Rank): string {
  switch (rank) {
    case '민간인': return 'rank-badge-civilian';
    case '훈련병': return 'rank-badge-recruit';
    case '이등병': return 'rank-badge-private';
    case '일병': return 'rank-badge-pfc';
    case '상병': return 'rank-badge-corporal';
    case '병장': return 'rank-badge-sergeant';
    case '예비역': return 'rank-badge-discharged';
  }
}

// DOM Manipulation and Execution
const cohorts: Cohort[] = [];
for (let c = START_COHORT; c <= END_COHORT; c++) {
  cohorts.push(createCohort(c));
}

// Initialize structural HTML inside #app
const appEl = document.getElementById('app')!;
appEl.innerHTML = `
  <div class="header">
    <div class="title-area">
      <h1>AIR TIMER</h1>
      <p>공군인들의 시계는 간다.</p>
    </div>
    <div class="global-time-card">
      <div class="label">현재 시각</div>
      <div id="global-clock" class="time">0000. 00. 00. 00:00:00</div>
    </div>
  </div>

  <!-- 간편 한줄 공지사항은 여기로. -->
  <div class="notice-bar">
    <span class="notice-tag">공지</span>
    <span id="notice-text" class="notice-text">${NOTICES[0]}</span>
  </div>

  <div class="dashboard">
    <!-- Highlight Card: Oldest Cohort -->
    <div class="card card-highest" id="card-oldest"></div>
    <!-- Highlight Card: Recruit Cohort -->
    <div class="card card-lowest" id="card-recruit"></div>
  </div>

  <div class="table-section">
    <div class="table-controls">
      <h2 class="table-title">실시간 기수별 현황 (${START_COHORT}기 ~ ${END_COHORT}기)</h2>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>기수</th>
            <th>복무 기간 (입대 / 전역)</th>
            <th>현재 계급</th>
            <th>계급 복무율</th>
            <th>전체 복무율</th>
            <th>국방 시계</th>
            <th>다음 진급</th>
            <th>진급 D-day</th>
            <th>전역 D-day</th>
          </tr>
        </thead>
        <tbody id="cohort-table-body"></tbody>
      </table>
    </div>
  </div>

  <footer>
    <div>© 2026 AIR TIMER. All Rights Reserved.</div>
    <a href="https://github.com/Danielkim5216">@Danielkim5216</a>
  </footer>
`;

console.log("✅ DOM structural elements injected successfully.");

const tbody = document.getElementById('cohort-table-body')!;
const oldestCard = document.getElementById('card-oldest')!;
const recruitCard = document.getElementById('card-recruit')!;
const globalClockEl = document.getElementById('global-clock')!;

// =============================
// Detail Modal DOM refs & events
// =============================
let selectedCohort: Cohort | null = null;

// Inject modal HTML directly into body (outside #app to avoid layout issues)
const modalHTML = `
  <div class="detail-overlay" id="detail-overlay">
    <div class="detail-panel" id="detail-panel">
      <button class="detail-panel-close" id="detail-close-btn" aria-label="닫기">✕</button>
      <div class="detail-hero">
        <div class="detail-hero-top">
          <div class="detail-cohort-number" id="d-cohort-number">000<span>기</span></div>
          <span class="rank-badge detail-rank-badge" id="d-rank-badge">계급</span>
        </div>
        <div class="detail-dates">
          <div class="detail-date-item">
            <span class="detail-date-label">입대일</span>
            <span class="detail-date-value" id="d-enlist-date">-</span>
          </div>
          <div class="detail-date-item">
            <span class="detail-date-label">전역일</span>
            <span class="detail-date-value" id="d-discharge-date">-</span>
          </div>
          <div class="detail-date-item">
            <span class="detail-date-label">복무기간</span>
            <span class="detail-date-value" id="d-duration">-</span>
          </div>
        </div>
      </div>
      <div class="detail-bars">
        <div class="detail-bar-group">
          <div class="detail-bar-header">
            <span class="detail-bar-label">전체 복무율</span>
            <span class="detail-bar-pct" id="d-total-pct">0.00000%</span>
          </div>
          <div class="detail-bar-track">
            <div class="detail-bar-fill detail-bar-fill-total" id="d-total-bar" style="width:0%"></div>
          </div>
          <div class="detail-bar-sub">
            <span id="d-total-bar-start">입대일</span>
            <span id="d-total-bar-end">전역일</span>
          </div>
        </div>
        <div class="detail-bar-group">
          <div class="detail-bar-header">
            <span class="detail-bar-label" id="d-rank-bar-label">계급 복무율</span>
            <span class="detail-bar-pct" id="d-rank-pct">0.00000%</span>
          </div>
          <div class="detail-bar-track">
            <div class="detail-bar-fill detail-bar-fill-rank" id="d-rank-bar" style="width:0%"></div>
          </div>
          <div class="detail-bar-sub">
            <span id="d-rank-bar-start">시작</span>
            <span id="d-rank-bar-end">종료</span>
          </div>
        </div>
      </div>
      <div class="detail-stats">
        <div class="detail-stat-card">
          <span class="detail-stat-label">국방 시계</span>
          <span class="detail-stat-value" id="d-clock">00:00:00</span>
          <span class="detail-stat-sub">Military Time</span>
        </div>
        <div class="detail-stat-card">
          <span class="detail-stat-label">전역 D-day</span>
          <span class="detail-stat-value" id="d-discharge-dday">-</span>
          <span class="detail-stat-sub">Discharge</span>
        </div>
        <div class="detail-stat-card">
          <span class="detail-stat-label">진급 D-day</span>
          <span class="detail-stat-value" id="d-nextrank-dday">-</span>
          <span class="detail-stat-sub" id="d-nextrank-label">Next Rank</span>
        </div>
        <div class="detail-stat-card">
          <span class="detail-stat-label">훈련병 수료</span>
          <span class="detail-stat-value" id="d-recruit-end">-</span>
          <span class="detail-stat-sub">Recruit End</span>
        </div>
        <div class="detail-stat-card">
          <span class="detail-stat-label">이등병 → 일병</span>
          <span class="detail-stat-value" id="d-private-end">-</span>
          <span class="detail-stat-sub">3개월차</span>
        </div>
        <div class="detail-stat-card">
          <span class="detail-stat-label">일병 → 상병</span>
          <span class="detail-stat-value" id="d-pfc-end">-</span>
          <span class="detail-stat-sub">9개월차</span>
        </div>
      </div>
      <div class="detail-timeline">
        <div class="detail-timeline-title">계급 타임라인</div>
        <div class="timeline-track" id="d-timeline-track"></div>
        <div class="timeline-labels" id="d-timeline-labels"></div>
      </div>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

const detailOverlay = document.getElementById('detail-overlay')!;
const detailCloseBtn = document.getElementById('detail-close-btn')!;

detailOverlay.addEventListener('click', (e) => {
  if (e.target === detailOverlay) closeDetailModal();
});
detailCloseBtn.addEventListener('click', closeDetailModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDetailModal();
});

// Build initial rows of table (to avoid re-rendering layout and keep transition smooth)
cohorts.forEach(cohort => {
  const tr = document.createElement('tr');
  tr.id = `row-${cohort.cohortNumber}`;
  tr.classList.add('clickable-row');
  tr.title = `${cohort.cohortNumber}기 상세 보기`;
  
  tr.innerHTML = `
    <td><span class="cohort-badge">${cohort.cohortNumber}기</span></td>
    <td>
      <div class="date-cell">
        <span class="enlist">입: ${formatDate(cohort.enlistmentDate)}</span>
        <span class="discharge">전: ${formatDate(cohort.dischargeDate)}</span>
      </div>
    </td>
    <td>
      <div class="rank-badge-cell">
        <span id="rank-badge-${cohort.cohortNumber}" class="rank-badge"></span>
      </div>
    </td>
    <td>
      <div class="percentage-container">
        <span id="rank-pct-${cohort.cohortNumber}" class="percentage-text">0.00000%</span>
        <div class="percentage-bar-mini">
          <div id="rank-bar-${cohort.cohortNumber}" class="percentage-bar-mini-fill"></div>
        </div>
      </div>
    </td>
    <td>
      <div class="percentage-container">
        <span id="total-pct-${cohort.cohortNumber}" class="percentage-text">0.00000%</span>
        <div class="percentage-bar-mini">
          <div id="total-bar-${cohort.cohortNumber}" class="percentage-bar-mini-fill"></div>
        </div>
      </div>
    </td>
    <td>
      <div class="clock-cell">
        <div class="clock-icon-mini"></div>
        <span id="clock-txt-${cohort.cohortNumber}">00:00:00</span>
      </div>
    </td>
    <td><span id="next-rank-${cohort.cohortNumber}">-</span></td>
    <td><span id="next-dday-${cohort.cohortNumber}" class="dday-badge">D-day</span></td>
    <td><span id="discharge-dday-${cohort.cohortNumber}" class="dday-badge">D-day</span></td>
  `;
  
  tbody.appendChild(tr);

  // Click: open detail modal
  tr.addEventListener('click', () => openDetailModal(cohort));
});

// Real-time loop
function tick() {
  const now = new Date();
  
  // 1. Update Global Clock
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hrs = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');
  globalClockEl.textContent = `${year}. ${month}. ${date}. ${hrs}:${mins}:${secs}`;
  
  // 2. Update Table Rows
  cohorts.forEach(cohort => {
    const rowEl = document.getElementById(`row-${cohort.cohortNumber}`)!;
    const rankInfo = getRankAndTimeline(cohort, now);
    const totalPct = calculateTotalPercentage(cohort, now);
    const rankPct = calculateRankPercentage(cohort, now);
    const ddays = getDdays(cohort, now);
    const mClock = getMilitaryClock(totalPct);
    
    // Manage Row Active Glow Class
    if (rankInfo.rank !== '민간인' && rankInfo.rank !== '예비역') {
      rowEl.classList.add('active-cohort');
    } else {
      rowEl.classList.remove('active-cohort');
    }

    // Rank badge
    const badgeEl = document.getElementById(`rank-badge-${cohort.cohortNumber}`)!;
    badgeEl.className = `rank-badge ${getRankBadgeClass(rankInfo.rank)}`;
    badgeEl.textContent = rankInfo.rank;
    
    // Rank percentage
    const rankPctEl = document.getElementById(`rank-pct-${cohort.cohortNumber}`)!;
    const rankBarEl = document.getElementById(`rank-bar-${cohort.cohortNumber}`)! as HTMLDivElement;
    if (rankInfo.rank === '민간인') {
      rankPctEl.textContent = '-';
      rankBarEl.style.width = '0%';
    } else if (rankInfo.rank === '예비역') {
      rankPctEl.textContent = '100.00000%';
      rankBarEl.style.width = '100%';
      rankBarEl.style.backgroundColor = `var(--dis-color)`;
    } else {
      rankPctEl.textContent = `${rankPct.toFixed(5)}%`;
      rankBarEl.style.width = `${rankPct}%`;
      rankBarEl.style.backgroundColor = `var(--${getRankColorVar(rankInfo.rank)})`;
    }
    
    // Total percentage
    const totalPctEl = document.getElementById(`total-pct-${cohort.cohortNumber}`)!;
    const totalBarEl = document.getElementById(`total-bar-${cohort.cohortNumber}`)! as HTMLDivElement;
    totalPctEl.textContent = `${totalPct.toFixed(5)}%`;
    totalBarEl.style.width = `${totalPct}%`;
    totalBarEl.style.backgroundColor = totalPct >= 100 ? 'var(--dis-color)' : 'var(--accent)';
    
    // Clock
    const clockTxt = document.getElementById(`clock-txt-${cohort.cohortNumber}`)!;
    clockTxt.textContent = mClock;
    
    // Next Rank name
    const nextRankEl = document.getElementById(`next-rank-${cohort.cohortNumber}`)!;
    nextRankEl.textContent = rankInfo.nextRank;
    
    // Next rank Dday
    const nextDdayEl = document.getElementById(`next-dday-${cohort.cohortNumber}`)!;
    nextDdayEl.textContent = ddays.nextRankDday;
    nextDdayEl.className = 'dday-badge';
    if (ddays.nextRankDday.startsWith('D-')) {
      const days = parseInt(ddays.nextRankDday.replace('D-', ''));
      if (days <= 7) nextDdayEl.classList.add('dday-urgent');
      else nextDdayEl.classList.add('dday-active');
    } else {
      nextDdayEl.classList.add('dday-completed');
    }
    
    // Discharge Dday
    const disDdayEl = document.getElementById(`discharge-dday-${cohort.cohortNumber}`)!;
    disDdayEl.textContent = ddays.dischargeDday;
    disDdayEl.className = 'dday-badge';
    if (ddays.dischargeDday.startsWith('D-')) {
      const days = parseInt(ddays.dischargeDday.replace('D-', ''));
      if (days <= 30) disDdayEl.classList.add('dday-urgent');
      else disDdayEl.classList.add('dday-active');
    } else if (ddays.dischargeDday.startsWith('입대 D-')) {
      disDdayEl.classList.add('dday-active');
    } else {
      disDdayEl.classList.add('dday-completed');
    }
  });
  
  // 3. Update Highlight Cards (862기 최선임, 879기 훈련병)
  updateHighlightCard(oldestCard, createCohort(START_COHORT), now, '최선임 복무 현황', 'card-highest');
  updateHighlightCard(recruitCard, createCohort(REF_COHORT), now, '훈련병 복무 현황', 'card-lowest');

  // 4. Update detail modal if open
  if (selectedCohort !== null) {
    updateDetailModal(selectedCohort, now);
  }
}

function getRankColorVar(rank: Rank): string {
  switch (rank) {
    case '민간인': return 'civ-color';
    case '훈련병': return 'rec-color';
    case '이등병': return 'pvt-color';
    case '일병': return 'pfc-color';
    case '상병': return 'cpl-color';
    case '병장': return 'sgt-color';
    case '예비역': return 'dis-color';
  }
}

function updateHighlightCard(cardEl: HTMLElement, cohort: Cohort, now: Date, label: string, borderClass: string) {
  const rankInfo = getRankAndTimeline(cohort, now);
  const totalPct = calculateTotalPercentage(cohort, now);
  const ddays = getDdays(cohort, now);
  const mClock = getMilitaryClock(totalPct);
  
  cardEl.innerHTML = `
    <div class="card-header">
      <span class="card-title">${label}</span>
      <span class="badge ${borderClass === 'card-highest' ? 'rank-badge-sergeant' : 'rank-badge-recruit'}">
        ${rankInfo.rank}
      </span>
    </div>
    <div class="card-body">
      <div class="cohort-highlight">
        ${cohort.cohortNumber}<span>기</span>
      </div>
      <div class="progress-container">
        <div class="progress-header">
          <span class="text-secondary">국방 시계: ${mClock}</span>
          <span class="pct">${totalPct.toFixed(5)}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${totalPct}%"></div>
        </div>
      </div>
    </div>
    <div class="card-footer-info">
      <div class="info-item">
        <span class="info-label">입대일</span>
        <span class="info-val">${formatDate(cohort.enlistmentDate)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">전역일</span>
        <span class="info-val">${formatDate(cohort.dischargeDate)}</span>
      </div>
      <div class="info-item" style="grid-column: span 2; border-top: 1px solid rgba(255,255,255,0.03); padding-top: 0.5rem; margin-top: 0.25rem;">
        <span class="info-label">디데이 상세</span>
        <span class="info-val" style="color: var(--accent); display: flex; justify-content: space-between;">
          <span>전역: ${ddays.dischargeDday}</span>
          <span>${rankInfo.rank === '병장' ? '전역' : rankInfo.nextRank} 진급: ${ddays.nextRankDday}</span>
        </span>
      </div>
    </div>
  `;
}

// Start loop
setInterval(tick, 50);
tick();

// =============================
// Detail Modal Logic
// =============================
function openDetailModal(cohort: Cohort) {
  selectedCohort = cohort;
  detailOverlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
  updateDetailModal(cohort, new Date());
}

function closeDetailModal() {
  selectedCohort = null;
  detailOverlay.classList.remove('visible');
  document.body.style.overflow = '';
}

function updateDetailModal(cohort: Cohort, now: Date) {
  const rankInfo = getRankAndTimeline(cohort, now);
  const totalPct = calculateTotalPercentage(cohort, now);
  const rankPct = calculateRankPercentage(cohort, now);
  const ddays = getDdays(cohort, now);
  const mClock = getMilitaryClock(totalPct);
  const rankColorVar = getRankColorVar(rankInfo.rank);

  // Hero
  const dCohortNum = document.getElementById('d-cohort-number')!;
  dCohortNum.innerHTML = `${cohort.cohortNumber}<span>기</span>`;

  const dRankBadge = document.getElementById('d-rank-badge')!;
  dRankBadge.className = `rank-badge detail-rank-badge ${getRankBadgeClass(rankInfo.rank)}`;
  dRankBadge.textContent = rankInfo.rank;

  (document.getElementById('d-enlist-date')!).textContent = formatDate(cohort.enlistmentDate);
  (document.getElementById('d-discharge-date')!).textContent = formatDate(cohort.dischargeDate);

  // Calculate total duration in months
  const totalDays = Math.round((cohort.dischargeDate.getTime() - cohort.enlistmentDate.getTime()) / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  (document.getElementById('d-duration')!).textContent = `약 ${months}개월 ${days}일`;

  // Total bar
  const totalBarEl = document.getElementById('d-total-bar')! as HTMLDivElement;
  totalBarEl.style.width = `${totalPct}%`;
  (document.getElementById('d-total-pct')!).textContent = `${totalPct.toFixed(5)}%`;
  (document.getElementById('d-total-bar-start')!).textContent = formatDate(cohort.enlistmentDate);
  (document.getElementById('d-total-bar-end')!).textContent = formatDate(cohort.dischargeDate);

  // Rank bar
  const rankBarEl = document.getElementById('d-rank-bar')! as HTMLDivElement;
  const rankPctEl = document.getElementById('d-rank-pct')!;
  const rankBarLabelEl = document.getElementById('d-rank-bar-label')!;
  const rankBarStartEl = document.getElementById('d-rank-bar-start')!;
  const rankBarEndEl = document.getElementById('d-rank-bar-end')!;

  rankBarLabelEl.textContent = `${rankInfo.rank} 계급 복무율`;

  if (rankInfo.rank === '민간인') {
    rankBarEl.style.width = '0%';
    rankPctEl.textContent = '-';
    rankBarStartEl.textContent = '미입대';
    rankBarEndEl.textContent = formatDate(cohort.enlistmentDate);
    rankBarEl.style.background = `var(--civ-color)`;
    rankBarEl.style.boxShadow = 'none';
  } else if (rankInfo.rank === '예비역') {
    rankBarEl.style.width = '100%';
    rankPctEl.textContent = '100.00000%';
    rankBarStartEl.textContent = formatDate(cohort.dischargeDate);
    rankBarEndEl.textContent = '전역 완료';
    rankBarEl.style.background = `var(--dis-color)`;
    rankBarEl.style.boxShadow = `0 0 12px rgba(236,72,153,0.3)`;
  } else {
    rankBarEl.style.width = `${rankPct}%`;
    rankPctEl.textContent = `${rankPct.toFixed(5)}%`;
    rankBarStartEl.textContent = rankInfo.start ? formatDate(rankInfo.start) : '-';
    rankBarEndEl.textContent = rankInfo.end ? formatDate(rankInfo.end) : '-';
    rankBarEl.style.background = `var(--${rankColorVar})`;
    rankBarEl.style.boxShadow = `0 0 12px rgba(0,0,0,0.3)`;
  }

  // Stats
  (document.getElementById('d-clock')!).textContent = mClock;
  (document.getElementById('d-discharge-dday')!).textContent = ddays.dischargeDday;
  const nextDdayEl = document.getElementById('d-nextrank-dday')!;
  nextDdayEl.textContent = ddays.nextRankDday;
  (document.getElementById('d-nextrank-label')!).textContent = `→ ${rankInfo.nextRank}`;

  (document.getElementById('d-recruit-end')!).textContent = formatDate(cohort.pRecruitEnd);
  (document.getElementById('d-private-end')!).textContent = formatDate(cohort.pPrivateEnd);
  (document.getElementById('d-pfc-end')!).textContent = formatDate(cohort.pPfcEnd);

  // Timeline track
  const totalMs = cohort.dischargeDate.getTime() - cohort.enlistmentDate.getTime();
  const segments = [
    { label: '훈련병', end: cohort.pRecruitEnd, color: `var(--rec-color)` },
    { label: '이등병', end: cohort.pPrivateEnd, color: `var(--pvt-color)` },
    { label: '일병', end: cohort.pPfcEnd, color: `var(--pfc-color)` },
    { label: '상병', end: cohort.pCplEnd, color: `var(--cpl-color)` },
    { label: '병장', end: cohort.dischargeDate, color: `var(--sgt-color)` },
  ];

  const trackEl = document.getElementById('d-timeline-track')!;
  const labelsEl = document.getElementById('d-timeline-labels')!;
  trackEl.innerHTML = '';
  labelsEl.innerHTML = '';

  let prevMs = cohort.enlistmentDate.getTime();
  segments.forEach((seg, i) => {
    const segMs = seg.end.getTime() - prevMs;
    const segPct = (segMs / totalMs) * 100;
    const isActive = rankInfo.rank === seg.label;
    const isPast = cohort.enlistmentDate.getTime() > 0 &&
      now.getTime() > seg.end.getTime();

    const div = document.createElement('div');
    div.className = 'timeline-segment';
    div.style.flex = `${segPct}`;
    div.style.background = (isPast || isActive) ? seg.color : 'rgba(255,255,255,0.06)';
    div.style.opacity = isActive ? '1' : (isPast ? '0.55' : '0.25');
    if (i > 0) div.style.borderLeft = '1px solid rgba(0,0,0,0.3)';
    trackEl.appendChild(div);

    const labelDiv = document.createElement('div');
    labelDiv.className = 'timeline-label-item';
    labelDiv.innerHTML = `<span class="timeline-label-rank" style="color: ${isActive ? seg.color : 'var(--text-muted)'}; ${isActive ? 'font-size:0.75rem;' : ''}">${seg.label}</span><span>${segPct.toFixed(0)}%</span>`;
    labelsEl.appendChild(labelDiv);

    prevMs = seg.end.getTime();
  });
}

// 공지사항 회전 루프 (5초 간격)
let currentNoticeIndex = 0;
function rotateNotice() {
  const noticeTextEl = document.getElementById('notice-text');
  if (noticeTextEl) {
    // 서서히 사라지는 연출 (opacity 0)
    noticeTextEl.style.opacity = '0';
    setTimeout(() => {
      currentNoticeIndex = (currentNoticeIndex + 1) % NOTICES.length;
      noticeTextEl.textContent = NOTICES[currentNoticeIndex];
      // 서서히 나타나는 연출 (opacity 1)
      noticeTextEl.style.opacity = '1';
    }, 300);
  }
}
setInterval(rotateNotice, 5000);
