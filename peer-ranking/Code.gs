const APP = {
  title: 'MCU Design Challenge – Peer Ranking',
  folderId: '1_6g0C1-Ix27gKlM4glfpB3I-LLEeJQVc',
  spreadsheetName: 'MCU Peer Ranking – IT006.R11.VMTN',
  ballotSheet: 'Ballots',
  rosterSheet: 'AccessCodes',
  summarySheet: 'Summary',
  groupCount: 10,
  pollSeconds: 10
};

// Roster imported from the instructor-provided IT006.R11.VMTN student list.
const STUDENT_ROSTER = [["25520024","Phạm Hoàng Ân"],["25520091","Phạm Hùng Anh"],["25520226","Nguyễn Vũ Cường"],["25520239","Nguyễn Hải Đăng"],["25520271","Lê Tiến Đạt"],["25520295","Thân Vĩnh Đạt"],["25520297","Trịnh Quốc Đạt"],["25520332","Lê Trí Đức"],["25520437","Nguyễn Thái Duy"],["25520506","Nguyễn Đắc Anh Hào"],["25520594","Nguyễn Huy Hoàng"],["25520687","Hoàng Trần Gia Huy"],["25520764","Phạm Nguyễn Kha"],["25520888","Bùi Minh Khôi"],["25520909","Nguyễn Mậu Khôi"],["25520921","Vương Trọng Khôi"],["25521064","Lê Gia Lượng"],["25521135","Tôn Thất Nhật Minh"],["25521142","Vũ Hoàng Minh"],["25521145","Đỗ Trà My"],["25521156","Hoàng Lê Tuấn Nam"],["25521359","Lê Quốc Phát"],["25521360","Lê Thuận Phát"],["25521361","Lê Viết Phát"],["25521365","Nguyễn Hoàng Phát"],["25521403","Nguyễn Duy Phú"],["25521433","Phạm Đạt Gia Phúc"],["25521511","Văn Anh Quân"],["25521513","Võ Minh Quân"],["25521517","Lê Hải Quang"],["25521619","Nguyễn Đức Tài"],["25521622","Nguyễn Tấn Tài"],["25521661","Đỗ Duy Thái"],["25521672","Huỳnh Phạm Ngọc Thắng"],["25521678","Nguyễn Quốc Thắng"],["25521688","Tô Tú Thắng"],["25521717","Phạm Trung Thành"],["25521759","Dương Gia Thịnh"],["25521783","Tống Tuấn Thịnh"],["25521860","Trương Quang Tiến"],["25521885","Trần Thị Bảo Trâm"],["25521966","Nguyễn Tấn Trung"],["25521999","Nguyễn Ngọc Tú"],["25522000","Nguyễn Ngọc Tú"],["25522003","Phạm Năng Tú"],["25522015","Nguyễn Lê Gia Tuấn"],["25522021","Phạm Năng Tuấn"],["25522053","Nguyễn Văn Vạn"],["25522125","Tống Thị Kim Xuyến"],["25522140","Nguyễn Đình Bảo Khanh"]];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(APP.title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setupOnce() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty('MCU_SPREADSHEET_ID');
  let ss;
  if (spreadsheetId) {
    ss = SpreadsheetApp.openById(spreadsheetId);
  } else {
    ss = SpreadsheetApp.create(APP.spreadsheetName);
    DriveApp.getFileById(ss.getId()).moveTo(DriveApp.getFolderById(APP.folderId));
    spreadsheetId = ss.getId();
    props.setProperty('MCU_SPREADSHEET_ID', spreadsheetId);
  }

  let ballots = ss.getSheetByName(APP.ballotSheet);
  if (!ballots) ballots = ss.insertSheet(APP.ballotSheet);
  ballots.getRange(1, 1, 1, 15).setValues([[
    'Group', 'Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5',
    'Rank 6', 'Rank 7', 'Rank 8', 'Rank 9', 'Updated At',
    'Reason for Rank 1', 'Constructive Feedback', 'Representative Student ID', 'Representative Name'
  ]]);
  ballots.setFrozenRows(1);

  // Rebuild the whitelist from the official class roster. Preserve any existing group assignment.
  let rosterSheet = ss.getSheetByName(APP.rosterSheet);
  if (!rosterSheet) rosterSheet = ss.insertSheet(APP.rosterSheet);
  const oldAssignments = {};
  if (rosterSheet.getLastRow() > 1) {
    rosterSheet.getDataRange().getValues().slice(1).forEach(r => {
      if (r[0]) oldAssignments[String(r[0]).trim()] = r[2] || '';
    });
  }
  const rosterRows = STUDENT_ROSTER.map(([id, name]) => [id, name, oldAssignments[id] || '', true]);
  rosterSheet.clearContents();
  rosterSheet.getRange(1, 1, 1, 4).setValues([['Student ID (MSSV)', 'Student Name', 'Assigned Group', 'Active']]);
  rosterSheet.getRange(2, 1, rosterRows.length, 4).setValues(rosterRows);
  rosterSheet.getRange(2, 4, rosterRows.length, 1).insertCheckboxes();
  rosterSheet.setFrozenRows(1);

  let summary = ss.getSheetByName(APP.summarySheet);
  if (!summary) summary = ss.insertSheet(APP.summarySheet);
  summary.getRange(1, 1, 1, 6).setValues([[
    'Overall Rank', 'Group', 'Ballots Received', 'Average Rank', 'Borda Total', 'Status'
  ]]);
  summary.setFrozenRows(1);

  [ballots, rosterSheet, summary].forEach(sh => sh.autoResizeColumns(1, sh.getLastColumn()));
  SpreadsheetApp.flush();
  Logger.log('Setup complete. Spreadsheet: ' + ss.getUrl());
  Logger.log('Students enter their own Student ID (MSSV). Each ID can be assigned to one group only.');
  return { spreadsheetUrl: ss.getUrl(), message: 'Hệ thống đã được khởi tạo.' };
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('MCU_SPREADSHEET_ID');
  if (!id) throw new Error('Chưa khởi tạo hệ thống. Hãy chạy setupOnce() trong Apps Script.');
  return SpreadsheetApp.openById(id);
}

