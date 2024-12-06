#DevTinde API's

##authRouter

-   POST /signup
-   POST /login
-   POST /logout

##profileRouter

-   GET /profile/view
-   PATCH /profile/edit
-   PATCH /profile/password

##connectionRequestRouter

-   POST /request/send/intrested/:userId
-   POST /request/send/ignored/:userId

    -   POST /request/send/:status/:userId

-   POST /request/review/accepted/:userId
-   POST /request/review/rejected/:userId
    -   POST /request/review/:status/:userId

##userRouter

-   GET /user/connections
-   GET /requests/received
-   GET /feed - get you all profiles of other users on platfrom

status : intrested , ignored , accpeted , rejected
