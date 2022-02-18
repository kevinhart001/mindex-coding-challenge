# Post-Challenge Readme

I wanted to take an opportunity to provide some insight into my thought processes on various decisions I made along the way in coding this challenge.

## Direct Report Component

I initially created a DirectReportList component as well as a DirectReport component. This seemed a bit too much overhead for the example and tasks to be completed, so I decided to leave DirectReport but removed the DirectReportList. It seemed to still make sense to encapsulate some of the behavior of the direct report in its own component.

Also wanted to note the decision to use the async pipe in this component to show the loaded employee. That way, I don't need to write code to unsubscribe from the observable. Other calls, e.g. to `subscribe()` on observables in the system are from HTTP calls which, based on my understanding, are automatically unsubscribed from. Technically, the observable in the DirectReport component is from an HTTP call as well but we can write the component and its template to be agnostic of that.

## Edit/Remove Direct Report Behavior

I ended up deciding to re-populate the EmployeeList component's employee data after making either a compensation edit, or a removal of an employee. If this were a larger data set or other concerns (e.g., performance) with that approach, then a better approach would be to just keep the edits made in the components without refreshing from the backend.

The problem with that, though, with the removal of an employee, is that the EmployeeService does not remove the employee from any direct reports lists. I ended up making multiple calls for removing an employee, then: one to remove the employee itself, and one to remove the employee from the supervisor's list. Other than requiring multiple calls, this approach also fails to consider if any other supervisors also have the removed employee as their direct report. Ideally, the backend would handle the business logic of keeping the integrity of the direct report lists up-to-date as employees are removed.

## Ramda

I introduced [Ramda](https://ramdajs.com/) into the project for some utility functions. I really like its data-last, functional programming-minded API. It offers an expressive and elegant way to deal with data transformations.

## Styling

I did a little bit of some styling with the employee cards and direct reports list. I gave some thought to the dialog buttons -- putting them on the right of the dialog with a flat/primary action on the right and the basic cancel on the left, as well as styling the destructive "Delete" with the "warn" color. I didn't go absolutely crazy with other parts (tried to stay within the spirit of the challenge time amount suggestion); I kept the Angular Material elements at their base styling.