function getInitialData() {
  return { title: APP.title, groupCount: APP.groupCount, pollSeconds: APP.pollSeconds, dashboard: getDashboard() };
}

function submitRanking(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Dữ liệu gửi lên không hợp lệ.');
  const group = Number(payload.group);
  const studentId = String(payload.studentId || '').trim();
  const ranking = Array.isArray(payload.ranking) ? payload.ranking.map(Number) : [];
  const reason = String(payload.reason || '').trim();
  const feedback = String(payload.feedback || '').trim();

  if (!Number.isInteger(group) || group < 1 || group > APP.groupCount) throw new Error('Nhóm không hợp lệ.');
  if (!/^\\d{8}$/.test(studentId)) throw new Error('MSSV phải gồm đúng 8 chữ số.');
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
    const rosterSheet = ss.getSheetByName(APP.rosterSheet);
    const ballotSheet = ss.getSheetByName(APP.ballotSheet);
    if (!rosterSheet || !ballotSheet) throw new Error('Thiếu trang tính hệ thống. Hãy chạy setupOnce().');

    const rosterData = rosterSheet.getDataRange().getValues();
    const studentRowIndex = rosterData.findIndex((r, i) => i > 0 && String(r[0]).trim() === studentId);
    if (studentRowIndex < 1) throw new Error('MSSV không có trong danh sách lớp IT006.R11.VMTN.');
    const studentRow = rosterData[studentRowIndex];
    if (studentRow[3] !== true) throw new Error('MSSV này hiện không được phép gửi phiếu.');
    const assignedGroup = studentRow[2] === '' ? '' : Number(studentRow[2]);
    if (assignedGroup && assignedGroup !== group) {
      throw new Error('MSSV này đã được dùng để đại diện Nhóm ' + assignedGroup + ', không thể gửi phiếu cho nhóm khác.');
    }

    const all = ballotSheet.getDataRange().getValues();
    const rowIndex = all.findIndex((r, i) => i > 0 && Number(r[0]) === group);
    if (rowIndex >= 1) {
      const existingStudentId = String(all[rowIndex][13] || '').trim();
      if (existingStudentId && existingStudentId !== studentId) {
        throw new Error('Nhóm ' + group + ' đã có đại diện nộp phiếu bằng MSSV ' + existingStudentId + '. Hãy liên hệ giảng viên nếu cần đổi đại diện.');
      }
    }

    const studentName = String(studentRow[1] || '');
    const row = [group, ...ranking, new Date(), reason, feedback, studentId, studentName];
    if (rowIndex < 0) ballotSheet.appendRow(row);
    else ballotSheet.getRange(rowIndex + 1, 1, 1, row.length).setValues([row]);

    // Lock this student ID to the selected group after the first successful submission.
    rosterSheet.getRange(studentRowIndex + 1, 3).setValue(group);
    SpreadsheetApp.flush();
    return {
      ok: true,
      message: 'Đã lưu phiếu của Nhóm ' + group + ' (đại diện: ' + studentName + ', MSSV ' + studentId + '). Có thể cập nhật bằng chính MSSV này.',
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
