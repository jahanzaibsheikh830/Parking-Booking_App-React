let initialState = {
    loginUser: null,
    loginStatus: false,
    role: null
}
const addUser = (state = initialState, action) =>{
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