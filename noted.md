Correct the export dialog so that there would be a props of feilds instead of default feilds, when some feilds are selected e.g department and their value are being inputed they should query the backend(fetchData(feildName)) to get the departments based on that value and then display a dropdown for the user to select a correct value making that feild more safe, they should all be controllable with props


A route that i can you to search eather from a specific feild or from all feilds in the backend

{
    feilds: [],
    search_term: "",
    limit: 10
}
Create a function that allows me to reuse the logic all over my backend such as /faculty, /department etc
Also create a default limit in case none is being provided in the request
An object that contains all routes using the function and the configoration on what feilds and everything needed to use the funcvtion
The function should then get the data from mongodb
Also Make availability for error handling