# MCU Peer Ranking – Google Apps Script Web App

## What it does
- One shared Web App URL for all 10 teams.
- Student representatives authenticate with their own 8-digit Student ID (MSSV).
- Only the 50 Student IDs in the instructor-provided IT006.R11.VMTN roster are accepted.
- A Student ID is bound to one group after its first successful submission. The same ID can update that group's ballot, but cannot submit for another group.
- Each team ranks the other nine teams from 1 to 9, without ties.
- Each ballot must include a reason for the team ranked #1 and constructive feedback.
- Average Rank is primary (lower is better); Borda is the tie-breaker.

## One-time setup (standalone Apps Script)
1. Open [Google Apps Script](https://script.google.com/) and sign in to the Google account that can access the designated Drive folder.
2. Open the existing Apps Script project used for the deployed Web App.
3. Replace `Code.gs` with the latest repository version. Keep the HTML file named exactly `Index`, and replace its contents with the latest `peer-ranking/Index.html`.
4. Save both files.
5. Select `setupOnce` and click **Run**. Grant Google permissions if prompted.
6. Open the spreadsheet URL shown in the execution log. The `AccessCodes` sheet now contains the official roster: Student ID, Student Name, Assigned Group, Active.
7. Confirm that there are 50 student rows. The instructor may uncheck `Active` to block a student ID.
8. Students do not need access to the spreadsheet.

**Important when updating an existing installation:** running `setupOnce` rebuilds the `AccessCodes` sheet from the embedded class roster. It preserves existing Student ID-to-Group assignments if they already exist. It does not erase submitted ballots. The old 8-character group codes are no longer used.

## Deploy the updated Web App
1. In Apps Script, choose **Deploy > Manage deployments**.
2. Select the existing Web App deployment and click the pencil (**Edit**).
3. Under Version, choose **New version**, then click **Deploy**.
4. Keep the existing deployment URL if possible; the URL ending in `/exec` should continue to work.

If the deployment is restricted by your institution, choose an access setting permitted by the Workspace administrator. Students do not need edit access to the spreadsheet.

## Student procedure
1. Open the Web App URL.
2. Select their group number.
3. Enter the representative's own 8-digit MSSV from the class roster.
4. Rank all other nine groups and complete both required written comments.
5. Submit. The same representative can submit again to update that group's ballot.

The first successful submission binds that MSSV to the selected group. If the group needs to change its representative, the instructor should clear that student's `Assigned Group` cell in `AccessCodes` and update the representative Student ID in the group's `Ballots` row before the new representative submits.

## Aggregation
- Average Rank = average rank received from submitted ballots.
- Borda = sum of (10 - rank) over received ballots.
- Sort by Average Rank ascending, then Borda descending.
- A group's overall rank is shown as official only after it has received all nine possible ballots. Before then, results are provisional.

## Security and limitations
- The server validates MSSV against the official class roster; the roster is not sent to the browser.
- A valid MSSV can be used for only one group.
- The instructor's spreadsheet stores ballots, comments, representative MSSV and representative name.
- If deployed to Anyone, anyone with the URL can view the aggregate dashboard; only an active roster MSSV can submit or update a ballot.
