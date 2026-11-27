const APP = {
  title: 'MCU Design Challenge – Peer Ranking',
  folderId: '1_6g0C1-Ix27gKlM4glfpB3I-LLEeJQVc',
  spreadsheetName: 'MCU Peer Ranking – IT006.R11.VMTN',
  ballotSheet: 'Ballots',
  codeSheet: 'AccessCodes',
  summarySheet: 'Summary',
  groupCount: 10,
  pollSeconds: 10
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(APP.title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Run once from script.google.com after adding Code.gs and Index.html.
 * Creates the Google Spreadsheet in the instructor's designated Drive folder.
 */
function setupOnce() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty('MCU_SPREADSHEET_ID');
  let ss;

  if (spreadsheetId) {
    ss = SpreadsheetApp.openById(spreadsheetId);
  } else {
    ss = SpreadsheetApp.create(APP.spreadsheetName);
    const folder = DriveApp.getFolderById(APP.folderId);
    DriveApp.getFileById(ss.getId()).moveTo(folder);
    spreadsheetId = ss.getId();
    props.setProperty('MCU_SPREADSHEET_ID', spreadsheetId);
  }

  let ballots = ss.getSheetByName(APP.ballotSheet);
  if (!ballots) ballots = ss.insertSheet(APP.ballotSheet);
  ballots.getRange(1, 1, 1, 13).setValues([[
    'Group', 'Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5',
    'Rank 6', 'Rank 7', 'Rank 8', 'Rank 9', 'Updated At',
    'Reason for Rank 1', 'Constructive Feedback'
  ]]);
  ballots.setFrozenRows(1);

  let codes = ss.getSheetByName(APP.codeSheet);
  if (!codes) {
    codes = ss.insertSheet(APP.codeSheet);
    codes.getRange(1, 1, 1, 3).setValues([['Group', 'Access Code', 'Active']]);
    const rows = [];
    for (let i = 1; i <= APP.groupCount; i++) rows.push([i, makeCode_(), true]);
    codes.getRange(2, 1, rows.length, 3).setValues(rows);
    codes.getRange(2, 3, APP.groupCount, 1).insertCheckboxes();
    codes.setFrozenRows(1);
  }

  let summary = ss.getSheetByName(APP.summarySheet);
  if (!summary) summary = ss.insertSheet(APP.summarySheet);
  summary.getRange(1, 1, 1, 6).setValues([[
    'Overall Rank', 'Group', 'Ballots Received', 'Average Rank', 'Borda Total', 'Status'
  ]]);
  summary.setFrozenRows(1);

  [ballots, codes, summary].forEach(sh => sh.autoResizeColumns(1, sh.getLastColumn()));
  SpreadsheetApp.flush();
  Logger.log('Setup complete. Spreadsheet: ' + ss.getUrl());
  Logger.log('Privately distribute each group code from the AccessCodes sheet.');
  return { spreadsheetUrl: ss.getUrl(), message: 'Hệ thống đã được khởi tạo.' };
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('MCU_SPREADSHEET_ID');
  if (!id) throw new Error('Chưa khởi tạo hệ thống. Hãy chạy setupOnce() trong Apps Script.');
  return SpreadsheetApp.openById(id);
}

function makeCode_() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function getInitialData() {
  return { title: APP.title, groupCount: APP.groupCount, pollSeconds: APP.pollSeconds, dashboard: getDashboard() };
}

function submitRanking(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Dữ liệu gửi lên không hợp lệ.');
  const group = Number(payload.group);
  const code = String(payload.code || '').trim().toUpperCase();
  const ranking = Array.isArray(payload.ranking) ? payload.ranking.map(Number) : [];
  const reason = String(payload.reason || '').trim();
  const feedback = String(payload.feedback || '').trim();

  if (!Number.isInteger(group) || group < 1 || group > APP.groupCount) throw new Error('Nhóm không hợp lệ.');
  if (ranking.length !== APP.groupCount - 1) throw new Error('Phải xếp hạng đủ 9 nhóm.');
  const expected = Array.from({ length: APP.groupCount }, (_, i) => i + 1).filter(n => n !== group);
  if (ranking.some(n => !Number.isInteger(n) || !expected.includes(n)) || new Set(ranking).size !== APP.groupCount - 1) {
    throw new Error('Mỗi nhóm khác phải xuất hiện đúng một lần; không được chọn nhóm mình.');
  }
  if (reason.length < 10 || reason.length > 1000) throw new Error('Lý do chọn nhóm hạng 1 phải từ 10 đến 1.000 ký tự.');
  if (feedback.length < 10 || feedback.length > 1000) throw new Error('Góp ý xây dựng phải từ 10 đến 1.000 ký tự.');

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ss = getSpreadsheet_();
    const codeSheet = ss.getSheetByName(APP.codeSheet);
    const ballotSheet = ss.getSheetByName(APP.ballotSheet);
    if (!codeSheet || !ballotSheet) throw new Error('Thiếu trang tính hệ thống. Hãy chạy setupOnce().');
    const codeRows = codeSheet.getRange(2, 1, APP.groupCount, 3).getValues();
    const match = codeRows.find(r => Number(r[0]) === group);
    if (!match || String(match[1]).toUpperCase() !== code || match[2] !== true) {
      throw new Error('Mã truy cập không đúng hoặc nhóm đã bị khóa.');
    }

    const all = ballotSheet.getDataRange().getValues();
    const rowIndex = all.findIndex((r, i) => i > 0 && Number(r[0]) === group);
    const row = [group, ...ranking, new Date(), reason, feedback];
    if (rowIndex < 0) ballotSheet.appendRow(row);
    else ballotSheet.getRange(rowIndex + 1, 1, 1, row.length).setValues([row]);
    SpreadsheetApp.flush();
    return {
      ok: true,
      message: 'Đã lưu phiếu xếp hạng của Nhóm ' + group + '. Nhóm có thể cập nhật phiếu bằng chính mã truy cập này.',
      dashboard: getDashboard()
    };
  } finally {
    lock.releaseLock();
  }
}

