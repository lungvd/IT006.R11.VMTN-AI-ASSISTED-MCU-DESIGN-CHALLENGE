# MCU Peer Ranking – Google Apps Script Web App

## Architecture
- Google Sheets stores ballots, access codes, and summary data.
- Google Apps Script serves the web interface.
- Each team has an individual 8-character access code.
- Dashboard refreshes approximately every 10 seconds.
- Average Rank is primary (lower is better); Borda is the tie-breaker.

## Setup
1. Create a new Google Spreadsheet in your own Google Drive, for example `MCU Peer Ranking`.
2. In the spreadsheet, choose **Extensions > Apps Script**.
3. Replace the contents of `Code.gs` with the repository's `Code.gs`.
4. Add an HTML file named exactly `Index` and paste the repository's `Index.html`.
5. Select `setupOnce` in the Apps Script editor and click **Run**. Grant the requested Google permissions.
6. Return to the spreadsheet. Three sheets will be created: `Ballots`, `AccessCodes`, and `Summary`.
7. In `AccessCodes`, privately distribute the code in column B to its corresponding team. Do not share this sheet with students.
8. In Apps Script, choose **Deploy > New deployment > Web app**.
9. Set **Execute as: Me**.
10. Choose an access setting appropriate to your institution. **Anyone** is convenient for students outside your Workspace, but your Workspace administrator may restrict it.
11. Deploy, authorize, and copy the Web App URL for students.

## Operation
- All teams use the same Web App URL.
- Each team selects its group number and enters its private code.
- Rank all other nine teams from 1 to 9 and submit.
- A team may resubmit using the same code; the new ballot replaces the old one.
- Dashboard refreshes about every 10 seconds.
- The instructor can inspect data in the spreadsheet.
- To disable a team, uncheck its Active box in `AccessCodes`.

## Aggregation rules
- Average Rank = average rank received from submitted ballots.
- Borda = sum of (10 - rank) over received ballots.
- Sort by Average Rank ascending, then Borda descending.
- A group's overall rank is shown as official only after it has received all nine possible ballots. Before then, dashboard results are provisional.

## Security notes
- Each group code is shared within that group; send it privately.
- The Web App runs as the spreadsheet owner. Students do not need edit access to the spreadsheet.
- Dashboard shows aggregate results only, not individual ballots.
- If deployed to Anyone, anyone with the URL can view the dashboard; only a valid group code can submit a ballot.
- Apps Script quotas apply. For ten groups and 10-second polling, expected usage is modest.
- Running `setupOnce` again does not erase existing ballots or codes. Running `regenerateAccessCodes` invalidates all previously distributed codes.

## Important
Do not open `Index.html` directly from Drive and expect it to work. Deploy the Apps Script project as a Web App so the backend and Google Sheets integration are active.
