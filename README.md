# StreetLights

## Business Rules

Streetlights can be turned on/off as a single unit, which in turn will automatically switch the bulbs on the streetlight on/off. 
Bulbs can be turned on and off individually, but only when the streetlight is active
Total power consumption of a street light is to be monitored

Bulb heat is to be monitored

Bulbs generate heat, once a specific heat threshold is reached the bulb will switch off to prevent damage. While in overheat condition they cannot be turned back on. A bulb that has overheated will not automatically turn back on.
Faulty bulbs should be indicated as such and will not switch on.
Streetlights have a light sensor that will turn the streetlight (and all bulbs) on if the reading is less than 100 lumens (and off when the lumens increase past 100 Lumens).  To stop flickering sensors should only change the status after 30 seconds.

## Task 1 
1. Review the project and get a basic idea as to the architecture of the project.
2. A user monitoring the system wants to see the total power consumption per streetlight.

    1. This must take into account the power consumption of the streetlight (when ON) as well as any bulbs that are currently switched ON. 
    2. Only bulbs that are switched on should be included.

Tip: A computed observable will have to be created that will automatically update the HTML, only the following files need to be adjusted: index.cshtml (see the power draw place holder) and Scripts/Application/application-viewmodel.ts. Note: switching on a light takes a while – but it does work in the application already – to test the bulbs being on switch the light on and wait a few seconds.

## Task 2 
1.	A User monitoring the system should be able to quickly see which bulbs are on/off
    1. Change the colour of the Bulb to yellow if the bulb is on
    2. Change the colour of the Bulb to black if the bulb is off
    3. Change the colour of the bulb to red if there is a fault/ over heated
2.	A User monitoring the system should be able to easily see the temperature of the bulbs this will be indicated by  the temperature / max temperature values changing colour to draw attention:
    1. If the temperature is 0 the colour should be Light Grey (example)
    2. If the temperature is less than ½ max temperature the colour should be normal colour 
    3. If the temperature is ½ the max temperature the colour of temperature / max temperature should be Orange (example)
    4. If the bulb temperature exceeds the max temperature the font should be bold and the colour Red (example)

Tip: You should only need to edit the following files to complete this task: Index.cshtml and Site.css

## Task 3
1.	Turning on streetlights/bulbs takes time as the light server needs to contact the physical light. The user should see a loading indicator to show that the task is in progress
    1. The loading indicator should appear whenever an action will take time and should always disappear when that action is complete – even if an error occurs.

Tip: Any loading indicator is fine – a simple span element saying ‘Loading…’ when changes occurring is fine or you could create a more elaborate modal. Anything is fine.  You should only need to edit the following files to complete this task: Index.cshtml, Scripts/application/application-viewmodel.ts and Site.css

## Task 4
1.	The User would like to be able to implement the ability to switch a bulb on or off independently of the streetlight carrying it.  Implement a button that will do the following:
    1. Automatically toggle between on/off depending on the current bulb state (e.g. isOn)
    2. Switching the button should toggle the light on/off depending on the status
    3. Bulb can only be switched on if the Streetlight is on
    4. If there is a fault the bulb should not be able to be turned on, an error message should be displayed to indicate this or the button should be disabled until the fault is repaired.

Tip: Currently a button exists in the UI that is for this purpose but it does nothing.  You should only need to edit the following files to accomplish this task: Index.cshtml, Scripts/application/application-viewmodel.ts. You may be interested or wish to look at the following files for reference: Scripts/application/data-access-layer.ts, Scripts/application/models.ts. 

## Task 5
1.	Currently when a streetlight is switched on/off it switches on each bulb synchronously. This can take a long time when there are a lot of bulbs for a streetlight.
    1. Change the system to turn the streetlight bulbs on Asynchronously

Tip: You should only need to alter method SwitchOnLight and SwitchOffLight on StreetlightRepository.cs.

## Task 6
1.	In TestApplication.Tests.csproj you will find a series of unit tests under TemperatureBehaviourTests.cs. Several of these tests when run will currently fail as the behavior for whether a bulb can be switched on or not under test has not been added.  
    1. You will need to implement the behavior to make these tests pass. Your changes MUST be made in the StreetlightRepository. Do NOT make any changes to the tests.

## Task 7 – Optional Extension tasks
If you found the previous tasks easy you may want to try this task out.
1.	The user wishes to be able to simulate failure and also remove failure conditions from a bulb when a repair has been made. Add a button to the UI that will allow a fault-condition to be added to a bulb (or removed in the case when a bulb is in fault). This will be a toggle button.
    1. You will need to implement the ‘SetFault’ methods in the API controller and repository to update the bulb status with the failure code or to remove it.
    2. The button on each bulb in the UI will need to respond to the current state of the bulb, and be able to access the service setting the bulb state accordingly.

# Questions and correction

1. Task2. "If the temperature is ½ the max temperature the colour of temperature / max temperature should be Orange. If the bulb temperature exceeds the max temperature the font should be bold and the colour Red".

What color should be between 1/2 and max temperature? Solved with Orange color.

2. BulbData class (inside BuldState.cs) has a 'FaultCondition' field, which is passed in the post-query. However, the same class inside TypeScript - IBulbStatus interface (models.ts) - has similar field named 'fault'.

Correction: field 'fault' was renamed to 'faultCondition' 
