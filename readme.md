# Short description

What's the problem?
The main problem the world is facing what after lockdown ?.The world leaders are planning 
now how we can handle this situation. It is serious matter of concern that we should 
take proper decisions at the right time, the wrong decisions may cause us the life of people.
We have built a network spread model which would help to predict the condition or number of 
cases rise in the city under various scenarios. Another we have created map for the city of Ahmedabad 
which would helps to know which are the prime hotspots and travelling through which roads or junctions 
have high risk of infection.


The detailed description and thought process behind the network map of city and network spread modelling  is as follows

# INTRODUCTION
The critical Lifeline Infrastructure sector in India includes Telecommunications, Transportation: Roads, Railways, Water services, Electrical Power systems, and much more, each lacking digitization in its own ways. There has been previous work in the institute related to Railway Networks of India [1], which was a key motivation to work on the digitization of Road Networks.
Network science is a tool that can be used to model, study, and analyze complex connected networks such as Social Networks and Large-Scale Critical Lifeline Infrastructure Networks (LSCLINs). The core idea for working on Road Networks is to clean the currently available data and make the road networks available in a digitized format on which network science-based applications such as Resilience management, Centrality measures, and Spread pattern analysis, etc. can be performed and information can be gathered and analyzed.
As the pandemic struck, we were focused towards developing Ahmedabad City Road Network and analyze it according to the lockdown situation and indeed, making a city-scale expandable product that helps the stakeholders to ease the process of controlling the COVID situation through various aspects including social-distancing and testing during and after the lockdown.
We came up with a product that analyses the traffic demand of the city using the Gravity model and identifies the most critical road junctions and road lengths of highest centrality measures that share close proximity to high-density residential pockets.
## Key Contributions
·       We provide a methodology of building complex and expandable Road Networks considering the population and traffic congestion.
·       We developed and calibrated a model to evaluate traffic parameters without real-time congestion data.
·       City Hotspots!
# METHODOLOGY
We came up with a product that analyses the traffic demand of the city using the gravity model and predicts the most important nodes in the road network of the city.

Mapping from AMC roads shapefiles to network nodes and links:
Firstly we generate a networkx Graph from the shapefiles where the point geometries are translated into the nodes and lines into the edges of the network. We are able to extract the following attributes of each road junction and segment.
Node Attributes:
Latitude and Longitude (‘ Coordinates ’)
Edge Attributes:
Length of each road (‘ LENGTH ’)
Category of the road (‘ CAT ’):
Arterial
Subarterial
Collector
NH (National Highway)
SH (State Highway)
Village Roads
Others
Start and End Point Coordinates of the line geometries.
Since the travel time of each road is an important factor for the use of that road, we prefer to add that attribute with the help of the max speed allowed on that category of road and the length of that road.
	
Population Assignment to each Node:
For each intersection in the Road Network, we estimate the number of people served by that particular intersection using the Ward-wise Population data of the Ahmedabad Census. We create the Population spread map with that data and then use the following algorithm to assign each node their population density:




Traffic Demand Forecasting:
READ THE TRAFFIC DEMAND PDF AND WRITE EVERYTHING NECESSARY TO DEFINE THE TRIF DISTRIBUTION FORMULA!!!
Trip Distribution Formula:
Tij= Pi* Pje-aCijPje-aCij
Tij = The number of trips produced in the zone i and attracted to zone j
Pij = The total number of trips produced in the zone i
a = Calibrated parameter
Cij = Travel time between pair of zones i & j 




Network Analysis: Node and Edge importance rank
Network analysis can be used to estimate complex patterns and relationships in the network structure and analyze them to understand the core features of the network.
Centrality, being one of the most important and widely used is a conceptual tool for analyzing networks. It helps us in finding the most critical nodes in a network.
Since the road networks include a flow of commuters along its edges and assuming that people tend to optimize their commute path by taking the shortest path, the Betweenness centrality measure can give us the most critical junctions of the city.
To calculate the betweenness centrality of each node, we take every origin-destination pair of the Road network and count the number of times that node is present in the shortest paths (weighted using the trip count on each path) between the origin-destination pair. The junctions are thus ranked according to this centrality value.
These ranks identify the hotspots of the city that share close proximity to high-density residential pockets taking into consideration the Commuter flow.



# Scenario Generation and Analysis
We believed that after the lockdown was lifted, the bigger challenge would be the recovery and also, handling that challenge with the current challenge of diminishing the spread would be difficult.
As cities prepare to open after current lockdowns, the recovery strategies have to account for social distancing, congestion-free transits, and unusual traffic patterns, these cities would witness with red and containment zones declared as a no-travel zone.
In such cases, our network can disseminate information about potential congestion zones and possible reroutings under different containment scenarios to the stakeholders.
For eg: If a particular ward of the city needs to be in a strict lockdown zone and in the rest, the transits are allowed, we can remove all the nodes from our network that belong to that ward and recalculate the Node importance parameters, the Centrality ranks and the trip count attribute on each road to identify potential congestion zones which would need utmost attention of the stakeholders.
For policymakers and administrators, this tool can help simulate the rate of COVID-19 spread in various zones of a city under different lockdown strategies that have been implemented or under consideration to apply. 
The tool can also be used to provide information to the stakeholders about the most critical intersections in the city if the city decides to implement “drive-through testing”. It can simulate post-lockdown congestions on various intersections across the city of Ahmedabad under different partial lockdown scenarios.

## Final Product Can be seen here:
http://covid19.iitgn.ac.in/
We students of IIT Gandhinagar under guidance of Prof. Udit Bhatia has made this site where you can see our both aspects of work.(Map and Spread Model).

Our site was covered in national and international media and has been adopted by various scientists of Germany and Africa. 

## Here is the video of introduction and benefits of tool.
[![Product Intro and Benefits](https://img.youtube.com/vi/G3o7exHNNHg/0.jpg)](https://www.youtube.com/watch?v=G3o7exHNNHg)

## Below video has the detailed instructions of how to use tool.

[![Product Demo](https://img.youtube.com/vi/pMyrCiVDBdE/0.jpg)](https://www.youtube.com/watch?v=pMyrCiVDBdE)



# Acknowledgments
https://github.com/ryansmcgee/seirsplus


