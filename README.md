# Pennylane FE test

This repository contains the guidelines for the frontend interview question, as well as a repository skeleton with which to start.

## Notes (Ricardo)

I've implemented the listing, creating a new invoice, editing an invoice, and deleting an invoice. The editor mode allows to remove and add new lines, as well as change the customer, date, and finalized and paid statuses.

I took a bit longer than the suggested 4 hours, probably 5-6 total. Couldn't help to work on the layout a bit as it's hard to think about UX on a disorganized page. Also had some issues with TS and outdated modules in the repo (not sure if this is intentional or not). I could probably continue for another four hours improving interaction details, the lack of feedback on some actions, error states, and so on...

The two advanced features I added as a POC:

### Search

Added a search feature to the invoice listing. I found the `search_any` operator in the backend code, but it seems to only search on customer names. Using a
relation like `customer.address` doesn't seem to work. It also seems to only support AND queries which limits flexibility. With the current API, a toggle to switch
the search field (invoice #, customer name, etc) could be easily implemente, but ideally there would be full text search on all fields, a date range selector for both the date and deadline fields, and maybe custom filters like 'past deadline / unpaid'.

### Batch edit mode

I added the initial UI as a proof of concept, but the actions are not implemented. This allows the user to change the status of multiple invoices at once, maybe select them for export or other batch actions. Clicking through to invoice details is disabled until the user exits this mode.

## Problem statement

> ***Implement an invoice editor with React***

## Objectives

The goal is to use the provided API to build the prototype of an invoice editor.
This prototype will contain pages to list, create, edit, delete and finalize invoices.

We will pay attention to code quality and user experience. We will NOT pay attention to UI.
We expect you to identify two advanced features which could be useful for an invoice editor. For each feature, we ask for:

- an explanation of when this feature could be useful
- a prototype implementation (feel free to work around API limitations)
- your thoughts for a better / more robust implementation

## Deliverable

- source code on a private GitHub repository (please invite @quentindemetz @tdeo @rpechayr @soyoh @alex-min @karineHbt @Juleffel @jfpimentel @lucasbonin)
- the application deployed using your favorite solution (vercel, netlify, heroku, personal server, etc.)
- please submit links to the above [via this form](https://forms.gle/siH7Rezuq2V1mUJGA)

You MUST use:

- bootstrap as UI library
- [react-bootstrap](https://react-bootstrap.github.io/) for bootstrap's javascript components to avoid using jquery

You must NOT use:

- a state management library (e.g. Redux)

## Data model

The prototype will interact with 4 entities:

- `customers`: the list of customers,
- `products`: the list of available products,
- `invoices`: the list of existing invoices,
  - point of attention, once the `finalized` field is set to `true`, no field may be modified except for `paid`.
- `invoice_lines`: the lines of an invoice.

## API

The API is available at this URL: https://jean-test-api.herokuapp.com/. To use it, you
must send the authorization token.

The openAPI documentation is available [here](https://jean-test-api.herokuapp.com/api-docs/index.html)

Point of attention :

- invoice lines are accessed via their invoice. To update them, use the relevant invoice API methods, as described in the Invoice API documentation

### API client

The repository includes an Axios client.

Before using it, please add the token you received in `/src/app/index.tsx`.
If you do not have one, please contact us.

```jsx
ReactDOM.render(
  ...
  <ApiProvider
    url="https://jean-test-api.herokuapp.com/"
    token="" // set your api token here
  >
    <App />
  </ApiProvider>
  ...
);
```

Use the api client as follow

```jsx
import * as React from 'react;
import { useApi } from "api";

const FooComponent = () => {
  const api = useApi();

  React.useEffect(() => {
    const fetch = async () => {
      const res = await api.getInvoices();
    }

    fetch();
  })

  return <div>bar</div>;
}
```

## Repository contents

This repository has been initialized with [create-react-app](https://github.com/facebook/create-react-app). It is to be used as a starting point for developing the prototype.

A set of packages has been included in [package.json](./package.json), please feel free to use them. Their usage is optional; you are not expected to learn any new libraries for this test.

As much as possible, please avoid introducing new dependencies - if you find this necessary, please explain why.

You'll find the `InvoicesList` component already started in the `components` folder.

If you prefer to use JavaScript without typing, you can execute the command `yarn eject_ts`
