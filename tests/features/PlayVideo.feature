Feature: Video Player

    Scenario: Play the video
        Given the browser is open
        When open the page
        And play the video player
        Then the video player is playing


    Scenario: Show the advert
        Given the browser is open
        When open the page
        And play the video player
        When the video is in 4 seconds
        Then the advert will show
        When the video is in 64 seconds
        Then the advert will hide