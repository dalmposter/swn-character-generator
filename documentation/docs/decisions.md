Game object data:
    Info about game objects, such as skills and items,must be stored somewhere so it can be used in the app
    - Information about game objects could be hard coded into the react app
        - Faster due to less requests
        - Once the page is loaded, the app could be used offline
    - This info could be stored in a database and fetched via the web server
        - Allows use, storage, sharing of user created objects
        - Third party apps can request this information
        - Easier for anyone to customise the default app behaviour if running their own server
    
    - Decided to use a database so that users can store their own objects, and these can be shared within the app.

Distributing object data to components in react.js client:
    Data about game objects must be accessible by a lot of components, most notably many many avatars rendering those objects to the user. These components may be nested in several layers of components.
    - Pass the data as props down the layers of components
        - Easy to understand when reading and writing the code
        - Doesn't actually use more memory unless the values are primitives, but game objects are not
        - May need to add unused props to intermediate components
    - Have avatars fetch the data themselves via the api
        - Can pass simply an ID around to refer to game objects. No other data needed.
        - Would result in a lot of API calls unless properly batched
            - Even then, it may not be possible to fully remove this penalty without using one of the other techniques as well
    - Use react context
        Data can be made available (almost like a global variable) to a tree of components
        - Can make the code harder to read, may be unclear where data is coming from

    - Decided to use react context. Didn't want the penalty of loads of API calls, nor to add a lot of props to all components. It's also a good learning experience.
    Consequently, almost all the data is handled by the main Scg component, and children
    simply render based on the provided context