function getDashboard() {
  const ss = getSpreadsheet_();
  const sh = ss.getSheetByName(APP.ballotSheet);
  const submitted = {};
  if (sh && sh.getLastRow() > 1) {
    const rows = sh.getRange(2, 1, sh.getLastRow() - 1, 10).getValues();
    rows.forEach(r => {
      const g = Number(r[0]);
      if (g >= 1 && g <= APP.groupCount) submitted[g] = r.slice(1, 10).map(Number);
    });
  }

  const stats = [];
  for (let target = 1; target <= APP.groupCount; target++) {
    const ranks = [];
    for (let evaluator = 1; evaluator <= APP.groupCount; evaluator++) {
      if (evaluator === target || !submitted[evaluator]) continue;
      const rank = submitted[evaluator].indexOf(target);
      if (rank >= 0) ranks.push(rank + 1);
    }
    const average = ranks.length ? ranks.reduce((a, b) => a + b, 0) / ranks.length : null;
    const borda = ranks.reduce((sum, rank) => sum + (10 - rank), 0);
    stats.push({ group: target, count: ranks.length, average: average, borda: borda });
  }

  stats.sort((a, b) => {
    if (a.average === null && b.average !== null) return 1;
    if (b.average === null && a.average !== null) return -1;
    if (a.average !== b.average) return a.average - b.average;
    return b.borda - a.borda || a.group - b.group;
  });
  stats.forEach((s, i) => { s.overallRank = s.count === APP.groupCount - 1 ? i + 1 : null; });
  return { submittedCount: Object.keys(submitted).length, groups: stats, updatedAt: new Date().toISOString() };
}

/** Optional: invalidates all previously distributed codes. */
function regenerateAccessCodes() {
  const ss = getSpreadsheet_();
  const sh = ss.getSheetByName(APP.codeSheet);
  if (!sh) throw new Error('Run setupOnce() first.');
  const rows = [];
  for (let i = 1; i <= APP.groupCount; i++) rows.push([i, makeCode_(), true]);
  sh.getRange(2, 1, APP.groupCount, 3).setValues(rows);
  SpreadsheetApp.flush();
}
