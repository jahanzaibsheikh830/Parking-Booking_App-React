let initialState = {
    loginUser: null,
    loginStatus: false,
    role: null
}
console.log(initialState)
const addUser = (state = initialState, action) =>{
    console.log(action.payload)
    switch(action.type){
        case "ADD_USER": 
        return{
            ...action.payload,
            // ...state
        }
        default: return state
    }
}

export default addUser