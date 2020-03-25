
# Keyboard navigation for dropdowns

In order to allow users to navigate the application properly, we need to determine what interactions cause which behavior in our application. Many of the keyboard navigation methods for these inputs are contextual too:

## When the input is focused, dropdown collapsed
In this case we distinguish whether the input is in a valid or invalid state.

### Invalid state
In this case the input does not have items for the dropdown to populate or is empty, but the content is not yet a record that can be submitted.

* Enter: highlight the selection as invalid.
* Tab: highlight the selection as invalid. Jump to the next input
* Escape: nothing
* Arrow up: nothing
* Arrow down: open the standard options

### Valid state
The content is valid and can be submitted to the server to be operated on

* Enter:  jump to the next item in our form input. This may need to be explicitely declared, since our input may not be part of the tabindex procedure.
* Tab:  jump to the next item in our form input. This may need to be explicitely declared, since our input may not be part of the tabindex procedure.
* Escape: nothing.
* Arrow up: nothing
* Arrow down: 

## When the input is focused, dropdown open


* Enter: select the current option. Collapse the dropdown
* Tab: select the current option. Collapse the dropdown
* Escape: collapse the dropdown. Mark the input as invalid.
* Arrow up: select the previous item in the dropdown. Suggest it in the shadow input
* Arrow down: select the next item on the list, suggest it in the shadow input.

## Generic text input
When the user just presses any key that modifies the content of the input it should:

* Reload the list of available options
* Open the dropdown
* Highlight the first item, suggest it via Shadow input
* If the input continues the pattern suggested by the shadow input, shorten it by 1 character, otherwise empty it until data is available.

If the result does not match the searched content, the API should return the search term it did find a match for.

# Focus
When the input receives focus, the application should:

* Load the available suggestions
* Open the dropdown
* Highlight the first item, place it in shadow input

# Clicking on an item in the dropdown

* Collapse the dropdown
* Confirm the currently selected input
* Empty the shadow