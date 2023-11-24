Simple external Particpant Policy Server that uses VMR service tags and IDP parametes to allow or refuse entry to the VMR.

Service tags are first deliminated by underscore '_' to produce two variables i.e.:
"department_Airforce" is seperted into two variables:
Var1: department
Var2: Airforce

Then these are processed:
1. Var1 is tested againt a list of IDP attributes (claims configure on Inifnity & IDP), if there is a match then only participants with that IDP parameter matching Var2 will be allowed into VMR. In the above example only participants with IDP claim 'department' matching 'Airforce' wll be allowed into the VMR.
Other examples of VMR tags:
"jobtitle_Sergeant": Only participants with rank of sergeant (jobtitle) are allow into the VMR
"givenname_Jon": Only participants called Jon will be allowed into VMR - not real life but shows how different IDP claims can be used

2. If Var1 is "rank" then paticipants rank (jobtitle) is checked in a list named by Var2, currently there are two lists 'co' for Commisioned Offices and 'top' for top rank only. If the participant does not have the required rank (jobtitle) they are refused entry to VMR.

3. Any other calls, i.e.: no service tag, are allowed to continue to prevent failures in demo enviroment. In production this would likely be set to reject call.


Current list entries:
IDP attributes: ["department", "jobtitle", "givenname", "surname"]

CO Rank: 
["Air Chief Marshal",
    "Squadron Leader",
    "Captain",
    "General",
    "Captain",
    "Admiral"
]

Top Rank:
["Air Chief Marshal",
    "General",
    "Admiral"
]


