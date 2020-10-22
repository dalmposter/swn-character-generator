Game object data:
    - Information about game objects could be hard coded into the react app
        - Faster due to less requests
        - Once the page is loaded, the app could be used offline
    - This info could be stored in a database and fetched via the web server
        - Allows storage and sharing of user created objects
        - Third party apps can request this information
        - Easier for anyone to customise the default app behaviour if running their own server
    
    - Decided to use a database so that users can store their own objects, and these can be shared within the app.