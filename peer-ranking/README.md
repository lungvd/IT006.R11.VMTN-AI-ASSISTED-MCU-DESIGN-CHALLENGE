# MCU Peer Ranking – Google Apps Script Web App

## What it does
- One shared Web App URL for all 10 teams.
- Each team has an individual 8-character access code.
- Each team ranks the other nine teams from 1 to 9, without ties.
- Each ballot must include a reason for the team ranked #1 and constructive feedback.
- A team can update its ballot; the latest submission replaces its previous ballot.
- Dashboard refreshes approximately every 10 seconds.
- Average Rank is primary (lower is better); Borda is the tie-breaker.

## One-time setup (standalone Apps Script)
The instructor does not need to create a spreadsheet manually. The setup script creates it in the Google Drive folder previously designated for this course.

1. Open [Google Apps Script](https://script.google.com/) while signed in to the Google account that owns or can edit the designated Drive folder.
2. Click **New project**.
3. Open the default `Code.gs`, replace its contents with the repository file `peer-ranking/Code.gs`.
4. Click **+ > HTML**, name the file exactly `Index`, and paste the contents of `peer-ranking/Index.html`.
5. Select the function `setupOnce` and click **Run**.
6. Review and grant the requested Google permissions. This lets the script create and manage the spreadsheet in the designated folder.
7. In the execution log, open the spreadsheet URL. The spreadsheet contains `Ballots`, `AccessCodes`, and `Summary`.
8. Privately send each group only its own access code from column B of `AccessCodes`. Do not share the spreadsheet or the access-code sheet with students.

If Google reports that the folder cannot be found or accessed, verify that the signed-in account has access to the designated folder. Do not send passwords or verification codes to anyone.

## Deploy the Web App
1. In Apps Script, choose **Deploy > New deployment**.
2. Select type **Web app**.
3. Set **Execute as: Me**.
4. Choose an access setting allowed by your institution. **Anyone** is convenient for students outside your Workspace, but an administrator may restrict it.
5. Click **Deploy**, complete authorization if requested, and copy the Web App URL for students.

Students do not need edit access to the spreadsheet. If the script is changed after deployment, use **Deploy > Manage deployments > Edit** and deploy a new version.

## Instructor operation
- All teams use the same Web App URL.
- A team selects its group number and enters its private code.
- Each team ranks all other nine teams and provides both required written comments.
- The instructor can inspect ballots and comments in the private spreadsheet.
- Dashboard displays aggregate results only, not individual ballots.
- To disable a team, uncheck its `Active` box in `AccessCodes`.
- To invalidate all old codes, run `regenerateAccessCodes` and distribute the new codes privately.

## Aggregation
- Average Rank = average rank received from submitted ballots.
- Borda = sum of (10 - rank) over received ballots.
- Sort by Average Rank ascending, then Borda descending.
- A group's overall rank is shown as official only after it has received all nine possible ballots. Before then, results are provisional.

## Security and limitations
- The Web App runs as the instructor. Students do not need spreadsheet edit access.
- Each group code is shared within that group; distribute it privately.
- If deployed to Anyone, anyone with the URL can view the aggregate dashboard; only a valid group code can submit or update a ballot.
- The script stores individual rankings and written feedback in the instructor's spreadsheet.
- Apps Script quotas apply. For ten groups and periodic polling, expected usage is modest.
