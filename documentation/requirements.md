**Project:** Make a character creation tool for the Stars Without Number RPG

**Objectives:**
- Host a webapp allowing users to interactively create characters for Stars Without Number
- Users can persist their characters in a database along with custom objects and data about their profile
- Anyone can make requests to the webserver for information about game objects, allowing anyone, or application, access to this
- The webapp is accessible on and designed for mobile
- A script can be used to parse CSV files for data to be put into the game objects database
	- Able to add to established tables
	- If given headings, can create new tables with the data
	
**Requirements:**
- Webapp
    - Can output character sheets as a spreadsheet, for printing, or as a JSON file
    - A complete beginner should be able to create a character, though they may not understand the full impact of all their choices
	- The tool enforces all character creation rules outlined in the SWN core rulebook
		- However, users are also able to add arbitrary amounts of all resources, from 'custom' sources. This enables house rules and other customization
	- There are multiple modes which change the rules slightly and may have different UI:
		- Traditional - Guides the user, strictly follows the character creation rules one by one, including the order of execution
		- Choice Optimized - Guides the user but allows jumping forward/backward. Mostly follows the rules, but optionally replaces some random outcomes with choices
		- Advanced - Unguided, the user can fill in the sheet in whatever order they please
	- An additional Custom operation mode will allow users to change the rules of character creation and levelling
		- The settings for this mode can be imported and exported from/to JSON
	- Able to undo actions 1 at a time for all actions taken
		- Can re-do all undone actions 1 at a time, provided no new actions have been taken since
    - A random character feature generates a randomised character within 5 seconds
	- Users can add custom game objects to a database. They can make public groups of these objects to share them with others
		- Publicly shared custom game objects can be copied to a user's own collection
		- Custom objects can be imported and exported via JSON
    - A simple wiki section lets users search game objects, including custom ones
    - It can fulfil such searches in a few seconds for the first page, and up to 1 second per page where more are needed
	- The wiki can be accessed while generating a character, maybe as some sort of modal
	- Performs other small but useful tasks such as rolling n m-sided die
	- A special mobile version of the webapp is served to mobile devices which is optimized for viewing and using on a small screen:
		- Capable of running on a phone with 2GB of RAM
		- No visual lag or loading delay of more than a few seconds
		- Smallest achievable size of content sent over the intenet to minimize mobile data usage
- REST API
	- The server implements a REST API, allowing clients to query the database and perform operations on the signed in user's custom objects
    - The web server responds to unauthorised requests for data about non-custom game objects including:
		- Getting all game objects of each category, or individually by ID
		- Filtering categories of game objects by property
		- Allowed to request for fields to be expanded, including associated objects by following foreign keys and returning linked object
	
**game object = some entity in Stars Without Number, such as a skill or weapon*