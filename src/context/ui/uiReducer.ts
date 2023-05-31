import { UiState } from './'


type UiActionType = 
    | { type:'[UI] - Toggle Theme', payload: string }
    | { type:'[UI] - Open Sidebar', payload: boolean}
    | { type:'[UI] - Close Sidebar', payload: boolean}


/* 
    Reducer para el contexto de UI
    @param {UiState} state - Estado del contexto
    @param {UiActionType} action - Acción a ejecutar
*/
export const uiReducer = (state: UiState, action: UiActionType): UiState => {
    switch(action.type) {
        case '[UI] - Toggle Theme':
            return {
                ...state,
                theme: action.payload
            }
        
        case '[UI] - Open Sidebar':
            return {
                ...state,
                sidebar: action.payload
            }
        
        case '[UI] - Close Sidebar':
            return {
                ...state,
                sidebar: action.payload
            }

        default:
            return state; 
    }
}