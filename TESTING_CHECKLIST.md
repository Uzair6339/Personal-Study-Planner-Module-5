# Module 5 — Manual Testing Checklist

Run these checks in the browser and mark each item only after it passes.

## Subjects
- [ ] Add a subject with a name, code, color and notes.
- [ ] Try submitting an empty subject name; browser validation should prevent submission.
- [ ] View, edit and delete a subject.
- [ ] Rename a subject and confirm linked tasks show the new name.
- [ ] Delete a subject with linked tasks and confirm the app asks before removing the subject and its tasks.

## Study tasks
- [ ] Try adding a task before creating a subject; the app should show a helpful message.
- [ ] Add tasks for multiple subjects with different deadlines.
- [ ] Confirm blank task title, subject or deadline is rejected.
- [ ] Edit a task and change its deadline/status.
- [ ] Mark tasks completed and pending.
- [ ] Delete a task after confirming the prompt.
- [ ] Test All, Pending and Completed views.

## Dashboard and smart priorities
- [ ] Confirm total, pending and completed counts match the tasks you created.
- [ ] Confirm progress percentages and charts update when task status changes.
- [ ] Confirm subjects with more pending work appear higher in priority recommendations.
- [ ] Search by task title and subject name.
- [ ] Test each status filter and subject filter.
- [ ] Confirm upcoming deadlines list pending tasks due today or in the next seven days.

## Persistence and accessibility
- [ ] Refresh the page and confirm subjects/tasks remain saved.
- [ ] Navigate using keyboard Tab/Shift+Tab and confirm visible focus.
- [ ] Use the skip-to-main-content link.
- [ ] Confirm each form input has a readable label.
- [ ] Check that reduced-motion preference is respected where supported.

## Responsive and browser checks
- [ ] Test at a desktop width (e.g. 1366 px).
- [ ] Test at a tablet width (e.g. 768 px).
- [ ] Test at a mobile width (e.g. 375 px); confirm no page-level horizontal overflow.
- [ ] Test the app in current Chrome and one other browser (Edge or Firefox).
- [ ] Test the deployed GitHub Pages URL, not only the local version.

## Evidence to capture
- [ ] Dashboard overview with summary cards.
- [ ] Subjects and study tasks.
- [ ] Progress chart/subject progress.
- [ ] Smart priorities and upcoming deadlines.
- [ ] Mobile responsive view.
- [ ] Required-field validation message.
