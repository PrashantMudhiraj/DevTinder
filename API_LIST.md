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

-   POST /request/send/interested/:userId
-   POST /request/send/ignored/:userId

    -   POST /request/send/:status/:userId

-   POST /request/review/accepted/:userId
-   POST /request/review/rejected/:userId
    -   POST /request/review/:status/:userId

##userRouter

-   GET /user/connections
-   GET /user/requests/received
-   GET /feed - get you all profiles of other users on platfrom

status : interested , ignored , accepted , rejected
