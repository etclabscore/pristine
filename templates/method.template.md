<% const makeRow = (param) => { %>
| <%= param.name %> | <%= param.summary %> | <%= param.description %> | <%= param.required || false %> | <%= param.deprecated || false  %> |
<% }%>

What do we want to document


## <%= method.name %>

<%= method.description %>

| Name | Summary | Description | Required | Deprecated |
| ---- | ------- | ----------- | -------- | ---------- |<% if (method.parameters instanceof Array) { _.each(method.parameters, makeRow); } else { makeRow(method.parameters) } %>
