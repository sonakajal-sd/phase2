# Day 23 – Accessible issue form

A create/edit issue form with validation, an error summary, a saving state and a confirmation before discarding changes.

## Run it

```bash
npm install
npm run dev     # start the app
npm test        # run validation tests (Node's built-in test runner)
npm run build   # type-check and build
```

## Where things live

Each file has one job. Start reading from `App.tsx`.

```
src/
├── App.tsx                      Switches between the issue list and the form
├── types/issue.ts               Issue, IssueFormValues, FormErrors types
├── constants/issueOptions.ts    Options for projects, assignees, priority, status, labels
├── services/issueApi.ts         Fake "save" call (waits 800ms)
├── utils/
│   ├── validation.ts            Pure validation rules + error messages
│   └── issueFormHelpers.ts      Empty values, unsaved-change check, label toggle
├── hooks/
│   ├── useIssueForm.ts          All form logic: values, errors, submit, cancel
│   └── useUnsavedChangesWarning.ts  Warn before closing the tab with unsaved changes
└── components/
    ├── IssueForm.tsx            The form layout (no logic)
    ├── IssueList.tsx            The list of saved issues
    └── form/                    Reusable pieces
        ├── TextField.tsx        <input> + label + hint + error
        ├── TextAreaField.tsx    <textarea> + label + hint + error
        ├── SelectField.tsx      <select> + label + hint + error
        ├── CheckboxGroup.tsx    <fieldset> of checkboxes
        ├── FieldLabel.tsx       Label with "(required)" / "(optional)"
        ├── FieldMessages.tsx    Hint and error text under a field
        ├── fieldIds.ts          Builds ids for aria-describedby
        ├── ErrorSummary.tsx     List of errors at the top, linking to each field
        └── FormActions.tsx      Submit and Cancel buttons
tests/validation.test.ts         Tests for the validation helpers
```

## How validation works

| When | What happens |
| --- | --- |
| You leave a field (blur) | That field is checked and its error is shown. |
| You type in a field with an error | It is checked again, so the error goes away once it's fixed. |
| You submit | Every field is checked. If any fails, the error summary appears and gets focus. Nothing is saved. |

Rules: title is required (3–100 characters), project is required, description is 500 characters max, and the due date can't be in the past.

## Accessibility checklist

- Every input has a `<label>`, and the checkboxes are grouped in a `<fieldset>` with a `<legend>`.
- Errors are linked to their input with `aria-describedby`, and invalid inputs get `aria-invalid="true"`.
- Each link in the error summary moves focus to the field that needs fixing.
- The success message uses `role="status"`, so screen readers announce it.
- Native browser popups are turned off (`noValidate`), so the same messages show for everyone.

## Keyboard test

1. Press `Tab` through the form. Each field shows a visible focus ring.
2. Press `Enter` on an empty form. Focus moves to the error summary.
3. `Tab` to an error link and press `Enter`. Focus moves to that field.
4. Use `Space` to tick a label checkbox.
5. Change a field, then press Cancel. You are asked to confirm.
